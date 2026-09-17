import { GOALS, type GoalDef } from "@/data/goals";
import type { GoalId } from "@/data/types";
import { BRAND } from "@/lib/brand";
import { filled, plausibleBody, PREGNANCY_NOTICE, selectedProducts, wadaHint } from "./derived";
import { SECTION_META, SECTION_ORDER, TIMEFRAME_LABELS, type AssessmentAnswers, type SectionId } from "./types";

/**
 * The quiz (BRAND.assessmentName) as data. The wizard is a state machine over this list:
 * `store.position` = { section, step } where `step` is the index into the
 * section's *static* step list (so stored positions stay meaningful when
 * conditional steps appear or disappear). Visibility is evaluated live.
 *
 * v3: every question feeds the product matcher (`src/lib/match/engine.ts`) —
 * the goal cards, focus areas and secondary goals score the six pens; the
 * basics, history, medicines and safety screen feed the rules engine whose
 * flags decide whether a pen may be matched at all. Sections that no longer
 * ask anything (experience, source, wants) keep their ids for the store and
 * the engine and are completed automatically on generate.
 */

/* ------------------------------------------------------------------ */
/* Field key helpers                                                   */
/* ------------------------------------------------------------------ */

/** Answer keys whose value is a string (or string-literal union). */
export type StringKeys = {
  [K in keyof AssessmentAnswers]-?: NonNullable<AssessmentAnswers[K]> extends string ? K : never;
}[keyof AssessmentAnswers];

/** Answer keys whose value is an array of strings. */
export type StringArrayKeys = {
  [K in keyof AssessmentAnswers]-?: NonNullable<AssessmentAnswers[K]> extends readonly string[] ? K : never;
}[keyof AssessmentAnswers];

export type Position = { section: SectionId; step: number };

/* ------------------------------------------------------------------ */
/* Step model                                                          */
/* ------------------------------------------------------------------ */

export type OptionIcon = GoalDef["icon"];

export interface StepOption {
  value: string;
  label: string;
  hint?: string;
  icon?: OptionIcon;
  /** Selecting this option reveals a follow-up input, so do not auto-advance. */
  followUp?: boolean;
  /** Selecting this option shows a notice the user should read — no auto-advance. */
  noAutoAdvance?: boolean;
}

export interface TextFollowUp {
  field: StringKeys;
  /** Option values that reveal the follow-up */
  when: string[];
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}

export interface ChipGroup {
  field: StringArrayKeys;
  label: string;
  options: StepOption[];
}

interface BaseStep {
  id: string;
  section: SectionId;
  /** Exact question wording */
  title: string;
  help?: string;
  optional?: boolean;
  visible?: (a: AssessmentAnswers) => boolean;
  valid: (a: AssessmentAnswers) => boolean;
  /** True when an optional step has no answer yet — used for the "Skip" label */
  isEmpty?: (a: AssessmentAnswers) => boolean;
  /** Message shown after the user attempts to continue with an invalid answer */
  error?: string | ((a: AssessmentAnswers) => string);
}

export type SingleStep = BaseStep & {
  kind: "single";
  field: StringKeys;
  options: StepOption[] | ((a: AssessmentAnswers) => StepOption[]);
  columns?: 1 | 2;
  followUp?: TextFollowUp;
  /** Inline notice shown for the current value (e.g. pregnancy safety notice) */
  notice?: (a: AssessmentAnswers) => string | undefined;
};

export type YesNoStep = BaseStep & {
  kind: "yesno";
  field: StringKeys;
  /** Defaults to Yes / No */
  options?: StepOption[];
  followUp?: TextFollowUp;
  /** Tailored hint shown under the question */
  hint?: (a: AssessmentAnswers) => string | undefined;
};

export type TextStep = BaseStep & {
  kind: "text";
  field: StringKeys;
  placeholder?: string;
  maxLength?: number;
  chips?: ChipGroup;
};

export type NumberStep = BaseStep & {
  kind: "number";
  field: "age";
  min: number;
  max: number;
  suffix?: string;
};

export type CustomKind =
  | "goal"
  | "focus"
  | "secondary-goals"
  | "products"
  | "body"
  | "country"
  | "conditions"
  | "medications"
  | "otc"
  | "supplements"
  | "lifestyle"
  | "safety"
  | "review";

export type CustomStep = BaseStep & { kind: CustomKind };

