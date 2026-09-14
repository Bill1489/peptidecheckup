import type { Compound } from "../types";

/**
 * Liraglutide (Saxenda / Victoza and generics). Claims are derived from the
 * UK SmPC, the US prescribing information and the SCALE / LEADER trial papers
 * listed under `references`. Keep language neutral and non-prescriptive.
 */
export const liraglutide: Compound = {
  slug: "liraglutide",
  name: "Liraglutide",
  aliases: ["Saxenda", "Victoza", "Lira", "Biolide"],
  family: "incretin",
  classLabel: "GLP-1 receptor agonist",
  tagline: "Once-daily GLP-1 medicine with a decade of use and generic versions",
  summary:
    "Liraglutide is a once-daily GLP-1 receptor agonist authorised for type 2 diabetes (Victoza, 1.2–1.8 mg) and, at 3.0 mg daily, for weight management in adults and adolescents from 12 years (Saxenda). It was the first GLP-1 medicine licensed for obesity, has cardiovascular-outcome data in type 2 diabetes (LEADER), and generic versions are now authorised in the UK, EU and US. Weight loss is smaller than with the newer weekly incretin medicines.",
  mechanism:
    "Mimics the gut hormone GLP-1 with a half-life of about 13 hours (a fatty-acid side chain binds albumin and slows breakdown): increases glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying and reduces appetite through hypothalamic and brainstem pathways.",
  goals: [
    {
      goal: "weight_management",
      evidence: "strong",
      summary:
        "In SCALE Obesity and Prediabetes (n = 3,731), 3.0 mg daily produced a mean 8.0% weight loss at 56 weeks versus 2.6% with placebo; 63.2% lost ≥ 5% versus 27.1%. In the head-to-head STEP 8 trial, semaglutide 2.4 mg weekly produced 15.8% weight loss versus 6.4% with liraglutide 3.0 mg.",
    },
    {
      goal: "fat_loss",
      evidence: "moderate",
      summary:
        "SCALE body-composition sub-studies reported that weight lost was predominantly fat mass with a smaller reduction in lean mass; in a dedicated MRI trial (n = 185) visceral fat fell by approximately 12% versus 2% with placebo at 40 weeks.",
    },
    {
      goal: "longevity",
      evidence: "moderate",
      summary:
        "LEADER (n = 9,340) in type 2 diabetes at high cardiovascular risk showed a 13% relative reduction in major adverse cardiovascular events (HR 0.87) and a 22% reduction in cardiovascular death over a median 3.8 years with 1.8 mg daily. There is no cardiovascular-outcome trial of the 3.0 mg dose in people without diabetes.",
    },
    {
      goal: "general_wellbeing",
      evidence: "limited",
      summary:
        "Weight-related quality-of-life and physical-function scores improved modestly in SCALE trials; no direct evidence for energy or fatigue as a primary outcome.",
    },
  ],
  overallEvidence: "strong",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "authorised",
      summary: "Authorised (MHRA) for type 2 diabetes (Victoza) and weight management (Saxenda and generics); prescription-only.",
      detail:
        "Saxenda 3.0 mg is licensed for weight management in adults with BMI ≥ 30, or ≥ 27 with a weight-related comorbidity, and in adolescents from 12 years with obesity. NICE TA664 (2020) recommends it within specialist weight-management services for adults with BMI ≥ 35 (≥ 32.5 in some ethnic groups), non-diabetic hyperglycaemia and high cardiovascular risk. Generic liraglutide products have been authorised since 2024. Prescription-only medicine.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "authorised",
      summary: "FDA-approved (Victoza, Saxenda and generic liraglutide); prescription-only.",
      detail:
        "Victoza was approved for type 2 diabetes in 2010. Saxenda was approved for chronic weight management in adults in December 2014 and in adolescents aged 12–17 in December 2020. Generic liraglutide referencing Victoza was approved in 2024 and the first generic of Saxenda in August 2025.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "authorised",
      summary: "Authorised by the European Commission (EMA) (Victoza, Saxenda and generics); prescription-only.",
      detail:
        "Victoza was authorised in 2009 and Saxenda in March 2015; the first generic liraglutide products received EU authorisation in 2024. National reimbursement for weight management is limited.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "authorised",
      summary: "TGA-registered (Victoza, Saxenda); prescription-only.",
      detail:
        "Liraglutide was first registered in Australia in 2010 (Victoza); Saxenda is registered for chronic weight management. Neither is PBS-subsidised for weight management.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "authorised",
      summary: "Health Canada-approved (Victoza, Saxenda); prescription-only.",
      detail: "Victoza was approved for type 2 diabetes in 2010 and Saxenda for chronic weight management in 2015.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Authorised in many countries; check your national regulator.",
      detail:
        "Liraglutide is approved for diabetes and, in many markets, for weight management, but brands, indications and prescribing rules differ. Verify with your national medicines regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "SCALE Obesity and Prediabetes — liraglutide 3.0 mg in adults without diabetes",
      citation: "Pi-Sunyer X et al., N Engl J Med 2015;373:11–22",
      year: 2015,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults without diabetes with BMI ≥ 30, or ≥ 27 with dyslipidaemia or hypertension",
      n: 3731,
      duration: "56 weeks",
      doses: "0.6 mg once daily, increased by 0.6 mg each week over 5 weeks to 3.0 mg once daily",
      route: "subcutaneous",
      outcome:
        "Mean weight change −8.0% (8.4 kg) vs −2.6% (2.8 kg) with placebo; 63.2% lost ≥ 5% vs 27.1%; 33.1% lost ≥ 10% vs 10.6%.",
      adverseEvents:
        "Nausea (40.2% vs 14.7%), diarrhoea, constipation and vomiting most common, mostly mild-to-moderate and transient; discontinuation for adverse events 9.9% vs 3.8%; gallbladder-related events and a small number of pancreatitis cases were more frequent with liraglutide.",
      exposure: { doseMin: 0.6, doseMax: 3.0, unit: "mg", frequency: "daily", route: "subcutaneous" },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1411892",
    },
    {
      title: "SCALE Diabetes — liraglutide 3.0 mg and 1.8 mg in adults with type 2 diabetes",
      citation: "Davies MJ et al., JAMA 2015;314:687–699",
      year: 2015,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults with type 2 diabetes and BMI ≥ 27",
      n: 846,
      duration: "56 weeks",
      doses: "3.0 mg or 1.8 mg once daily after weekly 0.6 mg escalation steps",
      route: "subcutaneous",
      outcome:
        "Mean weight change −6.0% (3.0 mg) and −4.7% (1.8 mg) vs −2.0% with placebo; HbA1c fell by approximately 1.3 and 1.1 percentage points vs 0.3.",
      adverseEvents:
        "Gastrointestinal events most common; hypoglycaemia more frequent than placebo, mainly in people also taking sulfonylureas; small numbers of pancreatitis and gallbladder events.",
      exposure: { doseMin: 1.8, doseMax: 3.0, unit: "mg", frequency: "daily", route: "subcutaneous" },
      url: "https://doi.org/10.1001/jama.2015.9676",
    },
    {
      title: "LEADER — cardiovascular outcomes with liraglutide in type 2 diabetes",
      citation: "Marso SP et al., N Engl J Med 2016;375:311–322",
      year: 2016,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled, event-driven",
      population: "Adults with type 2 diabetes at high cardiovascular risk",
      n: 9340,
      duration: "Median 3.8 years",
      doses: "1.8 mg once daily (or maximum tolerated dose) added to standard care",
      route: "subcutaneous",
      outcome:
        "Major adverse cardiovascular events 13.0% vs 14.9% (HR 0.87, 95% CI 0.78–0.97); cardiovascular death HR 0.78; all-cause death HR 0.85.",
      adverseEvents:
        "Gastrointestinal events leading to discontinuation were more frequent; acute gallstone disease 3.1% vs 1.9%; acute pancreatitis was not increased (0.4% vs 0.5%).",
      exposure: { doseMin: 1.8, doseMax: 1.8, unit: "mg", frequency: "daily", route: "subcutaneous" },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1603827",
    },
  ],
  contraindications: [
    {
      conditionId: "mtc_men2",
      severity: "absolute",
      note: "The US label contraindicates use with a personal or family history of medullary thyroid carcinoma or MEN2 (boxed warning based on rodent thyroid C-cell tumours).",
    },
    {
      conditionId: "thyroid",
      severity: "caution",
      note: "Thyroid adverse events such as goitre were reported in diabetes trials, particularly with pre-existing thyroid disease; the UK SmPC advises caution and any thyroid cancer history must be clarified.",
    },
    {
      conditionId: "pancreatitis_history",
      severity: "absolute",
      note: "Not studied in people with a history of pancreatitis; labels advise caution or alternative treatment. Acute pancreatitis, including necrotising and fatal cases, has been reported with GLP-1 receptor agonists.",
    },
    {
      conditionId: "pancreatic",
      severity: "caution",
      note: "Pancreatic disease warrants specialist assessment before considering any GLP-1 medicine.",
    },
    {
      conditionId: "gallbladder",
      severity: "caution",
      note: "Cholelithiasis and cholecystitis were more frequent than placebo in weight-management trials and occur more often with rapid weight loss.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Hypoglycaemia risk rises with insulin or sulfonylureas; Saxenda is not a substitute for insulin and type 1 diabetes is outside the licence.",
    },
    {
      conditionId: "diabetic_retinopathy",
      severity: "caution",
      note: "Rapid improvement in glucose control has been associated with temporary worsening of diabetic retinopathy in people with type 2 diabetes.",
    },
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Acute kidney injury has been reported, usually with dehydration from vomiting or diarrhoea; Saxenda is not recommended in end-stage kidney disease.",
    },
    {
      conditionId: "liver",
      severity: "caution",
      note: "Experience in severe hepatic impairment is limited and use is not recommended by the UK SmPC.",
    },
    {
      conditionId: "gastrointestinal",
      severity: "caution",
      note: "Not studied in inflammatory bowel disease or severe gastrointestinal disease; slowed gastric emptying may worsen symptoms.",
    },
    {
      conditionId: "gastroparesis",
      severity: "absolute",
      note: "Not recommended in gastroparesis — further slowing of gastric emptying is expected.",
    },
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "Resting heart rate rises by 2–3 bpm on average; the SmPC advises stopping if a clinically relevant sustained increase occurs. Not studied in NYHA class IV heart failure.",
    },
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "Weight-management trials excluded people with major depression or recent suicidal ideation; labels advise monitoring for depression or suicidal thoughts.",
    },
    {
      conditionId: "eating_disorder",
      severity: "caution",
      note: "Appetite-suppressing medicines require specialist assessment where there is a current or previous eating disorder.",
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
      note: "The SmPC states Saxenda should not be used with another GLP-1 receptor agonist — duplicate mechanism with no safety data.",
    },
    {
      classId: "anticoagulant",
      severity: "moderate",
      note: "Delayed gastric emptying can alter absorption; more frequent INR monitoring is recommended when starting alongside warfarin.",
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
      note: "Liraglutide delayed absorption of a combined pill but did not reduce overall exposure to a clinically relevant degree; vomiting can still reduce pill effectiveness.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "minor",
      note: "Generally compatible with metformin; glucose monitoring advised when combined.",
    },
  ],
  pregnancy: {
    status: "not_recommended",
    note: "Should not be used during pregnancy; labels advise stopping if pregnancy occurs or is planned. Not recommended while breastfeeding. Because the half-life is about 13 hours, no prolonged wash-out period is specified.",
  },
  commonAdverseEffects: [
    "Nausea",
    "Diarrhoea",
    "Constipation",
    "Vomiting",
    "Dyspepsia and abdominal pain",
    "Headache",
    "Fatigue",
    "Dizziness",
    "Injection-site reactions",
    "Increased heart rate",
    "Hypoglycaemia (mainly with diabetes medicines)",
  ],
  seriousAdverseEffects: [
    "Acute pancreatitis (including necrotising and fatal post-marketing reports)",
    "Gallbladder disease (gallstones, cholecystitis)",
    "Acute kidney injury from dehydration",
    "Severe hypoglycaemia when combined with insulin or sulfonylureas",
    "Sustained increase in resting heart rate",
    "Severe allergic reactions including anaphylaxis and angioedema (rare)",
    "Aspiration during anaesthesia due to retained stomach contents (class warning)",
  ],
  monitoring: [
    "Weight and BMI trend — the SmPC advises stopping if less than 5% of body weight is lost after 12 weeks on 3.0 mg daily",
    "Gastrointestinal tolerability during the weekly 0.6 mg escalation steps",
    "Resting heart rate at routine reviews",
    "Blood glucose if on insulin or sulfonylureas",
    "Hydration and kidney function during vomiting or diarrhoea",
    "Thyroid function if on levothyroxine",
    "Mood and mental health",
  ],
  sourceConsiderations: [
    "Prescription-only medicine in every major jurisdiction — legitimate supply requires a prescription from a licensed prescriber.",
    "Authorised generic liraglutide pens (e.g. from Biocon or Teva) are regulated products; 'research-grade' liraglutide vials sold online are not.",
    "Regulators have warned about falsified GLP-1 pens sold through unregulated online sellers and social media.",
  ],
  clinicianQuestions: [
    "Do I meet the licensed eligibility criteria, and would a weekly medicine with larger weight loss be more appropriate for me?",
    "How will my diabetes medicines or blood thinners be adjusted?",
    "What is the plan for the weekly dose steps and for managing nausea?",
    "When will we review whether the 5% weight-loss threshold at 12 weeks has been met?",
    "What happens when treatment stops, and is there a maintenance plan?",
  ],
  alternatives: ["semaglutide", "tirzepatide"],
  stackNotes: [
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Both are GLP-1 receptor agonists.",
      note: "Duplicate mechanism — two incretin medicines should not be combined; labels state they must not be used together.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Both act on GLP-1 receptors.",
      note: "Duplicate mechanism with no safety data; outside every licence.",
    },
    {
      with: "retatrutide",
      evidence: "none",
      overlap: "Retatrutide already includes GLP-1 receptor activity.",
      note: "No rationale or data for combining; retatrutide is itself unauthorised.",
    },
    {
      with: "cagrilintide",
      evidence: "none",
      overlap: "Both reduce appetite and slow gastric emptying.",
      note: "Liraglutide 3.0 mg was the active comparator, not a partner, in the cagrilintide phase 2 trial; there are no human data on combining them.",
    },
    {
      with: "survodutide",
      evidence: "none",
      overlap: "Both include GLP-1 receptor activity.",
      note: "Duplicate incretin mechanism with no human data; survodutide is investigational.",
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
  ],
  keyFacts: [
    { label: "Class", value: "GLP-1 receptor agonist" },
    { label: "Route", value: "Daily subcutaneous injection" },
    { label: "Trial participants", value: "> 5,000 in SCALE; 9,340 in LEADER" },
    { label: "Licensed weight loss", value: "≈ 8% mean at 56 weeks (SCALE, 3.0 mg)" },
    { label: "Prescription", value: "Required in UK, US, EU, AU, CA" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Pi-Sunyer X et al. SCALE Obesity and Prediabetes. NEJM 2015", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1411892" },
    { label: "Davies MJ et al. SCALE Diabetes. JAMA 2015", url: "https://doi.org/10.1001/jama.2015.9676" },
    { label: "Marso SP et al. LEADER. NEJM 2016", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1603827" },
    { label: "Rubino DM et al. STEP 8 — semaglutide vs liraglutide. JAMA 2022", url: "https://doi.org/10.1001/jama.2021.23619" },
    { label: "Saxenda Summary of Product Characteristics (UK)", url: "https://www.medicines.org.uk/emc/product/2313" },
    { label: "NICE TA664 — Liraglutide for managing overweight and obesity", url: "https://www.nice.org.uk/guidance/ta664" },
  ],
};
