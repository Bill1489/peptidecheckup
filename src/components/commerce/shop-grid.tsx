"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GOALS } from "@/data/goals";
import type { GoalId } from "@/data/types";
import { CATEGORY_LABELS, PRODUCTS, type Product, type ProductCategory, type SaleChannel } from "@/data/products";
import { GridFillers } from "@/components/commerce/grid-fillers";
import { ProductCard } from "@/components/commerce/product-card";
import { CHANNEL_SHORT } from "@/components/commerce/product-utils";
import { Button } from "@/components/ui/button";
import { RESEARCH_USE_LABEL } from "@/lib/brand";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Options (derived from the catalogue once)                           */
/* ------------------------------------------------------------------ */

const GOAL_OPTIONS = GOALS.filter((g) => g.id !== "other")
  .map((g) => ({ id: g.id, label: g.short, count: PRODUCTS.filter((p) => p.goals.includes(g.id)).length }))
  .filter((o) => o.count > 0);

/** Category and channel filters stay wired up but only render when the range has more than one member. */
const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as ProductCategory[])
  .map((id) => ({ id, label: CATEGORY_LABELS[id], count: PRODUCTS.filter((p) => p.category === id).length }))
  .filter((o) => o.count > 0);
const CHANNEL_OPTIONS = (Object.keys(CHANNEL_SHORT) as SaleChannel[])
  .map((id) => ({ id, label: CHANNEL_SHORT[id], count: PRODUCTS.filter((p) => p.channel === id).length }))
  .filter((o) => o.count > 0);

function isGoal(v: string | null): v is GoalId {
  return !!v && GOAL_OPTIONS.some((g) => g.id === v);
}
function isCategory(v: string | null): v is ProductCategory {
  return !!v && CATEGORY_OPTIONS.some((c) => c.id === v);
}
function isChannel(v: string | null): v is SaleChannel {
  return !!v && CHANNEL_OPTIONS.some((c) => c.id === v);
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Chip({ active, onClick, count, children }: { active: boolean; onClick: () => void; count?: number; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-1.5 border px-3.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] transition-colors duration-150",
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-3 hover:border-ink hover:text-ink",
      )}
    >
      {children}
      {count !== undefined && <span className={cn("tnum", active ? "text-white/60" : "text-muted-2")}>{count}</span>}
    </button>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string; count: number }[];
  value: T | null;
  onChange: (next: T | null) => void;
}) {
  return (
    <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto lg:flex-wrap" role="group" aria-label={label}>
      <span className="label-mono shrink-0 pr-3">{label}</span>
      <Chip active={value === null} onClick={() => onChange(null)}>
        All
      </Chip>
      {options.map((o) => (
        <Chip key={o.id} active={value === o.id} count={o.count} onClick={() => onChange(value === o.id ? null : o.id)}>
          {o.label}
        </Chip>
      ))}
    </div>
  );
}

/** Server-safe fallback for the Suspense boundary around the grid. */
export function ShopGridSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-11 w-2/3 skeleton" />
      <div className="mt-6 h-9 rule-y" />
      <ul className="cell-grid mt-6 grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="flex flex-col">
            <div className="aspect-square skeleton" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-2/3 skeleton" />
              <div className="h-3 w-1/2 skeleton" />
              <div className="h-4 w-1/3 skeleton" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grid                                                                */
/* ------------------------------------------------------------------ */

export function ShopGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const goal = isGoal(params.get("goal")) ? (params.get("goal") as GoalId) : null;
  const category = isCategory(params.get("category")) ? (params.get("category") as ProductCategory) : null;
  const channel = isChannel(params.get("channel")) ? (params.get("channel") as SaleChannel) : null;

  const update = React.useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const results = React.useMemo<Product[]>(
    () => PRODUCTS.filter((p) => (!goal || p.goals.includes(goal)) && (!category || p.category === category) && (!channel || p.channel === channel)),
    [goal, category, channel],
  );

  const activeCount = (goal ? 1 : 0) + (category ? 1 : 0) + (channel ? 1 : 0);
  const clearAll = () => update({ goal: null, category: null, channel: null });

  return (
    <div>
      {/* Filters — only rows with more than one member are shown */}
      <div className="flex flex-col gap-3">
        <FilterRow label="Goal" options={GOAL_OPTIONS} value={goal} onChange={(v) => update({ goal: v })} />
        {CATEGORY_OPTIONS.length > 1 && (
          <FilterRow label="Type" options={CATEGORY_OPTIONS} value={category} onChange={(v) => update({ category: v })} />
        )}
        {CHANNEL_OPTIONS.length > 1 && (
          <FilterRow label="Channel" options={CHANNEL_OPTIONS} value={channel} onChange={(v) => update({ channel: v })} />
        )}
      </div>

      {/* Strip — research notice + result count */}
      <div className="mt-6 flex flex-col gap-2 rule-y py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3" title={RESEARCH_USE_LABEL}>
          <span className="h-1.5 w-1.5 shrink-0 bg-accent-500" aria-hidden />
          Research use only · 18+ · intended-use acknowledgement at checkout
        </p>
        <p aria-live="polite" className="flex items-center gap-3 tnum">
          <span className="text-ink">{results.length}</span> of {PRODUCTS.length} pens
          {activeCount > 0 && (
            <button type="button" onClick={clearAll} className="link-rule text-ink normal-case tracking-normal">
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* Grid */}
      {results.length === 0 ? (
        <div className="mt-6 border border-ink p-8 text-center sm:p-14">
          <p className="label-mono">No match</p>
          <h2 className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">No pen in the range is researched for that</h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] text-muted">
            Clear the filter to see all six, or read the evidence directory to understand what has and has not been studied.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button variant="primary" size="md" onClick={clearAll}>
              Show all six
            </Button>
            <Button variant="secondary" size="md" href="/peptides/">
              Evidence directory
            </Button>
          </div>
        </div>
      ) : (
        <ul className="cell-grid mt-6 grid-cols-2 lg:grid-cols-3" aria-label="The range">
          {results.map((p, i) => (
            <li key={p.id} className="flex">
              <ProductCard product={p} className="w-full" priority={i < 3} />
            </li>
          ))}
          <GridFillers count={results.length} cols={{ base: 2, lg: 3, xl: 3 }} />
        </ul>
      )}
    </div>
  );
}
