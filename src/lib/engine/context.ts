import type { Compound, GoalId, Jurisdiction } from "@/data/types";
import { COUNTRY_MAP, jurisdictionForCountry } from "@/data/countries";
import { getCompound } from "@/data/compounds";
import { GOAL_MAP } from "@/data/goals";
import type { AssessmentAnswers, ConsideredCompound, SectionId } from "@/lib/assessment/types";
import { bmi } from "@/lib/utils";

/**
 * Immutable, pre-computed view of the answers that every rule module reads.
 * Building it once keeps the rules pure and cheap.
 */
export interface EngineContext {
  answers: AssessmentAnswers;
  jurisdiction: Jurisdiction;
  countryName?: string;
  /** Primary goal, with "other" treated as unmapped (undefined) for alignment purposes */
  goal?: GoalId;
  goalLabel: string;
  /** Considered compounds that resolve in the registry, in the order the user selected them */
  compounds: Compound[];
  /** Considered compound slugs that did not resolve */
  unresolvedSlugs: string[];
  /** Slug → the user's dose entry, if any */
  doses: Record<string, ConsideredCompound["dose"] | undefined>;
  bmi?: number;
  /** Section completion helpers */
  isComplete: (id: SectionId) => boolean;
  isSkipped: (id: SectionId) => boolean;
}

export const WEIGHT_GOALS: GoalId[] = ["weight_management", "fat_loss"];

export const UNREGULATED_SOURCES: NonNullable<AssessmentAnswers["source"]>[] = [
  "online_supplier",
  "research_supplier",
  "friend",
];

export const REGULATED_SOURCES: NonNullable<AssessmentAnswers["source"]>[] = [
  "clinician",
  "uk_pharmacy",
];

/**
 * The quiz runs from the store and no longer asks where the product
 * would come from: an undefined `source` means the store's own batch-tested,
 * certificate-backed pens. Older saved answers may still carry a source.
 */
export function suppliedByStore(answers: AssessmentAnswers): boolean {
  return !answers.source;
}

/** True when the answers describe a supply route that cannot be quality-assured (or none at all, in legacy answers). */
export function unregulatedSupply(answers: AssessmentAnswers): boolean {
  return Boolean(answers.source && (UNREGULATED_SOURCES.includes(answers.source) || answers.source === "undecided"));
}

export function buildContext(answers: AssessmentAnswers): EngineContext {
  const jurisdiction = jurisdictionForCountry(answers.countryCode);
  const countryName = answers.countryCode ? COUNTRY_MAP[answers.countryCode]?.name : undefined;

  const compounds: Compound[] = [];
  const unresolvedSlugs: string[] = [];
  const doses: EngineContext["doses"] = {};
  const seen = new Set<string>();
  for (const c of answers.consideredCompounds) {
    if (seen.has(c.slug)) continue;
    seen.add(c.slug);
    const found = getCompound(c.slug);
    if (found) {
      compounds.push(found);
      doses[c.slug] = c.dose;
    } else {
      unresolvedSlugs.push(c.slug);
    }
  }

  const goal = answers.primaryGoal && answers.primaryGoal !== "other" ? answers.primaryGoal : undefined;
  const goalLabel =
    answers.primaryGoal === "other"
      ? answers.otherGoalText?.trim() || GOAL_MAP.other.label
      : answers.primaryGoal
        ? GOAL_MAP[answers.primaryGoal].label
        : "Not specified";

  const completed = new Set(answers.completedSections);
  const skipped = new Set(answers.skippedSections);

  return {
    answers,
    jurisdiction,
    countryName,
    goal,
    goalLabel,
    compounds,
    unresolvedSlugs,
    doses,
    bmi: bmi(answers.heightCm, answers.weightKg),
    isComplete: (id) => completed.has(id) && !skipped.has(id),
    isSkipped: (id) => skipped.has(id),
  };
}
