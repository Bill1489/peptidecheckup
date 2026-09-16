"use client";

import Link from "next/link";
import type { Compound } from "@/data/types";
import { analyseCombinations, compoundHref, type PairAnalysis } from "@/lib/compare";
import { cn } from "@/lib/utils";
import { STACK_EVIDENCE_LABELS, STACK_EVIDENCE_MARKER } from "./labels";
import { Marker } from "./primitives";

function PairRow({ pair }: { pair: PairAnalysis }) {
  const gap = pair.evidence === "none";
  return (
    <li className="grid gap-3 p-4 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)] sm:gap-6 sm:p-5">
      <div className="min-w-0">
        <h3 className="font-display break-words text-[1.1rem] uppercase leading-[1.05] text-ink">
          <Link href={compoundHref(pair.a.slug)} className="link-rule">
            {pair.a.name}
          </Link>
          <span className="mx-2 text-muted-2">+</span>
          <Link href={compoundHref(pair.b.slug)} className="link-rule">
            {pair.b.name}
          </Link>
        </h3>
        <p className="label-mono mt-2.5 flex flex-wrap items-center gap-2">
          <Marker className={STACK_EVIDENCE_MARKER[pair.evidence]} />
          {STACK_EVIDENCE_LABELS[pair.evidence]}
          {gap && <span className="text-accent-700">· Evidence gap</span>}
        </p>
      </div>
      <div>
        {pair.overlap && (
          <p className="text-[12.5px] leading-relaxed text-muted">
            <span className="label-mono">Overlap · </span>
            {pair.overlap}
          </p>
        )}
        <p className={cn("text-[14px] leading-relaxed text-ink-3", pair.overlap && "mt-1.5")}>
          {pair.recorded ? pair.note : "No published human studies of this combination."}
        </p>
        {!pair.recorded && <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{pair.note}</p>}
      </div>
    </li>
  );
}

/**
 * Pairwise "stack" intelligence for the current selection, derived from
 * `stackNotes` in the database. Missing notes are surfaced as evidence gaps.
 */
export function CombinationPanel({ compounds }: { compounds: Compound[] }) {
  const summary = analyseCombinations(compounds);
  const total = summary.pairs.length;
  if (total === 0) return null;

  const parts = [
    summary.studied > 0 && `${summary.studied} studied together in humans`,
    summary.limited > 0 && `${summary.limited} with limited human data`,
    summary.none > 0 && `${summary.none} without human studies`,
  ].filter((p): p is string => Boolean(p));

  const stats = [
    { label: "Studied", value: summary.studied, marker: STACK_EVIDENCE_MARKER.studied },
    { label: "Limited", value: summary.limited, marker: STACK_EVIDENCE_MARKER.limited },
    { label: "No data", value: summary.none, marker: STACK_EVIDENCE_MARKER.none },
  ];

  return (
    <section className="border border-ink bg-white" aria-labelledby="combination-title">
      <div className="grid gap-6 border-b border-ink p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div className="max-w-2xl">
          <p className="label-mono">Combination intelligence</p>
          <h2 id="combination-title" className="mt-2.5 text-[1.6rem] uppercase leading-[0.98] text-ink sm:text-[2rem]">
            What is known about using these together
          </h2>
          <p className="mt-3 text-pretty text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {total === 1 ? "One pair" : `${total} pairs`} assessed against the combination notes in our database: {parts.join(", ")}.
          </p>
        </div>
        <dl className="cell-grid grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="p-3">
              <dt className="label-mono flex items-center gap-1.5">
                <Marker className={s.marker} />
                {s.label}
              </dt>
              <dd className="font-display mt-2 text-[1.6rem] leading-none text-ink tnum">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="divide-y divide-ink">
        {summary.pairs.map((pair) => (
          <PairRow key={`${pair.a.slug}+${pair.b.slug}`} pair={pair} />
        ))}
      </ul>

      <p className="border-t border-ink bg-paper-2 px-5 py-3 text-[13px] leading-relaxed text-ink-3">
        Combination notes describe what has been published, not whether a combination is appropriate for anyone.{" "}
        <span className="font-medium text-ink">Discuss any proposed combination with a qualified healthcare professional.</span>
      </p>
    </section>
  );
}
