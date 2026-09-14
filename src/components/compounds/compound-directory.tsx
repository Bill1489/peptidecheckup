"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, SearchX, SlidersHorizontal, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  MAX_COMPARE,
  REGULATORY_RANK,
  type SelectableJurisdiction,
} from "@/lib/compare";
import { useHydratePrefs, usePrefsStore } from "@/lib/compare-store";
import { CompareBar } from "./compare-bar";
import { CompoundCard } from "./compound-card";
import { JurisdictionSwitch } from "./jurisdiction-switch";

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

type SortKey = "evidence" | "name" | "regulatory" | "family";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "evidence", label: "Evidence (strongest first)" },
  { id: "name", label: "Name (A–Z)" },
  { id: "regulatory", label: "Regulatory (authorised first)" },
  { id: "family", label: "Family" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function sortCompounds(list: Compound[], sort: SortKey, jurisdiction: SelectableJurisdiction): Compound[] {
  const byEvidence = (a: Compound, b: Compound) => EVIDENCE_RANK[b.overallEvidence] - EVIDENCE_RANK[a.overallEvidence];
  const byName = (a: Compound, b: Compound) => a.name.localeCompare(b.name);
  // Ties keep the curated registry order (the database's default display order).
  const byRegistry = (a: Compound, b: Compound) => COMPOUNDS.indexOf(a) - COMPOUNDS.indexOf(b);
  const copy = [...list];
  switch (sort) {
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
  children,
}: {
  active: boolean;
  disabled?: boolean;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-colors duration-200 sm:h-8 sm:px-3",
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink-3 hover:border-ink/30 hover:text-ink",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn("font-mono text-[0.65rem] tabular-nums", active ? "text-white/70" : "text-muted-2")}>{count}</span>
      )}
    </button>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2.5 font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-2">{label}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Directory                                                           */
/* ------------------------------------------------------------------ */

export function CompoundDirectory() {
  useHydratePrefs();
  const reduce = useReducedMotion();

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
  const [sort, setSort] = React.useState<SortKey>("evidence");
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const regulatoryOptions: Option<RegulatoryStatus>[] = REGULATORY_ORDER.map((status) => ({
    id: status,
    label: REGULATORY_LABELS[status],
    count: COMPOUNDS.filter((c) => c.regulatory[jurisdiction].status === status).length,
  })).filter((o) => o.count > 0);

  const activeCount = goals.length + families.length + evidence.length + regulatory.length + routes.length + (wadaSafe ? 1 : 0);

  const trimmedQuery = query.trim();
  const base = trimmedQuery ? searchCompounds(trimmedQuery, COMPOUNDS.length) : COMPOUNDS;
  const filtered = base.filter(
    (c) =>
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
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, brand or class"
            aria-label="Search compounds"
            autoComplete="off"
            className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-11 text-[0.95rem] text-ink shadow-inset placeholder:text-muted-2 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-2 sm:inline">Jurisdiction</span>
            <JurisdictionSwitch value={jurisdiction} onChange={setJurisdiction} />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="directory-filters"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-paper-2 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 font-mono text-[0.65rem] text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* Filters */}
        <aside id="directory-filters" className={cn("lg:block", filtersOpen ? "block" : "hidden")} aria-label="Filters">
          <div className="no-scrollbar space-y-6 rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:border-0 lg:bg-transparent lg:p-0 lg:pr-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Filters</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-brand-700 underline-offset-4 hover:underline"
                >
                  Clear all ({activeCount})
                </button>
              )}
            </div>

            <FilterGroup label="Goal">
              {GOAL_OPTIONS.map((o) => (
                <Chip key={o.id} active={goals.includes(o.id)} count={o.count} onClick={() => setGoals((p) => toggleValue(p, o.id))}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>

            <FilterGroup label="Family">
              {FAMILY_OPTIONS.map((o) => (
                <Chip key={o.id} active={families.includes(o.id)} count={o.count} onClick={() => setFamilies((p) => toggleValue(p, o.id))}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>

            <FilterGroup label="Overall evidence">
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

            <FilterGroup label={`Regulatory status · ${JURISDICTION_LABELS[jurisdiction]}`}>
              {regulatoryOptions.map((o) => (
                <Chip key={o.id} active={regulatory.includes(o.id)} count={o.count} onClick={() => setRegulatory((p) => toggleValue(p, o.id))}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>

            <FilterGroup label="Route">
              {ROUTE_OPTIONS.map((o) => (
                <Chip key={o.id} active={routes.includes(o.id)} count={o.count} onClick={() => setRoutes((p) => toggleValue(p, o.id))}>
                  {o.label}
                </Chip>
              ))}
            </FilterGroup>

            <div>
              <p className="mb-2.5 font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-2">Sport</p>
              <button
                type="button"
                role="switch"
                aria-checked={wadaSafe}
                onClick={() => setWadaSafe((v) => !v)}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-line bg-white px-3.5 py-2 text-left text-sm text-ink transition-colors hover:border-ink/20"
              >
                <span>
                  Not WADA-prohibited
                  <span className="block text-xs text-muted">Hide compounds on the Prohibited List</span>
                </span>
                <span
                  className={cn(
                    "relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200",
                    wadaSafe ? "bg-brand-600" : "bg-ink/15",
                  )}
                  aria-hidden
                >
                  <span
                    className={cn(
                      "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform duration-200 ease-out-expo",
                      wadaSafe && "translate-x-4",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="mt-6 min-w-0 lg:mt-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              Showing <span className="font-medium text-ink">{results.length}</span> of {COMPOUNDS.length} compounds
              {trimmedQuery && (
                <>
                  {" "}
                  for <span className="font-medium text-ink">“{trimmedQuery}”</span>
                </>
              )}
            </p>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-2">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 rounded-xl border border-line bg-white px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <ul className="mt-4 flex flex-wrap items-center gap-1.5" aria-label="Active filters">
              {activeChips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={chip.remove}
                    className="inline-flex h-8 items-center gap-1 rounded-full bg-brand-50 pl-3 pr-2 text-xs font-medium text-brand-800 transition-colors hover:bg-brand-100"
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5" aria-hidden />
                    <span className="sr-only">Remove filter</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-8 px-2 text-xs font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  Clear all
                </button>
              </li>
            </ul>
          )}

          {results.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-white/60 px-6 py-16 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-paper-2 text-muted">
                <SearchX className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-2xl text-ink">No compounds match</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                Try a different spelling or brand name, or remove some filters. Every compound in the database is graded on the same
                record, so widening the search will not lower the standard.
              </p>
              <Button variant="secondary" size="md" className="mt-6" onClick={clearEverything}>
                Clear search and filters
              </Button>
            </div>
          ) : (
            <motion.ul layout={!reduce} className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
              <AnimatePresence mode="popLayout">
                {results.map((c, i) => (
                  <motion.li
                    key={c.slug}
                    layout={!reduce}
                    custom={Math.min(i, 9)}
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      show: (index: number) => ({
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.45, delay: index * 0.045, ease: EASE },
                      }),
                      exit: { opacity: 0, scale: 0.97, transition: { duration: 0.18 } },
                    }}
                    initial={reduce ? false : "hidden"}
                    animate="show"
                    exit="exit"
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={{ layout: { duration: 0.35, ease: EASE } }}
                    className="h-full"
                  >
                    <CompoundCard
                      compound={c}
                      jurisdiction={jurisdiction}
                      selected={compareSlugs.includes(c.slug)}
                      onToggleCompare={onToggleCompare}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>

      <CompareBar slugs={compareSlugs} onRemove={removeCompare} onClear={clearCompare} />
    </div>
  );
}
