import type {
  ConditionId,
  ConditionStatus,
  DoseFrequency,
  DoseUnit,
  GoalId,
  MedicationClassId,
  Route,
} from "@/data/types";

/**
 * Canonical shape of a user's assessment answers.
 * This is the contract between the questionnaire UI (which writes it) and
 * the rules engine (which reads it). Every field is optional except arrays,
 * because users can skip optional sections.
 */

export type SectionId =
  | "goals"
  | "considering"
  | "basics"
  | "medical"
  | "medications"
  | "experience"
  | "source"
  | "risk"
  | "wants"
  | "final";

export const SECTION_ORDER: SectionId[] = [
  "goals",
  "considering",
  "basics",
  "medical",
  "medications",
  "experience",
  "source",
  "risk",
  "wants",
  "final",
];

export const SECTION_META: Record<
  SectionId,
  { title: string; short: string; description: string; optional: boolean; estMinutes: number }
> = {
  goals: {
    title: "Your goal",
    short: "Goal",
    description: "What you're trying to achieve and how you'd measure success.",
    optional: false,
    estMinutes: 1,
  },
  considering: {
    title: "What you're considering",
    short: "Compounds",
    description: "The compounds — and combinations — you have in mind.",
    optional: false,
    estMinutes: 1,
  },
  basics: {
    title: "About you",
    short: "Basics",
    description: "Age, sex, body measurements and where you live.",
    optional: false,
    estMinutes: 1,
  },
  medical: {
    title: "Medical history",
    short: "History",
    description: "Structured categories only — no essays.",
    optional: false,
    estMinutes: 2,
  },
  medications: {
    title: "Medicines & substances",
    short: "Medicines",
    description: "Prescriptions, over-the-counter medicines, supplements and lifestyle.",
    optional: false,
    estMinutes: 2,
  },
  experience: {
    title: "Previous experience",
    short: "Experience",
    description: "Anything you've used before and how it went.",
    optional: true,
    estMinutes: 1,
  },
  source: {
    title: "Product & source",
    short: "Source",
    description: "Where the product would come from and its documentation.",
    optional: true,
    estMinutes: 1,
  },
  risk: {
    title: "Safety screening",
    short: "Safety",
    description: "A short set of yes/no checks tailored to your selection.",
    optional: false,
    estMinutes: 1,
  },
  wants: {
    title: "Your report",
    short: "Report",
    description: "What you'd like the report to focus on.",
    optional: false,
    estMinutes: 1,
  },
  final: {
    title: "Anything else",
    short: "Final",
    description: "Anything our structured questions may have missed.",
    optional: true,
    estMinutes: 1,
  },
};

export type Importance = "curious" | "moderate" | "very" | "extremely";
export type Timeframe = "none" | "3_6_months" | "1_3_months" | "under_1_month";
export type Sex = "male" | "female" | "prefer_not";
export type PregnancyStatus = "yes" | "no" | "na" | "prefer_not";
export type YesNo = "yes" | "no";
export type YesNoUnsure = "yes" | "no" | "unsure";
export type YesNoNA = "yes" | "no" | "na";
export type MultiIntent = "no" | "yes" | "not_sure";

export type InfluenceSource =
  | "clinician"
  | "research"
  | "social_media"
  | "influencer"
  | "friend"
  | "vendor"
  | "own_research"
  | "other";

export type ProductSource =
  | "uk_pharmacy"
  | "overseas_pharmacy"
  | "clinician"
  | "online_supplier"
  | "research_supplier"
  | "friend"
  | "undecided"
  | "other";

export type AlcoholUse = "none" | "occasional" | "moderate" | "heavy";
export type NicotineUse = "none" | "former" | "occasional" | "daily";
export type RecreationalUse = "none" | "occasional" | "regular" | "prefer_not";
export type AdverseSeverity = "none" | "mild" | "moderate" | "severe" | "unsure";

export type OtcCategory =
  | "painkillers"
  | "antihistamines"
  | "acid_reducers"
  | "sleep_aids"
  | "other";

