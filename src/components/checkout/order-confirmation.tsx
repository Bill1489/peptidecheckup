"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Accordion } from "radix-ui";
import { ArrowRight, ChevronDown, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpecRow } from "@/components/ui/card";
import { COUNTRY_MAP } from "@/data/countries";
import { useAssessmentStore } from "@/lib/assessment/store";
import { RESEARCH_USE_LABEL } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { normaliseOrderId, orderHasResearchItems, useOrdersStore, type Order, type OrderStatus } from "@/lib/commerce/orders";
import { cn, formatDate } from "@/lib/utils";
import { estimateDelivery } from "./delivery-estimate";
import { NoticePanel } from "./fields";
import { OrderLines, Totals, displayLinesFromOrder } from "./order-lines";
import { getShippingOption } from "./shipping-options";
import { useMounted } from "./use-mounted";

/**
 * Order confirmation. Reads `?id=` (static export: no dynamic segments) and
 * looks the order up in this device's order store.
 */

const STATUS_LABEL: Record<OrderStatus, { label: string; tone: "brand" | "ink" | "warning" }> = {
  demo: { label: "Confirmed · demo", tone: "brand" },
  paid: { label: "Paid", tone: "ink" },
  pending: { label: "Pending payment", tone: "warning" },
};

export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const id = normaliseOrderId(searchParams.get("id"));

  const mounted = useMounted();
  const hydrated = useOrdersStore((s) => s.hydrated);
  const orders = useOrdersStore((s) => s.orders);
  const assessmentCompletedAt = useAssessmentStore((s) => s.answers.completedAt);

  if (!mounted || !hydrated) return <OrderSkeleton />;

  const order = orders.find((o) => o.id === id);
  if (!order) return <OrderNotFound id={id} />;

  return <OrderDetail order={order} showAssessmentCta={!assessmentCompletedAt} />;
}

/* ------------------------------------------------------------------ */

function OrderDetail({ order, showAssessmentCta }: { order: Order; showAssessmentCta: boolean }) {
  const status = STATUS_LABEL[order.status];
  const option = getShippingOption(order.shippingOptionId);
  const estimate = option ? estimateDelivery(option, order.createdAt) : undefined;
  const country = COUNTRY_MAP[order.shippingAddress.countryCode]?.name ?? order.shippingAddress.countryCode;
  const research = orderHasResearchItems(order);
  const lines = displayLinesFromOrder(order.lines);
  const itemCount = order.lines.reduce((n, l) => n + l.qty, 0);

  const print = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <article>
      {/* Header */}
      <header className="rule-b">
        <div className="container-x grid gap-6 py-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 lg:py-14">
          <div className="flex flex-col gap-3">
            <p className="label-mono text-brand-600">Order confirmed</p>
            <Badge tone={status.tone} size="md" dot className="w-fit">
              {status.label}
            </Badge>
          </div>
          <div className="min-w-0">
            <h1 className="break-all font-mono text-[2.5rem] font-semibold tnum leading-none tracking-[-0.02em] text-ink sm:text-[4rem] lg:text-[5rem] [font-stretch:100%] [font-variation-settings:normal]">
              {order.id}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-[16px]">
              Thank you, {order.name.split(" ")[0]}. Your order was placed on {formatDate(order.createdAt)} at{" "}
              {new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}.
              {COMMERCE.orderWebhook ? (
                <> A confirmation has been sent to {order.email}.</>
              ) : (
                <> A copy is stored in this browser; email receipts are sent once a fulfilment webhook is configured.</>
              )}
            </p>
            <p className="label-mono mt-5">
              {itemCount} {itemCount === 1 ? "item" : "items"} · {formatMoney(order.total)} · {order.paymentProvider === "mock" ? "Demo payment" : "Card"}
              {order.paymentRef ? ` · Ref ${order.paymentRef}` : ""}
            </p>
          </div>
        </div>
      </header>

      <div className="container-x py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-12">
          <div className="grid gap-10">
            {/* What happens next */}
            <section aria-labelledby="next-heading">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 id="next-heading" className="text-[1.5rem] uppercase sm:text-[1.75rem]">
                  What happens next
                </h2>
                <p className="label-mono hidden sm:block">3 steps</p>
              </div>
              <ol className="cell-grid sm:grid-cols-3">
                <NextStep index="01" title="Packed">
                  {option?.id === "express"
                    ? "Packed for next-working-day dispatch."
                    : "Packed today if you ordered before 2 pm on a working day, otherwise the next working day."}
                </NextStep>
                <NextStep index="02" title="Tracked">
                  Tracking number by email to {order.email} as soon as the parcel leaves the lab.
                </NextStep>
                <NextStep index="03" title="Certified">
                  The certificate of analysis for each batch is in the box and published against the lot number on the vial.
                </NextStep>
              </ol>
            </section>

            {/* Items */}
            <section aria-labelledby="items-heading" className="border border-ink">
              <div className="flex items-baseline justify-between gap-4 border-b border-ink px-4 py-3">
                <h2 id="items-heading" className="label-mono m-0 font-mono text-ink [font-stretch:100%] [font-variation-settings:normal]">
                  Items
                </h2>
                <span className="label-mono tnum">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="px-4">
                <OrderLines lines={lines} />
              </div>
              <div className="border-t border-ink px-4 py-4">
                <Totals
                  subtotal={order.subtotal}
                  discount={order.discount}
                  shipping={order.shippingPrice}
                  shippingLabel={order.shippingLabel}
                  total={order.total}
                  promoCode={order.promoCode}
                  emphasis
                />
              </div>
            </section>

            {research && (
              <NoticePanel label="Research use" tone="white">
                {RESEARCH_USE_LABEL} You confirmed intended use and that you are 18 or over when placing this order.
              </NoticePanel>
            )}
          </div>

          {/* Side rail */}
          <aside className="grid gap-6 lg:sticky lg:top-28">
            <section aria-labelledby="delivery-heading" className="border border-ink p-4 sm:p-5">
              <h2 id="delivery-heading" className="label-mono m-0 font-mono text-ink [font-stretch:100%] [font-variation-settings:normal]">
                Delivery
              </h2>
              <div className="mt-2">
                <SpecRow label="Method" value={order.shippingLabel} />
                <SpecRow label="Estimate" value={estimate ? estimate.text : option?.eta ?? "—"} />
                <SpecRow
                  label="Address"
                  value={
                    <span className="block leading-relaxed">
                      {order.name}
                      <br />
                      {order.shippingAddress.line1}
                      {order.shippingAddress.line2 && (
                        <>
                          <br />
                          {order.shippingAddress.line2}
                        </>
                      )}
                      <br />
                      {order.shippingAddress.city}
                      {order.shippingAddress.postcode ? `, ${order.shippingAddress.postcode}` : ""}
                      <br />
                      {country}
                    </span>
                  }
                />
                <SpecRow label="Contact" value={<span className="break-all">{order.email}</span>} />
                {order.phone && <SpecRow label="Phone" value={<span className="font-mono tnum">{order.phone}</span>} />}
              </div>
            </section>

            <div className="no-print grid gap-2">
              <Button href="/shop" size="lg" className="w-full">
                Continue shopping
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              {showAssessmentCta && (
                <Button href="/assessment" variant="secondary" size="lg" className="w-full">
                  Take the assessment
                </Button>
              )}
              <Button type="button" variant="ghost" size="lg" className="w-full" onClick={print}>
                <Printer className="h-4 w-4" aria-hidden />
                Print receipt
              </Button>
            </div>

            <OrderJson order={order} />
          </aside>
        </div>
      </div>
    </article>
  );
}

