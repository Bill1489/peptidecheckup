"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/commerce/product-visual";
import { QtyStepper } from "@/components/commerce/qty-stepper";
import { featuredProducts, priceLine, productPath } from "@/components/commerce/product-utils";
import { getProduct, getVariant } from "@/data/products";
import { RESEARCH_USE_LABEL } from "@/lib/brand";
import { cartHasResearchItems, computeTotals, useCartStore, type CartLine } from "@/lib/commerce/cart-store";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cart drawer. Radix Dialog for focus trap, ESC, backdrop and scroll lock;
 * motion for the slide. Prices are always re-read from the catalogue.
 */
export function CartDrawer() {
  const reduce = useReducedMotion();
  const open = useCartStore((s) => s.open);
  const setOpen = useCartStore((s) => s.setOpen);
  const lines = useCartStore((s) => s.lines);
  const hydrated = useCartStore((s) => s.hydrated);
  const promoCode = useCartStore((s) => s.promoCode);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const close = () => setOpen(false);

  // Any route change closes the drawer (checkout link, product links, back button).
  const pathname = usePathname();
  const lastPath = React.useRef(pathname);
  React.useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      setOpen(false);
    }
  }, [pathname, setOpen]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-ink/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.aside
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[26rem] flex-col border-l border-ink bg-white text-ink focus:outline-none"
                initial={reduce ? { opacity: 0 } : { x: "100%" }}
                animate={reduce ? { opacity: 1 } : { x: 0 }}
                exit={reduce ? { opacity: 0 } : { x: "100%" }}
                transition={{ duration: 0.24, ease: EASE }}
              >
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-ink px-5">
                  <Dialog.Title className="font-display text-[1.25rem] uppercase leading-none">
                    Cart · <span className="font-mono text-[1.1rem] font-semibold tnum">{hydrated ? count : 0}</span>
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close cart"
                      className="inline-flex h-11 w-11 items-center justify-center border border-ink text-ink transition-colors hover:bg-ink hover:text-white"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </Dialog.Close>
                </header>

                {!hydrated ? (
                  <DrawerSkeleton />
                ) : lines.length === 0 ? (
                  <EmptyState onNavigate={close} />
                ) : (
                  <FilledCart lines={lines} promoCode={promoCode} onNavigate={close} />
                )}
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Filled cart                                                         */
/* ------------------------------------------------------------------ */

function FilledCart({ lines, promoCode, onNavigate }: { lines: CartLine[]; promoCode?: string; onNavigate: () => void }) {
  const totals = computeTotals(lines, { promoCode });
  const research = cartHasResearchItems(lines);

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ul aria-label="Cart items">
          {lines.map((line) => (
            <CartLineRow key={line.variantId} line={line} onNavigate={onNavigate} />
          ))}
        </ul>

        {research && (
          <div className="mx-5 mt-5 border border-ink border-l-4 border-l-accent-500 p-4">
            <p className="label-mono text-accent-600">Research-use items in cart</p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-3">{RESEARCH_USE_LABEL}</p>
          </div>
        )}

        <PromoBox promoCode={promoCode} promoLabel={totals.promoLabel} />
        <FreeShipping remaining={totals.freeShippingRemaining} progress={totals.subtotal - totals.discount} />
      </div>

      <footer className="shrink-0 border-t border-ink bg-white p-5">
        <dl className="text-[13px]">
          <TotalRow label="Subtotal" value={formatMoney(totals.subtotal)} />
          {totals.discount > 0 && <TotalRow label={promoCode ? `Discount · ${promoCode}` : "Discount"} value={`−${formatMoney(totals.discount)}`} accent />}
          <TotalRow label={`Shipping · ${totals.shippingLabel}`} value={totals.shipping === 0 ? "Free" : formatMoney(totals.shipping)} />
          <div className="mt-2 flex items-baseline justify-between border-t border-ink pt-3">
            <dt className="font-display text-[15px] uppercase">Total</dt>
            <dd className="font-mono text-[1.25rem] tnum">{formatMoney(totals.total)}</dd>
          </div>
          <p className="mt-1 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-muted">VAT included · UK standard shipping shown</p>
        </dl>
        <Button href="/checkout/" variant="primary" size="xl" className="mt-4 w-full justify-between" onClick={onNavigate}>
          Checkout
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button variant="secondary" size="md" className="mt-2 w-full" onClick={onNavigate}>
          Continue shopping
        </Button>
      </footer>
    </>
  );
}

function TotalRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <dt className="label-mono">{label}</dt>
      <dd className={cn("font-mono text-[13px] tnum", accent ? "text-brand-700" : "text-ink")}>{value}</dd>
    </div>
  );
}

