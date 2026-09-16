"use client";

import * as React from "react";
import type { Product, ProductTone } from "@/data/products";
import { ProductVisual, type ProductVisualProps } from "@/components/commerce/product-visual";
import { cn } from "@/lib/utils";

type ViewId = "unit" | "pack" | "label";

interface View {
  id: ViewId;
  label: string;
  props: Pick<ProductVisualProps, "stacked" | "tone" | "grid">;
}

/**
 * Large illustration with a three-thumbnail strip: the unit, the unit as a
 * multipack (stacked), and the label on the alternate tone without the grid.
 */
export function ProductGallery({ product, meta, className }: { product: Product; meta?: string; className?: string }) {
  const altTone: ProductTone = product.visual.tone === "ink" ? "grey" : "ink";
  const views: View[] = React.useMemo(
    () => [
      { id: "unit", label: "Unit", props: {} },
      { id: "pack", label: "Pack", props: { stacked: true } },
      { id: "label", label: "Label", props: { tone: altTone, grid: false } },
    ],
    [altTone],
  );
  const [view, setView] = React.useState<ViewId>(product.category === "kit" ? "pack" : "unit");
  const current = views.find((v) => v.id === view) ?? views[0];

  return (
    <div className={className}>
      <div className="border border-ink">
        <ProductVisual product={product} meta={meta} {...current.props} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div role="group" aria-label="Illustration views" className="flex gap-2">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={v.id === view}
              aria-label={`${v.label} view`}
              onClick={() => setView(v.id)}
              className={cn(
                "relative h-16 w-16 border transition-colors duration-150",
                v.id === view ? "border-ink" : "border-line hover:border-ink",
              )}
            >
              <ProductVisual product={product} meta={meta} grid={false} {...v.props} />
              {v.id === view && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-brand-600" aria-hidden />}
            </button>
          ))}
        </div>
        <p className="text-right font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          Illustration, not a photograph
          {product.coa && (
            <>
              <br />
              Lot {product.coa.batch}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
