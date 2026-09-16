"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { GOALS } from "@/data/goals";
import type { GoalId } from "@/data/types";
import {
  CATEGORY_LABELS,
  PRODUCTS,
  priceRange,
  searchProducts,
  type Product,
  type ProductCategory,
  type SaleChannel,
} from "@/data/products";
import { GridFillers } from "@/components/commerce/grid-fillers";
import { ProductCard } from "@/components/commerce/product-card";
import { inStockNow } from "@/components/commerce/product-utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Options (derived from the catalogue once)                           */
/* ------------------------------------------------------------------ */

const CATEGORY_ORDER: ProductCategory[] = ["peptide", "kit", "supplies", "topical", "oral"];
const CATEGORY_OPTIONS = CATEGORY_ORDER.map((id) => ({
  id,
  label: CATEGORY_LABELS[id],
  count: PRODUCTS.filter((p) => p.category === id).length,
})).filter((o) => o.count > 0);

const GOAL_OPTIONS = GOALS.filter((g) => g.id !== "other")
  .map((g) => ({ id: g.id, label: g.short, count: PRODUCTS.filter((p) => p.goals.includes(g.id)).length }))
  .filter((o) => o.count > 0);

type ChannelFilter = Extract<SaleChannel, "research" | "prescription" | "supplies">;
const CHANNEL_OPTIONS: { id: ChannelFilter; label: string }[] = [
  { id: "research", label: "Research" },
  { id: "prescription", label: "Consultation" },
  { id: "supplies", label: "Supplies" },
];

type SortKey = "featured" | "price_asc" | "price_desc" | "name";
const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price_asc", label: "Price low–high" },
  { id: "price_desc", label: "Price high–low" },
  { id: "name", label: "Name A–Z" },
];

function isCategory(v: string | null): v is ProductCategory {
  return !!v && CATEGORY_ORDER.includes(v as ProductCategory);
}
function isGoal(v: string | null): v is GoalId {
  return !!v && GOAL_OPTIONS.some((g) => g.id === v);
}
function isChannel(v: string | null): v is ChannelFilter {
  return !!v && CHANNEL_OPTIONS.some((c) => c.id === v);
}
function isSort(v: string | null): v is SortKey {
  return !!v && SORT_OPTIONS.some((s) => s.id === v);
}

/** Price used for sorting: consultation / not-sold products (price 0) sink to the end. */
function sortPrice(p: Product) {
  const { min } = priceRange(p);
  return min === 0 ? Number.POSITIVE_INFINITY : min;
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const byCatalogue = (a: Product, b: Product) => PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b);
  const copy = [...list];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => sortPrice(a) - sortPrice(b) || byCatalogue(a, b));
    case "price_desc":
      return copy.sort((a, b) => {
        const pa = sortPrice(a);
        const pb = sortPrice(b);
        if (pa === Number.POSITIVE_INFINITY && pb === Number.POSITIVE_INFINITY) return byCatalogue(a, b);
        if (pa === Number.POSITIVE_INFINITY) return 1;
        if (pb === Number.POSITIVE_INFINITY) return -1;
        return pb - pa || byCatalogue(a, b);
      });
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default: {
      const rank = (p: Product) => (p.featured ? 0 : p.bestseller ? 1 : p.isNew ? 2 : p.availability === "not_sold" ? 4 : 3);
      return copy.sort((a, b) => rank(a) - rank(b) || byCatalogue(a, b));
    }
  }
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Chip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 border px-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] transition-colors duration-150",
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-3 hover:border-ink hover:text-ink",
      )}
    >
      {children}
      {count !== undefined && <span className={cn("tnum", active ? "text-white/60" : "text-muted-2")}>{count}</span>}
    </button>
  );
}

function RailLabel({ children }: { children: React.ReactNode }) {
  return <span className="label-mono shrink-0 pr-3 leading-9">{children}</span>;
}

