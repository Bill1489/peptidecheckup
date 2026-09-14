import type { Compound, MedicationClassId } from "@/data/types";
import {
  EVIDENCE_RANK,
  FAMILY_LABELS,
  HUMAN_EVIDENCE_LABELS,
  JURISDICTION_LABELS,
  REGULATORY_LABELS,
} from "@/data/types";
import { CONDITION_MAP } from "@/data/conditions";
import { MEDICATION_CLASS_MAP } from "@/data/medications";
import { OTC_LABELS, type OtcCategory } from "@/lib/assessment/types";
import { SUITABILITY_DESCRIPTIONS, type CompoundReport, type Flag, type FlagSeverity, type GoalAlignment, type Suitability } from "../types";
import { type EngineContext, REGULATED_SOURCES, UNREGULATED_SOURCES } from "../context";
import { GOAL_ALIGNMENT_LABELS, flagId, joinList, lc } from "../labels";
import type { DoseEvaluation } from "./dose";

/* ------------------------------------------------------------------ */
/* Goal alignment                                                      */
/* ------------------------------------------------------------------ */

export function goalAlignmentFor(ctx: EngineContext, compound: Compound): GoalAlignment {
  if (!ctx.goal) return "partial";
  const entry = compound.goals.find((g) => g.goal === ctx.goal);
  if (!entry) return "not_aligned";
  return EVIDENCE_RANK[entry.evidence] >= EVIDENCE_RANK.limited ? "aligned" : "partial";
}

/* ------------------------------------------------------------------ */
/* Compound-specific flags                                             */
/* ------------------------------------------------------------------ */

const INTERACTION_SEVERITY: Record<Compound["interactions"][number]["severity"], FlagSeverity> = {
  major: "high",
  moderate: "caution",
  minor: "info",
};

/** Over-the-counter categories → medication classes to check against `compound.interactions`. */
const OTC_CLASSES: Record<OtcCategory, MedicationClassId[]> = {
  painkillers: ["nsaid", "opioid"],
  acid_reducers: ["acid_reducer"],
  antihistamines: ["antihistamine"],
  sleep_aids: ["benzodiazepine_sedative"],
  other: [],
};

function normaliseClass(classId: MedicationClassId | undefined): MedicationClassId | undefined {
  if (!classId) return undefined;
  return classId === "levothyroxine_like" ? "thyroid_hormone" : classId;
}

export interface CompoundRuleResult {
  flags: Flag[];
  /** Clinician questions derived from the flags raised (specific to this person) */
  questions: string[];
}

