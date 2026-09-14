import type { Compound } from "../types";

/**
 * Retatrutide (LY3437943) — investigational GIP/GLP-1/glucagon triple agonist.
 * Efficacy claims come from the published phase 2 trials; phase 3 (TRIUMPH)
 * figures are manufacturer-announced topline results and are labelled as such.
 * Keep language neutral and non-prescriptive.
 */
export const retatrutide: Compound = {
  slug: "retatrutide",
  name: "Retatrutide",
  aliases: ["LY3437943", "Reta", "Triple G", "GGG tri-agonist", "GLP-3"],
  family: "incretin",
  classLabel: "GIP/GLP-1/glucagon receptor triple agonist",
  tagline: "Investigational triple agonist with the largest trial weight loss reported so far",
  summary:
    "Retatrutide (LY3437943) is an investigational once-weekly peptide that activates GIP, GLP-1 and glucagon receptors. In a 48-week phase 2 trial the 12 mg dose produced a mean 24.2% weight reduction, and manufacturer-announced phase 3 (TRIUMPH) results in 2025–2026 reported mean losses of roughly 21–28% at 80 weeks depending on the population. It is not authorised anywhere; Eli Lilly has said it plans to file for US approval in the first quarter of 2027.",
  mechanism:
    "Combines GLP-1 and GIP receptor activity (appetite suppression, slowed gastric emptying, glucose-dependent insulin release) with glucagon receptor agonism, which increases energy expenditure and liver fat oxidation. The glucagon component is thought to add weight and liver-fat reduction but also raises heart rate and can raise glucose, which the incretin components counterbalance.",
  goals: [
    {
      goal: "weight_management",
      evidence: "moderate",
      summary:
        "Phase 2 (n = 338): mean weight loss of 8.7%, 17.1%, 22.8% and 24.2% at 48 weeks with 1, 4, 8 and 12 mg weekly versus 2.1% with placebo; every participant on 8 or 12 mg lost ≥ 5%. Phase 3 TRIUMPH trials have reported positive topline results (12.7–20.8% at 80 weeks in type 2 diabetes; up to 22.6% with established cardiovascular disease; approximately 28% in obesity without diabetes), but full peer-reviewed publication and regulatory review are pending.",
    },
    {
      goal: "fat_loss",
      evidence: "limited",
      summary:
        "In an MRI sub-study of the phase 2 obesity trial (n = 98 with liver fat ≥ 10%), liver fat fell by roughly 80–86% at 48 weeks with 8–12 mg; whole-body fat-versus-lean-mass data have not yet been fully published.",
    },
    {
      goal: "longevity",
      evidence: "preliminary",
      summary:
        "TRIUMPH-3 (n = 1,949, severe obesity with established cardiovascular disease) met its weight-loss endpoint and improved blood pressure, lipids and CRP, but cardiovascular events were too few to show benefit (MACE-5 hazard ratio 0.82, 95% CI 0.55–1.22; MACE-3 1.12). A dedicated cardiovascular and renal outcomes trial is ongoing; no outcome data exist yet.",
    },
  ],
  overallEvidence: "moderate",
  humanEvidenceLevel: "late_clinical",
  regulatory: {
    UK: {
      status: "investigational",
      summary: "Not authorised; in phase 3 trials (TRIUMPH programme).",
      detail:
        "No MHRA marketing authorisation. Retatrutide is available only within clinical trials; products sold online as 'retatrutide' are unregulated, of unverified identity and purity, and cannot lawfully be supplied as a medicine.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "investigational",
      summary: "Not FDA-approved; manufacturer plans a Biologics License Application in early 2027.",
      detail:
        "Eli Lilly announced positive topline results from five phase 3 TRIUMPH trials between late 2025 and July 2026 and plans to submit for US approval in the first quarter of 2027. Retatrutide is not an approved active ingredient and is not on any compounding bulks list, so compounded 'retatrutide' is not permitted; the manufacturer states it cannot legally be sold or marketed for human use.",
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
      summary: "Not known to be authorised anywhere; anything sold as retatrutide is unregulated.",
      detail: "No regulator has authorised retatrutide as of last review. Check your national regulator, but assume any product sold online is unlicensed.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "Phase 2 — retatrutide in adults with obesity",
      citation: "Jastreboff AM et al., N Engl J Med 2023;389:514–526",
      year: 2023,
      phase: "Phase 2",
      design: "Randomised, double-blind, placebo-controlled, dose-finding",
      population: "Adults without diabetes with BMI ≥ 30, or 27–30 with ≥ 1 weight-related condition",
      n: 338,
      duration: "48 weeks",
      doses:
        "1 mg, 4 mg (starting 2 or 4 mg), 8 mg (starting 2 or 4 mg) or 12 mg (starting 2 mg) once weekly, escalated in 4-week steps",
      route: "subcutaneous",
      outcome:
        "Mean weight change at 48 weeks −8.7% (1 mg), −17.1% (4 mg), −22.8% (8 mg) and −24.2% (12 mg) vs −2.1% with placebo; 100% of participants on 8 or 12 mg lost ≥ 5% and 83% on 12 mg lost ≥ 15%.",
      adverseEvents:
        "Dose-related gastrointestinal events (nausea, diarrhoea, vomiting, constipation), mostly mild-to-moderate and partly mitigated by the lower 2 mg starting dose; discontinuation for adverse events 6–16% vs 0% with placebo; heart rate rose dose-dependently to a peak at 24 weeks then declined; cardiac arrhythmias were mostly mild-to-moderate (one severe QT prolongation in a participant also taking ondansetron); skin hyperaesthesia or sensitivity in 7% vs 1%; one case of acute pancreatitis.",
      exposure: { doseMin: 1, doseMax: 12, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972",
    },
    {
      title: "Phase 2 — retatrutide in adults with type 2 diabetes",
      citation: "Rosenstock J et al., Lancet 2023;402:529–544",
      year: 2023,
      phase: "Phase 2",
      design: "Randomised, double-blind, placebo- and active-controlled (dulaglutide 1.5 mg)",
      population: "Adults with type 2 diabetes and BMI 25–50 on diet and exercise with or without metformin",
      n: 281,
      duration: "36 weeks",
      doses: "0.5 mg, 4 mg, 8 mg or 12 mg once weekly (several starting-dose and escalation schedules) vs placebo or dulaglutide 1.5 mg weekly",
      route: "subcutaneous",
      outcome:
        "HbA1c fell by up to approximately 2.0 percentage points at 24 weeks (vs ≈ 0 with placebo and 1.4 with dulaglutide); weight fell by up to approximately 17% at 36 weeks with 12 mg vs 3.0% with placebo and 2.0% with dulaglutide.",
      adverseEvents:
        "Mostly mild-to-moderate, dose-related gastrointestinal events; increased heart rate; no severe hypoglycaemia reported.",
      exposure: { doseMin: 0.5, doseMax: 12, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://doi.org/10.1016/S0140-6736(23)01053-X",
    },
  ],
  dosingResearchNote:
    "Phase 3 TRIUMPH trials (more than 5,800 participants, 80 weeks, target doses 4, 9 and 12 mg reached in 4-week steps from 2 mg) have reported topline results but had not been published in peer-reviewed form at last review. Discontinuation for adverse events in TRIUMPH-2 and -3 ranged from about 4% to 13.5% versus about 5% with placebo.",
  contraindications: [
    {
      conditionId: "mtc_men2",
      severity: "absolute",
      note: "Trials exclude people with a personal or family history of medullary thyroid carcinoma or MEN2, and authorised incretin medicines carry a thyroid C-cell warning; treated as a class contraindication.",
    },
    {
      conditionId: "thyroid",
      severity: "caution",
      note: "Any thyroid cancer history must be clarified; slowed gastric emptying may change levothyroxine absorption.",
    },
    {
      conditionId: "pancreatitis_history",
      severity: "absolute",
      note: "Trials exclude people with previous pancreatitis; acute pancreatitis was reported in the phase 2 obesity trial and is a class effect of incretin medicines.",
    },
    {
      conditionId: "pancreatic",
      severity: "caution",
      note: "Pancreatic disease warrants specialist assessment before considering any incretin-based compound.",
    },
    {
      conditionId: "gallbladder",
      severity: "caution",
      note: "Gallstone disease is more common with rapid, large weight loss; the weight loss seen with retatrutide is larger than with authorised incretins.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Hypoglycaemia risk rises with insulin or sulfonylureas; glucagon receptor activation can raise glucose. Type 1 diabetes has not been studied.",
    },
    {
      conditionId: "diabetic_retinopathy",
      severity: "caution",
      note: "Rapid glucose improvement can temporarily worsen retinopathy with incretin medicines; no retatrutide-specific data.",
    },
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Dehydration from vomiting or diarrhoea can cause acute kidney injury; renal outcomes are being studied but are unknown.",
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
      note: "Heart-rate increases are larger than with single GLP-1 agonists and arrhythmia events were reported in phase 2; people with arrhythmia, QT prolongation or unstable cardiovascular disease need specialist review.",
    },
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "Authorised weight-management medicines carry monitoring advice for depression and suicidal thoughts; no retatrutide-specific data.",
    },
    {
      conditionId: "eating_disorder",
      severity: "caution",
      note: "Potent appetite suppression requires specialist assessment where there is a current or previous eating disorder.",
    },
  ],
  interactions: [
    {
      classId: "insulin",
      severity: "major",
      note: "Combined use would increase hypoglycaemia risk; insulin adjustment has only been studied within trials.",
    },
    {
      classId: "sulfonylurea",
      severity: "major",
      note: "Combined use would increase hypoglycaemia risk; trials required dose adjustment under supervision.",
    },
    {
      classId: "glp1_agonist",
      severity: "major",
      note: "Retatrutide already contains GLP-1 and GIP receptor activity — adding another incretin medicine duplicates mechanism with no safety data.",
    },
    {
      classId: "oral_contraceptive",
      severity: "moderate",
      note: "No human interaction data. Tirzepatide, which shares GIP/GLP-1 activity, reduces oral-contraceptive exposure, so a barrier or non-oral method is a reasonable precaution to discuss.",
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
      classId: "beta_blocker",
      severity: "minor",
      note: "No interaction studies; beta-blockers may mask the heart-rate increase seen with retatrutide.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "minor",
      note: "Studied alongside metformin in trials; glucose monitoring advised.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human data; trials exclude pregnant and breastfeeding women and require effective contraception. Authorised incretin medicines are not recommended in pregnancy, and the long half-life means a wash-out period would be expected.",
  },
  commonAdverseEffects: [
    "Nausea",
    "Diarrhoea",
    "Vomiting",
    "Constipation",
    "Reduced appetite",
    "Abdominal pain and dyspepsia",
    "Increased heart rate",
    "Skin sensitivity, tingling or altered sensation (dysaesthesia)",
    "Fatigue",
    "Injection-site reactions",
    "Headache",
  ],
  seriousAdverseEffects: [
    "Cardiac arrhythmias (reported in phase 2; mostly mild-to-moderate, one severe QT prolongation)",
    "Sustained heart-rate increase",
    "Acute pancreatitis (one case in phase 2; class effect)",
    "Gallbladder disease with rapid weight loss (class effect)",
    "Acute kidney injury from dehydration (class effect)",
    "Severe hypoglycaemia when combined with insulin or sulfonylureas",
    "Unknown long-term safety — no data beyond 80 weeks",
    "Aspiration during anaesthesia due to retained stomach contents (class warning)",
  ],
  monitoring: [
    "Heart rate and rhythm, particularly during dose escalation",
    "Gastrointestinal tolerability and hydration at every dose step",
    "Kidney function during vomiting or diarrhoea",
    "Blood glucose if on insulin or sulfonylureas",
    "Skin sensations (dysaesthesia) and mood",
    "Muscle mass, nutrition and protein intake during rapid weight loss",
  ],
  sourceConsiderations: [
    "No authorised product exists anywhere — every vial sold as 'retatrutide' is unregulated, with no assurance of identity, purity, sterility or dose.",
    "The only lawful route of access is enrolment in a registered clinical trial; the manufacturer states it cannot legally be sold or marketed for human use.",
    "Regulators including the FDA and MHRA have warned about unapproved GLP-1-type products sold online and through social media.",
    "Athletes: retatrutide is not named on the WADA Prohibited List, but WADA's S0 category covers pharmacological substances without regulatory approval for human use; competitors should seek anti-doping advice.",
  ],
  clinicianQuestions: [
    "Is there a clinical trial of retatrutide I could be eligible for in my country?",
    "Given that tirzepatide and semaglutide are authorised, what would retatrutide add for my goal?",
    "How would heart rate, rhythm and kidney function be monitored with a compound that has no label?",
    "What is known about what happens to weight after stopping?",
    "If a product were obtained outside a trial, how could its identity and sterility be verified?",
  ],
  alternatives: ["tirzepatide", "semaglutide"],
  stackNotes: [
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Retatrutide already includes GLP-1 receptor activity.",
      note: "No rationale or data for combining with another GLP-1 medicine; duplicate mechanism.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Both act on GIP and GLP-1 receptors.",
      note: "Duplicate mechanism with no human data; two incretin medicines should not be combined.",
    },
    {
      with: "liraglutide",
      evidence: "none",
      overlap: "Both include GLP-1 receptor activity.",
      note: "Duplicate mechanism with no human data.",
    },
    {
      with: "cagrilintide",
      evidence: "none",
      overlap: "Both suppress appetite and slow gastric emptying.",
      note: "Cagrilintide has only been studied with semaglutide; a triple agonist plus an amylin analogue has never been tested in humans.",
    },
    {
      with: "survodutide",
      evidence: "none",
      overlap: "Both include glucagon and GLP-1 receptor activity.",
      note: "Duplicate mechanism; both are investigational and neither has been studied in combination.",
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
    { label: "Status", value: "Investigational — phase 3 (TRIUMPH); not authorised anywhere" },
    { label: "Class", value: "GIP/GLP-1/glucagon receptor triple agonist" },
    { label: "Route", value: "Weekly subcutaneous injection (trials only)" },
    { label: "Phase 2 weight loss", value: "≈ 24% mean at 48 weeks (12 mg)" },
    { label: "Prescription", value: "Not available by prescription; clinical trials only" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Jastreboff AM et al. Retatrutide phase 2 in obesity. NEJM 2023", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972" },
    { label: "Rosenstock J et al. Retatrutide phase 2 in type 2 diabetes. Lancet 2023", url: "https://doi.org/10.1016/S0140-6736(23)01053-X" },
    { label: "Sanyal AJ et al. Retatrutide and liver fat (phase 2 sub-study). Nat Med 2024" },
    {
      label: "Eli Lilly — TRIUMPH-2 and TRIUMPH-3 topline results (press release, July 2026)",
      url: "https://investor.lilly.com/news-releases/news-release-details/lillys-triple-agonist-retatrutide-successful-two-additional",
    },
    { label: "ClinicalTrials.gov — retatrutide studies", url: "https://clinicaltrials.gov/search?intr=retatrutide" },
  ],
};
