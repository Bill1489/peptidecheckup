import { COMMERCE } from "./config";

/**
 * Format minor units (pence) as a currency string, e.g. 25500 → "£255".
 * Whole amounts are shown without decimals (pen prices are whole pounds);
 * fractional amounts keep two decimals ("£5.95").
 */
export function formatMoney(minor: number, opts?: { trimZeros?: boolean }) {
  const value = minor / 100;
  const whole = minor % 100 === 0;
  const formatted = new Intl.NumberFormat(COMMERCE.locale, {
    style: "currency",
    currency: COMMERCE.currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(value);
  // Should the currency ever fall back to a three-letter code, keep a space after it ("AED 1,050").
  const normalised = formatted.replace(/^([A-Z]{3})\s?/, "$1 ").replace(/\u00a0/g, " ");
  return opts?.trimZeros ? normalised.replace(/\.00$/, "") : normalised;
}

/**
 * The manufacturer's list price for reference copy, e.g. 1250 → "AED 1,250".
 * Whole dirhams, code-prefixed so it is never mistaken for a sterling price.
 */
export function formatListPrice(amount: number) {
  return `${COMMERCE.pricing.listCurrency} ${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(amount)}`;
}

/** Prose name of a currency: "pounds sterling", "UAE dirhams"; Intl's display name for anything else. */
export function currencyNoun(code: string): string {
  const preferred: Record<string, string> = { GBP: "pounds sterling", AED: "UAE dirhams", USD: "US dollars", EUR: "euros" };
  if (preferred[code]) return preferred[code];
  try {
    const name = new Intl.DisplayNames(["en"], { type: "currency" }).of(code);
    if (!name || name === code) return code;
    const words = name.split(" ");
    const unit = words.pop() ?? "";
    return [...words, `${unit.toLowerCase()}s`].join(" ");
  } catch {
    return code;
  }
}

/**
 * The fixed list-to-store conversion as prose, e.g.
 * "AED 1 = £0.205, set 26 September 2026, rounded to the nearest £5".
 */
export function pricingRuleText(): string {
  const { listCurrency, rate, rateSetOn, roundTo } = COMMERCE.pricing;
  const rateText = new Intl.NumberFormat(COMMERCE.locale, {
    style: "currency",
    currency: COMMERCE.currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(rate);
  const setOn = new Date(rateSetOn).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `${listCurrency} 1 = ${rateText}, set ${setOn}, rounded to the nearest ${formatMoney(roundTo, { trimZeros: true })}`;
}

/** "from £175" for variant ranges. */
export function formatFrom(minors: number[]) {
  const min = Math.min(...minors);
  return `from ${formatMoney(min, { trimZeros: true })}`;
}

export function percentOff(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** VAT element of a tax-inclusive amount. */
export function vatIncluded(minor: number) {
  return Math.round(minor - minor / (1 + COMMERCE.vatRate));
}
