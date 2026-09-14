"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Plus, ShieldAlert } from "lucide-react";
import { Badge, EVIDENCE_COLOR_CLASS, EvidenceMeter, RegulatoryBadge } from "@/components/ui/badge";
import { GOAL_MAP } from "@/data/goals";
import { EVIDENCE_LABELS, EVIDENCE_RANK, FAMILY_LABELS, type Compound, type Jurisdiction } from "@/data/types";
import { cn } from "@/lib/utils";
import { compoundHref } from "@/lib/compare";

const MAX_GOAL_CHIPS = 3;

/**
 * Directory card. The whole card is clickable via a stretched link on the
 * title; the compare toggle sits above it so both remain keyboard-reachable.
 */
export function CompoundCard({
  compound,
  jurisdiction,
  selected,
  onToggleCompare,
  className,
}: {
  compound: Compound;
  jurisdiction: Jurisdiction;
  selected: boolean;
  onToggleCompare: (slug: string) => void;
  className?: string;
}) {
  const aliases = compound.aliases.slice(0, 2);
  const goals = [...compound.goals].sort((a, b) => EVIDENCE_RANK[b.evidence] - EVIDENCE_RANK[a.evidence]);
  const visibleGoals = goals.slice(0, MAX_GOAL_CHIPS);
  const hiddenGoals = goals.length - visibleGoals.length;
  const regulatory = compound.regulatory[jurisdiction];
  const wada = compound.wadaProhibited;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-[border-color,box-shadow] duration-300 ease-out-expo hover:border-ink/15 hover:shadow-lift",
        selected && "border-brand-500/60 shadow-glow",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge tone="neutral" size="xs">
          {FAMILY_LABELS[compound.family]}
        </Badge>
        {wada && (
          <Badge tone="danger" size="xs" className="shrink-0">
            <ShieldAlert className="h-3 w-3" aria-hidden />
            {wada === "in_competition" ? "WADA · in competition" : "WADA prohibited"}
          </Badge>
        )}
      </div>

      <h3 className="mt-4 font-display text-[1.7rem] leading-[1.1] tracking-[-0.02em] text-ink">
        <Link
          href={compoundHref(compound.slug)}
          className="rounded-sm after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-500"
        >
          {compound.name}
        </Link>
      </h3>
      {aliases.length > 0 && (
        <p className="mt-1 text-xs text-muted">
          Also <span className="text-ink-3">{aliases.join(" · ")}</span>
        </p>
      )}
      <p className="mt-2.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-brand-700">
        {compound.classLabel}
      </p>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-3">{compound.tagline}</p>

      <dl className="mt-5 space-y-2.5 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-3">
          <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-2">Evidence</dt>
          <dd className="flex items-center gap-2 text-xs font-medium text-ink">
            <EvidenceMeter level={compound.overallEvidence} />
            {EVIDENCE_LABELS[compound.overallEvidence]}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-2">{jurisdiction} status</dt>
          <dd>
            <RegulatoryBadge status={regulatory.status} size="xs" />
          </dd>
        </div>
      </dl>

      {visibleGoals.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Researched for">
          {visibleGoals.map((g) => (
            <li
              key={g.goal}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2 py-0.5 text-[0.7rem] text-ink-3"
              title={`${GOAL_MAP[g.goal].label}: ${EVIDENCE_LABELS[g.evidence]} evidence`}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", EVIDENCE_COLOR_CLASS[g.evidence])} aria-hidden />
              {GOAL_MAP[g.goal].short}
              <span className="sr-only">, {EVIDENCE_LABELS[g.evidence]} evidence</span>
            </li>
          ))}
          {hiddenGoals > 0 && (
            <li className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.7rem] text-muted-2">+{hiddenGoals}</li>
          )}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-5">
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-brand-700 transition-colors group-hover:text-brand-800">
          View compound
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
        <button
          type="button"
          onClick={() => onToggleCompare(compound.slug)}
          aria-pressed={selected}
          aria-label={selected ? `Remove ${compound.name} from comparison` : `Add ${compound.name} to comparison`}
          className={cn(
            "relative z-10 inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-all duration-200 ease-out-expo active:scale-[0.98] sm:h-9 sm:px-3",
            selected
              ? "border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
              : "border-line-strong bg-white text-ink hover:border-ink/30 hover:bg-paper-2",
          )}
        >
          {selected ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
          {selected ? "Added" : "Compare"}
        </button>
      </div>
    </article>
  );
}
