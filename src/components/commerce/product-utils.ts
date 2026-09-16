import {
  PRODUCTS,
  defaultVariant,
  getProduct,
  getVariant,
  priceRange,
  purchasable,
  type Availability,
  type Product,
  type ProductVariant,
  type SaleChannel,
} from "@/data/products";
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

/** Whether the availability state is one we treat as "you can buy this now". */
export function inStockNow(availability: Availability) {
  return availability === "in_stock" || availability === "low_stock";
}

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

/* ------------------------------------------------------------------ */
/* Kits                                                                */
/* ------------------------------------------------------------------ */

export interface KitContent {
  product: Product;
  variant: ProductVariant;
  qty: number;
}

/** Resolve a kit's `bundleOf` to product/variant records (unresolvable entries are dropped). */
export function kitContents(kit: Product): KitContent[] {
  return (kit.bundleOf ?? []).flatMap((item) => {
    const product = getProduct(item.productId);
    const variant = getVariant(item.variantId);
    return product && variant ? [{ product, variant, qty: item.qty }] : [];
  });
}

/** Price of the kit against buying each line separately. */
export function kitSaving(kit: Product) {
  const contents = kitContents(kit);
  const separately = contents.reduce((sum, c) => sum + c.variant.price * c.qty, 0);
  const price = defaultVariant(kit).price;
  const saving = Math.max(0, separately - price);
  const percent = separately > 0 ? Math.round((saving / separately) * 100) : 0;
  return { separately, price, saving, percent };
}

/* ------------------------------------------------------------------ */
/* Recommendations                                                     */
/* ------------------------------------------------------------------ */

const SUPPLY_ORDER = ["prd_bacwater", "prd_syringes", "prd_prep_pads", "prd_sharps_bin", "prd_vial_case"];

/**
 * "Frequently bought with": purchasable products sharing a goal, then
 * reconstitution supplies for research vials, then featured fallbacks.
 */
export function relatedProducts(product: Product, limit = 3): Product[] {
  const out: Product[] = [];
  const push = (p: Product | undefined) => {
    if (!p || p.id === product.id || out.includes(p)) return;
    if (!purchasable(p)) return;
    if (product.bundleOf?.some((b) => b.productId === p.id)) return;
    out.push(p);
  };

  if (product.category === "supplies") {
    // Supplies pair with other supplies and the bestselling research vials.
    for (const id of SUPPLY_ORDER) push(getProduct(id));
    for (const p of PRODUCTS.filter((x) => x.bestseller)) push(p);
  } else {
    const shared = PRODUCTS.filter((p) => p.goals.some((g) => product.goals.includes(g)) && p.category !== "kit")
      .map((p) => ({ p, score: p.goals.filter((g) => product.goals.includes(g)).length + (p.bestseller ? 0.5 : 0) }))
      .sort((a, b) => b.score - a.score);
    if (product.channel === "research" && product.category === "peptide") {
      // A vial needs diluent and syringes before anything else.
      push(getProduct("prd_bacwater"));
      push(getProduct("prd_syringes"));
    }
    for (const s of shared) push(s.p);
    for (const id of SUPPLY_ORDER) push(getProduct(id));
    for (const p of PRODUCTS.filter((x) => x.featured)) push(p);
  }
  return out.slice(0, limit);
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
