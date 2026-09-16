"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { getCompound } from "@/data/compounds";
import { AVAILABILITY_LABELS, defaultVariant, purchasable, type Product } from "@/data/products";
import { EvidenceMeter } from "@/components/ui/badge";
import { ProductVisual } from "@/components/commerce/product-visual";
import { CHANNEL_SHORT, priceLine, productPath } from "@/components/commerce/product-utils";
import { useCartStore } from "@/lib/commerce/cart-store";
import { formatMoney } from "@/lib/commerce/money";
import { cn } from "@/lib/utils";

/**
 * Catalogue cell. The whole card inverts on hover (`hover-invert`), so every
 * inner element is drawn with `currentColor` borders and no light fills —
 * the only exceptions are the flag (always ink) and the evidence chip (always
 * white), which read as printed labels on the inverted surface.
 */
export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const variant = defaultVariant(product);
  const compound = product.compoundSlug ? getCompound(product.compoundSlug) : undefined;
  const price = priceLine(product);
  const multi = product.variants.length > 1;
  const canBuy = purchasable(product);
  const href = productPath(product.slug);

  const flag = product.isNew ? "New" : product.bestseller ? "Bestseller" : product.availability === "preorder" ? "Pre-order" : null;
  const statusLine = [CHANNEL_SHORT[product.channel], product.availability !== "in_stock" ? AVAILABILITY_LABELS[product.availability] : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className={cn("group relative flex h-full flex-col bg-white text-ink hover-invert", className)}>
      <Link href={href} className="absolute inset-0 z-[1] focus-visible:outline-offset-[-2px]" aria-label={`${product.name} — view product`} />

      {/* Visual */}
      <div className="relative aspect-square border-b border-current">
        <ProductVisual product={product} stacked={product.category === "kit"} />
        {flag && (
          <span className="absolute left-0 top-0 bg-ink px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white">
            {flag}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[15px] uppercase leading-[1.05] tracking-[-0.02em] sm:text-[16px]">{product.name}</h3>
          {compound && (
            <span className="inline-flex shrink-0 items-center border border-ink bg-white px-1.5 py-1" title={`Evidence: ${compound.overallEvidence}`}>
              <EvidenceMeter level={compound.overallEvidence} />
            </span>
          )}
        </div>
        <p className="text-[12.5px] leading-snug text-muted">{product.subtitle}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <span className="font-mono text-[15px] tnum">
            {price ?? (product.availability === "consultation" ? "Consultation" : "—")}
          </span>
          <span className="text-right font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{statusLine}</span>
        </div>
      </div>

      {/* Action */}
      <div className="relative z-[2] border-t border-current">
        {canBuy && !multi ? (
          <QuickAdd product={product} variantId={variant.id} label={product.availability === "preorder" ? "Pre-order" : "Add to cart"} />
        ) : canBuy && multi ? (
          <ActionLink href={href}>Options</ActionLink>
        ) : product.availability === "consultation" ? (
          <ActionLink href={href}>Start consultation</ActionLink>
        ) : product.availability === "out_of_stock" ? (
          <ActionLink href={href}>Notify me</ActionLink>
        ) : (
          <ActionLink href={href} muted>
            Not sold · why
          </ActionLink>
        )}
      </div>
    </article>
  );
}

const actionBase =
  "flex h-11 w-full items-center justify-between px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-150 hover:bg-brand-600 hover:text-white focus-visible:outline-offset-[-2px]";

function ActionLink({ href, muted, children }: { href: string; muted?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={cn(actionBase, muted && "text-muted")}>
      {children}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}

function QuickAdd({ product, variantId, label }: { product: Product; variantId: string; label: string }) {
  const add = useCartStore((s) => s.add);
  const variant = product.variants.find((v) => v.id === variantId);

  const onAdd = () => {
    const ok = add(product.id, variantId, 1);
    if (ok) {
      toast(`${product.name} added to cart`, { description: variant ? `${variant.label} · ${formatMoney(variant.price)}` : undefined });
    } else {
      toast("This item can't be added right now.");
    }
  };

  return (
    <button type="button" onClick={onAdd} className={actionBase} aria-label={`${label}: ${product.name}`}>
      {label}
      <Plus className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}