export type ReportWant =
  | "appropriate_to_discuss"
  | "risks"
  | "interactions"
  | "evidence_for"
  | "evidence_against"
  | "combination_evidence"
  | "suitability_ranking"
  | "clinician_questions"
  | "regulatory"
  | "source"
  | "monitoring"
  | "alternatives";

export const REPORT_WANTS: { id: ReportWant; label: string }[] = [
  { id: "appropriate_to_discuss", label: "Whether the compounds I'm considering are appropriate to discuss" },
  { id: "risks", label: "Potential risks" },
  { id: "interactions", label: "Potential interactions" },
  { id: "evidence_for", label: "Evidence supporting them" },
  { id: "evidence_against", label: "Evidence against them" },
  { id: "combination_evidence", label: "Whether my proposed combination has supporting evidence" },
  { id: "suitability_ranking", label: "Which options appear more / less suitable for my goals" },
  { id: "clinician_questions", label: "What questions I should ask a clinician" },
  { id: "regulatory", label: "Regulatory status" },
  { id: "source", label: "Product / source considerations" },
  { id: "monitoring", label: "Monitoring considerations" },
  { id: "alternatives", label: "Potential alternatives" },
];

export interface ConsideredDose {
  amount?: number;
  unit?: DoseUnit;
  frequency?: DoseFrequency;
  route?: Route;
}

export interface ConsideredCompound {
  slug: string;
  /** Optional: what dose the user is considering (spec: "I'm considering X at Y") */
  dose?: ConsideredDose;
}

export interface MedicationEntry {
  id: string; // uid
  /** dictionary id if matched, else undefined */
  medicationId?: string;
  name: string;
  classId?: MedicationClassId;
  strength?: string;
  frequency?: string;
  reason?: string;
  prescribed?: YesNo;
}

export interface SupplementEntry {
  id: string;
  name: string;
  amount?: string;
  frequency?: string;
}

export interface PreviousUse {
  id: string;
  slug?: string; // compound slug if in database
  name: string;
  duration?: "under_1_month" | "1_3_months" | "3_6_months" | "6_12_months" | "over_1_year" | "unsure";
  adverse?: AdverseSeverity;
  stoppedDueToAdverse?: YesNo;
  supervised?: YesNo;
}

export interface EntryContext {
  /** Goal preselected from an ad landing page */
  goal?: GoalId;
  /** Symptom / creative slug e.g. "tired", "weight", "recovery" */
  symptom?: string;
  utm?: Record<string, string>;
}

export interface AssessmentAnswers {
  /* 1. Goals */
  primaryGoal?: GoalId;
  otherGoalText?: string;
  successDescription?: string;
  importance?: Importance;
  timeframe?: Timeframe;

  /* 2. Considering */
  consideredCompounds: ConsideredCompound[];
  otherCompoundText?: string;
  currentlyTaking?: YesNo;
  consideringMultiple?: MultiIntent;
  /** Each combination is an array of slugs (usually one combination containing all selected) */
  combinations: string[][];
  whyChosen?: string;
  influence?: InfluenceSource[];

  /* 3. Basics */
  age?: number;
  sex?: Sex;
  heightCm?: number;
  weightKg?: number;
  unitSystem: "metric" | "imperial";
  countryCode?: string;
  pregnancy?: PregnancyStatus;

  /* 4. Medical history */
  conditions: Partial<Record<ConditionId, ConditionStatus>>;
  conditionOtherText?: string;
  relevantSurgery?: YesNo;
  surgeryDetails?: string;
  currentSymptoms?: YesNo;
  symptomsDetails?: string;

  /* 5. Medications & substances */
  takesPrescription?: YesNo;
  prescriptions: MedicationEntry[];
  otc: OtcCategory[];
  otcOtherText?: string;
  takesSupplements?: YesNo;
  supplements: SupplementEntry[];
  recreational?: RecreationalUse;
  recreationalDetails?: string;
  alcohol?: AlcoholUse;
  nicotine?: NicotineUse;

