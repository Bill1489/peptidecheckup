import { getCompound, getStackNote } from "@/data/compounds";
import { GOAL_MAP } from "@/data/goals";
import { PRODUCTS, purchasable, type Product } from "@/data/products";
import {
  EVIDENCE_LABELS,
  EVIDENCE_RANK,
  JURISDICTION_LABELS,
  REGULATORY_LABELS,
  type Compound,
  type EvidenceQuality,
  type GoalId,
  type Jurisdiction,
  type RegulatoryStatus,
} from "@/data/types";
import { numberWord, productCompoundSlugs, RANGE_COMPOUND_SLUGS, selectedProducts } from "@/lib/assessment/derived";
import { FOCUS_BY_GOAL, FOCUS_DEFS, FOCUS_NONE, goalProblemLabel, isFocusId, isQuizGoal, type FocusId } from "@/lib/assessment/flow";
import type { AssessmentAnswers } from "@/lib/assessment/types";
import { BRAND } from "@/lib/brand";
import { generateReport, isPersonSpecific, sortFlags, type CompoundReport, type Flag, type Report } from "@/lib/engine";
import { bmi } from "@/lib/utils";
import type { MatchReason, MatchResult, MatchVerdict, ProductMatch, ScoreBreakdown } from "./types";

/**
 * Deterministic product matcher. Takes the answers and the rules-engine
 * report, scores every pen in the range 0–100 against the goal, focus areas,
 * evidence and format, then lets the report decide whether a pen may be
 * matched at all: a high-severity flag or a Higher concern label on any
 * component makes it `not_recommended`; a person-specific caution — or a
 * product-inherent one worth reading before buying (an authorised medicine
 * sold as a research pen, an investigational compound, a goal with no
 * controlled human evidence) — makes it `match_with_review`. Every number and
 * sentence here is derived from the answers, the catalogue and the compound
 * database — nothing is generated.
 */

/* ------------------------------------------------------------------ */
/* Weights                                                             */
/* ------------------------------------------------------------------ */

const GOAL_POINTS = 40;
const SECONDARY_GOAL_POINTS = 20;
const FOCUS_CAP = 25;
/** Evidence bonus = rank × EVIDENCE_STEP: strong 10 · moderate 8 · limited 6 · preliminary 4 · insufficient 2. */
const EVIDENCE_STEP = 2;
const EXPERIENCE_POINTS = 5;
/** Tested athletes: applied to WADA-listed compounds and to anything approved by no regulator (prohibited at all times under S0). */
const WADA_PENALTY = 15;
/**
 * "None of these" (or focus areas nothing in the range covers): a pen is
 * scored on the goal's typical profile instead — this share of the summed
 * focus weights for every focus area under the goal, capped, with no focus
 * reason shown because the user picked none.
 */
const GOAL_PROFILE_SHARE = 0.25;
const GOAL_PROFILE_CAP = 15;
/** Incretin-class weight pens lose this when BMI is below the licensed threshold — their trials enrolled a different population. */
const BMI_PENALTY = 10;
/** Licensed weight-management criteria start at BMI 27 (with a weight-related condition) or 30. */
const BMI_THRESHOLD = 27;
/**
 * Goals where every pen the manufacturer lists has animal or uncontrolled
 * data only. The evidence component goes negative, an explicit early-evidence
 * caution is added and the verdict is "review first" — a pen may still match,
 * but never on the strength of trials that do not exist.
 */
const EARLY_EVIDENCE_GOALS: GoalId[] = ["sleep"];
const EARLY_EVIDENCE_PENALTY = 10;
/** Minimum score for a pen to be called the match. */
export const PRIMARY_MIN_SCORE = 35;
/** Minimum score for a pen to be listed as "also considered". */
const ALTERNATIVE_MIN_SCORE = 30;
/** "Also considered" must have earned focus points or at least Limited evidence for the goal — a goal hit alone does not list a pen. */
const ALTERNATIVE_MIN_EVIDENCE = EVIDENCE_RANK.limited * EVIDENCE_STEP;
export const MAX_ALTERNATIVES = 3;
const MAX_CAUTIONS = 3;
/** Fit reasons before the regulatory line (which is always appended): 2–4 per product. */
const MAX_CORE_REASONS = 4;

interface FocusWeight {
  points: number;
  /** Plain-English "why" shown as a focus reason. */
  why: string;
}

/**
 * Focus area → pen weights and the transparent reason for each. Points are
 * summed per pen across the focus areas the user picked and capped at 25.
 * Licensed-class compounds with controlled human evidence sit above
 * investigational or preclinical ones for the same focus; blends sit above
 * their single components where the blend is the manufacturer's answer to
 * that problem. Focus areas with no entry are honest gaps: nothing in the
 * range is researched for them, and the result says so.
 */
