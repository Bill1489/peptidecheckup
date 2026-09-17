"use client";

import * as React from "react";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { COMPOUNDS, searchCompounds } from "@/data/compounds";
import { GOALS } from "@/data/goals";
import {
  EVIDENCE_LABELS,
  EVIDENCE_RANK,
  FAMILY_LABELS,
  JURISDICTION_LABELS,
  REGULATORY_LABELS,
  ROUTE_LABELS,
  type Compound,
  type CompoundFamily,
  type EvidenceQuality,
  type GoalId,
  type RegulatoryStatus,
  type Route,
} from "@/data/types";
import { BRAND } from "@/lib/brand";
import { MAX_COMPARE, RANGE_SLUGS, REGULATORY_RANK, inRange, type SelectableJurisdiction } from "@/lib/compare";
import { useHydratePrefs, usePrefsStore } from "@/lib/compare-store";
import { cn } from "@/lib/utils";
import { CompareBar } from "./compare-bar";
import { CompoundCard } from "./compound-card";
import { JurisdictionSwitch } from "./jurisdiction-switch";
import { CellGrid } from "./primitives";
import { Segmented } from "./segmented";

/* ------------------------------------------------------------------ */
/* Static option lists (derived from the registry once)                */
/* ------------------------------------------------------------------ */

interface Option<T extends string> {
  id: T;
  label: string;
  count: number;
}

const EVIDENCE_ORDER: EvidenceQuality[] = ["strong", "moderate", "limited", "preliminary", "insufficient"];
const REGULATORY_ORDER: RegulatoryStatus[] = ["authorised", "investigational", "unclear", "not_authorised"];
const FAMILY_ORDER = Object.keys(FAMILY_LABELS) as CompoundFamily[];
const ROUTE_ORDER = Object.keys(ROUTE_LABELS) as Route[];

const GOAL_OPTIONS: Option<GoalId>[] = GOALS.map((g) => ({
  id: g.id,
  label: g.short,
  count: COMPOUNDS.filter((c) => c.goals.some((x) => x.goal === g.id)).length,
})).filter((o) => o.count > 0);

const FAMILY_OPTIONS: Option<CompoundFamily>[] = FAMILY_ORDER.map((f) => ({
  id: f,
  label: FAMILY_LABELS[f],
  count: COMPOUNDS.filter((c) => c.family === f).length,
})).filter((o) => o.count > 0);

const EVIDENCE_OPTIONS: Option<EvidenceQuality>[] = EVIDENCE_ORDER.map((e) => ({
  id: e,
  label: EVIDENCE_LABELS[e],
  count: COMPOUNDS.filter((c) => c.overallEvidence === e).length,
}));

const ROUTE_OPTIONS: Option<Route>[] = ROUTE_ORDER.map((r) => ({
  id: r,
  label: ROUTE_LABELS[r],
  count: COMPOUNDS.filter((c) => c.routes.includes(r)).length,
})).filter((o) => o.count > 0);

type SortKey = "range" | "evidence" | "name" | "regulatory" | "family";

