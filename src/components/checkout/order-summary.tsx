"use client";

import * as React from "react";
import { Tag, X } from "lucide-react";
import { useCartStore, type CartLine, type CartTotals } from "@/lib/commerce/cart-store";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { cn } from "@/lib/utils";
import { inputClass } from "./fields";
import { OrderLines, Totals, displayLinesFromCart } from "./order-lines";
import { isDomestic } from "./shipping-options";

/**
 * Checkout order summary: lines, promo code, totals. Rendered twice on the
 * checkout page (desktop sticky rail, mobile collapsible), so every id is
 * generated with `useId`.
 */
export function OrderSummary({
  lines,
  totals,
  countryCode,
  className,
}: {
  lines: CartLine[];
  totals: CartTotals;
  countryCode: string;
  className?: string;
}) {
  const promoCode = useCartStore((s) => s.promoCode);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const removePromo = useCartStore((s) => s.removePromo);

  const displayLines = React.useMemo(() => displayLinesFromCart(lines), [lines]);
  const domestic = isDomestic(countryCode);

  return (
    <div className={cn("border border-ink bg-white", className)}>
      <div className="flex items-baseline justify-between gap-4 border-b border-ink px-4 py-3">
        <h2 className="label-mono m-0 font-mono text-ink [font-stretch:100%] [font-variation-settings:normal]">Order summary</h2>
        <span className="label-mono tnum">
          {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="px-4">
        <OrderLines lines={displayLines} dense />
      </div>

      <div className="border-t border-ink px-4 py-4">
        <PromoCodeForm promoCode={promoCode} promoLabel={totals.promoLabel} applyPromo={applyPromo} removePromo={removePromo} />
      </div>

      <div className="border-t border-ink px-4 py-4">
        <Totals
          subtotal={totals.subtotal}
          discount={totals.discount}
          shipping={totals.shipping}
          shippingLabel={totals.shippingLabel}
          total={totals.total}
          promoCode={promoCode}
        />
        {domestic && totals.freeShippingRemaining > 0 && totals.shipping > 0 && (
          <p className="mt-3 border-t border-line pt-3 text-[12.5px] text-muted">
            Add <span className="font-mono tnum text-ink">{formatMoney(totals.freeShippingRemaining)}</span> more for free standard delivery.
          </p>
        )}
      </div>

      <ul className="grid grid-cols-1 divide-y divide-line border-t border-ink px-4 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
        {COMMERCE.trustFacts.slice(0, 3).map((fact) => (
          <li key={fact} className="flex items-center gap-2 py-2">
            <span className="h-1.5 w-1.5 shrink-0 bg-ink" aria-hidden />
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PromoCodeForm({
  promoCode,
  promoLabel,
  applyPromo,
  removePromo,
}: {
  promoCode?: string;
  promoLabel?: string;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
}) {
  const id = React.useId();
  const [code, setCode] = React.useState("");
  const [feedback, setFeedback] = React.useState<{ ok: boolean; message: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFeedback({ ok: false, message: "Enter a code." });
      return;
    }
    const result = applyPromo(code);
    setFeedback(result.ok ? null : result);
    if (result.ok) setCode("");
  };

  if (promoCode) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Tag className="h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
          <span className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink">{promoCode}</span>
          {promoLabel && <span className="truncate text-[12.5px] text-muted">· {promoLabel}</span>}
        </div>
        <button
          type="button"
          onClick={removePromo}
          className="inline-flex h-9 shrink-0 items-center gap-1 border border-ink px-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <X className="h-3 w-3" aria-hidden />
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-1.5" noValidate>
      <label htmlFor={id} className="label-mono text-ink">
        Promo code
      </label>
      <div className="flex border border-ink">
        <input
          id={id}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            if (feedback) setFeedback(null);
          }}
          placeholder="CHECKUP10"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={feedback && !feedback.ok ? true : undefined}
          aria-describedby={feedback ? `${id}-feedback` : undefined}
          className={cn(inputClass, "min-w-0 flex-1 border-0 font-mono text-[13px] uppercase tracking-[0.08em] focus:outline-offset-[-2px]")}
        />
        <button
          type="submit"
          className="h-12 shrink-0 border-l border-ink bg-white px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Apply
        </button>
      </div>
      {feedback && (
        <p id={`${id}-feedback`} className={cn("text-[12.5px]", feedback.ok ? "text-muted" : "text-accent-600")}>
          {feedback.message}
        </p>
      )}
    </form>
  );
}
