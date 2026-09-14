import type { Compound } from "../types";

/**
 * Survodutide (BI 456906) — investigational glucagon/GLP-1 receptor dual
 * agonist in phase 3 for obesity (SYNCHRONIZE) and MASH. Claims are derived
 * from the peer-reviewed phase 2 and phase 3 papers listed under `references`.
 */
export const survodutide: Compound = {
  slug: "survodutide",
  name: "Survodutide",
  aliases: ["BI 456906", "Survo"],
  family: "incretin",
  classLabel: "Dual glucagon/GLP-1 receptor agonist",
  tagline: "Investigational weekly glucagon/GLP-1 dual agonist in phase 3 for obesity and MASH",
  summary:
    "Survodutide (BI 456906) is an investigational once-weekly peptide that activates both glucagon and GLP-1 receptors. In a 46-week phase 2 trial the 4.8 mg dose produced a mean 14.9% weight loss, and the phase 3 SYNCHRONIZE-1 trial published in 2026 reported 12.2–13.0% at 76 weeks versus 5.4% with placebo. It is also being studied in metabolic dysfunction-associated steatohepatitis (MASH). No regulator has authorised it.",
  mechanism:
    "GLP-1 receptor activation reduces appetite, slows gastric emptying and improves glucose-dependent insulin secretion; glucagon receptor activation increases energy expenditure and liver fat oxidation, which is thought to add weight and liver-fat reduction but can raise glucose and heart rate.",
  goals: [
    {
      goal: "weight_management",
      evidence: "moderate",
      summary:
        "Phase 2 (n = 387): mean weight loss of 6.2%, 12.5%, 13.2% and 14.9% at 46 weeks with 0.6, 2.4, 3.6 and 4.8 mg weekly versus 2.8% with placebo (up to 18.7% in those who stayed on treatment). Phase 3 SYNCHRONIZE-1 (n = 725): 12.2% (3.6 mg) and 13.0% (6.0 mg) versus 5.4% at 76 weeks, or up to 16.6% versus 3.2% among those who stayed on treatment.",
    },
    {
      goal: "fat_loss",
      evidence: "limited",
      summary:
        "In an MRI sub-study of SYNCHRONIZE-1 (25 participants per group), 6.0 mg reduced visceral fat by 34% and liver fat by 63% versus 12% and 25% with placebo; fat-versus-lean-mass data have not yet been published.",
    },
    {
      goal: "longevity",
      evidence: "preliminary",
      summary:
        "In a 48-week phase 2 trial in biopsy-confirmed MASH (n = 293), MASH improved without worsening fibrosis in 47–62% versus 14% with placebo. A cardiovascular-outcome trial is ongoing; no outcome data exist yet.",
    },
  ],
  overallEvidence: "moderate",
  humanEvidenceLevel: "late_clinical",
  regulatory: {
    UK: {
      status: "investigational",
      summary: "Not authorised; in phase 3 trials (SYNCHRONIZE programme).",
      detail:
        "No MHRA marketing authorisation. Survodutide is available only within clinical trials; products sold online as 'survodutide' are unregulated and cannot lawfully be supplied as a medicine.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "investigational",
      summary: "Not FDA-approved; phase 3 obesity and MASH programmes ongoing.",
      detail:
        "The first phase 3 obesity trial (SYNCHRONIZE-1) was completed and published in 2026; SYNCHRONIZE-2 (type 2 diabetes) has completed and further trials, including a cardiovascular-outcome trial and phase 3 MASH studies, are ongoing. No marketing application decision had been announced as of last review. Survodutide is not an approved active ingredient, so compounded versions are not permitted.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "investigational",
      summary: "Not authorised; no EMA marketing authorisation.",
      detail: "No EMA marketing authorisation as of last review; available only within clinical trials.",
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
      summary: "Not known to be authorised anywhere; anything sold as survodutide is unregulated.",
      detail: "No regulator had authorised survodutide as of last review. Check your national regulator, but assume any product sold online is unlicensed.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "Phase 2 — survodutide dose-finding in adults with overweight or obesity",
      citation: "le Roux CW et al., Lancet Diabetes Endocrinol 2024;12:162–173",
      year: 2024,
      phase: "Phase 2",
      design: "Randomised, double-blind, placebo-controlled, dose-finding",
      population: "Adults aged 18–75 with BMI ≥ 27, without diabetes",
      n: 387,
      duration: "46 weeks (20 weeks rapid dose escalation, 26 weeks maintenance)",
      doses: "0.6, 2.4, 3.6 or 4.8 mg once weekly",
      route: "subcutaneous",
      outcome:
        "Mean weight change −6.2% (0.6 mg), −12.5% (2.4 mg), −13.2% (3.6 mg) and −14.9% (4.8 mg) vs −2.8% with placebo (planned-treatment analysis); up to −18.7% in the actual-treatment analysis.",
      adverseEvents:
        "Adverse events in 91% vs 75%, primarily gastrointestinal (75% vs 42%); adverse events led to discontinuation in 25% of survodutide recipients vs 4% with placebo, mostly gastrointestinal and during rapid escalation; two serious drug-related events (dehydration with renal failure; angioedema).",
      exposure: { doseMin: 0.6, doseMax: 4.8, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://doi.org/10.1016/S2213-8587(23)00356-X",
    },
    {
      title: "SYNCHRONIZE-1 — once-weekly survodutide in adults with obesity without diabetes",
      citation: "SYNCHRONIZE-1 trial, N Engl J Med 2026 (DOI 10.1056/NEJMoa2600751)",
      year: 2026,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults with BMI ≥ 30, or ≥ 27 with ≥ 1 obesity-related complication, without diabetes",
      n: 725,
      duration: "76 weeks",
      doses: "Escalated to 3.6 mg or 6.0 mg once weekly, with lifestyle counselling",
      route: "subcutaneous",
      outcome:
        "Mean weight change −12.2% (3.6 mg) and −13.0% (6.0 mg) vs −5.4% with placebo (treatment-regimen estimand); up to −16.6% vs −3.2% in the efficacy estimand; ≥ 5% weight loss in 72.6% and 71.9% vs 46.3%.",
      adverseEvents:
        "Gastrointestinal events in 80.9% (3.6 mg) and 89.7% (6.0 mg) vs 47.9% with placebo, typically mild-to-moderate; no deaths reported.",
      exposure: { doseMin: 3.6, doseMax: 6.0, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2600751",
    },
    {
      title: "Phase 2 — survodutide in MASH with fibrosis",
      citation: "Sanyal AJ et al., N Engl J Med 2024;391:311–319",
      year: 2024,
      phase: "Phase 2",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults with biopsy-confirmed MASH and fibrosis stage F1–F3",
      n: 293,
      duration: "48 weeks (24 weeks rapid escalation, 24 weeks maintenance)",
      doses: "2.4, 4.8 or 6.0 mg once weekly",
      route: "subcutaneous",
      outcome:
        "Improvement in MASH without worsening fibrosis in 47% (2.4 mg), 62% (4.8 mg) and 43% (6.0 mg) vs 14% with placebo; ≥ 30% liver-fat reduction in 57–67% vs 14%; fibrosis improved by ≥ 1 stage in 34–36% vs 22%.",
      adverseEvents:
        "Nausea (66% vs 23%), diarrhoea (49% vs 23%) and vomiting (41% vs 4%); discontinuation for adverse events 20% vs 3%; serious adverse events 8% vs 7%; asymptomatic rises in pancreatic enzymes more frequent.",
      exposure: { doseMin: 2.4, doseMax: 6.0, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2401755",
    },
  ],
  contraindications: [
    {
      conditionId: "mtc_men2",
      severity: "absolute",
      note: "Trials exclude people with a personal or family history of medullary thyroid carcinoma or MEN2, and authorised GLP-1 medicines carry a thyroid C-cell warning; treated as a class contraindication.",
    },
    {
      conditionId: "thyroid",
      severity: "caution",
      note: "Any thyroid cancer history must be clarified; slowed gastric emptying may change levothyroxine absorption.",
    },
    {
      conditionId: "pancreatitis_history",
      severity: "absolute",
      note: "Trials exclude previous pancreatitis; asymptomatic pancreatic-enzyme rises were more frequent with survodutide and pancreatitis is a class effect of GLP-1 medicines.",
    },
    {
      conditionId: "pancreatic",
      severity: "caution",
      note: "Pancreatic disease warrants specialist assessment before considering any GLP-1-based compound.",
    },
    {
      conditionId: "gallbladder",
      severity: "caution",
      note: "Gallstone disease is more common with rapid weight loss.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Glucagon receptor activation can raise glucose; hypoglycaemia risk rises with insulin or sulfonylureas. Data in type 2 diabetes come from SYNCHRONIZE-2 (results awaited at last review); type 1 diabetes has not been studied.",
    },
    {
      conditionId: "diabetic_retinopathy",
      severity: "caution",
      note: "Rapid glucose improvement can temporarily worsen retinopathy with GLP-1 medicines; no survodutide-specific data.",
    },
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Dehydration with renal failure occurred as a serious adverse event in phase 2; hydration must be maintained during vomiting or diarrhoea.",
    },
    {
      conditionId: "liver",
      severity: "caution",
      note: "Studied in MASH with fibrosis stage F1–F3; there are no data in cirrhosis or decompensated liver disease.",
    },
    {
      conditionId: "gastrointestinal",
      severity: "caution",
      note: "Not studied in severe gastrointestinal disease; slowed gastric emptying may worsen symptoms.",
    },
    {
      conditionId: "gastroparesis",
      severity: "absolute",
      note: "Slows gastric emptying further; excluded from trials and treated as a class contraindication.",
    },
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "Glucagon receptor agonists raise heart rate; people with arrhythmia or unstable cardiovascular disease need specialist review, and outcome data are awaited.",
    },
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "Authorised weight-management medicines carry monitoring advice for depression and suicidal thoughts; no survodutide-specific data.",
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
      note: "Combined use would increase hypoglycaemia risk; SYNCHRONIZE-2 excluded insulin users.",
    },
    {
      classId: "sulfonylurea",
      severity: "major",
      note: "Combined use would increase hypoglycaemia risk; no dedicated interaction data.",
    },
    {
      classId: "glp1_agonist",
      severity: "major",
      note: "Survodutide already contains GLP-1 receptor activity — adding another incretin medicine duplicates mechanism with no safety data.",
    },
    {
      classId: "anticoagulant",
      severity: "moderate",
      note: "Delayed gastric emptying can alter absorption; closer INR monitoring would be prudent with warfarin.",
    },
    {
      classId: "thyroid_hormone",
      severity: "moderate",
      note: "Levothyroxine exposure may change with slowed gastric emptying.",
    },
    {
      classId: "narrow_therapeutic_index",
      severity: "moderate",
      note: "Medicines that depend on rapid absorption or have a narrow therapeutic window may need closer monitoring.",
    },
    {
      classId: "oral_contraceptive",
      severity: "minor",
      note: "No interaction data; vomiting can reduce pill effectiveness and a barrier method is a reasonable precaution to discuss.",
    },
    {
      classId: "beta_blocker",
      severity: "minor",
      note: "No interaction studies; beta-blockers may mask the heart-rate increase seen with glucagon receptor agonists.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "minor",
      note: "Studied alongside metformin and other oral agents in SYNCHRONIZE-2; glucose monitoring advised.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human data; trials exclude pregnant and breastfeeding women and require effective contraception. Authorised GLP-1 medicines are not recommended in pregnancy.",
  },
  commonAdverseEffects: [
    "Nausea",
    "Vomiting",
    "Diarrhoea",
    "Constipation",
    "Reduced appetite",
    "Abdominal pain and dyspepsia",
    "Fatigue",
    "Increased heart rate",
    "Injection-site reactions",
    "Headache",
  ],
  seriousAdverseEffects: [
    "Dehydration with acute kidney injury from persistent vomiting or diarrhoea (reported in phase 2)",
    "Angioedema (one serious drug-related case in phase 2)",
    "Increased heart rate and possible arrhythmia (glucagon receptor effect)",
    "Acute pancreatitis (class effect; asymptomatic enzyme rises more frequent)",
    "Gallbladder disease with rapid weight loss (class effect)",
    "Severe hypoglycaemia when combined with insulin or sulfonylureas",
    "Unknown long-term safety — no data beyond 76 weeks",
    "Aspiration during anaesthesia due to retained stomach contents (class warning)",
  ],
  monitoring: [
    "Gastrointestinal tolerability and hydration — discontinuations clustered during rapid escalation",
    "Kidney function during vomiting or diarrhoea",
    "Heart rate and blood pressure",
    "Blood glucose if on insulin or other glucose-lowering medicines",
    "Liver enzymes and pancreatic enzymes if symptoms suggest a problem",
    "Muscle mass, nutrition and mood during rapid weight loss",
  ],
  sourceConsiderations: [
    "No authorised product exists anywhere — vials sold as 'survodutide' online are unregulated, with no assurance of identity, purity, sterility or dose.",
    "The only lawful route of access is enrolment in a registered clinical trial.",
    "Regulators including the FDA and MHRA have warned about unapproved GLP-1-type injections sold online and through social media.",
    "Athletes: survodutide is not named on the WADA Prohibited List, but WADA's S0 category covers substances without regulatory approval for human use; competitors should seek anti-doping advice.",
  ],
  clinicianQuestions: [
    "Is there a clinical trial of survodutide I could be eligible for in my country?",
    "Given that tirzepatide and semaglutide are authorised and produced larger weight loss in their trials, what would survodutide add for my goal?",
    "How would nausea, hydration and kidney function be managed given the high discontinuation rate during rapid escalation in trials?",
    "If I have fatty liver disease, what authorised options exist and how would liver health be monitored?",
    "What is known about weight regain after stopping?",
  ],
  alternatives: ["tirzepatide", "semaglutide"],
  stackNotes: [
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Both include GLP-1 receptor activity.",
      note: "Duplicate incretin mechanism with no human data; two GLP-1-based compounds should not be combined.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Both include GLP-1 receptor activity.",
      note: "Duplicate incretin mechanism with no human data.",
    },
    {
      with: "liraglutide",
      evidence: "none",
      overlap: "Both include GLP-1 receptor activity.",
      note: "Duplicate mechanism with no human data.",
    },
    {
      with: "retatrutide",
      evidence: "none",
      overlap: "Both include glucagon and GLP-1 receptor activity.",
      note: "Duplicate mechanism; both are investigational and neither has been studied in combination.",
    },
    {
      with: "cagrilintide",
      evidence: "none",
      overlap: "Both suppress appetite and slow gastric emptying.",
      note: "Never studied together; both are investigational.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      note: "No human studies of incretin-based compounds combined with growth-hormone secretagogues.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      note: "No human studies of incretin-based compounds combined with growth-hormone secretagogues.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "No human data on this combination; BPC-157 itself lacks human efficacy data.",
    },
  ],
  keyFacts: [
    { label: "Status", value: "Investigational — phase 3 (SYNCHRONIZE); not authorised anywhere" },
    { label: "Class", value: "Dual glucagon/GLP-1 receptor agonist" },
    { label: "Route", value: "Weekly subcutaneous injection (trials only)" },
    { label: "Trial weight loss", value: "≈ 13% mean at 76 weeks (SYNCHRONIZE-1, 6.0 mg)" },
    { label: "Prescription", value: "Not available by prescription; clinical trials only" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "le Roux CW et al. Survodutide phase 2 in obesity. Lancet Diabetes Endocrinol 2024", url: "https://doi.org/10.1016/S2213-8587(23)00356-X" },
    { label: "SYNCHRONIZE-1 — survodutide once weekly for adults with obesity. NEJM 2026", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2600751" },
    { label: "Sanyal AJ et al. Survodutide phase 2 in MASH and fibrosis. NEJM 2024", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2401755" },
    { label: "ClinicalTrials.gov — SYNCHRONIZE-2 (NCT06066528)", url: "https://clinicaltrials.gov/study/NCT06066528" },
    { label: "ClinicalTrials.gov — SYNCHRONIZE-1 (NCT06066515)", url: "https://clinicaltrials.gov/study/NCT06066515" },
  ],
};
