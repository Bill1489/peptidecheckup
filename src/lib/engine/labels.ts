import type { DoseFrequency, StackEvidence } from "@/data/types";
import type { ProductSource } from "@/lib/assessment/types";
import { BRAND } from "@/lib/brand";
import type {
  DoseVerdict,
  Flag,
  FlagSource,
  GoalAlignment,
  SourceAssessment,
  StackAnalysis,
} from "./types";

/**
 * Shared wording for the rules engine and the report UI.
 * Every sentence here follows the compliance rules in docs/BRIEF.md §2:
 * no instructions to take or not take anything, no promises of effect.
 */

export const PROFESSIONAL_REVIEW_SENTENCE =
  "This requires professional review before you make a decision.";

export const RESEARCH_INFO_LABEL = "Research information — not a recommendation";

export const NO_DOSE_ENTERED =
  "You didn't enter a dose — add one to compare against published study exposures.";

export const STACK_SUMMARY_INSUFFICIENT =
  "We found insufficient evidence to establish that this combination is appropriate for you. Discuss the proposed combination with a qualified healthcare professional.";

export const STACK_SUMMARY_STUDIED =
  "This combination has been studied in published human research. That does not establish that it is appropriate for you — discuss the proposed combination, and the context of those studies, with a qualified healthcare professional.";

export const STACK_SUMMARY_LIMITED =
  "Only limited evidence exists for this combination, and none of it establishes that it is appropriate for you. Discuss the proposed combination with a qualified healthcare professional.";

export const NOT_RECOMMENDED_EMPTY =
  "Nothing in your responses triggered a review-required flag for the compounds you're considering. Professional review is still recommended before starting anything.";

/** Grouping labels for flags in the report UI. */
export const FLAG_SOURCE_LABELS: Record<FlagSource, string> = {
  medical: "Medical history",
  medication: "Medicines & supplements",
  pregnancy: "Pregnancy & breastfeeding",
  allergy: "Allergies & reactions",
  age: "Age",
  body: "Body measurements",
  symptoms: "Current symptoms",
  history: "Previous experience & advice",
  source: "Product & source",
  regulatory: "Regulatory status",
  expectation: "Expectations & timeframe",
  stack: "Combination",
  dose: "Considered dose",
  lifestyle: "Lifestyle",
  anti_doping: "Anti-doping",
  information: "Evidence base",
};

/** Reasons shown in "What we would not recommend proceeding with…" — never "don't take X". */
export const NOT_RECOMMENDED_REASONS: Record<FlagSource, string> = {
  medical: "Flagged because of the medical information you provided",
  medication: "Flagged because of a medicine or supplement you take",
  pregnancy: "Flagged because of pregnancy, planned pregnancy or breastfeeding",
  allergy: "Flagged because of an allergy or reaction you reported",
  age: "Flagged because of age-related considerations",
  body: "Flagged because of your body measurements relative to the licensed criteria",
  symptoms: "Flagged because of current symptoms that need assessment first",
  history: "Flagged because of your previous experience or professional advice you received",
  source: "Flagged because of how the product would be obtained",
  regulatory: "Not authorised as a medicine in your jurisdiction",
  expectation: "Flagged because of the timeframe you expect",
  stack: "Flagged because of the combination you're considering",
  dose: "Flagged because the considered dose exceeds published study exposures",
  lifestyle: "Flagged because of lifestyle factors you reported",
  anti_doping: "Prohibited under anti-doping rules",
  information: "Flagged because human evidence is lacking",
};

/**
 * Reason line for a flag in the "would not recommend proceeding with" list.
 * Regulatory flags are split: "not authorised" vs "authorised but obtained
 * without a prescription" read very differently.
 */
export function notRecommendedReason(flag: Pick<Flag, "id" | "source">): string {
  if (flag.source === "regulatory") {
    if (flag.id.endsWith(":no-prescription")) {
      return "Flagged because a prescription-only medicine would be obtained without a prescription";
    }
    if (flag.id.endsWith(":unclear")) return "Regulatory status unclear in your jurisdiction";
    if (flag.id.endsWith(":investigational")) return "Investigational — outside a clinical trial there is no legitimate supply";
  }
  return NOT_RECOMMENDED_REASONS[flag.source];
}

export const GOAL_ALIGNMENT_LABELS: Record<GoalAlignment, string> = {
  aligned: "Researched for your goal",
  partial: "Partially researched for your goal",
  not_aligned: "Not typically researched for your goal",
};

export const GOAL_ALIGNMENT_DESCRIPTIONS: Record<GoalAlignment, string> = {
  aligned:
    "The database holds at least limited human evidence relating this compound to your stated goal.",
  partial:
    "Only preliminary or insufficient evidence links this compound to your stated goal, or your goal could not be mapped to a researched use.",
  not_aligned:
    "The evidence in our database for this compound relates to other goals, not the one you stated.",
};

