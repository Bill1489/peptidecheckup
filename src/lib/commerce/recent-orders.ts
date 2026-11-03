/**
 * Figures shown beside each pen as “purchased in the last 24 hours”.
 * These are fixed editorial placeholders, not measured orders.
 */
const PURCHASED_IN_24H: Record<string, number> = {
  semaglutide: 47,
  tirzepatide: 41,
  retatrutide: 36,
  glow: 33,
  klow: 29,
  "ghk-cu": 27,
  cagrisema: 24,
  nad: 22,
  "bpc-157": 21,
  "mots-c": 19,
  wolverine: 18,
  tesamorelin: 16,
  "tb-500": 15,
  liraglutide: 14,
  ipamorelin: 13,
  sermorelin: 12,
  "cjc-1295": 11,
  kpv: 10,
  "pt-141": 9,
  epitalon: 8,
  "thymosin-alpha-1": 8,
  "ll-37": 7,
  gonadorelin: 6,
  "foxo4-dri": 4,
};

export function purchasedIn24h(slug: string): number {
  return PURCHASED_IN_24H[slug] ?? 6;
}
