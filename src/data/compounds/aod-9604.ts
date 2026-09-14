import type { Compound } from "../types";

/**
 * AOD-9604 — a synthetic C-terminal fragment of human growth hormone that
 * failed as an oral anti-obesity drug (development terminated 2007) and is now
 * sold without authorisation. Claims are derived from the pooled safety paper,
 * the FDA's December 2024 compounding evaluation and the WADA Prohibited List.
 */
export const aod9604: Compound = {
  slug: "aod-9604",
  name: "AOD-9604",
  aliases: ["AOD9604", "hGH fragment 176-191", "Tyr-hGH 177-191", "Anti-Obesity Drug 9604", "Advanced Obesity Drug"],
  family: "growth_hormone_axis",
  classLabel: "Synthetic C-terminal fragment of human growth hormone",
  tagline: "Failed obesity drug candidate now sold without authorisation; WADA-prohibited",
  summary:
    "AOD-9604 is a modified 16-amino-acid fragment of the C-terminus of human growth hormone (Tyr-hGH 177–191), developed by Metabolic Pharmaceuticals in Australia as an oral anti-obesity drug in the early 2000s. It was designed to keep growth hormone's fat-mobilising effect without raising IGF-1, but a 24-week phase 2b trial in 536 adults with obesity found no significant weight loss versus placebo and development was terminated in 2007. It is not authorised anywhere; injectable and oral versions are sold by unregulated vendors, and it is prohibited in sport.",
  mechanism:
    "Proposed to stimulate fat breakdown (lipolysis) and inhibit fat storage through a mechanism independent of the growth hormone receptor and IGF-1, possibly via β3-adrenergic signalling in rodent fat tissue. Human trials confirmed it does not raise IGF-1 or impair glucose tolerance, but also did not show meaningful fat or weight loss.",
  goals: [
    {
      goal: "fat_loss",
      evidence: "insufficient",
      summary:
        "The controlled human evidence is negative: a 24-week trial (536 enrolled; oral 0.25–1 mg daily) found no significant weight loss versus placebo, and a 12-week trial (n ≈ 300; 1–30 mg daily) reported only small, non-dose-dependent differences that were never published in full. Fat-mobilising effects are documented in rodents and in short human studies measuring free fatty acids, not fat loss.",
    },
    {
      goal: "weight_management",
      evidence: "insufficient",
      summary:
        "Development for obesity was abandoned in 2007 after the phase 2b trial failed its primary endpoint; the FDA's 2024 review concluded there is a lack of evidence of effectiveness for obesity by any route.",
    },
    {
      goal: "injury_recovery",
      evidence: "insufficient",
      summary:
        "Marketed for cartilage and joint repair on the basis of a rabbit osteoarthritis model (intra-articular injection with hyaluronic acid); there are no human studies for this use.",
    },
  ],
  overallEvidence: "insufficient",
  humanEvidenceLevel: "early_clinical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail:
        "No MHRA marketing authorisation. Supplying it as a medicine for human use without a licence is unlawful; online sellers label it 'not for human consumption' to sit outside medicines regulation, so there is no quality assurance.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; FDA's advisory committee voted against allowing it in compounded medicines.",
      detail:
        "Never approved. In September 2023 the FDA placed AOD-9604 in Category 2 of its interim 503A bulk-substances list (substances that may present significant safety risks and may not be used in compounding). After the nominations were withdrawn, the Pharmacy Compounding Advisory Committee voted unanimously in December 2024 against adding it to the 503A bulks list, citing lack of effectiveness evidence, limited safety data and immunogenicity and impurity concerns; the FDA proposed not to add it. It is therefore not an eligible compounding ingredient.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail: "No EMA or national marketing authorisation in any EU member state.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not registered on the ARTG; sold only as an unregulated 'research chemical'.",
      detail:
        "Developed in Australia but never registered on the Australian Register of Therapeutic Goods. An Australian Crime Commission report (2013) identified its use as a doping agent in sport.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised by Health Canada; sold only as an unregulated 'research chemical'.",
      detail: "No Health Canada authorisation for any indication.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Not known to be authorised as a medicine anywhere.",
      detail: "No regulator is known to have authorised AOD-9604. Check your national regulator, but assume any product sold online is unlicensed.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: true,
  routes: ["oral", "subcutaneous"],
  dosingResearch: [
    {
      title: "Pooled safety analysis of six sponsor-funded AOD9604 trials (2001–2006)",
      citation: "Stier H, Vos E, Kenley D. J Endocrinol Metab 2013;3:7–15",
      year: 2013,
      phase: "Pooled phase 1–2b",
      design: "Six randomised, double-blind, placebo-controlled trials (pooled safety analysis; sponsor-funded)",
      population: "Healthy men and adults with obesity",
      n: 893,
      duration: "Single doses to 24 weeks",
      doses:
        "Intravenous 25–400 mcg/kg single doses; oral 9–54 mg single and 7-day doses; oral 1–30 mg daily for 12 weeks; oral 0.25–1 mg daily for 24 weeks",
      route: "oral",
      outcome:
        "Safety analysis only: no effect on IGF-1 or glucose tolerance, no anti-AOD9604 antibodies detected, and no withdrawals or serious adverse events judged related to treatment. Efficacy was not reported; the two long-term trials did not show significant weight loss.",
      adverseEvents:
        "Headache, diarrhoea and flatulence (oral); headache, fatigue and dizziness (intravenous); severe chest tightness and euphoria judged possibly related after intravenous dosing; several cancers occurred in the 12-week trial and were judged unrelated by investigators. The FDA's 2024 review noted the paper lacks detail on methods and results.",
      exposure: {
        doseMin: 0.25,
        doseMax: 30,
        unit: "mg",
        frequency: "daily",
        route: "oral",
        note: "Oral daily dosing in the two long-term trials; no human data exist for subcutaneous injection",
      },
      url: "https://www.jofem.org/index.php/jofem/article/view/157",
    },
    {
      title: "OPTIONS phase 2b — oral AOD9604 in adults with obesity (unpublished, company-reported)",
      citation: "Metabolic Pharmaceuticals Ltd, ASX/SEC announcements 2007; summarised in FDA PCAC briefing document, December 2024",
      year: 2007,
      phase: "Phase 2b",
      design: "Randomised, double-blind, placebo-controlled (results announced by the company; never published in a peer-reviewed journal)",
      population: "Adults aged 18–65 with obesity (BMI 30–45) on a dietitian-supervised diet and exercise programme",
      n: 536,
      duration: "24 weeks",
      doses: "0.25, 0.5 or 1 mg orally once daily (502 randomised)",
      route: "oral",
      outcome:
        "No statistically significant difference in weight loss versus placebo at the 12-week primary endpoint or at 24 weeks; the company terminated development for obesity in February 2007.",
      adverseEvents:
        "The company reported no difference from placebo in safety or tolerability; full adverse-event data were never published.",
      exposure: { doseMin: 0.25, doseMax: 1, unit: "mg", frequency: "daily", route: "oral" },
      url: "https://www.fda.gov/media/183584/download",
    },
  ],
  dosingResearchNote:
    "Human data are limited to oral and intravenous dosing in sponsor trials that ended in 2007. There are no human studies of the subcutaneous injections or transdermal products now sold, no published pharmacokinetic data for any route, and no human data for joint or cartilage uses.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "caution",
      note: "Not studied in people with cancer; several malignancies occurred in the 12-week trial (judged unrelated by investigators) and the FDA's review noted equivocal genotoxicity signals in laboratory assays.",
    },
    {
      conditionId: "liver",
      severity: "caution",
      note: "Signals suggestive of liver toxicity were seen in monkeys dosed orally for nine months (FDA review); there are no human liver-safety data beyond 24 weeks.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Short trials found no effect on glucose tolerance or insulin, but people with diabetes were not the study population and no interaction data exist.",
    },
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Derived from growth hormone and marketed as a growth-hormone-related peptide; people with pituitary or other endocrine disorders should not assume it is inert.",
    },
    {
      conditionId: "eating_disorder",
      severity: "caution",
      note: "Products marketed for fat loss require specialist assessment where there is a current or previous eating disorder.",
    },
  ],
  interactions: [
    {
      classId: "growth_hormone",
      severity: "moderate",
      note: "Both derive from growth hormone; no interaction studies exist and combined effects are unknown.",
    },
    {
      classId: "glp1_agonist",
      severity: "minor",
      note: "No data on combining with incretin medicines; adding an unproven compound to an authorised weight-management medicine has no evidence base.",
    },
    {
      classId: "insulin",
      severity: "minor",
      note: "Trials found no effect on glucose or insulin in people without diabetes; no data in insulin users.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "minor",
      note: "No interaction data.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human data in pregnancy or breastfeeding; the FDA's review noted equivocal genotoxicity signals in laboratory assays. Avoidance is the only evidence-consistent position.",
  },
  commonAdverseEffects: [
    "Headache",
    "Diarrhoea",
    "Flatulence",
    "Fatigue",
    "Dizziness",
    "Injection-site reactions (unregulated injectable products; not studied in trials)",
  ],
  seriousAdverseEffects: [
    "Severe chest tightness judged possibly related to intravenous dosing in an early trial",
    "Immune or allergic reactions from aggregated or impure peptide (FDA concern; injectables never tested in humans)",
    "Infection or contamination from non-sterile, unregulated vials",
    "Unknown long-term effects — animal signals for bone and liver toxicity and equivocal genotoxicity",
    "Anti-doping violation (prohibited at all times under WADA S2)",
  ],
  monitoring: [
    "There is no evidence base to guide monitoring; a clinician cannot set expected effects because trials showed none",
    "Weight and body-fat trend against a realistic expectation of no benefit",
    "Liver function (animal toxicity signal; no long-term human data)",
    "Blood glucose if diabetic or on glucose-lowering medicines",
    "Injection-site reactions, rashes or other signs of an immune response",
    "Anti-doping status for anyone subject to testing",
  ],
  sourceConsiderations: [
    "Not authorised anywhere — every product is unregulated, with no assurance of identity, purity, sterility or dose; the FDA found inconsistencies in the sequence and structure published by some suppliers.",
    "In the US, the FDA's advisory committee voted against permitting AOD-9604 in compounded medicines, so clinic or 'med-spa' injections are not a regulated pathway.",
    "Prohibited at all times under the WADA Prohibited List (S2, growth hormone fragments); tested athletes risk a sanction.",
    "Sellers label vials 'for research use only' or 'not for human consumption' to avoid medicines law; this is a signal of the absence of oversight, not of quality.",
  ],
  clinicianQuestions: [
    "Given that the 24-week trial in 536 people showed no significant weight loss, what evidence supports this for my goal?",
    "Which authorised options for fat loss or weight management would be appropriate for me instead?",
    "If I have already used it, should liver function or other tests be checked?",
    "Am I subject to anti-doping rules, and how long could it be detectable?",
    "What are the legal implications of importing or possessing it in my country?",
  ],
  alternatives: ["semaglutide", "tirzepatide", "liraglutide"],
  stackNotes: [
    {
      with: "semaglutide",
      evidence: "none",
      note: "No human data on this combination; AOD-9604 adds no demonstrated benefit to an authorised weight-management medicine.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      note: "No human data on this combination; AOD-9604 adds no demonstrated benefit to an authorised weight-management medicine.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      overlap: "Both are marketed as growth-hormone-related fat-loss peptides.",
      note: "No human studies of the combination; neither is authorised.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      overlap: "Both are marketed as growth-hormone-related fat-loss peptides.",
      note: "No human studies of the combination; neither is authorised.",
    },
    {
      with: "tesamorelin",
      evidence: "none",
      overlap: "Both act on or derive from the growth-hormone axis.",
      note: "Tesamorelin is an authorised GHRH analogue for HIV-associated abdominal fat; adding AOD-9604 has no data.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "A common vendor 'stack' with no human data for either compound in combination.",
    },
    {
      with: "mots-c",
      evidence: "none",
      note: "A common vendor 'stack' with no human data for either compound in combination.",
    },
  ],
  keyFacts: [
    { label: "Status", value: "Not authorised anywhere; development abandoned 2007" },
    { label: "Class", value: "Synthetic hGH fragment (Tyr-hGH 177–191)" },
    { label: "Human trials", value: "6 trials, 893 participants (2001–2006); no significant weight loss" },
    { label: "WADA", value: "Prohibited at all times (S2, growth hormone fragments)" },
    { label: "Route", value: "Sold as injection or oral; only oral and intravenous dosing studied" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Stier H, Vos E, Kenley D. Safety and tolerability of AOD9604 in humans. J Endocrinol Metab 2013", url: "https://www.jofem.org/index.php/jofem/article/view/157" },
    { label: "FDA — Evaluation of AOD-9604 for the 503A bulks list (PCAC briefing document, December 2024)", url: "https://www.fda.gov/media/183584/download" },
    {
      label: "FDA — Bulk drug substances that may present significant safety risks (Category 2)",
      url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    },
    { label: "WADA Prohibited List (S2 — peptide hormones, growth factors, related substances and mimetics)", url: "https://www.wada-ama.org/en/prohibited-list" },
    { label: "Heffernan MA et al. Fat oxidation and weight loss in obese mice with hGH or a C-terminal fragment. Int J Obes 2001", url: "https://doi.org/10.1038/sj.ijo.0801740" },
  ],
};