export const DOSE_VERDICT_LABELS: Record<DoseVerdict, string> = {
  within_range: "Within the published study range",
  above_range: "Above the highest published study exposure",
  below_range: "Below the lowest published study exposure",
  frequency_differs: "Frequency differs from published studies",
  route_differs: "Route differs from published studies",
  no_human_data: "No comparable human study exposure",
  not_comparable: "Not comparable",
  not_provided: "No dose entered",
};

export const FREQUENCY_LABELS: Record<DoseFrequency, string> = {
  once: "once",
  daily: "daily",
  twice_daily: "twice daily",
  three_times_daily: "three times daily",
  weekly: "weekly",
  twice_weekly: "twice weekly",
  monthly: "monthly",
  other: "other frequency",
};

export const STACK_EVIDENCE_LABELS: Record<StackEvidence | "mixed", string> = {
  studied: "Studied",
  limited: "Limited",
  none: "None",
  mixed: "Mixed",
};

export const UNCERTAINTY_LABELS: Record<StackAnalysis["uncertainty"], string> = {
  low: "Low",
  moderate: "Moderate",
  moderate_high: "Moderate to high",
  high: "High",
};

export const SOURCE_LEVEL_LABELS: Record<SourceAssessment["level"], string> = {
  lower: "Lower supply risk",
  moderate: "Moderate supply risk",
  higher: "Higher supply risk",
};

export const SOURCE_LEVEL_DESCRIPTIONS: Record<SourceAssessment["level"], string> = {
  lower:
    "The route you described — a licensed prescriber and pharmacy with a prescription and quality documentation — is the only supply route with regulatory quality assurance.",
  moderate:
    "Your responses did not describe a fully quality-assured supply route. The points below explain what could not be verified.",
  higher:
    "Your responses describe a supply route where identity, purity, sterility and dose cannot be verified. This is a safety consideration independent of the compound itself.",
};

/** What each supply source means, in neutral terms. */
export const SOURCE_POINTS: Record<ProductSource, string> = {
  uk_pharmacy:
    "Licensed pharmacy in your country — dispensed products are subject to national quality and supply-chain controls.",
  overseas_pharmacy:
    "Overseas pharmacy — quality standards, legality of import and authenticity vary; personal-import rules differ by country.",
  clinician:
    "Clinician or clinic — supply through a prescriber allows monitoring; confirm the product itself is an authorised medicine rather than a compounded or research-grade preparation.",
  online_supplier:
    "Online supplier — regulators have repeatedly identified falsified, under-dosed and contaminated products in this channel.",
  research_supplier:
    "Research-chemical supplier — products labelled 'for research use only' are not manufactured, tested or labelled to medicine standards; identity, purity, sterility and dose cannot be assumed.",
  friend: "Friend or acquaintance — provenance, storage and handling cannot be verified.",
  undecided:
    "Source not yet decided — the supply route matters as much as the compound; a licensed prescriber and pharmacy is the only route with quality assurance.",
  other: "Other source — the supply route could not be assessed from your description.",
};

export const SOURCE_SKIPPED_POINT =
  "You skipped the product/source section — complete it to assess supply risk.";

/**
 * When the assessment is run from the store, the supply route is the store's
 * own pens: no source question is asked and `answers.source` stays undefined.
 */
export const STORE_SOURCE_LABEL = `${BRAND.name} pre-filled pens`;

export const STORE_SOURCE_DESCRIPTION = `Every ${BRAND.name} pen ships with a lot-numbered certificate of analysis from an independent laboratory — identity by LC-MS, purity by HPLC, endotoxin — published against the batch. That is quality assurance for what is in the pen; it is not a marketing authorisation, and the products remain research-use only.`;

export const STORE_SOURCE_POINTS: string[] = [
  "Batch tested by an independent laboratory, with the certificate of analysis published against the lot number on every carton.",
  "Identity confirmed by LC-MS and purity by HPLC per lot; check the lot number on your carton against the certificate before use.",
  "Pre-filled, dose-dial pens remove reconstitution and drawing-up errors, but the dial sets volume, not a recommended dose — nothing in this report is a dosing instruction.",
  "Sold for research use only. A certificate of analysis verifies identity and purity; it does not make a compound an authorised medicine or establish that it is appropriate for you.",
];

/** Join a list into readable prose: "a", "a and b", "a, b and c". */
export function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Deterministic flag id from readable parts. */
export function flagId(...parts: (string | number | undefined)[]): string {
  return parts
    .filter((p) => p !== undefined && p !== "")
    .map((p) => String(p).toLowerCase().replace(/[^a-z0-9]+/g, "-"))
    .join(":");
}

/** Lower-case the first character (for mid-sentence use of labels). */
export function lc(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
