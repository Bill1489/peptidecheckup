import type { Compound } from "../types";

/**
 * MOTS-c — mitochondrial-derived peptide encoded in the 12S rRNA gene of
 * mitochondrial DNA. Strong mouse data on insulin sensitivity and exercise
 * capacity; the only human interventional data are for an analogue (CB4211).
 * Explicitly named on the WADA Prohibited List (S4.4 metabolic modulators).
 */
export const motsC: Compound = {
  slug: "mots-c",
  name: "MOTS-c",
  aliases: ["MOTS-C", "Mitochondrial open reading frame of the 12S rRNA-c", "Mitochondrial-derived peptide", "CB4211 (analogue)"],
  family: "longevity_metabolic",
  classLabel: "Mitochondrial-derived 16-amino-acid peptide",
  tagline: "Mitochondrial 'exercise mimetic' peptide: mouse data only, WADA-prohibited",
  summary:
    "MOTS-c is a 16-amino-acid peptide encoded within the mitochondrial genome that acts as a metabolic signalling molecule. In mice it improves insulin sensitivity, prevents diet-induced obesity and increases exercise capacity, including in old animals. In humans, circulating levels change with age and exercise, and an analogue (CB4211) completed a small phase 1 study, but MOTS-c itself has never been tested for efficacy in people. It is not authorised anywhere and is explicitly prohibited by WADA at all times.",
  mechanism:
    "Activates AMP-activated protein kinase (AMPK) via the folate–methionine cycle, increasing glucose uptake and fatty-acid oxidation in skeletal muscle; under metabolic stress it moves to the nucleus and regulates stress-response genes. These findings are from cell and mouse studies.",
  goals: [
    {
      goal: "longevity",
      evidence: "insufficient",
      summary:
        "Late-life MOTS-c treatment improved physical capacity and healthspan markers in old mice. In humans, endogenous levels have been associated with age and exercise in observational studies (Reynolds et al. 2021), but no trial has given MOTS-c to people for any ageing outcome.",
    },
    {
      goal: "fat_loss",
      evidence: "insufficient",
      summary:
        "Prevents diet-induced obesity and improves insulin sensitivity in mice. The analogue CB4211 showed only a trend towards lower body weight and a small glucose reduction over four weeks in 20 people with obesity and fatty liver; no human study of MOTS-c itself exists.",
    },
    {
      goal: "athletic_performance",
      evidence: "insufficient",
      summary:
        "Increased running capacity in young and old mice underlies 'exercise mimetic' marketing. There are no human performance studies, and MOTS-c is named on the WADA Prohibited List, so use by tested athletes constitutes doping.",
    },
  ],
  overallEvidence: "insufficient",
  humanEvidenceLevel: "preclinical_only",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; unapproved drug whose compounding status is under FDA review.",
      detail:
        "MOTS-c has never been approved by the FDA. It was placed in 503A 'Category 2' (significant safety risk) in September 2023 — the FDA stated it had identified no human exposure data for any route — then removed from Category 2 in April 2026 after its nomination was withdrawn. In July 2026 the FDA's Pharmacy Compounding Advisory Committee voted, against the advice of FDA reviewers, to recommend adding MOTS-c to the 503A bulks list; the recommendation is non-binding and rulemaking had not been completed at the time of this review.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EU or national marketing authorisation; sold only as a 'research chemical'.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not on the Australian Register of Therapeutic Goods.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not approved by Health Canada.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "not_authorised",
      summary: "No marketing authorisation known in any country.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: true,
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "CB4211 (a MOTS-c analogue, not MOTS-c) — phase 1a/1b in healthy adults and obesity with fatty liver",
      citation: "CohBar Inc., topline results August 2021; AASLD The Liver Meeting 2021 late-breaking poster (not peer-reviewed)",
      year: 2021,
      phase: "Phase 1a/1b",
      design: "Phase 1a: double-blind, placebo-controlled single and multiple ascending doses; phase 1b: randomised, double-blind, placebo-controlled",
      population: "Phase 1a: 65 healthy adults; phase 1b: adults with BMI ≥ 30 and non-alcoholic fatty liver disease (≥ 10% liver fat)",
      n: 85,
      duration: "Up to 7 days (phase 1a); 4 weeks (phase 1b)",
      doses: "Phase 1a: 0.2–3.0 mg/kg/day; phase 1b: 25 mg once daily by subcutaneous injection versus placebo (about 20 participants randomised 1:1)",
      route: "subcutaneous",
      outcome:
        "Primary safety endpoint met. In phase 1b, ALT and AST fell significantly versus placebo, fasting glucose fell by about 6% versus no change, and there was a non-significant trend to lower body weight; liver fat fell similarly in both groups. No further trials have been reported and the sponsor did not progress the programme.",
      adverseEvents: "No serious adverse events; mild-to-moderate injection-site reactions were the only treatment-related adverse event in more than 10% of participants.",
    },
  ],
  dosingResearchNote:
    "No human dosing study of MOTS-c itself has been published; the FDA stated in 2023 that it had identified no human exposure data. The CB4211 study above concerns a modified analogue and is not comparable to 'research chemical' MOTS-c. Vendor regimens (for example 5–10 mg two to three times weekly) are extrapolated from mouse doses and are not evidence.",
  contraindications: [
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Marketed for its insulin-sensitising effect in mice. Any glucose-lowering effect in people using insulin or other diabetes medicines is unpredictable and unstudied.",
    },
    {
      conditionId: "cancer",
      severity: "caution",
      note: "Effects of a metabolic and nuclear stress-response modulator on existing malignancy are unknown; no human safety data.",
    },
  ],
  interactions: [
    {
      classId: "insulin",
      severity: "moderate",
      note: "Interactions are unstudied. Additive glucose lowering is a theoretical concern given the AMPK-activating, insulin-sensitising mechanism in animals.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "moderate",
      note: "Interactions are unstudied. Metformin also acts partly via AMPK; combined effects on glucose are unknown.",
    },
    {
      classId: "sulfonylurea",
      severity: "moderate",
      note: "Interactions are unstudied; theoretical additive hypoglycaemia risk.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or animal reproductive safety data; use in pregnancy or breastfeeding cannot be assessed.",
  },
  commonAdverseEffects: [
    "Injection-site reactions (the main adverse event seen with the analogue CB4211)",
    "Headache",
    "Fatigue or, anecdotally, restlessness",
  ],
  seriousAdverseEffects: [
    "Immune reactions to peptide impurities in unregulated products (flagged by the FDA)",
    "Hypoglycaemia if combined with glucose-lowering medicines (theoretical)",
    "Injection-related infection with non-sterile products",
    "Anti-doping violation for tested athletes (prohibited at all times)",
  ],
  monitoring: [
    "Fasting glucose or HbA1c, particularly if diabetes medicines are used",
    "Body weight and body-composition trend against a realistic baseline",
    "Exercise capacity using an objective, repeatable measure",
    "Injection sites for reactions or infection",
    "Anti-doping status if competing in any tested sport",
  ],
  sourceConsiderations: [
    "Every product available is an unregulated 'research chemical'; the FDA has flagged immunogenicity and impurity risks and the absence of human exposure data.",
    "Independent testing has found peptide 'research' vials with incorrect identity or quantity; certificates of analysis from the seller are not independent verification.",
    "Possession or use may breach anti-doping rules for competitive athletes regardless of source.",
  ],
  clinicianQuestions: [
    "Is there any human evidence that MOTS-c improves fat loss, fitness or ageing, as opposed to mouse data?",
    "How would this affect my blood glucose alongside my current medicines?",
    "Which options with actual human evidence for body composition or metabolic health should be considered first?",
    "What are the anti-doping implications if I compete in any tested sport?",
    "How would we monitor for benefit or harm, and when would we stop?",
  ],
  alternatives: ["semaglutide", "tirzepatide"],
  stackNotes: [
    {
      with: "epitalon",
      evidence: "none",
      overlap: "Both are marketed as 'longevity' peptides.",
      note: "Commonly sold together in longevity stacks; no human data on either compound alone or in combination.",
    },
    {
      with: "elamipretide",
      evidence: "none",
      overlap: "Both are mitochondria-targeted peptides.",
      note: "No human data on combining them; elamipretide's approved use is a rare mitochondrial disease and MOTS-c has no human efficacy data.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Both are promoted for metabolic health and fat loss.",
      note: "No human data. Any additive glucose-lowering effect is theoretical; semaglutide alone has strong evidence for the shared goal.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Both are promoted for metabolic health and fat loss.",
      note: "No human data. Any additive glucose-lowering effect is theoretical; tirzepatide alone has strong evidence for the shared goal.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      note: "Marketed together in 'body composition' stacks; no human data on the combination.",
    },
    {
      with: "nad",
      evidence: "none",
      overlap: "Both are marketed for mitochondrial function and energy.",
      note: "Sold together in 'mitochondrial' stacks. No human data on the combination; MOTS-c has no human efficacy data, and the human data for NAD+ are for oral precursors.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Mitochondrial-derived peptide (16 amino acids)" },
    { label: "Route", value: "Subcutaneous injection ('research' vials)" },
    { label: "Human trials", value: "None of MOTS-c; one 4-week phase 1b of an analogue (≈ 20 participants)" },
    { label: "Authorised", value: "Nowhere" },
    { label: "WADA", value: "Prohibited at all times (S4.4 metabolic modulators, named explicitly)" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Lee C et al. The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis and reduces obesity and insulin resistance. Cell Metab 2015", url: "https://doi.org/10.1016/j.cmet.2015.02.009" },
    { label: "Reynolds JC et al. MOTS-c is an exercise-induced mitochondrial-encoded regulator of age-dependent physical decline and muscle homeostasis. Nat Commun 2021", url: "https://doi.org/10.1038/s41467-020-20790-0" },
    { label: "CohBar Inc. Topline results from the phase 1a/1b study of CB4211 (press release, August 2021)", url: "https://www.globenewswire.com/en/news-release/2021/08/10/2278324/0/en/CohBar-Announces-Positive-Topline-Results-from-the-Phase-1a-1b-Study-of-CB4211-Under-Development-for-NASH-and-Obesity.html" },
    { label: "WADA 2026 Prohibited List (S4.4.1 names MOTS-c)", url: "https://www.wada-ama.org/sites/default/files/2025-09/2026list_en_final_clean_september_2025.pdf" },
    { label: "USADA — What is the MOTS-c peptide?", url: "https://www.usada.org/spirit-of-sport/what-is-mots-c-peptide/" },
    { label: "FDA — Bulk drug substances that may present significant safety risks (503A Category 2)", url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks" },
  ],
};