export type Step = SingleStep | YesNoStep | TextStep | NumberStep | CustomStep;
export type StepKind = Step["kind"];

/* ------------------------------------------------------------------ */
/* Goals as problems (step 1)                                          */
/* ------------------------------------------------------------------ */

/** Goals the quiz offers — every one maps to at least one pen, except sleep, which the matcher answers honestly. */
export const QUIZ_GOALS = [
  "fat_loss",
  "weight_management",
  "general_wellbeing",
  "athletic_performance",
  "injury_recovery",
  "muscle_recovery",
  "skin_cosmetic",
  "hair",
  "longevity",
  "sleep",
] as const satisfies readonly GoalId[];

export type QuizGoal = (typeof QUIZ_GOALS)[number];

export function isQuizGoal(goal: GoalId | undefined): goal is QuizGoal {
  return Boolean(goal) && (QUIZ_GOALS as readonly string[]).includes(goal as string);
}

/** The problem statement shown on each goal card, and the hint under it. */
export const GOAL_PROBLEMS: Record<QuizGoal, { label: string; hint: string }> = {
  fat_loss: { label: "Stubborn belly fat or body composition", hint: "Fat that does not move with diet and training" },
  weight_management: { label: "My weight overall", hint: "Losing weight, or holding a healthier weight" },
  general_wellbeing: { label: "Tired all the time", hint: "Low energy even when you sleep" },
  athletic_performance: { label: "Slow recovery or flagging endurance", hint: "Stamina and bounce-back in training" },
  injury_recovery: { label: "A tendon, ligament or joint injury", hint: "Something that will not settle" },
  muscle_recovery: { label: "Muscle recovery between sessions", hint: "Sore for longer than you used to be" },
  skin_cosmetic: { label: "Skin ageing, firmness or texture", hint: "Fine lines, tone, slow-healing marks" },
  hair: { label: "Hair thinning", hint: "Thinning or shedding more than usual" },
  longevity: { label: "Healthy ageing", hint: "Long-term energy, metabolic and skin health" },
  sleep: { label: "Sleep", hint: "Falling asleep, staying asleep, waking rested" },
};

export function goalProblemLabel(goal: GoalId | undefined): string | undefined {
  return isQuizGoal(goal) ? GOAL_PROBLEMS[goal].label : goal ? GOALS.find((g) => g.id === goal)?.label : undefined;
}

export const GOAL_OPTIONS: StepOption[] = QUIZ_GOALS.map((id) => ({
  value: id,
  label: GOAL_PROBLEMS[id].label,
  hint: GOAL_PROBLEMS[id].hint,
  icon: GOALS.find((g) => g.id === id)?.icon,
}));

/* ------------------------------------------------------------------ */
/* Focus areas (step 2)                                                */
/* ------------------------------------------------------------------ */

/**
 * Focus ids are shared across goals where the problem is the same (for
 * example `low_stamina` under both "tired" and "performance"). The matcher
 * weights each id against the pens in `src/lib/match/engine.ts`.
 */
const FOCUS_DEF_ENTRIES = {
  belly_fat: { label: "Belly fat that will not move", hint: "Around the middle, whatever the scales say" },
  overall_weight: { label: "Overall weight on the scales" },
  muscle_preserve: { label: "Keeping muscle while losing fat" },
  metabolic: { label: "Metabolic health", hint: "Blood sugar, energy after meals, waistline" },
  tired_despite_sleep: { label: "Tired even after a full night's sleep" },
  low_stamina: { label: "Stamina and endurance have dropped" },
  brain_fog: { label: "Brain fog or poor focus" },
  post_illness: { label: "Slow to recover after illness" },
  recovery_between: { label: "Recovery between sessions is slow" },
  soreness: { label: "Soreness lasts longer than it used to" },
  recurring: { label: "Recurring strains or niggles" },
  tendon: { label: "A tendon injury", hint: "Achilles, patellar, elbow, rotator cuff" },
  ligament: { label: "A ligament injury", hint: "Knee, ankle, wrist" },
  muscle_strain: { label: "A muscle tear or strain" },
  joint: { label: "A joint problem", hint: "Pain, stiffness or swelling" },
  scars_marks: { label: "Slow-healing marks or scars" },
  firmness: { label: "Loss of firmness or fine lines" },
  texture: { label: "Texture, tone or dullness" },
  irritation: { label: "Redness or irritation-prone skin" },
  hair_thinning: { label: "Hair thinning" },
  shedding: { label: "Shedding more than usual" },
  energy: { label: "Long-term energy" },
  skin_ageing: { label: "Skin ageing" },
  repair: { label: "Recovery and repair as I age" },
  falling_asleep: { label: "Falling asleep" },
  staying_asleep: { label: "Staying asleep" },
  waking_unrefreshed: { label: "Waking unrefreshed" },
} as const satisfies Record<string, { label: string; hint?: string }>;

