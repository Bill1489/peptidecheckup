import type { GoalId } from "@/data/types";
import { GOAL_MAP, type GoalDef } from "@/data/goals";
import { getProductBySlug, type Product } from "@/data/products";
import { BRAND } from "@/lib/brand";

/**
 * Ad-funnel entry points. Each paid-ad creative lands on `/start/[symptom]`,
 * which names the pen(s) the Peptide Checkup most often lands on for that
 * symptom and hands off to `/assessment/?goal=…&symptom=…`.
 *
 * Copy rules (see docs/BRIEF.md §2): calm, honest, second person, UK English.
 * Never "X will fix Y" — only "researched for" / "the pen the Checkup usually
 * lands on". The answers decide, including whether to buy at all.
 */
export interface SymptomDef {
  /** URL slug used in `/start/[symptom]` and passed to the assessment as `symptom`. */
  slug: string;
  goalId: GoalId;
  /** Short human label for lists and footers. */
  label: string;
  /** One honest paragraph shown under the goal's funnel headline. */
  subheadline: string;
  /** What the assessment checks for this goal — exactly four bullets. */
  checks: readonly [string, string, string, string];
  /** Meta description for the landing page (≤ 160 characters). */
  metaDescription: string;
  /**
   * Product slugs the Checkup most often lands on for this symptom, most
   * likely first. Empty when nothing in the range is researched for it — the
   * page then says so and still offers the assessment.
   */
  pens: string[];
  /** One honest sentence about the evidence behind those pens (or the lack of a pen). */
  penNote: string;
}

const CHECKUP = BRAND.assessmentName;

