/**
 * Shared data model for the compound / evidence / regulatory database.
 *
 * These types are the contract between:
 *  - the compound database (src/data/compounds/*)
 *  - the assessment questionnaire (src/lib/assessment/*)
 *  - the deterministic rules engine (src/lib/engine/*)
 *  - the UI (compound pages, compare tool, report)
 *
 * Nothing in the report is "guessed": every label the user sees is derived
 * from these structured fields.
 */

/* ------------------------------------------------------------------ */
/* Goals                                                               */
/* ------------------------------------------------------------------ */

export type GoalId =
  | "weight_management"
  | "fat_loss"
  | "muscle_recovery"
  | "athletic_performance"
  | "injury_recovery"
  | "skin_cosmetic"
  | "hair"
  | "sexual_health"
  | "sleep"
  | "general_wellbeing"
  | "longevity"
  | "other";

/* ------------------------------------------------------------------ */
/* Evidence & regulatory                                               */
/* ------------------------------------------------------------------ */

/** Five-point evidence grade used across the site. */
export type EvidenceQuality =
  | "strong"
  | "moderate"
  | "limited"
  | "preliminary"
  | "insufficient";

export type Jurisdiction = "UK" | "US" | "EU" | "AU" | "CA" | "OTHER";

export type RegulatoryStatus =
  | "authorised"
  | "not_authorised"
  | "investigational"
  | "unclear";

export interface RegulatoryEntry {
  status: RegulatoryStatus;
  /** One-sentence summary shown in badges / tables. */
  summary: string;
  /** Longer explanation: which indication, which regulator, caveats. */
  detail?: string;
  /** ISO date the entry was last checked. Never let the engine guess. */
  lastReviewed: string;
}

/** Where a compound sits on the human-evidence ladder. */
export type HumanEvidenceLevel =
  | "approved_medicine" // authorised for at least one indication somewhere
  | "late_clinical" // phase 3 / large phase 2 human trials
  | "early_clinical" // phase 1 / small phase 2 human data
  | "preclinical_only" // animal / in-vitro only
  | "cosmetic_topical" // used topically as a cosmetic ingredient
  | "food_supplement"; // sold as a nutritional supplement with human trials

export type CompoundFamily =
  | "incretin" // GLP-1 / GIP / glucagon / amylin
  | "growth_hormone_axis" // GHRH analogues, GH secretagogues, GH, IGF
  | "tissue_repair" // BPC-157, TB-500
  | "cosmetic" // GHK-Cu, collagen, cosmetic peptides
  | "sexual_health" // PT-141, kisspeptin, melanotan
  | "neuro" // Selank, Semax, DSIP
  | "longevity_metabolic" // Epitalon, MOTS-c, SS-31
  | "immune"; // Thymosin alpha-1, LL-37

export type Route =
  | "subcutaneous"
  | "oral"
  | "topical"
  | "intranasal"
  | "intravenous"
  | "intramuscular";

/* ------------------------------------------------------------------ */
/* Medical history & medications (rules inputs)                        */
/* ------------------------------------------------------------------ */

/**
 * Base conditions are asked of everyone (spec Q16). Extended conditions are
 * only shown when a selected compound lists them in `contraindications`.
 */
export type ConditionId =
  // base list (always shown)
  | "cardiovascular"
  | "hypertension"
  | "diabetes"
  | "kidney"
  | "liver"
  | "gallbladder"
  | "pancreatic"
  | "thyroid"
  | "cancer"
  | "clotting"
  | "gastrointestinal"
  | "psychiatric"
  | "hormonal"
  | "other"
  // extended (compound-driven)
  | "mtc_men2" // personal/family history medullary thyroid carcinoma / MEN2
  | "pancreatitis_history"
  | "gastroparesis"
  | "eating_disorder"
  | "diabetic_retinopathy"
  | "melanoma_history"
  | "active_infection"
  | "sleep_apnoea"
  | "epilepsy"
  | "autoimmune"
  | "acromegaly"
  | "intracranial_hypertension"
  | "prolactinoma";