export type FocusId = keyof typeof FOCUS_DEF_ENTRIES;

export const FOCUS_DEFS: Record<FocusId, { label: string; hint?: string }> = FOCUS_DEF_ENTRIES;

/** "None of these" — recorded so the step counts as answered, weighted by nothing. */
export const FOCUS_NONE = "none";

export const FOCUS_BY_GOAL: Record<QuizGoal, FocusId[]> = {
  fat_loss: ["belly_fat", "overall_weight", "muscle_preserve", "metabolic"],
  weight_management: ["overall_weight", "belly_fat", "metabolic", "muscle_preserve"],
  general_wellbeing: ["tired_despite_sleep", "low_stamina", "brain_fog", "post_illness"],
  athletic_performance: ["low_stamina", "recovery_between", "recurring", "soreness"],
  injury_recovery: ["tendon", "ligament", "muscle_strain", "joint", "recurring", "scars_marks"],
  muscle_recovery: ["recovery_between", "soreness", "muscle_strain", "recurring"],
  skin_cosmetic: ["firmness", "texture", "scars_marks", "irritation", "hair_thinning"],
  hair: ["hair_thinning", "shedding"],
  longevity: ["energy", "metabolic", "skin_ageing", "repair"],
  sleep: ["falling_asleep", "staying_asleep", "waking_unrefreshed"],
};

export function isFocusId(id: string): id is FocusId {
  return id in FOCUS_DEFS;
}

export function focusLabel(id: string): string {
  return isFocusId(id) ? FOCUS_DEFS[id].label : id === FOCUS_NONE ? "None of these" : id;
}

export function focusOptionsFor(goal: GoalId | undefined): StepOption[] {
  const ids = isQuizGoal(goal) ? FOCUS_BY_GOAL[goal] : [];
  return [
    ...ids.map((id) => ({ value: id, label: FOCUS_DEFS[id].label, hint: FOCUS_DEFS[id].hint })),
    { value: FOCUS_NONE, label: "None of these", hint: "Nothing here fits — match me on the goal alone" },
  ];
}

/* ------------------------------------------------------------------ */
/* Other option lists                                                  */
/* ------------------------------------------------------------------ */

const has = (v: unknown) => v !== undefined && v !== null && v !== "";

function fromLabels<T extends string>(labels: Record<T, string>, hints?: Partial<Record<T, string>>): StepOption[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value], hint: hints?.[value] }));
}

export type ExperienceLevel = NonNullable<AssessmentAnswers["experienceLevel"]>;

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  none: "Never used a peptide",
  some: "Used vials before",
  experienced: "Experienced",
};

export const EXPERIENCE_OPTIONS: StepOption[] = [
  { value: "none", label: EXPERIENCE_LABELS.none, hint: "This would be my first time" },
  { value: "some", label: EXPERIENCE_LABELS.some, hint: "Reconstituting, drawing up, storing" },
  { value: "experienced", label: EXPERIENCE_LABELS.experienced, hint: "Comfortable with peptides and pens" },
];

export const MAX_SECONDARY_GOALS = 2;

export const YES_NO_OPTIONS: StepOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const YES_NO_UNSURE_OPTIONS: StepOption[] = [...YES_NO_OPTIONS, { value: "unsure", label: "Unsure" }];
export const YES_NO_NA_OPTIONS: StepOption[] = [...YES_NO_OPTIONS, { value: "na", label: "Not applicable" }];

export const RISK_FIELDS = [
  "seriousAllergy",
  "componentAllergy",
  "previousSeriousReaction",
  "severeSymptoms",
  "advisedAgainst",
  "underInvestigation",
  "interactingTreatment",
] as const satisfies readonly StringKeys[];

export type RiskField = (typeof RISK_FIELDS)[number];

