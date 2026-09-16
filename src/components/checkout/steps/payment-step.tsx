"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentProvider } from "@/lib/commerce/payments";
import { DEMO_CARD, cardBrand, formatCardNumber, formatCvc, formatExpiry, type CardDetails } from "../card-format";
import { ErrorPanel, NoticePanel, TextField } from "../fields";
import type { CardField, Errors } from "../validation";

export function PaymentStep({
  provider,
  card,
  onCardChange,
  errors,
  showErrors,
  stripeError,
  stripeBusy,
  onStripe,
}: {
  provider: PaymentProvider;
  card: CardDetails;
  onCardChange: (patch: Partial<CardDetails>) => void;
  errors: Errors<CardField>;
  showErrors: boolean;
  stripeError?: string;
  stripeBusy?: boolean;
  onStripe: () => void;
}) {
  if (provider === "stripe") {
    return (
      <div className="grid gap-5">
        <NoticePanel label="Stripe Checkout">
          You will be redirected to Stripe to pay. Card details are entered on Stripe’s page and never reach this site. Your order is
          recorded as pending until Stripe confirms payment.
        </NoticePanel>
        {stripeError && <ErrorPanel label="Stripe unavailable">{stripeError}</ErrorPanel>}
        <div>
          <Button type="button" variant="primary" size="lg" onClick={onStripe} loading={stripeBusy}>
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Pay with Stripe
          </Button>
        </div>
      </div>
    );
  }

  const err = (k: CardField) => (showErrors ? errors[k] : undefined);
  const brand = cardBrand(card.number);

  return (
    <div className="grid gap-5">
      <NoticePanel label="Demo checkout — no payment is taken">
        Card details stay in this browser tab and are discarded when you leave. Enter any numbers in the right format, or use the demo card.
        The order is recorded on this device and, when a fulfilment webhook is configured, sent on as JSON.
      </NoticePanel>

      <div className="flex items-center justify-between gap-4">
        <p className="label-mono flex items-center gap-1.5 text-ink">
          <Lock className="h-3 w-3" aria-hidden />
          Card
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={() => onCardChange({ ...DEMO_CARD })}>
          Use demo card
        </Button>
      </div>

      <TextField
        id="payment-name"
        label="Name on card"
        autoComplete="cc-name"
        value={card.name}
        onChange={(v) => onCardChange({ name: v })}
        error={err("name")}
      />
      <TextField
        id="payment-number"
        label="Card number"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="0000 0000 0000 0000"
        value={card.number}
        onChange={(v) => onCardChange({ number: formatCardNumber(v) })}
        error={err("number")}
        trailing={brand}
        className="font-mono tnum"
      />
      <div className="grid gap-5 grid-cols-2">
        <TextField
          id="payment-expiry"
          label="Expiry"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM / YY"
          value={card.expiry}
          onChange={(v) => onCardChange({ expiry: formatExpiry(v) })}
          error={err("expiry")}
          className="font-mono tnum"
        />
        <TextField
          id="payment-cvc"
          label="Security code"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="CVC"
          value={card.cvc}
          onChange={(v) => onCardChange({ cvc: formatCvc(v) })}
          error={err("cvc")}
          className="font-mono tnum"
        />
      </div>
    </div>
  );
}