export const SYMPTOMS: readonly SymptomDef[] = [
  {
    slug: "tired",
    goalId: "general_wellbeing",
    label: "Energy & wellbeing",
    subheadline: `Fatigue has many causes and most of them are not peptides. The ${CHECKUP} maps your answers against the two pens in the range researched for energy — NAD+ and MOTS-C — and says which, if either, it can stand behind.`,
    checks: [
      "Whether NAD+ or MOTS-C has human evidence for energy, recovery or day-to-day wellbeing — and how thin that evidence is",
      "Conditions and medicines in your history that change the picture, including thyroid, sleep and mental-health factors",
      "Whether you compete in tested sport — MOTS-C is named on the WADA Prohibited List",
      "The common causes of fatigue worth ruling out with a clinician before you spend anything",
    ],
    metaDescription: `Tired all the time? The 7-minute ${CHECKUP} checks your history and medicines against the evidence for NAD+ and MOTS-C — and says if neither fits.`,
    pens: ["nad", "mots-c"],
    penNote:
      "NAD+ is a coenzyme, not a peptide, and the controlled human data for injected NAD+ is thin; MOTS-C has been studied almost entirely in animal and cell models. The Checkup shows both grades before it lands anywhere.",
  },
  {
    slug: "weight",
    goalId: "weight_management",
    label: "Weight management",
    subheadline: `There is no incretin medicine in the range and we do not pretend otherwise. One pen — Tesamorelin — has human trial data for body composition, measured as visceral fat rather than scale weight. The ${CHECKUP} checks whether that is what you actually want, and whether your history allows it.`,
    checks: [
      "Whether your goal is scale weight or body composition — the Tesamorelin trials measured visceral fat, not weight",
      "Conditions that matter for a GHRH analogue, including active cancer, diabetes and pituitary history",
      "Interactions with glucose-lowering medicines, corticosteroids and hormones",
      "Anti-doping status if you compete, and the regulatory position of an unlicensed pen in your country",
    ],
    metaDescription: `Struggling to shift the weight? The ${CHECKUP} checks whether Tesamorelin — the one pen in the range with body-composition trials — fits your history, or says not.`,
    pens: ["tesamorelin"],
    penNote:
      "Tesamorelin’s trials measured abdominal fat in a specific population; they did not measure weight loss in the general population. If scale weight is the goal, the Checkup will say the range is not the answer.",
  },
  {
    slug: "fat-loss",
    goalId: "fat_loss",
    label: "Fat loss & body composition",
    subheadline: `Body-composition claims are everywhere; controlled human data is rare. Tesamorelin has it — for visceral fat in a defined population. The ${CHECKUP} separates what the trials showed from what the adverts say, then checks your own history against it.`,
    checks: [
      "What the Tesamorelin trials measured — visceral fat by CT in a defined population — and how that maps onto your goal",
      "Whether your timeframe is realistic against the trial durations",
      "Medical history and medicines that change suitability, including hormonal and metabolic conditions",
      "Anti-doping status if you compete, and regulatory status in your country",
    ],
    metaDescription: `Training hard but not seeing the change? The ${CHECKUP} checks Tesamorelin’s body-composition evidence against your history in 7 minutes.`,
    pens: ["tesamorelin"],
    penNote:
      "Tesamorelin has the strongest human evidence in the range. That is a statement about the compound, not a promise about you; the Checkup grades the fit and lists what to review before you buy.",
  },
  {
    slug: "muscle",
    goalId: "muscle_recovery",
    label: "Muscle & recovery",
    subheadline: `Nothing in the range is a growth-hormone secretagogue and nothing here builds muscle. For recovery, the ${CHECKUP} usually lands on Wolverine (BPC-157 + TB-500) for tissue repair or NAD+ for cellular energy — both graded honestly, both with thin human data.`,
    checks: [
      "Whether recovery means tissue repair (Wolverine) or energy and fatigue (NAD+) — the two are matched differently",
      "Conditions that matter for repair peptides, including cancer history and active infection",
      "Interactions with hormones, corticosteroids and glucose-lowering medicines",
      "Anti-doping status — BPC-157 and TB-500 are prohibited in tested sport",
    ],
    metaDescription: `Recovery taking longer than it used to? The ${CHECKUP} checks Wolverine and NAD+ against your history and the evidence — and says when neither fits.`,
    pens: ["wolverine", "nad"],
    penNote:
      "BPC-157 and TB-500 have extensive animal data on tendon and muscle repair and no human efficacy trials; NAD+ has limited controlled data by injection. The Checkup shows the grade before it shows the pen.",
  },
  {
    slug: "performance",
    goalId: "athletic_performance",
    label: "Athletic performance",
    subheadline: `Most compounds marketed for performance are prohibited in sport and few have human data. MOTS-C is both: WADA-listed, and studied for exercise capacity almost entirely in animals. If you compete in tested sport the ${CHECKUP} will not land on it.`,
    checks: [
      "Whether you compete in tested sport — MOTS-C, BPC-157, TB-500 and Tesamorelin are all prohibited under the WADA Code",
      "The human evidence for endurance and output, separated from animal and laboratory data",
      "Cardiovascular, metabolic and hormonal factors in your history that would raise concern",
      "Regulatory status and source considerations for an unlicensed pen in your country",
    ],
    metaDescription: `Chasing the next performance edge? The ${CHECKUP} checks MOTS-C against anti-doping rules, the evidence and your history — and says no to tested athletes.`,
    pens: ["mots-c"],
    penNote:
      "MOTS-C is named on the WADA Prohibited List. Say you are a tested athlete and the verdict is not recommended — nothing goes in your cart.",
  },
  {
    slug: "recovery",
    goalId: "injury_recovery",
    label: "Injury & recovery",
    subheadline: `The best-known repair peptides have animal data and no human efficacy trials. The ${CHECKUP} usually lands on Wolverine (BPC-157 + TB-500) for a tendon, ligament or muscle injury, or Klow where skin and inflammation are part of the picture — and shows exactly where the evidence stands for each.`,
    checks: [
      "Whether your injury is tendon, ligament or muscle (Wolverine) or involves skin, scarring or inflammation (Klow)",
      "Factors in your history that matter for tissue-repair compounds, including cancer history and active infection",
      "Regulatory status — BPC-157 and TB-500 are not authorised as medicines in any jurisdiction",
      "Anti-doping status, and the questions to take to a physiotherapist or clinician first",
    ],
    metaDescription: `Nagging injury that won’t heal? The ${CHECKUP} checks Wolverine and Klow against the evidence and your history — and says when not to buy.`,
    pens: ["wolverine", "klow"],
    penNote:
      "Neither blend has been studied in people as a combination. The evidence record says so, the product page says so, and the Checkup grades it accordingly.",
  },
  {
    slug: "skin",
    goalId: "skin_cosmetic",
    label: "Skin & cosmetic",
    subheadline: `GHK-Cu has decades of topical cosmetic data and no human trials by injection. The ${CHECKUP} usually lands on the GHK-Cu pen for firmness and texture, or Klow where slow-healing marks, scars or irritation are part of it — and tells you which kind of evidence you are relying on.`,
    checks: [
      "Whether your goal is firmness and texture (GHK-Cu) or skin plus repair and inflammation (Klow)",
      "The difference between a cosmetic ingredient and an unlicensed injectable in your country",
      "Skin conditions, melanoma history and medicines that change the picture",
      "Better-evidenced options a dermatologist is likely to raise first",
    ],
    metaDescription: `Want your skin to look how you feel? The ${CHECKUP} checks GHK-Cu and Klow against the evidence and your history in 7 minutes — and says if neither fits.`,
    pens: ["ghk-cu", "klow"],
    penNote: "The controlled GHK-Cu studies are topical. An injectable pen is supplied for research use and graded on that basis.",
  },
  {
    slug: "hair",
    goalId: "hair",
    label: "Hair",
    subheadline: `Hair loss has established, licensed treatments; peptides are not among them. GHK-Cu has preliminary topical hair studies and nothing by injection. The ${CHECKUP} shows that honestly and says what to take to a clinician.`,
    checks: [
      "What GHK-Cu has actually shown for hair — small topical studies — and what it has not",
      "How that compares with established, licensed treatments",
      "Hormonal, thyroid and autoimmune factors in your history that a clinician would want to know about",
      "Regulatory status of an injectable pen, and what to ask a dermatologist",
    ],
    metaDescription: `Noticing more hair in the brush? The ${CHECKUP} checks GHK-Cu’s hair evidence honestly against your history — and points you to a clinician where it should.`,
    pens: ["ghk-cu"],
    penNote: "GHK-Cu is the only pen in the range with any hair data, and that data is topical and preliminary. Expect the Checkup to be cautious.",
  },
  {
    slug: "libido",
    goalId: "sexual_health",
    label: "Sexual health",
    subheadline: `Nothing in the ${BRAND.displayName} range is researched for libido or sexual function, and the ${CHECKUP} will tell you so. Take it anyway: the report still maps your history and medicines against the evidence and says what is worth raising with a clinician.`,
    checks: [
      "Confirmation that no pen in the range has evidence for libido, arousal or sexual function",
      "Cardiovascular history and blood-pressure medicines, which matter for the licensed options a clinician may raise",
      "Interactions with PDE5 inhibitors, nitrates and other medicines",
      "The licensed treatments and the questions worth taking to a doctor",
    ],
    metaDescription: `Libido not what it was? Nothing in the range is researched for this — the ${CHECKUP} says so, then maps your history against the evidence for a clinician.`,
    pens: [],
    penNote: "No pen. The Checkup ends with the evidence and a list of questions for a clinician, not a product.",
  },
  {
    slug: "sleep",
    goalId: "sleep",
    label: "Sleep",
    subheadline: `Nothing in the ${BRAND.displayName} range is researched for sleep, and the ${CHECKUP} will tell you so rather than sell you something adjacent. The report still flags what in your history matters and points to what a clinician would look at first.`,
    checks: [
      "Confirmation that no pen in the range has evidence for falling asleep, staying asleep or sleep quality",
      "Sleep apnoea, mental-health history and sedating medicines that a clinician would ask about",
      "Interactions between sleep aids, antidepressants and alcohol",
      "The established options a clinician is likely to raise first",
    ],
    metaDescription: `Tired of waking up tired? Nothing in the range is researched for sleep — the ${CHECKUP} says so and maps your history against the evidence instead.`,
    pens: [],
    penNote: "No pen. If sleep is the problem, the honest output is a list of questions for a clinician.",
  },
  {
    slug: "longevity",
    goalId: "longevity",
    label: "Longevity",
    subheadline: `Longevity is where marketing runs furthest ahead of evidence. Two pens in the range are researched for healthy ageing — NAD+ and MOTS-C — with early human data at best. The ${CHECKUP} shows the grade before it shows the pen.`,
    checks: [
      "What human data exists for NAD+ and MOTS-C — oral precursors, small intravenous studies, animal models — and what does not",
      "Cardiovascular, metabolic and cancer history that changes the picture",
      "Interactions with long-term medicines such as statins, blood-pressure and diabetes medicines",
      "Anti-doping status of MOTS-C, and questions to ask a clinician about monitoring",
    ],
    metaDescription: `Serious about ageing well? The ${CHECKUP} checks NAD+ and MOTS-C against the evidence and your history — and says how early that evidence is.`,
    pens: ["nad", "mots-c"],
    penNote:
      "Human evidence for NAD+ exists mainly for oral precursors and small intravenous studies; MOTS-C has animal data. Neither has outcome data for ageing in people, and the Checkup says so.",
  },
];