/** The seven safety questions, asked together on one screen. Ids match `riskHint`. */
export const RISK_QUESTIONS: { id: string; field: RiskField; title: string }[] = [
  { id: "serious-allergy", field: "seriousAllergy", title: "Have you ever had a serious allergic reaction to a medicine?" },
  {
    id: "component-allergy",
    field: "componentAllergy",
    title: "Do you have a known allergy to any component of the products in the range?",
  },
  {
    id: "previous-reaction",
    field: "previousSeriousReaction",
    title: "Have you previously had a serious reaction to a similar treatment?",
  },
  { id: "severe-symptoms", field: "severeSymptoms", title: "Do you have any unexplained or severe symptoms at the moment?" },
  {
    id: "advised-against",
    field: "advisedAgainst",
    title: "Has a healthcare professional advised you not to use this type of treatment?",
  },
  { id: "under-investigation", field: "underInvestigation", title: "Are you currently under investigation for a relevant condition?" },
  {
    id: "interacting-treatment",
    field: "interactingTreatment",
    title: "Are you receiving any treatment that could interact with these compounds?",
  },
];

export function anyRiskYes(a: AssessmentAnswers): boolean {
  return RISK_FIELDS.some((f) => a[f] === "yes");
}

/* ------------------------------------------------------------------ */
/* Steps per section                                                   */
/* ------------------------------------------------------------------ */

const goals: Step[] = [
  {
    id: "goal",
    section: "goals",
    kind: "goal",
    title: "What do you want to change?",
    help: "Pick the one that matters most right now. Everything that follows is built around it.",
    valid: (a) => Boolean(a.primaryGoal),
    error: "Choose one to continue.",
  },
  {
    id: "focus",
    section: "goals",
    kind: "focus",
    title: "Which of these sound like you?",
    help: "Choose everything that applies. This is what points the match at one pen rather than another.",
    valid: (a) => a.focusAreas.length > 0,
    error: "Choose at least one — or “None of these”.",
  },
  {
    id: "secondary-goals",
    section: "goals",
    kind: "secondary-goals",
    title: "Anything else you would like to work on?",
    help: `Up to ${MAX_SECONDARY_GOALS}. Optional — they nudge the match; they do not decide it.`,
    optional: true,
    valid: (a) => a.secondaryGoals.length <= MAX_SECONDARY_GOALS,
    isEmpty: (a) => a.secondaryGoals.length === 0,
    error: `Choose up to ${MAX_SECONDARY_GOALS}.`,
  },
  {
    id: "timeframe",
    section: "goals",
    kind: "single",
    field: "timeframe",
    title: "What timeframe do you have in mind?",
    help: "An honest answer lets us set expectations against what the research shows — the trials behind every grade ran for months.",
    options: fromLabels(TIMEFRAME_LABELS),
    valid: (a) => has(a.timeframe),
    error: "Choose one option to continue.",
  },
  {
    id: "experience",
    section: "goals",
    kind: "single",
    field: "experienceLevel",
    title: "Have you used peptides before?",
    help: `${BRAND.name} pens are pre-filled and dose-dial — no vials, no reconstitution — which matters more to some people than others.`,
    options: EXPERIENCE_OPTIONS,
    valid: (a) => has(a.experienceLevel),
    error: "Choose one option to continue.",
  },
];

const considering: Step[] = [
  {
    id: "products",
    section: "considering",
    kind: "products",
    title: "Have you got a specific pen in mind?",
    help: "Optional. Pick any of the six and every compound inside it is assessed against your history — whether or not it ends up as your match.",
    optional: true,
    valid: () => true,
    isEmpty: (a) => selectedProducts(a).length === 0,
  },
  {
    id: "currently-taking",
    section: "considering",
    kind: "yesno",
    field: "currentlyTaking",
    title: "Are you currently using any peptide or similar product?",
    help: "Including anything prescribed, anything bought online and anything you use intermittently.",
    valid: (a) => has(a.currentlyTaking),
    error: "Choose yes or no to continue.",
  },
];