export const FOCUS_WEIGHTS: Record<FocusId, Partial<Record<string, FocusWeight>>> = {
  /* ---------------- weight & body composition ---------------- */
  belly_fat: {
    tesamorelin: {
      points: 14,
      why: "You picked belly fat that will not move — tesamorelin is the compound in the range researched for visceral (deep abdominal) fat.",
    },
    liraglutide: {
      points: 4,
      why: "Belly fat — in a dedicated MRI trial liraglutide cut visceral fat by about 12% versus 2% with placebo; it is a whole-body weight medicine rather than a visceral-fat one.",
    },
    tirzepatide: {
      points: 4,
      why: "Belly fat — tirzepatide's DXA sub-study cut total fat mass by about a third; it is a whole-body weight medicine rather than a visceral-fat one.",
    },
  },
  overall_weight: {
    tirzepatide: {
      points: 12,
      why: "Overall weight — tirzepatide produced the largest weight reductions of any authorised medicine in trials (about 21% at 72 weeks in SURMOUNT-1).",
    },
    semaglutide: {
      points: 10,
      why: "Overall weight — semaglutide has the largest weight-management evidence base of any compound in the range (about 15% at 68 weeks in STEP 1).",
    },
    liraglutide: {
      points: 6,
      why: "Overall weight — liraglutide is the daily GLP-1 medicine with a decade of use; about 8% at 56 weeks, less than the weekly compounds.",
    },
    cagrisema: {
      points: 6,
      why: "Overall weight — CagriSema produced about 20% at 68 weeks in phase 3, but the combination is not authorised anywhere.",
    },
    retatrutide: {
      points: 6,
      why: "Overall weight — retatrutide reported the largest trial losses so far (about 24% at 48 weeks in phase 2), but it is investigational and not authorised anywhere.",
    },
    tesamorelin: {
      points: 4,
      why: "Overall weight — tesamorelin's trials measured abdominal fat rather than weight on the scales, so this is a body-composition fit, not a weight-loss one.",
    },
    "mots-c": {
      points: 2,
      why: "Overall weight — MOTS-c is studied for metabolic regulation, almost entirely in animal models so far.",
    },
  },
  high_bmi: {
    tirzepatide: {
      points: 12,
      why: "A lot of weight to lose — tirzepatide is licensed for weight management at BMI ≥ 30 (or ≥ 27 with a weight-related condition), the population its trials enrolled, with the largest reductions among authorised medicines.",
    },
    semaglutide: {
      points: 10,
      why: "A lot of weight to lose — semaglutide is licensed for weight management at BMI ≥ 30 (or ≥ 27 with a weight-related condition), the population its trials enrolled.",
    },
    retatrutide: {
      points: 8,
      why: "A lot of weight to lose — retatrutide's phase 3 programme enrolled people with obesity and reported losses of roughly 21–28% at 80 weeks; it is not authorised anywhere.",
    },
    cagrisema: {
      points: 8,
      why: "A lot of weight to lose — CagriSema's phase 3 trial enrolled people with obesity (about 20% at 68 weeks); the combination is not authorised anywhere.",
    },
    liraglutide: {
      points: 6,
      why: "A lot of weight to lose — liraglutide 3 mg is licensed for weight management; the weight loss is smaller than with the weekly compounds.",
    },
  },
  appetite: {
    semaglutide: {
      points: 12,
      why: "Appetite — semaglutide acts on the brain's appetite centres; reduced hunger is the mechanism behind its trial weight loss, in the largest evidence base in the range.",
    },
    tirzepatide: {
      points: 10,
      why: "Appetite — tirzepatide reduces appetite and food intake through GIP and GLP-1 receptor activity; licensed, with the largest trial weight loss among authorised medicines.",
    },
    cagrisema: {
      points: 8,
      why: "Appetite — CagriSema adds an amylin analogue (the satiety hormone) to semaglutide; the combination has phase 3 data but no licence anywhere.",
    },
    liraglutide: {
      points: 6,
      why: "Appetite — liraglutide reduces appetite through the same GLP-1 pathway, dosed daily; licensed, with a smaller effect than the weekly compounds.",
    },
    retatrutide: {
      points: 4,
      why: "Appetite — retatrutide combines appetite suppression with glucagon-driven energy expenditure; investigational only.",
    },
  },
  regain: {
    semaglutide: {
      points: 8,
      why: "Weight that comes back — in the STEP 1 extension most weight returned within a year of stopping semaglutide, so the evidence is for continued use, not a course.",
    },
    tirzepatide: {
      points: 8,
      why: "Weight that comes back — in SURMOUNT-4 weight was regained after tirzepatide was withdrawn, so the evidence is for continued use, not a course.",
    },
    liraglutide: {
      points: 6,
      why: "Weight that comes back — liraglutide, like the other GLP-1 medicines, is evidenced for continued use rather than a course.",
    },
    cagrisema: { points: 4, why: "Weight that comes back — CagriSema's phase 3 data are for continued use; the combination is not authorised anywhere." },
    retatrutide: { points: 4, why: "Weight that comes back — retatrutide's trials are for continued use; it is investigational and not authorised anywhere." },
  },
  muscle_preserve: {
    tesamorelin: {
      points: 8,
      why: "Keeping muscle while losing fat — tesamorelin trials reported reduced visceral fat with lean mass preserved.",
    },
    tirzepatide: {
      points: 4,
      why: "Keeping muscle — in SURMOUNT-1 about three times as much fat as lean mass was lost, but lean mass still fell; resistance training and protein are usually advised.",
    },
  },
  metabolic: {
    "mots-c": {
      points: 10,
      why: "Metabolic health — MOTS-c is the mitochondrial peptide in the range, studied for metabolic regulation (early, mostly animal, evidence).",
    },
    semaglutide: {
      points: 6,
      why: "Metabolic health — semaglutide is a licensed type 2 diabetes medicine; SELECT showed fewer cardiovascular events in people with overweight and heart disease.",
    },
    tirzepatide: {
      points: 6,
      why: "Metabolic health — tirzepatide is licensed for type 2 diabetes, with the largest HbA1c reductions of the incretin class.",
    },
    liraglutide: {
      points: 6,
      why: "Metabolic health — liraglutide is licensed for type 2 diabetes, with cardiovascular-outcome data (LEADER).",
    },
    tesamorelin: {
      points: 4,
      why: "Metabolic health — tesamorelin's abdominal-fat trials also tracked metabolic markers; it is not a metabolic medicine.",
    },
    nad: {
      points: 4,
      why: "Metabolic health — NAD+ is a coenzyme in cellular energy metabolism; human data are mostly for oral precursors.",
    },
  },

  /* ---------------- energy, immunity & gut ---------------- */
  tired_despite_sleep: {
    nad: {
      points: 12,
      why: "Tired despite sleeping — NAD+ is the coenzyme in the range tied to cellular energy metabolism; injectable data are limited.",
    },
    "mots-c": {
      points: 8,
      why: "Tired despite sleeping — MOTS-c is studied for metabolic energy and exercise capacity, mostly in animal models.",
    },
  },
  low_stamina: {
    "mots-c": {
      points: 12,
      why: "Stamina and endurance — MOTS-c is studied for exercise capacity, though not yet in human efficacy trials.",
    },
    nad: {
      points: 8,
      why: "Stamina — NAD+ levels fall with age; the human evidence is mainly for oral precursors and small intravenous studies.",
    },
  },
  brain_fog: {},
  post_illness: {
    "thymosin-alpha-1": {
      points: 10,
      why: "Slow to recover after illness — thymosin alpha-1 is the immune-modulating peptide in the range, licensed abroad for hepatitis B; no trial has tested it in healthy adults recovering from illness.",
    },
    nad: {
      points: 8,
      why: "Slow to recover after illness — NAD+ is matched on cellular energy; it is not a treatment for any illness.",
    },
    "ll-37": {
      points: 2,
      why: "Recovery after illness — LL-37 is an antimicrobial peptide with topical wound data only; injected use has never been tested in people.",
    },
  },
  immune: {
    "thymosin-alpha-1": {
      points: 12,
      why: "Immune resilience — thymosin alpha-1 acts on T-cell and innate-immune signalling and is licensed abroad for hepatitis B; no trial has tested it for fewer infections in healthy adults.",
    },
    "ll-37": {
      points: 4,
      why: "Immune resilience — LL-37 is the human antimicrobial peptide; the claims rest on laboratory activity, and systemic use is untested in humans.",
    },
  },
  gut: {
    kpv: {
      points: 12,
      why: "Gut irritation — KPV is the anti-inflammatory α-MSH fragment; it reduced experimental colitis in mice, and no human trial has been published.",
    },
    "bpc-157": {
      points: 8,
      why: "Gut irritation — BPC-157 derives from a gastric-juice protein and is studied for the gut lining, in rodents only.",
    },
  },

  /* ---------------- recovery & injury ---------------- */
  recovery_between: {
    nad: { points: 8, why: "Recovery between sessions — NAD+ is the cellular-energy coenzyme in the range." },
    wolverine: {
      points: 8,
      why: "Recovery between sessions — BPC-157 and TB-500 are the repair peptides in the range, studied in animal models.",
    },
    "mots-c": { points: 4, why: "Recovery — MOTS-c is studied for exercise capacity in animal models." },
    "bpc-157": { points: 4, why: "Recovery between sessions — BPC-157 on its own; the muscle data are rodent models." },
    "tb-500": { points: 4, why: "Recovery between sessions — TB-500 on its own; muscle-repair data are from rodents and horses." },
  },
  soreness: {
    wolverine: { points: 6, why: "Soreness that lingers — the repair blend; the evidence is animal data only." },
    nad: { points: 6, why: "Soreness that lingers — NAD+ is matched on cellular energy; it is not a painkiller." },
    "bpc-157": { points: 4, why: "Soreness that lingers — BPC-157 on its own; no human study has measured soreness or recovery time." },
    "tb-500": { points: 4, why: "Soreness that lingers — TB-500 on its own; there are no human recovery or soreness studies." },
  },
  recurring: {
    wolverine: {
      points: 12,
      why: "Recurring strains — Wolverine is the repair blend, BPC-157 + TB-500, researched for tendon, ligament and muscle healing in animal models.",
    },
    "bpc-157": { points: 8, why: "Recurring strains — BPC-157 on its own, the repair peptide with rat tendon and ligament models behind it." },
    "tb-500": { points: 8, why: "Recurring strains — TB-500 on its own; the parent protein's data are in animal wound models." },
    klow: { points: 6, why: "Recurring strains — Klow carries the same two repair peptides alongside GHK-Cu and KPV." },
    glow: { points: 4, why: "Recurring strains — Glow carries BPC-157 and TB-500 with GHK-Cu; it is positioned as a skin blend." },
  },
  tendon: {
    wolverine: {
      points: 12,
      why: "A tendon injury — BPC-157 and TB-500 are the tendon-and-ligament repair peptides in the range (animal data only).",
    },
    "bpc-157": { points: 8, why: "A tendon injury — BPC-157 on its own; rat Achilles-tendon models show faster healing, with no controlled human trial." },
    "tb-500": { points: 8, why: "A tendon injury — TB-500 on its own; no human study of the fragment exists for any injury." },
    klow: { points: 6, why: "A tendon injury — Klow carries BPC-157 and TB-500 alongside GHK-Cu and KPV." },
    glow: { points: 4, why: "A tendon injury — Glow carries BPC-157 and TB-500 alongside GHK-Cu; it is positioned as a skin blend." },
  },
  ligament: {
    wolverine: {
      points: 12,
      why: "A ligament injury — BPC-157 and TB-500 are the tendon-and-ligament repair peptides in the range (animal data only).",
    },
    "bpc-157": { points: 8, why: "A ligament injury — BPC-157 on its own; rat medial-collateral-ligament models show faster healing, with no controlled human trial." },
    "tb-500": { points: 8, why: "A ligament injury — TB-500 on its own; no human study of the fragment exists for any injury." },
    klow: { points: 6, why: "A ligament injury — Klow carries BPC-157 and TB-500 alongside GHK-Cu and KPV." },
    glow: { points: 4, why: "A ligament injury — Glow carries BPC-157 and TB-500 alongside GHK-Cu; it is positioned as a skin blend." },
  },
  muscle_strain: {
    wolverine: { points: 10, why: "A muscle tear or strain — the repair blend, studied for muscle healing in animal models." },
    "bpc-157": { points: 8, why: "A muscle tear or strain — BPC-157 on its own; muscle-crush models in rats, no human trial." },
    "tb-500": { points: 6, why: "A muscle tear or strain — TB-500 on its own; rodent and horse data only." },
    klow: { points: 6, why: "A muscle tear or strain — Klow carries the repair peptides with GHK-Cu and KPV alongside." },
  },
  joint: {
    wolverine: { points: 8, why: "A joint problem — the repair blend; joint evidence is from animal models only." },
    "bpc-157": {
      points: 6,
      why: "A joint problem — BPC-157's only human data are a retrospective series of 16 knee injections; controlled evidence is animal-only.",
    },
    "tb-500": { points: 4, why: "A joint problem — TB-500 on its own; no human joint data." },
    klow: { points: 4, why: "A joint problem — Klow carries the repair peptides; joint evidence is animal-model only." },
  },
  gh_recovery: {
    sermorelin: {
      points: 8,
      why: "Overnight recovery via the GH axis — sermorelin is the formerly licensed GHRH analogue; its one adult trial raised night-time GH without changing body composition.",
    },
    "cjc-1295": {
      points: 8,
      why: "Overnight recovery via the GH axis — CJC-1295 raised GH and IGF-1 in small studies; development stopped in 2006 and nothing has measured recovery.",
    },
    ipamorelin: {
      points: 8,
      why: "Overnight recovery via the GH axis — ipamorelin is the selective GH secretagogue; its only published efficacy trial showed no benefit.",
    },
  },

  /* ---------------- skin & hair ---------------- */
  scars_marks: {
    klow: {
      points: 12,
      why: "Slow-healing marks or scars — Klow adds KPV, an anti-inflammatory fragment, and GHK-Cu to the two repair peptides.",
    },
    glow: { points: 8, why: "Slow-healing marks — Glow pairs GHK-Cu with the two repair peptides, without the anti-inflammatory fragment." },
    "ghk-cu": {
      points: 6,
      why: "Slow-healing marks — GHK-Cu is the copper peptide with topical wound-healing research behind it.",
    },
    kpv: { points: 4, why: "Slow-healing marks — KPV is the anti-inflammatory fragment on its own; wound-closure data are in rodents." },
  },
  firmness: {
    "ghk-cu": {
      points: 12,
      why: "Firmness and fine lines — GHK-Cu is the copper tripeptide with small controlled topical studies on skin firmness.",
    },
    glow: {
      points: 10,
      why: "Firmness — Glow is the skin blend: GHK-Cu with BPC-157 and TB-500 for collagen and remodelling; the blend itself is unstudied in people.",
    },
    klow: { points: 6, why: "Firmness — Klow contains GHK-Cu, with the repair peptides and KPV alongside." },
  },
  texture: {
    "ghk-cu": {
      points: 12,
      why: "Texture and tone — GHK-Cu is the copper tripeptide with topical studies on skin texture and fine lines.",
    },
    glow: { points: 10, why: "Texture — Glow is the skin blend built around GHK-Cu; the blend itself is unstudied in people." },
    klow: { points: 6, why: "Texture — Klow contains GHK-Cu, with the repair peptides and KPV alongside." },
  },
  irritation: {
    klow: {
      points: 12,
      why: "Redness or irritation-prone skin — Klow is the skin blend with KPV, an anti-inflammatory α-MSH fragment.",
    },
    kpv: {
      points: 8,
      why: "Redness or irritation — KPV is the anti-inflammatory fragment on its own; animal data only, and it does not penetrate intact skin without help.",
    },
  },
  hair_thinning: {
    "ghk-cu": {
      points: 12,
      why: "Hair thinning — GHK-Cu has preliminary topical hair studies; there are no injectable hair data.",
    },
  },
  shedding: {
    "ghk-cu": { points: 10, why: "Shedding — GHK-Cu has preliminary topical hair studies; there are no injectable hair data." },
  },

  /* ---------------- sexual health ---------------- */
  libido: {
    "pt-141": {
      points: 12,
      why: "Libido — PT-141 (bremelanotide) is the melanocortin agonist licensed in the US for low sexual desire in premenopausal women; trial gains were significant but modest, with nausea in about 40%.",
    },
  },
  arousal: {
    "pt-141": {
      points: 12,
      why: "Arousal — PT-141 acts centrally on melanocortin receptors, shifting the balance towards sexual excitation rather than acting on blood flow.",
    },
  },
  erectile: {
    "pt-141": {
      points: 4,
      why: "Erection problems — small phase 2 studies of bremelanotide produced erections in men, but the male programme was discontinued over blood-pressure concerns; it is not authorised for men.",
    },
  },
  hormonal_axis: {
    gonadorelin: {
      points: 10,
      why: "Hormone levels or fertility signalling — gonadorelin is the GnRH decapeptide that drives LH and FSH release; a licensed diagnostic peptide in some markets.",
    },
  },

  /* ---------------- healthy ageing ---------------- */
  energy: {
    nad: { points: 10, why: "Long-term energy — NAD+ is the cellular-energy coenzyme in the range; its levels decline with age." },
    "mots-c": { points: 8, why: "Long-term energy — MOTS-c is studied for metabolic regulation and healthy ageing in animal models." },
  },
  skin_ageing: {
    "ghk-cu": { points: 8, why: "Skin ageing — GHK-Cu is the copper tripeptide with topical studies on firmness and fine lines." },
    glow: { points: 6, why: "Skin ageing — Glow is the skin blend built around GHK-Cu; the blend itself is unstudied in people." },
    klow: { points: 4, why: "Skin ageing — Klow contains GHK-Cu alongside the repair peptides and KPV." },
  },
  repair: {
    nad: { points: 6, why: "Recovery and repair as you age — NAD+ is matched on cellular energy." },
    wolverine: { points: 6, why: "Recovery and repair as you age — the repair blend, studied in animal models." },
    "bpc-157": { points: 4, why: "Recovery and repair as you age — BPC-157 on its own; rodent repair models only." },
    sermorelin: {
      points: 4,
      why: "Recovery and repair as you age — sermorelin is the GH-axis analogue; its one adult trial changed GH release but not body composition.",
    },
  },
  cellular_ageing: {
    nad: {
      points: 8,
      why: "Cellular ageing — NAD+ levels fall with age; the human evidence is mostly for oral precursors, with no outcome trial of injected NAD+.",
    },
    "mots-c": { points: 6, why: "Cellular ageing — MOTS-c is the mitochondrial peptide; healthy-ageing data are from animal models." },
    epitalon: {
      points: 6,
      why: "Cellular ageing — epitalon's telomerase and lifespan claims come from cell culture and animal studies by one research group; no controlled human trial.",
    },
    "foxo4-dri": {
      points: 6,
      why: "Cellular ageing — FOXO4-DRI is the senolytic peptide in the range; mouse data only, with no human study of any kind.",
    },
  },

  /* ---------------- sleep (early evidence only) ---------------- */
  falling_asleep: {
    epitalon: {
      points: 6,
      why: "Falling asleep — epitalon's circadian claims rest on melatonin data from a small Russian extract study and animal work; no controlled human sleep study.",
    },
    ipamorelin: {
      points: 4,
      why: "Falling asleep — ipamorelin is marketed for sleep because GH is released during slow-wave sleep; no trial has measured sleep with it.",
    },
    sermorelin: {
      points: 4,
      why: "Falling asleep — full-length GHRH given at night affected slow-wave sleep in physiology studies; sermorelin itself has not been studied for sleep.",
    },
  },
  staying_asleep: {
    epitalon: {
      points: 6,
      why: "Staying asleep — epitalon's circadian claims rest on melatonin data from a small Russian extract study and animal work; no controlled human sleep study.",
    },
    ipamorelin: {
      points: 4,
      why: "Staying asleep — ipamorelin is marketed for deeper sleep on the basis of GH physiology; no trial has measured sleep with it.",
    },
    sermorelin: {
      points: 4,
      why: "Staying asleep — full-length GHRH affected slow-wave sleep in physiology studies; sermorelin itself has not been studied for sleep.",
    },
  },
  waking_unrefreshed: {
    epitalon: {
      points: 4,
      why: "Waking unrefreshed — epitalon is matched on circadian research interest only; no controlled human study has measured sleep quality.",
    },
    ipamorelin: {
      points: 4,
      why: "Waking unrefreshed — ipamorelin is matched on GH-axis physiology only; no trial has measured sleep or recovery with it.",
    },
    sermorelin: {
      points: 4,
      why: "Waking unrefreshed — sermorelin is matched on GH-axis physiology only; it has not been studied for sleep complaints.",
    },
  },
};

