"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { RangeCompare } from "@/components/commerce/range-compare";
import { RANGE_CATEGORIES, rangeCategoriesWithProducts, type RangeCategoryId } from "@/components/commerce/product-utils";
import { cn } from "@/lib/utils";

const GROUPS = rangeCategoriesWithProducts();

function isCategory(v: string | null): v is RangeCategoryId {
  return !!v && GROUPS.some((g) => g.category.id === v);
}

/**
 * "Compare the range" for a range too wide for one table: one tab per
 * manufacturer's category (never more than a handful of columns), the table
 * underneath keeping its sticky first column and horizontal scroll. Opens on
 * the category the grid is filtered to, when there is one.
 */
export function RangeCompareTabs({ className }: { className?: string }) {
  const params = useSearchParams();
  const fromUrl = params.get("category");
  const fallback = GROUPS[0]?.category.id ?? RANGE_CATEGORIES[0].id;

  // The selected tab, plus the URL value it was last reconciled with, so a
  // change to the grid's category filter re-selects the tab during render
  // (the "state from previous render" pattern — no effect needed).
  const [state, setState] = React.useState<{ url: string | null; active: RangeCategoryId }>({ url: fromUrl, active: isCategory(fromUrl) ? fromUrl : fallback });
  let active = state.active;
  if (state.url !== fromUrl) {
    active = isCategory(fromUrl) ? fromUrl : state.active;
    setState({ url: fromUrl, active });
  }
  const setActive = (id: RangeCategoryId) => setState({ url: fromUrl, active: id });

  const tabsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const current = GROUPS.find((g) => g.category.id === active) ?? GROUPS[0];
  if (!current) return null;

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = GROUPS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(GROUPS[next].category.id);
    tabsRef.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label="Compare by category" className="no-scrollbar flex gap-1.5 overflow-x-auto lg:flex-wrap">
        {GROUPS.map((g, i) => {
          const selected = g.category.id === active;
          return (
            <button
              key={g.category.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`compare-tab-${g.category.id}`}
              aria-selected={selected}
              aria-controls="compare-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(g.category.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-1.5 border px-3.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] transition-colors duration-150",
                selected ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-3 hover:border-ink hover:text-ink",
              )}
            >
              {g.category.label}
              <span className={cn("tnum", selected ? "text-white/60" : "text-muted-2")}>{g.products.length}</span>
            </button>
          );
        })}
      </div>
      <div id="compare-panel" role="tabpanel" aria-labelledby={`compare-tab-${current.category.id}`} className="mt-4">
        <p className="mb-3 text-[13px] leading-relaxed text-muted">
          <span className="font-medium text-ink">{current.category.label}</span> · {current.products.length} {current.products.length === 1 ? "pen" : "pens"} ·{" "}
          {current.category.blurb}
        </p>
        <RangeCompare products={current.products} caption={`${current.category.label} compared`} className="bg-white" />
      </div>
    </div>
  );
}

/** Server-safe fallback for the Suspense boundary: the first category, no interactivity. */
export function RangeCompareTabsSkeleton({ className }: { className?: string }) {
  const first = GROUPS[0];
  if (!first) return null;
  return (
    <div className={className} aria-hidden>
      <div className="flex gap-1.5 overflow-hidden">
        {GROUPS.map((g) => (
          <span
            key={g.category.id}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-1.5 border px-3.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]",
              g.category.id === first.category.id ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-3",
            )}
          >
            {g.category.label}
            <span className="tnum text-muted-2">{g.products.length}</span>
          </span>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-3 text-[13px] leading-relaxed text-muted">
          <span className="font-medium text-ink">{first.category.label}</span> · {first.products.length} pens · {first.category.blurb}
        </p>
        <RangeCompare products={first.products} caption={`${first.category.label} compared`} className="bg-white" />
      </div>
    </div>
  );
}
