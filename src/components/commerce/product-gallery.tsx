"use client";

import * as React from "react";
import type { Product, ProductImage as ProductImageRecord } from "@/data/products";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<ProductImageRecord["kind"], string> = {
  pack: "Pen and carton",
  hand: "In hand",
  detail: "Detail",
};

/**
 * Photograph gallery: the pack shot large in its 4:5 frame, with a thumbnail
 * row to switch to the in-hand shot where the product has one. Photos sit on
 * white, uncropped, so every pen in the range reads at the same scale.
 */
export function ProductGallery({ product, className }: { product: Product; className?: string }) {
  const kinds = React.useMemo(() => {
    const seen = new Set<ProductImageRecord["kind"]>();
    for (const img of product.images) seen.add(img.kind);
    return (["pack", "hand", "detail"] as const).filter((k) => seen.has(k));
  }, [product.images]);
  const [kind, setKind] = React.useState<ProductImageRecord["kind"]>(kinds[0] ?? "pack");
  const color = product.visual.color ?? "#0b0b0c";

  return (
    <div className={className}>
      <div className="relative border border-ink bg-white">
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[3px]" style={{ background: color }} />
        <ProductImage product={product} prefer={kind} frame="portrait" priority sizes="(min-width: 1024px) 45vw, 100vw" className="w-full" />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        {kinds.length > 1 ? (
          <div role="group" aria-label="Photographs" className="flex gap-2">
            {kinds.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={k === kind}
                aria-label={KIND_LABELS[k]}
                onClick={() => setKind(k)}
                className={cn(
                  "relative h-16 w-16 overflow-hidden border bg-white transition-colors duration-150",
                  k === kind ? "border-ink" : "border-line hover:border-ink",
                )}
              >
                <ProductImage product={product} prefer={k} frame="fill" sizes="64px" />
                {k === kind && <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: color }} aria-hidden />}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <p className="flex flex-col items-end gap-1 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ProductSwatch product={product} />
            Photograph · {KIND_LABELS[kind]}
          </span>
          {product.coa && <span>Lot {product.coa.batch}</span>}
        </p>
      </div>
    </div>
  );
}
