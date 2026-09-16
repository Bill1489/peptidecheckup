import { COMMERCE } from "./config";
import type { CartLine } from "./cart-store";
import { getProduct, getVariant } from "@/data/products";

/**
 * Payment provider abstraction.
 *
 * The site is a static export with no backend, so a real card payment cannot
 * be authorised here. `pay()` dispatches on `COMMERCE.paymentProvider`:
 *
 * - `mock`   — the demo. Resolves after ~900 ms with a fake reference. No money
 *              moves; the order is recorded as `demo`.
 * - `stripe` — a stub that throws until the integration is wired (see
 *              `stripeRedirect` for the path).
 */

export type PaymentProvider = (typeof COMMERCE)["paymentProvider"];
export type PaymentStatus = "succeeded" | "requires_redirect" | "failed";

export interface PaymentIntent {
  provider: PaymentProvider;
  status: PaymentStatus;
  /** Provider reference (charge / session id). Empty when the attempt failed. */
  ref: string;
  /** Human-readable detail for `failed` / `requires_redirect`. */
  message?: string;
}

const MOCK_DELAY_MS = 900;

export const STRIPE_NOT_CONFIGURED_MESSAGE =
  "Stripe is not configured (set NEXT_PUBLIC_PAYMENT_PROVIDER=stripe and keys; requires a server-side Checkout Session or Payment Links)";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** FNV-1a 32-bit hash rendered as 8 hex characters. Deterministic for a given input. */
function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/**
 * Demo payment. Resolves after a short delay with a reference that looks like a
 * real provider id ("demo_" + 16 hex chars) but is derived from the amount and
 * the moment of payment — nothing is charged.
 */
export async function mockPay(total: number): Promise<PaymentIntent> {
  await sleep(MOCK_DELAY_MS);
  const seed = `${total}:${Date.now()}`;
  const ref = `demo_${fnv1a(seed)}${fnv1a(`${seed}:pc`)}`;
  return { provider: "mock", status: "succeeded", ref };
}

/**
 * Stripe stub.
 *
 * Integration path (not implemented here because the site has no server):
 *
 * 1. Set `NEXT_PUBLIC_PAYMENT_PROVIDER=stripe` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
 * 2. Either
 *    a) create a Checkout Session server-side (serverless function / small API)
 *       from the `lineItems` below, with `success_url` pointing at
 *       `/order/?id=<orderId>&session_id={CHECKOUT_SESSION_ID}` and
 *       `cancel_url` back to `/checkout/`, then redirect the browser to the
 *       session URL; or
 *    b) for a purely static host, map each variant to a Stripe Payment Link and
 *       redirect to it (no per-order line items, so the cart must be one link).
 * 3. Record the local order as `pending` before redirecting and confirm it as
 *    `paid` from Stripe's webhook (or from `session_id` on return, if you accept
 *    the client-trust trade-off).
 *
 * Until that exists this function throws so the UI can surface a clear message.
 */
export async function stripeRedirect(lines: CartLine[]): Promise<PaymentIntent> {
  const lineItems = lines.map((l) => {
    const product = getProduct(l.productId);
    const variant = getVariant(l.variantId);
    return {
      name: product ? `${product.name} — ${variant?.label ?? l.variantId}` : l.variantId,
      sku: variant?.sku,
      unit_amount: variant?.price ?? 0,
      currency: COMMERCE.currency.toLowerCase(),
      quantity: l.qty,
    };
  });
  throw new Error(STRIPE_NOT_CONFIGURED_MESSAGE, {
    cause: { publishableKey: COMMERCE.stripePublishableKey ? "set" : "missing", lineItems },
  });
}

/**
 * Take payment for a cart. Never throws: provider errors are returned as a
 * `failed` intent so the checkout has a single result path.
 */
export async function pay(input: { total: number; lines: CartLine[] }): Promise<PaymentIntent> {
  const provider = COMMERCE.paymentProvider;
  try {
    switch (provider) {
      case "stripe":
        return await stripeRedirect(input.lines);
      case "mock":
      default:
        return await mockPay(input.total);
    }
  } catch (err) {
    return {
      provider,
      status: "failed",
      ref: "",
      message: err instanceof Error ? err.message : "Payment could not be completed.",
    };
  }
}
