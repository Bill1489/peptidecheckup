import type { GoalId } from "../types";

/**
 * Commerce data model. Products are separate from compounds: a compound is
 * the evidence/regulatory record, a product is something we sell (or gate).
 * Prices are integers in minor units (pence) — never floats.
 */

export type ProductCategory =
  | "peptide" // lyophilised research peptides
  | "kit" // curated bundles (peptide + supplies)
  | "supplies" // bacteriostatic water, syringes, alcohol swabs, sharps bin
  | "topical" // GHK-Cu serum etc.
  | "oral"; // collagen peptides, capsules

/** Which legal channel a product is sold through. Drives labelling and checkout gating. */
export type SaleChannel =
  | "research" // "research use only" — unlicensed compounds
  | "prescription" // authorised prescription-only medicine — consultation-gated, not sold directly
  | "supplement" // food supplement (collagen)
  | "cosmetic" // topical cosmetic (GHK-Cu serum)
  | "supplies"; // general goods

export type Availability =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "preorder"
  | "consultation" // request a consultation with the partner prescriber
  | "not_sold"; // listed for information only; we decline to sell (e.g. regulator warnings)

export type ProductFormat = "vial" | "pen" | "jar" | "box" | "dropper" | "tube" | "pouch";
export type ProductTone = "ink" | "cobalt" | "grey" | "orange" | "white";

export interface ProductVariant {
  id: string;
  sku: string;
  /** e.g. "5 mg", "10 mg", "3 × 5 mg", "30 mL" */
  label: string;
  /** Minor units (pence). */
  price: number;
  /** Minor units — shown struck through when higher than price. */
  compareAtPrice?: number;
  stock: number;
  /** Optional "per mg" helper for comparison. */
  unitNote?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface CertificateOfAnalysis {
  batch: string;
  testedOn: string; // ISO date
  lab: string;
  purity: string; // "99.3% (HPLC)"
  identity?: string; // "Confirmed (LC-MS)"
  endotoxin?: string; // "< 0.5 EU/mg"
  url?: string;
}

export interface BundleItem {
  productId: string;
  variantId: string;
  qty: number;
}

/** Real product photography (served from /public/products). */
export interface ProductImage {
  /** Path under /public, e.g. "/products/klow-box.jpg" — pass through asset() for basePath hosting. */
  src: string;
  alt: string;
  /** pack = box + pen on white; hand = pen held in hand; detail = close-up */
  kind: "pack" | "hand" | "detail";
  width: number;
  height: number;
}

/** Pre-filled dose-dial pen specifics. */
export interface PenSpec {
  volumeMl: number;
  totalMg: number;
  /** e.g. "6.7 mg/mL" */
  concentration: string;
  /** Component breakdown for blends, e.g. "GHK-Cu 50 mg · BPC-157 10 mg · TB-500 10 mg · KPV 10 mg" */
  composition: string;
  storage: string;
  /** e.g. "Dial-a-dose · 0.01 mL increments" */
  dialing: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Short qualifier under the name, e.g. "Lyophilised · 5 mg vial" */
  subtitle: string;
  /** Links the product to its evidence/regulatory record, when it has one. */
  compoundSlug?: string;
  category: ProductCategory;
  channel: SaleChannel;
  availability: Availability;
  variants: ProductVariant[];
  defaultVariantId: string;
  /** Physical form, e.g. "Lyophilised powder in a 3 mL glass vial" */
  form: string;
  /** e.g. "≥ 99% (HPLC)" — omit for supplies */
  purity?: string;
  specs: ProductSpec[];
  /** 2–4 sentences, plain English, no health claims for research products. */
  description: string;
  highlights: string[];
  coa?: CertificateOfAnalysis;
  /** Mandatory labelling line rendered on cards, PDP, cart and checkout. */
  regulatoryLabel: string;
  goals: GoalId[];
  tags: string[];
  /** Fallback illustration + per-product accent colour (hex) taken from the packaging. */
  visual: { format: ProductFormat; tone: ProductTone; accentText?: string; color?: string };
  /** Real photography — preferred over the illustration wherever present. */
  images: ProductImage[];
  /** For blends: the compound slugs inside the pen (single-compound products use compoundSlug). */
  blend?: string[];
  pen?: PenSpec;
  /** One-line answer to "who is this for" used by the matcher and product cards. */
  bestFor: string;
  /** The problem statements this product is matched against (plain English, used by the quiz result). */
  matchFor: string[];
  bundleOf?: BundleItem[];
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  shipping: { weightGrams: number; coldChain?: boolean };
  lastUpdated: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  peptide: "Peptides",
  kit: "Kits",
  supplies: "Supplies",
  topical: "Topicals",
  oral: "Oral",
};

export const CHANNEL_LABELS: Record<SaleChannel, string> = {
  research: "Research use only",
  prescription: "Prescription-only · via consultation",
  supplement: "Food supplement",
  cosmetic: "Cosmetic",
  supplies: "Supplies",
};

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
  preorder: "Pre-order",
  consultation: "Consultation required",
  not_sold: "Not sold",
};
