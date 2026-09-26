import { getCompound, getStackNote } from "@/data/compounds";
import { GOAL_MAP } from "@/data/goals";
import { PRODUCTS, priceRange, purchasable, type Product, type ProductVariant, type SaleChannel } from "@/data/products";
import {
  EVIDENCE_RANK,
  JURISDICTION_LABELS,
  type Compound,
  type EvidenceQuality,
  type GoalId,
  type Jurisdiction,
  type RegulatoryStatus,
  type StackNote,
} from "@/data/types";
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

/** Card-level price line: a single price, or "from AED x" when variants differ. */
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

/** "3 mL pen" for the pens; falls back to the physical form for anything else. */
export function formatLine(product: Product): string {
  return product.pen ? `${product.pen.volumeMl} mL pen` : product.form;
}

/** Whether the catalogue has a photograph for the product; otherwise the illustration fallback renders. */
export function hasPhoto(product: Product): boolean {
  return product.images.length > 0;
}

/** Caption shown wherever the illustration stands in for a photograph, so the fallback reads as intentional. */
export const ILLUSTRATION_CAPTION = "Illustration — photo to follow";

/** "A, B and C" — the house list style (no Oxford comma). */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/* ------------------------------------------------------------------ */
/* Manufacturer's categories                                           */
/* ------------------------------------------------------------------ */

export type RangeCategoryId = "recovery" | "longevity" | "skin" | "metabolic" | "growth" | "hormones" | "immune";

export interface RangeCategoryDef {
  id: RangeCategoryId;
  /** The manufacturer's own category name, as printed in the product specs. */
  label: string;
  /** One neutral line about what the category contains — no outcome claims. */
  blurb: string;
}

/** The manufacturer's seven categories, in the order they are shown. */
export const RANGE_CATEGORIES: readonly RangeCategoryDef[] = [
  { id: "recovery", label: "Recovery & repair", blurb: "Tissue-response peptides, on their own and in blends." },
  { id: "longevity", label: "Longevity & energy", blurb: "Cellular-energy, circadian and healthy-ageing research compounds." },
  { id: "skin", label: "Skin & beauty", blurb: "The copper peptide on its own and in blends." },
  { id: "metabolic", label: "Metabolic & weight", blurb: "Incretin-class research compounds — some authorised as medicines elsewhere, none supplied here as a medicine." },
  { id: "growth", label: "Growth & body", blurb: "GHRH analogues and a growth-hormone secretagogue." },
  { id: "hormones", label: "Hormones & sexual health", blurb: "GnRH and melanocortin research compounds." },
  { id: "immune", label: "Immune & gut", blurb: "Immune-signalling and barrier peptides." },
];

const CATEGORY_BY_LABEL: Record<string, RangeCategoryId> = Object.fromEntries(RANGE_CATEGORIES.map((c) => [c.label.toLowerCase(), c.id]));

export function rangeCategoryDef(id: RangeCategoryId): RangeCategoryDef {
  return RANGE_CATEGORIES.find((c) => c.id === id) ?? RANGE_CATEGORIES[0];
}

/** Fallback when the catalogue record carries no manufacturer's category: read it from tags, then the main goal. */
function categoryFromGoalsAndTags(product: Product): RangeCategoryId {
  const tags = product.tags.map((t) => t.toLowerCase());
  if (tags.some((t) => ["immune", "gut", "antimicrobial", "thymic"].includes(t))) return "immune";
  if (tags.some((t) => ["ghrh", "growth hormone", "secretagogue"].includes(t))) return "growth";
  if (tags.some((t) => ["libido", "fertility", "hormones", "gnrh"].includes(t))) return "hormones";
  const goal = product.goals[0];
  switch (goal) {
    case "weight_management":
    case "fat_loss":
      return "metabolic";
    case "injury_recovery":
    case "muscle_recovery":
      return "recovery";
    case "skin_cosmetic":
    case "hair":
      return "skin";
    case "sexual_health":
      return "hormones";
    case "athletic_performance":
      return "growth";
    default:
      return "longevity";
  }
}

