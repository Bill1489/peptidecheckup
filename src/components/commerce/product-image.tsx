import * as React from "react";
import type { Product, ProductImage as ProductImageRecord } from "@/data/products/types";
import { asset, cn } from "@/lib/utils";
import { ProductVisual } from "./product-visual";

/**
 * Real product photography with the SVG illustration as a fallback.
 * Photos are 4:5 on white; we render them object-contain inside a square or
 * 4:5 frame so every product reads at the same scale.
 */
export function pickImage(product: Product, prefer: ProductImageRecord["kind"] = "pack"): ProductImageRecord | undefined {
  return product.images.find((i) => i.kind === prefer) ?? product.images[0];
}

export function ProductImage({
  product,
  prefer = "pack",
  className,
  frame = "square",
  priority,
  sizes = "(min-width: 1024px) 33vw, 50vw",
}: {
  product: Product;
  prefer?: ProductImageRecord["kind"];
  className?: string;
  /** square keeps the catalogue grid uniform; portrait shows the full 4:5 photo */
  frame?: "square" | "portrait" | "fill";
  priority?: boolean;
  sizes?: string;
}) {
  const img = pickImage(product, prefer);
  if (!img) {
    return <ProductVisual product={product} className={className} />;
  }
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white",
        frame === "square" && "aspect-square",
        frame === "portrait" && "aspect-[4/5]",
        frame === "fill" && "h-full w-full",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export; images are unoptimised by design */}
      <img
        src={asset(img.src)}
        alt={img.alt}
        width={img.width}
        height={img.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}

/** Small swatch of the product's packaging colour. */
export function ProductSwatch({ product, className }: { product: Product; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-2.5 w-2.5 shrink-0", className)}
      style={{ background: product.visual.color ?? "#0b0b0c" }}
    />
  );
}
