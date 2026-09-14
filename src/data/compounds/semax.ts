import type { Compound } from "../types";

/**
 * Semax — synthetic ACTH(4-7)-Pro-Gly-Pro analogue registered in Russia as an
 * intranasal neuroprotective / nootropic medicine. Trials are Russian, mostly
 * open-label or non-randomised, and have not been replicated internationally.
 */
export const semax: Compound = {
  slug: "semax",
  name: "Semax",
  aliases: ["Семакс", "ACTH(4-7)-PGP", "Met-Glu-His-Phe-Pro-Gly-Pro", "N-acetyl Semax", "NA-Semax"],
  family: "neuro",
  classLabel: "Synthetic ACTH-fragment heptapeptide",
  tagline: "Russian intranasal 'nootropic' peptide; stroke data unreplicated abroad",
  summary:
    "Semax is a synthetic heptapeptide derived from the adrenocorticotropic hormone fragment ACTH(4-10), designed to retain nootropic activity without hormonal effects. It is registered in Russia as 0.1% and 1% nasal drops for acute ischaemic stroke, cognitive impairment and optic nerve disease. Outside Russia it has no authorisation; the supporting trials are Russian, largely open-label, and have not been replicated by independent groups.",
  mechanism:
    "Thought to act through melanocortin receptors and to increase expression of brain-derived neurotrophic factor (BDNF) and its receptor TrkB, with reported effects on cerebral blood flow, inflammation and neuronal survival in animal models. It has no corticotropic (cortisol-raising) activity.",
  goals: [
    {
      goal: "general_wellbeing",
      evidence: "limited",
      summary:
        "Small Russian studies report faster recovery after stroke and improved attention or memory scores in patients with cognitive impairment, plus a small healthy-volunteer study of attention. None were placebo-controlled to modern standards, and there are no trials of Semax for focus, mood or energy in healthy adults.",
    },
    {
      goal: "longevity",
      evidence: "insufficient",
      summary:
        "Neuroprotective effects in rodent models of ischaemia and neurodegeneration have not been tested as healthy-ageing or cognitive-decline prevention in humans.",
    },
  ],
  overallEvidence: "limited",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail: "No MHRA marketing authorisation. Nasal sprays and vials sold online are unlicensed products.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; unapproved drug whose compounding status is under FDA review.",
      detail:
        "Semax has never been approved by the FDA. It was placed in 503A 'Category 2' (significant safety risk) in September 2023, then removed from Category 2 in April 2026 after its nomination was withdrawn — removal does not make it eligible for compounding. In July 2026 the FDA's Pharmacy Compounding Advisory Committee voted, against the advice of FDA reviewers, to recommend adding semax to the 503A bulks list; the recommendation is non-binding and rulemaking had not been completed at the time of this review.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EU or national marketing authorisation; sold only as a 'research chemical'.",
      detail: "No centralised (EMA) or known national authorisation in any EU member state.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not on the Australian Register of Therapeutic Goods.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not approved by Health Canada.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Authorised in Russia (0.1% and 1% nasal drops) for stroke, cognitive impairment and optic nerve disease; status elsewhere unclear.",
      detail:
        "Registered in the Russian Federation: the 1% solution for acute ischaemic stroke and the 0.1% solution for cognitive disorders, optic nerve atrophy and 'adaptation to stress'. Russian registration is not recognised by other regulators. Check your national medicines regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["intranasal"],
  dosingResearch: [
    {
      title: "Semax in the acute period of hemispheric ischaemic stroke",
      citation: "Gusev EI et al., Zh Nevrol Psikhiatr Im S S Korsakova 1997;97(6):26–34",
      year: 1997,
      phase: "Phase 2/3 (Russian registration study)",
      design: "Open-label, non-randomised, controlled: 30 treated patients versus 80 matched controls on conventional therapy",
      population: "Adults in the acute phase of hemispheric ischaemic stroke, moderate or severe",
      n: 110,
      duration: "5–10 days of treatment",
      doses: "Semax 1% intranasal: 12 mg/day for moderate stroke, 18 mg/day for severe stroke, in divided doses",
      route: "intranasal",
      outcome:
        "Faster regression of general cerebral and focal (especially motor) deficits on clinical rating scales versus controls, with EEG and evoked-potential changes. Not randomised or blinded; published only in Russian.",
      adverseEvents: "No adverse effects or deaths attributed to treatment were reported in the abstract; systematic safety reporting is absent.",
      exposure: { doseMin: 12, doseMax: 18, unit: "mg", frequency: "daily", route: "intranasal", note: "Total daily dose, divided across administrations, for 5–10 days" },
      url: "https://pubmed.ncbi.nlm.nih.gov/11517472/",
    },
  ],
  dosingResearchNote:
    "Beyond the stroke study, Russian reports in cognitive impairment, optic nerve disease and healthy volunteers (0.1% solution, typically 200–600 µg per day) are small, mostly open-label and published in Russian; none has been independently replicated. Online 'nootropic' regimens using sprays of unknown concentration or 'N-acetyl' derivatives have no human data at all.",
  contraindications: [
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "The Russian label lists acute psychosis and disorders accompanied by anxiety as contraindications; agitation and anxiety have been reported. Any mental-health history warrants professional review.",
    },
    {
      conditionId: "epilepsy",
      severity: "caution",
      note: "A history of seizures is listed as a contraindication on the Russian label; effects on seizure threshold have not been formally studied.",
    },
    {
      conditionId: "hypertension",
      severity: "caution",
      note: "Not studied in uncontrolled hypertension. Semax has no shown corticotropic activity, but some Russian sources advise caution because of its ACTH-fragment origin — a theoretical consideration.",
    },
  ],
  interactions: [
    {
      classId: "stimulant",
      severity: "moderate",
      note: "Interactions are unstudied. Semax is described as activating; combined with methylphenidate or amfetamine-type stimulants, additive agitation, insomnia or blood-pressure effects are plausible.",
    },
    {
      classId: "antidepressant",
      severity: "moderate",
      note: "No interaction studies. Because Semax is proposed to alter BDNF and monoamine signalling, combination with antidepressants is unstudied and should be discussed with the prescriber.",
    },
  ],
  pregnancy: {
    status: "contraindicated",
    note: "The Russian label lists pregnancy and breastfeeding as contraindications. There are no human safety data.",
  },
  commonAdverseEffects: [
    "Nasal irritation or burning (intranasal use)",
    "Headache",
    "Restlessness, anxiety or agitation",
    "Difficulty sleeping if used late in the day",
  ],
  seriousAdverseEffects: [
    "Worsening of anxiety or psychotic symptoms in susceptible people (label caution)",
    "Allergic or hypersensitivity reactions",
    "Unknown long-term effects — no controlled safety data beyond short courses",
  ],
  monitoring: [
    "Mood, anxiety and sleep, particularly during the first days of use",
    "Blood pressure if there is a history of hypertension",
    "Seizure control where relevant",
    "Nasal symptoms with repeated intranasal use",
    "Objective measures of the cognitive outcome being targeted, ideally with a clinician",
  ],
  sourceConsiderations: [
    "Outside Russia every product is an unregulated 'research chemical'; concentration, purity and stability of home-made sprays are unverified.",
    "Imported Russian nasal drops may be counterfeit and are unlicensed in the UK, US, EU, AU and CA.",
    "'N-acetyl Semax' and 'amidate' derivatives sold online are distinct molecules with no human data.",
  ],
  clinicianQuestions: [
    "Is there any evidence that Semax improves focus or memory in someone without a neurological diagnosis?",
    "How would this interact with my current medicines, particularly stimulants or antidepressants?",
    "Given the activating effects reported, how should anxiety, sleep and blood pressure be monitored?",
    "What authorised options exist for the cognitive or mood symptoms I want to address?",
    "What is known about safety with use beyond the 5–10 day courses used in trials?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "selank",
      evidence: "limited",
      overlap: "Both are centrally acting Russian regulatory peptides administered intranasally.",
      note: "Commonly co-used in Russia and in online 'nootropic stacks', but no trial has tested the combination. Effects on alertness may be additive or opposing (semax activating, selank calming).",
    },
    {
      with: "dsip",
      evidence: "none",
      note: "No human data; the compounds are marketed for opposing purposes (daytime activation versus sleep), so stacking rationale is unclear.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "No human data on this combination; BPC-157 itself lacks human efficacy data.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      note: "No human studies of Semax combined with growth-hormone secretagogues.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Synthetic ACTH(4-10) analogue (heptapeptide)" },
    { label: "Route", value: "Intranasal drops or spray" },
    { label: "Human trials", value: "Russian open-label studies; largest stroke study 30 treated vs 80 controls" },
    { label: "Authorised", value: "Russia only (stroke, cognitive impairment); not UK, US, EU, AU or CA" },
    { label: "WADA", value: "Not on the Prohibited List" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Gusev EI et al. Effectiveness of Semax in acute hemispheric ischaemic stroke. Zh Nevrol Psikhiatr 1997", url: "https://pubmed.ncbi.nlm.nih.gov/11517472/" },
    { label: "Kaplan AY et al. Synthetic ACTH analogue Semax displays nootropic-like activity in humans. Neurosci Res Commun 1996;19:115–123" },
    { label: "FDA — Bulk drug substances that may present significant safety risks (503A Category 2)", url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks" },
    { label: "WADA 2026 Prohibited List", url: "https://www.wada-ama.org/en/prohibited-list" },
  ],
};
