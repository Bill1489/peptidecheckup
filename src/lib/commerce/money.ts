import { COMMERCE } from "./config";

/** Format minor units (pence) as a currency string, e.g. 4950 → "£49.50". */
export function formatMoney(minor: number, opts?: { trimZeros?: boolean }) {
  const value = minor / 100;
  const formatted = new Intl.NumberFormat(COMMERCE.locale, {
    style: "currency",
    currency: COMMERCE.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return opts?.trimZeros ? formatted.replace(/\.00$/, "") : formatted;
}

/** "from £39" for variant ranges. */
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
