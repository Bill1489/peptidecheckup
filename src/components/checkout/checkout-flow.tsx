"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Accordion, Collapsible } from "radix-ui";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cartHasResearchItems, computeTotals, useCartStore } from "@/lib/commerce/cart-store";
import { CHECKOUT_STEPS, useCheckoutStore, type CheckoutStep } from "@/lib/commerce/checkout-store";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { createOrderFromCart, postOrderWebhook, useOrdersStore } from "@/lib/commerce/orders";
import { pay, stripeRedirect } from "@/lib/commerce/payments";
import { cn } from "@/lib/utils";
import { EMPTY_CARD, cardBrand, last4, type CardDetails } from "./card-format";
import { OrderSummary } from "./order-summary";
import { resolveShippingOption, shippingOptionsFor } from "./shipping-options";
import { ContactStep } from "./steps/contact-step";
import { DeliveryStep } from "./steps/delivery-step";
import { PaymentStep } from "./steps/payment-step";
import { ReviewStep } from "./steps/review-step";
import { useMounted } from "./use-mounted";
import { hasErrors, validateAcknowledgements, validateAddress, validateCard, validateContact } from "./validation";

/**
 * Checkout: one page, four steps in an accordion (Contact → Delivery →
 * Payment → Review) with a sticky order summary. Form state persists in
 * `useCheckoutStore`; card details stay in component state only.
 *
 * Place order: pay() → createOrderFromCart() → addOrder() → postOrderWebhook()
 * → clear cart → /order/?id=
 */

const STEP_META: Record<CheckoutStep, { index: string; title: string; prompt: string; next: string }> = {
  contact: { index: "01", title: "Contact", prompt: "Where to send the confirmation and tracking.", next: "Continue to delivery" },
  delivery: { index: "02", title: "Delivery", prompt: "Address and delivery method.", next: "Continue to payment" },
  payment: {
    index: "03",
    title: "Payment",
    prompt: COMMERCE.paymentProvider === "stripe" ? "Pay securely with Stripe." : "Demo card — no payment is taken.",
    next: "Continue to review",
  },
  review: { index: "04", title: "Review", prompt: "Check the details and confirm.", next: "Place order" },
};

