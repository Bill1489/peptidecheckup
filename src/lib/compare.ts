import { COMPOUNDS, COMPOUND_MAP, getStackNote } from "@/data/compounds";
import { GOALS } from "@/data/goals";
import {
  AVAILABILITY_LABELS,
  CHANNEL_LABELS,
  defaultVariant,
  getProductsForCompound,
  purchasable,
  type Product,
  type ProductVariant,
} from "@/data/products";
import { formatFrom, formatMoney } from "@/lib/commerce/money";
import {
  EVIDENCE_RANK,
  FAMILY_LABELS,
  type Compound,
  type CompoundFamily,
  type GoalId,
  type Jurisdiction,
  type RegulatoryStatus,
  type StackEvidence,
  type StackNote,
} from "@/data/types";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

/** Maximum number of compounds that can be compared side by side. */
export const MAX_COMPARE = 4;

export const COMPARE_PATH = "/compare/";
export const PEPTIDES_PATH = "/peptides/";
export const SHOP_PATH = "/shop/";

/** Jurisdictions offered in the segmented selector. "OTHER" is shown on detail tabs only. */
export const SELECTABLE_JURISDICTIONS = ["UK", "US", "EU", "AU", "CA"] as const;
export type SelectableJurisdiction = (typeof SELECTABLE_JURISDICTIONS)[number];

/** Every jurisdiction in the regulatory record, in display order. */
export const ALL_JURISDICTIONS: readonly Jurisdiction[] = ["UK", "US", "EU", "AU", "CA", "OTHER"];

export const JURISDICTION_SHORT: Record<Jurisdiction, string> = {
  UK: "UK",
  US: "US",
  EU: "EU",
  AU: "AU",
  CA: "CA",
  OTHER: "Other",
};

export function isSelectableJurisdiction(value: string): value is SelectableJurisdiction {
  return (SELECTABLE_JURISDICTIONS as readonly string[]).includes(value);
}

/** Sort order for "Regulatory (authorised first)". */
export const REGULATORY_RANK: Record<RegulatoryStatus, number> = {
  authorised: 0,
  investigational: 1,
  unclear: 2,
  not_authorised: 3,
};

/* ------------------------------------------------------------------ */
/* Slug helpers                                                        */
/* ------------------------------------------------------------------ */

/** Keep only known, unique slugs, capped at MAX_COMPARE. Order is preserved. */
export function normaliseSlugs(slugs: readonly string[]): string[] {
  const out: string[] = [];
  for (const raw of slugs) {
    const slug = raw.trim().toLowerCase();
    if (!slug || out.includes(slug) || !COMPOUND_MAP[slug]) continue;
    out.push(slug);
    if (out.length >= MAX_COMPARE) break;
  }
  return out;
}

/** Parse the `?c=a,b,c` query parameter. Unknown slugs are ignored. */
export function parseCompareParam(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return normaliseSlugs(raw.split(","));
}

/** Build the canonical compare URL for a selection. */
export function compareHref(slugs: readonly string[]): string {
  const clean = normaliseSlugs(slugs);
  return clean.length ? `${COMPARE_PATH}?c=${clean.join(",")}` : COMPARE_PATH;
}

export function compoundHref(slug: string): string {
  return `${PEPTIDES_PATH}${slug}/`;
}

export function productHref(slug: string): string {
  return `${SHOP_PATH}${slug}/`;
}

export function assessmentHref(slug?: string): string {
  return slug ? `/assessment/?compound=${slug}` : "/assessment/";
}

export function sameSlugs(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((s, i) => s === b[i]);
}

/** Readable fallback for a slug that is referenced but not (yet) in the registry. */
export function humaniseSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => (/^[a-z]{1,3}$/.test(part) ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("-");
}

/** Name for a slug, falling back to a humanised slug when the record is missing. */
export function compoundName(slug: string): string {
  return COMPOUND_MAP[slug]?.name ?? humaniseSlug(slug);
}

