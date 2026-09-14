import type { Compound } from "../types";

/**
 * CJC-1295 — long-acting GHRH analogue with Drug Affinity Complex (DAC).
 * Human data are limited to two Phase 1/2 pharmacodynamic studies in healthy
 * adults; development was halted in 2006. Claims are derived from the papers,
 * regulatory notices and contemporaneous reports listed under `references`.
 */
export const cjc1295: Compound = {
  slug: "cjc-1295",
  name: "CJC-1295",
  aliases: ["CJC-1295 DAC", "DAC:GRF", "CJC-1295 without DAC", "Mod GRF 1-29", "Modified GRF (1-29)", "CJC"],
  family: "growth_hormone_axis",
  classLabel: "Long-acting GHRH analogue (albumin-binding)",
  tagline: "Long-acting GHRH analogue abandoned in development; sold as a research chemical",
  summary:
    "CJC-1295 is a modified GHRH(1–29) peptide carrying a 'Drug Affinity Complex' (DAC) that bonds it to albumin in the blood, stretching its half-life from minutes to about six to eight days. Two small Phase 1/2 studies in healthy adults showed sustained rises in GH and IGF-1, but its developer ConjuChem stopped the programme in 2006 after a participant died during a Phase 2 trial in HIV lipodystrophy. It has never been authorised as a medicine anywhere and is sold only as an unregulated research chemical, often paired with ipamorelin.",
  mechanism:
    "Acts on pituitary GHRH receptors to stimulate endogenous GH release; the DAC linker forms a covalent bond with circulating albumin so the peptide keeps stimulating the pituitary for days after a single injection, raising average GH and IGF-1 levels while GH pulses continue. 'Mod GRF 1-29' is the same tetra-substituted GHRH(1–29) sequence without the DAC linker and therefore acts for minutes rather than days.",
  goals: [
    {
      goal: "muscle_recovery",
      evidence: "insufficient",
      summary:
        "Human data are limited to GH and IGF-1 blood levels in fewer than 80 healthy volunteers over at most seven weeks; no study has measured muscle mass, strength or recovery.",
    },
    {
      goal: "fat_loss",
      evidence: "insufficient",
      summary:
        "The only efficacy trial — a Phase 2 study of 192 adults with HIV-associated visceral fat — was halted in 2006 and never reported results; there are no fat-loss data in any population.",
    },
    {
      goal: "injury_recovery",
      evidence: "insufficient",
      summary: "No human studies; claims rest on the general role of GH and IGF-1 in tissue growth.",
    },
    {
      goal: "athletic_performance",
      evidence: "insufficient",
      summary:
        "No performance studies; prohibited at all times under the WADA list (S2) and detectable in anti-doping testing.",
    },
  ],
  overallEvidence: "preliminary",
  humanEvidenceLevel: "early_clinical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail: "No MHRA licence has ever been applied for. Products sold online are labelled 'not for human consumption' and are outside medicines quality controls.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved and not eligible for pharmacy compounding; sold only as an unregulated 'research chemical'.",
      detail:
        "In September 2023 the FDA placed CJC-1295 in Category 2 of its interim 503A bulk-substances list (substances that raise significant safety risks), citing immunogenicity, peptide impurities and lack of safety data. The nomination was withdrawn in September 2024 and the FDA's Pharmacy Compounding Advisory Committee, reviewing CJC-1295 in December 2024, did not support adding it to the list of substances that may be compounded. The FDA has issued warning letters to clinics and pharmacies marketing CJC-1295/ipamorelin.",
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
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "Single and repeated subcutaneous CJC-1295 in healthy adults (two ascending-dose studies)",
      citation: "Teichman SL et al., J Clin Endocrinol Metab 2006;91:799–805",
      year: 2006,
      phase: "Phase 1/2",
      design: "Two randomised, double-blind, placebo-controlled, ascending-dose studies (28 and 49 days)",
      population: "Healthy adults aged 21–61 (44% men); 42 in the single-dose study and 24 in the multiple-dose study",
      n: 66,
      duration: "28 days (single dose) and 49 days (2–3 doses over 14 days)",
      doses:
        "Study 1: single doses of 30, 60, 125 or 250 µg/kg. Study 2: two doses of 30 or 60 µg/kg two weeks apart, or three weekly doses of 20 or 30 µg/kg",
      route: "subcutaneous",
      outcome:
        "After one injection, mean GH rose 2- to 10-fold for 6 days or more and IGF-1 rose 1.5- to 3-fold for 9–11 days; estimated half-life 5.8–8.1 days. After repeated doses IGF-1 stayed above baseline for up to 28 days, with evidence of accumulation. GH pulsatility was preserved.",
      adverseEvents:
        "No serious adverse reactions. Injection-site reactions (irritation, redness, induration, pain, itching) in about 70% of single-dose recipients and all repeat-dose recipients; transient urticaria at the site in about 30%; headache (63%), diarrhoea (43%) and flushing with transient low blood pressure (30%), all more common at 125–250 µg/kg. Three participants withdrew because of adverse effects. No changes in glucose, liver tests or ECG; no antibodies detected.",
      exposure: {
        doseMin: 30,
        doseMax: 60,
        unit: "mcg/kg",
        frequency: "weekly",
        route: "subcutaneous",
        note: "30–60 µg/kg was considered the well-tolerated range; single doses up to 250 µg/kg were tested",
      },
      url: "https://doi.org/10.1210/jc.2005-1536",
    },
    {
      title: "GH pulsatility after a single CJC-1295 injection in healthy young men",
      citation: "Ionescu M & Frohman LA, J Clin Endocrinol Metab 2006;91:4792–4797",
      year: 2006,
      phase: "Phase 1",
      design: "Open-label physiological study with overnight 20-minute blood sampling before and one week after dosing",
      population: "Healthy men aged 20–40",
      duration: "1 week after a single dose",
      doses: "Single dose of 60 or 90 µg/kg",
      route: "subcutaneous",
      outcome:
        "GH secretion increased with preserved pulsatility: pulse frequency and size were unchanged while basal (trough) GH rose markedly, and IGF-1 increased.",
      adverseEvents: "Adverse effects were reported as mild and short-lived at these doses.",
      exposure: { doseMin: 60, doseMax: 90, unit: "mcg/kg", frequency: "once", route: "subcutaneous" },
      url: "https://doi.org/10.1210/jc.2006-1702",
    },
  ],
  dosingResearchNote:
    "All human dosing data come from single or 2–3 weekly doses over at most seven weeks in roughly 80 healthy volunteers. The Phase 2 HIV-lipodystrophy trial (weekly 60–240 µg/kg, 192 participants) was stopped after a participant's death and never published. Doses circulating online — such as 1–2 mg of CJC-1295 DAC weekly, or 100 µg of 'Mod GRF 1-29' several times daily — have not been studied, and no study has run longer than 49 days.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "absolute",
      note: "Raises GH and IGF-1 for days at a time and cannot be reversed once injected; any active or previous malignancy should be regarded as excluding use.",
    },
    {
      conditionId: "acromegaly",
      severity: "absolute",
      note: "Sustained GHRH-receptor stimulation in acromegaly or with a pituitary tumour is inappropriate.",
    },
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "The only participant death in its development programme was attributed to probable undiagnosed coronary disease; flushing and transient low blood pressure occurred in trials, and there are no cardiovascular safety data.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Prolonged GH elevation opposes insulin and can raise glucose; glucose was unchanged in the short studies, but sustained use has not been evaluated.",
    },
    {
      conditionId: "diabetic_retinopathy",
      severity: "caution",
      note: "IGF-1 elevation is a recognised concern for retinopathy progression with GH-axis agents.",
    },
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Requires a functioning pituitary; pituitary or adrenal disorders need endocrine assessment first.",
    },
  ],
  interactions: [
    {
      classId: "growth_hormone",
      severity: "major",
      note: "Duplicate GH-axis stimulation with additive IGF-1 exposure; injected GH also suppresses the pituitary response CJC-1295 depends on.",
    },
    {
      classId: "insulin",
      severity: "moderate",
      note: "Days-long GH elevation opposes insulin; glucose monitoring and dose review are advised.",
    },
    {
      classId: "sulfonylurea",
      severity: "moderate",
      note: "Glucose control may deteriorate; monitoring advised.",
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
      classId: "hrt",
      severity: "minor",
      note: "Oral oestrogens blunt hepatic IGF-1 generation and may mask the biochemical response.",
    },
    {
      classId: "oral_contraceptive",
      severity: "minor",
      note: "Oral oestrogen-containing contraceptives may blunt the IGF-1 response; no data.",
    },
    {
      classId: "thyroid_hormone",
      severity: "minor",
      note: "Thyroid status affects the GH response; ensure replacement is stable.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or published animal reproductive data. Given a days-long action that cannot be withdrawn once injected, use in pregnancy or while breastfeeding cannot be supported.",
  },
  commonAdverseEffects: [
    "Injection-site irritation, redness, hardening, pain or itching (most recipients in trials)",
    "Transient hives at the injection site (about 30%)",
    "Headache (about 63%)",
    "Diarrhoea or loose stools (about 43%, dose-related)",
    "Flushing and warmth within 30 minutes of injection",
    "Transient drop in blood pressure",
    "Nausea or abdominal pain",
    "Water retention (expected with sustained GH elevation)",
  ],
  seriousAdverseEffects: [
    "Death of a participant in the 2006 Phase 2 trial — causality not established, but development was terminated",
    "IGF-1 elevation persisting for weeks after each dose — effects cannot be 'switched off' if problems arise",
    "Glucose intolerance or diabetes with sustained GH excess",
    "Fluid retention, joint pain and carpal tunnel syndrome (GH excess)",
    "Possible acceleration of an existing malignancy",
    "Immunogenicity and allergic reactions (an FDA-cited safety concern for peptide products)",
    "Contamination or wrong-dose harms from unregulated vials",
  ],
  monitoring: [
    "IGF-1 — expected to stay elevated for weeks after each dose",
    "Fasting glucose and HbA1c",
    "Blood pressure and heart rate (flushing and transient hypotension were seen in trials)",
    "Swelling, joint pain and hand tingling",
    "Injection-site reactions, which affected almost all trial participants",
    "Age-appropriate cancer screening",
  ],
  sourceConsiderations: [
    "Not a licensed medicine anywhere and not eligible for compounding in the US after the 2023–2024 FDA review; the only supply is unregulated 'research chemical' vials.",
    "Independent testing of research-chemical peptides has repeatedly found mislabelled identity, under- or over-dosing and contaminants; the FDA cited peptide impurities and immunogenicity as specific concerns.",
    "'CJC-1295 DAC' and 'CJC-1295 without DAC' (Mod GRF 1-29) are frequently confused; they differ roughly a thousand-fold in duration of action, so the same microgram dose has very different consequences.",
    "The FDA has issued warning letters to sellers and clinics marketing CJC-1295/ipamorelin as unapproved new drugs.",
  ],
  clinicianQuestions: [
    "Is there any documented deficiency that would justify GH-axis stimulation, and if so why not a licensed treatment?",
    "Given the effect lasts for days per dose, what is the plan if I develop side effects?",
    "What are my baseline IGF-1, glucose and HbA1c, and how often would they be rechecked?",
    "Do I have any cancer, cardiovascular, pituitary or diabetes history that changes the risk?",
    "What do we know about the identity and purity of the specific product I have?",
    "Am I subject to anti-doping rules in any sport?",
  ],
  alternatives: ["tesamorelin", "somatropin"],
  stackNotes: [
    {
      with: "ipamorelin",
      evidence: "limited",
      overlap: "Both raise GH and IGF-1 — CJC-1295 through the GHRH receptor and ipamorelin through the ghrelin receptor.",
      note: "The most commonly co-used pair ('CJC/Ipa'). Short physiology studies show that GHRH and ghrelin-receptor agonists release GH synergistically, which is the rationale, but no clinical trial has ever tested this combination for any outcome or its safety; the FDA has described it as an unapproved novel drug combination.",
    },
    {
      with: "tesamorelin",
      evidence: "none",
      overlap: "Both are GHRH analogues acting on the same receptor.",
      note: "Duplicate GHRH stimulation; no data and no rationale.",
    },
    {
      with: "sermorelin",
      evidence: "none",
      overlap: "Both are GHRH(1–29)-based analogues.",
      note: "Duplicate mechanism; no human data for the combination.",
    },
    {
      with: "somatropin",
      evidence: "none",
      overlap: "Duplicate GH-axis stimulation; injected GH suppresses the pituitary response CJC-1295 depends on.",
      note: "No rationale or data; IGF-1 and glucose effects would be additive.",
    },
    {
      with: "igf-1-lr3",
      evidence: "none",
      overlap: "Additive IGF-1 exposure from two unlicensed products.",
      note: "No human data; IGF-1 LR3 has never been studied in people.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      note: "No human studies of GH secretagogues combined with GLP-1 medicines; GH raises glucose while GLP-1 lowers it.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      note: "No human data on the combination.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "Marketed together as 'recovery' stacks; no human data for the combination and BPC-157 lacks human efficacy data.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Long-acting GHRH analogue (DAC)" },
    { label: "Half-life", value: "≈ 6–8 days (native GHRH: minutes)" },
    { label: "Human trials", value: "Two Phase 1/2 studies in ≈ 80 healthy volunteers" },
    { label: "Development", value: "Halted 2006 after a trial participant's death" },
    { label: "Status", value: "Not authorised anywhere; WADA-prohibited (S2)" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Teichman SL et al. Prolonged stimulation of GH and IGF-I secretion by CJC-1295 in healthy adults. J Clin Endocrinol Metab 2006", url: "https://doi.org/10.1210/jc.2005-1536" },
    { label: "Ionescu M, Frohman LA. Pulsatile secretion of GH persists during continuous stimulation by CJC-1295. J Clin Endocrinol Metab 2006", url: "https://doi.org/10.1210/jc.2006-1702" },
    { label: "aidsmap — Lipodystrophy study halted after patient death (July 2006)", url: "https://www.aidsmap.com/news/jul-2006/lipodystrophy-study-halted-after-patient-death" },
    { label: "FDA — Bulk drug substances nominated for use in compounding under section 503A (category lists)", url: "https://www.fda.gov/media/94155/download" },
    { label: "FDA — Safety risks associated with certain bulk drug substances nominated for use in compounding", url: "https://www.fda.gov/drugs/human-drug-compounding/safety-risks-associated-certain-bulk-drug-substances-nominated-use-compounding" },
    { label: "WADA Prohibited List — S2 peptide hormones, growth factors, related substances and mimetics", url: "https://www.wada-ama.org/en/prohibited-list" },
  ],
};
