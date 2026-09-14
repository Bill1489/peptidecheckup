import { GOALS, type GoalDef } from "@/data/goals";
import { filled, isValidEmail, plausibleBody, PREGNANCY_NOTICE, riskHint } from "./derived";
import {
  ALCOHOL_LABELS,
  IMPORTANCE_LABELS,
  INFLUENCE_LABELS,
  NICOTINE_LABELS,
  RECREATIONAL_LABELS,
  SECTION_META,
  SECTION_ORDER,
  SOURCE_LABELS,
  TIMEFRAME_LABELS,
  type AssessmentAnswers,
  type SectionId,
} from "./types";

/**
 * The questionnaire as data. The wizard is a state machine over this list:
 * `store.position` = { section, step } where `step` is the index into the
 * section's *static* step list (so stored positions stay meaningful when
 * conditional steps appear or disappear). Visibility is evaluated live.
 *
 * Implements BRIEF §6 faithfully — question wording lives here.
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
  /** Exact question wording (BRIEF §6) */
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
  /** Compound-tailored hint shown under the question */
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
  | "compounds"
  | "dose"
  | "combinations"
  | "body"
  | "country"
  | "conditions"
  | "medications"
  | "otc"
  | "supplements"
  | "previous-uses"
  | "wants"
  | "contact"
  | "review";

export type CustomStep = BaseStep & { kind: CustomKind };

export type Step = SingleStep | YesNoStep | TextStep | NumberStep | CustomStep;
export type StepKind = Step["kind"];

/* ------------------------------------------------------------------ */
/* Option lists                                                        */
/* ------------------------------------------------------------------ */

const has = (v: unknown) => v !== undefined && v !== null && v !== "";

function fromLabels<T extends string>(labels: Record<T, string>, hints?: Partial<Record<T, string>>): StepOption[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value], hint: hints?.[value] }));
}

export const GOAL_OPTIONS: StepOption[] = GOALS.map((g) => ({
  value: g.id,
  label: g.label,
  hint: g.description,
  icon: g.icon,
  followUp: g.id === "other",
}));

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

/* ------------------------------------------------------------------ */
/* Steps per section                                                   */
/* ------------------------------------------------------------------ */

const goals: Step[] = [
  {
    id: "goal",
    section: "goals",
    kind: "single",
    field: "primaryGoal",
    title: "What is your primary goal?",
    help: "Choose the one that matters most right now. You can mention others later.",
    options: GOAL_OPTIONS,
    columns: 2,
    followUp: {
      field: "otherGoalText",
      when: ["other"],
      label: "Tell us about your goal",
      placeholder: "A sentence is plenty",
      required: true,
    },
    valid: (a) => Boolean(a.primaryGoal) && (a.primaryGoal !== "other" || filled(a.otherGoalText)),
    error: (a) => (a.primaryGoal === "other" ? "Tell us a little about your goal to continue." : "Choose a goal to continue."),
  },
  {
    id: "success",
    section: "goals",
    kind: "text",
    field: "successDescription",
    title: "What would success look like for you?",
    help: "In your own words — a sentence or two is plenty.",
    placeholder: "For example: losing a stone and keeping it off, or getting back to running without knee pain",
    maxLength: 600,
    optional: true,
    valid: () => true,
    isEmpty: (a) => !filled(a.successDescription),
  },
  {
    id: "importance",
    section: "goals",
    kind: "single",
    field: "importance",
    title: "How important is this goal to you right now?",
    options: fromLabels(IMPORTANCE_LABELS, {
      curious: "I'm exploring what's out there",
      moderate: "I'd like to make progress",
      very: "It affects my day-to-day life",
      extremely: "It's my top priority",
    }),
    valid: (a) => has(a.importance),
    error: "Choose one option to continue.",
  },
  {
    id: "timeframe",
    section: "goals",
    kind: "single",
    field: "timeframe",
    title: "What timeframe do you have in mind?",
    help: "An honest answer helps us set expectations against what the research shows.",
    options: fromLabels(TIMEFRAME_LABELS),
    valid: (a) => has(a.timeframe),
    error: "Choose one option to continue.",
  },
];