export function compoundRules(ctx: EngineContext, compound: Compound): CompoundRuleResult {
  const { answers: a, jurisdiction } = ctx;
  const flags: Flag[] = [];
  const questions: string[] = [];
  const slug = compound.slug;
  const jurisdictionLabel = JURISDICTION_LABELS[jurisdiction];
  const inLabel = jurisdiction === "OTHER" ? "your jurisdiction" : `the ${jurisdictionLabel}`;

  /* ---------------- Regulatory ---------------- */
  const reg = compound.regulatory[jurisdiction];
  switch (reg.status) {
    case "not_authorised":
      flags.push({
        id: flagId(slug, "regulatory", "not-authorised"),
        severity: "caution",
        source: "regulatory",
        title: `Not authorised as a medicine in ${inLabel}`,
        detail: `${reg.summary}${reg.detail ? ` ${reg.detail}` : ""} Products sold outside a marketing authorisation are not manufactured or tested to medicine standards.`,
        compounds: [slug],
      });
      questions.push(`Is there an authorised option for ${lc(ctx.goalLabel)} that I could discuss instead of ${compound.name}?`);
      break;
    case "investigational":
      flags.push({
        id: flagId(slug, "regulatory", "investigational"),
        severity: "info",
        source: "regulatory",
        title: "Investigational — only available legitimately inside a clinical trial",
        detail: `${reg.summary}${reg.detail ? ` ${reg.detail}` : ""}`,
        compounds: [slug],
      });
      break;
    case "unclear":
      flags.push({
        id: flagId(slug, "regulatory", "unclear"),
        severity: "info",
        source: "regulatory",
        title: `Regulatory status unclear in ${inLabel}`,
        detail: `${reg.summary}${reg.detail ? ` ${reg.detail}` : ""}`,
        compounds: [slug],
      });
      break;
    case "authorised":
      if (a.prescribed === "no" && (!a.source || !REGULATED_SOURCES.includes(a.source))) {
        flags.push({
          id: flagId(slug, "regulatory", "no-prescription"),
          severity: "caution",
          source: "regulatory",
          title: "Authorised medicine being obtained without a prescription",
          detail: `${compound.name} is an authorised, prescription-only medicine in ${inLabel}. Obtaining it without a prescription means the product sits outside the regulated supply chain, so its identity, dose and storage cannot be assured, and no prescriber is monitoring its use.`,
          compounds: [slug],
        });
      }
      break;
  }

  /* ---------------- Contraindications (medical history) ---------------- */
  for (const c of compound.contraindications) {
    const status = a.conditions[c.conditionId];
    if (!status || status === "none") continue;
    const label = CONDITION_MAP[c.conditionId]?.label ?? c.conditionId;
    if (status === "unsure") {
      flags.push({
        id: flagId(slug, "medical", c.conditionId, "unsure"),
        severity: "caution",
        source: "medical",
        title: `Unsure about ${lc(label)} — clarify with a clinician`,
        detail: `${c.note} Because you were unsure whether this applies to you, it is worth clarifying before any decision.`,
        compounds: [slug],
      });
      continue;
    }
    flags.push({
      id: flagId(slug, "medical", c.conditionId, status),
      severity: c.severity === "absolute" ? "high" : "caution",
      source: "medical",
      title: `${label} (${status === "current" ? "current" : "previous"})`,
      detail: c.note,
      compounds: [slug],
    });
    questions.push(`Does my history of ${lc(label)} change whether ${compound.name} is appropriate to discuss?`);
  }

  /* ---------------- Pregnancy (compound-level) ---------------- */
  if (a.pregnancy === "yes") {
    const p = compound.pregnancy;
    if (p.status === "contraindicated" || p.status === "not_recommended") {
      flags.push({
        id: flagId(slug, "pregnancy", p.status),
        severity: "high",
        source: "pregnancy",
        title: `${compound.name}: ${p.status === "contraindicated" ? "contraindicated" : "not recommended"} in pregnancy or breastfeeding`,
        detail: p.note,
        compounds: [slug],
      });
      questions.push(
        `What would need to be true about my pregnancy or breastfeeding plans before ${compound.name} could even be discussed?`,
      );
    } else if (p.status === "insufficient_data") {
      flags.push({
        id: flagId(slug, "pregnancy", p.status),
        severity: "caution",
        source: "pregnancy",
        title: `${compound.name}: no safety data in pregnancy or breastfeeding`,
        detail: p.note,
        compounds: [slug],
      });
    }
  }

  /* ---------------- Prescription interactions ---------------- */
  const byClass = new Map<MedicationClassId, string[]>();
  for (const p of a.prescriptions) {
    const cls = normaliseClass(p.classId);
    if (!cls || cls === "other") continue; // reported once, globally
    const names = byClass.get(cls) ?? [];
    const name = p.name.trim() || MEDICATION_CLASS_MAP[cls].label;
    if (!names.includes(name)) names.push(name);
    byClass.set(cls, names);
  }
  for (const [cls, names] of byClass) {
    const interaction = compound.interactions.find((i) => i.classId === cls);
    if (!interaction) continue;
    flags.push({
      id: flagId(slug, "medication", cls),
      severity: INTERACTION_SEVERITY[interaction.severity],
      source: "medication",
      title: `Interaction: ${joinList(names)} — ${MEDICATION_CLASS_MAP[cls].label}`,
      detail: interaction.note,
      compounds: [slug],
    });
    questions.push(`How would ${joinList(names)} need adjusting if I discussed ${compound.name}?`);
  }

  /* ---------------- Over-the-counter categories ---------------- */
  for (const category of a.otc) {
    for (const cls of OTC_CLASSES[category]) {
      const interaction = compound.interactions.find((i) => i.classId === cls);
      if (!interaction) continue;
      flags.push({
        id: flagId(slug, "medication", "otc", category, cls),
        severity: interaction.severity === "minor" ? "info" : "caution",
        source: "medication",
        title: `Over-the-counter ${lc(OTC_LABELS[category])}: possible interaction (${lc(MEDICATION_CLASS_MAP[cls].label)})`,
        detail: interaction.note,
        compounds: [slug],
      });
    }
  }

  /* ---------------- Evidence base ---------------- */
  if (compound.humanEvidenceLevel === "preclinical_only") {
    flags.push({
      id: flagId(slug, "information", "preclinical"),
      severity: "caution",
      source: "information",
      title: "No human efficacy trials — animal and laboratory data only",
      detail: `${compound.name} has not been tested for efficacy in human trials. Effects, doses and adverse events reported online are extrapolated from animal or laboratory work, or are anecdotal.`,
      compounds: [slug],
    });
  } else if (compound.humanEvidenceLevel === "early_clinical") {
    flags.push({
      id: flagId(slug, "information", "early-clinical"),
      severity: "info",
      source: "information",
      title: "Early-stage human data only",
      detail: `Human evidence for ${compound.name} comes from phase 1 or small phase 2 studies. Findings at this stage frequently change as larger trials report.`,
      compounds: [slug],
    });
  }

  return { flags, questions };
}