/**
 * The manufacturer's category for a pen: the "Manufacturer's category" spec
 * row when the catalogue has one, otherwise derived from tags and goals.
 */
export function rangeCategory(product: Product): RangeCategoryId {
  const spec = product.specs.find((s) => s.label.toLowerCase() === "manufacturer's category")?.value.trim().toLowerCase();
  if (spec && CATEGORY_BY_LABEL[spec]) return CATEGORY_BY_LABEL[spec];
  return categoryFromGoalsAndTags(product);
}

/** Pens in a manufacturer's category, catalogue order. */
export function productsInCategory(id: RangeCategoryId, products: Product[] = PRODUCTS): Product[] {
  return products.filter((p) => rangeCategory(p) === id);
}

/** Categories that have at least one pen, with their pens — for filters and the comparison tabs. */
export function rangeCategoriesWithProducts(products: Product[] = PRODUCTS): { category: RangeCategoryDef; products: Product[] }[] {
  return RANGE_CATEGORIES.map((category) => ({ category, products: productsInCategory(category.id, products) })).filter((c) => c.products.length > 0);
}

/* ------------------------------------------------------------------ */
/* Ordering                                                            */
/* ------------------------------------------------------------------ */

export type ProductSort = "featured" | "name" | "price_asc" | "price_desc";

export const SORT_LABELS: Record<ProductSort, string> = {
  featured: "Featured",
  name: "Name A–Z",
  price_asc: "Price · low to high",
  price_desc: "Price · high to low",
};

function highlightScore(p: Product): number {
  return (p.bestseller ? 2 : 0) + (p.featured ? 1 : 0) + (hasPhoto(p) ? 0.5 : 0);
}

/** Stable sort of a product list. "Featured" puts featured pens first, then bestsellers, then the rest by name. */
export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, "en");
  const list = [...products];
  switch (sort) {
    case "name":
      return list.sort(byName);
    case "price_asc":
      return list.sort((a, b) => priceRange(a).min - priceRange(b).min || byName(a, b));
    case "price_desc":
      return list.sort((a, b) => priceRange(b).min - priceRange(a).min || byName(a, b));
    default:
      return list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)) || byName(a, b));
  }
}