const considering: Step[] = [
  {
    id: "compounds",
    section: "considering",
    kind: "compounds",
    title: "Which compounds are you considering?",
    help: "Search by name or brand, or choose from the suggestions. Select as many as apply.",
    valid: (a) => a.consideredCompounds.length > 0 || filled(a.otherCompoundText),
    error: "Select at least one compound, or tell us what you have in mind.",
  },
  {
    id: "doses",
    section: "considering",
    kind: "dose",
    title: "Do you have a dose in mind?",
    help: "Optional — this lets us compare what you're considering against published study exposures.",
    optional: true,
    visible: (a) => a.consideredCompounds.length > 0,
    valid: (a) => a.consideredCompounds.every((c) => c.dose?.amount === undefined || c.dose.amount > 0),
    isEmpty: (a) => a.consideredCompounds.every((c) => !c.dose || c.dose.amount === undefined),
    error: "Dose amounts need to be greater than zero, or left blank.",
  },
  {
    id: "currently-taking",
    section: "considering",
    kind: "yesno",
    field: "currentlyTaking",
    title: "Are you currently taking any of these?",
    help: "Including anything you've started recently or use intermittently.",
    valid: (a) => has(a.currentlyTaking),
    error: "Choose yes or no to continue.",
  },
  {
    id: "multiple",
    section: "considering",
    kind: "single",
    field: "consideringMultiple",
    title: "Are you considering using more than one of these together?",
    visible: (a) => a.consideredCompounds.length >= 2,
    options: [
      { value: "no", label: "No", hint: "One at a time" },
      { value: "yes", label: "Yes", hint: "Together, or overlapping" },
      { value: "not_sure", label: "Not sure yet" },
    ],
    valid: (a) => has(a.consideringMultiple),
    error: "Choose one option to continue.",
  },
  {
    id: "combinations",
    section: "considering",
    kind: "combinations",
    title: "Which of these would you combine?",
    help: "We assume all of them together unless you tell us otherwise. Untick any you'd use on its own.",
    visible: (a) => a.consideredCompounds.length >= 2 && a.consideringMultiple === "yes",
    valid: (a) => (a.combinations[0]?.length ?? 0) >= 2,
    error: "Choose at least two compounds to describe a combination.",
  },
  {
    id: "why",
    section: "considering",
    kind: "text",
    field: "whyChosen",
    title: "Why these compounds?",
    help: "What drew you to them? Optional, but it helps us tailor the report.",
    placeholder: "For example: a friend had good results, or I read about a trial",
    maxLength: 600,
    optional: true,
    chips: {
      field: "influence",
      label: "Where did the idea come from?",
      options: fromLabels(INFLUENCE_LABELS),
    },
    valid: () => true,
    isEmpty: (a) => !filled(a.whyChosen) && !(a.influence && a.influence.length > 0),
  },
];

