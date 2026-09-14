import type { Compound } from "../types";

/**
 * Thymosin alpha-1 (thymalfasin, Zadaxin) — 28-amino-acid immunomodulatory
 * peptide authorised in more than 30 countries (notably China and Italy) for
 * chronic hepatitis B and as an immune adjuvant. Not FDA-approved; no UK,
 * EU-wide, AU or CA authorisation. Large sepsis trial (2025) was negative.
 */
export const thymosinAlpha1: Compound = {
  slug: "thymosin-alpha-1",
  name: "Thymosin alpha-1",
  aliases: ["Thymalfasin", "Zadaxin", "Tα1", "Ta1", "Thymosin α1", "TA-1"],
  family: "immune",
  classLabel: "Immunomodulatory thymic peptide (28 amino acids)",
  tagline: "Immune-modulating peptide medicine abroad; weak evidence for wellness use",
  summary:
    "Thymosin alpha-1 is a 28-amino-acid peptide originally isolated from thymic tissue and produced synthetically as thymalfasin (Zadaxin). It is authorised in more than 30 countries — most notably China and Italy — for chronic hepatitis B and, in some markets, as an adjuvant to chemotherapy or vaccination. It is not approved by the FDA, the MHRA or the EMA. Randomised trials in hepatitis B show modest virological benefit; a 361-patient sepsis trial suggested lower mortality, but a 1,106-patient phase 3 published in 2025 found no survival benefit. There are no trials in healthy adults seeking 'immune support'.",
  mechanism:
    "Acts on Toll-like receptors on dendritic cells and other innate immune cells, promoting T-cell maturation, natural-killer cell activity and a shift towards Th1 cytokine responses, while also having regulatory effects that may dampen excessive inflammation. It has a short plasma half-life (about two hours) but effects on immune cells persist for days.",
  goals: [
    {
      goal: "general_wellbeing",
      evidence: "limited",
      summary:
        "Immune-enhancing effects are documented in disease populations — for example higher monocyte HLA-DR expression in sepsis and improved vaccine responses in older or dialysis patients — but no trial has tested it for energy, resilience or fewer infections in healthy adults. The largest trial (sepsis, n = 1,106) showed no mortality benefit.",
    },
    {
      goal: "longevity",
      evidence: "insufficient",
      summary:
        "Age-related thymic decline is the rationale for 'immune ageing' marketing, but there are no human data on ageing outcomes; the Russian 'thymalin' longevity studies used a different thymic extract in non-blinded cohorts.",
    },
  ],
  overallEvidence: "moderate",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "No MHRA marketing authorisation; sold online only as an unregulated 'research chemical'.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; orphan designations only. Compounding not recommended by the FDA's advisory committee (2024).",
      detail:
        "Thymalfasin has orphan-drug designations (for example chronic hepatitis B, hepatocellular carcinoma, DiGeorge anomaly, malignant melanoma) but has never received FDA marketing approval; it has been used in the US only within trials and expanded-access programmes, including COVID-19 studies. It was placed in 503A 'Category 2' (significant safety risk) in September 2023; its compounding nomination was later withdrawn, and in December 2024 the FDA's Pharmacy Compounding Advisory Committee voted against adding thymosin alpha-1 (free base and acetate) to the 503A bulks list, citing inadequate characterisation, safety and effectiveness data. It is not on any current 503A list; verify against the FDA's lists.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "unclear",
      summary: "No EU-wide (EMA) authorisation; nationally authorised in Italy (Zadaxin) for hepatitis B and as an immune adjuvant.",
      detail:
        "There is no centralised EMA marketing authorisation and thymalfasin is not in the European Pharmacopoeia. Italy's national regulator (AIFA) has authorised Zadaxin since the late 1980s for chronic hepatitis B and as an adjuvant in immunocompromised patients; it is not authorised in most other member states. Prescription-only where authorised.",
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
      summary: "Authorised as Zadaxin in more than 30 countries (including China and Italy) for chronic hepatitis B and other indications; check your national regulator.",
      detail:
        "Approvals exist in China, Italy, several South-East Asian, Latin American, Eastern European and Middle Eastern countries — mainly for chronic hepatitis B and C, as a vaccine adjuvant in immunocompromised patients, and as a chemotherapy adjuvant. The FDA has noted it cannot independently verify every claimed approval. Prescription-only where authorised.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "Thymosin alpha-1 in chronic hepatitis B — randomised controlled trial",
      citation: "Chien RN et al., Hepatology 1998;27:1383–1387",
      year: 1998,
      phase: "Phase 3",
      design: "Randomised, controlled, open-label (6 or 12 months of treatment versus untreated control)",
      population: "Adults with HBeAg-positive chronic hepatitis B and raised transaminases",
      n: 98,
      duration: "6 or 12 months of treatment, 18 months of follow-up",
      doses: "1.6 mg subcutaneously twice weekly",
      route: "subcutaneous",
      outcome:
        "Sustained HBeAg and HBV-DNA clearance at 18 months was higher with 6 months of treatment (roughly four in ten) than in untreated controls (roughly one in ten); the 12-month arm did not perform better. Later meta-analyses pooled a modest benefit with delayed responses.",
      adverseEvents: "Well tolerated; local injection-site discomfort was the main complaint and no serious drug-related adverse events were reported.",
      exposure: { doseMin: 1.6, doseMax: 1.6, unit: "mg", frequency: "twice_weekly", route: "subcutaneous" },
    },
    {
      title: "ETASS — thymosin alpha-1 in severe sepsis",
      citation: "Wu J et al., Crit Care 2013;17:R8",
      year: 2013,
      phase: "Phase 3",
      design: "Multicentre, randomised, single-blind, controlled (saline)",
      population: "Adults admitted to intensive care with severe sepsis (six hospitals in China)",
      n: 361,
      duration: "7 days of treatment; 28-day follow-up",
      doses: "1.6 mg subcutaneously twice daily for 5 days, then once daily for 2 days",
      route: "subcutaneous",
      outcome:
        "28-day mortality 26.0% versus 35.0% (relative risk 0.74, 95% CI 0.54–1.02; P = 0.062), with greater recovery of monocyte HLA-DR expression. A promising but not statistically conclusive result that prompted the larger TESTS trial.",
      adverseEvents: "No serious drug-related adverse events recorded.",
      exposure: { doseMin: 1.6, doseMax: 1.6, unit: "mg", frequency: "twice_daily", route: "subcutaneous", note: "Short intensive-care regimen, not a maintenance dose" },
      url: "https://doi.org/10.1186/cc11932",
    },
    {
      title: "TESTS — thymosin alpha-1 in sepsis (phase 3)",
      citation: "Wu J et al., BMJ 2025;388:e082583",
      year: 2025,
      phase: "Phase 3",
      design: "Multicentre, randomised, double-blind, placebo-controlled (22 centres in China)",
      population: "Adults aged 18–85 with sepsis (Sepsis-3 criteria)",
      n: 1106,
      duration: "7 days of treatment; 28- and 90-day follow-up",
      doses: "1.6 mg subcutaneously every 12 hours for 7 days",
      route: "subcutaneous",
      outcome:
        "No clear benefit: 28-day mortality 23.4% versus 24.1% with placebo (hazard ratio 0.97, 95% CI 0.76–1.24; P = 0.82); 90-day mortality 31.0% versus 32.4%. No secondary or safety outcome differed. A pre-specified subgroup analysis suggested possible harm in patients under 60 and possible benefit in those with diabetes — hypothesis-generating only.",
      adverseEvents: "Adverse events and serious adverse events did not differ from placebo.",
      exposure: { doseMin: 1.6, doseMax: 1.6, unit: "mg", frequency: "twice_daily", route: "subcutaneous", note: "Short intensive-care regimen, not a maintenance dose" },
      url: "https://doi.org/10.1136/bmj-2024-082583",
    },
  ],
  dosingResearchNote:
    "The standard authorised regimen is 1.6 mg subcutaneously twice weekly for 6–12 months (hepatitis B) or short daily courses in acute illness. Every trial enrolled people with a diagnosed disease; there are no dosing data for healthy adults, and online 'immune support' regimens (for example 1.5 mg twice weekly indefinitely) are extrapolations, not evidence.",
  contraindications: [
    {
      conditionId: "autoimmune",
      severity: "caution",
      note: "An immune-stimulating peptide could theoretically aggravate autoimmune disease; people with autoimmune conditions were generally excluded from trials.",
    },
    {
      conditionId: "cancer",
      severity: "caution",
      note: "Used as a chemotherapy adjuvant in some countries, but any use alongside cancer treatment requires oncology input rather than self-directed use.",
    },
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Where the underlying condition is a primary immunodeficiency or endocrine disorder, specialist assessment is needed before any immunomodulator.",
    },
  ],
  interactions: [
    {
      classId: "immunosuppressant",
      severity: "moderate",
      note: "Opposing mechanism: the Zadaxin label advises against use in deliberately immunosuppressed patients (for example organ-transplant recipients) unless the potential benefit outweighs the risk of graft rejection or loss of disease control.",
    },
    {
      classId: "corticosteroid",
      severity: "minor",
      note: "Systemic corticosteroids may blunt the intended immune-enhancing effect; the combination has not been formally studied.",
    },
    {
      classId: "chemotherapy",
      severity: "minor",
      note: "Studied as an adjuvant to chemotherapy and interferon in trials; any combination should be directed by the oncology team.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No adequate human data; product information where authorised advises use in pregnancy only if clearly needed. Effects on breastfed infants are unknown.",
  },
  commonAdverseEffects: [
    "Injection-site discomfort, redness or irritation",
    "Muscle aches or fatigue (uncommon)",
    "Transient flu-like symptoms (uncommon)",
    "Nausea (uncommon)",
  ],
  seriousAdverseEffects: [
    "Allergic or hypersensitivity reactions (rare)",
    "Theoretical flare of autoimmune disease",
    "Graft rejection risk in transplant recipients (label caution)",
    "Immune reactions or infection with unregulated 'research chemical' vials",
  ],
  monitoring: [
    "A defined, measurable reason for use — 'immune support' cannot be monitored; infection frequency or a specific disease marker can",
    "Full blood count and, where relevant, immune-cell subsets before and during use",
    "Autoimmune symptoms (joint pain, rashes, fatigue) where there is any autoimmune history",
    "Liver enzymes and viral markers if used for chronic hepatitis under specialist care",
    "Injection sites for persistent reactions",
  ],
  sourceConsiderations: [
    "The authorised product (Zadaxin) is prescription-only and legally available only in countries where it is licensed; UK, US, EU-wide, Australian and Canadian supply is unlicensed.",
    "'Research chemical' thymosin alpha-1 sold online is not Zadaxin and has been flagged by the FDA for characterisation and immunogenicity concerns.",
    "Products labelled 'thymosin' may be thymosin beta-4 fragments (TB-500) — a different peptide with no shared evidence.",
  ],
  clinicianQuestions: [
    "Is there a diagnosed immune, infectious or liver condition that thymosin alpha-1 is actually licensed to treat somewhere?",
    "What does the negative 2025 sepsis trial tell us about extrapolating 'immune boosting' to healthy people?",
    "Do I have any autoimmune condition or take immunosuppressants that would make immune stimulation unwise?",
    "Which authorised options — vaccination, treating deficiencies, sleep and activity — address my goal with better evidence?",
    "If used, how would benefit be measured and when would it stop?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "ll-37",
      evidence: "none",
      overlap: "Both are immune-modulating peptides.",
      note: "Marketed together as 'immune stacks'; no human data on the combination, and systemic LL-37 has no human trials at all.",
    },
    {
      with: "epitalon",
      evidence: "none",
      note: "The extract-era Russian studies combined the thymic extract thymalin with epithalamin — different products from thymosin alpha-1 and epitalon; no data on this combination.",
    },
    {
      with: "tb-500",
      evidence: "none",
      overlap: "Similar names (thymosin alpha-1 versus thymosin beta-4 fragment) cause confusion, but they are unrelated peptides.",
      note: "No human data on the combination; TB-500 has no human efficacy data.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "No human data on this combination; BPC-157 itself lacks human efficacy data.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Immunomodulatory thymic peptide (28 amino acids)" },
    { label: "Route", value: "Subcutaneous injection, typically twice weekly" },
    { label: "Trial participants", value: "> 1,400 in the two sepsis trials alone; largest trial negative" },
    { label: "Authorised", value: "> 30 countries (e.g. China, Italy) for hepatitis B; not FDA, MHRA or EMA approved" },
    { label: "WADA", value: "Not specifically listed" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Wu J et al. ETASS — thymosin alpha 1 for severe sepsis. Crit Care 2013;17:R8", url: "https://doi.org/10.1186/cc11932" },
    { label: "Wu J et al. TESTS — thymosin α1 for sepsis, phase 3. BMJ 2025;388:e082583", url: "https://doi.org/10.1136/bmj-2024-082583" },
    { label: "Chien RN et al. Efficacy of thymosin α1 in patients with chronic hepatitis B: a randomised, controlled trial. Hepatology 1998;27:1383–1387" },
    { label: "FDA Pharmacy Compounding Advisory Committee briefing document — thymosin alpha-1 (December 2024)", url: "https://www.fda.gov/media/183892/download" },
    { label: "FDA — Bulk drug substances that may present significant safety risks (503A Category 2)", url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks" },
  ],
};