const BY_SLUG: Record<string, SymptomDef> = Object.fromEntries(SYMPTOMS.map((s) => [s.slug, s]));

export function getSymptom(slug: string): SymptomDef | undefined {
  return BY_SLUG[slug];
}

/** The goal definition behind a symptom entry point. */
export function goalForSymptom(symptom: SymptomDef): GoalDef {
  return GOAL_MAP[symptom.goalId];
}

/** The pens the Checkup usually lands on for a symptom, resolved against the catalogue (unknown slugs are dropped). */
export function pensForSymptom(symptom: SymptomDef): Product[] {
  return symptom.pens.map((slug) => getProductBySlug(slug)).filter((p): p is Product => p !== undefined);
}

/** Assessment URL with the goal pre-selected and the ad creative recorded. */
export function assessmentHref(symptom?: SymptomDef): string {
  if (!symptom) return "/assessment";
  return `/assessment/?goal=${symptom.goalId}&symptom=${symptom.slug}`;
}

/* ------------------------------------------------------------------ */
/* "Start from the problem" — home-page cells                          */
/* ------------------------------------------------------------------ */

interface ProblemDef {
  /** Short problem statement used as the cell headline. */
  title: string;
  /** Symptom entry point the cell hands off to (goal + symptom params). */
  symptom: string;
  /** Product slug the Checkup usually lands on for this problem. */
  pen: string;
  /** Index into that pen's `matchFor` lines — the catalogue's own phrasing of the problem. */
  line: number;
}

