"use client";

import * as React from "react";
import { ProductImage } from "@/components/commerce/product-image";
import { ProductVisual } from "@/components/commerce/product-visual";
import { Badge } from "@/components/ui/badge";
import { SpecRow } from "@/components/ui/card";
import { getProduct, getVariant } from "@/data/products";
import { CHANNEL_LABELS, type SaleChannel } from "@/data/products/types";
import type { CartLine } from "@/lib/commerce/cart-store";
import { formatMoney, vatIncluded } from "@/lib/commerce/money";
import type { OrderLine } from "@/lib/commerce/orders";
import { cn } from "@/lib/utils";

/**
 * Line and totals presentation shared by the checkout summary and the order
 * confirmation. Works from a snapshot (`OrderLine`) or live cart lines.
 */

export interface DisplayLine {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  unitPrice: number;
  qty: number;
  channel?: SaleChannel;
}

export function displayLinesFromCart(lines: CartLine[]): DisplayLine[] {
  return lines.flatMap((l) => {
    const product = getProduct(l.productId);
    const variant = getVariant(l.variantId);
    if (!product || !variant) return [];
    return [
      {
        productId: l.productId,
        variantId: l.variantId,
        name: product.name,
        variantLabel: variant.label,
        unitPrice: variant.price,
        qty: l.qty,
        channel: product.channel,
      },
    ];
  });
}

export function displayLinesFromOrder(lines: OrderLine[]): DisplayLine[] {
  return lines.map((l) => ({ ...l, channel: getProduct(l.productId)?.channel }));
}

/** 56px product photograph. Falls back to the generic illustration with the product name when the catalogue no longer has the product. */
export function LineThumb({ productId, name, variantLabel, className }: { productId: string; name: string; variantLabel: string; className?: string }) {
  const product = getProduct(productId);
  return (
    <div className={cn("w-14 shrink-0 overflow-hidden border border-ink bg-white", className)} aria-hidden>
      {product ? (
        <ProductImage product={product} prefer="pack" frame="square" sizes="56px" />
      ) : (
        <ProductVisual code={name} meta={variantLabel} grid={false} className="aspect-square" />
      )}
    </div>
  );
}

export function OrderLines({ lines, className, dense }: { lines: DisplayLine[]; className?: string; dense?: boolean }) {
  return (
    <ul className={cn("divide-y divide-line", className)}>
      {lines.map((l) => (
        <li key={l.variantId} className={cn("flex items-start gap-3", dense ? "py-3" : "py-4")}>
          <LineThumb productId={l.productId} name={l.name} variantLabel={l.variantLabel} />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium leading-snug text-ink">{l.name}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {l.variantLabel} · <span className="tnum">×{l.qty}</span>
              {l.qty > 1 && <span className="tnum"> · {formatMoney(l.unitPrice)} each</span>}
            </p>
            {l.channel === "research" && (
              <Badge size="xs" tone="outline" className="mt-2">
                {CHANNEL_LABELS.research}
              </Badge>
            )}
          </div>
          <p className="shrink-0 font-mono text-[13px] tnum text-ink">{formatMoney(l.unitPrice * l.qty)}</p>
        </li>
      ))}
    </ul>
  );
}

export interface TotalsProps {
  subtotal: number;
  discount: number;
  shipping: number;
  shippingLabel?: string;
  total: number;
  promoCode?: string;
  className?: string;
  /** Larger total row for the confirmation page. */
  emphasis?: boolean;
}

export function Totals({ subtotal, discount, shipping, shippingLabel, total, promoCode, className, emphasis }: TotalsProps) {
  return (
    <div className={className}>
      <SpecRow label="Subtotal" value={<span className="font-mono tnum">{formatMoney(subtotal)}</span>} />
      {discount > 0 && (
        <SpecRow
          label={promoCode ? `Discount · ${promoCode}` : "Discount"}
          value={<span className="font-mono tnum text-brand-600">−{formatMoney(discount)}</span>}
        />
      )}
      <SpecRow
        label={shippingLabel ? `Delivery · ${shippingLabel}` : "Delivery"}
        value={<span className="font-mono tnum">{shipping === 0 ? "Free" : formatMoney(shipping)}</span>}
      />
      <div className={cn("flex items-baseline justify-between gap-6 border-t border-ink pt-3", emphasis ? "mt-1" : "")}>
        <span className="label-mono text-ink">Total</span>
        <span className={cn("font-mono font-semibold tnum text-ink", emphasis ? "text-[1.5rem]" : "text-[1.15rem]")}>{formatMoney(total)}</span>
      </div>
      <p className="mt-1.5 text-right font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">Includes {formatMoney(vatIncluded(total))} VAT</p>
    </div>
  );
}
