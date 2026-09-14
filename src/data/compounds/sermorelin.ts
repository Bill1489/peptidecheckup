import type { Compound } from "../types";

/**
 * Sermorelin — GHRH(1–29)-NH2. Formerly FDA-approved (Geref) for paediatric
 * GH deficiency; discontinued 2008 for commercial reasons; now compounded in
 * the US. Claims are derived from the historical label, the paediatric
 * registrational trial and the single adult study listed under `references`.
 */
export const sermorelin: Compound = {
  slug: "sermorelin",
  name: "Sermorelin",
  aliases: ["Geref", "GHRH(1-29)", "GRF 1-29", "Sermorelin acetate", "Sermo"],
  family: "growth_hormone_axis",
  classLabel: "GHRH(1–29) fragment (growth-hormone-releasing hormone analogue)",
  tagline: "Formerly licensed GHRH fragment, now compounded for adult use with little evidence",
  summary:
    "Sermorelin is the first 29 amino acids of human growth-hormone-releasing hormone — the shortest fragment that keeps full activity. It was FDA-approved in 1997 (Geref) for diagnosing and treating growth-hormone deficiency in children, but the products were discontinued in 2008 for commercial reasons and no sermorelin medicine is authorised anywhere today. In the US it is widely prescribed as a compounded 'anti-ageing' injection, a use supported only by very small, short studies.",
  mechanism:
    "Binds GHRH receptors on pituitary somatotrophs, triggering release of the body's own growth hormone in its natural pulsatile pattern; the resulting GH rise increases IGF-1 production by the liver. Its plasma half-life is only 11–12 minutes, so each dose produces a single short GH pulse, and the response depends on a functioning pituitary and remains subject to normal feedback by somatostatin and IGF-1.",
  goals: [
    {
      goal: "longevity",
      evidence: "preliminary",
      summary:
        "The only adult trial of sermorelin itself (11 healthy men aged 64–76, 2 mg nightly for six weeks) increased night-time GH release but did not raise IGF-1 or change body composition, glucose or lipids. No trial has measured ageing-related outcomes, and the Endocrine Society does not support GH-axis therapy for age-related decline.",
    },
    {
      goal: "muscle_recovery",
      evidence: "insufficient",
      summary:
        "Two of six strength measures improved in the same 11-man study without any change in lean mass; there are no controlled trials of sermorelin for muscle, strength or recovery.",
    },
    {
      goal: "fat_loss",
      evidence: "insufficient",
      summary:
        "DXA-measured fat did not change in the one adult study and there are no fat-loss trials. The related GHRH analogue tesamorelin reduces visceral fat in HIV lipodystrophy, but that result cannot be assumed to transfer.",
    },
    {
      goal: "sleep",
      evidence: "insufficient",
      summary:
        "Physiology studies of full-length GHRH given at night have shown effects on slow-wave sleep, but sermorelin has not been studied for sleep complaints in any clinical trial.",
    },
  ],
  overallEvidence: "limited",
  humanEvidenceLevel: "late_clinical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine in the UK; no MHRA marketing authorisation has ever been granted.",
      detail:
        "Sermorelin holds no UK product licence. It could only be supplied as an unlicensed 'special' or import against a named-patient prescription, with the prescriber taking responsibility; licensed somatropin products exist for genuine GH deficiency.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "No FDA-approved product since Geref was discontinued in 2008; available only as a compounded preparation on prescription.",
      detail:
        "Geref (sermorelin acetate) was approved in 1997 for paediatric GH deficiency and as a diagnostic agent, and was withdrawn from sale by EMD Serono in 2008 for commercial and supply reasons rather than safety. Because it was once a component of an approved medicine and is not on the FDA's list of drugs withdrawn for safety reasons, state-licensed 503A pharmacies compound it against individual prescriptions; it does not appear on the FDA's 503A Category 1 or Category 2 bulk-substance lists. Compounded sermorelin is not FDA-approved and has not been evaluated for safety, effectiveness or quality.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "Not currently authorised in the EU; not listed in the Union Register of medicinal products.",
      detail: "No centralised or current national marketing authorisation. Access would depend on member-state named-patient provisions, which are rarely used because licensed somatropin is available.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not registered on the ARTG; compounded preparations are not TGA-evaluated.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "No Health Canada Notice of Compliance or Drug Identification Number.",
      detail: "Not in the Health Canada Drug Product Database. Provincial compounding rules would apply to any pharmacy preparation, and the active ingredient would need to be imported.",
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
      title: "Geref International Study Group — once-daily GHRH(1–29) in GH-deficient children",
      citation: "Thorner M et al., J Clin Endocrinol Metab 1996;81:1189–1196",
      year: 1996,
      phase: "Registrational (Phase 3)",
      design: "Multicentre, open-label, single-arm",
      population: "Previously untreated prepubertal children with GH deficiency (86 of 110 evaluable for efficacy)",
      n: 110,
      duration: "12 months",
      doses: "30 µg/kg once daily at bedtime",
      route: "subcutaneous",
      outcome:
        "Mean height velocity rose from 4.1 cm/year at baseline to 8.0 cm/year at 6 months and 7.2 cm/year at 12 months; 74% were judged responders at 6 months. Bone age advanced in step with height age.",
      adverseEvents:
        "Generally well tolerated; no adverse changes in biochemistry or hormones, no change in fasting glucose and no excessive IGF-1 generation. Injection-site reactions were the most frequent complaint in the paediatric programme.",
      exposure: { doseMin: 30, doseMax: 30, unit: "mcg/kg", frequency: "daily", route: "subcutaneous" },
      url: "https://pubmed.ncbi.nlm.nih.gov/8772599/",
    },
    {
      title: "Single nightly GHRH(1–29) injections in healthy elderly men",
      citation: "Vittone J et al., Metabolism 1997;46:89–96",
      year: 1997,
      phase: "Physiological study",
      design: "Open-label, uncontrolled before-and-after study",
      population: "Healthy, non-obese men aged 64–76 with low baseline IGF-1",
      n: 11,
      duration: "6 weeks",
      doses: "2 mg once nightly (self-injected at home)",
      route: "subcutaneous",
      outcome:
        "Night-time GH release increased (mean level, peak area and amplitude) with no change in IGF-1, IGFBP-3 or GH-binding protein. Two of six strength measures and one endurance test improved; weight, waist-to-hip ratio, DXA fat and muscle, glucose tolerance and lipids did not change.",
      adverseEvents: "No significant adverse effects observed over six weeks.",
      exposure: { doseMin: 2, doseMax: 2, unit: "mg", frequency: "daily", route: "subcutaneous" },
      url: "https://pubmed.ncbi.nlm.nih.gov/9005976/",
    },
  ],
  dosingResearchNote:
    "There are no placebo-controlled trials of sermorelin for adult 'anti-ageing', body-composition, sleep or recovery outcomes. A frequently cited 16-week study in older adults (Khorram et al., JCEM 1997) used a different, more potent GHRH analogue ([Nle27]GHRH(1–29)-NH2) and is not sermorelin data. Adult doses used by compounding clinics (typically 200–500 µg nightly) have not been evaluated in any trial.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "absolute",
      note: "GH and IGF-1 are growth factors; any active or recent malignancy should be regarded as excluding GH-axis stimulation until reviewed by the treating oncologist.",
    },
    {
      conditionId: "acromegaly",
      severity: "absolute",
      note: "Further stimulation of GH release in acromegaly or with a pituitary tumour is inappropriate.",
    },
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Sermorelin needs a working pituitary; it is ineffective after pituitary surgery, irradiation or in hypopituitarism, and any pituitary or adrenal disorder requires endocrine assessment first.",
    },
    {
      conditionId: "thyroid",
      severity: "caution",
      note: "Untreated hypothyroidism blunts the GH response to GHRH; thyroid function should be normal before the response can be judged.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Sustained increases in GH raise blood glucose and oppose insulin; glucose was unchanged in the paediatric trial but adult data are minimal.",
    },
  ],
  interactions: [
    {
      classId: "growth_hormone",
      severity: "major",
      note: "Duplicate GH-axis stimulation; exogenous GH suppresses the pituitary response sermorelin relies on and makes IGF-1 exposure additive.",
    },
    {
      classId: "corticosteroid",
      severity: "moderate",
      note: "Glucocorticoids blunt GH release in response to GHRH and raise glucose; GH in turn increases cortisol clearance, so replacement doses may need review.",
    },
    {
      classId: "insulin",
      severity: "moderate",
      note: "GH opposes insulin; glucose monitoring is advised if GH-axis stimulation is sustained.",
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
      classId: "thyroid_hormone",
      severity: "minor",
      note: "Thyroid status affects the GH response; ensure replacement is adequate and stable.",
    },
    {
      classId: "hrt",
      severity: "minor",
      note: "Oral oestrogens blunt hepatic IGF-1 generation and can mask the biochemical response.",
    },
    {
      classId: "nsaid",
      severity: "minor",
      note: "Cyclo-oxygenase inhibitors such as aspirin and indometacin have blunted GH responses to GHRH in physiology studies; relevance to routine use is uncertain.",
    },
  ],
  pregnancy: {
    status: "not_recommended",
    note: "No adequate human pregnancy or breastfeeding data (the former US label carried a pregnancy category C). Stimulating the GH axis offers no benefit in pregnancy, and compounded products add quality uncertainty.",
  },
  commonAdverseEffects: [
    "Injection-site pain, redness or swelling",
    "Facial flushing or warmth shortly after injection",
    "Headache",
    "Dizziness",
    "Nausea",
    "Transient taste disturbance",
    "Hives (urticaria) — uncommon",
  ],
  seriousAdverseEffects: [
    "Allergic reactions including urticaria (rare)",
    "Glucose intolerance if GH is elevated for prolonged periods (theoretical; not seen in the paediatric trial)",
    "Fluid retention — oedema, joint pain, carpal tunnel syndrome — with GH excess",
    "Possible acceleration of an existing malignancy (GH and IGF-1 are growth factors)",
    "Anti-GHRH antibodies developed in some treated children, without evident loss of effect",
    "Quality-related harms (contamination, wrong potency) from compounded or unregulated products",
  ],
  monitoring: [
    "IGF-1 at baseline and periodically — a normal result is the expected finding with nightly sermorelin",
    "Fasting glucose and HbA1c",
    "Thyroid function before starting and if the response is poor",
    "Blood pressure and any swelling or joint symptoms",
    "Age-appropriate cancer screening",
    "Documentation of the compounded product's potency and sterility testing",
  ],
  sourceConsiderations: [
    "No licensed sermorelin product exists anywhere; in the US it is available only as a compounded preparation, and elsewhere only from unregulated online sellers.",
    "Compounded sermorelin is not FDA-evaluated for safety, effectiveness or quality — potency and sterility depend entirely on the individual pharmacy.",
    "'Research chemical' vials are not medicines and are frequently mislabelled or under-dosed.",
    "Prescribing for adult 'anti-ageing' is off the original paediatric indication and rests on very small studies.",
  ],
  clinicianQuestions: [
    "Have I actually been diagnosed with growth-hormone deficiency, and if so why is sermorelin being suggested rather than licensed somatropin?",
    "What outcome are we expecting, given that the only adult trial did not raise IGF-1 or change body composition?",
    "What are my baseline IGF-1, glucose, HbA1c and thyroid results, and when will they be rechecked?",
    "Which pharmacy compounds the product, and can I see its potency and sterility testing?",
    "Do I have any cancer, pituitary or thyroid history that changes the decision?",
  ],
  alternatives: ["somatropin", "tesamorelin"],
  stackNotes: [
    {
      with: "tesamorelin",
      evidence: "none",
      overlap: "Both are GHRH analogues acting on the same pituitary receptor.",
      note: "Duplicate GHRH stimulation with no human data and no rationale.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      overlap: "Both are GHRH(1–29)-based analogues; CJC-1295 acts for days rather than minutes.",
      note: "Duplicate mechanism; no human data for the combination.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      overlap: "Both raise GH and IGF-1 via complementary receptors (GHRH and ghrelin receptor).",
      note: "Commonly co-marketed as 'Sermorelin/Ipamorelin'; no clinical trial has tested the combination.",
    },
    {
      with: "somatropin",
      evidence: "none",
      overlap: "Duplicate GH-axis stimulation; injected GH suppresses the response to sermorelin.",
      note: "No rationale or data for combining; IGF-1 and glucose effects would be additive.",
    },
    {
      with: "igf-1-lr3",
      evidence: "none",
      overlap: "Additive IGF-1 activity from an untested analogue.",
      note: "No human data; IGF-1 LR3 has never been studied in people.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      note: "No human studies of GHRH analogues combined with GLP-1 medicines.",
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
    { label: "Class", value: "GHRH(1–29) fragment" },
    { label: "Route", value: "Subcutaneous injection (nightly in studies)" },
    { label: "Regulatory history", value: "FDA-approved 1997 (Geref); discontinued 2008, not for safety" },
    { label: "Current status", value: "Not authorised anywhere; compounded in the US" },
    { label: "Adult evidence", value: "One 6-week study in 11 men; IGF-1 unchanged" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Thorner M et al. Once-daily GHRH(1–29) in GH-deficient children (Geref International Study Group). J Clin Endocrinol Metab 1996", url: "https://pubmed.ncbi.nlm.nih.gov/8772599/" },
    { label: "Vittone J et al. Single nightly GHRH(1–29) injections in healthy elderly men. Metabolism 1997", url: "https://pubmed.ncbi.nlm.nih.gov/9005976/" },
    { label: "Khorram O et al. [Nle27]GHRH(1–29)-NH2 in age-advanced men and women (different analogue). J Clin Endocrinol Metab 1997", url: "https://doi.org/10.1210/jcem.82.5.3943" },
    { label: "FDA — Bulk drug substances nominated for use in compounding under section 503A (category lists)", url: "https://www.fda.gov/media/94155/download" },
    { label: "Endocrine Society — Hormones and Aging: Scientific Statement (2023)", url: "https://doi.org/10.1210/clinem/dgad225" },
    { label: "WADA Prohibited List — S2 peptide hormones, growth factors, related substances and mimetics", url: "https://www.wada-ama.org/en/prohibited-list" },
  ],
};
