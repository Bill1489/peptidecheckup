/**
 * Card input formatting for the demo payment panel. Formatting only — nothing
 * here talks to a network or validates against an issuer.
 */

export interface CardDetails {
  name: string;
  /** Formatted with spaces as typed. */
  number: string;
  /** "MM / YY" as typed. */
  expiry: string;
  cvc: string;
}

export const EMPTY_CARD: CardDetails = { name: "", number: "", expiry: "", cvc: "" };

/** A well-known test number so the demo can be completed in one click. */
export const DEMO_CARD: CardDetails = { name: "A Researcher", number: "4242 4242 4242 4242", expiry: "12 / 29", cvc: "123" };

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export type CardBrand = "Visa" | "Mastercard" | "Amex" | "Maestro" | "Discover";

export function cardBrand(value: string): CardBrand | undefined {
  const d = digitsOnly(value);
  if (/^4/.test(d)) return "Visa";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^(50|5[6-9]|6[0-9])/.test(d) && /^(5018|5020|5038|5893|6304|6759|676[1-3])/.test(d)) return "Maestro";
  if (/^6(011|5)/.test(d)) return "Discover";
  return undefined;
}

export function formatCardNumber(value: string): string {
  const d = digitsOnly(value).slice(0, 19);
  const groups = /^3[47]/.test(d) ? [4, 6, 5] : [4, 4, 4, 4, 3];
  const parts: string[] = [];
  let i = 0;
  for (const size of groups) {
    if (i >= d.length) break;
    parts.push(d.slice(i, i + size));
    i += size;
  }
  return parts.join(" ");
}

export function formatExpiry(value: string): string {
  let d = digitsOnly(value).slice(0, 4);
  if (d.length === 1 && Number(d) > 1) d = `0${d}`;
  if (d.length >= 3) return `${d.slice(0, 2)} / ${d.slice(2)}`;
  return d;
}

export function formatCvc(value: string): string {
  return digitsOnly(value).slice(0, 4);
}

export function last4(value: string): string {
  return digitsOnly(value).slice(-4);
}

/** True when MM / YY parses and the card has not expired (end of month). */
export function expiryValid(value: string, now = new Date()): boolean {
  const d = digitsOnly(value);
  if (d.length !== 4) return false;
  const month = Number(d.slice(0, 2));
  const year = 2000 + Number(d.slice(2));
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth.getTime() >= now.getTime();
}

export function cardNumberValid(value: string): boolean {
  const len = digitsOnly(value).length;
  return len >= 13 && len <= 19;
}

export function cvcValid(value: string): boolean {
  return /^\d{3,4}$/.test(value);
}