const basics: Step[] = [
  {
    id: "age",
    section: "basics",
    kind: "number",
    field: "age",
    title: "How old are you?",
    help: `The ${BRAND.assessmentName} is for adults aged 18 and over.`,
    min: 18,
    max: 120,
    suffix: "years",
    valid: (a) => typeof a.age === "number" && a.age >= 18 && a.age <= 120,
    error: "Enter your age in years to continue.",
  },
  {
    id: "sex",
    section: "basics",
    kind: "single",
    field: "sex",
    title: "What is your sex?",
    help: "Some evidence and some risks differ by sex. Answer in the way that best reflects your biology.",
    options: [
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },
      { value: "prefer_not", label: "Prefer not to say" },
    ],
    valid: (a) => has(a.sex),
    error: "Choose one option to continue.",
  },
  {
    id: "body",
    section: "basics",
    kind: "body",
    title: "What are your height and weight?",
    help: "Used to calculate BMI. It matters for how fat- and weight-related compounds such as tesamorelin were studied, and in whom.",
    valid: (a) => plausibleBody(a.heightCm, a.weightKg),
    error: "Enter a height and weight so we can calculate your BMI.",
  },
  {
    id: "country",
    section: "basics",
    kind: "country",
    title: "Which country do you live in?",
    help: "We show the regulatory status of each compound where you live.",
    valid: (a) => Boolean(a.countryCode),
    error: "Choose a country to continue.",
  },
  {
    id: "pregnancy",
    section: "basics",
    kind: "single",
    field: "pregnancy",
    title: "Are you pregnant, trying to conceive or breastfeeding?",
    visible: (a) => a.sex !== "male",
    options: [
      { value: "yes", label: "Yes", noAutoAdvance: true },
      { value: "no", label: "No" },
      { value: "na", label: "Not applicable" },
      { value: "prefer_not", label: "Prefer not to say" },
    ],
    notice: (a) => (a.pregnancy === "yes" ? PREGNANCY_NOTICE : undefined),
    valid: (a) => has(a.pregnancy),
    error: "Choose one option to continue.",
  },
];

const medical: Step[] = [
  {
    id: "conditions",
    section: "medical",
    kind: "conditions",
    title: "Have you been diagnosed with any of the following?",
    help: "Choose one answer per row. The rows below the line are there because a compound in one of the six pens references them.",
    valid: () => true,
  },
  {
    id: "surgery",
    section: "medical",
    kind: "yesno",
    field: "relevantSurgery",
    title: "Have you had surgery that may be relevant?",
    help: "For example bariatric, thyroid, pancreatic or cardiac surgery, or any major operation in the last year.",
    followUp: {
      field: "surgeryDetails",
      when: ["yes"],
      label: "What was the surgery, and roughly when?",
      placeholder: "For example: gallbladder removal, 2023",
    },
    valid: (a) => has(a.relevantSurgery),
    error: "Choose yes or no to continue.",
  },
  {
    id: "symptoms",
    section: "medical",
    kind: "yesno",
    field: "currentSymptoms",
    title: "Do you currently have any symptoms that concern you?",
    help: "Anything new, unexplained, or that a clinician has not assessed.",
    followUp: {
      field: "symptomsDetails",
      when: ["yes"],
      label: "Describe them briefly",
      placeholder: "For example: persistent abdominal pain for three weeks",
      multiline: true,
    },
    valid: (a) => has(a.currentSymptoms),
    error: "Choose yes or no to continue.",
  },
];

const medications: Step[] = [
  {
    id: "prescriptions",
    section: "medications",
    kind: "yesno",
    field: "takesPrescription",
    title: "Do you take any prescription medicines?",
    help: "Including hormonal contraception, HRT, inhalers and injections.",
    valid: (a) => has(a.takesPrescription),
    error: "Choose yes or no to continue.",
  },
  {
    id: "prescription-list",
    section: "medications",
    kind: "medications",
    title: "Which prescription medicines do you take?",
    help: "Start typing and pick from the list where you can — it lets us check for known interactions.",
    visible: (a) => a.takesPrescription === "yes",
    valid: (a) => a.prescriptions.length > 0 && a.prescriptions.every((p) => filled(p.name)),
    error: "Add at least one medicine, with a name for each entry.",
  },
  {
    id: "otc",
    section: "medications",
    kind: "otc",
    title: "Do you regularly use any over-the-counter medicines?",
    help: "Choose all that apply.",
    valid: () => true,
  },
  {
    id: "supplements",
    section: "medications",
    kind: "yesno",
    field: "takesSupplements",
    title: "Do you take any supplements?",
    help: "Vitamins, minerals, protein, creatine, herbal products and similar.",
    valid: (a) => has(a.takesSupplements),
    error: "Choose yes or no to continue.",
  },
  {
    id: "supplement-list",
    section: "medications",
    kind: "supplements",
    title: "Which supplements do you take?",
    help: "The name is enough. Amount and frequency help if you know them.",
    visible: (a) => a.takesSupplements === "yes",
    valid: (a) => a.supplements.length > 0 && a.supplements.every((s) => filled(s.name)),
    error: "Add at least one supplement, with a name for each entry.",
  },
  {
    id: "lifestyle",
    section: "medications",
    kind: "lifestyle",
    title: "Alcohol and nicotine",
    help: "In a typical week. Both change how safely some compounds can be used and how side effects are read.",
    valid: (a) => has(a.alcohol) && has(a.nicotine),
    error: "Answer both to continue.",
  },
];

