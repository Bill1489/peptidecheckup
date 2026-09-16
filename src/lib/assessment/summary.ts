import { getCompound } from "@/data/compounds";
import { CONDITION_MAP } from "@/data/conditions";
import { COUNTRY_MAP } from "@/data/countries";
import { GOAL_MAP } from "@/data/goals";
import { ROUTE_LABELS, type ConditionId, type DoseFrequency } from "@/data/types";
import { bmi } from "@/lib/utils";
import { formatHeight, formatWeight, jurisdictionLabel } from "./derived";
import type { Step } from "./flow";
import {
  ADVERSE_LABELS,
  ALCOHOL_LABELS,
  DURATION_LABELS,
  IMPORTANCE_LABELS,
  INFLUENCE_LABELS,
  NICOTINE_LABELS,
  OTC_LABELS,
  RECREATIONAL_LABELS,
  REPORT_WANTS,
  SECTION_META,
  SECTION_ORDER,
  SOURCE_LABELS,
  TIMEFRAME_LABELS,
  type AssessmentAnswers,
  type ConsideredCompound,
  type SectionId,
} from "./types";

/**
 * Builds the grouped summary shown on the review screen. Each row points at
 * the step it came from so "Edit" can jump straight there.
 */

export interface ReviewRow {
  stepId: Step["id"];
  label: string;
  value: string;
}

export type ReviewStatus = "complete" | "skipped" | "in_progress" | "not_started";

export interface ReviewSection {
  id: SectionId;
  title: string;
  optional: boolean;
  status: ReviewStatus;
  rows: ReviewRow[];
}

const YES_NO_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  na: "Not applicable",
  unsure: "Unsure",
  not_sure: "Not sure yet",
  prefer_not: "Prefer not to say",
};

export const DOSE_FREQUENCY_LABELS: Record<DoseFrequency, string> = {
  once: "Once",
  daily: "Once daily",
  twice_daily: "Twice daily",
  three_times_daily: "Three times daily",
  weekly: "Once weekly",
  twice_weekly: "Twice weekly",
  monthly: "Monthly",
  other: "Other",
};

export function compoundName(slug: string): string {
  return getCompound(slug)?.name ?? slug;
}

export function formatDose(c: ConsideredCompound): string | undefined {
  const d = c.dose;
  if (!d || d.amount === undefined) return undefined;
  const parts = [`${d.amount}${d.unit ? ` ${d.unit}` : ""}`];
  if (d.frequency) parts.push(DOSE_FREQUENCY_LABELS[d.frequency].toLowerCase());
  if (d.route) parts.push(ROUTE_LABELS[d.route].toLowerCase());
  return parts.join(", ");
}

function yn(v?: string): string | undefined {
  return v ? YES_NO_LABELS[v] ?? v : undefined;
}

function withDetails(v?: string, details?: string): string | undefined {
  const base = yn(v);
  if (!base) return undefined;
  return details?.trim() ? `${base} — ${details.trim()}` : base;
}

function row(stepId: string, label: string, value: string | undefined | null): ReviewRow | null {
  return value ? { stepId, label, value } : null;
}

function compact(rows: (ReviewRow | null)[]): ReviewRow[] {
  return rows.filter((r): r is ReviewRow => r !== null);
}

