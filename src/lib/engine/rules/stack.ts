import type { Compound, StackEvidence } from "@/data/types";
import { getStackNote } from "@/data/compounds";
import type { Flag, StackAnalysis, StackPair } from "../types";
import type { EngineContext } from "../context";
import {
  STACK_SUMMARY_INSUFFICIENT,
  STACK_SUMMARY_LIMITED,
  STACK_SUMMARY_STUDIED,
  flagId,
} from "../labels";

/**
 * Stack intelligence: pairwise evidence for combining the considered compounds.
 * Runs only when two or more considered compounds resolve in the registry.
 */

const GENERIC_NO_EVIDENCE = "No published human studies of this combination.";

/** Families where two members almost always duplicate mechanism. */
const DUPLICATING_FAMILIES: Compound["family"][] = ["incretin", "growth_hormone_axis"];

export interface StackResult {
  stack?: StackAnalysis;
  flags: Flag[];
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("+");
}

/** Which compounds form the stack, and which pairs to analyse. */
function stackMembers(ctx: EngineContext): { members: Compound[]; pairs: [Compound, Compound][] } {
  const bySlug = new Map(ctx.compounds.map((c) => [c.slug, c]));
  const combos = ctx.answers.combinations
    .map((combo) => Array.from(new Set(combo)).map((s) => bySlug.get(s)).filter((c): c is Compound => Boolean(c)))
    .filter((combo) => combo.length >= 2);

  const groups: Compound[][] = combos.length > 0 ? combos : [ctx.compounds];

  const memberSet = new Map<string, Compound>();
  const pairSet = new Map<string, [Compound, Compound]>();
  for (const group of groups) {
    for (const c of group) memberSet.set(c.slug, c);
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const key = pairKey(group[i].slug, group[j].slug);
        if (!pairSet.has(key)) pairSet.set(key, [group[i], group[j]]);
      }
    }
  }
  // Preserve the user's selection order.
  const members = ctx.compounds.filter((c) => memberSet.has(c.slug));
  return { members, pairs: Array.from(pairSet.values()) };
}

function isDuplication(a: Compound, b: Compound, evidence: StackEvidence, overlap: string | undefined, note: string): boolean {
  if (/duplicat/i.test(`${overlap ?? ""} ${note}`)) return true;
  if (a.family === b.family && DUPLICATING_FAMILIES.includes(a.family) && evidence !== "studied") return true;
  return false;
}

export function stackRules(ctx: EngineContext): StackResult {
  if (ctx.compounds.length < 2) return { flags: [] };
  const { members, pairs } = stackMembers(ctx);
  if (members.length < 2 || pairs.length === 0) return { flags: [] };

  const stackPairs: StackPair[] = pairs.map(([a, b]) => {
    const note = getStackNote(a, b);
    const evidence: StackEvidence = note?.evidence ?? "none";
    const text = note?.note ?? GENERIC_NO_EVIDENCE;
    return {
      a: a.slug,
      b: b.slug,
      aName: a.name,
      bName: b.name,
      evidence,
      overlap: note?.overlap,
      note: text,
      duplication: isDuplication(a, b, evidence, note?.overlap, text),
    };
  });

  const evidences = stackPairs.map((p) => p.evidence);
  const allStudied = evidences.every((e) => e === "studied");
  const allNone = evidences.every((e) => e === "none");
  const allLimited = evidences.every((e) => e === "limited");
  const noneCount = evidences.filter((e) => e === "none").length;
  const anyLimited = evidences.some((e) => e === "limited");
  const duplications = stackPairs.filter((p) => p.duplication);

  const combinationEvidence: StackAnalysis["combinationEvidence"] = allStudied
    ? "studied"
    : allNone
      ? "none"
      : allLimited
        ? "limited"
        : "mixed";

  const uncertainty: StackAnalysis["uncertainty"] =
    noneCount >= 2 || duplications.length > 0
      ? "high"
      : noneCount === 1
        ? "moderate_high"
        : anyLimited
          ? "moderate"
          : "low";

  const summary =
    combinationEvidence === "studied"
      ? STACK_SUMMARY_STUDIED
      : combinationEvidence === "limited"
        ? STACK_SUMMARY_LIMITED
        : STACK_SUMMARY_INSUFFICIENT;

  const flags: Flag[] = duplications.map((p) => ({
    id: flagId("stack", "duplication", p.a, p.b),
    severity: "caution",
    source: "stack",
    title: `Duplicate mechanism: ${p.aName} + ${p.bName}`,
    detail: `${p.overlap ? `${p.overlap} ` : ""}${p.note}`,
    compounds: [p.a, p.b],
  }));

  if (members.length >= 3) {
    flags.push({
      id: flagId("stack", "count", members.length),
      severity: "info",
      source: "stack",
      title: "Three or more compounds — cumulative adverse-effect burden and interaction uncertainty",
      detail: `You are considering ${members.length} compounds together. Adverse effects add up, attributing a reaction to one compound becomes harder, and none of the published studies in our database tested a combination of this size.`,
      compounds: [],
    });
  }

  return {
    stack: {
      compounds: members.map((c) => ({ slug: c.slug, name: c.name })),
      count: members.length,
      combinationEvidence,
      overlappingConsiderations: stackPairs
        .filter((p) => p.overlap)
        .map((p) => ({ pair: `${p.aName} + ${p.bName}`, note: p.overlap as string })),
      evidenceGaps: noneCount,
      duplications: duplications.map((p) => ({ pair: `${p.aName} + ${p.bName}`, note: p.note })),
      uncertainty,
      summary,
      pairs: stackPairs,
    },
    flags,
  };
}
