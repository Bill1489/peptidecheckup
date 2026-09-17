import type { Compound } from "../types";

/**
 * NAD+ — an endogenous coenzyme, not a peptide. Included because it is in the
 * Aervyn range. Human evidence is almost entirely for oral precursors (NR,
 * NMN); intravenous NAD+ has one small pharmacokinetic pilot and injectable
 * NAD+ has no controlled efficacy trials. Regulatory facts checked against the
 * FDA 503A nominations list (updated May 2026) and FDA compounding
 * communications on NAD+ injectables.
 */
export const nad: Compound = {
  slug: "nad",
  name: "NAD+",
  aliases: ["Nicotinamide adenine dinucleotide", "NAD", "NAD plus"],
  family: "longevity_metabolic",
  classLabel: "Coenzyme (not a peptide)",
  tagline: "Endogenous coenzyme; the human trials are of oral precursors, not injected NAD+",
  summary:
    "Nicotinamide adenine dinucleotide (NAD+) is a coenzyme present in every living cell, where it carries electrons in energy metabolism and is consumed by enzymes involved in DNA repair and cell signalling. Tissue levels fall with age in animals and, by some measures, in people. Almost all human trial evidence concerns oral precursors — nicotinamide riboside (NR) and nicotinamide mononucleotide (NMN) — which reliably raise blood NAD+ but have produced few functional changes. Intravenous NAD+ has been studied in one small pharmacokinetic pilot; injectable or subcutaneous NAD+ has no controlled efficacy trials, and no form of NAD+ is an authorised medicine anywhere.",
  mechanism:
    "NAD+ cycles between its oxidised (NAD+) and reduced (NADH) forms to carry electrons through glycolysis, the citric-acid cycle and oxidative phosphorylation, and is the substrate for NAD+-consuming enzymes — sirtuins, PARPs and CD38 — that regulate DNA repair, gene expression and cell signalling. Supplementation aims to reverse the age-related fall in cellular NAD+. Whether injected NAD+ enters cells intact, or is broken down to nicotinamide and rebuilt inside the cell, is unresolved in humans.",
  goals: [
    {
      goal: "general_wellbeing",
      evidence: "limited",
      summary:
        "Oral precursors raise blood NAD+ (1 g/day of NR raised white-cell NAD+ by about 60% in 24 adults over six weeks) but most trials found no change in energy, fatigue or physical function. A 60-day trial of NMN in 80 middle-aged adults (300–900 mg/day) reported a longer six-minute walking distance and better self-rated general health at the higher doses. Nothing comparable exists for injected NAD+.",
    },
    {
      goal: "longevity",
      evidence: "limited",
      summary:
        "The rationale is the age-related decline in NAD+ shown in animals and some human tissues. Precursor trials have shown biomarker changes — NR raised blood NAD+ and, in exploratory analyses, trended towards lower blood pressure and aortic stiffness — but no trial has measured healthspan, disease incidence or lifespan in people, and several NR trials found no change in insulin sensitivity, mitochondrial function or body composition.",
    },
    {
      goal: "athletic_performance",
      evidence: "insufficient",
      summary:
        "Endurance and recovery claims rest on rodent studies and on the walking-distance result in the NMN trial. NR trials in trained and untrained adults have not shown improved performance, and there are no human performance data for injected NAD+.",
    },
    {
      goal: "sleep",
      evidence: "insufficient",
      summary:
        "NAD+ is part of the molecular circadian clock, which underlies 'sleep and circadian' marketing. A 12-week trial of 250 mg NMN in 108 older adults found less afternoon drowsiness with afternoon dosing but no change in overall sleep quality; no trial has tested NAD+ itself with sleep as an outcome.",
    },
  ],
  overallEvidence: "limited",
  humanEvidenceLevel: "early_clinical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not an authorised medicine; sold as a supplement (oral precursors) or as an unlicensed injectable.",
      detail:
        "No MHRA marketing authorisation exists for NAD+ or any precursor. Nicotinamide riboside chloride is an authorised novel food for use in supplements; NMN has no novel-food authorisation in Great Britain. NAD+ infusions offered by private clinics and injectable NAD+ sold online are unlicensed products whose quality, sterility and content are not assessed by the regulator.",
      lastReviewed: "2026-09-16",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; oral precursors sold as supplements; compounded NAD+ injections exist but have not been evaluated by the FDA.",
      detail:
        "No NAD+ product is an approved drug. Nicotinamide adenine dinucleotide appears in 503A Category 1 (nominated for the compounding bulks list, still under evaluation), so state-licensed pharmacies may compound it for patient-specific prescriptions under the FDA's interim enforcement policy. That is not approval: the FDA has not evaluated compounded NAD+ for safety or effectiveness, and has warned compounders after adverse-event reports (severe chills, shaking, vomiting, fatigue) linked to food-grade NAD+ used in sterile injections.",
      lastReviewed: "2026-09-16",
    },
    EU: {
      status: "not_authorised",
      summary: "Not an authorised medicine; NR is an authorised novel food for supplements; injectable NAD+ is unauthorised.",
      detail:
        "No medicinal product containing NAD+ is authorised by the EMA or any member state. Nicotinamide riboside chloride is authorised under the Novel Food Regulation for food supplements; NMN is not. NAD+ infusions and injectables sold to consumers are unauthorised medicinal products.",
      lastReviewed: "2026-09-16",
    },
    AU: {
      status: "not_authorised",
      summary: "Not a registered medicine; compounded NAD+ injections on prescription are not TGA-evaluated; oral precursors sold as supplements.",
      detail:
        "No NAD+ product is on the Australian Register of Therapeutic Goods. Compounding pharmacies supply NAD+ injections against individual prescriptions, but compounded products are not evaluated by the TGA for quality, safety or efficacy.",
      lastReviewed: "2026-09-16",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised as a drug by Health Canada; oral precursors may be sold as natural health products; injectable NAD+ is unauthorised.",
      detail:
        "No Drug Identification Number exists for NAD+. Oral nicotinamide riboside products may be licensed as natural health products; injectable NAD+ from compounders or online sellers is not an authorised drug.",
      lastReviewed: "2026-09-16",
    },
    OTHER: {
      status: "unclear",
      summary: "Not known to be authorised as a medicine anywhere; supplement rules for precursors vary by country.",
      detail: "We are not aware of any national medicines regulator that has authorised NAD+ for human therapeutic use. Verify with your national regulator.",
      lastReviewed: "2026-09-16",
    },
  },
  wadaProhibited: false,
  routes: ["intravenous", "subcutaneous", "oral"],
  dosingResearch: [
    {
      title: "Oral nicotinamide riboside (an NAD+ precursor, not NAD+ itself) in healthy middle-aged and older adults",
      citation: "Martens CR et al., Nat Commun 2018;9:1286",
      year: 2018,
      phase: "Pilot",
      design: "Randomised, double-blind, placebo-controlled crossover (2 × 6 weeks)",
      population: "Healthy adults aged 55–79",
      n: 24,
      duration: "6 weeks per arm",
      doses: "Nicotinamide riboside chloride 500 mg twice daily (1,000 mg/day) by mouth",
      route: "oral",
      outcome:
        "NAD+ in peripheral blood mononuclear cells rose by about 60% versus placebo. No significant change in cardiovascular or physical-function measures in the main analyses; exploratory analyses suggested lower systolic blood pressure and aortic stiffness in those with raised baseline blood pressure.",
      adverseEvents:
        "Well tolerated; no serious adverse events and no difference in treatment-emergent adverse events versus placebo. Three participants reported flushing.",
      exposure: {
        doseMin: 1000,
        doseMax: 1000,
        unit: "mg",
        frequency: "daily",
        route: "oral",
        note: "nicotinamide riboside, an oral precursor — not NAD+ itself",
      },
      url: "https://www.nature.com/articles/s41467-018-03421-7",
    },
    {
      title: "Oral nicotinamide mononucleotide (NMN, an NAD+ precursor) in healthy middle-aged adults",
      citation: "Yi L et al., GeroScience 2023;45:29–43",
      year: 2023,
      phase: "Dose-ranging",
      design: "Randomised, multicentre, double-blind, placebo-controlled, parallel-group",
      population: "Healthy adults aged 40–65",
      n: 80,
      duration: "60 days",
      doses: "NMN 300 mg, 600 mg or 900 mg once daily by mouth versus placebo",
      route: "oral",
      outcome:
        "Blood NAD+ rose dose-dependently. Six-minute walking distance and self-rated general health (SF-36) improved significantly versus placebo at 600 mg and 900 mg by day 60; insulin resistance (HOMA-IR) did not change.",
      adverseEvents: "No safety signals; adverse events did not differ from placebo and blood chemistry stayed within normal ranges.",
      exposure: {
        doseMin: 300,
        doseMax: 900,
        unit: "mg",
        frequency: "daily",
        route: "oral",
        note: "nicotinamide mononucleotide, an oral precursor — not NAD+ itself",
      },
      url: "https://doi.org/10.1007/s11357-022-00705-1",
    },
    {
      title: "Intravenous NAD+ — plasma and urine NAD+ metabolome during a 6-hour infusion (pilot)",
      citation: "Grant R et al., Front Aging Neurosci 2019;11:257",
      year: 2019,
      phase: "Pilot pharmacokinetic study",
      design: "Randomised to NAD+ or saline (8 : 3), open-label",
      population: "Healthy men aged 30–55 with BMI below 30",
      n: 11,
      duration: "Single 6-hour infusion, sampled to 8 hours",
      doses: "750 mg NAD+ in saline infused over 6 hours (about 2 mg/min) — a regimen copied from wellness-clinic practice",
      route: "intravenous",
      outcome:
        "Plasma NAD+ and its metabolites were unchanged for the first 2 hours, then rose steeply by the end of the infusion (NAD+ roughly four-fold at 6 hours) and stayed raised at 8 hours; urinary excretion of NAD+ and methylnicotinamide peaked at 6 hours. The study measured exposure only — no clinical outcome.",
      adverseEvents:
        "No adverse events were observed in the eight infused participants; liver-enzyme activities fell slightly over 8 hours. The study was not designed or powered to assess safety.",
      exposure: { doseMin: 750, doseMax: 750, unit: "mg", frequency: "once", route: "intravenous", note: "single 6-hour infusion" },
      url: "https://doi.org/10.3389/fnagi.2019.00257",
    },
  ],
  dosingResearchNote:
    "The precursor trials show what oral NR and NMN did to blood NAD+ and to a handful of functional measures; they are not studies of NAD+ itself. The only human data on administered NAD+ are pharmacokinetic (the 6-hour infusion above) — there is no dose-finding, safety or efficacy trial of intravenous NAD+, and none at all of subcutaneous or intramuscular NAD+. Clinic and vendor regimens (for example 250–1,000 mg infused, or 50–200 mg injected subcutaneously several times a week) are empirical and have no trial basis.",
  contraindications: [
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "Rapid intravenous NAD+ is reported to cause chest tightness, palpitations and flushing, and NR trials hint at blood-pressure effects. Heart disease, arrhythmia or uncontrolled blood pressure needs professional assessment before any parenteral NAD+.",
    },
    {
      conditionId: "kidney",
      severity: "caution",
      note: "NAD+ and its metabolites are cleared by the kidney. High-dose exposure has not been studied in impaired renal function, and nicotinamide — the main breakdown product — can raise uric acid.",
    },
    {
      conditionId: "cancer",
      severity: "caution",
      note: "NAD+ supports the metabolism of rapidly dividing cells and PARP-mediated DNA repair. Whether raising NAD+ affects an existing or previous cancer is unknown in humans; PARP-inhibitor treatment is a specific theoretical conflict.",
    },
  ],
  interactions: [
    {
      classId: "chemotherapy",
      severity: "moderate",
      note: "Interactions are unstudied. PARP inhibitors (for example olaparib) act by competing with NAD+ at the enzyme, so raising NAD+ could in theory blunt them; disclose any NAD+ use to the treating oncologist.",
    },
    {
      classId: "antihypertensive",
      severity: "minor",
      note: "Exploratory NR data suggested small reductions in blood pressure, and rapid infusion causes transient haemodynamic symptoms. No formal interaction study exists; interactions with other medicine classes are simply unstudied.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human data on NAD+ infusions or injections in pregnancy or breastfeeding, and the precursor supplements have not been studied in pregnancy either. An unlicensed injectable is not appropriate while pregnant, trying to conceive or breastfeeding.",
  },
  commonAdverseEffects: [
    "Intravenous: flushing, nausea, chest tightness, abdominal cramping or headache during rapid infusion, usually easing when the rate is slowed (clinic reports; not measured in trials)",
    "Subcutaneous: injection-site pain, redness or bruising (user reports)",
    "Tiredness or a 'crash' in the hours after an infusion (user reports)",
    "Oral precursors: mild nausea, flushing, muscle aches or headache in trials, at rates similar to placebo",
  ],
  seriousAdverseEffects: [
    "Severe chills, shaking, vomiting and fatigue after injectable NAD+ compounded from food-grade material — reported to the FDA and consistent with endotoxin contamination",
    "Unknown long-term effects — no controlled safety data for injected NAD+",
    "Theoretical effects on an existing cancer (NAD+-dependent DNA repair and cell metabolism)",
    "Infection or abscess from non-sterile injectable products",
    "Allergic or infusion reactions (reported anecdotally; frequency unknown)",
  ],
  monitoring: [
    "Whether tiredness has a treatable cause — thyroid, iron, B12, vitamin D, sleep disorders, mood — before it is attributed to NAD+ levels",
    "Blood pressure, heart rate and symptoms during any infusion",
    "Liver function and uric acid with repeated high-dose exposure (high-dose nicotinamide, an NAD+ metabolite, can affect both)",
    "Kidney function where there is any renal impairment",
    "Injection sites for infection or persistent reactions",
    "An objective measure of the goal — a fatigue scale, walk test or training log — against a realistic baseline",
  ],
  sourceConsiderations: [
    "No pharmaceutical-grade, authorised NAD+ product exists anywhere; injectable NAD+ comes from compounding pharmacies or from unregulated 'research' suppliers.",
    "NAD+ in solution is unstable — it degrades with heat, light and time — so cold-chain handling, lot dating and an assay of actual NAD+ content matter more than for most compounds.",
    "The FDA has warned that food-grade NAD+ used in sterile compounding has caused endotoxin-type reactions; sterility and endotoxin testing on every lot are the relevant safeguards.",
    "The precursor trials used defined products (nicotinamide riboside chloride, β-NMN); independent testing has found wide variation in the actual content of retail NAD+ and NMN supplements.",
  ],
  clinicianQuestions: [
    "Has my tiredness or slow recovery been investigated — thyroid, iron, B12, vitamin D, sleep, mood — before I attribute it to NAD+?",
    "The human evidence is for oral precursors. Is there any reason to expect an injected form to do more?",
    "Is there anything in my history — heart disease, kidney disease, cancer or cancer treatment, gout — that makes raising NAD+ a concern?",
    "If I use an injectable product, what would you want to know about its sterility, endotoxin testing and NAD+ content?",
    "How would we measure whether it is doing anything, and when would we stop?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "mots-c",
      evidence: "none",
      overlap: "Both are marketed for mitochondrial function and energy.",
      note: "Sold together in 'mitochondrial' stacks. No human data on the combination; MOTS-c has no human efficacy data of its own, and the human data for NAD+ are for oral precursors.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "Marketed together in 'recovery' stacks. No human data on the combination, and neither has controlled human efficacy data for recovery.",
    },
    {
      with: "ghk-cu",
      evidence: "none",
      note: "No human data on the combination and no shared mechanism has been demonstrated.",
    },
    {
      with: "tesamorelin",
      evidence: "none",
      overlap: "Both are promoted for healthy ageing and body composition.",
      note: "No human studies of tesamorelin combined with NAD+ or its precursors.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Coenzyme (nicotinamide adenine dinucleotide) — not a peptide" },
    { label: "Human evidence", value: "Oral precursor trials (NR, NMN); one intravenous pharmacokinetic pilot (n = 11)" },
    { label: "Injected NAD+", value: "No controlled efficacy or safety trials" },
    { label: "Regulatory status", value: "Not an authorised medicine anywhere; oral supplement or compounded injectable" },
    { label: "Anti-doping", value: "Not on the WADA Prohibited List" },
  ],
  lastReviewed: "2026-09-16",
  references: [
    {
      label: "Martens CR et al. Chronic nicotinamide riboside supplementation is well-tolerated and elevates NAD+ in healthy middle-aged and older adults. Nat Commun 2018;9:1286",
      url: "https://www.nature.com/articles/s41467-018-03421-7",
    },
    {
      label: "Yi L et al. The efficacy and safety of β-nicotinamide mononucleotide (NMN) supplementation in healthy middle-aged adults: a randomized, multicenter, double-blind, placebo-controlled, parallel-group, dose-dependent clinical trial. GeroScience 2023;45:29–43",
      url: "https://doi.org/10.1007/s11357-022-00705-1",
    },
    {
      label: "Grant R et al. A pilot study investigating changes in the human plasma and urine NAD+ metabolome during a 6 hour intravenous infusion of NAD+. Front Aging Neurosci 2019;11:257",
      url: "https://doi.org/10.3389/fnagi.2019.00257",
    },
    {
      label: "Kim M et al. Effect of 12-week intake of nicotinamide mononucleotide on sleep quality, fatigue, and physical performance in older Japanese adults: a randomized, double-blind placebo-controlled study. Nutrients 2022;14:755",
      url: "https://doi.org/10.3390/nu14040755",
    },
    {
      label: "Dollerup OL et al. A randomized placebo-controlled clinical trial of nicotinamide riboside in obese men: safety, insulin-sensitivity, and lipid-mobilizing effects. Am J Clin Nutr 2018;108:343–353",
      url: "https://doi.org/10.1093/ajcn/nqy132",
    },
    {
      label: "FDA — FDA reminds compounders to use ingredients suitable for sterile compounding (food-grade NAD+ in injectable products)",
      url: "https://www.fda.gov/drugs/human-drug-compounding/fda-reminds-compounders-use-ingredients-suitable-sterile-compounding",
    },
    {
      label: "FDA — Bulk drug substances nominated for use in compounding under section 503A (NAD in Category 1; updated May 2026)",
      url: "https://www.fda.gov/media/94155/download",
    },
  ],
};
