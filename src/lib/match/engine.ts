import { getCompound, getStackNote } from "@/data/compounds";
import { GOAL_MAP } from "@/data/goals";
import { PRODUCTS, purchasable, type Product } from "@/data/products";
import {
  EVIDENCE_LABELS,
  EVIDENCE_RANK,
  JURISDICTION_LABELS,
  REGULATORY_LABELS,
  type Compound,
  type EvidenceQuality,
  type GoalId,
  type RegulatoryStatus,
} from "@/data/types";
import { productCompoundSlugs, RANGE_COMPOUND_SLUGS, selectedProducts } from "@/lib/assessment/derived";
import { FOCUS_DEFS, FOCUS_NONE, goalProblemLabel, isFocusId, type FocusId } from "@/lib/assessment/flow";
import type { AssessmentAnswers } from "@/lib/assessment/types";
import { BRAND } from "@/lib/brand";
import { generateReport, isPersonSpecific, sortFlags, type CompoundReport, type Flag, type Report } from "@/lib/engine";
import type { MatchReason, MatchResult, MatchVerdict, ProductMatch, ScoreBreakdown } from "./types";

/**
 * Deterministic product matcher. Takes the answers and the rules-engine
 * report, scores each of the six pens 0–100 against the goal, focus areas,
 * evidence and format, then lets the report decide whether a pen may be
 * matched at all: a high-severity flag or a Higher concern label on any
 * component makes it `not_recommended`, a person-specific caution makes it
 * `match_with_review`. Every number and sentence here is derived from the
 * answers, the catalogue and the compound database — nothing is generated.
 */

/* ------------------------------------------------------------------ */
/* Weights                                                             */
/* ------------------------------------------------------------------ */

const GOAL_POINTS = 40;
const SECONDARY_GOAL_POINTS = 20;
const FOCUS_CAP = 25;
/** Evidence bonus = rank × EVIDENCE_STEP: strong 10 · moderate 8 · limited 6 · preliminary 4 · insufficient 2. */
const EVIDENCE_STEP = 2;
const EXPERIENCE_POINTS = 5;
const WADA_PENALTY = 15;
/** Nothing in the range is researched for sleep — no pen may score above this for a sleep goal. */
const SLEEP_CAP = 30;
/** Minimum score for a pen to be called the match. */
export const PRIMARY_MIN_SCORE = 35;
/** Minimum score for a pen to be listed as "also considered". */
const ALTERNATIVE_MIN_SCORE = 30;
const MAX_ALTERNATIVES = 2;
const MAX_CAUTIONS = 3;
/** Fit reasons before the regulatory line (which is always appended): 2–4 per product. */
const MAX_CORE_REASONS = 4;

/** Goals for which no pen in the range is researched — the matcher answers honestly instead of stretching. */
const UNSERVED_GOALS: GoalId[] = ["sleep", "sexual_health"];

interface FocusWeight {
  points: number;
  /** Plain-English "why" shown as a focus reason. */
  why: string;
}

/**
 * Focus area → pen weights and the transparent reason for each. Points are
 * summed per pen across the focus areas the user picked and capped at 25.
 * Focus areas with no entry are honest gaps: nothing in the range is
 * researched for them, and the result says so.
 */
