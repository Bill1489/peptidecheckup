"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Combine, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Eyebrow } from "@/components/ui/card";
import type { Compound } from "@/data/types";
import { analyseCombinations, compoundHref, type PairAnalysis } from "@/lib/compare";
import { STACK_EVIDENCE_LABELS, STACK_EVIDENCE_TONE } from "./labels";

function PairCard({ pair, index, reduce }: { pair: PairAnalysis; index: number; reduce: boolean }) {
  const gap = pair.evidence === "none";
  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: reduce ? 0 : index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-soft"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display text-lg leading-snug text-ink">
          <Link href={compoundHref(pair.a.slug)} className="underline-offset-4 hover:underline">
            {pair.a.name}
          </Link>
          <span className="mx-2 text-muted-2">+</span>
          <Link href={compoundHref(pair.b.slug)} className="underline-offset-4 hover:underline">
            {pair.b.name}
          </Link>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={STACK_EVIDENCE_TONE[pair.evidence]} size="xs" dot>
            {STACK_EVIDENCE_LABELS[pair.evidence]}
          </Badge>
          {gap && (
            <Badge tone="outline" size="xs">
              Evidence gap
            </Badge>
          )}
        </div>
      </div>
      {pair.overlap && (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-2">Overlap · </span>
          {pair.overlap}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-ink-3">
        {pair.recorded ? pair.note : "No published human studies of this combination."}
      </p>
      {!pair.recorded && <p className="mt-2 text-xs leading-relaxed text-muted">{pair.note}</p>}
    </motion.li>
  );
}

/**
 * Pairwise "stack" intelligence for the current selection, derived from
 * `stackNotes` in the database. Missing notes are surfaced as evidence gaps.
 */
export function CombinationPanel({ compounds }: { compounds: Compound[] }) {
  const reduce = useReducedMotion() ?? false;
  const summary = analyseCombinations(compounds);
  const total = summary.pairs.length;
  if (total === 0) return null;

  const parts = [
    summary.studied > 0 && `${summary.studied} studied together in humans`,
    summary.limited > 0 && `${summary.limited} with limited human data`,
    summary.none > 0 && `${summary.none} without human studies`,
  ].filter((p): p is string => Boolean(p));

  return (
    <section className="rounded-3xl border border-line bg-paper-2/60 p-5 sm:p-8" aria-labelledby="combination-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>Combination intelligence</Eyebrow>
          <h2 id="combination-title" className="mt-2.5 font-display text-2xl leading-[1.15] tracking-[-0.02em] text-ink sm:text-3xl">
            What is known about using these together
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted sm:text-base">
            {total === 1 ? "One pair" : `${total} pairs`} assessed against the combination notes in our database: {parts.join(", ")}.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3 text-center lg:min-w-[20rem]">
          {(
            [
              ["Studied", summary.studied, "text-emerald-800"],
              ["Limited", summary.limited, "text-amber-800"],
              ["No data", summary.none, "text-ink"],
            ] as const
          ).map(([label, value, tone]) => (
            <div key={label} className="rounded-xl border border-line bg-white px-3 py-3">
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-2">{label}</dt>
              <dd className={`mt-1 font-display text-2xl ${tone}`}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {summary.pairs.map((pair, i) => (
          <PairCard key={`${pair.a.slug}+${pair.b.slug}`} pair={pair} index={i} reduce={reduce} />
        ))}
      </ul>

      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink-3">
        {summary.none > 0 ? (
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-caution" aria-hidden />
        ) : (
          <Combine className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
        )}
        <p>
          Combination notes describe what has been published, not whether a combination is appropriate for anyone.{" "}
          <span className="font-medium text-ink">Discuss any proposed combination with a qualified healthcare professional.</span>
        </p>
      </div>
    </section>
  );
}