/* ------------------------------------------------------------------ */
/* Suitability decision                                                */
/* ------------------------------------------------------------------ */

export interface SuitabilityDecision {
  suitability: Suitability;
  rationale: string;
}

const SEVERITY_ORDER: Record<FlagSeverity, number> = { high: 0, caution: 1, info: 2 };

export function sortFlags(flags: Flag[]): Flag[] {
  return [...flags].sort((x, y) => SEVERITY_ORDER[x.severity] - SEVERITY_ORDER[y.severity]);
}

function topFlagTitles(flags: Flag[], n = 2): string[] {
  return sortFlags(flags.filter((f) => f.severity !== "info"))
    .slice(0, n)
    .map((f) => f.title);
}

/**
 * Decide the suitability label for one compound.
 * `flags` must include every flag that applies to this compound: compound-specific,
 * global (compounds: []), and stack flags naming it.
 *
 * Order of precedence:
 *  1. any "high" flag → higher_concern (a safety signal is never hidden behind missing information)
 *  2. medical or medicines section missing, or age/country missing → insufficient_information
 *  3. ≥ 2 caution flags, or (not authorised + preclinical only + unregulated/undecided source) → higher_concern
 *  4. goal alignment other than not_aligned → potentially_relevant
 *  5. otherwise → insufficient_information ("not typically researched for your goal")
 */
export function decideSuitability(
  ctx: EngineContext,
  compound: Compound,
  flags: Flag[],
  alignment: GoalAlignment,
): SuitabilityDecision {
  const { answers: a, jurisdiction } = ctx;
  const highs = flags.filter((f) => f.severity === "high");
  const cautions = flags.filter((f) => f.severity === "caution");

  if (highs.length > 0) {
    return {
      suitability: "higher_concern",
      rationale: `${SUITABILITY_DESCRIPTIONS.higher_concern} The main factors identified: ${joinList(
        topFlagTitles(flags),
      )}.`,
    };
  }

  const missing: string[] = [];
  if (!ctx.isComplete("medical")) missing.push("medical history");
  if (!ctx.isComplete("medications")) missing.push("medicines & substances");
  if (a.age === undefined) missing.push("age");
  if (!a.countryCode) missing.push("country");
  if (missing.length > 0) {
    return {
      suitability: "insufficient_information",
      rationale: `${SUITABILITY_DESCRIPTIONS.insufficient_information} Complete the following to allow a fuller assessment: ${joinList(
        missing,
      )}.${cautions.length > 0 ? ` Already noted for discussion: ${joinList(topFlagTitles(flags))}.` : ""}`,
    };
  }

  const unregulatedOrUndecided = !a.source || UNREGULATED_SOURCES.includes(a.source) || a.source === "undecided";
  const triad =
    compound.regulatory[jurisdiction].status === "not_authorised" &&
    compound.humanEvidenceLevel === "preclinical_only" &&
    unregulatedOrUndecided;

  if (cautions.length >= 2 || triad) {
    return {
      suitability: "higher_concern",
      rationale: `${SUITABILITY_DESCRIPTIONS.higher_concern} ${
        triad && cautions.length < 2
          ? `${compound.name} is not authorised as a medicine in ${
              jurisdiction === "OTHER" ? "your jurisdiction" : `the ${JURISDICTION_LABELS[jurisdiction]}`
            }, has no human efficacy trials, and would be obtained outside a regulated supply route.`
          : `The main factors identified: ${joinList(topFlagTitles(flags))}.`
      }`,
    };
  }

  if (alignment !== "not_aligned") {
    return {
      suitability: "potentially_relevant",
      rationale: `${SUITABILITY_DESCRIPTIONS.potentially_relevant} ${
        cautions.length > 0
          ? `Noted for discussion: ${joinList(topFlagTitles(flags))}.`
          : alignment === "partial"
            ? `Note that the evidence linking ${compound.name} to your goal is ${lc(GOAL_ALIGNMENT_LABELS.partial)}.`
            : "Your responses did not trigger any compound-specific flags; the general considerations in this report still apply."
      }`,
    };
  }

  const otherGoals = compound.goals.map((g) => g.goal);
  return {
    suitability: "insufficient_information",
    rationale: `${compound.name} is not typically researched for ${lc(ctx.goalLabel)}. The evidence in our database relates to ${
      otherGoals.length > 0 ? "other goals" : "no specific goal"
    }, so its relevance to yours cannot be assessed from published research.${
      cautions.length > 0 ? ` Also noted for discussion: ${joinList(topFlagTitles(flags))}.` : ""
    }`,
  };
}

