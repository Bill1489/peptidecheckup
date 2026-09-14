import type { Compound } from "../types";

/**
 * Selank — synthetic tuftsin analogue registered in Russia as an intranasal
 * anxiolytic. Human evidence is limited to small Russian trials published in
 * Russian-language journals; no authorisation in the UK, US, EU, AU or CA.
 */
export const selank: Compound = {
  slug: "selank",
  name: "Selank",
  aliases: ["TP-7", "Selanc", "Селанк", "Thr-Lys-Pro-Arg-Pro-Gly-Pro"],
  family: "neuro",
  classLabel: "Synthetic tuftsin-analogue heptapeptide",
  tagline: "Russian intranasal anxiolytic peptide with small, unreplicated trials",
  summary:
    "Selank is a synthetic heptapeptide based on the immune-derived tetrapeptide tuftsin, developed at the Institute of Molecular Genetics in Moscow. It is registered in Russia as 0.15% nasal drops for generalised anxiety disorder and neurasthenia. Outside Russia it has no marketing authorisation and is sold only as an unregulated 'research chemical'; the human evidence consists of small Russian trials with methodological limitations.",
  mechanism:
    "Proposed to modulate GABA-A receptor signalling and inhibit enkephalin-degrading enzymes, raising endogenous enkephalin levels; changes in brain-derived neurotrophic factor and inflammatory cytokine expression have been reported in animals. The exact receptor target in humans has not been established.",
  goals: [
    {
      goal: "general_wellbeing",
      evidence: "limited",
      summary:
        "Two small Russian trials (n = 62 and n = 70) in people with anxiety disorders reported anxiolytic effects comparable to a benzodiazepine, with additional 'anti-asthenic' effects. Neither was placebo-controlled or replicated outside Russia; no trials exist in healthy adults seeking better mood, focus or energy.",
    },
    {
      goal: "sleep",
      evidence: "insufficient",
      summary:
        "Sleep has not been a primary outcome in any human study. The Russian label describes selank as non-sedating, so any effect on sleep would be indirect via reduced anxiety.",
    },
  ],
  overallEvidence: "limited",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail:
        "No MHRA marketing authorisation. Products sold online in the UK are not licensed medicines and are not subject to medicines quality controls.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; an unapproved drug sold as a 'research chemical'.",
      detail:
        "Selank has never been approved by the FDA for any indication. In September 2023 the FDA placed selank acetate (TP-7) in 503A 'Category 2' (bulk substances that raise significant safety risks), citing immunogenicity and impurity concerns. Its compounding nomination was later reported withdrawn and its listing status has been in flux during 2026; removal from Category 2 does not make a substance eligible for compounding. Verify against the FDA's current 503A category lists.",
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
      detail: "Not TGA-registered. Peptides supplied for human use without registration may be treated as prescription-only or unapproved goods.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not approved by Health Canada.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Authorised in Russia (0.15% nasal drops) for anxiety disorders; status elsewhere unclear.",
      detail:
        "Registered in the Russian Federation as an over-the-counter 0.15% intranasal solution for generalised anxiety disorder, neurasthenia and adjustment disorders. Russian registration is not recognised by other regulators. Check your national medicines regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["intranasal", "subcutaneous"],
  dosingResearch: [
    {
      title: "Selank versus medazepam in generalised anxiety disorder and neurasthenia",
      citation: "Zozulia AA et al., Zh Nevrol Psikhiatr Im S S Korsakova 2008;108(4):38–48",
      year: 2008,
      phase: "Phase 2/3 (Russian registration study)",
      design: "Randomised, open-label, active-comparator (medazepam); no placebo arm",
      population: "Adults with generalised anxiety disorder or neurasthenia (ICD-10)",
      n: 62,
      duration: "14 days",
      doses: "Selank 0.15% intranasal drops, 2.7 mg/day in three divided doses (30 patients) versus medazepam 30 mg/day orally (32 patients)",
      route: "intranasal",
      outcome:
        "Reductions in Hamilton and Zung anxiety scores were similar between groups; selank was reported to have additional 'anti-asthenic' and mild stimulant-like effects. Serum enkephalin-degrading activity changed during treatment.",
      adverseEvents: "No significant adverse effects reported; the report is available only in Russian and safety reporting is brief.",
      exposure: { doseMin: 0.9, doseMax: 0.9, unit: "mg", frequency: "three_times_daily", route: "intranasal", note: "2.7 mg/day total, the upper end of the Russian label range (0.9–2.7 mg/day)" },
      url: "https://pubmed.ncbi.nlm.nih.gov/18454096/",
    },
    {
      title: "Selank added to phenazepam in anxiety-spectrum disorders",
      citation: "Medvedev VE et al., Zh Nevrol Psikhiatr Im S S Korsakova 2015;115(6):33–40",
      year: 2015,
      phase: "Phase 4 (post-registration)",
      design: "Open-label, comparative: phenazepam alone versus phenazepam plus intranasal selank",
      population: "Adults with anxiety-phobic, hypochondriacal and somatoform disorders",
      n: 70,
      duration: "Course of treatment and benzodiazepine withdrawal (weeks)",
      doses: "Phenazepam alone (30 patients) or phenazepam plus selank 0.15% nasal drops at label dosing (40 patients)",
      route: "intranasal",
      outcome:
        "Earlier improvement on the Hamilton depression scale and fewer benzodiazepine side effects (sedation, attention and memory impairment) reported in the combination group; quality-of-life scores were higher.",
      adverseEvents: "No selank-attributed adverse events reported; tolerability assessed with the UKU scale.",
      url: "https://pubmed.ncbi.nlm.nih.gov/26356395/",
    },
  ],
  dosingResearchNote:
    "All human data come from small Russian trials using the registered 0.15% intranasal solution (label range 0.9–2.7 mg/day for 10–14 days). No human study has used the injectable 'research' vials sold online, and nothing published converts intranasal to subcutaneous exposure — injected 'protocols' are a different, unstudied exposure.",
  contraindications: [
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "Studied only in anxiety and neurasthenia under psychiatric supervision; not studied in depression, bipolar disorder or psychosis. Any mental-health condition warrants professional review before adding a centrally acting compound.",
    },
    {
      conditionId: "epilepsy",
      severity: "caution",
      note: "Effects on seizure threshold have not been studied in humans; a theoretical consideration for any centrally acting peptide.",
    },
  ],
  interactions: [
    {
      classId: "benzodiazepine_sedative",
      severity: "moderate",
      note: "Co-administered with phenazepam in one Russian trial without reported harm, but additive central effects cannot be excluded; unstudied with zopiclone or other sedatives.",
    },
    {
      classId: "antidepressant",
      severity: "moderate",
      note: "No interaction studies. Because selank is proposed to alter enkephalin and GABA signalling, combination with SSRIs, SNRIs or other antidepressants is unstudied and should be discussed with the prescriber.",
    },
  ],
  pregnancy: {
    status: "contraindicated",
    note: "The Russian label lists pregnancy and breastfeeding as contraindications. There are no human safety data.",
  },
  commonAdverseEffects: [
    "Nasal irritation or dryness (intranasal use)",
    "Transient drowsiness or, conversely, mild agitation",
    "Headache",
    "Unusual taste after nasal administration",
  ],
  seriousAdverseEffects: [
    "Allergic or hypersensitivity reactions (the only adverse effect listed on the Russian label)",
    "Unknown long-term effects — no safety data beyond a few weeks of use",
    "Injection-related infection or immune reactions with unregulated injectable products",
  ],
  monitoring: [
    "Anxiety and mood symptoms using a validated scale, ideally with a clinician",
    "Sleep pattern and daytime alertness",
    "Nasal symptoms with repeated intranasal use",
    "Any change in seizure control or psychiatric symptoms",
  ],
  sourceConsiderations: [
    "Outside Russia every product is an unregulated 'research chemical' with no medicines-grade quality control; identity, purity and sterility are unverified.",
    "Vials marketed for injection have never been studied in humans — the only human data use a nasal solution.",
    "Imported Russian nasal drops may be counterfeit; the registered product has no licence in the UK, US, EU, AU or CA.",
  ],
  clinicianQuestions: [
    "What authorised options exist for the anxiety or low-mood symptoms I am trying to address?",
    "Is there any evidence that selank helps people without a diagnosed anxiety disorder?",
    "How would this interact with my current medicines, particularly sedatives or antidepressants?",
    "Given that the only human studies used a nasal solution for two weeks, what is known about longer or injected use?",
    "How would we monitor whether it is doing anything, and when would we stop?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "semax",
      evidence: "limited",
      overlap: "Both are centrally acting Russian regulatory peptides administered intranasally.",
      note: "Commonly co-used in Russia and in online 'nootropic stacks', but no trial has tested the combination. Effects on alertness may be additive or opposing (selank calming, semax activating).",
    },
    {
      with: "dsip",
      evidence: "none",
      overlap: "Both have been associated with sedation or calming.",
      note: "No human data on the combination; overlapping sedative-type effects are a theoretical concern.",
    },
    {
      with: "epitalon",
      evidence: "none",
      note: "Marketed together as 'bioregulator' stacks; no combination data and neither compound has robust human evidence.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "No human data on this combination; BPC-157 itself lacks human efficacy data.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Synthetic tuftsin analogue (heptapeptide)" },
    { label: "Route", value: "Intranasal drops (Russian product); injected vials unstudied" },
    { label: "Human trials", value: "Two small Russian trials, n = 62 and n = 70" },
    { label: "Authorised", value: "Russia only (anxiety disorders); not UK, US, EU, AU or CA" },
    { label: "WADA", value: "Not on the Prohibited List" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Zozulia AA et al. Selank in generalised anxiety disorder and neurasthenia. Zh Nevrol Psikhiatr 2008", url: "https://pubmed.ncbi.nlm.nih.gov/18454096/" },
    { label: "Medvedev VE et al. Optimisation of the treatment of anxiety disorders with selank. Zh Nevrol Psikhiatr 2015", url: "https://pubmed.ncbi.nlm.nih.gov/26356395/" },
    { label: "FDA — Bulk drug substances that may present significant safety risks (503A Category 2)", url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks" },
    { label: "WADA 2026 Prohibited List", url: "https://www.wada-ama.org/en/prohibited-list" },
  ],
};
