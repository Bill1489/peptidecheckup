import { COMPOUNDS, compoundsForGoal } from "@/data/compounds";
import { GOAL_MAP, GOALS } from "@/data/goals";
import {
  EVIDENCE_RANK,
  JURISDICTION_LABELS,
  type EvidenceQuality,
  type GoalId,
  type Jurisdiction,
  type RegulatoryStatus,
} from "@/data/types";
import type { FlagSeverity, Suitability } from "@/lib/engine/types";

/**
 * Serialisable props for the animated report preview. Built on the server
 * from the real registry so the client bundle never carries compound data.
 */
export interface ReportPreviewData {
  goalLabel: string;
  primary: { name: string; classLabel: string; suitability: Suitability } | null;
  evidence: { slug: string; name: string; evidence: EvidenceQuality }[];
  regulatory: { jurisdictionLabel: string; status: RegulatoryStatus; lastReviewed: string } | null;
  flags: { severity: FlagSeverity; title: string }[];
}

/** Illustrative flags — generic wording, never tied to a real user or a specific claim. */
const EXAMPLE_FLAGS: ReportPreviewData["flags"] = [
  { severity: "high", title: "Condition listed as a contraindication" },
  { severity: "caution", title: "Medicine interaction to review" },
  { severity: "info", title: "Timeframe shorter than trials measured" },
];

/**
 * The best-evidenced goal in the registry (highest top grade, then most
 * compounds) — the most representative example for the home page.
 */
function mostResearchedGoal(): GoalId {
  return (
    GOALS.filter((g) => g.id !== "other")
      .map((g) => {
        const list = compoundsForGoal(g.id);
        return { id: g.id, count: list.length, top: list[0] ? EVIDENCE_RANK[list[0].evidence] : 0 };
      })
      .sort((a, b) => b.top - a.top || b.count - a.count)[0]?.id ?? "weight_management"
  );
}

export function buildReportPreview(goalId?: GoalId, jurisdiction: Jurisdiction = "UK"): ReportPreviewData {
  const goal = goalId ?? mostResearchedGoal();
  // Ties on evidence grade fall back to registry order (the reference record first) rather than alphabetical.
  const registryIndex = new Map(COMPOUNDS.map((c, i) => [c.slug, i]));
  const forGoal = [...compoundsForGoal(goal)].sort(
    (a, b) =>
      EVIDENCE_RANK[b.evidence] - EVIDENCE_RANK[a.evidence] ||
      (registryIndex.get(a.compound.slug) ?? 0) - (registryIndex.get(b.compound.slug) ?? 0),
  );
  // Prefer goal-specific evidence; fall back to overall evidence across the registry.
  const ranked =
    forGoal.length > 0
      ? forGoal.map((g) => ({ slug: g.compound.slug, name: g.compound.name, evidence: g.evidence, compound: g.compound }))
      : [...COMPOUNDS]
          .sort((a, b) => EVIDENCE_RANK[b.overallEvidence] - EVIDENCE_RANK[a.overallEvidence])
          .map((c) => ({ slug: c.slug, name: c.name, evidence: c.overallEvidence, compound: c }));

  const first = ranked[0]?.compound;
  const reg = first?.regulatory[jurisdiction];
  // Keep the illustration coherent: a compound without meaningful human evidence for the goal
  // cannot be "potentially relevant" to it.
  const suitability: Suitability =
    ranked[0] && EVIDENCE_RANK[ranked[0].evidence] >= EVIDENCE_RANK.limited
      ? "potentially_relevant"
      : "insufficient_information";

  return {
    goalLabel: GOAL_MAP[goal].label,
    primary: first ? { name: first.name, classLabel: first.classLabel, suitability } : null,
    evidence: ranked.slice(0, 3).map(({ slug, name, evidence }) => ({ slug, name, evidence })),
    regulatory: reg
      ? { jurisdictionLabel: JURISDICTION_LABELS[jurisdiction], status: reg.status, lastReviewed: reg.lastReviewed }
      : null,
    flags: EXAMPLE_FLAGS,
  };
}
