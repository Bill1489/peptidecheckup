"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { COMMERCE } from "./config";
import type { CartLine, CartTotals } from "./cart-store";
import type { PaymentIntent, PaymentProvider } from "./payments";
import { getProduct, getVariant } from "@/data/products";

/**
 * Orders.
 *
 * There is no backend: an order is created in the browser at the end of
 * checkout, persisted to localStorage (so `/order/?id=` and `/account/orders/`
 * work on this device) and POSTed as JSON to `COMMERCE.orderWebhook` when one
 * is configured.
 *
 * Email receipts: the webhook is the integration point. Whatever receives the
 * payload (Zapier / Make → email step, or your own API) is responsible for the
 * receipt and the fulfilment notification. The payload carries everything a
 * receipt needs — lines, totals, address, acknowledgements, payment reference.
 */

export type OrderStatus = "paid" | "pending" | "demo";
export type OrderSource = "web" | "assessment";

export interface OrderAddress {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  /** ISO 3166-1 alpha-2 */
  countryCode: string;
}

export interface OrderLine {
  productId: string;
  variantId: string;
  /** Snapshot of the product name at the time of order. */
  name: string;
  variantLabel: string;
  /** Minor units (pence). */
  unitPrice: number;
  qty: number;
}

export interface OrderAcknowledgements {
  age18: boolean;
  researchUse: boolean;
  terms: boolean;
}

export interface Order {
  /** "PC-" + 6 uppercase alphanumerics, e.g. PC-7GH2KQ */
  id: string;
  createdAt: string;
  status: OrderStatus;
  email: string;
  name: string;
  phone?: string;
  shippingAddress: OrderAddress;
  shippingOptionId: string;
  shippingLabel: string;
  /** Minor units — what was actually charged for delivery (0 when free). */
  shippingPrice: number;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  total: number;
  currency: string;
  acknowledgements: OrderAcknowledgements;
  paymentProvider: PaymentProvider;
  paymentRef?: string;
  marketingOptIn: boolean;
  source: OrderSource;
}

/* ---------------- Ids ---------------- */

/** Uppercase alphanumerics without the look-alikes 0/O and 1/I. */
const ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ID_LENGTH = 6;

export const ORDER_ID_PATTERN = /^PC-[A-Z0-9]{6}$/;

function randomIndices(count: number, max: number): number[] {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(count);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b % max);
  }
  return Array.from({ length: count }, () => Math.floor(Math.random() * max));
}

export function generateOrderId(existing: Iterable<string> = []): string {
  const taken = new Set(existing);
  for (let attempt = 0; attempt < 20; attempt++) {
    const body = randomIndices(ID_LENGTH, ID_ALPHABET.length)
      .map((i) => ID_ALPHABET[i])
      .join("");
    const id = `PC-${body}`;
    if (!taken.has(id)) return id;
  }
  // Practically unreachable; fall back to a time-based suffix.
  return `PC-${Date.now().toString(36).toUpperCase().slice(-ID_LENGTH).padStart(ID_LENGTH, "X")}`;
}

/** Normalise a user-supplied id (query string, paste) to the canonical form. */
export function normaliseOrderId(input: string | null | undefined): string {
  return (input ?? "").trim().toUpperCase();
}

/* ---------------- Store ---------------- */

const MAX_STORED_ORDERS = 50;

export interface OrdersState {
  /** Newest first. */
  orders: Order[];
  hydrated: boolean;
  addOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
  setHydrated: (v: boolean) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      hydrated: false,
      addOrder: (order) =>
        set({ orders: [order, ...get().orders.filter((o) => o.id !== order.id)].slice(0, MAX_STORED_ORDERS) }),
      getOrder: (id) => {
        const key = normaliseOrderId(id);
        return get().orders.find((o) => o.id === key);
      },
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "peptidecheckup.orders.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ orders: s.orders }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

/* ---------------- Creation ---------------- */

export interface CreateOrderDetails {
  email: string;
  name: string;
  phone?: string;
  shippingAddress: OrderAddress;
  shippingOptionId: string;
  acknowledgements: OrderAcknowledgements;
  marketingOptIn: boolean;
  promoCode?: string;
  payment: PaymentIntent;
  source: OrderSource;
  /** Ids already used on this device, to avoid a collision. */
  existingIds?: Iterable<string>;
}

export function statusForPayment(payment: PaymentIntent): OrderStatus {
  if (payment.provider === "mock") return "demo";
  return payment.status === "succeeded" ? "paid" : "pending";
}

/** Snapshot cart lines against the catalogue (name, label and price at the time of order). */
export function orderLinesFromCart(lines: CartLine[]): OrderLine[] {
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
      },
    ];
  });
}

/**
 * Build an `Order` from the cart, the checkout details and the totals returned
 * by `computeTotals` (so the order agrees to the penny with what the summary
 * showed). Pure: persists nothing.
 */
export function createOrderFromCart(lines: CartLine[], details: CreateOrderDetails, totals: CartTotals): Order {
  const option = COMMERCE.shippingOptions.find((o) => o.id === details.shippingOptionId);
  const address: OrderAddress = {
    line1: details.shippingAddress.line1.trim(),
    city: details.shippingAddress.city.trim(),
    postcode: details.shippingAddress.postcode.trim().toUpperCase(),
    countryCode: details.shippingAddress.countryCode,
  };
  const line2 = details.shippingAddress.line2?.trim();
  if (line2) address.line2 = line2;

  const order: Order = {
    id: generateOrderId(details.existingIds),
    createdAt: new Date().toISOString(),
    status: statusForPayment(details.payment),
    email: details.email.trim().toLowerCase(),
    name: details.name.trim(),
    shippingAddress: address,
    shippingOptionId: option?.id ?? details.shippingOptionId,
    shippingLabel: option?.label ?? totals.shippingLabel,
    shippingPrice: totals.shipping,
    lines: orderLinesFromCart(lines),
    subtotal: totals.subtotal,
    discount: totals.discount,
    total: totals.total,
    currency: COMMERCE.currency,
    acknowledgements: { ...details.acknowledgements },
    paymentProvider: details.payment.provider,
    marketingOptIn: details.marketingOptIn,
    source: details.source,
  };
  const phone = details.phone?.trim();
  if (phone) order.phone = phone;
  if (details.promoCode) order.promoCode = details.promoCode;
  if (details.payment.ref) order.paymentRef = details.payment.ref;
  return order;
}

/** True when any line is a research-channel product (drives the research-use reminder). */
export function orderHasResearchItems(order: Order): boolean {
  const fromCatalogue = order.lines.some((l) => getProduct(l.productId)?.channel === "research");
  return fromCatalogue || order.acknowledgements.researchUse;
}

/* ---------------- Webhook ---------------- */

export interface WebhookResult {
  ok: boolean;
  /** true when a webhook actually received the payload; false when none is configured. */
  delivered: boolean;
  error?: string;
}

/**
 * POST the order as JSON to `COMMERCE.orderWebhook` (Zapier, Make, your API).
 * Resolves without a network call when no webhook is configured. Never throws:
 * the order is already recorded locally, so a delivery failure is reported,
 * not fatal.
 */
export async function postOrderWebhook(order: Order): Promise<WebhookResult> {
  const endpoint = COMMERCE.orderWebhook;
  if (!endpoint) return { ok: true, delivered: false };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "order.created", order, submittedAt: new Date().toISOString() }),
    });
    if (!res.ok) return { ok: false, delivered: false, error: `Webhook responded ${res.status}` };
    return { ok: true, delivered: true };
  } catch (err) {
    return { ok: false, delivered: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
