import type { GoalId } from "../types";
import { CATALOG } from "./catalog";
import type { Product, ProductCategory, ProductVariant } from "./types";

export * from "./types";

export const PRODUCTS: Product[] = CATALOG;

const BY_ID: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const BY_SLUG: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));
const VARIANTS: Record<string, { variant: ProductVariant; product: Product }> = Object.fromEntries(
  PRODUCTS.flatMap((p) => p.variants.map((v) => [v.id, { variant: v, product: p }])),
);

export function getProduct(id: string): Product | undefined {
  return BY_ID[id];
}

export function getProductBySlug(slug: string): Product | undefined {
  return BY_SLUG[slug];
}

export function getVariant(variantId: string): ProductVariant | undefined {
  return VARIANTS[variantId]?.variant;
}

export function getVariantProduct(variantId: string): Product | undefined {
  return VARIANTS[variantId]?.product;
}

export function defaultVariant(product: Product): ProductVariant {
  return product.variants.find((v) => v.id === product.defaultVariantId) ?? product.variants[0];
}

/** Products linked to a compound record (usually one; kits may reference several). */
export function getProductsForCompound(compoundSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.compoundSlug === compoundSlug);
}

export function productsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function productsForGoal(goal: GoalId): Product[] {
  return PRODUCTS.filter((p) => p.goals.includes(goal));
}

export function purchasable(product: Product): boolean {
  return ["in_stock", "low_stock", "preorder"].includes(product.availability);
}

export function priceRange(product: Product): { min: number; max: number } {
  const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
  if (prices.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Simple ranked search across name, subtitle, tags and compound slug. */
export function searchProducts(query: string, limit = 12): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS.slice(0, limit);
  return PRODUCTS.map((p) => {
    const name = p.name.toLowerCase();
    let score = 0;
    if (name === q) score = 6;
    else if (name.startsWith(q)) score = 5;
    else if (name.includes(q)) score = 4;
    else if (p.tags.some((t) => t.toLowerCase().includes(q))) score = 3;
    else if (p.subtitle.toLowerCase().includes(q)) score = 2;
    else if (p.compoundSlug?.includes(q)) score = 2;
    return { p, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name))
    .slice(0, limit)
    .map((s) => s.p);
}
