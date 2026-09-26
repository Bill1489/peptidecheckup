import { COMMERCE } from "./config";

/**
 * Format minor units (fils) as a currency string, e.g. 105000 → "AED 1,050".
 * Whole amounts are shown without decimals (the manufacturer lists whole dirhams);
 * fractional amounts keep two decimals.
 */
export function formatMoney(minor: number, opts?: { trimZeros?: boolean }) {
  const value = minor / 100;
  const whole = minor % 100 === 0;
  const formatted = new Intl.NumberFormat(COMMERCE.locale, {
    style: "currency",
    currency: COMMERCE.currency,
    currencyDisplay: "code",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(value);
  // Intl renders the code without a space in some locales; normalise to "AED 1,050".
  const normalised = formatted.replace(/^([A-Z]{3})\s?/, "$1 ").replace(/\u00a0/g, " ");
  return opts?.trimZeros ? normalised.replace(/\.00$/, "") : normalised;
}

/** "from AED 850" for variant ranges. */
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
