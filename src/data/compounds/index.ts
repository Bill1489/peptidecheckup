import type { Compound, CompoundFamily, EvidenceQuality, GoalId } from "../types";
import { EVIDENCE_RANK } from "../types";
import { semaglutide } from "./semaglutide";
import { INCRETIN_COMPOUNDS } from "./incretins";
import { GH_AXIS_COMPOUNDS } from "./gh-axis";
import { REPAIR_COSMETIC_SEXUAL_COMPOUNDS } from "./repair-cosmetic-sexual";
import { NEURO_LONGEVITY_IMMUNE_COMPOUNDS } from "./neuro-longevity-immune";

/**
 * Master registry. Order here = default display order in the directory.
 * Slugs in the database (keep in sync — used for alternatives / stackNotes):
 *   incretins:  semaglutide, tirzepatide, liraglutide, retatrutide, cagrilintide, survodutide, aod-9604
 *   gh-axis:    tesamorelin, sermorelin, cjc-1295, ipamorelin, somatropin, igf-1-lr3
 *   repair/cosmetic/sexual: bpc-157, tb-500, ghk-cu, collagen-peptides, pt-141, kisspeptin, melanotan-ii
 *   neuro/longevity/immune: selank, semax, dsip, epitalon, mots-c, elamipretide, thymosin-alpha-1, ll-37
 */
export const COMPOUNDS: Compound[] = [
  semaglutide,
  ...INCRETIN_COMPOUNDS,
  ...GH_AXIS_COMPOUNDS,
  ...REPAIR_COSMETIC_SEXUAL_COMPOUNDS,
  ...NEURO_LONGEVITY_IMMUNE_COMPOUNDS,
];

/** Every slug the database is expected to contain (for validation / linking). */
export const ALL_SLUGS = [
  "semaglutide", "tirzepatide", "liraglutide", "retatrutide", "cagrilintide", "survodutide", "aod-9604",
  "tesamorelin", "sermorelin", "cjc-1295", "ipamorelin", "somatropin", "igf-1-lr3",
  "bpc-157", "tb-500", "ghk-cu", "collagen-peptides", "pt-141", "kisspeptin", "melanotan-ii",
  "selank", "semax", "dsip", "epitalon", "mots-c", "elamipretide", "thymosin-alpha-1", "ll-37",
] as const;

export const COMPOUND_MAP: Record<string, Compound> = Object.fromEntries(
  COMPOUNDS.map((c) => [c.slug, c]),
);

export function getCompound(slug: string): Compound | undefined {
  return COMPOUND_MAP[slug];
}

export function getCompounds(slugs: string[]): Compound[] {
  return slugs.map((s) => COMPOUND_MAP[s]).filter(Boolean) as Compound[];
}

export function compoundsByFamily(family: CompoundFamily): Compound[] {
  return COMPOUNDS.filter((c) => c.family === family);
}

/** Compounds with any evidence entry for a goal, sorted by evidence strength. */
export function compoundsForGoal(goal: GoalId): { compound: Compound; evidence: EvidenceQuality; summary: string }[] {
  return COMPOUNDS.flatMap((c) => {
    const g = c.goals.find((x) => x.goal === goal);
    return g ? [{ compound: c, evidence: g.evidence, summary: g.summary }] : [];
  }).sort((a, b) => EVIDENCE_RANK[b.evidence] - EVIDENCE_RANK[a.evidence] || a.compound.name.localeCompare(b.compound.name));
}

/** Simple ranked search across name, aliases and class label. */
export function searchCompounds(query: string, limit = 10): Compound[] {
  const q = query.trim().toLowerCase();
  if (!q) return COMPOUNDS.slice(0, limit);
  return COMPOUNDS.map((c) => {
    const name = c.name.toLowerCase();
    let score = 0;
    if (name === q) score = 6;
    else if (name.startsWith(q)) score = 5;
    else if (c.aliases.some((a) => a.toLowerCase() === q)) score = 5;
    else if (c.aliases.some((a) => a.toLowerCase().startsWith(q))) score = 4;
    else if (name.includes(q)) score = 3;
    else if (c.aliases.some((a) => a.toLowerCase().includes(q))) score = 2;
    else if (c.classLabel.toLowerCase().includes(q)) score = 1;
    return { c, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.c.name.localeCompare(b.c.name))
    .slice(0, limit)
    .map((s) => s.c);
}

/** Look up a stack note between two compounds (checks both directions). */
export function getStackNote(a: Compound, b: Compound) {
  return a.stackNotes.find((n) => n.with === b.slug) ?? b.stackNotes.find((n) => n.with === a.slug);
}