function rowsFor(section: SectionId, a: AssessmentAnswers): ReviewRow[] {
  switch (section) {
    case "goals": {
      const goal = a.primaryGoal ? GOAL_MAP[a.primaryGoal]?.label : undefined;
      return compact([
        row(
          "goal",
          "Primary goal",
          goal ? (a.primaryGoal === "other" && a.otherGoalText ? `${goal} — ${a.otherGoalText}` : goal) : undefined,
        ),
        row("success", "What success looks like", a.successDescription?.trim()),
        row("importance", "Importance", a.importance ? IMPORTANCE_LABELS[a.importance] : undefined),
        row("timeframe", "Timeframe", a.timeframe ? TIMEFRAME_LABELS[a.timeframe] : undefined),
      ]);
    }
    case "considering": {
      const names = a.consideredCompounds.map((c) => compoundName(c.slug));
      if (a.otherCompoundText?.trim()) names.push(`Other: ${a.otherCompoundText.trim()}`);
      const doses = a.consideredCompounds
        .map((c) => {
          const d = formatDose(c);
          return d ? `${compoundName(c.slug)} — ${d}` : null;
        })
        .filter((x): x is string => Boolean(x));
      return compact([
        row("compounds", "Compounds", names.length ? names.join(", ") : undefined),
        row("doses", "Doses considered", doses.length ? doses.join("; ") : undefined),
        row("currently-taking", "Currently taking", yn(a.currentlyTaking)),
        row("multiple", "Considering more than one", yn(a.consideringMultiple)),
        row(
          "combinations",
          "Combination",
          a.combinations[0]?.length ? a.combinations[0].map(compoundName).join(" + ") : undefined,
        ),
        row("why", "Why these compounds", a.whyChosen?.trim()),
        row(
          "why",
          "Where the idea came from",
          a.influence?.length ? a.influence.map((i) => INFLUENCE_LABELS[i]).join(", ") : undefined,
        ),
      ]);
    }
    case "basics": {
      const country = a.countryCode ? COUNTRY_MAP[a.countryCode] : undefined;
      const b = bmi(a.heightCm, a.weightKg);
      return compact([
        row("age", "Age", a.age ? `${a.age}` : undefined),
        row("sex", "Sex", a.sex ? { female: "Female", male: "Male", prefer_not: "Prefer not to say" }[a.sex] : undefined),
        row("body", "Height", formatHeight(a.heightCm, a.unitSystem) || undefined),
        row("body", "Weight", formatWeight(a.weightKg, a.unitSystem) || undefined),
        row("body", "BMI", b ? `${b}` : undefined),
        row(
          "country",
          "Country",
          country ? `${country.name} · Regulatory view: ${jurisdictionLabel(country.code)}` : undefined,
        ),
        row("pregnancy", "Pregnant, trying or breastfeeding", yn(a.pregnancy)),
      ]);
    }
    case "medical": {
      const reported = (Object.entries(a.conditions) as [ConditionId, string][])
        .filter(([, status]) => status && status !== "none")
        .map(([id, status]) => `${CONDITION_MAP[id]?.label ?? id} (${status})`);
      return compact([
        row(
          "conditions",
          "Conditions",
          reported.length ? reported.join("; ") : a.completedSections.includes("medical") ? "None reported" : undefined,
        ),
        row("conditions", "Other condition", a.conditionOtherText?.trim()),
        row("surgery", "Relevant surgery", withDetails(a.relevantSurgery, a.surgeryDetails)),
        row("symptoms", "Current symptoms", withDetails(a.currentSymptoms, a.symptomsDetails)),
      ]);
    }
    case "medications": {
      const rx = a.prescriptions
        .filter((p) => p.name.trim())
        .map((p) => (p.strength?.trim() ? `${p.name.trim()} ${p.strength.trim()}` : p.name.trim()));
      const otc = a.otc.map((o) => (o === "other" && a.otcOtherText?.trim() ? a.otcOtherText.trim() : OTC_LABELS[o]));
      const supp = a.supplements.filter((s) => s.name.trim()).map((s) => s.name.trim());
      return compact([
        row(
          "prescriptions",
          "Prescription medicines",
          a.takesPrescription === "no" ? "None" : rx.length ? rx.join(", ") : undefined,
        ),
        row("otc", "Over-the-counter", otc.length ? otc.join(", ") : undefined),
        row("supplements", "Supplements", a.takesSupplements === "no" ? "None" : supp.length ? supp.join(", ") : undefined),
        row(
          "recreational",
          "Recreational substances",
          a.recreational
            ? a.recreationalDetails?.trim()
              ? `${RECREATIONAL_LABELS[a.recreational]} — ${a.recreationalDetails.trim()}`
              : RECREATIONAL_LABELS[a.recreational]
            : undefined,
        ),
        row("alcohol", "Alcohol", a.alcohol ? ALCOHOL_LABELS[a.alcohol] : undefined),
        row("nicotine", "Nicotine", a.nicotine ? NICOTINE_LABELS[a.nicotine] : undefined),
      ]);
    }
    case "experience": {
      const uses = a.previousUses
        .filter((u) => u.name.trim())
        .map((u) => {
          const bits = [u.name.trim()];
          if (u.duration) bits.push(DURATION_LABELS[u.duration].toLowerCase());
          if (u.adverse) bits.push(`adverse effects: ${ADVERSE_LABELS[u.adverse].toLowerCase()}`);
          if (u.stoppedDueToAdverse === "yes") bits.push("stopped because of them");
          if (u.supervised) bits.push(u.supervised === "yes" ? "supervised" : "unsupervised");
          return bits.join(", ");
        });
      return compact([
        row("previous-use", "Used a peptide before", a.previousPeptideUse === "no" ? "No" : uses.length ? uses.join("; ") : yn(a.previousPeptideUse)),
        row("stopped-ineffective", "Stopped a treatment as ineffective", yn(a.stoppedIneffective)),
      ]);
    }
    case "source":
      return compact([
        row(
          "source",
          "Where you'd obtain it",
          a.source
            ? a.source === "other" && a.sourceOtherText?.trim()
              ? `${SOURCE_LABELS[a.source]} — ${a.sourceOtherText.trim()}`
              : SOURCE_LABELS[a.source]
            : undefined,
        ),
        row("prescribed", "Prescribed to you", yn(a.prescribed)),
        row("authorised", "Authorised in your country", yn(a.authorisedKnown)),
        row("quality-docs", "Independent quality documentation", yn(a.qualityDocs)),
      ]);
    case "risk":
      return compact([
        row("serious-allergy", "Serious allergic reaction to a medicine", yn(a.seriousAllergy)),
        row("component-allergy", "Allergy to a component", yn(a.componentAllergy)),
        row("previous-reaction", "Previous serious reaction to a similar treatment", yn(a.previousSeriousReaction)),
        row("severe-symptoms", "Unexplained or severe symptoms", yn(a.severeSymptoms)),
        row("advised-against", "Advised not to use this type of treatment", yn(a.advisedAgainst)),
        row("under-investigation", "Under investigation", yn(a.underInvestigation)),
        row("interacting-treatment", "Treatment that could interact", yn(a.interactingTreatment)),
        row("risk-details", "Details", a.riskDetails?.trim()),
      ]);
    case "wants":
      return compact([
        row(
          "report-wants",
          "Report focus",
          a.reportWants.length
            ? a.reportWants.map((w) => REPORT_WANTS.find((r) => r.id === w)?.label ?? w).join("; ")
            : undefined,
        ),
        row(
          "contact",
          "Professional review",
          a.contactConsent
            ? `Yes — ${a.contactEmail ?? ""}${a.contactName ? ` (${a.contactName})` : ""}`
            : a.completedSections.includes("wants")
              ? "Not requested"
              : undefined,
        ),
      ]);
    case "final":
      return compact([row("anything-else", "Anything else", a.anythingElse?.trim())]);
    default:
      return [];
  }
}

export function buildReview(a: AssessmentAnswers): ReviewSection[] {
  return SECTION_ORDER.map((id) => {
    const rows = rowsFor(id, a);
    let status: ReviewStatus;
    if (a.completedSections.includes(id)) status = "complete";
    else if (a.skippedSections.includes(id)) status = "skipped";
    else if (rows.length) status = "in_progress";
    else status = "not_started";
    const meta = SECTION_META[id];
    return { id, title: meta.title, optional: meta.optional, status, rows };
  });
}
