import type { Compound } from "../types";

/**
 * Elamipretide (SS-31, Bendavia, Forzinity) — mitochondria-targeting
 * tetrapeptide that binds cardiolipin. FDA accelerated approval (September
 * 2025) for Barth syndrome in patients weighing at least 30 kg; phase 3 trials
 * in mitochondrial myopathy, dry AMD and heart failure missed their primary
 * endpoints. No authorisation outside the United States.
 */
export const elamipretide: Compound = {
  slug: "elamipretide",
  name: "Elamipretide",
  aliases: ["SS-31", "Forzinity", "Bendavia", "MTP-131", "D-Arg-Dmt-Lys-Phe-NH2"],
  family: "longevity_metabolic",
  classLabel: "Mitochondria-targeting tetrapeptide (cardiolipin binder)",
  tagline: "Mitochondrial peptide approved for one rare disease; negative trials elsewhere",
  summary:
    "Elamipretide is a synthetic tetrapeptide that concentrates in the inner mitochondrial membrane and binds cardiolipin, with the aim of stabilising the electron transport chain and improving energy production. In September 2025 the FDA granted it accelerated approval as Forzinity to improve muscle strength in people with Barth syndrome weighing at least 30 kg — a rare genetic mitochondrial disease — based on an intermediate endpoint, with a confirmatory trial required. Phase 3 trials in primary mitochondrial myopathy, dry age-related macular degeneration and heart failure did not meet their primary endpoints, and there are no studies in healthy adults.",
  mechanism:
    "Binds cardiolipin in the inner mitochondrial membrane, which is proposed to preserve cristae structure, improve coupling of the electron transport chain, increase ATP production and reduce the formation of reactive oxygen species. Whether these effects translate into clinical benefit has only been accepted by a regulator for Barth syndrome, and then on an intermediate endpoint.",
  goals: [
    {
      goal: "longevity",
      evidence: "insufficient",
      summary:
        "Mitochondrial decline is a proposed driver of ageing, but elamipretide has never been studied for healthy ageing. Its approved indication is a rare genetic disease, and the largest trial in acquired mitochondrial myopathy (n = 218) was negative on its primary endpoints.",
    },
    {
      goal: "athletic_performance",
      evidence: "insufficient",
      summary:
        "No studies in athletes or healthy adults. In primary mitochondrial myopathy, 24 weeks of 40 mg daily did not improve six-minute walk distance versus placebo (MMPOWER-3).",
    },
    {
      goal: "muscle_recovery",
      evidence: "insufficient",
      summary:
        "The approved indication is muscle strength in Barth syndrome, based on knee-extensor strength in 12 patients. This does not extend to muscle recovery or growth in people without mitochondrial disease.",
    },
    {
      goal: "general_wellbeing",
      evidence: "insufficient",
      summary:
        "Fatigue scores did not improve versus placebo in the phase 3 mitochondrial myopathy trial; there are no data on energy or fatigue in people without a mitochondrial disorder.",
    },
  ],
  overallEvidence: "limited",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "No MHRA marketing authorisation; available only in clinical trials or via unlicensed routes.",
      detail:
        "The MHRA agreed a paediatric investigation plan for elamipretide in Barth syndrome in January 2026 (applicant Atnahs Pharma UK), which is a development step, not a licence. No marketing authorisation had been granted at the time of this review.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "authorised",
      summary: "FDA accelerated approval (Forzinity) for Barth syndrome in patients weighing ≥ 30 kg; prescription-only.",
      detail:
        "Approved on 19 September 2025 under the accelerated-approval pathway to improve muscle strength in adult and paediatric patients with Barth syndrome weighing at least 30 kg, based on improvement in knee-extensor muscle strength (an intermediate endpoint). Continued approval depends on a confirmatory randomised trial. The recommended dose is 40 mg subcutaneously once daily, halved in adults with severe renal impairment. It is not approved for any other condition; an earlier application in primary mitochondrial myopathy was withdrawn after MMPOWER-3 failed.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EU marketing authorisation; holds orphan designation for Barth syndrome (2021).",
      detail:
        "The European Commission granted orphan designation (EU/3/21/2430) for the treatment of Barth syndrome on 20 May 2021. Orphan designation does not mean the medicine is authorised or available; no marketing authorisation had been granted at the time of this review.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not on the Australian Register of Therapeutic Goods.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not approved by Health Canada at the time of this review.",
      detail: "Regulatory review outside the US has been reported as ongoing; verify current status with Health Canada.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "No authorisations outside the United States are known; check your national regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous", "intravenous"],
  dosingResearch: [
    {
      title: "TAZPOWER — elamipretide in Barth syndrome (the approval trial)",
      citation: "Reid Thompson W et al., Genet Med 2021;23:471–478",
      year: 2021,
      phase: "Phase 2/3",
      design: "Randomised, double-blind, placebo-controlled crossover (two 12-week periods, 4-week washout) followed by an open-label extension",
      population: "Genetically confirmed Barth syndrome, aged ≥ 12 years, weighing > 30 kg",
      n: 12,
      duration: "12 weeks per crossover period; open-label extension to 168 weeks or more",
      doses: "40 mg once daily by subcutaneous injection",
      route: "subcutaneous",
      outcome:
        "The crossover part did not meet its primary endpoints (six-minute walk distance and fatigue score). Improvements in walk distance, fatigue and knee-extensor strength were reported during the uncontrolled open-label extension from week 36 onwards, and the FDA accepted knee-extensor strength as an intermediate endpoint for accelerated approval.",
      adverseEvents:
        "Injection-site reactions in essentially all participants (erythema 100% vs 25% on placebo; pain 75% vs 42%; induration and pruritus 67% vs 17%; bruising and urticaria 25% vs 0%).",
      exposure: { doseMin: 40, doseMax: 40, unit: "mg", frequency: "daily", route: "subcutaneous" },
    },
    {
      title: "MMPOWER-3 — elamipretide in primary mitochondrial myopathy",
      citation: "Karaa A et al., Neurology 2023;101:e238–e252",
      year: 2023,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults with genetically confirmed primary mitochondrial myopathy (74% mtDNA, 26% nuclear DNA defects)",
      n: 218,
      duration: "24 weeks",
      doses: "40 mg once daily by subcutaneous injection",
      route: "subcutaneous",
      outcome:
        "Did not meet either primary endpoint: six-minute walk distance difference −3.2 m versus placebo (95% CI −18.7 to 12.3) and no difference in total fatigue score. A pre-specified subgroup with nuclear DNA defects showed improvement in walk distance, prompting further study.",
      adverseEvents: "Most adverse events mild to moderate; injection-site reactions were the most frequent. Treatment was described as well tolerated.",
      exposure: { doseMin: 40, doseMax: 40, unit: "mg", frequency: "daily", route: "subcutaneous" },
      url: "https://doi.org/10.1212/WNL.0000000000207402",
    },
    {
      title: "ReCLAIM-2 — elamipretide in dry age-related macular degeneration",
      citation: "Ophthalmology 2025 (published online November 2024); NCT03891875",
      year: 2024,
      phase: "Phase 2",
      design: "Randomised (2:1), double-masked, placebo-controlled, multicentre",
      population: "Adults ≥ 55 years with dry AMD and non-central geographic atrophy",
      n: 176,
      duration: "48 weeks",
      doses: "40 mg once daily by subcutaneous injection",
      route: "subcutaneous",
      outcome:
        "Primary endpoints (low-luminance visual acuity and geographic atrophy area) were not met. Progression of ellipsoid-zone attenuation was reduced by about 43–47% and more patients gained ≥ 10 letters (14.6% vs 2.1%) — nominal, secondary findings.",
      adverseEvents: "Adverse events in 86% of elamipretide versus 71% of placebo participants, most commonly injection-site reactions (pruritus, pain, bruising, erythema).",
      exposure: { doseMin: 40, doseMax: 40, unit: "mg", frequency: "daily", route: "subcutaneous" },
      url: "https://pubmed.ncbi.nlm.nih.gov/39605874/",
    },
  ],
  dosingResearchNote:
    "Every trial used pharmaceutical-grade elamipretide at 40 mg subcutaneously once daily (or intravenous infusion in early cardiac studies) in people with a diagnosed mitochondrial, retinal or cardiac disease. No study has examined 'SS-31' in healthy adults, athletes or for ageing, and 'research chemical' vials are not the approved product.",
  contraindications: [
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Exposure rises by up to 125% in severe renal impairment; the US label halves the dose (20 mg daily) at eGFR < 30 mL/min and gives no recommendation for people on dialysis.",
    },
  ],
  interactions: [
    {
      classId: "nsaid",
      severity: "minor",
      note: "No clinically significant pharmacokinetic interactions are identified in the US label. Because exposure depends on kidney function, medicines that can reduce renal function are a theoretical consideration only.",
    },
    {
      classId: "diuretic",
      severity: "minor",
      note: "No interaction identified in the label; listed only because dehydration or reduced kidney function would be expected to raise elamipretide exposure.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human data. Animal studies at the exposures tested did not show adverse developmental effects, but the US label notes the absence of adequate data in pregnancy and breastfeeding. The product contains benzyl alcohol and must not be used in neonates.",
  },
  commonAdverseEffects: [
    "Injection-site erythema (redness) — reported in all Barth syndrome trial participants",
    "Injection-site pain, induration, itching, bruising or hives",
    "Dizziness",
    "Headache",
    "Nausea",
  ],
  seriousAdverseEffects: [
    "Hypersensitivity reactions (serious hypersensitivity is the only labelled contraindication)",
    "Benzyl alcohol toxicity in neonates ('gasping syndrome') — the approved formulation contains a preservative",
    "Accumulation in severe kidney impairment without dose adjustment",
    "Unknown long-term effects in people without mitochondrial disease — no data",
  ],
  monitoring: [
    "Kidney function (eGFR) before starting and periodically, with dose adjustment if impaired",
    "Injection sites — rotate daily and watch for persistent reactions",
    "An objective functional outcome agreed in advance (for example a timed walk or strength test)",
    "Any signs of hypersensitivity after injection",
    "Fatigue and exercise tolerance recorded against a baseline",
  ],
  sourceConsiderations: [
    "In the US, Forzinity is a prescription-only medicine supplied for Barth syndrome; it is not available for wellness or performance use.",
    "'SS-31' vials sold online as research chemicals are not the approved product and lack the quality assurance, preservative system and concentration (80 mg/mL) of Forzinity.",
    "Outside the US there is no authorised product; anything offered is unlicensed and unverified.",
  ],
  clinicianQuestions: [
    "Do I have a diagnosed mitochondrial disorder, or is my interest in 'mitochondrial support' for general fatigue?",
    "How should the negative phase 3 results in mitochondrial myopathy, AMD and heart failure inform expectations for my goal?",
    "How is my kidney function, and would the labelled dose adjustment apply to me?",
    "What would daily injections for months realistically involve in terms of injection-site reactions?",
    "Which fatigue causes with authorised treatments — thyroid, iron, sleep, mood — should be excluded first?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "mots-c",
      evidence: "none",
      overlap: "Both are mitochondria-targeted peptides.",
      note: "No human data on combining them; elamipretide's approved use is a rare mitochondrial disease and MOTS-c has no human efficacy data.",
    },
    {
      with: "epitalon",
      evidence: "none",
      overlap: "Both are marketed as 'cellular ageing' peptides.",
      note: "No human data on the combination; neither has evidence for healthy ageing.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "No human data on this combination; BPC-157 itself lacks human efficacy data.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      note: "Marketed together in 'energy and recovery' stacks; no human data on the combination.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Mitochondria-targeting tetrapeptide (cardiolipin binder)" },
    { label: "Route", value: "Daily subcutaneous injection" },
    { label: "Approved use", value: "Barth syndrome ≥ 30 kg — US accelerated approval, Sept 2025" },
    { label: "Trial participants", value: "> 450 across phase 2/3 programmes; primary endpoints mostly not met" },
    { label: "Prescription", value: "Required in the US; not authorised in UK, EU, AU or CA" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "FDA news release — Accelerated approval of Forzinity for Barth syndrome (19 September 2025)", url: "https://www.fda.gov/news-events/press-announcements/fda-grants-accelerated-approval-first-treatment-barth-syndrome" },
    { label: "Forzinity (elamipretide) US Prescribing Information (2025)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/215244s000lbl.pdf" },
    { label: "Reid Thompson W et al. TAZPOWER — elamipretide in Barth syndrome. Genet Med 2021;23:471–478" },
    { label: "Karaa A et al. MMPOWER-3 — elamipretide in primary mitochondrial myopathy. Neurology 2023", url: "https://doi.org/10.1212/WNL.0000000000207402" },
    { label: "ReCLAIM-2 — elamipretide in dry AMD. Ophthalmology 2025", url: "https://pubmed.ncbi.nlm.nih.gov/39605874/" },
    { label: "EMA orphan designation EU/3/21/2430 — elamipretide for Barth syndrome", url: "https://www.ema.europa.eu/en/medicines/human/orphan-designations/eu-3-21-2430" },
  ],
};
