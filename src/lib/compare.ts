import { COMPOUNDS, COMPOUND_MAP, getStackNote } from "@/data/compounds";
import { GOALS } from "@/data/goals";
import {
  AVAILABILITY_LABELS,
  CHANNEL_LABELS,
  PRODUCTS,
  defaultVariant,
  getProductsForCompound,
  purchasable,
  type Product,
  type ProductVariant,
} from "@/data/products";
import { BRAND } from "@/lib/brand";
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

/** Default comparisons: the range's compounds, paired by the question a visitor is likely to be asking. */
const RANGE_COMPARISONS: { slugs: [string, string]; reason: string }[] = [
  { slugs: ["tesamorelin", "mots-c"], reason: "Body composition · licensed medicine vs mouse-data peptide" },
  { slugs: ["bpc-157", "tb-500"], reason: "Repair · the two Wolverine components" },
  { slugs: ["ghk-cu", "kpv"], reason: "Skin & repair · two Klow components" },
  { slugs: ["nad", "mots-c"], reason: "Energy & healthy ageing · coenzyme vs peptide" },
];

/**
 * Suggested comparisons: the curated range pairs first, then — if more are
 * wanted — one pair per family (its two strongest-evidence members, ties keeping
 * registry order). Pairs whose compounds are missing from the registry are skipped.
 */