/** Server-safe fallback for the Suspense boundary around the grid. */
export function ShopGridSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-12 border border-ink bg-white" />
      <div className="mt-4 h-9 w-2/3 skeleton" />
      <div className="mt-6 h-9 rule-y" />
      <ul className="cell-grid mt-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
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

  const category = isCategory(params.get("category")) ? (params.get("category") as ProductCategory) : null;
  const goal = isGoal(params.get("goal")) ? (params.get("goal") as GoalId) : null;
  const channel = isChannel(params.get("channel")) ? (params.get("channel") as ChannelFilter) : null;
  const sort: SortKey = isSort(params.get("sort")) ? (params.get("sort") as SortKey) : "featured";
  const inStockOnly = params.get("stock") === "in";
  const q = params.get("q") ?? "";

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

  // Search box: local draft, debounced into the URL. When the URL changes
  // underneath us (back button, footer link) the draft follows it.
  const [draft, setDraft] = React.useState(q);
  const [seenQ, setSeenQ] = React.useState(q);
  if (q !== seenQ) {
    setSeenQ(q);
    if (draft.trim() !== q.trim()) setDraft(q);
  }
  React.useEffect(() => {
    if (draft === q) return;
    const t = setTimeout(() => update({ q: draft.trim() }), 250);
    return () => clearTimeout(t);
  }, [draft, q, update]);

  const results = React.useMemo(() => {
    const base = q.trim() ? searchProducts(q, PRODUCTS.length) : PRODUCTS;
    const filtered = base.filter(
      (p) =>
        (!category || p.category === category) &&
        (!goal || p.goals.includes(goal)) &&
        (!channel || p.channel === channel) &&
        (!inStockOnly || inStockNow(p.availability)),
    );
    return sortProducts(filtered, sort);
  }, [q, category, goal, channel, inStockOnly, sort]);

  const activeCount = (category ? 1 : 0) + (goal ? 1 : 0) + (channel ? 1 : 0) + (inStockOnly ? 1 : 0) + (q ? 1 : 0);
  const clearAll = () => {
    setDraft("");
    update({ category: null, goal: null, channel: null, stock: null, q: null });
  };

  return (
    <div>
      {/* Row 1 — category tabs + sort */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:justify-between">
        <div role="group" aria-label="Category" className="no-scrollbar flex overflow-x-auto border border-ink">
          <CategoryTab active={!category} onClick={() => update({ category: null })} count={PRODUCTS.length}>
            All
          </CategoryTab>
          {CATEGORY_OPTIONS.map((c) => (
            <CategoryTab key={c.id} active={category === c.id} onClick={() => update({ category: category === c.id ? null : c.id })} count={c.count}>
              {c.label}
            </CategoryTab>
          ))}
        </div>
        <div className="flex items-stretch gap-3">
          <label className="relative flex flex-1 items-stretch border border-ink lg:w-64 lg:flex-none">
            <span className="sr-only">Search the catalogue</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search"
              autoComplete="off"
              className="h-12 w-full bg-white pl-9 pr-9 font-mono text-[12px] uppercase tracking-[0.08em] text-ink placeholder:text-muted-2 focus:outline-none"
            />
            {draft && (
              <button
                type="button"
                onClick={() => setDraft("")}
                aria-label="Clear search"
                className="absolute right-0 top-0 inline-flex h-12 w-9 items-center justify-center text-muted hover:text-ink"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          </label>
          <label className="flex items-stretch border border-ink">
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })}
              className="h-12 appearance-none bg-white pl-3 pr-8 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink focus:outline-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M0 0h10L5 6z' fill='%230b0b0c'/></svg>\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Row 2 — goal chips, channel chips, stock toggle */}
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto lg:flex-wrap">
          <RailLabel>Goal</RailLabel>
          {GOAL_OPTIONS.map((g) => (
            <Chip key={g.id} active={goal === g.id} count={g.count} onClick={() => update({ goal: goal === g.id ? null : g.id })}>
              {g.label}
            </Chip>
          ))}
        </div>
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto lg:shrink-0">
          <RailLabel>Channel</RailLabel>
          {CHANNEL_OPTIONS.map((c) => (
            <Chip key={c.id} active={channel === c.id} onClick={() => update({ channel: channel === c.id ? null : c.id })}>
              {c.label}
            </Chip>
          ))}
          <button
            type="button"
            role="switch"
            aria-checked={inStockOnly}
            onClick={() => update({ stock: inStockOnly ? null : "in" })}
            className={cn(
              "ml-2 inline-flex h-9 shrink-0 items-center gap-2 border px-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] transition-colors duration-150",
              inStockOnly ? "border-ink bg-white text-ink" : "border-line bg-white text-ink-3 hover:border-ink hover:text-ink",
            )}
          >
            <span className={cn("h-2.5 w-2.5 border border-current", inStockOnly && "bg-brand-600 border-brand-600")} aria-hidden />
            In stock only
          </button>
        </div>
      </div>

      {/* Strip — research notice + result count */}
      <div className="mt-6 flex flex-col gap-2 rule-y py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 bg-accent-500" aria-hidden />
          Research-channel products · research use only · 18+ · intended-use acknowledgement at checkout
        </p>
        <p aria-live="polite" className="flex items-center gap-3 tnum">
          <span className="text-ink">{results.length}</span> of {PRODUCTS.length}
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
          <h2 className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">Nothing in the catalogue fits those filters</h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] text-muted">
            Try another spelling, or clear the filters. If the compound you want is missing, the evidence directory may explain why we do not stock it.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Button variant="primary" size="md" onClick={clearAll}>
              Clear filters
            </Button>
            <Button variant="secondary" size="md" href="/peptides/">
              Evidence directory
            </Button>
          </div>
        </div>
      ) : (
        <ul className="cell-grid mt-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Products">
          {results.map((p) => (
            <li key={p.id} className="flex">
              <ProductCard product={p} className="w-full" />
            </li>
          ))}
          <GridFillers count={results.length} cols={{ base: 2, lg: 3, xl: 4 }} />
        </ul>
      )}
    </div>
  );
}

function CategoryTab({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 border-r border-ink px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-150 last:border-r-0",
        active ? "bg-ink text-white" : "bg-white text-ink hover:bg-paper-2",
      )}
    >
      {children}
      <span className={cn("tnum", active ? "text-white/60" : "text-muted")}>{count}</span>
    </button>
  );
}
