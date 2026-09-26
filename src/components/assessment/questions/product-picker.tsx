"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { getCompound } from "@/data/compounds";
import { PRODUCTS, type Product } from "@/data/products";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import {
  clearProductSelection,
  isProductSelected,
  penCount,
  productCompoundSlugs,
  productGroups,
  productMatchesQuery,
  RANGE_SIZE,
  toggleProductSelection,
} from "@/lib/assessment/derived";
import { useAssessmentStore } from "@/lib/assessment/store";
import { cn } from "@/lib/utils";
import { useAnswers } from "../hooks";
import { Chip, MonoLabel, TextInput } from "../primitives";
import { Marker } from "./option-cards";

/**
 * "Have you got a specific pen in mind?" Multi-select over the whole range,
 * grouped by the manufacturer's category and searchable by name, contents or
 * tag. Each picked pen is recorded as its compound slugs so the rules engine
 * assesses every component (see derived.ts). "None — let the quiz decide" is
 * the default: every pen is scored either way.
 */
export function ProductPicker() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const [query, setQuery] = React.useState("");

  const picked = React.useMemo(() => PRODUCTS.filter((p) => isProductSelected(answers, p)), [answers]);
  const count = picked.length;

  const groups = React.useMemo(() => {
    const visible = PRODUCTS.filter((p) => productMatchesQuery(p, query));
    return productGroups(visible);
  }, [query]);
  const shown = groups.reduce((sum, g) => sum + g.products.length, 0);

  const toggle = (product: Product) => {
    setAnswers(toggleProductSelection(useAssessmentStore.getState().answers, product));
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <TextInput
            type="text"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search the ${penCount()} — name, contents or category`}
            aria-label="Search the range"
            autoComplete="off"
            spellCheck={false}
            data-autofocus="pointer"
            onKeyDown={(e) => {
              // Enter filters; it must not advance the step from inside the search box.
              if (e.key === "Enter") e.preventDefault();
              if (e.key === "Escape" && query) {
                e.preventDefault();
                setQuery("");
              }
            }}
            className="pl-10 pr-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-0 top-0 inline-flex h-12 w-11 items-center justify-center text-ink transition-colors hover:bg-ink hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
        <p className="label-mono tnum text-muted" aria-live="polite">
          {query ? `${shown} of ${RANGE_SIZE} shown` : `${RANGE_SIZE} pens · ${groups.length} categories`}
        </p>
      </div>

      {shown === 0 ? (
        <p className="border border-ink p-5 text-sm text-muted">
          No pen matches “{query}”. Try a compound name (BPC-157, semaglutide) or a category (skin, weight, recovery).
        </p>
      ) : (
        <div className="grid gap-5" role="group" aria-label="Pens in the range">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`pens-${group.id}`} className="grid gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <h3 id={`pens-${group.id}`} className="label-mono text-ink">
                  {group.label}
                </h3>
                <MonoLabel className="tnum text-muted">
                  {group.products.length} {group.products.length === 1 ? "pen" : "pens"}
                </MonoLabel>
              </div>
              <ul className="cell-grid grid-cols-2 sm:grid-cols-3">
                {group.products.map((product) => (
                  <li key={product.id} className="flex">
                    <PenCell product={product} selected={isProductSelected(answers, product)} onToggle={() => toggle(product)} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Chip selected={count === 0} onClick={() => setAnswers(clearProductSelection())} role="radio" aria-checked={count === 0}>
          None — let the quiz decide
        </Chip>
        <span className="text-xs text-muted" aria-live="polite">
          {count === 0
            ? "Every pen is scored either way."
            : `${count} ${count === 1 ? "pen" : "pens"} picked — ${picked.map((p) => p.name).join(", ")} — assessed in your report.`}
        </span>
      </div>

      <p className="flex items-start gap-3 text-xs leading-relaxed text-muted">
        <span className="mt-[0.35rem] h-2 w-2 shrink-0 bg-brand-600" aria-hidden />
        Pens are pre-filled, so there is no dose question. The report shows the exposures used in published studies instead —
        research information, not a recommendation.
      </p>
    </div>
  );
}

/** One compact cell: marker, small photo (or illustration), name, contents and presentation. */
function PenCell({ product, selected, onToggle }: { product: Product; selected: boolean; onToggle: () => void }) {
  const contents = productCompoundSlugs(product)
    .map((slug) => getCompound(slug)?.name ?? slug.toUpperCase())
    .join(" + ");
  const presentation = product.pen ? `${product.pen.totalMg.toLocaleString("en-GB")} mg / ${product.pen.volumeMl} mL` : product.subtitle;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      data-option
      onClick={onToggle}
      className={cn(
        "flex w-full flex-col rounded-none p-3 text-left transition-colors duration-150 focus-visible:z-10 sm:p-3.5",
        selected ? "bg-ink text-white" : "hover-invert",
      )}
    >
      <span className="flex w-full items-start justify-between gap-2">
        <span className="h-14 w-14 shrink-0 border border-current/30 bg-white sm:h-16 sm:w-16">
          <ProductImage product={product} prefer="pack" frame="square" sizes="64px" />
        </span>
        <Marker selected={selected} />
      </span>
      <span className="mt-3 flex min-w-0 items-start gap-1.5">
        <ProductSwatch product={product} className="mt-[0.3rem]" />
        <span className="min-w-0 break-words font-display text-[0.95rem] uppercase leading-[1.05]">{product.name}</span>
      </span>
      <span className="mt-1.5 block break-words font-mono text-[10px] uppercase leading-snug tracking-[0.08em] opacity-70">{contents}</span>
      <span className="mt-1 block font-mono text-[10px] tnum leading-snug opacity-60">{presentation}</span>
    </button>
  );
}
