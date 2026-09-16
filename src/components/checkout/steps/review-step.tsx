"use client";

import * as React from "react";
import Link from "next/link";
import { COUNTRY_MAP } from "@/data/countries";
import { RESEARCH_USE_LABEL } from "@/lib/brand";
import type { CheckoutAcknowledgements, CheckoutAddress, CheckoutContact, CheckoutStep } from "@/lib/commerce/checkout-store";
import type { ShippingOption } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import type { PaymentProvider } from "@/lib/commerce/payments";
import { cardBrand, last4, type CardDetails } from "../card-format";
import { Checkbox, ErrorPanel, NoticePanel } from "../fields";
import type { AckField, Errors } from "../validation";

function ReviewBlock({
  label,
  step,
  onEdit,
  children,
}: {
  label: string;
  step: CheckoutStep;
  onEdit: (step: CheckoutStep) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="label-mono text-ink">{label}</p>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="label-mono -m-2 p-2 text-ink underline decoration-1 underline-offset-4 transition-colors hover:text-brand-600"
        >
          Edit
        </button>
      </div>
      <div className="mt-2 text-[14px] leading-relaxed text-ink-2">{children}</div>
    </div>
  );
}

export function ReviewStep({
  contact,
  address,
  shippingOption,
  shippingPrice,
  provider,
  card,
  acknowledgements,
  onAcknowledgementsChange,
  errors,
  showErrors,
  requireAge,
  requireResearch,
  onEdit,
  payError,
}: {
  contact: CheckoutContact;
  address: CheckoutAddress;
  shippingOption: ShippingOption;
  shippingPrice: number;
  provider: PaymentProvider;
  card: CardDetails;
  acknowledgements: CheckoutAcknowledgements;
  onAcknowledgementsChange: (patch: Partial<CheckoutAcknowledgements>) => void;
  errors: Errors<AckField>;
  showErrors: boolean;
  requireAge: boolean;
  requireResearch: boolean;
  onEdit: (step: CheckoutStep) => void;
  payError?: string;
}) {
  const err = (k: AckField) => (showErrors ? errors[k] : undefined);
  const country = COUNTRY_MAP[address.countryCode]?.name ?? address.countryCode;
  const brand = cardBrand(card.number);

  return (
    <div className="grid gap-8">
      <div className="cell-grid sm:grid-cols-3">
        <ReviewBlock label="Contact" step="contact" onEdit={onEdit}>
          <p className="truncate">{contact.email}</p>
          <p>{contact.name}</p>
          {contact.phone && <p className="font-mono text-[13px] tnum">{contact.phone}</p>}
        </ReviewBlock>
        <ReviewBlock label="Delivery" step="delivery" onEdit={onEdit}>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}
            {address.postcode ? `, ${address.postcode}` : ""}
          </p>
          <p>{country}</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            {shippingOption.label} · {shippingOption.eta} · <span className="tnum">{shippingPrice === 0 ? "Free" : formatMoney(shippingPrice)}</span>
          </p>
        </ReviewBlock>
        <ReviewBlock label="Payment" step="payment" onEdit={onEdit}>
          {provider === "stripe" ? (
            <p>Stripe Checkout (redirect)</p>
          ) : (
            <>
              <p>
                {brand ?? "Card"} ending <span className="font-mono tnum">{last4(card.number) || "····"}</span>
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Demo · no charge is made</p>
            </>
          )}
        </ReviewBlock>
      </div>

      <div className="grid gap-1">
        <p className="label-mono mb-2 text-ink">Confirmations</p>
        <div className="divide-y divide-line border-y border-line">
          {requireAge && (
            <Checkbox
              id="review-age18"
              required
              checked={acknowledgements.age18}
              onChange={(v) => onAcknowledgementsChange({ age18: v })}
              label="I confirm that I am 18 or over."
              error={err("age18")}
            />
          )}
          {requireResearch && (
            <Checkbox
              id="review-researchUse"
              required
              checked={acknowledgements.researchUse}
              onChange={(v) => onAcknowledgementsChange({ researchUse: v })}
              label="I acknowledge the research-use terms for the research products in this order."
              description={RESEARCH_USE_LABEL}
              error={err("researchUse")}
            />
          )}
          <Checkbox
            id="review-terms"
            required
            checked={acknowledgements.terms}
            onChange={(v) => onAcknowledgementsChange({ terms: v })}
            label={
              <>
                I accept the{" "}
                <Link href="/terms" className="link-rule" target="_blank" rel="noreferrer">
                  terms of sale
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="link-rule" target="_blank" rel="noreferrer">
                  privacy policy
                </Link>
                , and have read the{" "}
                <Link href="/shipping" className="link-rule" target="_blank" rel="noreferrer">
                  shipping and returns policy
                </Link>
                .
              </>
            }
            error={err("terms")}
          />
        </div>
      </div>

      {payError && <ErrorPanel label="Payment not completed">{payError}</ErrorPanel>}

      {provider === "mock" && (
        <NoticePanel label="Demo">
          Placing the order records it on this device and takes you to the confirmation page. No payment is taken.
        </NoticePanel>
      )}
    </div>
  );
}