const risk: Step[] = [
  {
    id: "safety",
    section: "risk",
    kind: "safety",
    title: "Seven quick safety checks",
    help: "A yes on any of these is what lets us say no. Anything you add is included in your report so you can share it with a clinician.",
    valid: (a) => RISK_FIELDS.every((f) => has(a[f])),
    error: "Answer all seven to continue.",
  },
  {
    id: "tested-athlete",
    section: "risk",
    kind: "yesno",
    field: "testedAthlete",
    title: "Do you compete in drug-tested sport?",
    hint: () => wadaHint(),
    valid: (a) => has(a.testedAthlete),
    error: "Choose yes or no to continue.",
  },
];

const final: Step[] = [
  {
    id: "anything-else",
    section: "final",
    kind: "text",
    field: "anythingElse",
    title: "Is there anything else we should know?",
    help: "Anything our structured questions may have missed.",
    placeholder: "Optional",
    maxLength: 1000,
    optional: true,
    valid: () => true,
    isEmpty: (a) => !filled(a.anythingElse),
  },
  {
    id: "review",
    section: "final",
    kind: "review",
    title: "Review your answers",
    help: "Check everything looks right. You can edit any section before we find your match.",
    valid: () => true,
  },
];

export const STEPS_BY_SECTION: Record<SectionId, Step[]> = {
  goals,
  considering,
  basics,
  medical,
  medications,
  experience: [],
  source: [],
  risk,
  wants: [],
  final,
};

/** Flat list in flow order. */
export const STEPS: Step[] = SECTION_ORDER.flatMap((s) => STEPS_BY_SECTION[s]);

/** Sections that actually ask something, in order — drives the stepper, eyebrow and review. */
export const FLOW_SECTIONS: SectionId[] = SECTION_ORDER.filter((s) => STEPS_BY_SECTION[s].length > 0);

/** Sections with no questions (experience is folded into the goals section; the source is the store; report wants were dropped). Marked complete on generate. */
export const AUTO_COMPLETE_SECTIONS: SectionId[] = SECTION_ORDER.filter((s) => STEPS_BY_SECTION[s].length === 0);

const FLAT_INDEX: Record<string, number> = Object.fromEntries(STEPS.map((s, i) => [s.id, i]));

export const REVIEW_STEP: Step = STEPS.find((s) => s.kind === "review") as Step;
export const FIRST_STEP: Step = STEPS[0];

/* ------------------------------------------------------------------ */
/* Positioning                                                         */
/* ------------------------------------------------------------------ */

export function getStep(id: string): Step | undefined {
  const i = FLAT_INDEX[id];
  return i === undefined ? undefined : STEPS[i];
}

export function positionOf(step: Step): Position {
  return { section: step.section, step: STEPS_BY_SECTION[step.section].indexOf(step) };
}

export function stepAt(pos: Position): Step | undefined {
  return STEPS_BY_SECTION[pos.section]?.[pos.step];
}

export function isVisible(step: Step, a: AssessmentAnswers): boolean {
  return step.visible ? step.visible(a) : true;
}

export function getVisibleSteps(a: AssessmentAnswers): Step[] {
  return STEPS.filter((s) => isVisible(s, a));
}

/**
 * The step to render for a stored position: the step itself if visible,
 * otherwise the next visible step (falling back to the previous one).
 */
export function resolveStep(a: AssessmentAnswers, pos: Position): Step {
  const step = stepAt(pos);
  if (step && isVisible(step, a)) return step;
  const from = step ? FLAT_INDEX[step.id] : 0;
  for (let i = from; i < STEPS.length; i++) if (isVisible(STEPS[i], a)) return STEPS[i];
  for (let i = from - 1; i >= 0; i--) if (isVisible(STEPS[i], a)) return STEPS[i];
  return FIRST_STEP;
}