export const FOCUS_WEIGHTS: Record<FocusId, Partial<Record<string, FocusWeight>>> = {
  belly_fat: {
    tesamorelin: {
      points: 12,
      why: "You picked belly fat that will not move — tesamorelin is the compound in the range researched for visceral (deep abdominal) fat.",
    },
  },
  overall_weight: {
    tesamorelin: {
      points: 6,
      why: "Overall weight — tesamorelin's trials measured abdominal fat rather than weight on the scales, so this is a body-composition fit, not a weight-loss one.",
    },
    "mots-c": {
      points: 6,
      why: "Overall weight — MOTS-c is studied for metabolic regulation, almost entirely in animal models so far.",
    },
  },
  muscle_preserve: {
    tesamorelin: {
      points: 8,
      why: "Keeping muscle while losing fat — tesamorelin trials reported reduced visceral fat with lean mass preserved.",
    },
  },
  metabolic: {
    "mots-c": {
      points: 10,
      why: "Metabolic health — MOTS-c is the mitochondrial peptide in the range, studied for metabolic regulation (early, mostly animal, evidence).",
    },
    tesamorelin: {
      points: 4,
      why: "Metabolic health — tesamorelin's abdominal-fat trials also tracked metabolic markers; it is not a metabolic medicine.",
    },
    nad: {
      points: 4,
      why: "Metabolic health — NAD+ is a coenzyme in cellular energy metabolism; human data are mostly for oral precursors.",
    },
  },
  tired_despite_sleep: {
    nad: {
      points: 12,
      why: "Tired despite sleeping — NAD+ is the coenzyme in the range tied to cellular energy metabolism; injectable data are limited.",
    },
    "mots-c": {
      points: 8,
      why: "Tired despite sleeping — MOTS-c is studied for metabolic energy and exercise capacity, mostly in animal models.",
    },
  },
  low_stamina: {
    "mots-c": {
      points: 12,
      why: "Stamina and endurance — MOTS-c is studied for exercise capacity, though not yet in human efficacy trials.",
    },
    nad: {
      points: 8,
      why: "Stamina — NAD+ levels fall with age; the human evidence is mainly for oral precursors and small intravenous studies.",
    },
  },
  brain_fog: {},
  post_illness: {
    nad: {
      points: 10,
      why: "Slow to recover after illness — NAD+ is matched on cellular energy; it is not a treatment for any illness.",
    },
  },
  recovery_between: {
    nad: { points: 8, why: "Recovery between sessions — NAD+ is the cellular-energy coenzyme in the range." },
    wolverine: {
      points: 8,
      why: "Recovery between sessions — BPC-157 and TB-500 are the repair peptides in the range, studied in animal models.",
    },
    "mots-c": { points: 4, why: "Recovery — MOTS-c is studied for exercise capacity in animal models." },
  },
  soreness: {
    wolverine: { points: 6, why: "Soreness that lingers — the repair blend; the evidence is animal data only." },
    nad: { points: 6, why: "Soreness that lingers — NAD+ is matched on cellular energy; it is not a painkiller." },
  },
  recurring: {
    wolverine: {
      points: 12,
      why: "Recurring strains — Wolverine is the repair blend, BPC-157 + TB-500, researched for tendon, ligament and muscle healing in animal models.",
    },
    klow: { points: 6, why: "Recurring strains — Klow carries the same two repair peptides alongside GHK-Cu and KPV." },
  },
  tendon: {
    wolverine: {
      points: 12,
      why: "A tendon injury — BPC-157 and TB-500 are the tendon-and-ligament repair peptides in the range (animal data only).",
    },
    klow: { points: 6, why: "A tendon injury — Klow carries BPC-157 and TB-500 alongside GHK-Cu and KPV." },
  },
  ligament: {
    wolverine: {
      points: 12,
      why: "A ligament injury — BPC-157 and TB-500 are the tendon-and-ligament repair peptides in the range (animal data only).",
    },
    klow: { points: 6, why: "A ligament injury — Klow carries BPC-157 and TB-500 alongside GHK-Cu and KPV." },
  },
  muscle_strain: {
    wolverine: { points: 10, why: "A muscle tear or strain — the repair blend, studied for muscle healing in animal models." },
    klow: { points: 6, why: "A muscle tear or strain — Klow carries the repair peptides with GHK-Cu and KPV alongside." },
  },
  joint: {
    wolverine: { points: 8, why: "A joint problem — the repair blend; joint evidence is from animal models only." },
    klow: { points: 4, why: "A joint problem — Klow carries the repair peptides; joint evidence is animal-model only." },
  },
  scars_marks: {
    klow: {
      points: 12,
      why: "Slow-healing marks or scars — Klow adds KPV, an anti-inflammatory fragment, and GHK-Cu to the two repair peptides.",
    },
    "ghk-cu": {
      points: 6,
      why: "Slow-healing marks — GHK-Cu is the copper peptide with topical wound-healing research behind it.",
    },
  },
  firmness: {
    "ghk-cu": {
      points: 12,
      why: "Firmness and fine lines — GHK-Cu is the copper tripeptide with small controlled topical studies on skin firmness.",
    },
    klow: { points: 6, why: "Firmness — Klow contains GHK-Cu, with the repair peptides and KPV alongside." },
  },
  texture: {
    "ghk-cu": {
      points: 12,
      why: "Texture and tone — GHK-Cu is the copper tripeptide with topical studies on skin texture and fine lines.",
    },
    klow: { points: 6, why: "Texture — Klow contains GHK-Cu, with the repair peptides and KPV alongside." },
  },
  irritation: {
    klow: {
      points: 12,
      why: "Redness or irritation-prone skin — Klow is the one pen with KPV, an anti-inflammatory α-MSH fragment.",
    },
  },
  hair_thinning: {
    "ghk-cu": {
      points: 12,
      why: "Hair thinning — GHK-Cu has preliminary topical hair studies; there are no injectable hair data.",
    },
  },
  shedding: {
    "ghk-cu": { points: 10, why: "Shedding — GHK-Cu has preliminary topical hair studies; there are no injectable hair data." },
  },
  energy: {
    nad: { points: 10, why: "Long-term energy — NAD+ is the cellular-energy coenzyme in the range; its levels decline with age." },
    "mots-c": { points: 8, why: "Long-term energy — MOTS-c is studied for metabolic regulation and healthy ageing in animal models." },
  },
  skin_ageing: {
    "ghk-cu": { points: 8, why: "Skin ageing — GHK-Cu is the copper tripeptide with topical studies on firmness and fine lines." },
    klow: { points: 4, why: "Skin ageing — Klow contains GHK-Cu alongside the repair peptides and KPV." },
  },
  repair: {
    nad: { points: 6, why: "Recovery and repair as you age — NAD+ is matched on cellular energy." },
    wolverine: { points: 6, why: "Recovery and repair as you age — the repair blend, studied in animal models." },
  },
  falling_asleep: {},
  staying_asleep: {},
  waking_unrefreshed: {},
};