function NextStep({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <li className="p-4 sm:p-5">
      <p className="label-mono text-brand-600">{index}</p>
      <p className="mt-3 text-[1.1rem] font-semibold uppercase tracking-[-0.01em] text-ink">{title}</p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{children}</p>
    </li>
  );
}

function OrderJson({ order }: { order: Order }) {
  const json = React.useMemo(() => JSON.stringify(order, null, 2), [order]);
  return (
    <Accordion.Root type="single" collapsible className="no-print">
      <Accordion.Item value="json">
        <Accordion.Header asChild>
          <div>
            <Accordion.Trigger className="group flex h-12 w-full items-center justify-between gap-3 border border-ink px-4 text-left transition-colors hover:bg-paper-2">
              <span className="label-mono text-ink">Order JSON</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-150 group-data-[state=open]:rotate-180" aria-hidden />
            </Accordion.Trigger>
          </div>
        </Accordion.Header>
        <Accordion.Content>
          <pre className="max-h-[28rem] overflow-auto border border-t-0 border-ink bg-paper-2 p-4 font-mono text-[11px] leading-relaxed text-ink-2">{json}</pre>
          <p className="mt-2 text-[12px] text-muted">The payload POSTed to the order webhook when one is configured.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/* ------------------------------------------------------------------ */

function OrderNotFound({ id }: { id: string }) {
  return (
    <div className="container-x py-16 lg:py-24">
      <div className="mx-auto max-w-xl border border-ink p-8 sm:p-10">
        <p className="label-mono text-accent-600">Order not found</p>
        <h1 className="mt-3 text-[2rem] uppercase sm:text-[2.5rem]">We couldn’t find that order on this device</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          {id ? (
            <>
              No order <span className="font-mono text-ink">{id}</span> is stored in this browser.
            </>
          ) : (
            "No order number was given."
          )}{" "}
          Orders are kept on the device they were placed from; there are no accounts in the demo. Check the link in your confirmation, or open
          the list of orders placed here.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/account/orders" size="lg">
            Your orders
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button href="/shop" variant="secondary" size="lg">
            Continue shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rule-b", className)} aria-busy="true" aria-label="Loading order">
      <div className="container-x grid gap-6 py-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10 lg:py-14">
        <div className="skeleton h-3 w-28" />
        <div>
          <div className="skeleton h-12 w-64 sm:h-16 sm:w-96" />
          <div className="skeleton mt-5 h-4 w-3/4 max-w-xl" />
        </div>
      </div>
    </div>
  );
}
