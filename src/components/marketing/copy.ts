import { COMPOUNDS, getCompound } from "@/data/compounds";
import { defaultVariant, PRODUCTS, type Product } from "@/data/products";
import { JURISDICTION_LABELS, type Jurisdiction } from "@/data/types";
import { SECTION_META, SECTION_ORDER } from "@/lib/assessment/types";
import { BRAND } from "@/lib/brand";
import { formatMoney } from "@/lib/commerce/money";

/**
 * Numbers and names shown in marketing copy are computed from the database,
 * the catalogue, the brand file and the questionnaire spec — never typed by
 * hand — so they stay true as the registry and the range change.
 */

/** Headline time estimate used consistently across nav, hero and landing pages. */
export const ASSESSMENT_MINUTES = 7;

/** "Peptide Checkup" — the assessment's product name, from the brand file. */
export const CHECKUP = BRAND.assessmentName;
/** "Checkup" — the short form used mid-sentence and on buttons once the full name has appeared. */
export const CHECKUP_SHORT = BRAND.assessmentName.split(" ").at(-1) ?? BRAND.assessmentName;

export const NAMED_JURISDICTIONS = (Object.keys(JURISDICTION_LABELS) as Jurisdiction[]).filter(
  (j) => j !== "OTHER",
);

export const SECTION_COUNT = SECTION_ORDER.length;
export const OPTIONAL_SECTION_COUNT = SECTION_ORDER.filter((id) => SECTION_META[id].optional).length;

export function pluralise(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Two-digit index used on spec-sheet rows: 1 → "01". */
export function index(n: number) {
  return String(n).padStart(2, "0");
}

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

/** Small counts as words for headlines ("Six pens"); falls back to digits above twelve. */
export function numberWord(n: number) {
  return WORDS[n] ?? String(n);
}

/** Most recent `lastReviewed` across the compound registry (ISO date). */
export function latestReviewDate(): string | undefined {
  return COMPOUNDS.map((c) => c.lastReviewed)
    .sort()
    .at(-1);
}

/** Laboratories named on published certificates of analysis, de-duplicated. */
export function coaLabs(): string[] {
  return Array.from(new Set(PRODUCTS.flatMap((p) => (p.coa ? [p.coa.lab] : []))));
}

/** Products that carry a published certificate for the lot currently shipping. */
export function productsWithCoa(): number {
  return PRODUCTS.filter((p) => p.coa).length;
}

/* ------------------------------------------------------------------ */
/* Pen copy — one place for how a pen is described in a caption        */
/* ------------------------------------------------------------------ */

/** "20 mg / 3 mL" from the pen spec; falls back to the subtitle for anything that is not a pen. */
export function penDose(product: Product): string {
  if (!product.pen) return product.subtitle;
  return `${product.pen.totalMg.toLocaleString("en-GB")} mg / ${product.pen.volumeMl} mL`;
}

/** Compound slugs a product contains — the single compound, or every component of a blend. */
export function productCompoundSlugs(product: Product): string[] {
  if (product.blend && product.blend.length > 0) return product.blend;
  return product.compoundSlug ? [product.compoundSlug] : [];
}

/** Component names for a blend ("BPC-157 + TB-500"); the compound's name for a single-compound pen. */
export function penComponents(product: Product): string {
  const slugs = productCompoundSlugs(product);
  if (slugs.length === 0) return product.name;
  return slugs.map((slug) => getCompound(slug)?.name ?? slug.toUpperCase()).join(" + ");
}

/** Single-pen price with trailing zeros trimmed, e.g. "£149". */
export function penPrice(product: Product): string {
  return formatMoney(defaultVariant(product).price, { trimZeros: true });
}

/** The two blends in the range (products with more than one compound). */
export function blendProducts(): Product[] {
  return PRODUCTS.filter((p) => (p.blend?.length ?? 0) > 1);
}

/**
 * Pens containing a compound on the WADA Prohibited List, judged from the
 * compound records. Compounds without a record yet are not counted.
 */
export function wadaListedProducts(): Product[] {
  return PRODUCTS.filter((p) =>
    productCompoundSlugs(p).some((slug) => {
      const c = getCompound(slug);
      return c ? c.wadaProhibited !== false : false;
    }),
  );
}

/** What the report contains — mirrors docs/BRIEF.md §6 and the `Report` type. */
export const REPORT_CONTENTS: { title: string; body: string }[] = [
  {
    title: "Your objective",
    body: "Goal, what success would look like, importance and timeframe — flagged if the timeframe is shorter than the trials measured.",
  },
  {
    title: "What you are considering",
    body: "A card for each compound with its class, overall evidence and where it sits on the human-evidence ladder. Blends are split into their components.",
  },
  {
    title: "Evidence assessment",
    body: "Evidence quality for your goal and overall, on the five-point scale, with a summary of what the studies actually showed.",
  },
  {
    title: "Regulatory status",
    body: "Authorised, Not authorised, Investigational or Unclear for your jurisdiction, with the date we last reviewed it.",
  },
  {
    title: "Personal suitability",
    body: "One of three labels per compound, the rationale, and every flag with the answer it came from.",
  },
  {
    title: "Your match",
    body: "The pen the matcher landed on — why it fits, what to review, price and lot — or the statement that nothing in the range is recommended. Higher-concern compounds are never added to the cart.",
  },
  {
    title: "Dosing in three layers",
    body: "What published human studies used; how an amount you are considering compares with those exposures; and whether that needs professional review.",
  },
  {
    title: "Stack intelligence",
    body: "For blends and for two or more compounds: combination evidence, overlapping considerations, evidence gaps and an overall uncertainty rating.",
  },
  {
    title: "Not without professional review",
    body: "Compounds flagged because of the medical information you provided — and the specific reasons.",
  },
  {
    title: "Options, alternatives and questions",
    body: "Other options researched for your goal, potential alternatives, questions to ask a clinician, monitoring and source considerations.",
  },
  {
    title: "Completeness",
    body: "What the report could not assess, which sections you skipped, and what would improve it.",
  },
];
