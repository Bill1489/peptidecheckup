import { COMPOUNDS, COMPOUND_MAP, getStackNote } from "@/data/compounds";
import { GOALS } from "@/data/goals";
import {
  EVIDENCE_RANK,
  FAMILY_LABELS,
  type Compound,
  type CompoundFamily,
  type GoalId,
  type Jurisdiction,
  type RegulatoryStatus,
  type StackEvidence,
  type StackNote,
} from "@/data/types";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

/** Maximum number of compounds that can be compared side by side. */
export const MAX_COMPARE = 4;

export const COMPARE_PATH = "/compare/";
export const PEPTIDES_PATH = "/peptides/";

/** Jurisdictions offered in the segmented selector. "OTHER" is shown on detail tabs only. */
export const SELECTABLE_JURISDICTIONS = ["UK", "US", "EU", "AU", "CA"] as const;
export type SelectableJurisdiction = (typeof SELECTABLE_JURISDICTIONS)[number];

/** Every jurisdiction in the regulatory record, in display order. */
export const ALL_JURISDICTIONS: readonly Jurisdiction[] = ["UK", "US", "EU", "AU", "CA", "OTHER"];

export const JURISDICTION_SHORT: Record<Jurisdiction, string> = {
  UK: "UK",
  US: "US",
  EU: "EU",
  AU: "AU",
  CA: "CA",
  OTHER: "Other",
};

export function isSelectableJurisdiction(value: string): value is SelectableJurisdiction {
  return (SELECTABLE_JURISDICTIONS as readonly string[]).includes(value);
}

/** Sort order for "Regulatory (authorised first)". */
export const REGULATORY_RANK: Record<RegulatoryStatus, number> = {
  authorised: 0,
  investigational: 1,
  unclear: 2,
  not_authorised: 3,
};

/* ------------------------------------------------------------------ */
/* Slug helpers                                                        */
/* ------------------------------------------------------------------ */

/** Keep only known, unique slugs, capped at MAX_COMPARE. Order is preserved. */
export function normaliseSlugs(slugs: readonly string[]): string[] {
  const out: string[] = [];
  for (const raw of slugs) {
    const slug = raw.trim().toLowerCase();
    if (!slug || out.includes(slug) || !COMPOUND_MAP[slug]) continue;
    out.push(slug);
    if (out.length >= MAX_COMPARE) break;
  }
  return out;
}

/** Parse the `?c=a,b,c` query parameter. Unknown slugs are ignored. */
export function parseCompareParam(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return normaliseSlugs(raw.split(","));
}

/** Build the canonical compare URL for a selection. */
export function compareHref(slugs: readonly string[]): string {
  const clean = normaliseSlugs(slugs);
  return clean.length ? `${COMPARE_PATH}?c=${clean.join(",")}` : COMPARE_PATH;
}

export function compoundHref(slug: string): string {
  return `${PEPTIDES_PATH}${slug}/`;
}

export function sameSlugs(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((s, i) => s === b[i]);
}

/** Readable fallback for a slug that is referenced but not (yet) in the registry. */
export function humaniseSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => (/^[a-z]{1,3}$/.test(part) ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("-");
}

/** Name for a slug, falling back to a humanised slug when the record is missing. */
export function compoundName(slug: string): string {
  return COMPOUND_MAP[slug]?.name ?? humaniseSlug(slug);
}

/* ------------------------------------------------------------------ */
/* Derived data for the compare tool                                   */
/* ------------------------------------------------------------------ */

export interface SuggestedComparison {
  slugs: string[];
  label: string;
  reason: string;
}

/**
 * Popular comparisons derived from the registry: for every family with at least
 * two members, the two compounds with the strongest overall evidence (ties keep
 * registry order, which is the curated display order).
 */
export function suggestedComparisons(limit = 4): SuggestedComparison[] {
  const byFamily = new Map<CompoundFamily, Compound[]>();
  for (const c of COMPOUNDS) byFamily.set(c.family, [...(byFamily.get(c.family) ?? []), c]);

  const suggestions: SuggestedComparison[] = [];
  for (const [family, members] of byFamily) {
    if (members.length < 2) continue;
    const [a, b] = [...members].sort(
      (x, y) => EVIDENCE_RANK[y.overallEvidence] - EVIDENCE_RANK[x.overallEvidence] || COMPOUNDS.indexOf(x) - COMPOUNDS.indexOf(y),
    );
    suggestions.push({ slugs: [a.slug, b.slug], label: `${a.name} vs ${b.name}`, reason: FAMILY_LABELS[family] });
  }
  return suggestions.slice(0, limit);
}

/** Every unordered pair of a list, in order of appearance. */
export function pairwise<T>(items: readonly T[]): [T, T][] {
  return items.flatMap((a, i) => items.slice(i + 1).map((b): [T, T] => [a, b]));
}

export interface PairAnalysis {
  a: Compound;
  b: Compound;
  evidence: StackEvidence;
  /** False when the database has no note for this pair — an evidence gap. */
  recorded: boolean;
  overlap?: string;
  note: string;
}

export interface CombinationSummary {
  pairs: PairAnalysis[];
  studied: number;
  limited: number;
  none: number;
}

export const COMBINATION_GAP_NOTE =
  "No published human studies of this combination are recorded in our database. Treat this as an evidence gap rather than as evidence of safety.";

/** Resolve stack notes for every pair in a selection. */
export function analyseCombinations(compounds: readonly Compound[]): CombinationSummary {
  const pairs = pairwise(compounds).map(([a, b]): PairAnalysis => {
    const note: StackNote | undefined = getStackNote(a, b);
    if (!note) return { a, b, evidence: "none", recorded: false, note: COMBINATION_GAP_NOTE };
    return { a, b, evidence: note.evidence, recorded: true, overlap: note.overlap, note: note.note };
  });
  return {
    pairs,
    studied: pairs.filter((p) => p.evidence === "studied").length,
    limited: pairs.filter((p) => p.evidence === "limited").length,
    none: pairs.filter((p) => p.evidence === "none").length,
  };
}

/** Goals that at least one of the compounds has an evidence entry for, in GOALS order. */
export function goalsAcross(compounds: readonly Compound[]): GoalId[] {
  return GOALS.map((g) => g.id).filter((id) => compounds.some((c) => c.goals.some((g) => g.goal === id)));
}

/** Count of published human studies recorded and the largest sample size among them. */
export function studyStats(compound: Compound): { count: number; largestN?: number } {
  const count = compound.dosingResearch.length;
  const largestN = compound.dosingResearch.reduce((max, s) => Math.max(max, s.n ?? 0), 0);
  return { count, largestN: largestN > 0 ? largestN : undefined };
}

export function wadaLabel(status: Compound["wadaProhibited"]): string {
  if (status === true) return "Prohibited at all times";
  if (status === "in_competition") return "Prohibited in competition";
  return "Not prohibited";
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-GB");
}
