"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { ProductSwatch } from "@/components/commerce/product-image";
import { Badge, RegulatoryBadge } from "@/components/ui/badge";
import { CONDITION_MAP } from "@/data/conditions";
import { GOAL_MAP } from "@/data/goals";
import { MEDICATION_CLASS_MAP } from "@/data/medications";
import {
  FAMILY_LABELS,
  HUMAN_EVIDENCE_LABELS,
  JURISDICTION_LABELS,
  ROUTE_LABELS,
  type Compound,
  type GoalId,
} from "@/data/types";
import { BRAND } from "@/lib/brand";
import {
  MAX_COMPARE,
  commerceForCompound,
  compoundHref,
  formatNumber,
  goalsAcross,
  joinNames,
  studyStats,
  wadaLabel,
  type SelectableJurisdiction,
} from "@/lib/compare";
import { cn, formatDate } from "@/lib/utils";
import { CommerceCta } from "./commerce-cta";
import { PREGNANCY_LABELS, PREGNANCY_TONE } from "./labels";
import { Marker, MeterLabel } from "./primitives";

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
          <Marker className="mt-[0.5rem] h-1.5 w-1.5 bg-muted-2" />
          <span>{item}</span>
        </li>
      ))}
      {rest > 0 && <li className="label-mono pl-3.5">+{rest} more on the compound page</li>}
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
      render: (c) => <MeterLabel level={c.overallEvidence} className="text-ink" />,
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
              <MeterLabel level={entry.evidence} className="text-ink" />
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{entry.summary}</p>
            </div>
          );
        },
      }),
    ),
    {
      id: "regulatory",
      label: "Regulatory status",
      hint: JURISDICTION_LABELS[jurisdiction],
      render: (c) => {
        const entry = c.regulatory[jurisdiction];
        return (
          <div>
            <RegulatoryBadge status={entry.status} size="xs" />
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{entry.summary}</p>
          </div>
        );
      },
    },
    {
      id: "price",
      label: "Price",
      hint: `${BRAND.range.name} range · per pen`,
      render: (c) => {
        const k = commerceForCompound(c.slug);
        return (
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[14px] text-ink tnum">
              {k.product && <ProductSwatch product={k.product} />}
              {k.priceLabel}
            </span>
            {k.inBlend && k.blendPartners && k.blendPartners.length > 0 && (
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                Blend pen — {c.name} with {joinNames(k.blendPartners)}
              </p>
            )}
            {k.channelLabel && <p className="label-mono mt-1">{k.channelLabel}</p>}
            {k.product && (
              <Link href={k.href} className="link-rule mt-1.5 inline-flex items-center gap-1 text-[12.5px] text-ink">
                {k.product.name} pen
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </Link>
            )}
          </div>
        );
      },
    },
    {
      id: "availability",
      label: "Availability",
      hint: "Batch-tested stock",
      render: (c) => {
        const k = commerceForCompound(c.slug);
        return (
          <div>
            <span className="font-medium text-ink">
              {k.availabilityLabel}
              {k.inBlend && k.product && <span className="font-normal text-muted"> · in {k.product.name}</span>}
            </span>
            {k.product?.coa && (
              <p className="mt-1 font-mono text-[11.5px] leading-relaxed text-muted tnum">
                Lot {k.product.coa.batch} · {k.product.coa.purity}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: "wada",
      label: "Anti-doping (WADA)",
      render: (c) => (
        <span className={cn("flex items-center gap-2", c.wadaProhibited && "font-medium text-accent-700")}>
          {c.wadaProhibited && <Marker className="bg-accent-500" />}
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
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{c.pregnancy.note}</p>
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
          <span className="tnum">
            <span className="font-medium text-ink">
              {count} {count === 1 ? "study" : "studies"}
            </span>
            {largestN !== undefined && <span className="text-muted"> · largest n = {formatNumber(largestN)}</span>}
          </span>
        );
      },
    },
    { id: "monitoring", label: "Monitoring", hint: "Top 3", render: (c) => <Items items={c.monitoring} max={3} /> },
    { id: "reviewed", label: "Record last reviewed", render: (c) => <span className="tnum">{formatDate(c.lastReviewed)}</span> },
    {
      id: "profile",
      label: "Full profile",
      render: (c) => (
        <Link href={compoundHref(c.slug)} className="link-rule inline-flex items-center gap-1 font-medium text-ink">
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

const CELL = "border-b border-line px-4 py-3 text-[14px] leading-relaxed text-ink-3 last:border-b-0";
const HEADER_CELL = "border-b border-ink px-4 pb-4 pt-4";

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
  const rows = buildRows(goalsAcross(compounds), jurisdiction);
  const showAddColumn = compounds.length < MAX_COMPARE;
  const columnCount = compounds.length + (showAddColumn ? 1 : 0);
  const trackCount = rows.length + 1;

  return (
    <div className="-mx-4 sm:mx-0">
      <div className="snap-x snap-proximity overflow-x-auto border-y border-ink bg-white scroll-pl-[8.5rem] [contain:paint] [scrollbar-width:thin] sm:border sm:scroll-pl-[11rem]">
        <div
          role="group"
          aria-label={`Comparison of ${compounds.map((c) => c.name).join(", ")}`}
          className="grid grid-cols-[8.5rem_repeat(var(--cols),minmax(13.5rem,1fr))] sm:grid-cols-[11rem_repeat(var(--cols),minmax(15rem,1fr))]"
          style={{ "--cols": columnCount, gridTemplateRows: `repeat(${trackCount}, auto)` } as React.CSSProperties}
        >
          {/* Sticky row labels (visual only — every cell carries its own label for assistive tech) */}
          <div aria-hidden className="sticky left-0 z-10 row-span-full grid grid-cols-[minmax(0,1fr)] grid-rows-subgrid border-r border-ink bg-paper-2">
            <div className={cn(HEADER_CELL, "flex items-end")}>
              <span className="label-mono tnum">
                {compounds.length} of {MAX_COMPARE}
              </span>
            </div>
            {rows.map((row) => (
              <div key={row.id} className={cn(CELL, "text-[12px]")}>
                <span className="block break-words font-mono font-medium uppercase tracking-[0.06em] text-ink [overflow-wrap:anywhere]">{row.label}</span>
                {row.hint && <span className="label-mono mt-0.5 block text-[10px]">{row.hint}</span>}
              </div>
            ))}
          </div>

          {/* One column per compound */}
          {compounds.map((c, i) => {
            const commerce = commerceForCompound(c.slug);
            return (
              <div
                key={c.slug}
                className={cn(
                  // minmax(0,1fr) keeps every cell exactly one track wide, whatever its content's min-content size.
                  "row-span-full grid min-w-0 snap-start grid-cols-[minmax(0,1fr)] grid-rows-subgrid bg-white",
                  i < compounds.length - 1 || showAddColumn ? "border-r border-ink" : "",
                )}
                role="group"
                aria-label={c.name}
              >
                <div className={cn(HEADER_CELL, "flex flex-col gap-3")}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={compoundHref(c.slug)}
                        className="font-display block break-words text-[1.2rem] uppercase leading-none text-ink transition-colors duration-150 hover:text-brand-600"
                      >
                        {c.name}
                      </Link>
                      <p className="label-mono mt-2 break-words" title={c.classLabel}>
                        {c.classLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(c.slug)}
                      aria-label={`Remove ${c.name} from comparison`}
                      className="-mr-3 -mt-3 inline-flex h-11 w-11 shrink-0 items-center justify-center text-muted transition-colors duration-150 hover:bg-ink hover:text-white"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.06em] text-ink tnum">
                      {commerce.product && <ProductSwatch product={commerce.product} />}
                      <span className="min-w-0">
                        {commerce.priceLabel}
                        {commerce.state === "buy" && <span className="text-muted"> · {commerce.availabilityLabel}</span>}
                      </span>
                    </p>
                    <CommerceCta commerce={commerce} size="sm" compact className="w-full" />
                  </div>
                </div>
                {rows.map((row) => (
                  <div key={row.id} className={cn(CELL, "min-w-0")}>
                    <span className="sr-only">{row.label}: </span>
                    {row.render(c)}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Add-a-compound column */}
          {showAddColumn && (
            <div className="row-span-full flex snap-start items-start justify-center bg-paper-2 p-4">
              <button
                type="button"
                onClick={onAdd}
                className="flex w-full flex-col items-center gap-3 border border-ink bg-white px-4 py-8 text-center transition-colors duration-150 hover:bg-ink hover:text-white"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center border border-current">
                  <Plus className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-[14px] font-medium">{compounds.length === 1 ? "Add a compound to compare against" : "Add another compound"}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] opacity-60">Up to {MAX_COMPARE} side by side</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="label-mono mt-3 px-4 sm:hidden">Swipe sideways to see every compound. The attribute column stays in place.</p>
    </div>
  );
}
