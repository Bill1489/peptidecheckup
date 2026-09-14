import type {
  DosingStudy,
  EvidenceQuality,
  GoalId,
  Jurisdiction,
  RegulatoryEntry,
  StackEvidence,
} from "@/data/types";
import type { AssessmentAnswers, SectionId } from "@/lib/assessment/types";

/**
 * Output of the deterministic rules engine. The report UI renders this and
 * nothing else — no free-form generation.
 */

export type FlagSeverity = "info" | "caution" | "high";

export type FlagSource =
  | "medical"
  | "medication"
  | "pregnancy"
  | "allergy"
  | "age"
  | "body"
  | "symptoms"
  | "history"
  | "source"
  | "regulatory"
  | "expectation"
  | "stack"
  | "dose"
  | "lifestyle"
  | "anti_doping"
  | "information";

export interface Flag {
  id: string;
  severity: FlagSeverity;
  source: FlagSource;
  title: string;
  detail: string;
  /** slug(s) of compounds this flag relates to; empty = applies globally */
  compounds: string[];
}

export type Suitability =
  | "potentially_relevant"
  | "higher_concern"
  | "insufficient_information";

export const SUITABILITY_LABELS: Record<Suitability, string> = {
  potentially_relevant: "Potentially relevant",
  higher_concern: "Higher concern",
  insufficient_information: "Insufficient information",
};

export const SUITABILITY_DESCRIPTIONS: Record<Suitability, string> = {
  potentially_relevant:
    "Your stated goal overlaps with the intended or researched use of this compound. Any factors your assessment identified are noted below and warrant professional review.",
  higher_concern:
    "Your responses identified factors that may make this option inappropriate or that require professional assessment before proceeding.",
  insufficient_information:
    "There isn't enough reliable information to assess this option from the information provided.",
};

export type GoalAlignment = "aligned" | "partial" | "not_aligned";

export type DoseVerdict =
  | "within_range"
  | "above_range"
  | "below_range"
  | "frequency_differs"
  | "route_differs"
  | "no_human_data"
  | "not_comparable"
  | "not_provided";

export interface DoseComparison {
  userDoseLabel: string;
  verdict: DoseVerdict;
  explanation: string;
  referenceStudy?: string;
}

export interface CompoundReport {
  slug: string;
  name: string;
  classLabel: string;
  goalAlignment: GoalAlignment;
  goalEvidence?: EvidenceQuality;
  goalEvidenceSummary?: string;
  overallEvidence: EvidenceQuality;
  humanEvidenceLabel: string;
  regulatory: RegulatoryEntry;
  wadaProhibited: boolean | "in_competition";
  suitability: Suitability;
  suitabilityRationale: string;
  flags: Flag[];
  /** Layer 1: what the evidence says about dosing (research information, not a recommendation) */
  dosingResearch: DosingStudy[];
  dosingResearchNote?: string;
  /** Layer 2: how the user's considered dose compares */
  doseComparison: DoseComparison;
  monitoring: string[];
  clinicianQuestions: string[];
  /** Sorting score — higher = appears more suitable (not shown as a number to users) */
  score: number;
}

export interface StackPair {
  a: string;
  b: string;
  aName: string;
  bName: string;
  evidence: StackEvidence;
  overlap?: string;
  note: string;
  duplication: boolean;
}

export interface StackAnalysis {
  compounds: { slug: string; name: string }[];
  count: number;
  combinationEvidence: StackEvidence | "mixed";
  overlappingConsiderations: { pair: string; note: string }[];
  evidenceGaps: number;
  duplications: { pair: string; note: string }[];
  uncertainty: "low" | "moderate" | "moderate_high" | "high";
  summary: string;
  pairs: StackPair[];
}

export interface NotRecommendedItem {
  slug: string;
  name: string;
  reasons: string[];
}

export interface AlternativeItem {
  slug: string;
  name: string;
  classLabel: string;
  evidence: EvidenceQuality;
  regulatoryStatus: RegulatoryEntry["status"];
  reason: string;
}

export interface GoalOption {
  slug: string;
  name: string;
  classLabel: string;
  evidence: EvidenceQuality;
  summary: string;
  regulatoryStatus: RegulatoryEntry["status"];
  considered: boolean;
}

export interface SourceAssessment {
  level: "lower" | "moderate" | "higher";
  headline: string;
  points: string[];
}

export interface Completeness {
  /** 0–100 */
  score: number;
  completed: SectionId[];
  skipped: SectionId[];
  missing: string[]; // human-readable list of what would improve the report
}

export interface Report {
  id: string;
  generatedAt: string;
  jurisdiction: Jurisdiction;
  countryName?: string;
  objective: {
    goal?: GoalId;
    goalLabel: string;
    success?: string;
    importanceLabel?: string;
    timeframeLabel?: string;
  };
  /** Overview metrics for the report header */
  overview: {
    compoundsConsidered: number;
    potentiallyRelevant: number;
    higherConcern: number;
    insufficientInformation: number;
    totalFlags: number;
    highFlags: number;
  };
  globalFlags: Flag[];
  compounds: CompoundReport[];
  stack?: StackAnalysis;
  notRecommended: NotRecommendedItem[];
  goalOptions: GoalOption[];
  alternatives: AlternativeItem[];
  clinicianQuestions: string[];
  monitoring: string[];
  sourceAssessment: SourceAssessment;
  completeness: Completeness;
  /** Echo of the answers used, for the "your responses" appendix */
  answers: AssessmentAnswers;
  /** Whether the user asked to be contacted */
  contactRequested: boolean;
}
