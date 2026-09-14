import type { CompoundReport } from "../types";
import type { EngineContext } from "../context";
import { lc } from "../labels";

const MAX_QUESTIONS = 10;
const MAX_MONITORING = 8;

/**
 * Report-level questions: person-specific (flag-derived) questions first,
 * then each compound's canonical questions interleaved so one compound does
 * not crowd out the others, then two generic goal questions. Max 10.
 */
export function questionRules(ctx: EngineContext, compounds: CompoundReport[]): string[] {
  const derived: string[] = [];
  const canonicalPerCompound: string[][] = [];

  for (const c of compounds) {
    const record = ctx.compounds.find((x) => x.slug === c.slug);
    const canonicalSet = new Set(record?.clinicianQuestions ?? []);
    const canonical: string[] = [];
    for (const q of c.clinicianQuestions) {
      if (canonicalSet.has(q)) canonical.push(q);
      else derived.push(q);
    }
    canonicalPerCompound.push(canonical);
  }

  const generic = [
    `What non-peptide options with stronger evidence exist for ${lc(ctx.goalLabel)}?`,
    "What monitoring would you want before and during any treatment?",
  ];

  const deduped = Array.from(new Set([...derived, ...interleave(canonicalPerCompound), ...generic]));
  if (deduped.length <= MAX_QUESTIONS) return deduped;

  // Always keep the generic questions; trim compound questions to fit.
  const specific = deduped.filter((q) => !generic.includes(q)).slice(0, MAX_QUESTIONS - generic.length);
  return [...specific, ...generic];
}

/** Union of monitoring items across compounds, interleaved, max 8. */
export function monitoringRules(compounds: CompoundReport[]): string[] {
  return Array.from(new Set(interleave(compounds.map((c) => c.monitoring)))).slice(0, MAX_MONITORING);
}

function interleave<T>(lists: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) {
    for (const list of lists) {
      if (i < list.length) out.push(list[i]);
    }
  }
  return out;
}