/* ------------------------------------------------------------------ */
/* Derived data for the compare tool                                   */
/* ------------------------------------------------------------------ */

export interface SuggestedComparison {
  slugs: string[];
  label: string;
  reason: string;
}

/**
 * Popular comparisons derived from the registry: for every family with at least
 * two members, the two compounds with the strongest overall evidence (ties keep
 * registry order, which is the curated display order).
 */
export function suggestedComparisons(limit = 4): SuggestedComparison[] {
  const byFamily = new Map<CompoundFamily, Compound[]>();
  for (const c of COMPOUNDS) byFamily.set(c.family, [...(byFamily.get(c.family) ?? []), c]);

  const suggestions: SuggestedComparison[] = [];
  for (const [family, members] of byFamily) {
    if (members.length < 2) continue;
    const [a, b] = [...members].sort(
      (x, y) => EVIDENCE_RANK[y.overallEvidence] - EVIDENCE_RANK[x.overallEvidence] || COMPOUNDS.indexOf(x) - COMPOUNDS.indexOf(y),
    );
    suggestions.push({ slugs: [a.slug, b.slug], label: `${a.name} vs ${b.name}`, reason: FAMILY_LABELS[family] });
  }
  return suggestions.slice(0, limit);
}

/** Every unordered pair of a list, in order of appearance. */
export function pairwise<T>(items: readonly T[]): [T, T][] {
  return items.flatMap((a, i) => items.slice(i + 1).map((b): [T, T] => [a, b]));
}

export interface PairAnalysis {
  a: Compound;
  b: Compound;
  evidence: StackEvidence;
  /** False when the database has no note for this pair — an evidence gap. */
  recorded: boolean;
  overlap?: string;
  note: string;
}

export interface CombinationSummary {
  pairs: PairAnalysis[];
  studied: number;
  limited: number;
  none: number;
}

export const COMBINATION_GAP_NOTE =
  "No published human studies of this combination are recorded in our database. Treat this as an evidence gap rather than as evidence of safety.";

/** Resolve stack notes for every pair in a selection. */
export function analyseCombinations(compounds: readonly Compound[]): CombinationSummary {
  const pairs = pairwise(compounds).map(([a, b]): PairAnalysis => {
    const note: StackNote | undefined = getStackNote(a, b);
    if (!note) return { a, b, evidence: "none", recorded: false, note: COMBINATION_GAP_NOTE };
    return { a, b, evidence: note.evidence, recorded: true, overlap: note.overlap, note: note.note };
  });
  return {
    pairs,
    studied: pairs.filter((p) => p.evidence === "studied").length,
    limited: pairs.filter((p) => p.evidence === "limited").length,
    none: pairs.filter((p) => p.evidence === "none").length,
  };
}

/** Goals that at least one of the compounds has an evidence entry for, in GOALS order. */
export function goalsAcross(compounds: readonly Compound[]): GoalId[] {
  return GOALS.map((g) => g.id).filter((id) => compounds.some((c) => c.goals.some((g) => g.goal === id)));
}

/** Count of published human studies recorded and the largest sample size among them. */
export function studyStats(compound: Compound): { count: number; largestN?: number } {
  const count = compound.dosingResearch.length;
  const largestN = compound.dosingResearch.reduce((max, s) => Math.max(max, s.n ?? 0), 0);
  return { count, largestN: largestN > 0 ? largestN : undefined };
}

export function wadaLabel(status: Compound["wadaProhibited"]): string {
  if (status === true) return "Prohibited at all times";
  if (status === "in_competition") return "Prohibited in competition";
  return "Not prohibited";
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-GB");
}

/* ------------------------------------------------------------------ */
/* Compound ↔ product linking                                          */
/* ------------------------------------------------------------------ */

/**
 * How a compound can be acted on in the shop.
 * - `buy`          — a linked product is purchasable (in stock, low stock or pre-order)
 * - `consultation` — prescription-only; supplied via the partner prescriber, never sold directly
 * - `not_sold`     — listed but we decline to sell it (the product page explains why)
 * - `unstocked`    — no linked product, or the linked product is out of stock
 */
