"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Plus, ShieldAlert, X } from "lucide-react";
import { Badge, EvidenceMeter, RegulatoryBadge } from "@/components/ui/badge";
import { CONDITION_MAP } from "@/data/conditions";
import { GOAL_MAP } from "@/data/goals";
import { MEDICATION_CLASS_MAP } from "@/data/medications";
import {
  EVIDENCE_LABELS,
  FAMILY_LABELS,
  HUMAN_EVIDENCE_LABELS,
  JURISDICTION_LABELS,
  ROUTE_LABELS,
  type Compound,
  type GoalId,
} from "@/data/types";
import { cn, formatDate } from "@/lib/utils";
import {
  MAX_COMPARE,
  compoundHref,
  formatNumber,
  goalsAcross,
  studyStats,
  wadaLabel,
  type SelectableJurisdiction,
} from "@/lib/compare";
import { PREGNANCY_LABELS, PREGNANCY_TONE } from "./labels";

/* ------------------------------------------------------------------ */
/* Row definitions                                                     */
/* ------------------------------------------------------------------ */

interface Row {
  id: string;
  label: string;
  hint?: string;
  render: (compound: Compound) => React.ReactNode;
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-2">{children}</span>;
}

function Items({ items, max }: { items: string[]; max: number }) {
  if (items.length === 0) return <Muted>None recorded</Muted>;
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <ul className="space-y-1">
      {shown.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-ink/40" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
      {rest > 0 && <li className="pl-3 text-xs text-muted-2">+{rest} more on the compound page</li>}
    </ul>
  );
}