const EVIDENCE_SHORT: Record<EvidenceQuality, string> = {
  strong: "multiple large trials or a licensed indication",
  moderate: "at least one well-conducted randomised trial",
  limited: "small or short human studies, or evidence for a related use",
  preliminary: "early-phase human data that still needs replication",
  insufficient: "animal or laboratory data only",
};

/* ------------------------------------------------------------------ */
/* Synthetic answers for the whole range                               */
/* ------------------------------------------------------------------ */

function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/** Answers that put every compound in the range in front of the rules engine, each blend pen modelled as its own combination. */
export function rangeAnswers(answers: AssessmentAnswers): AssessmentAnswers {
  return {
    ...answers,
    consideredCompounds: RANGE_COMPOUND_SLUGS.map((slug) => ({ slug })),
    combinations: PRODUCTS.map(productCompoundSlugs),
    otherCompoundText: undefined,
  };
}

/** Answers restricted to a set of pens (the compounds inside them, each blend as a combination). */
function answersForProducts(answers: AssessmentAnswers, products: Product[]): AssessmentAnswers {
  const combos = products.map(productCompoundSlugs).filter((c) => c.length > 0);
  return {
    ...answers,
    consideredCompounds: uniq(combos.flat()).map((slug) => ({ slug })),
    combinations: combos,
    otherCompoundText: undefined,
  };
}