export type ConditionStatus = "current" | "previous" | "unsure" | "none";

export interface ConditionDef {
  id: ConditionId;
  label: string;
  hint?: string;
  /** true = always shown in Q16; false = only when a selected compound references it */
  base: boolean;
}

export type MedicationClassId =
  | "insulin"
  | "sulfonylurea"
  | "other_glucose_lowering"
  | "glp1_agonist"
  | "anticoagulant"
  | "antiplatelet"
  | "antihypertensive"
  | "beta_blocker"
  | "thyroid_hormone"
  | "corticosteroid"
  | "oral_contraceptive"
  | "hrt"
  | "testosterone"
  | "growth_hormone"
  | "antidepressant"
  | "antipsychotic"
  | "benzodiazepine_sedative"
  | "opioid"
  | "stimulant"
  | "immunosuppressant"
  | "pde5_inhibitor"
  | "nitrate"
  | "nsaid"
  | "antihistamine"
  | "acid_reducer"
  | "levothyroxine_like" // kept for clarity; mapped to thyroid_hormone
  | "antiepileptic"
  | "statin"
  | "diuretic"
  | "antibiotic"
  | "chemotherapy"
  | "narrow_therapeutic_index" // e.g. lithium, digoxin — absorption sensitive
  | "other";

export interface MedicationDef {
  id: string;
  name: string; // generic name
  aliases: string[]; // brand names / spellings for search
  classId: MedicationClassId;
}

export interface MedicationClassDef {
  id: MedicationClassId;
  label: string;
  examples: string;
}

/* ------------------------------------------------------------------ */
/* Compound record                                                     */
/* ------------------------------------------------------------------ */

export interface Contraindication {
  conditionId: ConditionId;
  /** absolute = should not be used; caution = requires professional assessment */
  severity: "absolute" | "caution";
  note: string;
}

export interface Interaction {
  classId: MedicationClassId;
  severity: "major" | "moderate" | "minor";
  note: string;
}

export type DoseUnit = "mg" | "mcg" | "IU" | "g" | "mcg/kg" | "mg/kg" | "nmol/kg" | "%";
export type DoseFrequency =
  | "once"
  | "daily"
  | "twice_daily"
  | "three_times_daily"
  | "weekly"
  | "twice_weekly"
  | "monthly"
  | "other";

/** Machine-comparable exposure from a human study, used for dose comparison. */
export interface StudyExposure {
  doseMin?: number;
  doseMax?: number;
  unit: DoseUnit;
  frequency: DoseFrequency;
  route: Route;
  note?: string;
}

/** One published human study reported in the "what the evidence says about dosing" layer. */
export interface DosingStudy {
  title: string;
  citation: string; // e.g. "Wilding et al., NEJM 2021 (STEP 1)"
  year: number;
  phase?: string; // "Phase 3", "Phase 2", "Phase 1", "Observational"
  design: string; // "Randomised, double-blind, placebo-controlled"
  population: string; // who received it
  n?: number;
  duration: string; // "68 weeks"
  doses: string; // human-readable dosing regimen
  route: Route;
  outcome: string; // what happened at that exposure
  adverseEvents: string; // what was observed
  exposure?: StudyExposure; // comparable numbers (optional if not comparable)
  url?: string;
}

export interface GoalEvidence {
  goal: GoalId;
  evidence: EvidenceQuality;
  /** One or two sentences: what has actually been shown for this goal. */
  summary: string;
}

export type StackEvidence = "studied" | "limited" | "none";

export interface StackNote {
  /** slug of the other compound */
  with: string;
  evidence: StackEvidence;
  /** e.g. "Both act on the GH axis" — an overlapping consideration */
  overlap?: string;
  note: string;
}

export interface Reference {
  label: string;
  url?: string;
}

