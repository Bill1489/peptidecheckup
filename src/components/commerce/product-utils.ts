import { getCompound, getStackNote } from "@/data/compounds";
import { GOAL_MAP } from "@/data/goals";
import { PRODUCTS, priceRange, purchasable, type Product, type ProductVariant, type SaleChannel } from "@/data/products";
import { EVIDENCE_RANK, type Compound, type EvidenceQuality, type GoalId, type StackNote } from "@/data/types";
import { formatFrom, formatMoney } from "@/lib/commerce/money";

/* ------------------------------------------------------------------ */
/* Paths & labels                                                      */
/* ------------------------------------------------------------------ */

export function productPath(slug: string) {
  return `/shop/${slug}/`;
}

/** Short channel word for chips and card labels. */
export const CHANNEL_SHORT: Record<SaleChannel, string> = {
  research: "Research",
  prescription: "Consultation",
  supplement: "Supplement",
  cosmetic: "Cosmetic",
  supplies: "Supplies",
};

/** Card-level price line: a single price, or "from £x" when variants differ. */
export function priceLine(product: Product): string | null {
  const { min, max } = priceRange(product);
  if (max === 0) return null;
  if (min === max) return formatMoney(min);
  return formatFrom(product.variants.map((v) => v.price).filter((p) => p > 0));
}

/** Human line for stock on a variant, e.g. "Low stock · 4 left". */
export function variantStockLine(product: Product, variant: ProductVariant): string {
  if (product.availability === "preorder") return "Pre-order";
  if (variant.stock <= 0) return "Out of stock";
  if (variant.stock <= 10) return `Low stock · ${variant.stock} left`;
  return "In stock";
}

/** "3 mL pen" for the six pens; falls back to the physical form for anything else. */
export function formatLine(product: Product): string {
  return product.pen ? `${product.pen.volumeMl} mL pen` : product.form;
}

/* ------------------------------------------------------------------ */
/* Components (single compound or blend)                               */
/* ------------------------------------------------------------------ */

/** Compound slugs inside the product: the blend list, or the single linked compound. */
export function componentSlugs(product: Product): string[] {
  if (product.blend && product.blend.length > 0) return product.blend;
  return product.compoundSlug ? [product.compoundSlug] : [];
}

export interface ProductComponent {
  slug: string;
  /** Compound name when the record exists, otherwise a readable form of the slug. */
  name: string;
  /** Undefined while the evidence record is still being added to the database. */
  compound?: Compound;
  /** "50 mg" when the pen composition states a per-component amount. */
  amount?: string;
}