/** True when at least one pen in the range is listed for the goal. */
function goalServed(goal: GoalId): boolean {
  return PRODUCTS.some((p) => p.goals.includes(goal));
}

/* ------------------------------------------------------------------ */
/* Lookup: one CompoundReport per range compound                        */
/* ------------------------------------------------------------------ */

interface Assessed {
  /** slug → report for every range compound that resolves in the database */
  bySlug: Map<string, CompoundReport>;
  /** Person-level flags (compounds: []) */
  globalFlags: Flag[];
  jurisdiction: Jurisdiction;
  jurisdictionLabel: string;
  inJurisdiction: string;
}

function assess(answers: AssessmentAnswers, report: Report): Assessed {
  const bySlug = new Map(report.compounds.map((c) => [c.slug, c]));
  const missing = RANGE_COMPOUND_SLUGS.filter((slug) => getCompound(slug) && !bySlug.has(slug));
  if (missing.length > 0) {
    // The user did not put every pen in front of the engine — run the whole range once so each pen gets a real verdict.
    const full = generateReport(rangeAnswers(answers));
    for (const c of full.compounds) if (!bySlug.has(c.slug)) bySlug.set(c.slug, c);
  }
  return {
    bySlug,
    globalFlags: report.globalFlags,
    jurisdiction: report.jurisdiction,
    jurisdictionLabel: report.countryName ?? JURISDICTION_LABELS[report.jurisdiction],
    inJurisdiction: report.jurisdiction === "OTHER" ? "your jurisdiction" : `the ${JURISDICTION_LABELS[report.jurisdiction]}`,
  };
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

function bestGoalEvidence(components: CompoundReport[]): { grade: EvidenceQuality; names: string[] } | undefined {
  const graded = components.filter((c): c is CompoundReport & { goalEvidence: EvidenceQuality } => Boolean(c.goalEvidence));
  if (graded.length === 0) return undefined;
  const top = Math.max(...graded.map((c) => EVIDENCE_RANK[c.goalEvidence]));
  const best = graded.filter((c) => EVIDENCE_RANK[c.goalEvidence] === top);
  return { grade: best[0].goalEvidence, names: best.map((c) => c.name) };
}

function evidenceBonus(grade: EvidenceQuality | undefined): number {
  return grade ? EVIDENCE_RANK[grade] * EVIDENCE_STEP : 0;
}

/** True when none of the picked focus areas is weighted against any pen — "None of these", or only honest gaps. */
function noWeightedFocus(focusAreas: string[]): boolean {
  return focusAreas.every((id) => id === FOCUS_NONE || !isFocusId(id) || Object.keys(FOCUS_WEIGHTS[id]).length === 0);
}

/** The goal's typical profile: a share of every focus weight under the goal, so the range's answer to the goal still ranks first. */
function goalProfilePoints(product: Product, goal: GoalId | undefined): number {
  if (!isQuizGoal(goal)) return 0;
  const total = FOCUS_BY_GOAL[goal].reduce((sum, id) => sum + (FOCUS_WEIGHTS[id][product.slug]?.points ?? 0), 0);
  return Math.min(GOAL_PROFILE_CAP, Math.round(total * GOAL_PROFILE_SHARE));
}

/** Focus points for a pen, capped, with the reasons ordered strongest first. */
function focusPoints(product: Product, answers: AssessmentAnswers): { points: number; reasons: string[] } {
  if (noWeightedFocus(answers.focusAreas)) return { points: goalProfilePoints(product, answers.primaryGoal), reasons: [] };
  const hits: FocusWeight[] = [];
  for (const id of answers.focusAreas) {
    if (!isFocusId(id)) continue;
    const weight = FOCUS_WEIGHTS[id][product.slug];
    if (weight) hits.push(weight);
  }
  hits.sort((x, y) => y.points - x.points);
  const points = hits.reduce((sum, w) => sum + w.points, 0);
  return { points: Math.min(FOCUS_CAP, points), reasons: hits.map((w) => w.why) };
}

/** Approved for human therapeutic use by at least one regulator in the database. */
function approvedAnywhere(compound: Compound): boolean {
  return Object.values(compound.regulatory).some((r) => r.status === "authorised");
}

/** Named on the WADA Prohibited List, or approved by no regulator and therefore prohibited at all times under category S0. */
function prohibitedComponents(compounds: Compound[]): { listed: Compound[]; s0: Compound[] } {
  return {
    listed: compounds.filter((c) => Boolean(c.wadaProhibited)),
    s0: compounds.filter((c) => !c.wadaProhibited && !approvedAnywhere(c)),
  };
}

/* ------------------------------------------------------------------ */
/* Verdict                                                             */
/* ------------------------------------------------------------------ */

/**
 * Ordering: ruled-out pens last; otherwise the fit score decides and the
 * verdict only breaks ties. A "review first" match is still a match — a
 * licensed medicine with strong evidence for the goal must not lose to a
 * preclinical compound merely because it carries a point to review.
 */
const VERDICT_RANK: Record<MatchVerdict, number> = { match: 0, match_with_review: 0, not_recommended: 1 };
const TIE_RANK: Record<MatchVerdict, number> = { match: 0, match_with_review: 1, not_recommended: 2 };

function dedupeByTitle(flags: Flag[]): Flag[] {
  const seen = new Set<string>();
  return flags.filter((f) => {
    if (seen.has(f.title)) return false;
    seen.add(f.title);
    return true;
  });
}

function decideVerdict(
  components: CompoundReport[],
  globalFlags: Flag[],
): { verdict: MatchVerdict; blockers: Flag[]; cautions: Flag[] } {
  const own = components.flatMap((c) => c.flags);
  const all = dedupeByTitle(sortFlags([...own, ...globalFlags]));
  const highs = all.filter((f) => f.severity === "high");
  const concern = components.filter((c) => c.suitability === "higher_concern");
  const cautions = all.filter((f) => f.severity === "caution" && isPersonSpecific(f));

  if (highs.length > 0 || concern.length > 0) {
    // Reasons: the high flags, then (for a Higher concern label without a high flag) the person-specific cautions behind it.
    const blockers = highs.length > 0 ? highs : cautions;
    return { verdict: "not_recommended", blockers, cautions };
  }
  return { verdict: cautions.length > 0 ? "match_with_review" : "match", blockers: [], cautions };
}

/* ------------------------------------------------------------------ */
/* Reasons                                                             */
/* ------------------------------------------------------------------ */

function lcFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function regulatoryReason(components: CompoundReport[], ctx: Assessed): MatchReason | undefined {
  if (components.length === 0) return undefined;
  const statuses = uniq(components.map((c) => c.regulatory.status));
  if (statuses.length === 1) {
    return {
      kind: "regulatory",
      text: `${REGULATORY_LABELS[statuses[0]]} as a medicine in ${ctx.inJurisdiction} — supplied for research use only.`,
    };
  }
  const byStatus = new Map<RegulatoryStatus, string[]>();
  for (const c of components) byStatus.set(c.regulatory.status, [...(byStatus.get(c.regulatory.status) ?? []), c.name]);
  const parts = Array.from(byStatus.entries()).map(([status, names]) => `${joinNames(names)} ${lcFirst(REGULATORY_LABELS[status])}`);
  return { kind: "regulatory", text: `In ${ctx.inJurisdiction}: ${parts.join("; ")} — supplied for research use only.` };
}

function blendCaution(product: Product, compounds: Compound[]): MatchReason | undefined {
  if (!product.blend || compounds.length < 2) return undefined;
  let unstudied = false;
  for (let i = 0; i < compounds.length; i++) {
    for (let j = i + 1; j < compounds.length; j++) {
      const note = getStackNote(compounds[i], compounds[j]);
      if (!note || note.evidence !== "studied") unstudied = true;
    }
  }
  if (!unstudied) return undefined;
  const names = compounds.map((c) => c.name);
  return {
    kind: "evidence",
    text:
      compounds.length === 2
        ? `${names[0]} + ${names[1]} has not been studied together in people — each component is graded on its own.`
        : `The ${compounds.length}-compound combination in ${product.name} has not been studied in people — each component is graded on its own.`,
  };
}

/* ---- product-inherent cautions that turn a match into "review first" ---- */

/** Named jurisdictions where the compound is an authorised medicine. */
function authorisedIn(compound: Compound): Jurisdiction[] {
  return (Object.keys(compound.regulatory) as Jurisdiction[]).filter(
    (j) => j !== "OTHER" && compound.regulatory[j].status === "authorised",
  );
}

/** "the United Kingdom", "the United States", "the European Union", "Australia", "Canada". */
function placeName(jurisdiction: Jurisdiction): string {
  const label = JURISDICTION_LABELS[jurisdiction];
  return /^(United|European)/.test(label) ? `the ${label}` : label;
}

/** An authorised medicine somewhere in the world — sold here as a research pen, outside any prescriber's oversight. */
function isMedicine(compound: Compound): boolean {
  return compound.humanEvidenceLevel === "approved_medicine";
}

/** In late-stage trials and authorised nowhere (retatrutide, cagrilintide). */
function isInvestigational(compound: Compound): boolean {
  return (
    !isMedicine(compound) &&
    authorisedIn(compound).length === 0 &&
    Object.values(compound.regulatory).some((r) => r.status === "investigational")
  );
}

/**
 * Authorised prescription-only medicines (semaglutide, tirzepatide,
 * liraglutide, PT-141, tesamorelin, thymosin alpha-1) are sold in the range
 * as research pens. That is never a block — the person's flags decide that —
 * but it is always a point to review before buying, worded for where the
 * user lives.
 */
function medicineCaution(compounds: Compound[], ctx: Assessed): MatchReason | undefined {
  const medicines = compounds.filter(isMedicine);
  if (medicines.length === 0) return undefined;
  const here = medicines.filter((c) => c.regulatory[ctx.jurisdiction].status === "authorised");
  if (here.length > 0) {
    const names = joinNames(here.map((c) => c.name));
    const what = here.length === 1 ? "is an authorised prescription-only medicine" : "are authorised prescription-only medicines";
    return {
      kind: "regulatory",
      text: `${names} ${what} in ${ctx.inJurisdiction}. This pen is supplied for research use only — outside the regulated supply chain, with no prescriber monitoring dose, escalation or side effects.`,
    };
  }
  const names = joinNames(medicines.map((c) => c.name));
  const where = uniq(medicines.flatMap(authorisedIn)).map(placeName);
  const licensed =
    where.length > 0
      ? `${medicines.length === 1 ? "is a prescription-only medicine" : "are prescription-only medicines"} in ${joinNames(where)}`
      : `${medicines.length === 1 ? "is" : "are"} licensed as a medicine in some countries`;
  return {
    kind: "regulatory",
    text: `${names} ${licensed} but not authorised in ${ctx.inJurisdiction}. This pen is supplied for research use only, with no prescriber oversight.`,
  };
}

function investigationalCaution(compounds: Compound[]): MatchReason | undefined {
  const investigational = compounds.filter(isInvestigational);
  if (investigational.length === 0) return undefined;
  return {
    kind: "regulatory",
    text: `${joinNames(investigational.map((c) => c.name))}: investigational — phase 3 data only, not authorised anywhere. Outside a clinical trial, nothing sold under this name is a licensed medicine.`,
  };
}

function earlyEvidenceCaution(goal: GoalId, components: CompoundReport[]): MatchReason {
  const names = components.length > 0 ? joinNames(components.map((c) => c.name)) : "this pen";
  return {
    kind: "evidence",
    text: `Early evidence only — no controlled human trial of ${names} has measured ${lcFirst(GOAL_MAP[goal].label)}. The interest rests on animal and uncontrolled data, so this is a research fit, not a demonstrated effect.`,
  };
}

/* ------------------------------------------------------------------ */
/* Match one product                                                   */
/* ------------------------------------------------------------------ */

type Scored = ProductMatch & { assessed: boolean; breakdown: ScoreBreakdown };

function matchProduct(product: Product, answers: AssessmentAnswers, ctx: Assessed): Scored {
  const slugs = productCompoundSlugs(product);
  const records = slugs.map((slug) => getCompound(slug));
  const resolved = records.filter((c): c is Compound => Boolean(c));
  const components = slugs.map((slug) => ctx.bySlug.get(slug)).filter((c): c is CompoundReport => Boolean(c));
  const unresolved = slugs.filter((slug, i) => !records[i]);
  const goal = answers.primaryGoal;
  const goalLabel = goal ? lcFirst(GOAL_MAP[goal]?.label ?? goal) : undefined;
  const problem = goalProblemLabel(goal);
  const earlyGoal = Boolean(goal && EARLY_EVIDENCE_GOALS.includes(goal));

  /* ---- score ---- */
  const goalHit = Boolean(goal && product.goals.includes(goal));
  const secondaryHits = answers.secondaryGoals.filter((g) => product.goals.includes(g));
  const focus = focusPoints(product, answers);
  const evidence = bestGoalEvidence(components);
  const tested = answers.testedAthlete === "yes";
  const prohibited = prohibitedComponents(resolved);
  const doping = tested && prohibited.listed.length + prohibited.s0.length > 0;
  const bodyMass = bmi(answers.heightCm, answers.weightKg);
  const incretins = resolved.filter((c) => c.family === "incretin");
  const belowThreshold = incretins.length > 0 && bodyMass !== undefined && bodyMass < BMI_THRESHOLD;

  const breakdown: ScoreBreakdown = {
    goal: (goalHit ? GOAL_POINTS : 0) + (secondaryHits.length > 0 ? SECONDARY_GOAL_POINTS : 0),
    focus: focus.points,
    evidence: evidenceBonus(evidence?.grade) - (earlyGoal ? EARLY_EVIDENCE_PENALTY : 0),
    experience: answers.experienceLevel === "none" ? EXPERIENCE_POINTS : 0,
    antiDoping: doping ? -WADA_PENALTY : 0,
    body: belowThreshold ? -BMI_PENALTY : 0,
  };
  const raw = breakdown.goal + breakdown.focus + breakdown.evidence + breakdown.experience + breakdown.antiDoping + (breakdown.body ?? 0);
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  /* ---- verdict ---- */
  const decision = decideVerdict(components, ctx.globalFlags);

  /* ---- reasons: goal → first focus → evidence → format → (second focus) then the regulatory line, always ---- */
  const core: MatchReason[] = [];
  if (goalHit && problem) {
    core.push({ kind: "goal", text: `You picked “${problem}”. ${product.name}: ${lcFirst(product.bestFor)}` });
  } else if (secondaryHits.length > 0) {
    const label = goalProblemLabel(secondaryHits[0]) ?? GOAL_MAP[secondaryHits[0]].label;
    core.push({ kind: "goal", text: `Matched on your secondary goal “${label}”. ${product.name}: ${lcFirst(product.bestFor)}` });
  }
  if (focus.reasons[0]) core.push({ kind: "focus", text: focus.reasons[0] });
  if (goalLabel) {
    if (evidence) {
      const who = components.length > 1 ? ` (${joinNames(evidence.names)})` : "";
      core.push({
        kind: "evidence",
        text: `Human evidence for ${goalLabel}: ${EVIDENCE_LABELS[evidence.grade]} — ${EVIDENCE_SHORT[evidence.grade]}${who}.`,
      });
    } else if (components.length > 0) {
      core.push({
        kind: "evidence",
        text: `No evidence entry for ${goalLabel} in our database for ${joinNames(components.map((c) => c.name))} — this match rests on the range's intended use, not on trials for your goal.`,
      });
    }
  }
  if (answers.experienceLevel === "none") {
    core.push({ kind: "experience", text: "Pre-filled dose-dial pen — no vials, no reconstitution, no drawing up. A sensible first format." });
  } else if (answers.experienceLevel === "some") {
    core.push({ kind: "experience", text: "Pre-filled dose-dial pen — none of the vials, bacteriostatic water or drawing-up you have done before." });
  }
  if (focus.reasons[1]) core.push({ kind: "focus", text: focus.reasons[1] });
  const regulatory = regulatoryReason(components, ctx);
  const reasons: MatchReason[] = [...core.slice(0, MAX_CORE_REASONS), ...(regulatory ? [regulatory] : [])];

  /* ---- cautions: the person's flags first, then what the pen itself carries ---- */
  const cautions: MatchReason[] = decision.cautions
    .slice(0, MAX_CAUTIONS)
    .map((f) => ({ kind: f.source === "anti_doping" ? "anti_doping" : "safety", text: f.title }));
  if (doping && !cautions.some((c) => c.kind === "anti_doping")) {
    const parts: string[] = [];
    if (prohibited.listed.length > 0) {
      parts.push(`${joinNames(prohibited.listed.map((c) => c.name))} ${prohibited.listed.length === 1 ? "is" : "are"} on the WADA Prohibited List`);
    }
    if (prohibited.s0.length > 0) {
      parts.push(
        `${joinNames(prohibited.s0.map((c) => c.name))} ${prohibited.s0.length === 1 ? "is" : "are"} approved by no regulator, so prohibited at all times under WADA category S0`,
      );
    }
    cautions.push({ kind: "anti_doping", text: `${parts.join("; ")} — as a tested athlete, using this pen risks sanction.` });
  }

  // Product-inherent points that still make this a "review first" match rather than a plain one.
  const review: MatchReason[] = [];
  if (belowThreshold && !decision.cautions.some((f) => f.source === "body")) {
    review.push({
      kind: "safety",
      text: `Your BMI of ${bodyMass} is below the licensed threshold for weight-management medicines (BMI ≥ 30, or ≥ 27 with a weight-related condition) — the trials behind ${joinNames(incretins.map((c) => c.name))} enrolled a different population.`,
    });
  }
  const medicine = medicineCaution(resolved, ctx);
  if (medicine) review.push(medicine);
  const investigational = investigationalCaution(resolved);
  if (investigational) review.push(investigational);
  if (earlyGoal && goal && goalHit) review.push(earlyEvidenceCaution(goal, components));
  cautions.push(...review);

  const blend = blendCaution(product, resolved);
  if (blend) cautions.push(blend);
  for (const slug of unresolved) {
    cautions.push({
      kind: "safety",
      text: `No evidence record for ${slug.toUpperCase()} in our database yet — its suitability for you could not be assessed.`,
    });
  }

  const assessed = unresolved.length === 0 && components.length === slugs.length;

  if (decision.verdict === "not_recommended") {
    const blockers = uniq(decision.blockers.map((f) => f.title)).slice(0, 4);
    const fromLabel = decision.blockers.length === 0 ? ["Your responses identified factors that need professional review first"] : [];
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      score,
      verdict: "not_recommended",
      reasons: [...blockers, ...fromLabel].map((text) => ({ kind: "safety" as const, text })),
      cautions: [],
      compounds: components.map((c) => c.slug),
      breakdown,
      assessed,
    };
  }

  const verdict: MatchVerdict = decision.verdict === "match" && review.length > 0 ? "match_with_review" : decision.verdict;

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    score,
    verdict,
    reasons,
    cautions,
    compounds: components.map((c) => c.slug),
    breakdown,
    assessed,
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

function unmatchedFocus(answers: AssessmentAnswers): string[] {
  return answers.focusAreas
    .filter((id) => id !== FOCUS_NONE && isFocusId(id) && Object.keys(FOCUS_WEIGHTS[id]).length === 0)
    .map((id) => FOCUS_DEFS[id as FocusId].label);
}

function summarise(
  answers: AssessmentAnswers,
  primary: ProductMatch | undefined,
  reviewRequired: boolean,
  notRecommended: ProductMatch[],
): string {
  const goal = answers.primaryGoal;
  const problem = goalProblemLabel(goal);
  if (primary) {
    const tail = primary.verdict === "match_with_review" ? ", with points to review before you buy" : "";
    return `${primary.name} is your match${problem ? ` for “${problem}”` : ""} — fit ${primary.score}/100${tail}.`;
  }
  if (reviewRequired) {
    return "A review-required flag from your answers about yourself applies to every pen, so nothing in the range should be bought without speaking to a clinician first.";
  }
  if (goal && !goalServed(goal)) {
    return `Nothing in the range is researched for ${lcFirst(GOAL_MAP[goal].label)}, so the ${BRAND.assessmentName} has no pen to match you to.`;
  }
  if (notRecommended.length === PRODUCTS.length) {
    return "Your answers ruled out every pen in the range — the report explains which flags did it and what to take to a clinician.";
  }
  if (goal && EARLY_EVIDENCE_GOALS.includes(goal)) {
    return `Nothing in the range has controlled human evidence for ${lcFirst(GOAL_MAP[goal].label)}, and the pens listed for it did not score high enough on your answers to be called a match — the report shows how each one was assessed.`;
  }
  return `None of the ${numberWord(PRODUCTS.length)} pens scored high enough on your answers to be called a match — the report shows how each one was assessed.`;
}

/**
 * A pen earns an "also considered" slot only if it scored on the focus areas,
 * or has at least Limited evidence for the goal in a population the user
 * belongs to (no BMI penalty). A goal hit alone does not list a pen.
 */
function relevant(m: Scored): boolean {
  return m.breakdown.focus > 0 || (m.breakdown.evidence >= ALTERNATIVE_MIN_EVIDENCE && !m.breakdown.body);
}

/**
 * Score and label every pen in the range. `report` should be the rules-engine
 * report for these answers; pens whose compounds it did not assess are run
 * through the engine here (once, for the whole range) so each gets a real
 * suitability verdict.
 */
export function matchProducts(answers: AssessmentAnswers, report: Report): MatchResult {
  const ctx = assess(answers, report);
  const reviewRequired = ctx.globalFlags.some((f) => f.severity === "high");

  const scored = PRODUCTS.map((p) => matchProduct(p, answers, ctx)).sort(
    (x, y) =>
      VERDICT_RANK[x.verdict] - VERDICT_RANK[y.verdict] ||
      y.score - x.score ||
      TIE_RANK[x.verdict] - TIE_RANK[y.verdict] ||
      x.name.localeCompare(y.name),
  );

  const eligible = scored.filter((m) => m.verdict !== "not_recommended");
  const primaryWithMeta = eligible.find((m) => m.assessed && m.score >= PRIMARY_MIN_SCORE && purchasable(productOf(m)));
  // Alternatives only make sense next to a match; they must still clear a floor so "also considered" never lists a 5/100 or a goal-only hit.
  const alternatives = primaryWithMeta
    ? eligible
        .filter((m) => m !== primaryWithMeta && m.assessed && m.score >= ALTERNATIVE_MIN_SCORE && relevant(m) && purchasable(productOf(m)))
        .slice(0, MAX_ALTERNATIVES)
    : [];
  const notRecommended = scored.filter((m) => m.verdict === "not_recommended");

  const primary = primaryWithMeta ? strip(primaryWithMeta) : undefined;

  return {
    generatedAt: new Date().toISOString(),
    goal: answers.primaryGoal,
    primary,
    alternatives: alternatives.map(strip),
    notRecommended: notRecommended.map(strip),
    summary: summarise(answers, primary, reviewRequired, notRecommended),
    reviewRequired,
    unmatchedFocus: unmatchedFocus(answers),
  };
}

function productOf(m: ProductMatch): Product {
  return PRODUCTS.find((p) => p.id === m.productId) as Product;
}

function strip(m: Scored): ProductMatch {
  return {
    productId: m.productId,
    slug: m.slug,
    name: m.name,
    score: m.score,
    verdict: m.verdict,
    reasons: m.reasons,
    cautions: m.cautions,
    compounds: m.compounds,
    breakdown: m.breakdown,
  };
}

/**
 * The end-of-quiz pipeline: assess the whole range, pick the match, then
 * build the user-facing report around the pens that matter — the ones the
 * user picked plus the match and its alternatives — falling back to the whole
 * range when nothing matched so the report can explain why. The report
 * echoes the user's actual responses.
 */
export function buildQuizResult(answers: AssessmentAnswers): { report: Report; match: MatchResult } {
  const rangeReport = generateReport(rangeAnswers(answers));
  const match = matchProducts(answers, rangeReport);

  const shown = [match.primary, ...match.alternatives].filter((m): m is ProductMatch => Boolean(m));
  const pens = uniq([...selectedProducts(answers), ...shown.map(productOf)]);
  const reportAnswers = pens.length > 0 ? answersForProducts(answers, pens) : rangeAnswers(answers);
  const report: Report = { ...generateReport(reportAnswers), answers };

  return { report, match };
}

/** Every product the match result mentions, best first. */
export function allMatches(result: MatchResult): ProductMatch[] {
  return [result.primary, ...result.alternatives, ...result.notRecommended].filter((m): m is ProductMatch => Boolean(m));
}

/** This product's entry in a match result, if it is mentioned at all. */
export function matchForProduct(result: MatchResult | null | undefined, slug: string): ProductMatch | undefined {
  return result ? allMatches(result).find((m) => m.slug === slug) : undefined;
}

/** Where the quiz should send the user once the result is stored. */
export function resultHref(result: MatchResult): string {
  return result.primary ? `/shop/${result.primary.slug}/?match=1` : "/report/";
}