export type CommerceState = "buy" | "consultation" | "not_sold" | "unstocked";

export interface CompoundCommerce {
  product?: Product;
  /** Only set for `buy`: the variant "Add to cart" should use. */
  variant?: ProductVariant;
  state: CommerceState;
  /** "from £34.95" · "£6.95" · "Consultation" · "Not sold" · "Out of stock" · "Not stocked" */
  priceLabel: string;
  /** Availability wording from the catalogue, or "Not stocked" when nothing is linked. */
  availabilityLabel: string;
  /** Sale-channel labelling for product lines, e.g. "Research use only". Empty when nothing is linked. */
  channelLabel: string;
  /** Where the commerce action points: the product page, or the shop index when nothing is linked. */
  href: string;
}

const STATE_RANK: Record<CommerceState, number> = { buy: 0, consultation: 1, not_sold: 2, unstocked: 3 };

/** Call-to-action wording per state (full and compact forms). */
export const COMMERCE_STATE_LABELS: Record<CommerceState, string> = {
  buy: "Add to cart",
  consultation: "Start consultation",
  not_sold: "Why we don't sell it",
  unstocked: "Notify me",
};

export const COMMERCE_STATE_SHORT: Record<CommerceState, string> = {
  buy: "Add to cart",
  consultation: "Consultation",
  not_sold: "Why not sold",
  unstocked: "Notify me",
};

function stateForProduct(product: Product): CommerceState {
  if (product.availability === "not_sold") return "not_sold";
  // Prescription medicines are never sold directly, whatever the stock record says.
  if (product.availability === "consultation" || product.channel === "prescription") return "consultation";
  if (purchasable(product)) return "buy";
  return "unstocked"; // out_of_stock
}

/** The default variant, unless it is sold out and another variant is not. */
function variantToBuy(product: Product): ProductVariant {
  const preferred = defaultVariant(product);
  if (preferred.stock > 0 || product.availability === "preorder") return preferred;
  return product.variants.find((v) => v.stock > 0 && v.price > 0) ?? preferred;
}

/** "£34.95" for a single price, "from £34.95" when variants differ. */
export function productPriceLabel(product: Product): string {
  const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
  if (prices.length === 0) return AVAILABILITY_LABELS[product.availability];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatMoney(min, { trimZeros: true }) : formatFrom(prices);
}

/**
 * Resolve the shop position for a compound. Pure; safe in server and client code.
 * When several products link to one compound (e.g. a vial and a kit), the most
 * actionable wins: buy → consultation → not sold → out of stock, with single
 * products preferred over kits and catalogue order breaking remaining ties.
 */
export function commerceForCompound(slug: string): CompoundCommerce {
  const products = getProductsForCompound(slug);
  if (products.length === 0) {
    return { state: "unstocked", priceLabel: "Not stocked", availabilityLabel: "Not stocked", channelLabel: "", href: SHOP_PATH };
  }

  const product = [...products].sort(
    (a, b) =>
      STATE_RANK[stateForProduct(a)] - STATE_RANK[stateForProduct(b)] ||
      Number(a.category === "kit") - Number(b.category === "kit"),
  )[0];
  const state = stateForProduct(product);
  const base = {
    product,
    state,
    availabilityLabel: AVAILABILITY_LABELS[product.availability],
    channelLabel: CHANNEL_LABELS[product.channel],
    href: productHref(product.slug),
  };

  switch (state) {
    case "buy":
      return { ...base, variant: variantToBuy(product), priceLabel: productPriceLabel(product) };
    case "consultation":
      return { ...base, priceLabel: "Consultation" };
    case "not_sold":
      // The channel label would imply a sale ("Research use only"); "Not sold" is the whole message.
      return { ...base, channelLabel: "", priceLabel: "Not sold" };
    default:
      return { ...base, priceLabel: AVAILABILITY_LABELS[product.availability] };
  }
}
