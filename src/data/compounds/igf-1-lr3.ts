import type { Compound } from "../types";

/**
 * IGF-1 LR3 (Long R3 IGF-1) — engineered IGF-1 analogue developed as a
 * cell-culture reagent. There are NO human clinical trials; risk statements
 * are extrapolated from native IGF-1 (mecasermin, Increlex) and labelled as
 * such. Claims are derived from the sources listed under `references`.
 */
export const igf1Lr3: Compound = {
  slug: "igf-1-lr3",
  name: "IGF-1 LR3",
  aliases: ["Long R3 IGF-1", "LR3 IGF-I", "LONG R3 IGF-I", "IGF-1 Long R3", "LR3", "IGF-1 LR3 (research chemical)"],
  family: "growth_hormone_axis",
  classLabel: "Engineered IGF-1 analogue (laboratory reagent)",
  tagline: "Laboratory IGF-1 analogue with no human trials and serious hypoglycaemia risk",
  summary:
    "IGF-1 LR3 (Long R3 IGF-1) is an 83-amino-acid engineered version of insulin-like growth factor 1 with a 13-amino-acid extension and an arginine substitution at position 3 that cut its binding to IGF-binding proteins by more than a thousand-fold, making it far more potent and longer-acting in cell culture. It was designed as a reagent for growing cells in laboratories and biopharmaceutical manufacturing and has never been given to humans in a clinical trial. Native IGF-1 (mecasermin, Increlex) is an approved medicine for severe childhood IGF-1 deficiency, but it is a different molecule with a monitored dosing regimen — LR3 is not authorised anywhere.",
  mechanism:
    "Activates the type 1 IGF receptor (and, at high concentrations, the insulin receptor) to drive cell growth, protein synthesis and glucose uptake into muscle and fat. Because the modifications stop it being held inactive by IGF-binding proteins, almost all of the injected peptide is free and biologically active — which is why it is potent in the laboratory and why its insulin-like glucose-lowering effect is expected to be stronger and less predictable than that of natural IGF-1.",
  goals: [
    {
      goal: "muscle_recovery",
      evidence: "insufficient",
      summary:
        "No human studies of any kind. Native IGF-1 (mecasermin) modestly increases lean mass in children with severe IGF-1 deficiency; this does not translate to LR3 in healthy adults.",
    },
    {
      goal: "athletic_performance",
      evidence: "insufficient",
      summary: "No human data; IGF-1 and its analogues are prohibited at all times under the WADA list (S2).",
    },
    {
      goal: "injury_recovery",
      evidence: "insufficient",
      summary: "Animal and cell-culture data only; no human study has examined tissue healing.",
    },
    {
      goal: "fat_loss",
      evidence: "insufficient",
      summary:
        "No human data. Native IGF-1 lowers glucose and causes fat build-up at injection sites (lipohypertrophy) rather than fat loss.",
    },
  ],
  overallEvidence: "insufficient",
  humanEvidenceLevel: "preclinical_only",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail:
        "No MHRA licence. Mecasermin (Increlex) — native IGF-1, a different molecule — is licensed in the UK for severe primary IGF-1 deficiency in children and is prescription-only; it is not interchangeable with LR3.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved for any use; sold only as an unregulated 'research chemical' labelled 'not for human consumption'.",
      detail:
        "IGF-1 LR3 has never been the subject of an FDA application and is not eligible for pharmacy compounding. Mecasermin (Increlex) is FDA-approved (2005) for severe primary IGF-1 deficiency in children; it is a different molecule and is not a source of LR3.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail: "Mecasermin (Increlex) holds a centralised EU authorisation (2007) for severe primary IGF-1 deficiency in children; LR3 is a different, unauthorised molecule.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail: "Not on the ARTG. IGF-1 (mecasermin) is a prescription-only (Schedule 4) substance in the Poisons Standard, and unprescribed importation and supply of IGF-1 analogues are unlawful.",
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
  routes: ["subcutaneous"],
  dosingResearch: [],
  dosingResearchNote:
    "There are no human dose-finding, safety or efficacy studies of IGF-1 LR3 — it has only been used in cell culture and in animal experiments. Doses circulating online (typically 20–100 µg daily) are not derived from any trial. Dosing data for mecasermin (native IGF-1, 0.04–0.12 mg/kg twice daily in children with severe primary IGF-1 deficiency, given with food and with glucose monitoring) cannot be transferred, because LR3's thousand-fold lower binding to IGF-binding proteins means far more free, active peptide per microgram and a stronger, less predictable glucose-lowering effect.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "absolute",
      note: "IGF-1 signalling drives growth in many tumour types, and mecasermin is contraindicated in active or suspected neoplasia or any condition that raises cancer risk. Any current or previous cancer should be regarded as excluding use.",
    },
    {
      conditionId: "diabetes",
      severity: "absolute",
      note: "Treated as absolute because of an unpredictable insulin-like glucose-lowering effect with no human safety data; hypoglycaemia was very common (28%) even with monitored mecasermin, and interaction with insulin or sulfonylureas could be severe.",
    },
    {
      conditionId: "acromegaly",
      severity: "absolute",
      note: "Adding an IGF-1 analogue to a condition already defined by GH/IGF-1 excess is inappropriate.",
    },
    {
      conditionId: "intracranial_hypertension",
      severity: "caution",
      note: "Intracranial hypertension with papilloedema, headache and vomiting has been reported with mecasermin (about 1% of treated children) and with GH therapy.",
    },
    {
      conditionId: "sleep_apnoea",
      severity: "caution",
      note: "Mecasermin causes tonsillar and adenoidal enlargement with snoring and sleep apnoea; an IGF-1 analogue is expected to worsen existing sleep apnoea.",
    },
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Pituitary, adrenal or thyroid disorders alter glucose handling and IGF-1 physiology; endocrine assessment is required before any GH-axis intervention.",
    },
  ],
  interactions: [
    {
      classId: "insulin",
      severity: "major",
      note: "Additive glucose lowering — the combination could cause severe, prolonged hypoglycaemia.",
    },
    {
      classId: "sulfonylurea",
      severity: "major",
      note: "Additive hypoglycaemia risk with no data to guide dose adjustment.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "moderate",
      note: "Glucose-lowering effects add up; frequent monitoring would be required.",
    },
    {
      classId: "glp1_agonist",
      severity: "moderate",
      note: "Reduced food intake on GLP-1 medicines increases the danger of IGF-1-induced hypoglycaemia, which depends on eating around each dose.",
    },
    {
      classId: "growth_hormone",
      severity: "major",
      note: "Additive IGF-1 exposure on top of GH-driven IGF-1; increased risk of acromegaly-like effects and hypoglycaemia.",
    },
    {
      classId: "corticosteroid",
      severity: "moderate",
      note: "Glucocorticoids antagonise IGF-1's growth effects and raise glucose, making glucose swings less predictable.",
    },
    {
      classId: "testosterone",
      severity: "minor",
      note: "Frequently combined in 'performance' regimens; no human data and additive anabolic-hormone risk.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or animal reproductive data for LR3. An untested growth factor with hypoglycaemic effects cannot be supported in pregnancy or while breastfeeding.",
  },
  commonAdverseEffects: [
    "Hypoglycaemia — shakiness, sweating, hunger, confusion (28% of children on mecasermin; expected to be more pronounced with LR3)",
    "Headache (44% with mecasermin)",
    "Fat build-up at injection sites (lipohypertrophy)",
    "Nausea and vomiting",
    "Joint and limb pain",
    "Dizziness",
    "Enlarged tonsils and adenoids, snoring (with prolonged use)",
    "Swelling and water retention",
  ],
  seriousAdverseEffects: [
    "Severe hypoglycaemia with seizures or loss of consciousness (6 of 115 children with hypoglycaemia on mecasermin had seizures)",
    "Intracranial hypertension (about 1% with mecasermin)",
    "Sleep apnoea from lymphoid tissue enlargement",
    "Acromegaly-like growth of the jaw, facial bones, hands and feet with sustained excess",
    "Possible promotion of existing tumours — IGF-1 caused mammary carcinoma and skin tumours in rat carcinogenicity studies",
    "Anaphylaxis and other allergic reactions",
    "Completely unknown long-term effects — no human safety data exist at any dose",
  ],
  monitoring: [
    "Blood glucose before and for several hours after any dose — hypoglycaemia is the dominant acute risk",
    "IGF-1 — standard assays were validated for native IGF-1 and may not measure LR3 reliably, so a 'normal' result does not exclude excess",
    "Eye examination for headaches, visual disturbance or vomiting (intracranial hypertension)",
    "Snoring, daytime sleepiness and other sleep-apnoea symptoms",
    "Changes in jaw, facial features, ring or shoe size",
    "Age-appropriate cancer screening and prompt review of any new lump or symptom",
  ],
  sourceConsiderations: [
    "Sold only as a 'research chemical' for laboratory use; no manufacturer intends it for human injection and no product has sterility, endotoxin or potency assurance for that purpose.",
    "Independent testing of online peptides has found vials labelled IGF-1 LR3 containing a different peptide, a fraction of the stated amount or nothing active.",
    "Microgram-to-milligram dosing errors with an insulin-like peptide can cause life-threatening hypoglycaemia.",
    "Increlex (mecasermin) is a prescription medicine for children with a specific deficiency; it is not the same molecule and is not a legitimate route to LR3.",
  ],
  clinicianQuestions: [
    "Is there any reason to think I have IGF-1 or GH deficiency, and if so what licensed, monitored treatment would be appropriate instead?",
    "How would we detect and manage hypoglycaemia from a peptide that has never been dosed in humans?",
    "Do I have any cancer history, diabetes, sleep apnoea or headaches with visual symptoms that make this especially risky?",
    "Would standard IGF-1 blood tests even detect this analogue?",
    "Am I subject to anti-doping rules in any sport?",
  ],
  alternatives: ["somatropin"],
  stackNotes: [
    {
      with: "somatropin",
      evidence: "none",
      overlap: "Additive IGF-1 exposure and compounded hypoglycaemia risk.",
      note: "No human data; combines a licensed, monitored medicine with an untested laboratory reagent acting on the same pathway.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      overlap: "Additive IGF-1 exposure — CJC-1295 raises IGF-1 for days at a time.",
      note: "No human data for either compound in this setting; both are unlicensed research chemicals.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      overlap: "Additive IGF-1 exposure via GH release.",
      note: "No human data; both are unlicensed research chemicals.",
    },
    {
      with: "tesamorelin",
      evidence: "none",
      overlap: "Additive IGF-1 exposure on top of a medicine whose label already warns about IGF-1 elevation.",
      note: "No human data.",
    },
    {
      with: "sermorelin",
      evidence: "none",
      overlap: "Additive IGF-1 exposure via GH release.",
      note: "No human data.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Both lower glucose; appetite suppression increases the risk of IGF-1-induced hypoglycaemia.",
      note: "No human data on the combination.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "Marketed together as 'recovery' stacks; no human data for either compound in this setting.",
    },
    {
      with: "tb-500",
      evidence: "none",
      note: "No human data on the combination; TB-500 itself has no human efficacy data.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Engineered IGF-1 analogue (83 amino acids)" },
    { label: "Human trials", value: "None — developed as a cell-culture reagent" },
    { label: "Key risk", value: "Severe hypoglycaemia (insulin-like action)" },
    { label: "Related medicine", value: "Mecasermin (Increlex) — different molecule, children only" },
    { label: "Status", value: "Not authorised anywhere; WADA-prohibited (S2)" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Francis GL et al. Novel recombinant fusion protein analogues of IGF-I indicate the relative importance of IGF-binding protein and receptor binding for enhanced biological potency. J Mol Endocrinol 1992;8:213–223" },
    { label: "Repligen — LONG R3 IGF-I: structure, IGFBP affinity and use in CHO cell culture (technical poster)", url: "https://www.repligen.com/Products/ELISA/scientific-posters/Scientific-poster-long-r3-igf-i.pdf" },
    { label: "Increlex (mecasermin) Summary of Product Characteristics (UK) — native IGF-1, for risk extrapolation", url: "https://www.medicines.org.uk/emc/product/101145/smpc" },
    { label: "Endocrine Society — Hormones and Aging: Scientific Statement (2023)", url: "https://doi.org/10.1210/clinem/dgad225" },
    { label: "WADA Prohibited List — S2 peptide hormones, growth factors, related substances and mimetics", url: "https://www.wada-ama.org/en/prohibited-list" },
  ],
};