/** "Range" is the default: the compounds in the Aervyn range first, then evidence. */
const SORT_OPTIONS: { value: SortKey; label: string; title: string }[] = [
  { value: "range", label: "Range", title: `${BRAND.displayName} range first, then evidence` },
  { value: "evidence", label: "Evidence", title: "Evidence (strongest first)" },
  { value: "name", label: "Name", title: "Name (A–Z)" },
  { value: "regulatory", label: "Regulatory", title: "Regulatory (authorised first)" },
  { value: "family", label: "Family", title: "Family" },
];

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function sortCompounds(list: Compound[], sort: SortKey, jurisdiction: SelectableJurisdiction): Compound[] {
  const byEvidence = (a: Compound, b: Compound) => EVIDENCE_RANK[b.overallEvidence] - EVIDENCE_RANK[a.overallEvidence];
  const byName = (a: Compound, b: Compound) => a.name.localeCompare(b.name);
  // Ties keep the curated registry order (the database's default display order).
  const byRegistry = (a: Compound, b: Compound) => COMPOUNDS.indexOf(a) - COMPOUNDS.indexOf(b);
  // Range pens in catalogue order, then everything else.
  const byRange = (a: Compound, b: Compound) => {
    const ia = RANGE_SLUGS.indexOf(a.slug);
    const ib = RANGE_SLUGS.indexOf(b.slug);
    return Number(ia === -1) - Number(ib === -1) || ia - ib;
  };
  const copy = [...list];
  switch (sort) {
    case "range":
      return copy.sort((a, b) => byRange(a, b) || byEvidence(a, b) || byRegistry(a, b));
    case "name":
      return copy.sort(byName);
    case "regulatory":
      return copy.sort(
        (a, b) =>
          REGULATORY_RANK[a.regulatory[jurisdiction].status] - REGULATORY_RANK[b.regulatory[jurisdiction].status] ||
          byEvidence(a, b) ||
          byRegistry(a, b),
      );
    case "family":
      return copy.sort(
        (a, b) => FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family) || byEvidence(a, b) || byRegistry(a, b),
      );
    default:
      return copy.sort((a, b) => byEvidence(a, b) || byRegistry(a, b));
  }
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function Chip({
  active,
  disabled,
  count,
  onClick,
  className,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  count?: number;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 items-center gap-2 border px-3 font-mono text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-150 sm:h-9 sm:px-2.5",
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink",
        disabled && "pointer-events-none opacity-40",
        className,
      )}
    >
      {children}
      {count !== undefined && <span className={cn("tnum", active ? "text-white/60" : "text-muted-2")}>{count}</span>}
    </button>
  );
}

