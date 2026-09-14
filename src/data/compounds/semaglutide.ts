import type { Compound } from "../types";

/**
 * REFERENCE RECORD — this file sets the quality bar for every compound.
 * All claims are derived from regulator labels and peer-reviewed trials
 * listed under `references`. Keep language neutral and non-prescriptive.
 */
export const semaglutide: Compound = {
  slug: "semaglutide",
  name: "Semaglutide",
  aliases: ["Wegovy", "Ozempic", "Rybelsus", "Sema"],
  family: "incretin",
  classLabel: "GLP-1 receptor agonist",
  tagline: "Once-weekly incretin medicine with the largest weight-management evidence base",
  summary:
    "Semaglutide is a long-acting glucagon-like peptide-1 (GLP-1) receptor agonist authorised for type 2 diabetes and, at 2.4 mg weekly, for chronic weight management in adults with obesity or overweight with a weight-related condition. It has been studied in tens of thousands of trial participants and has cardiovascular-outcome data.",
  mechanism:
    "Mimics the gut hormone GLP-1: enhances glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying and acts on appetite centres in the brain to reduce hunger and food intake.",
  goals: [
    {
      goal: "weight_management",
      evidence: "strong",
      summary:
        "In STEP 1 (n = 1,961), 2.4 mg weekly produced a mean 14.9% body-weight reduction at 68 weeks versus 2.4% with placebo, alongside diet and activity support.",
    },
    {
      goal: "fat_loss",
      evidence: "moderate",
      summary:
        "DXA sub-studies show most weight lost is fat mass, but a meaningful proportion (roughly 25–40%) is lean mass; resistance training and protein intake are usually advised.",
    },
    {
      goal: "longevity",
      evidence: "moderate",
      summary:
        "SELECT (n = 17,604) showed a 20% relative reduction in major adverse cardiovascular events in adults with established cardiovascular disease and overweight/obesity, without diabetes.",
    },
    {
      goal: "general_wellbeing",
      evidence: "limited",
      summary:
        "Improvements in physical functioning scores were reported in weight-management trials; no direct evidence for energy or fatigue as a primary outcome.",
    },
  ],
  overallEvidence: "strong",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "authorised",
      summary: "Authorised (MHRA) for type 2 diabetes and weight management; prescription-only.",
      detail:
        "Wegovy is licensed for weight management in adults with BMI ≥ 30, or ≥ 27 with a weight-related comorbidity, alongside diet and physical activity. NICE TA875 recommends it within specialist weight-management services for a maximum of two years. Prescription-only medicine.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "authorised",
      summary: "FDA-approved (Wegovy, Ozempic, Rybelsus); prescription-only.",
      detail:
        "Wegovy (2.4 mg) is FDA-approved for chronic weight management (adults and adolescents ≥ 12), to reduce major cardiovascular events in adults with cardiovascular disease and overweight/obesity (2024), and — under accelerated approval since August 2025 — for non-cirrhotic MASH with moderate-to-advanced fibrosis. Ozempic and Rybelsus are approved for type 2 diabetes. Compounded versions are not FDA-approved.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "authorised",
      summary: "Authorised by the European Commission (EMA); prescription-only.",
      detail:
        "Wegovy received EU marketing authorisation for weight management in January 2022; Ozempic and Rybelsus are authorised for type 2 diabetes. National reimbursement varies.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "authorised",
      summary: "TGA-registered (Wegovy, Ozempic); prescription-only.",
      detail: "Ozempic supply has been intermittently constrained; the TGA has advised against off-label prescribing of Ozempic for weight loss during shortages.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "authorised",
      summary: "Health Canada-approved (Wegovy, Ozempic, Rybelsus); prescription-only.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Authorised in many countries; check your national regulator.",
      detail: "Semaglutide is approved in more than 80 countries, but indications, brands and prescribing rules differ. Verify with your national medicines regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous", "oral"],
  dosingResearch: [
    {
      title: "STEP 1 — once-weekly semaglutide in adults with overweight or obesity",
      citation: "Wilding JPH et al., N Engl J Med 2021;384:989–1002",
      year: 2021,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults without diabetes with BMI ≥ 30, or ≥ 27 with ≥ 1 weight-related comorbidity",
      n: 1961,
      duration: "68 weeks",
      doses:
        "Escalated over 16 weeks: 0.25 mg → 0.5 mg → 1.0 mg → 1.7 mg → 2.4 mg once weekly (maintenance 2.4 mg)",
      route: "subcutaneous",
      outcome: "Mean body-weight change −14.9% vs −2.4% with placebo; 86.4% lost ≥ 5% vs 31.5%.",
      adverseEvents:
        "Gastrointestinal events (nausea, diarrhoea, vomiting, constipation) in 74.2% vs 47.9%; treatment discontinuation for adverse events 7.0% vs 3.1%; gallbladder-related disorders 2.6% vs 1.2%.",
      exposure: { doseMin: 0.25, doseMax: 2.4, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2032183",
    },
    {
      title: "STEP 5 — two-year semaglutide 2.4 mg",
      citation: "Garvey WT et al., Nat Med 2022;28:2083–2091",
      year: 2022,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults with overweight or obesity without diabetes",
      n: 304,
      duration: "104 weeks",
      doses: "2.4 mg once weekly after 16-week escalation",
      route: "subcutaneous",
      outcome: "Mean weight change −15.2% vs −2.6% with placebo at week 104; effect maintained through two years.",
      adverseEvents: "Gastrointestinal events most common (82.2% vs 53.9%), mostly mild-to-moderate and transient.",
      exposure: { doseMin: 2.4, doseMax: 2.4, unit: "mg", frequency: "weekly", route: "subcutaneous" },
    },
    {
      title: "SELECT — cardiovascular outcomes in obesity without diabetes",
      citation: "Lincoff AM et al., N Engl J Med 2023;389:2221–2232",
      year: 2023,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled, event-driven",
      population: "Adults ≥ 45 with established cardiovascular disease and BMI ≥ 27, without diabetes",
      n: 17604,
      duration: "Mean 39.8 months",
      doses: "2.4 mg once weekly",
      route: "subcutaneous",
      outcome: "Major adverse cardiovascular events reduced by 20% (HR 0.80, 95% CI 0.72–0.90).",
      adverseEvents:
        "Serious adverse events lower with semaglutide (33.4% vs 36.4%); discontinuation for adverse events higher (16.6% vs 8.2%), mainly gastrointestinal.",
      exposure: { doseMin: 2.4, doseMax: 2.4, unit: "mg", frequency: "weekly", route: "subcutaneous" },
    },
  ],
  contraindications: [
    {
      conditionId: "mtc_men2",
      severity: "absolute",
      note: "Contraindicated with a personal or family history of medullary thyroid carcinoma or MEN2 (boxed warning based on rodent thyroid C-cell tumours).",
    },
    {
      conditionId: "thyroid",
      severity: "caution",
      note: "Thyroid disease itself is not a contraindication, but thyroid cancer history must be clarified; thyroid medicine absorption can change as gastric emptying slows.",
    },
    {
      conditionId: "pancreatitis_history",
      severity: "absolute",
      note: "Not recommended in people with a history of pancreatitis; acute pancreatitis has been reported.",
    },
    {
      conditionId: "pancreatic",
      severity: "caution",
      note: "Pancreatic disease warrants specialist assessment before considering any GLP-1 medicine.",
    },
    {
      conditionId: "gallbladder",
      severity: "caution",
      note: "Cholelithiasis and cholecystitis occur more often with rapid weight loss and were more frequent in trials.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Hypoglycaemia risk rises with insulin or sulfonylureas; type 1 diabetes is outside the licence.",
    },
    {
      conditionId: "diabetic_retinopathy",
      severity: "caution",
      note: "Rapid glucose improvement was associated with worsening retinopathy in people with type 2 diabetes (SUSTAIN-6).",
    },
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Acute kidney injury has been reported, usually with dehydration from vomiting or diarrhoea.",
    },
    {
      conditionId: "gastrointestinal",
      severity: "caution",
      note: "Not studied in severe gastrointestinal disease; slowed gastric emptying may worsen symptoms.",
    },
    {
      conditionId: "gastroparesis",
      severity: "absolute",
      note: "Not recommended in gastroparesis — further slowing of gastric emptying is expected.",
    },
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "Weight-management labels advise monitoring for depression or suicidal thoughts; discuss any mental-health history.",
    },
    {
      conditionId: "eating_disorder",
      severity: "caution",
      note: "Appetite-suppressing medicines require specialist assessment where there is a current or previous eating disorder.",
    },
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "Resting heart rate increases by 1–4 bpm on average; arrhythmia history should be reviewed.",
    },
  ],
  interactions: [
    {
      classId: "insulin",
      severity: "major",
      note: "Combined use increases hypoglycaemia risk; insulin doses are usually reduced under supervision.",
    },
    {
      classId: "sulfonylurea",
      severity: "major",
      note: "Combined use increases hypoglycaemia risk; sulfonylurea dose reduction is often needed.",
    },
    {
      classId: "glp1_agonist",
      severity: "major",
      note: "Should not be combined with another GLP-1 or GIP/GLP-1 medicine — duplicate mechanism with no safety data.",
    },
    {
      classId: "anticoagulant",
      severity: "moderate",
      note: "Delayed gastric emptying can alter absorption; more frequent INR monitoring is recommended when starting or changing dose with warfarin.",
    },
    {
      classId: "thyroid_hormone",
      severity: "moderate",
      note: "Levothyroxine exposure may change with slowed gastric emptying; thyroid function should be monitored.",
    },
    {
      classId: "narrow_therapeutic_index",
      severity: "moderate",
      note: "Medicines that depend on rapid absorption or have a narrow therapeutic window may need closer monitoring.",
    },
    {
      classId: "oral_contraceptive",
      severity: "minor",
      note: "No clinically relevant reduction shown for semaglutide (unlike tirzepatide), but vomiting can reduce pill effectiveness.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "minor",
      note: "Generally compatible; glucose monitoring advised when combined.",
    },
  ],
  pregnancy: {
    status: "not_recommended",
    note: "Not recommended in pregnancy or while breastfeeding. Because of its long half-life, labels advise stopping at least two months before a planned pregnancy.",
  },
  commonAdverseEffects: [
    "Nausea",
    "Diarrhoea",
    "Vomiting",
    "Constipation",
    "Abdominal pain and bloating",
    "Headache",
    "Fatigue",
    "Injection-site reactions",
    "Reduced appetite and early satiety",
  ],
  seriousAdverseEffects: [
    "Acute pancreatitis",
    "Gallbladder disease (gallstones, cholecystitis)",
    "Acute kidney injury from dehydration",
    "Hypoglycaemia when combined with insulin or sulfonylureas",
    "Worsening of diabetic retinopathy",
    "Increased heart rate",
    "Severe allergic reactions (rare)",
    "Aspiration during anaesthesia due to retained stomach contents (label warning)",
  ],
  monitoring: [
    "Weight and BMI trend against the licensed eligibility criteria",
    "Gastrointestinal tolerability at every dose escalation",
    "Blood glucose if on insulin or sulfonylureas",
    "Thyroid function if on levothyroxine",
    "Hydration and kidney function during vomiting or diarrhoea",
    "Mood and mental health",
    "Muscle mass and protein intake during rapid weight loss",
  ],
  sourceConsiderations: [
    "Prescription-only medicine in every major jurisdiction — legitimate supply requires a prescription from a licensed prescriber.",
    "Regulators (MHRA, FDA) have issued warnings about falsified and counterfeit 'Ozempic' pens and unregulated online sellers.",
    "Compounded or 'research-grade' semaglutide vials are not the authorised product and are not quality-assured to the same standard.",
  ],
  clinicianQuestions: [
    "Do I meet the licensed eligibility criteria (BMI and weight-related conditions) in my country?",
    "How will my other medicines — especially diabetes medicines or blood thinners — be adjusted?",
    "What is the plan for dose escalation and for managing nausea?",
    "How will we protect muscle mass while I lose weight?",
    "What happens when treatment stops, and is there a maintenance plan?",
  ],
  alternatives: ["tirzepatide", "liraglutide"],
  stackNotes: [
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Both are incretin-based appetite and glucose medicines acting on GLP-1 receptors.",
      note: "Combining two incretin medicines duplicates mechanism, has no safety data and is outside every licence.",
    },
    {
      with: "liraglutide",
      evidence: "none",
      overlap: "Both are GLP-1 receptor agonists.",
      note: "Duplicate mechanism — never used together.",
    },
    {
      with: "retatrutide",
      evidence: "none",
      overlap: "Retatrutide already includes GLP-1 receptor activity.",
      note: "No rationale or data for combining with another GLP-1 medicine.",
    },
    {
      with: "cagrilintide",
      evidence: "studied",
      overlap: "Complementary appetite pathways (GLP-1 + amylin).",
      note: "The fixed combination CagriSema has been studied in phase 3 (REDEFINE 1), but the combination remains investigational and is not authorised.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      note: "No human studies of GLP-1 medicines combined with growth-hormone secretagogues.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      note: "No human studies of GLP-1 medicines combined with growth-hormone secretagogues.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "No human data on this combination; BPC-157 itself lacks human efficacy data.",
    },
    {
      with: "aod-9604",
      evidence: "none",
      note: "No human data on this combination.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "GLP-1 receptor agonist" },
    { label: "Route", value: "Weekly subcutaneous injection (oral form for diabetes)" },
    { label: "Trial participants", value: "> 25,000 across STEP and SELECT programmes" },
    { label: "Licensed weight loss", value: "≈ 15% mean at 68 weeks (STEP 1)" },
    { label: "Prescription", value: "Required in UK, US, EU, AU, CA" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Wilding JPH et al. STEP 1. NEJM 2021", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2032183" },
    { label: "Garvey WT et al. STEP 5. Nat Med 2022", url: "https://www.nature.com/articles/s41591-022-02026-4" },
    { label: "Lincoff AM et al. SELECT. NEJM 2023", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2307563" },
    { label: "Wegovy Summary of Product Characteristics (UK)", url: "https://www.medicines.org.uk/emc/product/13800" },
    { label: "Wegovy US Prescribing Information (FDA, Aug 2025)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/215256s024lbl.pdf" },
    { label: "NICE TA875 — Semaglutide for managing overweight and obesity", url: "https://www.nice.org.uk/guidance/ta875" },
  ],
};