/* ------------------------------------------------------------------ */
/* Ordering score                                                      */
/* ------------------------------------------------------------------ */

export function scoreCompound(ctx: EngineContext, compound: Compound, flags: Flag[], alignment: GoalAlignment): number {
  let score = 50;
  score += alignment === "aligned" ? 20 : alignment === "partial" ? 5 : -15;
  const goalEntry = ctx.goal ? compound.goals.find((g) => g.goal === ctx.goal) : undefined;
  score += EVIDENCE_RANK[goalEntry?.evidence ?? compound.overallEvidence] * 5;
  const status = compound.regulatory[ctx.jurisdiction].status;
  score += status === "authorised" ? 10 : status === "not_authorised" ? -10 : 0;
  for (const f of flags) {
    score += f.severity === "high" ? -25 : f.severity === "caution" ? -10 : -2;
  }
  return score;
}

/* ------------------------------------------------------------------ */
/* Assemble the CompoundReport                                          */
/* ------------------------------------------------------------------ */

/**
 * @param ownFlags     flags whose `compounds` names this slug (compound-specific + attached global/stack/dose flags)
 * @param globalFlags  flags with `compounds: []` (apply to everything)
 * @param dose         the dose evaluation already computed for this compound
 * @param derivedQuestions clinician questions derived from this compound's flags
 */
export function buildCompoundReport(
  ctx: EngineContext,
  compound: Compound,
  ownFlags: Flag[],
  globalFlags: Flag[],
  dose: DoseEvaluation,
  derivedQuestions: string[],
): CompoundReport {
  const allFlags = [...ownFlags, ...globalFlags];
  const alignment = goalAlignmentFor(ctx, compound);
  const goalEntry = ctx.goal ? compound.goals.find((g) => g.goal === ctx.goal) : undefined;
  const decision = decideSuitability(ctx, compound, allFlags, alignment);
  const questions = [...derivedQuestions];
  if (dose.comparison.verdict === "above_range") {
    questions.push(`Why would a dose above the published study range be considered for ${compound.name}, and what are the risks?`);
  }

  return {
    slug: compound.slug,
    name: compound.name,
    classLabel: compound.classLabel,
    familyLabel: FAMILY_LABELS[compound.family],
    tagline: compound.tagline,
    lastReviewed: compound.lastReviewed,
    goalAlignment: alignment,
    goalEvidence: goalEntry?.evidence,
    goalEvidenceSummary: goalEntry?.summary,
    overallEvidence: compound.overallEvidence,
    humanEvidenceLabel: HUMAN_EVIDENCE_LABELS[compound.humanEvidenceLevel],
    regulatory: compound.regulatory[ctx.jurisdiction],
    wadaProhibited: compound.wadaProhibited,
    suitability: decision.suitability,
    suitabilityRationale: decision.rationale,
    flags: sortFlags(ownFlags),
    dosingResearch: compound.dosingResearch,
    dosingResearchNote: compound.dosingResearchNote,
    doseComparison: dose.comparison,
    monitoring: [...compound.monitoring],
    clinicianQuestions: Array.from(new Set([...questions, ...compound.clinicianQuestions])),
    score: scoreCompound(ctx, compound, allFlags, alignment),
  };
}

/** Human-readable regulatory status sentence, used in alternatives. */
export function regulatorySentence(compound: Compound, ctx: EngineContext): string {
  const status = compound.regulatory[ctx.jurisdiction].status;
  const where = ctx.jurisdiction === "OTHER" ? "your jurisdiction" : `the ${JURISDICTION_LABELS[ctx.jurisdiction]}`;
  return `${REGULATORY_LABELS[status]} in ${where}`;
}