export function CheckoutFlow() {
  const router = useRouter();
  const mounted = useMounted();

  /* ---- cart ---- */
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const cartHydrated = useCartStore((s) => s.hydrated);
  const assessmentCompleted = useCartStore((s) => s.assessmentCompleted);
  const clearCart = useCartStore((s) => s.clear);

  /* ---- persisted form ---- */
  const contact = useCheckoutStore((s) => s.contact);
  const address = useCheckoutStore((s) => s.address);
  const shippingOptionId = useCheckoutStore((s) => s.shippingOptionId);
  const acknowledgements = useCheckoutStore((s) => s.acknowledgements);
  const step = useCheckoutStore((s) => s.step);
  const checkoutHydrated = useCheckoutStore((s) => s.hydrated);
  const setContact = useCheckoutStore((s) => s.setContact);
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const setShippingOption = useCheckoutStore((s) => s.setShippingOption);
  const setAcknowledgements = useCheckoutStore((s) => s.setAcknowledgements);
  const setStep = useCheckoutStore((s) => s.setStep);
  const completeOrder = useCheckoutStore((s) => s.completeOrder);

  /* ---- orders ---- */
  const orders = useOrdersStore((s) => s.orders);
  const addOrder = useOrdersStore((s) => s.addOrder);

  /* ---- local (never persisted) ---- */
  const [card, setCard] = React.useState<CardDetails>(EMPTY_CARD);
  const [attempted, setAttempted] = React.useState<Partial<Record<CheckoutStep, boolean>>>({});
  const [placing, setPlacing] = React.useState(false);
  const [placedId, setPlacedId] = React.useState<string | null>(null);
  const [payError, setPayError] = React.useState<string | undefined>();
  const [stripeError, setStripeError] = React.useState<string | undefined>();
  const [stripeBusy, setStripeBusy] = React.useState(false);
  const [summaryOpen, setSummaryOpen] = React.useState(false);

  const provider = COMMERCE.paymentProvider;
  const ready = mounted && cartHydrated && checkoutHydrated;

  /* ---- derived ---- */
  const shippingOptions = React.useMemo(() => shippingOptionsFor(address.countryCode), [address.countryCode]);
  const shippingOption = resolveShippingOption(address.countryCode, shippingOptionId);
  const totals = React.useMemo(
    () => computeTotals(lines, { promoCode, shippingOptionId: shippingOption.id, countryCode: address.countryCode }),
    [lines, promoCode, shippingOption.id, address.countryCode],
  );
  const pricedOptions = React.useMemo(
    () =>
      shippingOptions.map((option) => ({
        option,
        price: computeTotals(lines, { promoCode, shippingOptionId: option.id, countryCode: address.countryCode }).shipping,
      })),
    [shippingOptions, lines, promoCode, address.countryCode],
  );

  const requireAge = COMMERCE.requireAgeConfirmation;
  const requireResearch = COMMERCE.requireResearchAcknowledgement && cartHasResearchItems(lines);

  const contactErrors = validateContact(contact);
  const addressErrors = validateAddress(address);
  const cardErrors = provider === "stripe" ? {} : validateCard(card);
  const ackErrors = validateAcknowledgements(acknowledgements, { requireAge, requireResearch });
  const errorsByStep = { contact: contactErrors, delivery: addressErrors, payment: cardErrors, review: ackErrors } as const;

  const stepValid: Record<CheckoutStep, boolean> = {
    contact: !hasErrors(contactErrors),
    delivery: !hasErrors(addressErrors),
    payment: !hasErrors(cardErrors),
    review: !hasErrors(ackErrors),
  };

  // A step is reachable only when every step before it is valid. The persisted
  // step is clamped to that (e.g. after a refresh the card is empty again).
  const firstIncomplete = CHECKOUT_STEPS.findIndex((s) => s !== "review" && !stepValid[s]);
  const maxReachable = firstIncomplete === -1 ? CHECKOUT_STEPS.length - 1 : firstIncomplete;
  const activeIndex = Math.min(CHECKOUT_STEPS.indexOf(step), maxReachable);
  const active = CHECKOUT_STEPS[activeIndex];

  /* ---- navigation ---- */
  const goTo = React.useCallback(
    (target: CheckoutStep) => {
      setStep(target);
      if (typeof window === "undefined") return;
      window.requestAnimationFrame(() => {
        const el = document.getElementById(`step-${target}`);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight * 0.4) el.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    },
    [setStep],
  );

  const focusFirstError = (stepId: CheckoutStep, errors: object) => {
    const key = Object.keys(errors)[0];
    if (!key || typeof window === "undefined") return;
    window.requestAnimationFrame(() => document.getElementById(`${stepId}-${key}`)?.focus());
  };

  const advance = () => {
    const errors = errorsByStep[active];
    setAttempted((a) => ({ ...a, [active]: true }));
    if (hasErrors(errors)) {
      focusFirstError(active, errors);
      return;
    }
    const next = CHECKOUT_STEPS[activeIndex + 1];
    if (next) goTo(next);
  };

  const onStripe = async () => {
    setStripeBusy(true);
    setStripeError(undefined);
    try {
      await stripeRedirect(lines);
    } catch (err) {
      setStripeError(err instanceof Error ? err.message : "Stripe is unavailable.");
    } finally {
      setStripeBusy(false);
    }
  };

  const placeOrder = async () => {
    setAttempted((a) => ({ ...a, review: true }));
    if (hasErrors(ackErrors)) {
      focusFirstError("review", ackErrors);
      return;
    }
    setPlacing(true);
    setPayError(undefined);

    const intent = await pay({ total: totals.total, lines });
    if (intent.status === "failed") {
      setPayError(intent.message ?? "Payment could not be completed.");
      setPlacing(false);
      return;
    }

    const order = createOrderFromCart(
      lines,
      {
        email: contact.email,
        name: contact.name,
        phone: contact.phone || undefined,
        shippingAddress: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          postcode: address.postcode,
          countryCode: address.countryCode,
        },
        shippingOptionId: shippingOption.id,
        acknowledgements: {
          age18: acknowledgements.age18,
          researchUse: requireResearch ? acknowledgements.researchUse : false,
          terms: acknowledgements.terms,
        },
        marketingOptIn: contact.marketingOptIn,
        promoCode,
        payment: intent,
        source: assessmentCompleted ? "assessment" : "web",
        existingIds: orders.map((o) => o.id),
      },
      totals,
    );

    addOrder(order);
    setPlacedId(order.id);

    const hook = await postOrderWebhook(order);
    if (!hook.ok) toast("Order saved on this device", { description: `The fulfilment webhook did not accept it: ${hook.error ?? "unknown error"}.` });

    clearCart();
    completeOrder();
    router.push(`/order/?id=${order.id}`);
  };

  const primaryAction = () => {
    if (placing) return;
    if (active === "review") void placeOrder();
    else advance();
  };

  /* ---- states ---- */
  if (!ready) return <CheckoutSkeleton />;

  if (placedId) {
    return (
      <div className="container-x py-16 lg:py-24">
        <div className="mx-auto max-w-lg border border-ink p-8 text-center sm:p-10">
          <p className="label-mono text-brand-600">Order placed</p>
          <p className="mt-3 font-mono text-[2rem] font-semibold tnum text-ink">{placedId}</p>
          <p className="mt-3 text-[15px] text-muted">Taking you to your confirmation.</p>
          <Button href={`/order/?id=${placedId}`} variant="secondary" size="lg" className="mt-8">
            Open confirmation
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) return <EmptyCart />;

  const summaryFor = (id: CheckoutStep): string => {
    switch (id) {
      case "contact":
        return [contact.email.trim(), contact.name.trim()].filter(Boolean).join(" · ");
      case "delivery":
        return [`${address.line1.trim()}, ${address.city.trim()} ${address.postcode.trim()}`.trim(), shippingOption.label].join(" · ");
      case "payment":
        return provider === "stripe" ? "Stripe Checkout" : `${cardBrand(card.number) ?? "Card"} ending ${last4(card.number) || "····"}`;
      default:
        return "";
    }
  };

  const primaryLabel = active === "review" ? `Place order` : STEP_META[active].next;

  return (
    <div className="container-x pb-28 pt-6 lg:pb-20 lg:pt-10">
      {/* Mobile: collapsible summary */}
      <Collapsible.Root open={summaryOpen} onOpenChange={setSummaryOpen} className="mb-6 border border-ink lg:hidden">
        <Collapsible.Trigger className="flex min-h-[56px] w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-paper-2">
          <span className="label-mono text-ink">
            Order summary · <span className="font-semibold tnum text-ink">{formatMoney(totals.total)}</span>
          </span>
          <span className="label-mono flex items-center gap-2">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
            <ChevronDown className={cn("h-4 w-4 text-ink transition-transform duration-150", summaryOpen && "rotate-180")} aria-hidden />
          </span>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <OrderSummary lines={lines} totals={totals} countryCode={address.countryCode} className="border-0 border-t border-ink" />
        </Collapsible.Content>
      </Collapsible.Root>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_26rem]">
        {/* Stepper */}
        <Accordion.Root
          type="single"
          value={active}
          onValueChange={(v) => {
            if (v) goTo(v as CheckoutStep);
          }}
          className="divide-y divide-ink border border-ink bg-white"
        >
          {CHECKOUT_STEPS.map((id, i) => {
            const meta = STEP_META[id];
            const reachable = i <= maxReachable;
            const isActive = id === active;
            const complete = !isActive && reachable && stepValid[id] && id !== "review";
            return (
              <Accordion.Item key={id} value={id} disabled={!reachable} id={`step-${id}`} className="scroll-mt-28">
                <Accordion.Header asChild>
                  <h2 className="m-0 font-sans font-medium leading-tight tracking-normal [font-stretch:100%] [font-variation-settings:normal]">
                    <Accordion.Trigger
                      className={cn(
                        "group flex min-h-[72px] w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-150 sm:px-6",
                        reachable && !isActive && "hover:bg-paper-2",
                        !reachable && "cursor-default",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className={cn("label-mono block", isActive ? "text-brand-600" : reachable ? "text-ink" : "text-muted-2")}>
                          {meta.index} · {meta.title}
                        </span>
                        <span
                          className={cn(
                            "mt-1.5 block truncate text-[15px]",
                            isActive ? "text-ink" : complete ? "text-muted" : "text-muted-2",
                          )}
                        >
                          {complete ? summaryFor(id) : meta.prompt}
                        </span>
                      </span>
                      {complete && (
                        <span className="label-mono shrink-0 text-ink underline decoration-1 underline-offset-4 group-hover:text-brand-600">Edit</span>
                      )}
                      {isActive && <span className="h-2.5 w-2.5 shrink-0 bg-brand-600" aria-hidden />}
                    </Accordion.Trigger>
                  </h2>
                </Accordion.Header>
                <Accordion.Content className="border-t border-line px-4 py-6 sm:px-6 sm:py-8">
                  {id === "contact" && (
                    <ContactStep value={contact} onChange={setContact} errors={contactErrors} showErrors={Boolean(attempted.contact)} />
                  )}
                  {id === "delivery" && (
                    <DeliveryStep
                      address={address}
                      onAddressChange={(patch) => {
                        setAddress(patch);
                        if (patch.countryCode && patch.countryCode !== address.countryCode) {
                          const next = shippingOptionsFor(patch.countryCode);
                          if (!next.some((o) => o.id === shippingOptionId) && next[0]) setShippingOption(next[0].id);
                        }
                      }}
                      errors={addressErrors}
                      showErrors={Boolean(attempted.delivery)}
                      options={pricedOptions}
                      shippingOptionId={shippingOption.id}
                      onShippingChange={setShippingOption}
                    />
                  )}
                  {id === "payment" && (
                    <PaymentStep
                      provider={provider}
                      card={card}
                      onCardChange={(patch) => setCard((c) => ({ ...c, ...patch }))}
                      errors={cardErrors}
                      showErrors={Boolean(attempted.payment)}
                      stripeError={stripeError}
                      stripeBusy={stripeBusy}
                      onStripe={() => void onStripe()}
                    />
                  )}
                  {id === "review" && (
                    <ReviewStep
                      contact={contact}
                      address={address}
                      shippingOption={shippingOption}
                      shippingPrice={totals.shipping}
                      provider={provider}
                      card={card}
                      acknowledgements={acknowledgements}
                      onAcknowledgementsChange={setAcknowledgements}
                      errors={ackErrors}
                      showErrors={Boolean(attempted.review)}
                      requireAge={requireAge}
                      requireResearch={requireResearch}
                      onEdit={goTo}
                      payError={payError}
                    />
                  )}

                  {/* Desktop actions (mobile uses the sticky bar) */}
                  <div className="mt-8 hidden items-center justify-between gap-4 lg:flex">
                    {i > 0 ? (
                      <Button type="button" variant="ghost" size="md" onClick={() => goTo(CHECKOUT_STEPS[i - 1])}>
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                        Back
                      </Button>
                    ) : (
                      <span className="label-mono">Step {meta.index} of 04</span>
                    )}
                    <Button type="button" size="lg" onClick={primaryAction} loading={placing && id === "review"}>
                      {id === "review" ? `Place order · ${formatMoney(totals.total)}` : meta.next}
                      {id !== "review" && <ArrowRight className="h-4 w-4" aria-hidden />}
                    </Button>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>

        {/* Desktop: sticky summary */}
        <aside className="hidden lg:sticky lg:top-28 lg:block" aria-label="Order summary">
          <OrderSummary lines={lines} totals={totals} countryCode={address.countryCode} />
        </aside>
      </div>

      {/* Mobile: sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-white p-3 lg:hidden">
        <Button type="button" size="xl" className="w-full justify-between px-5" onClick={primaryAction} loading={placing}>
          <span>{primaryLabel}</span>
          <span className="font-mono tnum">{formatMoney(totals.total)}</span>
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EmptyCart() {
  return (
    <div className="container-x py-16 lg:py-24">
      <div className="mx-auto max-w-xl border border-ink p-8 sm:p-10">
        <p className="label-mono text-brand-600">Checkout</p>
        <h2 className="mt-3 text-[2rem] uppercase sm:text-[2.5rem]">Your cart is empty</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Add a product to check out. Every research peptide ships with the certificate of analysis for its batch, and the assessment tells
          you when not to buy.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/shop" size="lg">
            Go to the shop
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button href="/assessment" variant="secondary" size="lg">
            Take the assessment
          </Button>
        </div>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="container-x pt-6 lg:pt-10" aria-busy="true" aria-label="Loading checkout">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-12">
        <div className="divide-y divide-ink border border-ink">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex min-h-[72px] items-center px-4 py-4 sm:px-6">
              <div className="w-full">
                <div className="skeleton h-3 w-24" />
                <div className="skeleton mt-3 h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden border border-ink lg:block">
          <div className="border-b border-ink px-4 py-3">
            <div className="skeleton h-3 w-28" />
          </div>
          <div className="space-y-4 p-4">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="skeleton h-14 w-14" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton mt-2 h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
