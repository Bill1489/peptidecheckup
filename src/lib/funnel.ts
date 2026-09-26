import type { GoalId } from "@/data/types";
import { GOAL_MAP, type GoalDef } from "@/data/goals";
import { getProductBySlug, type Product } from "@/data/products";
import { BRAND } from "@/lib/brand";

/**
 * Ad-funnel entry points. Each paid-ad creative lands on `/start/[symptom]`,
 * which names the pen(s) the Peptide Checkup most often lands on for that
 * symptom and hands off to `/assessment/?goal=…&symptom=…`.
 *
 * Copy rules (see docs/BRIEF.md §2): calm, honest, second person, British
 * spelling. Never "X will fix Y" — only "researched for" / "the pen the
 * Checkup usually lands on". Where a compound is an authorised medicine
 * elsewhere, say so and say the pen is a research product, not that medicine.
 * The answers decide, including whether to buy at all.
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
    subheadline: `The incretin compounds with the largest weight-loss trials — tirzepatide, semaglutide and liraglutide — are in the range as research pens. They are authorised medicines in other countries; these pens are not those medicines and are not supplied as treatment. The ${CHECKUP} checks whether your history allows any of them, and which the evidence points to.`,
    checks: [
      "Which incretin the trials support for your starting point — weekly tirzepatide or semaglutide, or daily liraglutide — and the size of the effect measured",
      "Conditions that matter for incretin compounds, including thyroid cancer history, pancreatitis, gallbladder disease and diabetic eye disease",
      "Interactions with insulin, sulfonylureas and other glucose-lowering medicines, and with medicines absorbed from the gut",
      "The regulatory position — authorised as a medicine elsewhere, a research product here — and what a clinician would monitor",
    ],
    metaDescription: `Struggling to shift the weight? The ${CHECKUP} checks tirzepatide, semaglutide and liraglutide — research pens, not the licensed medicines — against your history in 7 minutes.`,
    pens: ["tirzepatide", "semaglutide", "liraglutide"],
    penNote:
      "Tirzepatide, semaglutide and liraglutide have large randomised trials for weight and are authorised medicines in several countries. The pens in the range are research products of the same compounds, not the licensed medicines, and the Checkup says so on the result.",
  },
  {
    slug: "fat-loss",
    goalId: "fat_loss",
    label: "Fat loss & body composition",
    subheadline: `Body-composition claims are everywhere; controlled human data is rare. Tesamorelin has it — for visceral fat in a defined population — and tirzepatide has it for weight, with fat mass measured in a sub-study. The ${CHECKUP} separates what the trials showed from what the adverts say, then checks your own history against it.`,
    checks: [
      "What the Tesamorelin trials measured — visceral fat by CT in a defined population — against what the tirzepatide trials measured, and how each maps onto your goal",
      "Whether your timeframe is realistic against the trial durations",
      "Medical history and medicines that change suitability, including hormonal, thyroid and metabolic conditions",
      "Anti-doping status if you compete — Tesamorelin is prohibited — and the regulatory position of each pen",
    ],
    metaDescription: `Training hard but not seeing the change? The ${CHECKUP} checks Tesamorelin’s and tirzepatide’s body-composition evidence against your history in 7 minutes.`,
    pens: ["tesamorelin", "tirzepatide"],
    penNote:
      "Both compounds have controlled human evidence, for different measures: Tesamorelin for visceral fat in a specific population, tirzepatide for weight — with fat mass measured in a sub-study and graded lower. Both are authorised medicines elsewhere; the pens are research products, not those medicines.",
  },
  {
    slug: "muscle",
    goalId: "muscle_recovery",
    label: "Muscle & recovery",
    subheadline: `Nothing here builds muscle, and the growth-hormone-axis pens in the range have only early human data. For recovery, the ${CHECKUP} usually lands on Wolverine (BPC-157 + TB-500) for tissue repair or NAD+ for cellular energy — both graded honestly, both with thin human data.`,
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
    subheadline: `The best-known repair peptides have animal data and no human efficacy trials. The ${CHECKUP} usually lands on Wolverine (BPC-157 + TB-500) for a tendon, ligament or muscle injury, or on BPC-157 or TB-500 alone where one compound is the interest — and shows exactly where the evidence stands for each.`,
    checks: [
      "Whether your injury is tendon, ligament or muscle, and whether the blend or a single compound is the better fit for the question you have",
      "Factors in your history that matter for tissue-repair compounds, including cancer history and active infection",
      "Regulatory status — BPC-157 and TB-500 are not authorised as medicines in any jurisdiction",
      "Anti-doping status, and the questions to take to a physiotherapist or clinician first",
    ],
    metaDescription: `Nagging injury that won’t heal? The ${CHECKUP} checks Wolverine, BPC-157 and TB-500 against the evidence and your history — and says when not to buy.`,
    pens: ["wolverine", "bpc-157", "tb-500"],
    penNote:
      "BPC-157 and TB-500 have animal data and no human efficacy trials, alone or together; the blend has not been studied in people as a combination. The evidence record says so, the product page says so, and the Checkup grades it accordingly.",
  },
  {
    slug: "skin",
    goalId: "skin_cosmetic",
    label: "Skin & cosmetic",
    subheadline: `GHK-Cu has decades of topical cosmetic data and no human trials by injection. The ${CHECKUP} usually lands on the GHK-Cu pen for firmness and texture, Glow where surface remodelling is the interest, or Klow where slow-healing marks, scars or irritation are part of it — and tells you which kind of evidence you are relying on.`,
    checks: [
      "Whether your goal is firmness and texture (GHK-Cu), skin plus remodelling (Glow) or skin plus repair and inflammation (Klow)",
      "The difference between a cosmetic ingredient and an unlicensed injectable in your country",
      "Skin conditions, melanoma history and medicines that change the picture",
      "Better-evidenced options a dermatologist is likely to raise first",
    ],
    metaDescription: `Want your skin to look how you feel? The ${CHECKUP} checks GHK-Cu, Glow and Klow against the evidence and your history in 7 minutes — and says if none fits.`,
    pens: ["ghk-cu", "glow", "klow"],
    penNote:
      "The controlled GHK-Cu studies are topical. An injectable pen is supplied for research use and graded on that basis; neither blend has been studied in people as a combination.",
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
    subheadline: `One pen in the range is researched for desire and arousal: PT-141 (bremelanotide), a melanocortin agonist licensed in the United States for low desire in premenopausal women and not authorised elsewhere. The pen is a research product, not that medicine. The ${CHECKUP} checks whether the trial population and your history line up — and says when a clinician is the right first call.`,
    checks: [
      "Whether your situation resembles the population PT-141 was trialled in — desire in premenopausal women — or falls outside it, where the evidence is thin",
      "Cardiovascular history and blood-pressure medicines: PT-141 raises blood pressure transiently and is not for uncontrolled hypertension",
      "Interactions with PDE5 inhibitors, nitrates and other medicines a clinician would ask about",
      "The regulatory position — a licensed medicine in one country, a research product here — and the licensed options a clinician may raise instead",
    ],
    metaDescription: `Libido not what it was? The ${CHECKUP} checks PT-141 — licensed in the US, a research pen here — against the trial evidence and your history, and says when to see a clinician instead.`,
    pens: ["pt-141"],
    penNote:
      "PT-141 has randomised trial data for desire in premenopausal women and is licensed for that in the United States only. Outside that population the evidence is thin, and the Checkup says so rather than stretching the trial to fit.",
  },
  {
    slug: "sleep",
    goalId: "sleep",
    label: "Sleep",
    subheadline: `The only pen in the range listed for sleep is Epitalon, and its sleep and circadian data come from animal studies and uncontrolled human reports — nothing that would count as evidence in a clinic. The ${CHECKUP} shows that grade before anything else, and will point you to a clinician rather than sell you something adjacent.`,
    checks: [
      "What the Epitalon record actually contains for sleep — animal and uncontrolled human data, no randomised trials — and what that grade means",
      "Sleep apnoea, mental-health history and sedating medicines that a clinician would ask about first",
      "Interactions between sleep aids, antidepressants and alcohol",
      "The established options a clinician is likely to raise before any research compound",
    ],
    metaDescription: `Tired of waking up tired? The one pen listed for sleep — Epitalon — has early, uncontrolled evidence only; the ${CHECKUP} says so and maps your history against it.`,
    pens: ["epitalon"],
    penNote:
      "Epitalon is graded Insufficient: animal and uncontrolled human data only, no randomised trials for sleep or anything else. Expect the Checkup to be cautious and to end at a clinician more often than at this pen.",
  },
  {
    slug: "longevity",
    goalId: "longevity",
    label: "Longevity",
    subheadline: `Longevity is where marketing runs furthest ahead of evidence. Three pens in the range are researched for healthy ageing — NAD+, MOTS-C and Epitalon — with early human data at best. The ${CHECKUP} shows the grade before it shows the pen.`,
    checks: [
      "What human data exists for NAD+, MOTS-C and Epitalon — oral precursors, small intravenous studies, animal models, uncontrolled reports — and what does not",
      "Cardiovascular, metabolic and cancer history that changes the picture",
      "Interactions with long-term medicines such as statins, blood-pressure and diabetes medicines",
      "Anti-doping status of MOTS-C, and questions to ask a clinician about monitoring",
    ],
    metaDescription: `Serious about ageing well? The ${CHECKUP} checks NAD+, MOTS-C and Epitalon against the evidence and your history — and says how early that evidence is.`,
    pens: ["nad", "mots-c", "epitalon"],
    penNote:
      "Human evidence for NAD+ exists mainly for oral precursors and small intravenous studies; MOTS-C and Epitalon have animal data and little else. None has outcome data for ageing in people, and the Checkup says so.",
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
  { title: "Weight that won’t shift", symptom: "weight", pen: "tirzepatide", line: 0 },
  { title: "Tired all the time", symptom: "tired", pen: "nad", line: 0 },
  { title: "A tendon that won’t settle", symptom: "recovery", pen: "wolverine", line: 0 },
  { title: "Skin firmness and texture", symptom: "skin", pen: "ghk-cu", line: 0 },
  { title: "Libido that’s dropped", symptom: "libido", pen: "pt-141", line: 0 },
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
