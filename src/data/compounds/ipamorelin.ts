import type { Compound } from "../types";

/**
 * Ipamorelin — selective ghrelin-receptor agonist (GH secretagogue).
 * Human data: one Phase 1 pharmacokinetic study (n = 8) and two Phase 2
 * trials in post-operative ileus (the published one negative). Claims are
 * derived from the papers, trial registry and FDA notices under `references`.
 */
export const ipamorelin: Compound = {
  slug: "ipamorelin",
  name: "Ipamorelin",
  aliases: ["Ipa", "NNC 26-0161", "Ipamorelin acetate", "CJC/Ipa"],
  family: "growth_hormone_axis",
  classLabel: "Selective ghrelin-receptor agonist (GH secretagogue pentapeptide)",
  tagline: "Selective GH secretagogue that failed its only published efficacy trial",
  summary:
    "Ipamorelin is a synthetic five-amino-acid peptide developed by Novo Nordisk that releases growth hormone by activating the ghrelin receptor, with little effect on cortisol or prolactin. Its human development — a Phase 1 pharmacokinetic study and two Phase 2 trials for post-operative bowel paralysis — ended after the published trial showed no benefit over placebo. It has never been authorised as a medicine and is sold as an unregulated research chemical, usually marketed with CJC-1295 for muscle, recovery and sleep despite no clinical trials for any of those uses.",
  mechanism:
    "Activates the growth-hormone-secretagogue (ghrelin) receptor GHS-R1a on pituitary cells and in the hypothalamus, producing a single pulse of GH release that peaks about 40 minutes after a dose; unlike older GH-releasing peptides it does not meaningfully raise ACTH, cortisol or prolactin. Its half-life after intravenous dosing is around two hours, and as a ghrelin mimetic it may also increase appetite and gut motility.",
  goals: [
    {
      goal: "muscle_recovery",
      evidence: "insufficient",
      summary:
        "No human study has measured muscle mass, strength or recovery; the only human data are GH release in eight volunteers and a bowel-recovery trial that showed no benefit.",
    },
    {
      goal: "injury_recovery",
      evidence: "insufficient",
      summary: "No human data for injury or tissue healing; claims rest on the general role of GH in tissue growth.",
    },
    {
      goal: "sleep",
      evidence: "insufficient",
      summary:
        "Marketed for deeper sleep on the basis that GH is normally released during slow-wave sleep; no trial has measured sleep with ipamorelin.",
    },
    {
      goal: "fat_loss",
      evidence: "insufficient",
      summary: "No human body-composition data; as a ghrelin mimetic it may increase appetite rather than reduce fat.",
    },
  ],
  overallEvidence: "preliminary",
  humanEvidenceLevel: "early_clinical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail: "No MHRA licence has ever been applied for. Products sold online are labelled 'not for human consumption' and sit outside medicines quality controls.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved and not eligible for pharmacy compounding; sold only as an unregulated 'research chemical'.",
      detail:
        "In September 2023 the FDA placed ipamorelin in Category 2 of its interim 503A bulk-substances list (significant safety risks), citing immunogenicity and limited safety data. The 503A nomination was withdrawn in September 2024, and at its October 2024 meeting the FDA's Pharmacy Compounding Advisory Committee did not recommend adding ipamorelin to the list of substances that may be compounded; it remains in Category 2 for 503B outsourcing facilities. The FDA has issued warning letters over CJC-1295/ipamorelin products marketed with therapeutic claims.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail: "Not on the ARTG. Peptide GH secretagogues have been scheduled as prescription-only (Schedule 4) substances in the Poisons Standard, so unprescribed importation and supply are unlawful.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Not known to be authorised in any country; check your national regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: true,
  routes: ["subcutaneous", "intravenous"],
  dosingResearch: [
    {
      title: "Pharmacokinetic–pharmacodynamic study of intravenous ipamorelin in healthy men",
      citation: "Gobburu JVS et al., Pharm Res 1999;16:1412–1416",
      year: 1999,
      phase: "Phase 1",
      design: "Open-label, escalating single intravenous infusions",
      population: "Healthy male volunteers",
      n: 8,
      duration: "Single doses",
      doses: "Five escalating single intravenous infusions",
      route: "intravenous",
      outcome:
        "Dose-proportional kinetics with a terminal half-life of about two hours; each dose produced a single GH release episode peaking at about 0.67 hours. Variability in GH response between individuals exceeded variability in drug levels.",
      adverseEvents: "Not reported in detail in the abstract; the study was designed to characterise kinetics rather than safety.",
    },
    {
      title: "Phase 2 proof-of-concept — ipamorelin for post-operative ileus after bowel resection",
      citation: "Beck DE et al., Int J Colorectal Dis 2014;29:1527–1534 (Ipamorelin 201 Study Group)",
      year: 2014,
      phase: "Phase 2",
      design: "Randomised, double-blind, placebo-controlled, multicentre",
      population: "Adults recovering from partial bowel resection (114 in the analysis populations)",
      n: 117,
      duration: "Up to 7 days or hospital discharge",
      doses: "0.03 mg/kg intravenously twice daily from post-operative day 1",
      route: "intravenous",
      outcome:
        "Median time to first tolerated meal 25.3 h with ipamorelin vs 32.6 h with placebo (p = 0.15) — not statistically significant; no significant differences in key or secondary efficacy outcomes.",
      adverseEvents:
        "Well tolerated; treatment-emergent adverse events in 87.5% vs 94.8% (mostly surgery-related) with no safety signal attributable to ipamorelin.",
      exposure: { doseMin: 0.03, doseMax: 0.03, unit: "mg/kg", frequency: "twice_daily", route: "intravenous" },
      url: "https://pubmed.ncbi.nlm.nih.gov/25331030/",
    },
  ],
  dosingResearchNote:
    "No published human study has given ipamorelin subcutaneously or for longer than seven days, and none has measured GH-related outcomes such as body composition. A second, larger Phase 2 dose-finding trial in post-operative ileus (NCT01280344, n = 320) completed in 2014 without published results, and Helsinn discontinued development. The 200–300 µg subcutaneous doses used in online protocols have never been evaluated in a trial.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "absolute",
      note: "Raises GH and IGF-1, which are growth factors; any active or previous malignancy should be regarded as excluding use.",
    },
    {
      conditionId: "acromegaly",
      severity: "absolute",
      note: "Further stimulation of GH release in acromegaly or with a pituitary tumour is inappropriate.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "GH pulses raise glucose transiently and sustained use may worsen insulin resistance; no glucose data exist beyond seven days.",
    },
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Requires a functioning pituitary; pituitary or adrenal disorders need endocrine assessment first.",
    },
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "Ghrelin-receptor agonists influence heart rate, blood pressure and fluid balance; there are no cardiovascular safety data for repeated use.",
    },
  ],
  interactions: [
    {
      classId: "growth_hormone",
      severity: "major",
      note: "Duplicate GH-axis stimulation with additive IGF-1 exposure; injected GH also suppresses the pituitary response ipamorelin depends on.",
    },
    {
      classId: "insulin",
      severity: "moderate",
      note: "GH opposes insulin; glucose monitoring is advised if used repeatedly.",
    },
    {
      classId: "sulfonylurea",
      severity: "minor",
      note: "Glucose control may shift; monitoring advised.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "minor",
      note: "Glucose-lowering effect may be partly offset; monitoring advised.",
    },
    {
      classId: "corticosteroid",
      severity: "moderate",
      note: "Glucocorticoids blunt GH release and raise glucose; GH increases cortisol clearance, so replacement doses may need review.",
    },
    {
      classId: "testosterone",
      severity: "minor",
      note: "Frequently combined in 'performance' regimens; androgens amplify IGF-1 responses to GH, and there are no safety data for the combination.",
    },
    {
      classId: "thyroid_hormone",
      severity: "minor",
      note: "Thyroid status affects the GH response; ensure replacement is stable.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or published animal reproductive data. Use in pregnancy or while breastfeeding cannot be supported for an unlicensed product with no safety database.",
  },
  commonAdverseEffects: [
    "Headache",
    "Flushing or warmth after injection",
    "Increased appetite (ghrelin-receptor effect)",
    "Transient rise in blood glucose",
    "Injection-site pain or redness",
    "Nausea",
    "Light-headedness",
    "Water retention with repeated dosing",
  ],
  seriousAdverseEffects: [
    "Glucose intolerance or diabetes with sustained GH elevation (theoretical; no long-term data)",
    "Fluid retention, joint pain and carpal tunnel syndrome (GH excess)",
    "Possible acceleration of an existing malignancy",
    "Immunogenicity and allergic reactions — the specific FDA safety concern for compounded ipamorelin",
    "Contamination or wrong-dose harms from unregulated vials",
    "Unknown effects of chronic use — no human exposure beyond seven days has been published",
  ],
  monitoring: [
    "IGF-1 at baseline and periodically",
    "Fasting glucose and HbA1c",
    "Weight and appetite changes",
    "Blood pressure, swelling and joint symptoms",
    "Injection-site reactions and any signs of allergy",
    "Age-appropriate cancer screening",
  ],
  sourceConsiderations: [
    "Not a licensed medicine anywhere and not eligible for US pharmacy compounding after the 2023–2024 FDA review; the only supply is unregulated 'research chemical' vials.",
    "'CJC/Ipa' blends are sold as a single vial with undisclosed or unverified ratios — independent testing of research-chemical peptides frequently finds mislabelled identity and potency.",
    "The FDA cited immunogenicity and reported serious adverse events in keeping ipamorelin in Category 2 for outsourcing facilities.",
    "Products labelled 'not for human consumption' carry no sterility, endotoxin or potency assurance.",
  ],
  clinicianQuestions: [
    "Is there any documented GH deficiency that would justify GH-axis stimulation, and if so why not a licensed treatment?",
    "What outcome are we expecting, given that no human study has measured muscle, recovery or sleep with ipamorelin?",
    "What are my baseline IGF-1, glucose and HbA1c, and how often would they be rechecked?",
    "Do I have any cancer, pituitary, diabetes or cardiovascular history that changes the risk?",
    "What do we know about the identity and purity of the specific product, especially if it is a CJC/Ipa blend?",
    "Am I subject to anti-doping rules in any sport?",
  ],
  alternatives: ["tesamorelin", "somatropin"],
  stackNotes: [
    {
      with: "cjc-1295",
      evidence: "limited",
      overlap: "Both raise GH and IGF-1 — ipamorelin via the ghrelin receptor and CJC-1295 via the GHRH receptor.",
      note: "The most commonly co-used pair ('CJC/Ipa'). GHRH and ghrelin-receptor agonists release GH synergistically in short physiology studies, which is the rationale, but no clinical trial has tested this combination for any outcome or its safety; the FDA has described it as an unapproved novel drug combination.",
    },
    {
      with: "sermorelin",
      evidence: "none",
      overlap: "Both raise GH and IGF-1 via complementary receptors.",
      note: "Commonly co-marketed as 'Sermorelin/Ipamorelin'; no clinical trial has tested the combination.",
    },
    {
      with: "tesamorelin",
      evidence: "none",
      overlap: "Both raise GH and IGF-1 via complementary receptors.",
      note: "No human data; additive IGF-1 exposure and glucose effects are expected.",
    },
    {
      with: "somatropin",
      evidence: "none",
      overlap: "Duplicate GH-axis stimulation; injected GH suppresses the pituitary response ipamorelin depends on.",
      note: "No rationale or data; IGF-1 and glucose effects would be additive.",
    },
    {
      with: "igf-1-lr3",
      evidence: "none",
      overlap: "Additive IGF-1 exposure from two unlicensed products.",
      note: "No human data; IGF-1 LR3 has never been studied in people.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      note: "No human studies of GH secretagogues combined with incretin medicines; GH raises glucose while incretins lower it.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "Marketed together as 'recovery' stacks; no human data for the combination and BPC-157 lacks human efficacy data.",
    },
    {
      with: "tb-500",
      evidence: "none",
      note: "No human data on the combination; TB-500 itself has no human efficacy data.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Selective ghrelin-receptor agonist" },
    { label: "Human trials", value: "Phase 1 (n = 8) and two Phase 2 ileus trials — no benefit shown" },
    { label: "Half-life", value: "≈ 2 hours; one GH pulse per dose" },
    { label: "Route", value: "Intravenous in trials; subcutaneous in unregulated use" },
    { label: "Status", value: "Not authorised anywhere; WADA-prohibited (S2)" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Raun K et al. Ipamorelin, the first selective growth hormone secretagogue. Eur J Endocrinol 1998;139:552–561", url: "https://doi.org/10.1530/eje.0.1390552" },
    { label: "Gobburu JVS et al. Pharmacokinetic–pharmacodynamic modeling of ipamorelin in human volunteers. Pharm Res 1999;16:1412–1416" },
    { label: "Beck DE et al. Ipamorelin for post-operative ileus after bowel resection (Phase 2). Int J Colorectal Dis 2014", url: "https://pubmed.ncbi.nlm.nih.gov/25331030/" },
    { label: "ClinicalTrials.gov NCT01280344 — Phase 2 dose-finding study of ipamorelin in post-operative ileus (completed 2014, no results posted)", url: "https://clinicaltrials.gov/study/NCT01280344" },
    { label: "FDA — Bulk drug substances nominated for use in compounding under section 503A (category lists)", url: "https://www.fda.gov/media/94155/download" },
    { label: "WADA Prohibited List — S2 peptide hormones, growth factors, related substances and mimetics", url: "https://www.wada-ama.org/en/prohibited-list" },
  ],
};
