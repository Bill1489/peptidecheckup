import type { Compound } from "../types";

/**
 * Tirzepatide (Mounjaro / Zepbound). Claims are derived from the UK SmPC,
 * the US prescribing information and the SURMOUNT / SURPASS trial papers
 * listed under `references`. Keep language neutral and non-prescriptive.
 */
export const tirzepatide: Compound = {
  slug: "tirzepatide",
  name: "Tirzepatide",
  aliases: ["Mounjaro", "Zepbound", "LY3298176", "Tirz"],
  family: "incretin",
  classLabel: "Dual GIP/GLP-1 receptor agonist",
  tagline: "Once-weekly dual incretin with the largest weight loss among authorised medicines",
  summary:
    "Tirzepatide is a once-weekly dual glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist authorised for type 2 diabetes and for chronic weight management (Mounjaro in the UK, EU and Australia; Zepbound in the US and Canada). In SURMOUNT-1 the 15 mg dose produced a mean 20.9% body-weight reduction at 72 weeks, and the 2025 SURMOUNT-5 head-to-head trial reported greater weight loss than semaglutide 2.4 mg.",
  mechanism:
    "Activates both GIP and GLP-1 receptors: enhances glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying and reduces appetite and food intake through central pathways. GIP receptor activity appears to add to the appetite and energy-balance effects and may improve gastrointestinal tolerability of GLP-1 receptor activation.",
  goals: [
    {
      goal: "weight_management",
      evidence: "strong",
      summary:
        "In SURMOUNT-1 (n = 2,539), 5, 10 and 15 mg weekly produced mean weight reductions of 15.0%, 19.5% and 20.9% at 72 weeks versus 3.1% with placebo. In SURMOUNT-5 (n = 751) tirzepatide produced 20.2% weight loss versus 13.7% with semaglutide 2.4 mg at 72 weeks.",
    },
    {
      goal: "fat_loss",
      evidence: "moderate",
      summary:
        "In the SURMOUNT-1 DXA sub-study, total fat mass fell by approximately a third (33.9% versus 8.2% with placebo) and roughly three times as much fat as lean mass was lost; lean mass still declined, so resistance training and adequate protein intake are usually advised.",
    },
    {
      goal: "longevity",
      evidence: "moderate",
      summary:
        "SURPASS-CVOT (n ≈ 13,300, type 2 diabetes with cardiovascular disease) showed tirzepatide was non-inferior to dulaglutide for major adverse cardiovascular events with lower all-cause mortality; SUMMIT (n = 731) reduced worsening heart failure in obesity-related HFpEF. There is no placebo-controlled cardiovascular-outcome trial yet (SURMOUNT-MMO is ongoing).",
    },
    {
      goal: "sleep",
      evidence: "moderate",
      summary:
        "In SURMOUNT-OSA (two trials, n = 469) tirzepatide reduced the apnoea–hypopnoea index by roughly 25–29 events per hour versus about 5 with placebo at 52 weeks in adults with obesity and moderate-to-severe obstructive sleep apnoea, and is FDA-approved for that indication. There is no evidence for sleep quality in people without sleep apnoea.",
    },
  ],
  overallEvidence: "strong",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "authorised",
      summary: "Authorised (MHRA) for type 2 diabetes and weight management (Mounjaro); prescription-only.",
      detail:
        "Mounjaro is licensed for type 2 diabetes and, since November 2023, for weight management in adults with BMI ≥ 30, or ≥ 27 with a weight-related comorbidity. NICE TA1026 (December 2024) recommends it for adults with BMI ≥ 35 and at least one weight-related comorbidity, with a phased NHS roll-out that began in primary care in June 2025. Prescription-only medicine.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "authorised",
      summary: "FDA-approved (Mounjaro for type 2 diabetes; Zepbound for weight management and obstructive sleep apnoea); prescription-only.",
      detail:
        "Mounjaro was approved in May 2022 for type 2 diabetes. Zepbound was approved in November 2023 for chronic weight management and in December 2024 for moderate-to-severe obstructive sleep apnoea in adults with obesity. The FDA declared the tirzepatide shortage resolved in December 2024; compounded tirzepatide is not FDA-approved, and the agency has warned about counterfeit Mounjaro pens.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "authorised",
      summary: "Authorised by the European Commission (EMA) for type 2 diabetes and weight management (Mounjaro); prescription-only.",
      detail:
        "Mounjaro received EU marketing authorisation for type 2 diabetes in September 2022 and for weight management in December 2023; there is no separate Zepbound brand in the EU. National reimbursement for weight management varies and is often limited.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "authorised",
      summary: "TGA-registered (Mounjaro) for type 2 diabetes and chronic weight management; prescription-only.",
      detail:
        "Mounjaro was first registered on the ARTG in December 2022 for type 2 diabetes; the chronic weight management indication was added in September 2024. It is not subsidised on the PBS for weight management.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "authorised",
      summary: "Health Canada-approved (Mounjaro for type 2 diabetes; Zepbound for weight management); prescription-only.",
      detail:
        "Mounjaro was approved in November 2022 for type 2 diabetes. Zepbound KwikPen received a Notice of Compliance for chronic weight management in May 2025 and became available in July 2025.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Authorised in a growing number of countries; check your national regulator.",
      detail:
        "Tirzepatide is authorised under the Mounjaro or Zepbound brands in many countries, but indications, brands and prescribing rules differ. Verify with your national medicines regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "SURMOUNT-1 — once-weekly tirzepatide in adults with obesity",
      citation: "Jastreboff AM et al., N Engl J Med 2022;387:205–216",
      year: 2022,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults without diabetes with BMI ≥ 30, or ≥ 27 with ≥ 1 weight-related complication",
      n: 2539,
      duration: "72 weeks",
      doses:
        "Started at 2.5 mg once weekly and increased by 2.5 mg every 4 weeks to maintenance doses of 5, 10 or 15 mg once weekly",
      route: "subcutaneous",
      outcome:
        "Mean weight change −15.0% (5 mg), −19.5% (10 mg) and −20.9% (15 mg) vs −3.1% with placebo; 85–91% lost ≥ 5% vs 35%.",
      adverseEvents:
        "Gastrointestinal events most common (nausea in roughly 25–33% vs 9.5%; diarrhoea, vomiting, constipation), mostly mild-to-moderate and concentrated during dose escalation; discontinuation for adverse events 4.3–7.1% vs 2.6%; hair loss reported in around 5% vs 1%.",
      exposure: { doseMin: 2.5, doseMax: 15, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038",
    },
    {
      title: "SURMOUNT-2 — tirzepatide in adults with obesity and type 2 diabetes",
      citation: "Garvey WT et al., Lancet 2023;402:613–626",
      year: 2023,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults with type 2 diabetes and BMI ≥ 27",
      n: 938,
      duration: "72 weeks",
      doses: "10 mg or 15 mg once weekly after escalation from 2.5 mg in 2.5 mg steps every 4 weeks",
      route: "subcutaneous",
      outcome:
        "Mean weight change −12.8% (10 mg) and −14.7% (15 mg) vs −3.2% with placebo; HbA1c fell by approximately 2.1 percentage points vs 0.5 with placebo.",
      adverseEvents:
        "Gastrointestinal events most common and mostly mild-to-moderate; discontinuation for adverse events approximately 4–7% vs 4%; hypoglycaemia was uncommon in the absence of insulin or sulfonylureas.",
      exposure: { doseMin: 10, doseMax: 15, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://doi.org/10.1016/S0140-6736(23)01200-X",
    },
    {
      title: "SURMOUNT-5 — tirzepatide versus semaglutide in adults with obesity",
      citation: "Aronne LJ et al., N Engl J Med 2025;393:26–36",
      year: 2025,
      phase: "Phase 3b",
      design: "Randomised, open-label, active-controlled",
      population: "Adults with obesity (BMI ≥ 30, or ≥ 27 with a weight-related complication) without type 2 diabetes",
      n: 751,
      duration: "72 weeks",
      doses:
        "Maximum tolerated dose of tirzepatide (10 or 15 mg once weekly) vs maximum tolerated dose of semaglutide (1.7 or 2.4 mg once weekly)",
      route: "subcutaneous",
      outcome:
        "Mean weight change −20.2% with tirzepatide vs −13.7% with semaglutide (difference −6.5 percentage points); waist circumference −18.4 cm vs −13.0 cm.",
      adverseEvents:
        "Gastrointestinal events most common in both groups, mostly mild-to-moderate and occurring mainly during dose escalation; discontinuation for adverse events 6.1% with tirzepatide vs 8.0% with semaglutide.",
      exposure: { doseMin: 10, doseMax: 15, unit: "mg", frequency: "weekly", route: "subcutaneous" },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2416394",
    },
  ],
  contraindications: [
    {
      conditionId: "mtc_men2",
      severity: "absolute",
      note: "The US label contraindicates use with a personal or family history of medullary thyroid carcinoma or MEN2 (boxed warning based on rodent thyroid C-cell tumours); UK labelling carries a thyroid warning.",
    },
    {
      conditionId: "thyroid",
      severity: "caution",
      note: "Thyroid disease itself is not a contraindication, but any thyroid cancer history must be clarified; levothyroxine absorption can change as gastric emptying slows.",
    },
    {
      conditionId: "pancreatitis_history",
      severity: "absolute",
      note: "Not studied in people with a history of pancreatitis; labels advise caution or alternative treatment. Acute pancreatitis, including necrotising and fatal cases, has been reported post-marketing.",
    },
    {
      conditionId: "pancreatic",
      severity: "caution",
      note: "Pancreatic disease warrants specialist assessment before considering any incretin medicine.",
    },
    {
      conditionId: "gallbladder",
      severity: "caution",
      note: "Cholelithiasis and cholecystitis occur more often with rapid weight loss and were more frequent than placebo in trials.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Hypoglycaemia risk rises with insulin or sulfonylureas, whose doses are usually reduced; type 1 diabetes is outside the licence.",
    },
    {
      conditionId: "diabetic_retinopathy",
      severity: "caution",
      note: "Rapid improvement in glucose control has been associated with temporary worsening of diabetic retinopathy; labels advise close monitoring.",
    },
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Acute kidney injury has been reported, usually with dehydration from vomiting or diarrhoea; hydration should be maintained.",
    },
    {
      conditionId: "gastrointestinal",
      severity: "caution",
      note: "Not studied in severe gastrointestinal disease; slowed gastric emptying may worsen symptoms.",
    },
    {
      conditionId: "gastroparesis",
      severity: "absolute",
      note: "Not studied in severe gastroparesis and expected to slow gastric emptying further; labels advise against use.",
    },
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "Weight-management labelling advises monitoring for depression or suicidal thoughts; discuss any mental-health history.",
    },
    {
      conditionId: "eating_disorder",
      severity: "caution",
      note: "Appetite-suppressing medicines require specialist assessment where there is a current or previous eating disorder.",
    },
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "Resting heart rate rises by a few beats per minute on average, and hypotension-related events were reported in weight-management trials; arrhythmia and heart-failure history should be reviewed.",
    },
  ],
  interactions: [
    {
      classId: "insulin",
      severity: "major",
      note: "Combined use increases hypoglycaemia risk; labels recommend a stepwise insulin reduction with glucose self-monitoring.",
    },
    {
      classId: "sulfonylurea",
      severity: "major",
      note: "Combined use increases hypoglycaemia risk; sulfonylurea dose reduction is usually considered.",
    },
    {
      classId: "glp1_agonist",
      severity: "major",
      note: "Should not be combined with another GLP-1 or GIP/GLP-1 medicine — duplicate mechanism with no safety data.",
    },
    {
      classId: "oral_contraceptive",
      severity: "moderate",
      note: "Tirzepatide reduces oral-contraceptive exposure (ethinylestradiol peak concentration fell by 59% and total exposure by 20% in a single-dose study). Labels advise switching to a non-oral method or adding a barrier method for 4 weeks after starting and for 4 weeks after each dose increase.",
    },
    {
      classId: "anticoagulant",
      severity: "moderate",
      note: "Delayed gastric emptying can alter absorption; closer INR monitoring is prudent when starting or changing dose alongside warfarin.",
    },
    {
      classId: "thyroid_hormone",
      severity: "moderate",
      note: "Levothyroxine exposure may change with slowed gastric emptying; thyroid function should be monitored.",
    },
    {
      classId: "narrow_therapeutic_index",
      severity: "moderate",
      note: "Medicines that depend on rapid absorption or have a narrow therapeutic window may need closer monitoring during dose escalation.",
    },
    {
      classId: "antihypertensive",
      severity: "minor",
      note: "Weight loss lowers blood pressure and hypotension-related events were reported in weight-management trials; blood-pressure medicines may need review.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "minor",
      note: "Generally compatible with metformin and SGLT2 inhibitors; glucose monitoring advised when combined.",
    },
  ],
  pregnancy: {
    status: "not_recommended",
    note: "Not recommended in pregnancy or while breastfeeding; animal studies showed reproductive toxicity. UK labelling advises stopping at least one month before a planned pregnancy because of the long half-life, and notes that oral-contraceptive effectiveness may be reduced.",
  },
  commonAdverseEffects: [
    "Nausea",
    "Diarrhoea",
    "Vomiting",
    "Constipation",
    "Dyspepsia and abdominal pain",
    "Reduced appetite and early satiety",
    "Injection-site reactions",
    "Fatigue",
    "Dizziness and low blood pressure symptoms",
    "Hair loss (reported in around 5% in weight-management trials)",
  ],
  seriousAdverseEffects: [
    "Acute pancreatitis (including necrotising and fatal post-marketing reports)",
    "Gallbladder disease (gallstones, cholecystitis)",
    "Acute kidney injury from dehydration",
    "Severe hypoglycaemia when combined with insulin or sulfonylureas",
    "Worsening of diabetic retinopathy",
    "Increased heart rate",
    "Severe allergic reactions including anaphylaxis and angioedema (rare)",
    "Aspiration during anaesthesia due to retained stomach contents (label warning)",
  ],
  monitoring: [
    "Weight and BMI trend against the licensed eligibility criteria (labels ask for a review if < 5% is lost after 6 months on the highest tolerated dose)",
    "Gastrointestinal tolerability at every 2.5 mg dose step",
    "Contraception method for 4 weeks after starting and after each dose increase",
    "Blood glucose if on insulin or sulfonylureas",
    "Hydration and kidney function during vomiting or diarrhoea",
    "Heart rate, blood pressure and mood",
    "Muscle mass and protein intake during rapid weight loss",
  ],
  sourceConsiderations: [
    "Prescription-only medicine in every major jurisdiction — legitimate supply requires a prescription from a licensed prescriber.",
    "The MHRA and FDA have issued warnings about counterfeit Mounjaro pens and unregulated online sellers.",
    "Compounded or 'research-grade' tirzepatide vials are not the authorised product; since the FDA declared the shortage resolved in December 2024, routine compounding of copies is not permitted in the US.",
  ],
  clinicianQuestions: [
    "Do I meet the licensed eligibility criteria (BMI and weight-related conditions) in my country?",
    "How will my other medicines — especially diabetes medicines, blood thinners or the contraceptive pill — be adjusted?",
    "What is the plan for the 2.5 mg dose steps and for managing nausea or constipation?",
    "How will we protect muscle mass while I lose weight?",
    "What happens when treatment stops, and is there a maintenance plan?",
  ],
  alternatives: ["semaglutide", "liraglutide"],
  stackNotes: [
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Both are incretin-based appetite and glucose medicines acting on GLP-1 receptors.",
      note: "Combining two incretin medicines duplicates mechanism, has no safety data and is outside every licence.",
    },
    {
      with: "liraglutide",
      evidence: "none",
      overlap: "Both act on GLP-1 receptors.",
      note: "Duplicate mechanism — two incretin medicines should not be combined.",
    },
    {
      with: "retatrutide",
      evidence: "none",
      overlap: "Retatrutide already includes GIP and GLP-1 receptor activity.",
      note: "No rationale or data for combining; retatrutide is itself unauthorised.",
    },
    {
      with: "cagrilintide",
      evidence: "none",
      overlap: "Both reduce appetite and slow gastric emptying.",
      note: "Cagrilintide has only been studied with semaglutide (CagriSema); there are no human data on combining it with tirzepatide.",
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
      note: "No human studies of incretin medicines combined with growth-hormone secretagogues.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      note: "No human studies of incretin medicines combined with growth-hormone secretagogues.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "No human data on this combination; BPC-157 itself lacks human efficacy data.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Dual GIP/GLP-1 receptor agonist" },
    { label: "Route", value: "Weekly subcutaneous injection" },
    { label: "Trial participants", value: "> 15,000 adults exposed across 14 completed phase 3 studies" },
    { label: "Licensed weight loss", value: "≈ 21% mean at 72 weeks (SURMOUNT-1, 15 mg)" },
    { label: "Prescription", value: "Required in UK, US, EU, AU, CA" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Jastreboff AM et al. SURMOUNT-1. NEJM 2022", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038" },
    { label: "Garvey WT et al. SURMOUNT-2. Lancet 2023", url: "https://doi.org/10.1016/S0140-6736(23)01200-X" },
    { label: "Aronne LJ et al. SURMOUNT-5. NEJM 2025", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2416394" },
    { label: "Malhotra A et al. SURMOUNT-OSA. NEJM 2024", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2404881" },
    { label: "Mounjaro KwikPen Summary of Product Characteristics (UK)", url: "https://www.medicines.org.uk/emc/product/15481" },
    { label: "NICE TA1026 — Tirzepatide for managing overweight and obesity", url: "https://www.nice.org.uk/guidance/ta1026" },
  ],
};