function buildRows(goals: GoalId[], jurisdiction: SelectableJurisdiction): Row[] {
  return [
    { id: "family", label: "Family", render: (c) => FAMILY_LABELS[c.family] },
    { id: "human", label: "Human evidence level", render: (c) => HUMAN_EVIDENCE_LABELS[c.humanEvidenceLevel] },
    {
      id: "overall",
      label: "Overall evidence",
      hint: "Most-researched use",
      render: (c) => (
        <span className="flex items-center gap-2 font-medium text-ink">
          <EvidenceMeter level={c.overallEvidence} />
          {EVIDENCE_LABELS[c.overallEvidence]}
        </span>
      ),
    },
    ...goals.map(
      (goal): Row => ({
        id: `goal-${goal}`,
        label: GOAL_MAP[goal].label,
        hint: "Evidence for goal",
        render: (c) => {
          const entry = c.goals.find((g) => g.goal === goal);
          if (!entry) return <Muted>— not researched for this goal</Muted>;
          return (
            <div>
              <span className="flex items-center gap-2 font-medium text-ink">
                <EvidenceMeter level={entry.evidence} />
                {EVIDENCE_LABELS[entry.evidence]}
              </span>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{entry.summary}</p>
            </div>
          );
        },
      }),
    ),
    {
      id: "regulatory",
      label: `Regulatory status`,
      hint: JURISDICTION_LABELS[jurisdiction],
      render: (c) => {
        const entry = c.regulatory[jurisdiction];
        return (
          <div>
            <RegulatoryBadge status={entry.status} size="xs" />
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{entry.summary}</p>
          </div>
        );
      },
    },
    {
      id: "wada",
      label: "Anti-doping (WADA)",
      render: (c) => (
        <span className={cn("flex items-center gap-1.5", c.wadaProhibited && "font-medium text-rose-800")}>
          {c.wadaProhibited && <ShieldAlert className="h-3.5 w-3.5" aria-hidden />}
          {wadaLabel(c.wadaProhibited)}
        </span>
      ),
    },
    { id: "routes", label: "Routes", render: (c) => c.routes.map((r) => ROUTE_LABELS[r]).join(", ") },
    {
      id: "pregnancy",
      label: "Pregnancy",
      render: (c) => (
        <div>
          <Badge tone={PREGNANCY_TONE[c.pregnancy.status]} size="xs" dot>
            {PREGNANCY_LABELS[c.pregnancy.status]}
          </Badge>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{c.pregnancy.note}</p>
        </div>
      ),
    },
    { id: "common", label: "Common adverse effects", hint: "Top 4", render: (c) => <Items items={c.commonAdverseEffects} max={4} /> },
    { id: "serious", label: "Serious adverse effects", hint: "Top 3", render: (c) => <Items items={c.seriousAdverseEffects} max={3} /> },
    {
      id: "contra",
      label: "Key contraindications",
      hint: "Absolute",
      render: (c) => {
        const absolute = c.contraindications.filter((x) => x.severity === "absolute").map((x) => CONDITION_MAP[x.conditionId].label);
        if (absolute.length === 0) return <Muted>None recorded as absolute</Muted>;
        return <Items items={absolute} max={absolute.length} />;
      },
    },
    {
      id: "interactions",
      label: "Interaction classes",
      hint: "Major",
      render: (c) => {
        const major = c.interactions.filter((x) => x.severity === "major").map((x) => MEDICATION_CLASS_MAP[x.classId].label);
        if (major.length === 0) return <Muted>None recorded as major</Muted>;
        return <Items items={major} max={major.length} />;
      },
    },
    {
      id: "studies",
      label: "Published human studies",
      hint: "In our database",
      render: (c) => {
        const { count, largestN } = studyStats(c);
        if (count === 0) return <Muted>None recorded</Muted>;
        return (
          <span>
            <span className="font-medium text-ink">
              {count} {count === 1 ? "study" : "studies"}
            </span>
            {largestN !== undefined && <span className="text-muted"> · largest n = {formatNumber(largestN)}</span>}
          </span>
        );
      },
    },
    { id: "monitoring", label: "Monitoring", hint: "Top 3", render: (c) => <Items items={c.monitoring} max={3} /> },
    { id: "reviewed", label: "Record last reviewed", render: (c) => formatDate(c.lastReviewed) },
    {
      id: "profile",
      label: "Full profile",
      render: (c) => (
        <Link href={compoundHref(c.slug)} className="inline-flex items-center gap-1 font-medium text-brand-700 underline-offset-4 hover:underline">
          Open {c.name}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      ),
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

const CELL = "border-b border-line px-4 py-3.5 text-sm leading-relaxed text-ink-3 last:border-b-0";
const HEADER_CELL = "border-b border-line px-4 pb-4 pt-5";

/**
 * Column-major comparison grid. Each compound is one CSS subgrid column so row
 * heights stay aligned; the label column is sticky for horizontal scrolling.
 */
export function CompareTable({
  compounds,
  jurisdiction,
  onRemove,
  onAdd,
}: {
  compounds: Compound[];
  jurisdiction: SelectableJurisdiction;
  onRemove: (slug: string) => void;
  onAdd: () => void;
}) {
  const reduce = useReducedMotion();
  const rows = buildRows(goalsAcross(compounds), jurisdiction);
  const showAddColumn = compounds.length < MAX_COMPARE;
  const columnCount = compounds.length + (showAddColumn ? 1 : 0);
  const trackCount = rows.length + 1;

  return (
    <div className="-mx-5 sm:mx-0">
      <div className="snap-x snap-proximity overflow-x-auto border-y border-line bg-white scroll-pl-[8.5rem] [scrollbar-width:thin] sm:rounded-2xl sm:border sm:shadow-soft sm:scroll-pl-[11rem]">
        <div
          role="group"
          aria-label={`Comparison of ${compounds.map((c) => c.name).join(", ")}`}
          className="grid grid-cols-[8.5rem_repeat(var(--cols),minmax(13.5rem,1fr))] sm:grid-cols-[11rem_repeat(var(--cols),minmax(15rem,1fr))]"
          style={{ "--cols": columnCount, gridTemplateRows: `repeat(${trackCount}, auto)` } as React.CSSProperties}
        >
          {/* Sticky row labels (visual only — every cell carries its own label for assistive tech) */}
          <div
            aria-hidden
            className="sticky left-0 z-10 row-span-full grid grid-cols-[minmax(0,1fr)] grid-rows-subgrid border-r border-line bg-paper-2 shadow-[6px_0_16px_-12px_rgb(11_18_32/0.35)]"
          >
            <div className={cn(HEADER_CELL, "flex items-end")}>
              <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-2">
                {compounds.length} of {MAX_COMPARE}
              </span>
            </div>
            {rows.map((row) => (
              <div key={row.id} className={cn(CELL, "text-xs")}>
                <span className="block font-medium text-ink">{row.label}</span>
                {row.hint && <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-2">{row.hint}</span>}
              </div>
            ))}
          </div>

          {/* One column per compound */}
          {compounds.map((c, i) => (
            <motion.div
              key={c.slug}
              layout={reduce ? false : "position"}
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                // minmax(0,1fr) keeps every cell exactly one track wide, whatever its content's min-content size.
                "row-span-full grid min-w-0 snap-start grid-cols-[minmax(0,1fr)] grid-rows-subgrid bg-white",
                i < compounds.length - 1 || showAddColumn ? "border-r border-line" : "",
              )}
              role="group"
              aria-label={c.name}
            >
              <div className={cn(HEADER_CELL, "flex items-start justify-between gap-2")}>
                <div className="min-w-0">
                  <Link href={compoundHref(c.slug)} className="font-display text-xl leading-tight text-ink underline-offset-4 hover:underline">
                    {c.name}
                  </Link>
                  <p className="mt-1 truncate font-mono text-[0.62rem] uppercase tracking-[0.12em] text-brand-700" title={c.classLabel}>
                    {c.classLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(c.slug)}
                  aria-label={`Remove ${c.name} from comparison`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
              {rows.map((row) => (
                <div key={row.id} className={cn(CELL, "min-w-0")}>
                  <span className="sr-only">{row.label}: </span>
                  {row.render(c)}
                </div>
              ))}
            </motion.div>
          ))}

          {/* Add-a-compound column */}
          {showAddColumn && (
            <div className="row-span-full flex snap-start items-start justify-center bg-paper/60 p-4">
              <button
                type="button"
                onClick={onAdd}
                className="group flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong px-4 py-8 text-center transition-colors hover:border-ink/40 hover:bg-white"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-soft transition-transform group-hover:scale-105">
                  <Plus className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-sm font-medium text-ink">{compounds.length === 1 ? "Add a compound to compare against" : "Add another compound"}</span>
                <span className="text-xs text-muted">Up to {MAX_COMPARE} side by side</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 px-5 text-xs text-muted sm:hidden">Swipe sideways to see every compound. The attribute column stays in place.</p>
    </div>
  );
}
