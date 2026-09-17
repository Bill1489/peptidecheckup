"use client";

import * as React from "react";
import { ArrowRight, Snowflake, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchPanel, useMatchForProduct } from "@/components/commerce/match-panel";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { QtyStepper } from "@/components/commerce/qty-stepper";
import { VariantPicker } from "@/components/commerce/variant-picker";
import { AVAILABILITY_LABELS, defaultVariant, purchasable, type Product } from "@/data/products";
import { BRAND } from "@/lib/brand";
import { useCartStore } from "@/lib/commerce/cart-store";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney, percentOff } from "@/lib/commerce/money";

const MAX_QTY = 10;

/**
 * Client island for the pen page. Owns the selected variant and quantity so
 * the price, CTA and mobile bar agree, and asks the stored quiz result whether
 * this pen may be bought from here. Everything that does not depend on that
 * state arrives server-rendered as `intro` / `children`.
 */
export function ProductStage({ product, intro, children }: { product: Product; intro: React.ReactNode; children: React.ReactNode }) {
  const [variantId, setVariantId] = React.useState(product.defaultVariantId);
  const [qty, setQty] = React.useState(1);
  const add = useCartStore((s) => s.add);
  const { hideBuy, verdict } = useMatchForProduct(product.slug);

  // The mobile bar only appears once the main CTA has scrolled out of view.
  const ctaRef = React.useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = React.useState(true);
  React.useEffect(() => {
    const el = ctaRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting), { rootMargin: "0px 0px -64px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variant = product.variants.find((v) => v.id === variantId) ?? defaultVariant(product);
  const preorder = product.availability === "preorder";
  const inStock = purchasable(product) && (variant.stock > 0 || preorder);
  const canBuy = inStock && !hideBuy;
  const multi = product.variants.length > 1;
  const total = variant.price * qty;
  const off = percentOff(variant.price, variant.compareAtPrice);
  const buyLabel = preorder ? "Pre-order" : "Add to cart";

  const onAdd = () => {
    if (!canBuy) return;
    const ok = add(product.id, variant.id, qty);
    if (ok) {
      toast(`${product.name} added to cart`, { description: `${qty} × ${variant.label} · ${formatMoney(total)}` });
    } else {
      toast("This item can't be added right now.");
    }
  };

  const scrollToMatch = () => {
    document.getElementById("match-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left — sticky photograph */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery product={product} />
        </div>

        {/* Right — purchase column */}
        <div className="min-w-0">
          <div id="match-panel" className="mb-6 scroll-mt-28 empty:hidden">
            <MatchPanel product={product} />
          </div>

          {intro}

          {/* Price */}
          <div className="mt-6 border-t border-ink pt-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-[2rem] leading-none tnum">{formatMoney(variant.price)}</span>
              {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                <>
                  <s className="font-mono text-[15px] text-muted tnum">{formatMoney(variant.compareAtPrice)}</s>
                  <Badge tone="ink" size="xs">
                    −{off}%
                  </Badge>
                </>
              )}
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {variant.unitNote ? `${variant.unitNote} · ` : ""}VAT included · {variant.label}
            </p>
          </div>

          {multi && <VariantPicker product={product} value={variant.id} onChange={setVariantId} className="mt-6" />}

          {/* CTA */}
          <div className="mt-6" ref={ctaRef}>
            {hideBuy ? (
              <div className="border border-ink border-l-4 border-l-accent-500 p-4">
                <p className="label-mono text-accent-600">{verdict === "not_recommended" ? "Not recommended for you" : "Review before buying"}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
                  Your {BRAND.assessmentName} result ruled this pen out for your history, so it cannot be added to the cart here. Your result
                  explains why and links to a clinician.
                </p>
                <button type="button" onClick={scrollToMatch} className="link-rule mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
                  See your result
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  <QtyStepper value={qty} onChange={setQty} max={MAX_QTY} />
                  <Button variant="primary" size="xl" className="min-w-0 flex-1 justify-between px-4 sm:px-6" onClick={onAdd} disabled={!inStock}>
                    {inStock ? buyLabel : AVAILABILITY_LABELS[product.availability]}
                    <span className="font-mono tnum">{formatMoney(total)}</span>
                  </Button>
                </div>
                {!inStock && (
                  <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                    This lot is not available to order. The certificate stays published until the next lot replaces it.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Regulatory label — always visible */}
          <p className="mt-5 border-l-2 border-ink pl-3 text-[12.5px] leading-relaxed text-ink-3">{product.regulatoryLabel}</p>

          {/* Shipping facts */}
          <ul className="mt-5 grid grid-cols-2 gap-px border border-ink bg-ink font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink">
            <li className="flex items-center gap-2 bg-white px-3 py-2.5">
              {product.shipping.coldChain ? (
                <>
                  <Snowflake className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Ships chilled · same-day dispatch before 2 pm
                </>
              ) : (
                <>
                  <Truck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Same-day dispatch before 2 pm
                </>
              )}
            </li>
            <li className="flex items-center gap-2 bg-white px-3 py-2.5">
              <span className="h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden />
              Free UK shipping over {formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true })}
            </li>
          </ul>

          {children}
        </div>
      </div>

      {/* Mobile sticky bar */}
      {!ctaVisible && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
          <div className="container-x flex h-16 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-[13px] uppercase leading-none">{product.name}</p>
              <p className="mt-1 truncate font-mono text-[12px] tnum text-muted">
                {hideBuy ? "Not recommended for you" : inStock ? `${formatMoney(variant.price)} · ${variant.label}` : AVAILABILITY_LABELS[product.availability]}
              </p>
            </div>
            {hideBuy ? (
              <Button variant="secondary" size="md" onClick={scrollToMatch} className="shrink-0">
                See why
              </Button>
            ) : (
              <Button variant="primary" size="md" onClick={onAdd} className="shrink-0" disabled={!inStock}>
                {buyLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
