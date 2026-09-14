import {
  EVIDENCE_LABELS,
  EVIDENCE_RANK,
  JURISDICTION_LABELS,
  REGULATORY_LABELS,
  type RegulatoryStatus,
} from "@/data/types";
import { compoundsForGoal, getCompound } from "@/data/compounds";
import type { AlternativeItem, GoalOption } from "../types";
import type { EngineContext } from "../context";
import { lc } from "../labels";

const REGULATORY_ORDER: Record<RegulatoryStatus, number> = {
  authorised: 0,
  investigational: 1,
  unclear: 2,
  not_authorised: 3,
};

/** Every compound in the database with an evidence entry for the user's goal (top 8). */
export function goalOptionRules(ctx: EngineContext): GoalOption[] {
  if (!ctx.goal) return [];
  const considered = new Set(ctx.compounds.map((c) => c.slug));
  return compoundsForGoal(ctx.goal)
    .slice(0, 8)
    .map(({ compound, evidence, summary }) => ({
      slug: compound.slug,
      name: compound.name,
      classLabel: compound.classLabel,
      evidence,
      summary,
      regulatoryStatus: compound.regulatory[ctx.jurisdiction].status,
      considered: considered.has(compound.slug),
    }));
}

/**
 * Alternatives named by the considered compounds' own records, excluding
 * anything already considered. Reason text is derived from the alternative's
 * goal evidence and its regulatory status in the user's jurisdiction.
 */
export function alternativeRules(ctx: EngineContext): AlternativeItem[] {
  const considered = new Set(ctx.compounds.map((c) => c.slug));
  const seen = new Set<string>();
  const items: AlternativeItem[] = [];

  for (const c of ctx.compounds) {
    for (const slug of c.alternatives) {
      if (considered.has(slug) || seen.has(slug)) continue;
      const alt = getCompound(slug);
      if (!alt) continue;
      seen.add(slug);

      const goalEntry = ctx.goal ? alt.goals.find((g) => g.goal === ctx.goal) : undefined;
      const evidence = goalEntry?.evidence ?? alt.overallEvidence;
      const status = alt.regulatory[ctx.jurisdiction].status;
      const where = ctx.jurisdiction === "OTHER" ? "your jurisdiction" : `the ${JURISDICTION_LABELS[ctx.jurisdiction]}`;

      const evidenceClause = goalEntry
        ? `${EVIDENCE_LABELS[goalEntry.evidence]} evidence for ${lc(ctx.goalLabel)}`
        : `${EVIDENCE_LABELS[alt.overallEvidence]} evidence for its most-researched use (not specifically ${lc(ctx.goalLabel)})`;
      const regulatoryClause = `${lc(REGULATORY_LABELS[status])} in ${where}`;

      items.push({
        slug: alt.slug,
        name: alt.name,
        classLabel: alt.classLabel,
        evidence,
        regulatoryStatus: status,
        reason: `Named as an alternative in the ${c.name} record. ${evidenceClause}; ${regulatoryClause}.`,
      });
    }
  }

  return items
    .sort(
      (x, y) =>
        EVIDENCE_RANK[y.evidence] - EVIDENCE_RANK[x.evidence] ||
        REGULATORY_ORDER[x.regulatoryStatus] - REGULATORY_ORDER[y.regulatoryStatus] ||
        x.name.localeCompare(y.name),
    )
    .slice(0, 5);
}