export function suggestedComparisons(limit = 4): SuggestedComparison[] {
  const suggestions: SuggestedComparison[] = [];
  const seen = new Set<string>();
  const push = (a: Compound, b: Compound, reason: string) => {
    const key = [a.slug, b.slug].sort().join("+");
    if (seen.has(key)) return;
    seen.add(key);
    suggestions.push({ slugs: [a.slug, b.slug], label: `${a.name} vs ${b.name}`, reason });
  };

  for (const pair of RANGE_COMPARISONS) {
    const [a, b] = pair.slugs.map((s) => COMPOUND_MAP[s]);
    if (a && b) push(a, b, pair.reason);
  }

  if (suggestions.length < limit) {
    const byFamily = new Map<CompoundFamily, Compound[]>();
    for (const c of COMPOUNDS) byFamily.set(c.family, [...(byFamily.get(c.family) ?? []), c]);
    for (const [family, members] of byFamily) {
      if (members.length < 2) continue;
      const [a, b] = [...members].sort(
        (x, y) => EVIDENCE_RANK[y.overallEvidence] - EVIDENCE_RANK[x.overallEvidence] || COMPOUNDS.indexOf(x) - COMPOUNDS.indexOf(y),
      );
      push(a, b, FAMILY_LABELS[family]);
    }
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
/* The Aervyn range                                                    */
/* ------------------------------------------------------------------ */

/** Compound slugs a pen carries: its single compound, or every component of a blend. */
export function pensCompounds(product: Product): string[] {
  return product.blend ?? (product.compoundSlug ? [product.compoundSlug] : []);
}

/**
 * Every compound in the catalogue — on its own pen or inside a blend — in
 * catalogue order. This is what "in the Aervyn range" means across the site.
 */
export const RANGE_SLUGS: readonly string[] = Array.from(new Set(PRODUCTS.flatMap(pensCompounds)));

export function inRange(slug: string): boolean {
  return RANGE_SLUGS.includes(slug);
}

export interface RangeProduct {
  product: Product;
  /** True when the compound is one component of a blend pen. */
  inBlend: boolean;
  /** Names of the other compounds in the pen (empty for a single-compound pen). */
  partners: string[];
}

/** Every pen containing the compound: single-compound pens first, then blends, catalogue order. */
export function rangeProductsFor(slug: string): RangeProduct[] {
  const singles = getProductsForCompound(slug).map((product): RangeProduct => ({ product, inBlend: false, partners: [] }));
  const blends = PRODUCTS.filter((p) => p.blend?.includes(slug)).map(
    (product): RangeProduct => ({
      product,
      inBlend: true,
      partners: (product.blend ?? []).filter((s) => s !== slug).map(compoundName),
    }),
  );
  return [...singles, ...blends];
}

/** "BPC-157 and TB-500" · "GHK-Cu, BPC-157 and TB-500" */
export function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/* ------------------------------------------------------------------ */
/* Compound ↔ product linking                                          */
/* ------------------------------------------------------------------ */

/**
 * How a compound can be acted on in the shop.
 * - `buy`          — a linked pen is purchasable (in stock, low stock or pre-order)
 * - `consultation` — prescription-only; supplied via the partner prescriber, never sold directly
 * - `not_sold`     — listed but we decline to sell it (the product page explains why)
 * - `unstocked`    — not in the range, or the linked pen is out of stock
 */
export type CommerceState = "buy" | "consultation" | "not_sold" | "unstocked";

export interface CompoundCommerce {
  /** The resolved pen: a single-compound pen, or the blend that contains the compound. */
  product?: Product;
  /** Only set for `buy`: the variant "Add to cart" should use. */
  variant?: ProductVariant;
  state: CommerceState;
  /** Plain price of the variant to buy, e.g. "£139" or "from £139". Only set for `buy`. */
  price?: string;
  /** "£149" · "In Wolverine · £139" · "Consultation" · "Not sold" · "Out of stock" · "Not in the Aervyn range" */
  priceLabel: string;
  /** Availability wording from the catalogue, or "Not in the Aervyn range" when nothing is linked. */
  availabilityLabel: string;
  /** Sale-channel labelling for product lines, e.g. "Research use only". Empty when nothing is linked. */
  channelLabel: string;
  /** Where the commerce action points: the pen's page, or the shop index when nothing is linked. */
  href: string;
  /** True when the resolved pen is a blend that carries the compound alongside others. */
  inBlend: boolean;
  /** The blend pen's name, e.g. "Wolverine". Only set with `inBlend`. */
  blendName?: string;
  /** The other compounds in the blend, e.g. ["BPC-157", "TB-500"]. Only set with `inBlend`. */
  blendPartners?: string[];
}

export const NOT_IN_RANGE_LABEL = `Not in the ${BRAND.displayName} range`;

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

/** "£139" for the variant on offer; "from £139" only when a cheaper size exists. */
export function variantPriceLabel(product: Product, variant: ProductVariant): string {
  const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
  if (prices.length === 0 || variant.price <= 0) return AVAILABILITY_LABELS[product.availability];
  return prices.some((p) => p < variant.price) ? formatFrom(prices) : formatMoney(variant.price, { trimZeros: true });
}

/**
 * Resolve the shop position for a compound. Pure; safe in server and client code.
 *
 * A compound resolves to a pen that carries it — its own single-compound pen or
 * a blend it is part of (Wolverine, Klow). When several pens qualify, the most
 * actionable wins: buy → consultation → not sold → out of stock; then a
 * single-compound pen beats a blend, a single product beats a kit, and catalogue
 * order breaks remaining ties. A compound resolved through a blend is labelled
 * "In Wolverine · £139" and carries `inBlend`, `blendName` and `blendPartners`.
 * Compounds in no pen at all are "Not in the Aervyn range".
 */
export function commerceForCompound(slug: string): CompoundCommerce {
  const candidates = rangeProductsFor(slug);
  if (candidates.length === 0) {
    return {
      state: "unstocked",
      priceLabel: NOT_IN_RANGE_LABEL,
      availabilityLabel: NOT_IN_RANGE_LABEL,
      channelLabel: "",
      href: SHOP_PATH,
      inBlend: false,
    };
  }

  const { product, inBlend, partners } = [...candidates].sort(
    (a, b) =>
      STATE_RANK[stateForProduct(a.product)] - STATE_RANK[stateForProduct(b.product)] ||
      Number(a.inBlend) - Number(b.inBlend) ||
      Number(a.product.category === "kit") - Number(b.product.category === "kit"),
  )[0];
  const state = stateForProduct(product);
  const availabilityLabel = AVAILABILITY_LABELS[product.availability];
  const base: CompoundCommerce = {
    product,
    state,
    priceLabel: availabilityLabel,
    availabilityLabel,
    channelLabel: CHANNEL_LABELS[product.channel],
    href: productHref(product.slug),
    inBlend,
    ...(inBlend ? { blendName: product.name, blendPartners: partners } : {}),
  };
  const withPen = (label: string) => (inBlend ? `In ${product.name} · ${label}` : label);

  switch (state) {
    case "buy": {
      const variant = variantToBuy(product);
      const price = variantPriceLabel(product, variant);
      return { ...base, variant, price, priceLabel: withPen(price) };
    }
    case "consultation":
      return { ...base, priceLabel: "Consultation" };
    case "not_sold":
      // The channel label would imply a sale ("Research use only"); "Not sold" is the whole message.
      return { ...base, channelLabel: "", priceLabel: "Not sold" };
    default:
      return { ...base, priceLabel: withPen(availabilityLabel) };
  }
}