const PROBLEMS: readonly ProblemDef[] = [
  { title: "Belly fat that won’t move", symptom: "fat-loss", pen: "tesamorelin", line: 0 },
  { title: "Tired all the time", symptom: "tired", pen: "nad", line: 0 },
  { title: "A tendon that won’t settle", symptom: "recovery", pen: "wolverine", line: 0 },
  { title: "Skin firmness and texture", symptom: "skin", pen: "ghk-cu", line: 0 },
  { title: "Slow recovery", symptom: "muscle", pen: "nad", line: 1 },
  { title: "Healthy ageing", symptom: "longevity", pen: "mots-c", line: 1 },
];

export interface ResolvedProblem {
  title: string;
  symptom: SymptomDef;
  goal: GoalDef;
  product: Product;
  /** The pen's own problem statement from the catalogue. */
  matchLine: string;
  href: string;
}

/** Resolve the problem cells against the funnel and the catalogue; anything that no longer exists is dropped. */
export function resolveProblems(): ResolvedProblem[] {
  return PROBLEMS.flatMap((p) => {
    const symptom = getSymptom(p.symptom);
    const product = getProductBySlug(p.pen);
    if (!symptom || !product) return [];
    return [
      {
        title: p.title,
        symptom,
        goal: goalForSymptom(symptom),
        product,
        matchLine: product.matchFor[p.line] ?? product.matchFor[0] ?? product.bestFor,
        href: assessmentHref(symptom),
      },
    ];
  });
}
