import type { ShippingOption } from "@/lib/commerce/config";

/**
 * Working-day delivery estimate derived from a shipping option's `eta` text
 * ("2–3 working days", "5–10 working days", "Next working day"). Dispatch is
 * same day before the 2 pm cut-off on a working day, otherwise the next one.
 */

const CUTOFF_HOUR = 14;

function isWorkingDay(d: Date) {
  const day = d.getDay();
  return day !== 0 && day !== 6;
}

function addWorkingDays(from: Date, n: number): Date {
  const d = new Date(from);
  let remaining = n;
  while (remaining > 0) {
    d.setDate(d.getDate() + 1);
    if (isWorkingDay(d)) remaining -= 1;
  }
  return d;
}

export function dispatchDate(placedAt: Date): Date {
  const d = new Date(placedAt);
  d.setHours(12, 0, 0, 0);
  const afterCutoff = placedAt.getHours() >= CUTOFF_HOUR;
  if (isWorkingDay(placedAt) && !afterCutoff) return d;
  return addWorkingDays(d, 1);
}

/** Parse "2–3 working days" → [2, 3]; "Next working day" → [1, 1]; unknown → undefined. */
export function parseWorkingDays(option: Pick<ShippingOption, "eta" | "label">): [number, number] | undefined {
  const text = `${option.eta} ${option.label}`.toLowerCase();
  const range = text.match(/(\d+)\s*(?:[–-]\s*(\d+))?\s*working day/);
  if (range) {
    const a = Number(range[1]);
    const b = range[2] ? Number(range[2]) : a;
    return [Math.min(a, b), Math.max(a, b)];
  }
  if (text.includes("next working day")) return [1, 1];
  return undefined;
}

const DAY_FMT: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" };

export interface DeliveryEstimate {
  start: Date;
  end: Date;
  /** e.g. "Thu 17 – Fri 18 Sep" */
  text: string;
}

export function estimateDelivery(option: Pick<ShippingOption, "eta" | "label">, placedAtIso: string): DeliveryEstimate | undefined {
  const days = parseWorkingDays(option);
  const placedAt = new Date(placedAtIso);
  if (!days || Number.isNaN(placedAt.getTime())) return undefined;
  const dispatched = dispatchDate(placedAt);
  const start = addWorkingDays(dispatched, days[0]);
  const end = addWorkingDays(dispatched, days[1]);
  const startText = start.toLocaleDateString("en-GB", DAY_FMT);
  const endText = end.toLocaleDateString("en-GB", DAY_FMT);
  const sameDay = start.toDateString() === end.toDateString();
  const sameMonth = start.getMonth() === end.getMonth();
  const text = sameDay
    ? startText
    : sameMonth
      ? `${start.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })} – ${endText}`
      : `${startText} – ${endText}`;
  return { start, end, text };
}