const EVIDENCE_SHORT: Record<EvidenceQuality, string> = {
  strong: "multiple large trials or a licensed indication",
  moderate: "at least one well-conducted randomised trial",
  limited: "small or short human studies, or evidence for a related use",
  preliminary: "early-phase human data that still needs replication",
  insufficient: "animal or laboratory data only",
};

/* ------------------------------------------------------------------ */
/* Synthetic answers for the whole range                               */
/* ------------------------------------------------------------------ */

function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/** Answers that put every compound in the range in front of the rules engine, each blend pen modelled as its own combination. */
export function rangeAnswers(answers: AssessmentAnswers): AssessmentAnswers {
  return {
    ...answers,
    consideredCompounds: RANGE_COMPOUND_SLUGS.map((slug) => ({ slug })),
    combinations: PRODUCTS.map(productCompoundSlugs),
    otherCompoundText: undefined,
  };
}

/** Answers restricted to a set of pens (the compounds inside them, each blend as a combination). */
function answersForProducts(answers: AssessmentAnswers, products: Product[]): AssessmentAnswers {
  const combos = products.map(productCompoundSlugs).filter((c) => c.length > 0);
  return {
    ...answers,
    consideredCompounds: uniq(combos.flat()).map((slug) => ({ slug })),
    combinations: combos,
    otherCompoundText: undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Lookup: one CompoundReport per range compound                        */
/* ------------------------------------------------------------------ */

interface Assessed {
  /** slug → report for every range compound that resolves in the database */
  bySlug: Map<string, CompoundReport>;
  /** Person-level flags (compounds: []) */
  globalFlags: Flag[];
  jurisdictionLabel: string;
  inJurisdiction: string;
}

function assess(answers: AssessmentAnswers, report: Report): Assessed {
  const bySlug = new Map(report.compounds.map((c) => [c.slug, c]));
  const missing = RANGE_COMPOUND_SLUGS.filter((slug) => getCompound(slug) && !bySlug.has(slug));
  if (missing.length > 0) {
    // The user did not put every pen in front of the engine — run the whole range once so each pen gets a real verdict.
    const full = generateReport(rangeAnswers(answers));
    for (const c of full.compounds) if (!bySlug.has(c.slug)) bySlug.set(c.slug, c);
  }
  return {
    bySlug,
    globalFlags: report.globalFlags,
    jurisdictionLabel: report.countryName ?? JURISDICTION_LABELS[report.jurisdiction],
    inJurisdiction: report.jurisdiction === "OTHER" ? "your jurisdiction" : `the ${JURISDICTION_LABELS[report.jurisdiction]}`,
  };
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

function bestGoalEvidence(components: CompoundReport[]): { grade: EvidenceQuality; names: string[] } | undefined {
  const graded = components.filter((c): c is CompoundReport & { goalEvidence: EvidenceQuality } => Boolean(c.goalEvidence));
  if (graded.length === 0) return undefined;
  const top = Math.max(...graded.map((c) => EVIDENCE_RANK[c.goalEvidence]));
  const best = graded.filter((c) => EVIDENCE_RANK[c.goalEvidence] === top);
  return { grade: best[0].goalEvidence, names: best.map((c) => c.name) };
}

function evidenceBonus(grade: EvidenceQuality | undefined): number {
  return grade ? EVIDENCE_RANK[grade] * EVIDENCE_STEP : 0;
}

function focusPoints(product: Product, focusAreas: string[]): { points: number; reasons: string[] } {
  let points = 0;
  const reasons: string[] = [];
  for (const id of focusAreas) {
    if (!isFocusId(id)) continue;
    const weight = FOCUS_WEIGHTS[id][product.slug];
    if (!weight) continue;
    points += weight.points;
    reasons.push(weight.why);
  }
  return { points: Math.min(FOCUS_CAP, points), reasons };
}

function wadaComponents(compounds: (Compound | undefined)[]): Compound[] {
  return compounds.filter((c): c is Compound => Boolean(c && c.wadaProhibited));
}

/* ------------------------------------------------------------------ */
/* Verdict                                                             */
/* ------------------------------------------------------------------ */

const VERDICT_RANK: Record<MatchVerdict, number> = { match: 0, match_with_review: 1, not_recommended: 2 };

function dedupeByTitle(flags: Flag[]): Flag[] {
  const seen = new Set<string>();
  return flags.filter((f) => {
    if (seen.has(f.title)) return false;
    seen.add(f.title);
    return true;
  });
}

function decideVerdict(
  components: CompoundReport[],
  globalFlags: Flag[],
): { verdict: MatchVerdict; blockers: Flag[]; cautions: Flag[] } {
  const own = components.flatMap((c) => c.flags);
  const all = dedupeByTitle(sortFlags([...own, ...globalFlags]));
  const highs = all.filter((f) => f.severity === "high");
  const concern = components.filter((c) => c.suitability === "higher_concern");
  const cautions = all.filter((f) => f.severity === "caution" && isPersonSpecific(f));

  if (highs.length > 0 || concern.length > 0) {
    // Reasons: the high flags, then (for a Higher concern label without a high flag) the person-specific cautions behind it.
    const blockers = highs.length > 0 ? highs : cautions;
    return { verdict: "not_recommended", blockers, cautions };
  }
  return { verdict: cautions.length > 0 ? "match_with_review" : "match", blockers: [], cautions };
}

/* ------------------------------------------------------------------ */
/* Reasons                                                             */
/* ------------------------------------------------------------------ */

function lcFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function regulatoryReason(components: CompoundReport[], ctx: Assessed): MatchReason | undefined {
  if (components.length === 0) return undefined;
  const statuses = uniq(components.map((c) => c.regulatory.status));
  if (statuses.length === 1) {
    return {
      kind: "regulatory",
      text: `${REGULATORY_LABELS[statuses[0]]} as a medicine in ${ctx.inJurisdiction} — supplied for research use only.`,
    };
  }
  const byStatus = new Map<RegulatoryStatus, string[]>();
  for (const c of components) byStatus.set(c.regulatory.status, [...(byStatus.get(c.regulatory.status) ?? []), c.name]);
  const parts = Array.from(byStatus.entries()).map(([status, names]) => `${joinNames(names)} ${lcFirst(REGULATORY_LABELS[status])}`);
  return { kind: "regulatory", text: `In ${ctx.inJurisdiction}: ${parts.join("; ")} — supplied for research use only.` };
}

function blendCaution(product: Product, compounds: Compound[]): MatchReason | undefined {
  if (!product.blend || compounds.length < 2) return undefined;
  let unstudied = false;
  for (let i = 0; i < compounds.length; i++) {
    for (let j = i + 1; j < compounds.length; j++) {
      const note = getStackNote(compounds[i], compounds[j]);
      if (!note || note.evidence !== "studied") unstudied = true;
    }
  }
  if (!unstudied) return undefined;
  const names = compounds.map((c) => c.name);
  return {
    kind: "evidence",
    text:
      compounds.length === 2
        ? `${names[0]} + ${names[1]} has not been studied together in people — each component is graded on its own.`
        : `The ${compounds.length}-compound combination in ${product.name} has not been studied in people — each component is graded on its own.`,
  };
}

/* ------------------------------------------------------------------ */
/* Match one product                                                   */
/* ------------------------------------------------------------------ */

function matchProduct(product: Product, answers: AssessmentAnswers, ctx: Assessed): ProductMatch & { assessed: boolean } {
  const slugs = productCompoundSlugs(product);
  const records = slugs.map((slug) => getCompound(slug));
  const resolved = records.filter((c): c is Compound => Boolean(c));
  const components = slugs.map((slug) => ctx.bySlug.get(slug)).filter((c): c is CompoundReport => Boolean(c));
  const unresolved = slugs.filter((slug, i) => !records[i]);
  const goal = answers.primaryGoal;
  const goalLabel = goal ? lcFirst(GOAL_MAP[goal]?.label ?? goal) : undefined;
  const problem = goalProblemLabel(goal);

  /* ---- score ---- */
  const goalHit = Boolean(goal && product.goals.includes(goal));
  const secondaryHits = answers.secondaryGoals.filter((g) => product.goals.includes(g));
  const focus = focusPoints(product, answers.focusAreas);
  const evidence = bestGoalEvidence(components);
  const wada = wadaComponents(records);
  const tested = answers.testedAthlete === "yes";

  const breakdown: ScoreBreakdown = {
    goal: (goalHit ? GOAL_POINTS : 0) + (secondaryHits.length > 0 ? SECONDARY_GOAL_POINTS : 0),
    focus: focus.points,
    evidence: evidenceBonus(evidence?.grade),
    experience: answers.experienceLevel === "none" ? EXPERIENCE_POINTS : 0,
    antiDoping: tested && wada.length > 0 ? -WADA_PENALTY : 0,
  };
  let score = breakdown.goal + breakdown.focus + breakdown.evidence + breakdown.experience + breakdown.antiDoping;
  if (goal && UNSERVED_GOALS.includes(goal)) score = Math.min(score, SLEEP_CAP);
  score = Math.max(0, Math.min(100, Math.round(score)));

  /* ---- verdict ---- */
  const decision = decideVerdict(components, ctx.globalFlags);

  /* ---- reasons: goal → first focus → evidence → format → (second focus) then the regulatory line, always ---- */
  const core: MatchReason[] = [];
  if (goalHit && problem) {
    core.push({ kind: "goal", text: `You picked “${problem}”. ${product.name}: ${lcFirst(product.bestFor)}` });
  } else if (secondaryHits.length > 0) {
    const label = goalProblemLabel(secondaryHits[0]) ?? GOAL_MAP[secondaryHits[0]].label;
    core.push({ kind: "goal", text: `Matched on your secondary goal “${label}”. ${product.name}: ${lcFirst(product.bestFor)}` });
  }
  if (focus.reasons[0]) core.push({ kind: "focus", text: focus.reasons[0] });
  if (goalLabel) {
    if (evidence) {
      const who = components.length > 1 ? ` (${joinNames(evidence.names)})` : "";
      core.push({
        kind: "evidence",
        text: `Human evidence for ${goalLabel}: ${EVIDENCE_LABELS[evidence.grade]} — ${EVIDENCE_SHORT[evidence.grade]}${who}.`,
      });
    } else if (components.length > 0) {
      core.push({
        kind: "evidence",
        text: `No evidence entry for ${goalLabel} in our database for ${joinNames(components.map((c) => c.name))} — this match rests on the range's intended use, not on trials for your goal.`,
      });
    }
  }
  if (answers.experienceLevel === "none") {
    core.push({ kind: "experience", text: "Pre-filled dose-dial pen — no vials, no reconstitution, no drawing up. A sensible first format." });
  } else if (answers.experienceLevel === "some") {
    core.push({ kind: "experience", text: "Pre-filled dose-dial pen — none of the vials, bacteriostatic water or drawing-up you have done before." });
  }
  if (focus.reasons[1]) core.push({ kind: "focus", text: focus.reasons[1] });
  const regulatory = regulatoryReason(components, ctx);
  const reasons: MatchReason[] = [...core.slice(0, MAX_CORE_REASONS), ...(regulatory ? [regulatory] : [])];

  /* ---- cautions ---- */
  const cautions: MatchReason[] = decision.cautions
    .slice(0, MAX_CAUTIONS)
    .map((f) => ({ kind: f.source === "anti_doping" ? "anti_doping" : "safety", text: f.title }));
  if (tested && wada.length > 0 && !cautions.some((c) => c.kind === "anti_doping")) {
    cautions.push({
      kind: "anti_doping",
      text: `${joinNames(wada.map((c) => c.name))} ${wada.length === 1 ? "is" : "are"} on the WADA Prohibited List — as a tested athlete, using this pen risks sanction.`,
    });
  }
  const blend = blendCaution(product, resolved);
  if (blend) cautions.push(blend);
  for (const slug of unresolved) {
    cautions.push({
      kind: "safety",
      text: `No evidence record for ${slug.toUpperCase()} in our database yet — its suitability for you could not be assessed.`,
    });
  }

  const assessed = unresolved.length === 0 && components.length === slugs.length;

  if (decision.verdict === "not_recommended") {
    const blockers = uniq(decision.blockers.map((f) => f.title)).slice(0, 4);
    const fromLabel = decision.blockers.length === 0 ? ["Your responses identified factors that need professional review first"] : [];
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      score,
      verdict: "not_recommended",
      reasons: [...blockers, ...fromLabel].map((text) => ({ kind: "safety" as const, text })),
      cautions: [],
      compounds: components.map((c) => c.slug),
      breakdown,
      assessed,
    };
  }

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    score,
    verdict: decision.verdict,
    reasons,
    cautions,
    compounds: components.map((c) => c.slug),
    breakdown,
    assessed,
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

function unmatchedFocus(answers: AssessmentAnswers): string[] {
  return answers.focusAreas
    .filter((id) => id !== FOCUS_NONE && isFocusId(id) && Object.keys(FOCUS_WEIGHTS[id]).length === 0)
    .map((id) => FOCUS_DEFS[id as FocusId].label);
}

function summarise(
  answers: AssessmentAnswers,
  primary: ProductMatch | undefined,
  reviewRequired: boolean,
  notRecommended: ProductMatch[],
): string {
  const goal = answers.primaryGoal;
  const problem = goalProblemLabel(goal);
  if (primary) {
    const tail = primary.verdict === "match_with_review" ? ", with points to review before you buy" : "";
    return `${primary.name} is your match${problem ? ` for “${problem}”` : ""} — fit ${primary.score}/100${tail}.`;
  }
  if (reviewRequired) {
    return "A review-required flag from your answers about yourself applies to every pen, so nothing in the range should be bought without speaking to a clinician first.";
  }
  if (goal && UNSERVED_GOALS.includes(goal)) {
    return `Nothing in the range is researched for ${lcFirst(GOAL_MAP[goal].label)}, so the ${BRAND.assessmentName} has no pen to match you to.`;
  }
  if (notRecommended.length === PRODUCTS.length) {
    return "Your answers ruled out every pen in the range — the report explains which flags did it and what to take to a clinician.";
  }
  return "None of the six pens scored high enough on your answers to be called a match — the report shows how each one was assessed.";
}

/**
 * Score and label every pen in the range. `report` should be the rules-engine
 * report for these answers; pens whose compounds it did not assess are run
 * through the engine here (once, for the whole range) so each gets a real
 * suitability verdict.
 */
export function matchProducts(answers: AssessmentAnswers, report: Report): MatchResult {
  const ctx = assess(answers, report);
  const reviewRequired = ctx.globalFlags.some((f) => f.severity === "high");

  const scored = PRODUCTS.map((p) => matchProduct(p, answers, ctx)).sort(
    (x, y) => VERDICT_RANK[x.verdict] - VERDICT_RANK[y.verdict] || y.score - x.score || x.name.localeCompare(y.name),
  );

  const eligible = scored.filter((m) => m.verdict !== "not_recommended");
  const primaryWithMeta = eligible.find((m) => m.assessed && m.score >= PRIMARY_MIN_SCORE && purchasable(productOf(m)));
  // Alternatives only make sense next to a match; they must still clear a floor so "also considered" never lists a 5/100.
  const alternatives = primaryWithMeta
    ? eligible
        .filter((m) => m !== primaryWithMeta && m.score >= ALTERNATIVE_MIN_SCORE && purchasable(productOf(m)))
        .slice(0, MAX_ALTERNATIVES)
    : [];
  const notRecommended = scored.filter((m) => m.verdict === "not_recommended");

  const primary = primaryWithMeta ? strip(primaryWithMeta) : undefined;

  return {
    generatedAt: new Date().toISOString(),
    goal: answers.primaryGoal,
    primary,
    alternatives: alternatives.map(strip),
    notRecommended: notRecommended.map(strip),
    summary: summarise(answers, primary, reviewRequired, notRecommended),
    reviewRequired,
    unmatchedFocus: unmatchedFocus(answers),
  };
}

function productOf(m: ProductMatch): Product {
  return PRODUCTS.find((p) => p.id === m.productId) as Product;
}

function strip(m: ProductMatch & { assessed: boolean }): ProductMatch {
  return {
    productId: m.productId,
    slug: m.slug,
    name: m.name,
    score: m.score,
    verdict: m.verdict,
    reasons: m.reasons,
    cautions: m.cautions,
    compounds: m.compounds,
    breakdown: m.breakdown,
  };
}

/**
 * The end-of-quiz pipeline: assess the whole range, pick the match, then
 * build the user-facing report around the pens that matter — the ones the
 * user picked plus the match and its alternatives — falling back to the whole
 * range when nothing matched so the report can explain why. The report
 * echoes the user's actual responses.
 */
export function buildQuizResult(answers: AssessmentAnswers): { report: Report; match: MatchResult } {
  const rangeReport = generateReport(rangeAnswers(answers));
  const match = matchProducts(answers, rangeReport);

  const shown = [match.primary, ...match.alternatives].filter((m): m is ProductMatch => Boolean(m));
  const pens = uniq([...selectedProducts(answers), ...shown.map(productOf)]);
  const reportAnswers = pens.length > 0 ? answersForProducts(answers, pens) : rangeAnswers(answers);
  const report: Report = { ...generateReport(reportAnswers), answers };

  return { report, match };
}

/** Every product the match result mentions, best first. */
export function allMatches(result: MatchResult): ProductMatch[] {
  return [result.primary, ...result.alternatives, ...result.notRecommended].filter((m): m is ProductMatch => Boolean(m));
}

/** This product's entry in a match result, if it is mentioned at all. */
export function matchForProduct(result: MatchResult | null | undefined, slug: string): ProductMatch | undefined {
  return result ? allMatches(result).find((m) => m.slug === slug) : undefined;
}

/** Where the quiz should send the user once the result is stored. */
export function resultHref(result: MatchResult): string {
  return result.primary ? `/shop/${result.primary.slug}/?match=1` : "/report/";
}