const basics: Step[] = [
  {
    id: "age",
    section: "basics",
    kind: "number",
    field: "age",
    title: "How old are you?",
    help: "This assessment is for adults aged 18 and over.",
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
    help: "Used to calculate BMI, which affects how some compounds are licensed and who they were studied in.",
    valid: (a) => plausibleBody(a.heightCm, a.weightKg),
    error: "Enter a height and weight so we can calculate your BMI.",
  },
  {
    id: "country",
    section: "basics",
    kind: "country",
    title: "Which country do you live in?",
    help: "We show the regulatory status that applies where you live.",
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
    help: "Choose one answer per row. Leave a row as “None” if it doesn't apply.",
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
    help: "Anything new, unexplained, or that a clinician hasn't assessed.",
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
    id: "recreational",
    section: "medications",
    kind: "single",
    field: "recreational",
    title: "Do you use any recreational substances?",
    help: "Why we ask: some substances interact with the compounds in our database or change how safely they can be used. You can choose not to answer.",
    optional: true,
    options: fromLabels(RECREATIONAL_LABELS).map((o) => ({
      ...o,
      followUp: o.value === "occasional" || o.value === "regular",
    })),
    followUp: {
      field: "recreationalDetails",
      when: ["occasional", "regular"],
      label: "Which substances? Optional",
      placeholder: "For example: cannabis at weekends",
    },
    valid: () => true,
    isEmpty: (a) => !a.recreational,
  },
  {
    id: "alcohol",
    section: "medications",
    kind: "single",
    field: "alcohol",
    title: "How much alcohol do you drink?",
    help: "In a typical week.",
    options: fromLabels(ALCOHOL_LABELS),
    valid: (a) => has(a.alcohol),
    error: "Choose one option to continue.",
  },
  {
    id: "nicotine",
    section: "medications",
    kind: "single",
    field: "nicotine",
    title: "Do you use nicotine?",
    help: "Cigarettes, vapes, pouches, patches or gum.",
    options: fromLabels(NICOTINE_LABELS),
    valid: (a) => has(a.nicotine),
    error: "Choose one option to continue.",
  },
];

const experience: Step[] = [
  {
    id: "previous-use",
    section: "experience",
    kind: "yesno",
    field: "previousPeptideUse",
    title: "Have you used a peptide before?",
    help: "Including prescribed medicines such as GLP-1 injections.",
    valid: (a) => has(a.previousPeptideUse),
    error: "Choose yes or no to continue.",
  },
  {
    id: "previous-use-list",
    section: "experience",
    kind: "previous-uses",
    title: "Tell us about what you've used",
    help: "Add each compound separately. Only the name is required.",
    visible: (a) => a.previousPeptideUse === "yes",
    valid: (a) => a.previousUses.length > 0 && a.previousUses.every((u) => filled(u.name)),
    error: "Add at least one compound, with a name for each entry.",
  },
  {
    id: "stopped-ineffective",
    section: "experience",
    kind: "yesno",
    field: "stoppedIneffective",
    title: "Have you previously stopped a treatment because it wasn't effective?",
    help: "Any treatment — not only peptides.",
    valid: (a) => has(a.stoppedIneffective),
    error: "Choose yes or no to continue.",
  },
];

const source: Step[] = [
  {
    id: "source",
    section: "source",
    kind: "single",
    field: "source",
    title: "Where would you obtain the product?",
    options: fromLabels(SOURCE_LABELS).map((o) => ({ ...o, followUp: o.value === "other" })),
    followUp: {
      field: "sourceOtherText",
      when: ["other"],
      label: "Where from?",
      placeholder: "A few words is enough",
    },
    valid: (a) => has(a.source),
    error: "Choose one option to continue.",
  },
  {
    id: "prescribed",
    section: "source",
    kind: "yesno",
    field: "prescribed",
    title: "Has it been prescribed to you?",
    options: YES_NO_NA_OPTIONS,
    valid: (a) => has(a.prescribed),
    error: "Choose one option to continue.",
  },
  {
    id: "authorised",
    section: "source",
    kind: "yesno",
    field: "authorisedKnown",
    title: "Is it authorised for use in your country?",
    help: "Answer as best you know. Your report shows the status from our database either way.",
    options: YES_NO_UNSURE_OPTIONS,
    valid: (a) => has(a.authorisedKnown),
    error: "Choose one option to continue.",
  },
  {
    id: "quality-docs",
    section: "source",
    kind: "yesno",
    field: "qualityDocs",
    title: "Does the supplier provide independent quality documentation?",
    help: "For example a certificate of analysis from an independent laboratory, with batch numbers and expiry dates.",
    options: YES_NO_UNSURE_OPTIONS,
    valid: (a) => has(a.qualityDocs),
    error: "Choose one option to continue.",
  },
];

function riskStep(id: string, field: (typeof RISK_FIELDS)[number], title: string): YesNoStep {
  return {
    id,
    section: "risk",
    kind: "yesno",
    field,
    title,
    hint: (a) => riskHint(id, a),
    valid: (a) => has(a[field]),
    error: "Choose yes or no to continue.",
  };
}

