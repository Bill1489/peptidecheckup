import type { GoalId } from "@/data/types";

/**
 * Product-matching output. Produced deterministically from the assessment
 * answers + the rules-engine report + the product catalogue. Rendered on the
 * quiz result, the product page ("Your match") and the report.
 */

export type MatchVerdict =
  /** Goal fits and no flags — can be added to the cart */
  | "match"
  /** Goal fits but the assessment raised cautions — shown with review notes, still purchasable */
  | "match_with_review"
  /** A high-severity flag or a Higher concern label — never added to the cart from a match */
  | "not_recommended";

export type MatchReasonKind =
  | "goal" // primary goal alignment
  | "focus" // specific focus area / symptom the user picked
  | "evidence" // strength of human evidence
  | "experience" // format / experience level fit (pre-filled pen etc.)
  | "safety" // flags from the rules engine
  | "regulatory" // status in the user's jurisdiction
  | "anti_doping";

export interface MatchReason {
  kind: MatchReasonKind;
  text: string;
}

export interface ProductMatch {
  productId: string;
  slug: string;
  name: string;
  /** 0–100 */
  score: number;
  verdict: MatchVerdict;
  /** Why it fits — shown as "Why this is your match" */
  reasons: MatchReason[];
  /** What to review — shown as "Before you buy" */
  cautions: MatchReason[];
  /** Compound slugs this product contains that were assessed */
  compounds: string[];
}

export interface MatchResult {
  generatedAt: string;
  goal?: GoalId;
  /** Best purchasable match, if any */
  primary?: ProductMatch;
  /** Other fits, best first (max 2) */
  alternatives: ProductMatch[];
  /** Products the assessment ruled out, with reasons */
  notRecommended: ProductMatch[];
  /** One-sentence summary for the result hero */
  summary: string;
  /** True when a person-level high flag means nothing should be bought without review */
  reviewRequired: boolean;
}

export const VERDICT_LABELS: Record<MatchVerdict, string> = {
  match: "Your match",
  match_with_review: "Match — review first",
  not_recommended: "Not recommended for you",
};