function FilterGroup({
  label,
  selected,
  children,
}: {
  label: string;
  selected: number;
  children: React.ReactNode;
}) {
  const id = React.useId();
  return (
    <div role="group" aria-labelledby={id} className="min-w-0">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-line bg-paper-2 px-3">
        <p id={id} className="label-mono truncate text-ink">
          {label}
        </p>
        <p className="label-mono tnum" aria-live="polite">
          {selected > 0 ? `${selected} on` : "Any"}
        </p>
      </div>
      <div className="flex flex-wrap gap-1 p-2">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Directory                                                           */
/* ------------------------------------------------------------------ */

export function CompoundDirectory() {
  useHydratePrefs();

  const jurisdiction = usePrefsStore((s) => s.jurisdiction);
  const setJurisdiction = usePrefsStore((s) => s.setJurisdiction);
  const compareSlugs = usePrefsStore((s) => s.compareSlugs);
  const toggleCompare = usePrefsStore((s) => s.toggleCompare);
  const removeCompare = usePrefsStore((s) => s.removeCompare);
  const clearCompare = usePrefsStore((s) => s.clearCompare);

  const [query, setQuery] = React.useState("");
  const [goals, setGoals] = React.useState<GoalId[]>([]);
  const [families, setFamilies] = React.useState<CompoundFamily[]>([]);
  const [evidence, setEvidence] = React.useState<EvidenceQuality[]>([]);
  const [regulatory, setRegulatory] = React.useState<RegulatoryStatus[]>([]);
  const [routes, setRoutes] = React.useState<Route[]>([]);
  const [wadaSafe, setWadaSafe] = React.useState(false);
  const [rangeOnly, setRangeOnly] = React.useState(false);
  const [sort, setSort] = React.useState<SortKey>("range");
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const regulatoryOptions: Option<RegulatoryStatus>[] = REGULATORY_ORDER.map((status) => ({
    id: status,
    label: REGULATORY_LABELS[status],
    count: COMPOUNDS.filter((c) => c.regulatory[jurisdiction].status === status).length,
  })).filter((o) => o.count > 0);

  const activeCount =
    goals.length + families.length + evidence.length + regulatory.length + routes.length + (wadaSafe ? 1 : 0) + (rangeOnly ? 1 : 0);

  const trimmedQuery = query.trim();
  const base = trimmedQuery ? searchCompounds(trimmedQuery, COMPOUNDS.length) : COMPOUNDS;
  const filtered = base.filter(
    (c) =>
      (!rangeOnly || inRange(c.slug)) &&
      (goals.length === 0 || c.goals.some((g) => goals.includes(g.goal))) &&
      (families.length === 0 || families.includes(c.family)) &&
      (evidence.length === 0 || evidence.includes(c.overallEvidence)) &&
      (regulatory.length === 0 || regulatory.includes(c.regulatory[jurisdiction].status)) &&
      (routes.length === 0 || c.routes.some((r) => routes.includes(r))) &&
      (!wadaSafe || c.wadaProhibited === false),
  );
  const results = sortCompounds(filtered, sort, jurisdiction);

  const clearFilters = () => {
    setGoals([]);
    setFamilies([]);
    setEvidence([]);
    setRegulatory([]);
    setRoutes([]);
    setWadaSafe(false);
    setRangeOnly(false);
  };

  const clearEverything = () => {
    clearFilters();
    setQuery("");
  };

  const onToggleCompare = (slug: string) => {
    const ok = toggleCompare(slug);
    if (!ok) {
      toast(`You can compare up to ${MAX_COMPARE} compounds`, {
        description: "Remove one from the selection to add another.",
      });
    }
  };

  const activeChips: { key: string; label: string; remove: () => void }[] = [
    ...(rangeOnly ? [{ key: "range", label: `${BRAND.displayName} range`, remove: () => setRangeOnly(false) }] : []),
    ...goals.map((g) => ({
      key: `goal-${g}`,
      label: GOALS.find((x) => x.id === g)?.short ?? g,
      remove: () => setGoals((prev) => prev.filter((v) => v !== g)),
    })),
    ...families.map((f) => ({
      key: `family-${f}`,
      label: FAMILY_LABELS[f],
      remove: () => setFamilies((prev) => prev.filter((v) => v !== f)),
    })),
    ...evidence.map((e) => ({
      key: `evidence-${e}`,
      label: `${EVIDENCE_LABELS[e]} evidence`,
      remove: () => setEvidence((prev) => prev.filter((v) => v !== e)),
    })),
    ...regulatory.map((r) => ({
      key: `regulatory-${r}`,
      label: `${REGULATORY_LABELS[r]} (${jurisdiction})`,
      remove: () => setRegulatory((prev) => prev.filter((v) => v !== r)),
    })),
    ...routes.map((r) => ({
      key: `route-${r}`,
      label: ROUTE_LABELS[r],
      remove: () => setRoutes((prev) => prev.filter((v) => v !== r)),
    })),
    ...(wadaSafe ? [{ key: "wada", label: "Not WADA-prohibited", remove: () => setWadaSafe(false) }] : []),
  ];

  return (
    <div className={cn(compareSlugs.length > 0 && "pb-24")}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, brand or class"
            aria-label="Search compounds"
            autoComplete="off"
            className="h-12 w-full border border-ink bg-white pl-11 pr-12 text-[15px] text-ink placeholder:text-muted-2 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-0.5 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Chip
              active={rangeOnly}
              count={RANGE_SLUGS.length}
              onClick={() => setRangeOnly((v) => !v)}
              className={cn("border-ink sm:h-11 sm:px-3.5", !rangeOnly && "hover:bg-paper-2")}
            >
              {BRAND.displayName} range
            </Chip>
            <div className="flex items-center gap-3">
              <span className="label-mono hidden sm:inline">Jurisdiction</span>
              <JurisdictionSwitch value={jurisdiction} onChange={setJurisdiction} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="directory-filters"
            className={cn(
              "inline-flex h-11 items-center gap-2 border border-ink px-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-150 lg:hidden",
              filtersOpen ? "bg-ink text-white" : "bg-white text-ink hover:bg-paper-2",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
            {activeCount > 0 && (
              <span className={cn("inline-flex h-5 min-w-5 items-center justify-center px-1 tnum", filtersOpen ? "bg-white text-ink" : "bg-brand-600 text-white")}>
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-10">
        {/* Filter rail */}
        <aside id="directory-filters" className={cn("lg:block", filtersOpen ? "block" : "hidden")} aria-label="Filters">
          <div className="no-scrollbar divide-y divide-ink border border-ink bg-white lg:sticky lg:top-[7.1rem] lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <div className="flex h-11 items-center justify-between gap-3 px-3">
              <h2 className="label-mono text-ink">Filters</h2>
              {activeCount > 0 && (
                <button type="button" onClick={clearFilters} className="link-rule label-mono text-ink">
                  Clear all ({activeCount})
                </button>
              )}
            </div>

            <FilterGroup label="Goal" selected={goals.length}>
              {GOAL_OPTIONS.map((o) => (
                <Chip key={o.id} active={goals.includes(o.id)} count={o.count} onClick={() => setGoals((p) => toggleValue(p, o.id))}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>

            <FilterGroup label="Family" selected={families.length}>
              {FAMILY_OPTIONS.map((o) => (
                <Chip key={o.id} active={families.includes(o.id)} count={o.count} onClick={() => setFamilies((p) => toggleValue(p, o.id))}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>

            <FilterGroup label="Overall evidence" selected={evidence.length}>
              {EVIDENCE_OPTIONS.map((o) => (
                <Chip
                  key={o.id}
                  active={evidence.includes(o.id)}
                  disabled={o.count === 0}
                  count={o.count}
                  onClick={() => setEvidence((p) => toggleValue(p, o.id))}
                >
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>

            <FilterGroup label={`Regulatory · ${JURISDICTION_LABELS[jurisdiction]}`} selected={regulatory.length}>
              {regulatoryOptions.map((o) => (
                <Chip key={o.id} active={regulatory.includes(o.id)} count={o.count} onClick={() => setRegulatory((p) => toggleValue(p, o.id))}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>

            <FilterGroup label="Route" selected={routes.length}>
              {ROUTE_OPTIONS.map((o) => (
                <Chip key={o.id} active={routes.includes(o.id)} count={o.count} onClick={() => setRoutes((p) => toggleValue(p, o.id))}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>

            <div>
              <div className="flex h-10 items-center border-b border-line bg-paper-2 px-3">
                <p className="label-mono text-ink">Sport</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={wadaSafe}
                onClick={() => setWadaSafe((v) => !v)}
                className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-paper-2"
              >
                <span>
                  <span className="block text-[13px] font-medium text-ink">Not WADA-prohibited</span>
                  <span className="block text-[12px] text-muted">Hide compounds on the Prohibited List</span>
                </span>
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center border border-ink transition-colors duration-150",
                    wadaSafe ? "bg-ink text-white" : "bg-white",
                  )}
                  aria-hidden
                >
                  {wadaSafe && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="mt-6 min-w-0 lg:mt-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="label-mono" aria-live="polite">
              Showing <span className="text-ink tnum">{results.length}</span> of {COMPOUNDS.length}
              {trimmedQuery && (
                <>
                  {" "}
                  for <span className="normal-case tracking-normal text-ink">“{trimmedQuery}”</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-3">
              <span className="label-mono hidden sm:inline">Sort</span>
              <Segmented size="sm" label="Sort by" options={SORT_OPTIONS} value={sort} onChange={setSort} />
            </div>
          </div>

          {activeChips.length > 0 && (
            <ul className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Active filters">
              {activeChips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={chip.remove}
                    className="inline-flex h-9 items-center gap-1.5 border border-ink bg-white pl-2.5 pr-2 font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-ink transition-colors duration-150 hover:bg-ink hover:text-white"
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5" aria-hidden />
                    <span className="sr-only">Remove filter</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={clearFilters} className="link-rule label-mono h-9 px-2 text-ink">
                  Clear all
                </button>
              </li>
            </ul>
          )}

          {results.length === 0 ? (
            <div className="mt-5 border border-ink px-6 py-14 text-center">
              <p className="label-mono">0 results</p>
              <h3 className="font-display mt-3 text-[1.6rem] uppercase text-ink sm:text-[2rem]">No compounds match</h3>
              <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-muted">
                Try a different spelling or brand name, or remove some filters. Every compound in the database is graded on the same
                record, so widening the search does not lower the standard.
              </p>
              <Button variant="secondary" size="md" className="mt-6" onClick={clearEverything}>
                Clear search and filters
              </Button>
            </div>
          ) : (
            <CellGrid as="ul" itemAs="li" cols={[2, 2, 3]} count={results.length} className="mt-5 grid-cols-2 lg:grid-cols-3" role="list">
              {results.map((c) => (
                <li key={c.slug} className="min-w-0">
                  <CompoundCard
                    compound={c}
                    jurisdiction={jurisdiction}
                    selected={compareSlugs.includes(c.slug)}
                    onToggleCompare={onToggleCompare}
                  />
                </li>
              ))}
            </CellGrid>
          )}
        </div>
      </div>

      <CompareBar slugs={compareSlugs} onRemove={removeCompare} onClear={clearCompare} />
    </div>
  );
}
