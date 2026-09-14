import type { Compound } from "../types";

/**
 * Cagrilintide — investigational long-acting amylin analogue, studied alone
 * and in fixed combination with semaglutide 2.4 mg (CagriSema). Claims are
 * derived from the phase 2 and phase 3 (REDEFINE) papers and manufacturer
 * regulatory announcements listed under `references`.
 */
export const cagrilintide: Compound = {
  slug: "cagrilintide",
  name: "Cagrilintide",
  aliases: ["NNC0174-0833", "AM833", "Cagri", "CagriSema (with semaglutide)"],
  family: "incretin",
  classLabel: "Long-acting amylin analogue",
  tagline: "Investigational weekly amylin analogue, studied alone and with semaglutide (CagriSema)",
  summary:
    "Cagrilintide is an investigational once-weekly, long-acting analogue of amylin, the satiety hormone co-secreted with insulin. Alone it produced up to 10.8% weight loss at 26 weeks in phase 2; combined with semaglutide 2.4 mg as CagriSema it produced 20.4% weight loss at 68 weeks in the phase 3 REDEFINE 1 trial. CagriSema was submitted to the FDA in December 2025, but neither cagrilintide nor the combination is authorised anywhere.",
  mechanism:
    "Activates amylin and calcitonin receptors: slows gastric emptying, suppresses post-meal glucagon and acts on hindbrain (area postrema) and hypothalamic satiety circuits to reduce food intake. A lipidated structure extends the half-life to about a week. The pathway is distinct from, and additive to, GLP-1 receptor activation.",
  goals: [
    {
      goal: "weight_management",
      evidence: "moderate",
      summary:
        "Alone: 6.0–10.8% weight loss at 26 weeks across 0.3–4.5 mg weekly versus 3.0% with placebo (phase 2, n = 706), and approximately 12% at 68 weeks in the 2.4 mg monotherapy arm of REDEFINE 1. Combined with semaglutide 2.4 mg (CagriSema): 20.4% versus 3.0% with placebo at 68 weeks (n = 3,417).",
    },
    {
      goal: "fat_loss",
      evidence: "preliminary",
      summary:
        "Trials report large reductions in waist circumference alongside weight loss; detailed fat-versus-lean-mass data for cagrilintide alone are limited to small sub-studies and have not been fully published.",
    },
    {
      goal: "longevity",
      evidence: "insufficient",
      summary:
        "No cardiovascular-outcome data exist for cagrilintide or CagriSema; a dedicated outcomes trial (REDEFINE 3) is ongoing.",
    },
  ],
  overallEvidence: "moderate",
  humanEvidenceLevel: "late_clinical",
  regulatory: {
    UK: {
      status: "investigational",
      summary: "Not authorised; in phase 3 trials (REDEFINE programme).",
      detail:
        "No MHRA marketing authorisation for cagrilintide or CagriSema, and no UK filing publicly confirmed as of last review. Products sold online as 'cagrilintide' are unregulated and cannot lawfully be supplied as a medicine.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "investigational",
      summary: "Not FDA-approved; CagriSema submitted to the FDA in December 2025 with a decision anticipated in late 2026.",
      detail:
        "Novo Nordisk submitted a New Drug Application for once-weekly CagriSema (cagrilintide 2.4 mg + semaglutide 2.4 mg) for weight management on 18 December 2025, based on REDEFINE 1 and 2. Cagrilintide alone has not been submitted. Neither is an approved active ingredient, so compounded versions are not permitted.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "investigational",
      summary: "Not authorised; no EMA marketing authorisation.",
      detail: "No EMA marketing authorisation and no public filing confirmed as of last review; available only within clinical trials.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "investigational",
      summary: "Not authorised; not on the ARTG.",
      detail: "Not registered on the Australian Register of Therapeutic Goods; supplied only through clinical trials.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "investigational",
      summary: "Not authorised by Health Canada.",
      detail: "No Health Canada authorisation; available only within clinical trials.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Not known to be authorised anywhere; anything sold as cagrilintide is unregulated.",
      detail: "No regulator had authorised cagrilintide or CagriSema as of last review. Check your national regulator, but assume any product sold online is unlicensed.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "Phase 2 — once-weekly cagrilintide monotherapy in adults with overweight or obesity",
      citation: "Lau DCW et al., Lancet 2021;398:2160–2172",
      year: 2021,
      phase: "Phase 2",
      design: "Randomised, double-blind, placebo- and active-controlled (liraglutide 3.0 mg), dose-finding",
      population: "Adults without diabetes with BMI ≥ 30, or ≥ 27 with hypertension or dyslipidaemia",
      n: 706,
      duration: "26 weeks",
      doses: "0.3, 0.6, 1.2, 2.4 or 4.5 mg once weekly after dose escalation; liraglutide 3.0 mg daily as active comparator",
      route: "subcutaneous",
      outcome:
        "Mean weight loss 6.0% (0.3 mg) to 10.8% (4.5 mg) vs 3.0% with placebo and 9.0% with liraglutide 3.0 mg; all cagrilintide doses were superior to placebo.",
      adverseEvents:
        "Gastrointestinal events (mainly nausea, constipation and diarrhoea) and injection-site reactions were the most frequent adverse events, mostly mild-to-moderate and transient; overall adverse-event rates were similar to liraglutide.",
      exposure: { doseMin: 0.3, doseMax: 4.5, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://doi.org/10.1016/S0140-6736(21)01751-7",
    },
    {
      title: "REDEFINE 1 — CagriSema, cagrilintide alone and semaglutide alone in adults with overweight or obesity",
      citation: "Garvey WT et al., N Engl J Med 2025;393:635–647",
      year: 2025,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo- and active-controlled",
      population: "Adults without diabetes with BMI ≥ 30, or ≥ 27 with ≥ 1 obesity-related complication",
      n: 3417,
      duration: "68 weeks",
      doses:
        "Cagrilintide 2.4 mg + semaglutide 2.4 mg once weekly (CagriSema), cagrilintide 2.4 mg alone, semaglutide 2.4 mg alone, or placebo, after a 16-week escalation",
      route: "subcutaneous",
      outcome:
        "Mean weight change −20.4% with CagriSema vs −3.0% with placebo (treatment-policy estimand; −22.7% vs −2.3% if all participants had stayed on treatment); approximately −15% with semaglutide alone and −12% with cagrilintide alone; 91.9% on CagriSema lost ≥ 5% vs 31.5%.",
      adverseEvents:
        "Gastrointestinal events in 79.6% with CagriSema vs 39.9% with placebo (nausea, vomiting, diarrhoea, constipation, abdominal pain), mainly transient and mild-to-moderate.",
      exposure: {
        doseMin: 2.4,
        doseMax: 2.4,
        unit: "mg",
        frequency: "weekly",
        route: "subcutaneous",
        note: "Cagrilintide component; co-administered with semaglutide 2.4 mg in the combination arm",
      },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2502081",
    },
  ],
  dosingResearchNote:
    "REDEFINE 2 (adults with type 2 diabetes) reported approximately 14% weight loss with CagriSema versus about 3% with placebo at 68 weeks, and the open-label REDEFINE 4 trial (2026) did not show non-inferiority of CagriSema to tirzepatide 15 mg at 84 weeks. All data relate to the 2.4 mg weekly dose reached by gradual escalation.",
  contraindications: [
    {
      conditionId: "gastroparesis",
      severity: "absolute",
      note: "Amylin analogues slow gastric emptying; the authorised short-acting amylin analogue pramlintide is contraindicated in gastroparesis and trials excluded it.",
    },
    {
      conditionId: "gastrointestinal",
      severity: "caution",
      note: "Not studied in severe gastrointestinal disease; slowed gastric emptying may worsen symptoms.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Pramlintide carries a boxed warning for severe insulin-induced hypoglycaemia; cagrilintide has only been studied in type 2 diabetes within REDEFINE 2 alongside semaglutide, and not in type 1 diabetes.",
    },
    {
      conditionId: "pancreatitis_history",
      severity: "caution",
      note: "Trials excluded previous pancreatitis; the CagriSema combination carries semaglutide's pancreatitis warning.",
    },
    {
      conditionId: "gallbladder",
      severity: "caution",
      note: "Gallstone disease is more common with rapid, large weight loss such as that seen with CagriSema.",
    },
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Dehydration from vomiting or diarrhoea can cause acute kidney injury; no data in significant kidney disease.",
    },
    {
      conditionId: "mtc_men2",
      severity: "caution",
      note: "Not a known concern for amylin analogues themselves, but the CagriSema combination includes semaglutide, which carries the thyroid C-cell warning.",
    },
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "Authorised weight-management medicines carry monitoring advice for depression and suicidal thoughts; no cagrilintide-specific data.",
    },
    {
      conditionId: "eating_disorder",
      severity: "caution",
      note: "Appetite-suppressing compounds require specialist assessment where there is a current or previous eating disorder.",
    },
  ],
  interactions: [
    {
      classId: "insulin",
      severity: "major",
      note: "Amylin analogues combined with insulin can cause severe hypoglycaemia (boxed warning for pramlintide); no cagrilintide data in insulin users.",
    },
    {
      classId: "sulfonylurea",
      severity: "moderate",
      note: "Hypoglycaemia risk would rise, particularly in the CagriSema combination; no dedicated interaction data.",
    },
    {
      classId: "glp1_agonist",
      severity: "moderate",
      note: "Only studied as the fixed CagriSema combination with semaglutide 2.4 mg in trials; combining with any other incretin medicine is untested.",
    },
    {
      classId: "anticoagulant",
      severity: "moderate",
      note: "Delayed gastric emptying can alter absorption of oral medicines; closer INR monitoring would be prudent with warfarin.",
    },
    {
      classId: "narrow_therapeutic_index",
      severity: "moderate",
      note: "Medicines that depend on rapid absorption or have a narrow therapeutic window may need closer monitoring.",
    },
    {
      classId: "thyroid_hormone",
      severity: "minor",
      note: "Levothyroxine absorption may change with slowed gastric emptying.",
    },
    {
      classId: "oral_contraceptive",
      severity: "minor",
      note: "No interaction data; vomiting can reduce pill effectiveness.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "minor",
      note: "Studied alongside metformin in REDEFINE 2; glucose monitoring advised.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human data; trials exclude pregnant and breastfeeding women and require effective contraception. The semaglutide component of CagriSema is not recommended in pregnancy and has a two-month wash-out advice.",
  },
  commonAdverseEffects: [
    "Nausea",
    "Constipation",
    "Diarrhoea",
    "Vomiting",
    "Reduced appetite and early satiety",
    "Dyspepsia and abdominal pain",
    "Injection-site reactions",
    "Fatigue",
    "Headache",
  ],
  seriousAdverseEffects: [
    "Severe hypoglycaemia when combined with insulin (amylin class warning)",
    "Gallbladder disease with rapid weight loss",
    "Acute pancreatitis (reported in incretin-combination trials; causality unclear)",
    "Dehydration and acute kidney injury from persistent vomiting or diarrhoea",
    "Unknown long-term safety — no data beyond about 84 weeks",
    "Severe allergic reactions (theoretical; peptide immunogenicity)",
  ],
  monitoring: [
    "Gastrointestinal tolerability and hydration during escalation",
    "Blood glucose if on insulin or other glucose-lowering medicines",
    "Kidney function during vomiting or diarrhoea",
    "Weight, muscle mass and protein intake during rapid weight loss",
    "Mood and mental health",
    "Injection-site reactions",
  ],
  sourceConsiderations: [
    "No authorised product exists anywhere — vials sold as 'cagrilintide' or 'CagriSema' online are unregulated, with no assurance of identity, purity, sterility or dose.",
    "The only lawful route of access is enrolment in a registered clinical trial; if the FDA approves CagriSema it will be a prescription-only fixed combination, not a stand-alone cagrilintide product.",
    "Regulators including the FDA and MHRA have warned about unapproved weight-loss injections sold online and through social media.",
    "Athletes: cagrilintide is not named on the WADA Prohibited List, but WADA's S0 category covers substances without regulatory approval for human use; competitors should seek anti-doping advice.",
  ],
  clinicianQuestions: [
    "Is there a clinical trial of cagrilintide or CagriSema I could be eligible for?",
    "Given that semaglutide and tirzepatide are authorised, what would an amylin analogue add for my goal?",
    "How would hypoglycaemia risk be managed if I take insulin or a sulfonylurea?",
    "How would nausea and gastric-emptying effects be monitored with a compound that has no label?",
    "What is known about weight regain after stopping?",
  ],
  alternatives: ["semaglutide", "tirzepatide"],
  stackNotes: [
    {
      with: "semaglutide",
      evidence: "studied",
      overlap: "Complementary appetite pathways (amylin + GLP-1); both slow gastric emptying.",
      note: "The fixed combination CagriSema (2.4 mg + 2.4 mg) has phase 3 data (REDEFINE 1 and 2) and is under FDA review, but it remains investigational and is not authorised anywhere.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Both reduce appetite and slow gastric emptying.",
      note: "No human data on cagrilintide with tirzepatide; only the semaglutide combination has been studied.",
    },
    {
      with: "liraglutide",
      evidence: "none",
      overlap: "Both reduce appetite and slow gastric emptying.",
      note: "Liraglutide 3.0 mg was the active comparator, not a partner, in the phase 2 trial; no combination data.",
    },
    {
      with: "retatrutide",
      evidence: "none",
      overlap: "Both suppress appetite and slow gastric emptying.",
      note: "Never studied together; both are investigational.",
    },
    {
      with: "survodutide",
      evidence: "none",
      overlap: "Both suppress appetite and slow gastric emptying.",
      note: "Never studied together; both are investigational.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      note: "No human studies of amylin analogues combined with growth-hormone secretagogues.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      note: "No human studies of amylin analogues combined with growth-hormone secretagogues.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "No human data on this combination; BPC-157 itself lacks human efficacy data.",
    },
  ],
  keyFacts: [
    { label: "Status", value: "Investigational — CagriSema under FDA review; not authorised anywhere" },
    { label: "Class", value: "Long-acting amylin analogue" },
    { label: "Route", value: "Weekly subcutaneous injection (trials only)" },
    { label: "Trial weight loss", value: "≈ 11% alone (26 weeks); ≈ 20% with semaglutide (68 weeks)" },
    { label: "Prescription", value: "Not available by prescription; clinical trials only" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Lau DCW et al. Cagrilintide phase 2. Lancet 2021", url: "https://doi.org/10.1016/S0140-6736(21)01751-7" },
    { label: "Garvey WT et al. REDEFINE 1 — CagriSema. NEJM 2025", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2502081" },
    { label: "Enebo LB et al. Cagrilintide + semaglutide phase 1b. Lancet 2021" },
    {
      label: "Novo Nordisk — CagriSema NDA submission (press release, December 2025)",
      url: "https://www.prnewswire.com/news-releases/novo-nordisk-files-for-fda-approval-of-cagrisema-the-first-once-weekly-combination-of-glp1-and-amylin-analogues-for-weight-management-302645862.html",
    },
    { label: "ClinicalTrials.gov — cagrilintide studies", url: "https://clinicaltrials.gov/search?intr=cagrilintide" },
  ],
};
