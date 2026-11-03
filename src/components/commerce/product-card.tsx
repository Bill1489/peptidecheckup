"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { defaultVariant, purchasable, type Product } from "@/data/products";
import { EVIDENCE_LABELS } from "@/data/types";
import { EvidenceMeter } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { ILLUSTRATION_CAPTION, goalLabel, hasPhoto, primaryGoalEvidence, priceLine, productPath } from "@/components/commerce/product-utils";
import { PurchasedRecently } from "@/components/commerce/purchased-recently";
import { formatMoney } from "@/lib/commerce/money";
import { cn } from "@/lib/utils";

/**
 * Range card. Photograph on white (never cropped), the packaging colour as a
 * 3px rule and a swatch, then name, contents, who it is for, price, the
 * human-evidence grade for its main goal, and two actions. `size="sm"` is the
 * compact version used for "Also in the range". Pens without a photograph
 * show the illustration in the packaging colour with a caption saying so.
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
  const photo = hasPhoto(product);

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
          sizes={compact ? "(min-width: 1024px) 20vw, 50vw" : "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"}
        />
        {flag && !compact && (
          <span className="absolute left-2.5 top-2.5 z-[3] bg-brand-700 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-white">{flag}</span>
        )}
        <PurchasedRecently slug={product.slug} />
        {!photo && (
          <span
            className={cn(
              "absolute bottom-0 right-0 bg-white/90 px-2 py-1 font-mono uppercase tracking-[0.12em] text-muted",
              compact ? "text-[8.5px]" : "text-[9.5px]",
            )}
          >
            {ILLUSTRATION_CAPTION}
          </span>
        )}
      </div>

      {/* Body */}
      <div className={cn("flex flex-1 flex-col", compact ? "gap-1 p-3" : "gap-2 p-4")}>
        <div className="flex items-center gap-2">
          <ProductSwatch product={product} />
          <h3
            className={cn(
              "font-display leading-[1.05] tracking-[-0.02em] transition-colors duration-150 group-hover:text-brand-700",
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
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-3 text-[13px] leading-snug text-ink-3">
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
        <div className="relative z-[2] flex items-center gap-2 border-t border-line p-3">
          {purchasable(product) ? (
            <AddToCartButton product={product} variantId={variant.id} size="md" className="h-11 min-w-0 flex-1" />
          ) : (
            <span className="flex h-11 flex-1 items-center justify-center border border-line px-4 text-[14px] text-muted">
              {product.availability === "out_of_stock" ? "Out of stock" : "Not available"}
            </span>
          )}
          <Link
            href={href}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 px-2 text-[14px] text-ink hover:text-brand-700 focus-visible:outline-offset-[-2px]"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      )}
    </article>
  );
}