export interface Compound {
  slug: string;
  name: string;
  aliases: string[];
  family: CompoundFamily;
  /** e.g. "GLP-1 receptor agonist", "Synthetic pentadecapeptide" */
  classLabel: string;
  /** ≤ 12 words, used on cards */
  tagline: string;
  /** 2–3 sentence plain-English overview */
  summary: string;
  /** Mechanism in plain English (1–3 sentences) */
  mechanism: string;
  goals: GoalEvidence[];
  /** Evidence grade for its most-researched use */
  overallEvidence: EvidenceQuality;
  humanEvidenceLevel: HumanEvidenceLevel;
  regulatory: Record<Jurisdiction, RegulatoryEntry>;
  /** true = prohibited at all times; "in_competition" = only in competition */
  wadaProhibited: boolean | "in_competition";
  routes: Route[];
  dosingResearch: DosingStudy[];
  /** Shown when dosingResearch is empty or thin */
  dosingResearchNote?: string;
  contraindications: Contraindication[];
  interactions: Interaction[];
  pregnancy: {
    status: "contraindicated" | "not_recommended" | "insufficient_data" | "not_applicable";
    note: string;
  };
  commonAdverseEffects: string[];
  seriousAdverseEffects: string[];
  monitoring: string[];
  sourceConsiderations: string[];
  clinicianQuestions: string[];
  /** slugs of compounds with stronger evidence / better regulatory footing for overlapping goals */
  alternatives: string[];
  stackNotes: StackNote[];
  /** 3–5 quick facts for the detail page header */
  keyFacts: { label: string; value: string }[];
  /** ISO date the record was last reviewed */
  lastReviewed: string;
  references: Reference[];
}

/* ------------------------------------------------------------------ */
/* Shared label maps (keep UI wording consistent everywhere)           */
/* ------------------------------------------------------------------ */

export const EVIDENCE_LABELS: Record<EvidenceQuality, string> = {
  strong: "Strong",
  moderate: "Moderate",
  limited: "Limited",
  preliminary: "Preliminary",
  insufficient: "Insufficient",
};

export const EVIDENCE_DESCRIPTIONS: Record<EvidenceQuality, string> = {
  strong:
    "Multiple large randomised controlled trials or regulatory approval for this use.",
  moderate:
    "At least one well-conducted randomised trial or consistent controlled human studies.",
  limited:
    "Small or short human studies, mixed results, or evidence mainly for a related use.",
  preliminary:
    "Early-phase human data or case series; findings need replication.",
  insufficient:
    "No reliable human evidence for this use — animal or laboratory data only.",
};

export const EVIDENCE_RANK: Record<EvidenceQuality, number> = {
  strong: 5,
  moderate: 4,
  limited: 3,
  preliminary: 2,
  insufficient: 1,
};

export const REGULATORY_LABELS: Record<RegulatoryStatus, string> = {
  authorised: "Authorised",
  not_authorised: "Not authorised",
  investigational: "Investigational",
  unclear: "Unclear",
};

export const JURISDICTION_LABELS: Record<Jurisdiction, string> = {
  UK: "United Kingdom",
  US: "United States",
  EU: "European Union",
  AU: "Australia",
  CA: "Canada",
  OTHER: "Other jurisdictions",
};

export const FAMILY_LABELS: Record<CompoundFamily, string> = {
  incretin: "Metabolic (incretin-based)",
  growth_hormone_axis: "Growth hormone axis",
  tissue_repair: "Tissue repair",
  cosmetic: "Skin, hair & cosmetic",
  sexual_health: "Sexual health",
  neuro: "Cognition, mood & sleep",
  longevity_metabolic: "Longevity & mitochondrial",
  immune: "Immune",
};

export const ROUTE_LABELS: Record<Route, string> = {
  subcutaneous: "Subcutaneous injection",
  oral: "Oral",
  topical: "Topical",
  intranasal: "Intranasal",
  intravenous: "Intravenous",
  intramuscular: "Intramuscular injection",
};

export const HUMAN_EVIDENCE_LABELS: Record<HumanEvidenceLevel, string> = {
  approved_medicine: "Approved medicine (for specific indications)",
  late_clinical: "Late-stage clinical trials",
  early_clinical: "Early-stage human studies",
  preclinical_only: "Animal / laboratory data only",
  cosmetic_topical: "Topical cosmetic use",
  food_supplement: "Food supplement with human trials",
};
