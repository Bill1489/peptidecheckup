"use client";

import * as React from "react";
import { getCompound } from "@/data/compounds";
import { PRODUCTS, type Product } from "@/data/products";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { clearProductSelection, isProductSelected, productCompoundSlugs, toggleProductSelection } from "@/lib/assessment/derived";
import { useAssessmentStore } from "@/lib/assessment/store";
import { cn } from "@/lib/utils";
import { useAnswers } from "../hooks";
import { Chip } from "../primitives";
import { Marker } from "./option-cards";

/**
 * Step 6 — "Have you got a specific pen in mind?" Multi-select over the six
 * pens with their photographs. Each picked pen is recorded as its compound
 * slugs so the rules engine assesses every component (see derived.ts).
 */
export function ProductPicker() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const count = PRODUCTS.filter((p) => isProductSelected(answers, p)).length;

  const toggle = (product: Product) => {
    setAnswers(toggleProductSelection(useAssessmentStore.getState().answers, product));
  };

  return (
    <div className="grid gap-5">
      <ul role="group" aria-label="Pens in the range" className="border border-ink">
        {PRODUCTS.map((product) => {
          const selected = isProductSelected(answers, product);
          const contents = productCompoundSlugs(product)
            .map((slug) => getCompound(slug)?.name ?? slug.toUpperCase())
            .join(" + ");
          return (
            <li key={product.id} className="border-b border-ink last:border-b-0">
              <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                data-option
                onClick={() => toggle(product)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-none p-3 text-left transition-colors duration-150 focus-visible:z-10 sm:p-4",
                  selected ? "bg-ink text-white" : "hover-invert",
                )}
              >
                <Marker selected={selected} />
                <span className="h-16 w-16 shrink-0 border border-current/30 bg-white sm:h-20 sm:w-20">
                  <ProductImage product={product} prefer="pack" frame="square" sizes="80px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <ProductSwatch product={product} />
                    <span className="font-display text-[1.15rem] uppercase leading-none">{product.name}</span>
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-snug opacity-75">{product.subtitle}</span>
                  <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.08em] opacity-60">{contents}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        <Chip selected={count === 0} onClick={() => setAnswers(clearProductSelection())} role="radio" aria-checked={count === 0}>
          No — let the quiz decide
        </Chip>
        <span className="text-xs text-muted" aria-live="polite">
          {count === 0 ? "Every pen is scored either way." : `${count} ${count === 1 ? "pen" : "pens"} picked — assessed in your report.`}
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