export function nextStep(a: AssessmentAnswers, pos: Position): Step | undefined {
  const current = resolveStep(a, pos);
  for (let i = FLAT_INDEX[current.id] + 1; i < STEPS.length; i++) {
    if (isVisible(STEPS[i], a)) return STEPS[i];
  }
  return undefined;
}

export function prevStep(a: AssessmentAnswers, pos: Position): Step | undefined {
  const current = resolveStep(a, pos);
  for (let i = FLAT_INDEX[current.id] - 1; i >= 0; i--) {
    if (isVisible(STEPS[i], a)) return STEPS[i];
  }
  return undefined;
}

export function firstStepOfSection(a: AssessmentAnswers, section: SectionId): Step | undefined {
  return STEPS_BY_SECTION[section].find((s) => isVisible(s, a));
}

export function sectionAfter(section: SectionId): SectionId | undefined {
  return SECTION_ORDER[SECTION_ORDER.indexOf(section) + 1];
}

/**
 * Where "Skip this section" lands: the first visible step of the next
 * section that asks something — or the review screen when nothing is left.
 */
export function skipTarget(a: AssessmentAnswers, section: SectionId): Step {
  let next = sectionAfter(section);
  while (next) {
    const first = firstStepOfSection(a, next);
    if (first) return first;
    next = sectionAfter(next);
  }
  return REVIEW_STEP;
}

export function isSectionSkippable(step: Step): boolean {
  return SECTION_META[step.section].optional && step.kind !== "review";
}

export function isLastStepOfSection(a: AssessmentAnswers, step: Step): boolean {
  const next = nextStep(a, positionOf(step));
  return !next || next.section !== step.section || next.kind === "review";
}

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */

export function progressPercent(a: AssessmentAnswers, pos: Position): number {
  const visible = getVisibleSteps(a);
  const current = resolveStep(a, pos);
  if (current.kind === "review") return 100;
  const idx = Math.max(0, visible.findIndex((s) => s.id === current.id));
  return Math.round((idx / visible.length) * 100);
}

export type SectionStatus = "complete" | "skipped" | "current" | "visited" | "upcoming";

export interface SectionProgressItem {
  id: SectionId;
  index: number;
  status: SectionStatus;
  title: string;
  short: string;
  optional: boolean;
}

export function sectionProgress(a: AssessmentAnswers, pos: Position): SectionProgressItem[] {
  const currentIdx = FLOW_SECTIONS.indexOf(resolveStep(a, pos).section);
  return FLOW_SECTIONS.map((id, index) => {
    let status: SectionStatus;
    if (index === currentIdx) status = "current";
    else if (a.completedSections.includes(id)) status = "complete";
    else if (a.skippedSections.includes(id)) status = "skipped";
    else if (index < currentIdx) status = "visited";
    else status = "upcoming";
    const meta = SECTION_META[id];
    return { id, index, status, title: meta.title, short: meta.short, optional: meta.optional };
  });
}

export function sectionEyebrow(step: Step): string {
  const n = FLOW_SECTIONS.indexOf(step.section) + 1;
  return `Section ${n} of ${FLOW_SECTIONS.length} · ${SECTION_META[step.section].title}`;
}

export function stepError(step: Step, a: AssessmentAnswers): string | undefined {
  if (step.valid(a)) return undefined;
  if (!step.error) return "Complete this question to continue.";
  return typeof step.error === "function" ? step.error(a) : step.error;
}

export function stepOptions(step: SingleStep | YesNoStep, a: AssessmentAnswers): StepOption[] {
  if (step.kind === "yesno") return step.options ?? YES_NO_OPTIONS;
  return typeof step.options === "function" ? step.options(a) : step.options;
}

/** Headline estimate used in marketing copy (e.g. "the 7-minute ${BRAND.assessmentName}"). */
export const ESTIMATED_MINUTES = 7;

const TOTAL_EST = FLOW_SECTIONS.reduce((sum, id) => sum + SECTION_META[id].estMinutes, 0);

/** Estimated minutes remaining from the current position, scaled to the headline estimate. */
export function minutesRemaining(a: AssessmentAnswers, pos: Position): number {
  const currentIdx = FLOW_SECTIONS.indexOf(resolveStep(a, pos).section);
  const remaining = FLOW_SECTIONS.slice(currentIdx).reduce((sum, id) => sum + SECTION_META[id].estMinutes, 0);
  return Math.max(1, Math.round((remaining / TOTAL_EST) * ESTIMATED_MINUTES));
}
