"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { COMMERCE } from "./config";
import { getProduct, getVariant } from "@/data/products";

/**
 * Persistent cart (localStorage). Lines reference variant ids; prices are
 * always re-read from the catalog so a stale cart can't carry old prices.
 */
export interface CartLine {
  productId: string;
  variantId: string;
  qty: number;
  addedAt: string;
}

export interface CartState {
  lines: CartLine[];
  open: boolean;
  promoCode?: string;
  hydrated: boolean;
  /** Set when the user arrives from a completed assessment (unlocks CHECKUP10 messaging). */
  assessmentCompleted: boolean;

  add: (productId: string, variantId: string, qty?: number) => boolean;
  remove: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  setAssessmentCompleted: (v: boolean) => void;
  setHydrated: (v: boolean) => void;
}

const MAX_QTY = 10;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      promoCode: undefined,
      hydrated: false,
      assessmentCompleted: false,

      add: (productId, variantId, qty = 1) => {
        const product = getProduct(productId);
        const variant = getVariant(variantId);
        if (!product || !variant) return false;
        if (!["in_stock", "low_stock", "preorder"].includes(product.availability)) return false;
        const lines = [...get().lines];
        const idx = lines.findIndex((l) => l.variantId === variantId);
        if (idx >= 0) {
          lines[idx] = { ...lines[idx], qty: Math.min(MAX_QTY, lines[idx].qty + qty) };
        } else {
          lines.push({ productId, variantId, qty: Math.min(MAX_QTY, qty), addedAt: new Date().toISOString() });
        }
        set({ lines, open: true });
        return true;
      },
      remove: (variantId) => set({ lines: get().lines.filter((l) => l.variantId !== variantId) }),
      setQty: (variantId, qty) => {
        if (qty <= 0) return get().remove(variantId);
        set({ lines: get().lines.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)) });
      },
      clear: () => set({ lines: [], promoCode: undefined }),
      setOpen: (open) => set({ open }),
      applyPromo: (code) => {
        const key = code.trim().toUpperCase();
        const promo = COMMERCE.promoCodes[key];
        if (!promo) return { ok: false, message: "That code isn't valid." };
        set({ promoCode: key });
        return { ok: true, message: promo.label };
      },
      removePromo: () => set({ promoCode: undefined }),
      setAssessmentCompleted: (v) => set({ assessmentCompleted: v }),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "peptidecheckup.cart.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, promoCode: s.promoCode, assessmentCompleted: s.assessmentCompleted }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

/* ---------------- Derived totals (pure) ---------------- */

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  shippingLabel: string;
  total: number;
  freeShippingRemaining: number;
  promoLabel?: string;
}

export function computeTotals(
  lines: CartLine[],
  opts: { promoCode?: string; shippingOptionId?: string; countryCode?: string } = {},
): CartTotals {
  const subtotal = lines.reduce((sum, l) => sum + (getVariant(l.variantId)?.price ?? 0) * l.qty, 0);
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);

  const promo = opts.promoCode ? COMMERCE.promoCodes[opts.promoCode] : undefined;
  let discount = 0;
  if (promo?.type === "percent") discount = Math.round((subtotal * promo.value) / 100);
  if (promo?.type === "fixed") discount = Math.min(subtotal, promo.value);

  const domestic = !opts.countryCode || opts.countryCode === "GB";
  const option =
    COMMERCE.shippingOptions.find((o) => o.id === opts.shippingOptionId) ??
    (domestic ? COMMERCE.shippingOptions[0] : COMMERCE.shippingOptions[2]);
  let shipping = itemCount === 0 ? 0 : option.price;
  const qualifiesFree = domestic && option.id === "standard" && subtotal - discount >= COMMERCE.freeShippingThreshold;
  if (qualifiesFree || promo?.type === "shipping") shipping = 0;

  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    shippingLabel: option.label,
    total: Math.max(0, subtotal - discount + shipping),
    freeShippingRemaining: Math.max(0, COMMERCE.freeShippingThreshold - (subtotal - discount)),
    promoLabel: promo?.label,
  };
}

/** Whether any line in the cart is a research-channel product (drives checkout acknowledgements). */
export function cartHasResearchItems(lines: CartLine[]) {
  return lines.some((l) => getProduct(l.productId)?.channel === "research");
}
