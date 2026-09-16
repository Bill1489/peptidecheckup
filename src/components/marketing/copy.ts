import { COMPOUNDS } from "@/data/compounds";
import { PRODUCTS } from "@/data/products";
import { JURISDICTION_LABELS, type Jurisdiction } from "@/data/types";
import { SECTION_META, SECTION_ORDER } from "@/lib/assessment/types";

/**
 * Numbers shown in marketing copy are computed from the database, the
 * catalogue and the questionnaire spec — never typed by hand — so they stay
 * true as the registry and the range grow.
 */

/** Headline time estimate used consistently across nav, hero and landing pages. */
export const ASSESSMENT_MINUTES = 7;

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

/** What the report contains — mirrors docs/BRIEF.md §6 and the `Report` type. */
export const REPORT_CONTENTS: { title: string; body: string }[] = [
  {
    title: "Your objective",
    body: "Goal, what success would look like, importance and timeframe — flagged if the timeframe is shorter than the trials measured.",
  },
  {
    title: "What you are considering",
    body: "A card for each compound with its class, overall evidence and where it sits on the human-evidence ladder.",
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
    title: "Your matches",
    body: "Products linked to compounds the report marked Potentially relevant, with price and lot. Higher-concern compounds are not added to the cart.",
  },
  {
    title: "Dosing in three layers",
    body: "What published human studies used; how a dose you are considering compares with those exposures; and whether that needs professional review.",
  },
  {
    title: "Stack intelligence",
    body: "For two or more compounds: combination evidence, overlapping considerations, evidence gaps and an overall uncertainty rating.",
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
