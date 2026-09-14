import type { AssessmentAnswers } from "@/lib/assessment/types";
import { IMPORTANCE_LABELS, TIMEFRAME_LABELS } from "@/lib/assessment/types";
import { uid } from "@/lib/utils";
import type { CompoundReport, Flag, NotRecommendedItem, Report } from "./types";
import { buildContext } from "./context";
import { NOT_RECOMMENDED_REASONS, notRecommendedReason } from "./labels";
import { globalRules } from "./rules/global";
import { buildCompoundReport, compoundRules, sortFlags } from "./rules/compound";
import { compareDose } from "./rules/dose";
import { stackRules } from "./rules/stack";
import { sourceRules } from "./rules/source";
import { completenessRules } from "./rules/completeness";
import { alternativeRules, goalOptionRules } from "./rules/alternatives";
import { monitoringRules, questionRules } from "./rules/questions";

/**
 * Deterministic rules engine. Given the assessment answers and the compound
 * database, produce the full `Report`. Nothing here is generated freely —
 * every sentence is either a template in `labels.ts` / the rule modules or a
 * field from the database.
 *
 * Pipeline:
 *  1. build an immutable context (jurisdiction, resolved compounds, BMI…)
 *  2. person-level flags (global rules)
 *  3. compound-level flags + dose comparison, per considered compound
 *  4. stack analysis (adds combination flags)
 *  5. suitability decision per compound with the complete flag set
 *  6. report-level aggregates (not-recommended list, options, source, questions, completeness)
 */
export function generateReport(answers: AssessmentAnswers): Report {
  const ctx = buildContext(answers);

  /* 2. person-level flags */
  const personFlags = globalRules(ctx);

  /* 3. compound-level flags and dose comparison */
  const perCompound = ctx.compounds.map((compound) => {
    const rules = compoundRules(ctx, compound);
    const dose = compareDose(compound, ctx.doses[compound.slug]);
    return { compound, flags: dose.flag ? [...rules.flags, dose.flag] : rules.flags, questions: rules.questions, dose };
  });

  /* 4. stack analysis */
  const stack = stackRules(ctx);

  /* Consolidate: dedupe by id, split global vs attached */
  const allFlags = dedupeFlags([...personFlags, ...perCompound.flatMap((p) => p.flags), ...stack.flags]);
  const globalFlags = sortFlags(allFlags.filter((f) => f.compounds.length === 0));

  /* 5. suitability per compound */
  const compounds: CompoundReport[] = perCompound
    .map(({ compound, dose, questions }) =>
      buildCompoundReport(
        ctx,
        compound,
        allFlags.filter((f) => f.compounds.includes(compound.slug)),
        globalFlags,
        dose,
        questions,
      ),
    )
    .sort((x, y) => y.score - x.score || x.name.localeCompare(y.name));

  /* 6. aggregates */
  const notRecommended = notRecommendedItems(compounds, globalFlags, stack.stack?.duplications ?? [], stack.stack?.pairs ?? []);

  const totalFlags = allFlags.length;
  const highFlags = allFlags.filter((f) => f.severity === "high").length;

  return {
    id: uid("rpt"),
    generatedAt: new Date().toISOString(),
    jurisdiction: ctx.jurisdiction,
    countryName: ctx.countryName,
    objective: {
      goal: answers.primaryGoal,
      goalLabel: ctx.goalLabel,
      success: answers.successDescription?.trim() || undefined,
      importanceLabel: answers.importance ? IMPORTANCE_LABELS[answers.importance] : undefined,
      timeframeLabel: answers.timeframe ? TIMEFRAME_LABELS[answers.timeframe] : undefined,
    },
    overview: {
      compoundsConsidered: compounds.length,
      potentiallyRelevant: compounds.filter((c) => c.suitability === "potentially_relevant").length,
      higherConcern: compounds.filter((c) => c.suitability === "higher_concern").length,
      insufficientInformation: compounds.filter((c) => c.suitability === "insufficient_information").length,
      totalFlags,
      highFlags,
    },
    globalFlags,
    compounds,
    stack: stack.stack,
    notRecommended,
    goalOptions: goalOptionRules(ctx),
    alternatives: alternativeRules(ctx),
    clinicianQuestions: questionRules(ctx, compounds),
    monitoring: monitoringRules(compounds),
    sourceAssessment: sourceRules(ctx),
    completeness: completenessRules(ctx),
    answers,
    contactRequested: Boolean(answers.contactConsent),
    unresolvedSlugs: ctx.unresolvedSlugs.length > 0 ? ctx.unresolvedSlugs : undefined,
  };
}

function dedupeFlags(flags: Flag[]): Flag[] {
  const seen = new Map<string, Flag>();
  for (const f of flags) {
    if (!seen.has(f.id)) seen.set(f.id, f);
  }
  return Array.from(seen.values());
}

/**
 * "What we would not recommend proceeding with without professional review":
 * every higher-concern compound with reasons derived from flag sources (never
 * "don't take X"), plus any duplicated pair.
 */
function notRecommendedItems(
  compounds: CompoundReport[],
  globalFlags: Flag[],
  duplications: { pair: string; note: string }[],
  pairs: { a: string; b: string; aName: string; bName: string; duplication: boolean }[],
): NotRecommendedItem[] {
  const items: NotRecommendedItem[] = compounds
    .filter((c) => c.suitability === "higher_concern")
    .map((c) => {
      const relevant = sortFlags([...c.flags, ...globalFlags]).filter((f) => f.severity !== "info");
      const reasons = Array.from(new Set(relevant.map(notRecommendedReason)));
      return {
        slug: c.slug,
        name: c.name,
        reasons: reasons.length > 0 ? reasons : [NOT_RECOMMENDED_REASONS.information],
      };
    });

  for (const p of pairs.filter((x) => x.duplication)) {
    const note = duplications.find((d) => d.pair === `${p.aName} + ${p.bName}`)?.note;
    items.push({
      slug: `${p.a}+${p.b}`,
      name: `${p.aName} + ${p.bName}`,
      reasons: [
        "Flagged because the combination duplicates mechanism without supporting evidence",
        ...(note ? [note] : []),
      ],
    });
  }

  return items;
}
