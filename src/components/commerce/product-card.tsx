"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { defaultVariant, purchasable, type Product } from "@/data/products";
import { EVIDENCE_LABELS } from "@/data/types";
import { EvidenceMeter } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { goalLabel, primaryGoalEvidence, priceLine, productPath } from "@/components/commerce/product-utils";
import { formatMoney } from "@/lib/commerce/money";
import { cn } from "@/lib/utils";

/**
 * Range card. Photograph on white (never cropped), the packaging colour as a
 * 3px rule and a swatch, then name, contents, who it is for, price, the
 * human-evidence grade for its main goal, and two actions. `size="sm"` is the
 * compact version used for "Also in the range".
 */
export function ProductCard({
  product,
  className,
  size = "lg",
  priority,
}: {
  product: Product;
  className?: string;
  size?: "lg" | "sm";
  priority?: boolean;
}) {
  const variant = defaultVariant(product);
  const href = productPath(product.slug);
  const evidence = primaryGoalEvidence(product);
  const flag = product.isNew ? "New" : product.bestseller ? "Bestseller" : product.availability === "preorder" ? "Pre-order" : null;
  const color = product.visual.color ?? "#0b0b0c";
  const compact = size === "sm";

  return (
    <article className={cn("group relative flex h-full flex-col bg-white text-ink", className)}>
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[3px]" style={{ background: color }} />
      <Link href={href} className="absolute inset-0 z-[1] focus-visible:outline-offset-[-2px]" aria-label={`${product.name} — view product`} />

      {/* Photograph */}
      <div className={cn("relative border-b border-ink bg-white", compact ? "p-2" : "p-3 sm:p-4")}>
        <ProductImage
          product={product}
          prefer="pack"
          frame="square"
          priority={priority}
          sizes={compact ? "(min-width: 1024px) 20vw, 50vw" : "(min-width: 1024px) 33vw, 50vw"}
        />
        {flag && !compact && (
          <span className="absolute left-0 top-0 bg-ink px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white">{flag}</span>
        )}
      </div>

      {/* Body */}
      <div className={cn("flex flex-1 flex-col", compact ? "gap-1 p-3" : "gap-2 p-4")}>
        <div className="flex items-center gap-2">
          <ProductSwatch product={product} />
          <h3
            className={cn(
              "font-display uppercase leading-[1.02] tracking-[-0.02em] transition-colors duration-150 group-hover:text-brand-600",
              compact ? "text-[14px]" : "text-[17px] sm:text-[19px]",
            )}
          >
            {product.name}
          </h3>
        </div>
        <p className={cn("leading-snug text-muted", compact ? "text-[12px]" : "text-[12.5px]")}>{product.subtitle}</p>

        {!compact && <p className="text-pretty text-[13.5px] leading-relaxed text-ink-3">{product.bestFor}</p>}

        <div className={cn("mt-auto flex items-end justify-between gap-3", compact ? "pt-1" : "pt-2")}>
          <span className={cn("font-mono tnum", compact ? "text-[13px]" : "text-[16px]")}>
            {compact ? (priceLine(product) ?? "—") : formatMoney(variant.price)}
          </span>
          {compact && <ArrowRight className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-brand-600" aria-hidden />}
          {!compact && (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              {product.variants.length > 1 ? `${variant.label.split("·")[0].trim()} · ${product.variants.length} packs` : variant.label}
            </span>
          )}
        </div>

        {!compact && (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
            {evidence ? (
              <>
                <EvidenceMeter level={evidence.level} />
                <span>
                  Human evidence for {goalLabel(evidence.goal)}: <span className="text-ink">{EVIDENCE_LABELS[evidence.level]}</span>
                </span>
              </>
            ) : (
              <span>Evidence record pending</span>
            )}
          </p>
        )}
      </div>

      {/* Actions */}
      {!compact && (
        <div className="relative z-[2] grid grid-cols-1 gap-px border-t border-ink bg-ink sm:grid-cols-2">
          {purchasable(product) ? (
            <AddToCartButton
              product={product}
              variantId={variant.id}
              size="md"
              className="h-12 w-full justify-between rounded-none border-0 px-4 font-mono text-[11px] font-medium tracking-[0.12em]"
            />
          ) : (
            <span className="flex h-12 items-center bg-white px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              {product.availability === "out_of_stock" ? "Out of stock" : "Not available"}
            </span>
          )}
          <Link
            href={href}
            className="flex h-12 items-center justify-between bg-white px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors duration-150 hover:bg-ink hover:text-white focus-visible:outline-offset-[-2px]"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      )}
    </article>
  );
}