/** Featured and bestselling pens for the home-page strip: bestsellers first, then featured, capped. */
export function rangeHighlights(limit = 8): Product[] {
  return PRODUCTS.filter((p) => (p.featured || p.bestseller) && purchasable(p))
    .map((p, i) => ({ p, i, score: highlightScore(p) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map((s) => s.p);
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

const AMOUNT_TOKEN = /\d+(?:[.,]\d+)?\s*(?:mg|mcg|µg|g)\b/gi;

/**
 * Whether the composition states an amount per component. A blend whose
 * composition carries a single figure ("Cagrilintide · semaglutide 20 mg")
 * states only the combined total, and no component may borrow it.
 */
function statesComponentAmounts(product: Product, componentCount: number): boolean {
  const text = product.pen?.composition ?? "";
  const tokens = text.match(AMOUNT_TOKEN)?.length ?? 0;
  return tokens >= componentCount;
}

/** Resolved components, in catalogue order. Missing records are kept (with `compound` undefined) so the UI can say so. */
export function productComponents(product: Product): ProductComponent[] {
  const slugs = componentSlugs(product);
  const split = statesComponentAmounts(product, slugs.length);
  return slugs.map((slug) => {
    const compound = getCompound(slug);
    const name = compound?.name ?? slugLabel(slug);
    const amount = split ? componentAmount(product, [name, ...(compound?.aliases ?? []), slugLabel(slug)]) : undefined;
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

/* ------------------------------------------------------------------ */
/* Regulatory position                                                 */
/* ------------------------------------------------------------------ */

const JURISDICTION_ORDER: Jurisdiction[] = ["UK", "US", "EU", "AU", "CA", "OTHER"];

/** Jurisdictions on record grouped by status, named jurisdictions only (the general entry is reported separately). */
export function regulatorySummary(compound: Compound): { byStatus: Partial<Record<RegulatoryStatus, string[]>>; other: Compound["regulatory"]["OTHER"] } {
  const byStatus: Partial<Record<RegulatoryStatus, string[]>> = {};
  for (const j of JURISDICTION_ORDER) {
    if (j === "OTHER") continue;
    const entry = compound.regulatory[j];
    (byStatus[entry.status] ??= []).push(JURISDICTION_LABELS[j]);
  }
  return { byStatus, other: compound.regulatory.OTHER };
}

/** The one-word position a compound holds somewhere on record: authorised beats investigational beats the rest. */
export function headlineRegulatoryStatus(compound: Compound): RegulatoryStatus {
  const statuses = Object.values(compound.regulatory).map((r) => r.status);
  if (statuses.includes("authorised")) return "authorised";
  if (statuses.includes("investigational")) return "investigational";
  if (statuses.includes("not_authorised")) return "not_authorised";
  return "unclear";
}

export type RegulatoryNoteKind = "authorised_elsewhere" | "investigational";

export interface RegulatoryNote {
  kind: RegulatoryNoteKind;
  /** Short mono form for tables: "Authorised elsewhere · research product". */
  short: string;
  /** Full sentence for the pen page, under the research-use label. */
  text: string;
}

/**
 * The honest line under the research-use label, read from the component
 * records. A pen whose compound is an authorised medicine somewhere is still a
 * research product here; a pen whose compound is investigational is not
 * authorised anywhere. A blend with an investigational component is an
 * investigational combination whatever its other parts. Undefined when every
 * jurisdiction on record says not authorised — the plain research-use case.
 */
export function regulatoryNote(product: Product): RegulatoryNote | undefined {
  const compounds = productCompounds(product);
  if (compounds.length === 0) return undefined;
  const authorised = compounds.filter((c) => Object.values(c.regulatory).some((r) => r.status === "authorised"));
  const investigational = compounds.filter((c) => Object.values(c.regulatory).some((r) => r.status === "investigational"));

  if (investigational.length > 0) {
    if (isBlend(product) && authorised.length > 0) {
      return {
        kind: "investigational",
        short: "Investigational combination · research product",
        text: `Investigational combination — not authorised anywhere. ${joinNames(authorised.map((c) => c.name))} on its own is authorised as a medicine elsewhere; this pen is a research product, not the licensed medicine.`,
      };
    }
    return { kind: "investigational", short: "Investigational · not authorised anywhere", text: "Investigational — not authorised anywhere." };
  }
  if (authorised.length > 0) {
    const where = Array.from(
      new Set(authorised.flatMap((c) => (Object.keys(c.regulatory) as Jurisdiction[]).filter((j) => j !== "OTHER" && c.regulatory[j].status === "authorised").map((j) => JURISDICTION_LABELS[j]))),
    );
    return {
      kind: "authorised_elsewhere",
      short: "Authorised elsewhere · research product",
      text: `Authorised as a medicine elsewhere (${joinNames(where)}) — this pen is a research product, not the licensed medicine.`,
    };
  }
  return undefined;
}

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

/**
 * Other purchasable pens ranked by shared goals (the main goal counts double),
 * then the manufacturer's category, then bestseller status, then catalogue order.
 */
export function relatedProducts(product: Product, limit = 5): Product[] {
  const category = rangeCategory(product);
  const scored = otherProducts(product)
    .filter(purchasable)
    .map((p, i) => {
      const shared = p.goals.filter((g) => product.goals.includes(g)).length;
      const mainGoalShared = product.goals[0] && p.goals.includes(product.goals[0]) ? 1 : 0;
      const score = shared + mainGoalShared + (rangeCategory(p) === category ? 1 : 0) + (p.bestseller ? 0.5 : 0);
      return { p, i, score };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i);
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