  /* 6. Previous experience */
  previousPeptideUse?: YesNo;
  previousUses: PreviousUse[];
  stoppedIneffective?: YesNo;

  /* 7. Product / source */
  source?: ProductSource;
  sourceOtherText?: string;
  prescribed?: YesNoNA;
  authorisedKnown?: YesNoUnsure;
  qualityDocs?: YesNoUnsure;

  /* 8. Risk screening */
  seriousAllergy?: YesNo;
  componentAllergy?: YesNo;
  previousSeriousReaction?: YesNo;
  severeSymptoms?: YesNo;
  advisedAgainst?: YesNo;
  underInvestigation?: YesNo;
  interactingTreatment?: YesNo;
  riskDetails?: string;

  /* 9. Wants */
  reportWants: ReportWant[];
  contactConsent?: boolean;
  contactEmail?: string;
  contactName?: string;

  /* 10. Final */
  anythingElse?: string;

  /* Meta */
  skippedSections: SectionId[];
  completedSections: SectionId[];
  entry?: EntryContext;
  startedAt?: string;
  completedAt?: string;
  version: 1;
}

export const EMPTY_ANSWERS: AssessmentAnswers = {
  consideredCompounds: [],
  combinations: [],
  unitSystem: "metric",
  conditions: {},
  prescriptions: [],
  otc: [],
  supplements: [],
  previousUses: [],
  reportWants: [],
  skippedSections: [],
  completedSections: [],
  version: 1,
};

/* Label maps used by both the questionnaire and the report */

export const IMPORTANCE_LABELS: Record<Importance, string> = {
  curious: "Curious",
  moderate: "Moderately important",
  very: "Very important",
  extremely: "Extremely important",
};

export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  none: "No particular timeframe",
  "3_6_months": "3–6 months",
  "1_3_months": "1–3 months",
  under_1_month: "Less than 1 month",
};

export const SOURCE_LABELS: Record<ProductSource, string> = {
  uk_pharmacy: "Licensed pharmacy in my country",
  overseas_pharmacy: "Overseas pharmacy",
  clinician: "Clinician / clinic",
  online_supplier: "Online supplier",
  research_supplier: "Research-chemical supplier",
  friend: "Friend or acquaintance",
  undecided: "Haven't decided",
  other: "Other",
};

export const INFLUENCE_LABELS: Record<InfluenceSource, string> = {
  clinician: "A clinician recommended it",
  research: "Published research",
  social_media: "Social media",
  influencer: "An influencer or podcast",
  friend: "A friend or training partner",
  vendor: "An online vendor",
  own_research: "My own research",
  other: "Other",
};

export const ALCOHOL_LABELS: Record<AlcoholUse, string> = {
  none: "None",
  occasional: "Occasionally (≤ 1–2 drinks a week)",
  moderate: "Moderate (3–14 drinks a week)",
  heavy: "More than 14 drinks a week",
};

export const NICOTINE_LABELS: Record<NicotineUse, string> = {
  none: "Never",
  former: "Former user",
  occasional: "Occasionally",
  daily: "Daily",
};

export const RECREATIONAL_LABELS: Record<RecreationalUse, string> = {
  none: "No",
  occasional: "Occasionally",
  regular: "Regularly",
  prefer_not: "Prefer not to say",
};

export const OTC_LABELS: Record<OtcCategory, string> = {
  painkillers: "Painkillers",
  antihistamines: "Antihistamines",
  acid_reducers: "Acid-reducing medicines",
  sleep_aids: "Sleep aids",
  other: "Other",
};

export const ADVERSE_LABELS: Record<AdverseSeverity, string> = {
  none: "None",
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
  unsure: "Unsure",
};

export const DURATION_LABELS: Record<NonNullable<PreviousUse["duration"]>, string> = {
  under_1_month: "Less than 1 month",
  "1_3_months": "1–3 months",
  "3_6_months": "3–6 months",
  "6_12_months": "6–12 months",
  over_1_year: "More than a year",
  unsure: "Unsure",
};