const risk: Step[] = [
  riskStep("serious-allergy", "seriousAllergy", "Have you ever had a serious allergic reaction to a medicine?"),
  riskStep(
    "component-allergy",
    "componentAllergy",
    "Do you have a known allergy to any component of the products you're considering?",
  ),
  riskStep("previous-reaction", "previousSeriousReaction", "Have you previously had a serious reaction to a similar treatment?"),
  riskStep("severe-symptoms", "severeSymptoms", "Do you have any unexplained or severe symptoms at the moment?"),
  riskStep(
    "advised-against",
    "advisedAgainst",
    "Has a healthcare professional advised you not to use this type of treatment?",
  ),
  riskStep("under-investigation", "underInvestigation", "Are you currently under investigation for a relevant condition?"),
  riskStep(
    "interacting-treatment",
    "interactingTreatment",
    "Are you receiving any treatment that could interact with these compounds?",
  ),
  {
    id: "risk-details",
    section: "risk",
    kind: "text",
    field: "riskDetails",
    title: "Would you like to add any detail?",
    help: "You answered yes to at least one safety question. Anything you add here is included in your report so you can share it with a clinician.",
    placeholder: "For example: I was told not to use GLP-1 medicines after pancreatitis in 2021",
    maxLength: 800,
    optional: true,
    visible: (a) => RISK_FIELDS.some((f) => a[f] === "yes"),
    valid: () => true,
    isEmpty: (a) => !filled(a.riskDetails),
  },
];

const wants: Step[] = [
  {
    id: "report-wants",
    section: "wants",
    kind: "wants",
    title: "What would you like your report to tell you?",
    help: "Choose all that apply. Every report covers the essentials; this tells us what to bring forward.",
    valid: (a) => a.reportWants.length > 0,
    error: "Choose at least one to continue.",
  },
  {
    id: "contact",
    section: "wants",
    kind: "contact",
    title: "Would you like a professional review of your report?",
    help: "Optional. Your report is generated on this device whether or not you ask for a review.",
    optional: true,
    valid: (a) => !a.contactConsent || isValidEmail(a.contactEmail),
    isEmpty: (a) => !a.contactConsent,
    error: "Enter a valid email address, or untick the box to continue without a review.",
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
    help: "Check everything looks right. You can edit any section before we generate your report.",
    valid: () => true,
  },
];

export const STEPS_BY_SECTION: Record<SectionId, Step[]> = {
  goals,
  considering,
  basics,
  medical,
  medications,
  experience,
  source,
  risk,
  wants,
  final,
};

/** Flat list in flow order. */
export const STEPS: Step[] = SECTION_ORDER.flatMap((s) => STEPS_BY_SECTION[s]);

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
 * section — or the review screen when skipping the final section.
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
  const currentIdx = SECTION_ORDER.indexOf(resolveStep(a, pos).section);
  return SECTION_ORDER.map((id, index) => {
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
  const n = SECTION_ORDER.indexOf(step.section) + 1;
  return `Section ${n} of ${SECTION_ORDER.length} · ${SECTION_META[step.section].title}`;
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

/** Headline estimate used in marketing copy ("the 7-minute Peptide Checkup"). */
export const ESTIMATED_MINUTES = 7;

const TOTAL_EST = SECTION_ORDER.reduce((sum, id) => sum + SECTION_META[id].estMinutes, 0);

/** Estimated minutes remaining from the current position, scaled to the headline estimate. */
export function minutesRemaining(a: AssessmentAnswers, pos: Position): number {
  const currentIdx = SECTION_ORDER.indexOf(resolveStep(a, pos).section);
  const remaining = SECTION_ORDER.slice(currentIdx).reduce((sum, id) => sum + SECTION_META[id].estMinutes, 0);
  return Math.max(1, Math.round((remaining / TOTAL_EST) * ESTIMATED_MINUTES));
}