function CartLineRow({ line, onNavigate }: { line: CartLine; onNavigate: () => void }) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const product = getProduct(line.productId);
  const variant = getVariant(line.variantId);

  if (!product || !variant) {
    return (
      <li className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 text-[13px] text-muted">
        <span>An item is no longer in the catalogue.</span>
        <button type="button" onClick={() => remove(line.variantId)} className="link-rule font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink">
          Remove
        </button>
      </li>
    );
  }

  const href = productPath(product.slug);
  return (
    <li className="flex gap-4 border-b border-line px-5 py-4">
      <Link href={href} onClick={onNavigate} className="h-16 w-16 shrink-0 border border-ink" aria-label={`${product.name} — view product`}>
        <ProductVisual product={product} meta={variant.label} grid={false} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link href={href} onClick={onNavigate} className="link-rule decoration-transparent hover:decoration-current text-[14px] font-semibold leading-snug text-ink">
            {product.name}
          </Link>
          <span className="shrink-0 font-mono text-[13px] tnum">{formatMoney(variant.price * line.qty)}</span>
        </div>
        <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
          {variant.label} · {formatMoney(variant.price)} each
          {product.channel === "research" && " · Research use only"}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <QtyStepper size="sm" value={line.qty} onChange={(n) => setQty(line.variantId, n)} label={`Quantity of ${product.name}`} />
          <button
            type="button"
            onClick={() => remove(line.variantId)}
            className="link-rule font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted hover:text-ink"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Promo & shipping                                                    */
/* ------------------------------------------------------------------ */

function PromoBox({ promoCode, promoLabel }: { promoCode?: string; promoLabel?: string }) {
  const applyPromo = useCartStore((s) => s.applyPromo);
  const removePromo = useCartStore((s) => s.removePromo);
  const assessmentCompleted = useCartStore((s) => s.assessmentCompleted);
  const [code, setCode] = React.useState("");

  const apply = (value: string) => {
    const res = applyPromo(value);
    toast(res.ok ? "Code applied" : "Code not recognised", { description: res.message });
    if (res.ok) setCode("");
  };

  return (
    <div className="mx-5 mt-5">
      <p className="label-mono mb-2 flex items-center gap-2">
        <Tag className="h-3 w-3" aria-hidden />
        Promo code
      </p>
      {promoCode ? (
        <div className="flex items-center justify-between gap-3 border border-brand-600 bg-brand-50 px-3 py-2.5">
          <div className="min-w-0">
            <p className="font-mono text-[12px] font-semibold tracking-[0.08em] text-brand-700">{promoCode}</p>
            {promoLabel && <p className="truncate text-[12px] text-ink-3">{promoLabel}</p>}
          </div>
          <button type="button" onClick={removePromo} className="link-rule shrink-0 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink">
            Remove
          </button>
        </div>
      ) : (
        <>
          <form
            className="flex border border-ink"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim()) apply(code);
            }}
          >
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CODE"
              aria-label="Promo code"
              autoComplete="off"
              spellCheck={false}
              className="h-11 min-w-0 flex-1 bg-white px-3 font-mono text-[12px] uppercase tracking-[0.12em] text-ink placeholder:text-muted-2 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!code.trim()}
              className="inline-flex h-11 items-center border-l border-ink bg-ink px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-600 disabled:opacity-40"
            >
              Apply
            </button>
          </form>
          {assessmentCompleted && (
            <button
              type="button"
              onClick={() => apply("CHECKUP10")}
              className="mt-2 flex w-full items-center justify-between border border-brand-600 px-3 py-2 text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-brand-700 transition-colors hover:bg-brand-600 hover:text-white"
            >
              Assessment complete · apply CHECKUP10 for 10% off
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </>
      )}
    </div>
  );
}

function FreeShipping({ remaining, progress }: { remaining: number; progress: number }) {
  const pct = Math.min(100, Math.round((progress / COMMERCE.freeShippingThreshold) * 100));
  const unlocked = remaining <= 0;
  return (
    <div className="mx-5 mt-5 mb-5">
      <div className="flex items-baseline justify-between gap-3 font-mono text-[10.5px] uppercase tracking-[0.12em]">
        <span className={unlocked ? "text-brand-700" : "text-muted"}>
          {unlocked ? "Free UK shipping unlocked" : `${formatMoney(remaining)} away from free UK shipping`}
        </span>
        <span className="text-muted tnum">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full border border-ink bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Progress to free UK shipping">
        <div className={cn("h-full transition-[width] duration-200", unlocked ? "bg-brand-600" : "bg-ink")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty & loading states                                              */
/* ------------------------------------------------------------------ */

function EmptyState({ onNavigate }: { onNavigate: () => void }) {
  const featured = featuredProducts(3);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="border-b border-ink px-5 py-8">
        <p className="label-mono">Empty</p>
        <h3 className="mt-3 text-[1.5rem] uppercase">Nothing in your cart</h3>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
          Not sure what fits? The 7-minute assessment maps your goal and history against the evidence and tells you when not to buy.
        </p>
        <Button href="/assessment/" variant="primary" size="md" className="mt-5 w-full justify-between" onClick={onNavigate}>
          Take the assessment
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
      <div className="px-5 py-5">
        <p className="label-mono">Featured</p>
        <ul className="mt-3 border border-ink">
          {featured.map((p) => (
            <li key={p.id} className="border-b border-line last:border-b-0">
              <Link href={productPath(p.slug)} onClick={onNavigate} className="flex items-center gap-4 p-3 hover-invert">
                <span className="h-16 w-16 shrink-0 border border-current">
                  <ProductVisual product={p} grid={false} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[14px] uppercase leading-tight">{p.name}</span>
                  <span className="mt-1 block truncate text-[12px] text-muted">{p.subtitle}</span>
                </span>
                <span className="shrink-0 font-mono text-[13px] tnum">{priceLine(p) ?? "—"}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/shop/" onClick={onNavigate} className="link-rule mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
          Browse the catalogue
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-5" aria-busy aria-label="Loading cart">
      {[0, 1].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="h-16 w-16 skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 skeleton" />
            <div className="h-3 w-1/2 skeleton" />
            <div className="h-9 w-24 skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}