/** Readable label for a component whose record is missing (e.g. "kpv" → "KPV"). */
function slugLabel(slug: string) {
  if (slug.length <= 4) return slug.toUpperCase();
  return slug.replace(/(^|-)([a-z])/g, (_, sep: string, ch: string) => `${sep}${ch.toUpperCase()}`);
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Pull "GHK-Cu 50 mg" style amounts out of the pen composition string. */
function componentAmount(product: Product, names: string[]): string | undefined {
  const text = product.pen?.composition ?? "";
  for (const n of names) {
    const m = new RegExp(`${escapeRegExp(n)}\\s+(\\d+(?:[.,]\\d+)?)\\s*(mg|mcg|µg|g)\\b`, "i").exec(text);
    if (m) return `${m[1]} ${m[2]}`;
  }
  return undefined;
}

/** Resolved components, in catalogue order. Missing records are kept (with `compound` undefined) so the UI can say so. */
export function productComponents(product: Product): ProductComponent[] {
  return componentSlugs(product).map((slug) => {
    const compound = getCompound(slug);
    const name = compound?.name ?? slugLabel(slug);
    const amount = componentAmount(product, [name, ...(compound?.aliases ?? []), slugLabel(slug)]);
    return { slug, name, compound, amount };
  });
}

/** Compound records the product contains (records still being added are skipped). */
export function productCompounds(product: Product): Compound[] {
  return productComponents(product).flatMap((c) => (c.compound ? [c.compound] : []));
}

export function isBlend(product: Product) {
  return (product.blend?.length ?? 0) > 1;
}

/** Deep link into the assessment with the product's (first) compound pre-selected. */
export function assessmentPath(product: Product) {
  const slug = componentSlugs(product)[0];
  return slug ? `/assessment/?compound=${slug}` : "/assessment/";
}

/* ------------------------------------------------------------------ */
/* Evidence & anti-doping                                              */
/* ------------------------------------------------------------------ */

export function goalLabel(goal: GoalId) {
  return GOAL_MAP[goal].short;
}

/** The product's main goal — first in its goal list. */
export function mainGoal(product: Product): GoalId | undefined {
  return product.goals[0];
}

/** Strongest human-evidence grade any component carries for the goal. Undefined when no record grades it. */
export function evidenceForGoal(product: Product, goal: GoalId): EvidenceQuality | undefined {
  let best: EvidenceQuality | undefined;
  for (const c of productCompounds(product)) {
    const g = c.goals.find((x) => x.goal === goal);
    if (g && (!best || EVIDENCE_RANK[g.evidence] > EVIDENCE_RANK[best])) best = g.evidence;
  }
  return best;
}

export interface GoalEvidenceLine {
  goal: GoalId;
  level: EvidenceQuality;
}

/**
 * The evidence line shown on cards and in the range table: the first of the
 * product's goals that at least one component record grades, with the
 * strongest component grade. Undefined only while a record is pending.
 */
export function primaryGoalEvidence(product: Product): GoalEvidenceLine | undefined {
  for (const goal of product.goals) {
    const level = evidenceForGoal(product, goal);
    if (level) return { goal, level };
  }
  return undefined;
}

export type WadaStatus = "prohibited" | "in_competition" | "clear" | "unknown";

/** Anti-doping position of the whole pen: any prohibited component makes the pen prohibited. */
export function wadaStatus(product: Product): WadaStatus {
  const components = productComponents(product);
  const records = components.flatMap((c) => (c.compound ? [c.compound] : []));
  if (records.some((c) => c.wadaProhibited === true)) return "prohibited";
  if (records.some((c) => c.wadaProhibited === "in_competition")) return "in_competition";
  if (records.length < components.length) return "unknown";
  return "clear";
}

export const WADA_LABELS: Record<WadaStatus, string> = {
  prohibited: "Prohibited — tested athletes",
  in_competition: "Prohibited in competition",
  clear: "Not on the Prohibited List",
  unknown: "Record pending",
};

/** Stack notes between consecutive components of a blend (undefined where the database has none). */
export function blendStackNotes(product: Product): { a: ProductComponent; b: ProductComponent; note?: StackNote }[] {
  const components = productComponents(product);
  const out: { a: ProductComponent; b: ProductComponent; note?: StackNote }[] = [];
  for (let i = 0; i < components.length - 1; i++) {
    const a = components[i];
    const b = components[i + 1];
    const note = a.compound && b.compound ? getStackNote(a.compound, b.compound) : undefined;
    out.push({ a, b, note });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                     */
/* ------------------------------------------------------------------ */

/** Every other pen in the range, catalogue order. */
export function otherProducts(product: Product): Product[] {
  return PRODUCTS.filter((p) => p.id !== product.id);
}

/** Other purchasable products sharing a goal first, then the rest of the range. */
export function relatedProducts(product: Product, limit = 3): Product[] {
  const scored = otherProducts(product)
    .filter(purchasable)
    .map((p) => ({ p, score: p.goals.filter((g) => product.goals.includes(g)).length + (p.bestseller ? 0.5 : 0) }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}

/** Featured products for empty states. */
export function featuredProducts(limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.featured && purchasable(p)).slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Certificates                                                        */
/* ------------------------------------------------------------------ */

/** Every product with a published certificate, most recently tested first. */
export function productsWithCoa(): Product[] {
  return PRODUCTS.filter((p) => p.coa).sort((a, b) => (b.coa?.testedOn ?? "").localeCompare(a.coa?.testedOn ?? ""));
}
