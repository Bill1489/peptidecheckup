"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Snowflake, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultationDialog } from "@/components/commerce/consultation-dialog";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { QtyStepper } from "@/components/commerce/qty-stepper";
import { RestockForm } from "@/components/commerce/restock-form";
import { VariantPicker } from "@/components/commerce/variant-picker";
import { defaultVariant, purchasable, type Product } from "@/data/products";
import { useCartStore } from "@/lib/commerce/cart-store";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney, percentOff } from "@/lib/commerce/money";
import { cn } from "@/lib/utils";

const MAX_QTY = 10;
const RESTOCK_ID = "restock";

/**
 * Client island for the product page. Owns the selected variant and quantity
 * so the gallery label, price, CTA and mobile bar all agree. Everything that
 * does not depend on that state arrives as server-rendered `intro` / `children`.
 */
export function ProductStage({ product, intro, children }: { product: Product; intro: React.ReactNode; children: React.ReactNode }) {
  const [variantId, setVariantId] = React.useState(product.defaultVariantId);
  const [qty, setQty] = React.useState(1);
  const [consultOpen, setConsultOpen] = React.useState(false);
  const add = useCartStore((s) => s.add);

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
  const canBuy = purchasable(product) && (variant.stock > 0 || preorder);
  const multi = product.variants.length > 1;
  const total = variant.price * qty;
  const off = percentOff(variant.price, variant.compareAtPrice);

  const onAdd = () => {
    const ok = add(product.id, variant.id, qty);
    if (ok) {
      toast(`${product.name} added to cart`, { description: `${qty} × ${variant.label} · ${formatMoney(total)}` });
    } else {
      toast("This item can't be added right now.");
    }
  };

  const scrollToRestock = () => {
    const el = document.getElementById(RESTOCK_ID);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.querySelector("input")?.focus({ preventScroll: true });
  };

  const buyLabel = preorder ? "Pre-order" : "Add to cart";

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left — sticky visual */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery product={product} meta={variant.label} />
        </div>

        {/* Right — purchase column */}
        <div className="min-w-0">
          {intro}

          {/* Price */}
          <div className="mt-6 border-t border-ink pt-5">
            {product.availability === "consultation" ? (
              <>
                <p className="font-display text-[1.75rem] uppercase leading-none">Consultation</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  No charge to enquire · medicine priced by the pharmacy after prescription
                </p>
              </>
            ) : product.availability === "not_sold" ? (
              <>
                <p className="font-display text-[1.75rem] uppercase leading-none text-muted">Not sold</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Listed for information only</p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {multi && product.availability !== "consultation" && product.availability !== "not_sold" && (
            <VariantPicker product={product} value={variant.id} onChange={setVariantId} className="mt-6" />
          )}

          {/* CTA */}
          <div className="mt-6" ref={ctaRef}>
            {canBuy ? (
              <div className="flex gap-3">
                <QtyStepper value={qty} onChange={setQty} max={MAX_QTY} />
                <Button variant="primary" size="xl" className="min-w-0 flex-1 justify-between px-4 sm:px-6" onClick={onAdd}>
                  {buyLabel}
                  <span className="font-mono tnum">{formatMoney(total)}</span>
                </Button>
              </div>
            ) : product.availability === "consultation" ? (
              <>
                <Button variant="brand" size="xl" className="w-full justify-between" onClick={() => setConsultOpen(true)}>
                  Start consultation
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                  Free to enquire. {COMMERCE.prescriberPartner.charAt(0).toUpperCase() + COMMERCE.prescriberPartner.slice(1)} reviews your
                  history and prescribes only where the licensed criteria are met. A consultation can end with no prescription.
                </p>
                <ConsultationDialog product={product} open={consultOpen} onOpenChange={setConsultOpen} />
              </>
            ) : product.availability === "not_sold" ? (
              <NotSoldPanel product={product} />
            ) : (
              <RestockForm product={product} id={RESTOCK_ID} />
            )}
          </div>

          {/* Regulatory label — always visible */}
          <p className="mt-5 border-l-2 border-ink pl-3 text-[12.5px] leading-relaxed text-ink-3">{product.regulatoryLabel}</p>

          {/* Shipping facts */}
          {product.availability !== "not_sold" && (
            <ul className="mt-5 grid grid-cols-2 gap-px border border-ink bg-ink font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink">
              <li className="flex items-center gap-2 bg-white px-3 py-2.5">
                <Truck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {product.availability === "consultation" ? "Pharmacy delivery after prescription" : "Same-day dispatch before 2 pm"}
              </li>
              <li className="flex items-center gap-2 bg-white px-3 py-2.5">
                {product.shipping.coldChain ? (
                  <>
                    <Snowflake className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    Cold-chain delivery
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden />
                    Free UK shipping over {formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true })}
                  </>
                )}
              </li>
            </ul>
          )}

          {children}
        </div>
      </div>

      {/* Mobile sticky bar */}
      {product.availability !== "not_sold" && !ctaVisible && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
          <div className="container-x flex h-16 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-[13px] uppercase leading-none">{product.name}</p>
              <p className="mt-1 font-mono text-[12px] tnum text-muted">
                {product.availability === "consultation"
                  ? "Consultation"
                  : product.availability === "out_of_stock"
                    ? "Out of stock"
                    : `${formatMoney(variant.price)} · ${variant.label}`}
              </p>
            </div>
            {canBuy ? (
              <Button variant="primary" size="md" onClick={onAdd} className="shrink-0">
                {buyLabel}
              </Button>
            ) : product.availability === "consultation" ? (
              <Button variant="brand" size="md" onClick={() => setConsultOpen(true)} className="shrink-0">
                Start consultation
              </Button>
            ) : (
              <Button variant="secondary" size="md" onClick={scrollToRestock} className="shrink-0">
                Notify me
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function NotSoldPanel({ product }: { product: Product }) {
  return (
    <div className={cn("border border-ink border-l-4 border-l-accent-500 p-5")}>
      <p className="label-mono text-accent-600">We list this. We do not sell it.</p>
      <p className="mt-3 text-[14px] leading-relaxed text-ink">{product.description}</p>
      {product.compoundSlug && (
        <Link href={`/peptides/${product.compoundSlug}/`} className="link-rule mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
          Read the evidence record
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
