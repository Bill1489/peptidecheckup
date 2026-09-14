import { SECTION_META, SECTION_ORDER, type SectionId } from "@/lib/assessment/types";
import type { Completeness } from "../types";
import type { EngineContext } from "../context";

/**
 * How complete the assessment is, weighted so that required sections matter
 * more than optional ones. Missing items are phrased as what would improve
 * the report — never as a reproach.
 */
const REQUIRED_WEIGHT = 12;
const OPTIONAL_WEIGHT = 5;

function weightOf(id: SectionId): number {
  return SECTION_META[id].optional ? OPTIONAL_WEIGHT : REQUIRED_WEIGHT;
}

export function completenessRules(ctx: EngineContext): Completeness {
  const { answers: a } = ctx;
  const total = SECTION_ORDER.reduce((sum, id) => sum + weightOf(id), 0);
  const earned = SECTION_ORDER.filter((id) => ctx.isComplete(id)).reduce((sum, id) => sum + weightOf(id), 0);
  const score = Math.round((earned / total) * 100);

  const missing: string[] = [];
  for (const id of SECTION_ORDER) {
    if (ctx.isComplete(id)) continue;
    const meta = SECTION_META[id];
    missing.push(
      ctx.isSkipped(id)
        ? `${meta.title} skipped${meta.optional ? "" : " — this section informs the suitability assessment"}`
        : `${meta.title} not completed`,
    );
  }

  if (a.age === undefined) missing.push("Age not entered");
  if (!a.countryCode) missing.push("Country not selected — regulatory status defaults to 'Other jurisdictions'");
  if (ctx.bmi === undefined) missing.push("Height and weight not entered (needed for BMI-based eligibility criteria)");
  for (const c of ctx.compounds) {
    const dose = ctx.doses[c.slug];
    if (!dose || dose.amount === undefined) missing.push(`No dose entered for ${c.name}`);
  }
  if (ctx.compounds.length === 0 && ctx.unresolvedSlugs.length === 0 && !a.otherCompoundText?.trim()) {
    missing.push("No compounds selected");
  }

  return {
    score,
    completed: SECTION_ORDER.filter((id) => ctx.isComplete(id)),
    skipped: SECTION_ORDER.filter((id) => ctx.isSkipped(id)),
    missing,
  };
}
