"use client";

import * as React from "react";
import type { Product, ProductVariant } from "@/data/products";
import { variantStockLine } from "@/components/commerce/product-utils";
import { formatMoney } from "@/lib/commerce/money";
import { cn } from "@/lib/utils";

/**
 * Bordered segmented options sharing 1px rules. Out-of-stock options stay
 * visible (struck through) so the range is legible, but cannot be selected.
 */
export function VariantPicker({
  product,
  value,
  onChange,
  className,
}: {
  product: Product;
  value: string;
  onChange: (variantId: string) => void;
  className?: string;
}) {
  const cols = product.variants.length >= 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <div className={className}>
      <p className="label-mono mb-2 flex items-center justify-between">
        <span>Size</span>
        <span className="tnum">{product.variants.length} options</span>
      </p>
      <div role="radiogroup" aria-label="Variant" className={cn("grid gap-px border border-ink bg-ink", cols)}>
        {product.variants.map((v) => (
          <VariantOption key={v.id} product={product} variant={v} selected={v.id === value} onSelect={() => onChange(v.id)} />
        ))}
      </div>
    </div>
  );
}

function VariantOption({
  product,
  variant,
  selected,
  onSelect,
}: {
  product: Product;
  variant: ProductVariant;
  selected: boolean;
  onSelect: () => void;
}) {
  const soldOut = variant.stock <= 0 && product.availability !== "preorder";
  const stock = variantStockLine(product, variant);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={soldOut || undefined}
      disabled={soldOut}
      onClick={onSelect}
      className={cn(
        "flex min-h-[4.5rem] flex-col items-start justify-between gap-2 px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-offset-[-3px]",
        selected ? "bg-ink text-white" : "bg-white text-ink hover:bg-paper-2",
        soldOut && "cursor-not-allowed text-muted-2 hover:bg-white",
      )}
    >
      <span className={cn("font-sans text-[13px] font-semibold uppercase tracking-[0.04em]", soldOut && "line-through")}>{variant.label}</span>
      <span className="flex w-full items-baseline justify-between gap-2">
        <span className="font-mono text-[13px] tnum">{formatMoney(variant.price)}</span>
        <span
          className={cn(
            "font-mono text-[9.5px] uppercase tracking-[0.1em]",
            selected ? "text-white/60" : soldOut ? "text-muted-2" : variant.stock <= 10 ? "text-caution" : "text-muted",
          )}
        >
          {stock}
        </span>
      </span>
    </button>
  );
}
