import type { GoalId } from "@/data/types";
import { GOAL_MAP, type GoalDef } from "@/data/goals";

/**
 * Ad-funnel entry points. Each paid-ad creative lands on `/start/[symptom]`,
 * which pre-selects a goal and hands off to `/assessment/?goal=…&symptom=…`.
 *
 * Copy rules (see docs/BRIEF.md §2): calm, honest, second person, UK English.
 * Never "X will fix Y" — only "researched for" / "worth discussing".
 */
export interface SymptomDef {
  /** URL slug used in `/start/[symptom]` and passed to the assessment as `symptom`. */
  slug: string;
  goalId: GoalId;
  /** Short human label for lists and footers. */
  label: string;
  /** One honest sentence shown under the goal's funnel headline. */
  subheadline: string;
  /** What the assessment checks for this goal — exactly four bullets. */
  checks: readonly [string, string, string, string];
  /** Meta description for the landing page (≤ 160 characters). */
  metaDescription: string;
}

export const SYMPTOMS: readonly SymptomDef[] = [
  {
    slug: "tired",
    goalId: "general_wellbeing",
    label: "Energy & wellbeing",
    subheadline:
      "Fatigue has many causes — most of them aren’t peptides. The assessment maps your goal, history and medicines against the evidence so you know what’s actually worth discussing.",
    checks: [
      "Whether any compound has human evidence for energy, mood or day-to-day wellbeing — and how strong that evidence is",
      "Conditions and medicines in your history that change the picture, including thyroid, sleep and mental-health factors",
      "The regulatory status of each compound in your country, with the date we last checked it",
      "Questions to raise with a clinician, including the common causes of fatigue worth ruling out first",
    ],
    metaDescription:
      "A seven-minute, evidence-led assessment that maps fatigue and wellbeing goals against published research, your health history, medicines and regulatory status.",
  },
  {
    slug: "weight",
    goalId: "weight_management",
    label: "Weight management",
    subheadline:
      "Some peptides have large trials behind them; many have none. The assessment shows which is which, checks your history and medicines against their labels, and tells you what to ask a clinician.",
    checks: [
      "Which compounds have randomised-trial evidence for weight management, and what those trials actually showed",
      "Contraindications from your medical history — for example thyroid cancer history, pancreatitis or gallbladder disease for incretin medicines",
      "Interactions with diabetes medicines, blood thinners and thyroid hormone",
      "Licensed eligibility criteria and regulatory status in your country",
    ],
    metaDescription:
      "Compare weight-management peptides by trial evidence and regulatory status, then check your history and medicines against them in a free seven-minute assessment.",
  },
  {
    slug: "fat-loss",
    goalId: "fat_loss",
    label: "Fat loss & body composition",
    subheadline:
      "Body-composition claims are everywhere; controlled human data is rarer. The assessment separates the two, then checks your own history against what has actually been studied.",
    checks: [
      "Which compounds have human evidence for fat loss or preserving lean mass — and which have animal data only",
      "Whether your timeframe is realistic against what the trials measured",
      "Medical history and medicines that change suitability, including hormonal and metabolic conditions",
      "Anti-doping status if you compete, and regulatory status in your country",
    ],
    metaDescription:
      "An evidence-led check of fat-loss and body-composition peptides: human trial evidence, regulatory status and a personal suitability assessment in seven minutes.",
  },
  {
    slug: "muscle",
    goalId: "muscle_recovery",
    label: "Muscle & recovery",
    subheadline:
      "Growth-hormone-axis peptides are widely marketed for muscle and recovery; the human evidence is thinner than the marketing. The assessment shows what has been studied, in whom, and what your history adds.",
    checks: [
      "What human studies exist for muscle, strength or recovery — their populations, durations and outcomes",
      "Conditions that matter for growth-hormone-axis compounds, such as active cancer, diabetes or sleep apnoea",
      "Interactions with hormones, corticosteroids and glucose-lowering medicines",
      "Regulatory and anti-doping status in your country and your sport",
    ],
    metaDescription:
      "Check muscle and recovery peptides against published human evidence, contraindications, interactions and regulatory status in a free seven-minute assessment.",
  },
  {
    slug: "performance",
    goalId: "athletic_performance",
    label: "Athletic performance",
    subheadline:
      "Most compounds marketed for performance are prohibited in sport, and few have controlled human data. The assessment lays out the evidence, anti-doping status and the factors in your history that matter.",
    checks: [
      "Anti-doping status of every compound you’re considering — prohibited at all times, in competition, or not listed",
      "Human evidence for endurance, strength or output, separated from animal and laboratory data",
      "Cardiovascular, metabolic and hormonal factors in your history that would raise concern",
      "Regulatory status and source considerations for unlicensed products",
    ],
    metaDescription:
      "Athletic-performance peptides checked against anti-doping rules, human trial evidence and your own health history in a free, seven-minute assessment.",
  },
  {
    slug: "recovery",
    goalId: "injury_recovery",
    label: "Injury & recovery",
    subheadline:
      "The best-known repair peptides have little or no human efficacy data. The assessment shows exactly where the evidence stands for each one, and what your history and medicines add.",
    checks: [
      "Whether any compound has human evidence for tendon, ligament, muscle or joint recovery — or animal studies only",
      "Factors in your history that matter for tissue-repair compounds, including cancer history and active infection",
      "Regulatory status — most repair peptides are not authorised as medicines in any jurisdiction",
      "Source and quality considerations for unlicensed products, and questions for a clinician or physiotherapist",
    ],
    metaDescription:
      "Injury and recovery peptides checked against human evidence, regulatory status and your own health history in a free seven-minute assessment.",
  },
  {
    slug: "skin",
    goalId: "skin_cosmetic",
    label: "Skin & cosmetic",
    subheadline:
      "Cosmetic peptides range from well-studied topical ingredients to injectables with no human data. The assessment tells you which category each one sits in before you spend anything.",
    checks: [
      "Which compounds have human evidence for skin quality, ageing or firmness, and whether that evidence is topical or injectable",
      "The difference between a cosmetic ingredient and an unlicensed medicine in your country",
      "Skin conditions, melanoma history and medicines that change the picture",
      "Regulatory status and better-evidenced alternatives",
    ],
    metaDescription:
      "Skin and cosmetic peptides compared by human evidence and regulatory status, with a personal suitability check in about seven minutes.",
  },
  {
    slug: "hair",
    goalId: "hair",
    label: "Hair",
    subheadline:
      "Hair loss has well-established treatments; peptides are not yet among them. The assessment shows what has actually been studied and which questions are worth taking to a clinician.",
    checks: [
      "Whether any compound in our database has human evidence for hair thinning, shedding or growth",
      "How that evidence compares with established, licensed treatments",
      "Hormonal, thyroid and autoimmune factors in your history that a clinician would want to know about",
      "Regulatory status of anything you’re considering, and what to ask a clinician or dermatologist",
    ],
    metaDescription:
      "Hair peptides checked honestly against human evidence and regulatory status, with a personal assessment that shows what is worth discussing with a clinician.",
  },
  {
    slug: "libido",
    goalId: "sexual_health",
    label: "Sexual health",
    subheadline:
      "Some sexual-health peptides are licensed medicines in certain countries; others are unlicensed and carry documented risks. The assessment shows the difference and checks your history and medicines against both.",
    checks: [
      "Human evidence for libido, arousal and sexual function, and the populations in which it was studied",
      "Cardiovascular history and blood-pressure medicines, which matter for several sexual-health compounds",
      "Interactions with PDE5 inhibitors, nitrates and other medicines",
      "Regulatory status in your country and counterfeit risk for products bought online",
    ],
    metaDescription:
      "Sexual-health peptides compared by human evidence and regulatory status, with a free seven-minute check of your history and medicines.",
  },
  {
    slug: "sleep",
    goalId: "sleep",
    label: "Sleep",
    subheadline:
      "Peptides marketed for sleep have very little human evidence. The assessment shows what exists, flags what in your history matters, and points to what a clinician would look at first.",
    checks: [
      "Whether any compound has controlled human evidence for falling asleep, staying asleep or sleep quality",
      "Sleep apnoea, mental-health history and sedating medicines that change suitability",
      "Interactions with sleep aids, antidepressants and alcohol",
      "Regulatory status, and the established options a clinician is likely to raise first",
    ],
    metaDescription:
      "Sleep peptides checked against published human evidence and regulatory status, with a personal suitability assessment in about seven minutes.",
  },
  {
    slug: "longevity",
    goalId: "longevity",
    label: "Longevity",
    subheadline:
      "Longevity is where marketing runs furthest ahead of evidence. The assessment separates compounds with human outcome data from those with only animal or laboratory data — and shows what your own history adds.",
    checks: [
      "Which compounds have human outcome data relevant to healthy ageing, and which have preclinical data only",
      "Cardiovascular, metabolic and cancer history that changes the picture",
      "Interactions with long-term medicines such as statins, blood-pressure and diabetes medicines",
      "Regulatory status, source considerations and questions to ask a clinician about monitoring",
    ],
    metaDescription:
      "Longevity peptides separated into those with human outcome data and those with laboratory evidence only, plus a free personal suitability check.",
  },
];

const BY_SLUG: Record<string, SymptomDef> = Object.fromEntries(SYMPTOMS.map((s) => [s.slug, s]));

export function getSymptom(slug: string): SymptomDef | undefined {
  return BY_SLUG[slug];
}

export function symptomForGoal(goalId: GoalId): SymptomDef | undefined {
  return SYMPTOMS.find((s) => s.goalId === goalId);
}

/** The goal definition behind a symptom entry point. */
export function goalForSymptom(symptom: SymptomDef): GoalDef {
  return GOAL_MAP[symptom.goalId];
}

/** Where a goal card should send the user: its landing page, or straight into the wizard. */
export function goalEntryHref(goalId: GoalId): string {
  const symptom = symptomForGoal(goalId);
  return symptom ? `/start/${symptom.slug}` : `/assessment/?goal=${goalId}`;
}

/** Assessment URL with the goal pre-selected and the ad creative recorded. */
export function assessmentHref(symptom?: SymptomDef): string {
  if (!symptom) return "/assessment";
  return `/assessment/?goal=${symptom.goalId}&symptom=${symptom.slug}`;
}
