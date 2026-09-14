import type { Compound } from "../types";

/**
 * LL-37 — the human cathelicidin antimicrobial peptide. Human evidence is
 * limited to topical trials in chronic venous leg ulcers (phase I/II positive
 * at low dose; phase IIb negative on its primary endpoint). Systemic or
 * injected use has no human trials and raises autoimmunity concerns.
 */
export const ll37: Compound = {
  slug: "ll-37",
  name: "LL-37",
  aliases: ["Cathelicidin LL-37", "hCAP18 (precursor)", "CAMP peptide", "Ropocamptide (topical analogue)"],
  family: "immune",
  classLabel: "Human cathelicidin antimicrobial peptide (37 amino acids)",
  tagline: "Human antimicrobial peptide: topical wound trials only, injected use untested",
  summary:
    "LL-37 is the only human cathelicidin, a 37-amino-acid antimicrobial peptide released from the precursor hCAP18 by skin, airway and immune cells. In the laboratory it kills bacteria, fungi and some viruses and promotes wound closure, which led to topical trials in chronic venous leg ulcers: a 34-patient phase I/II study showed faster healing at low concentrations, but a 148-patient phase IIb trial missed its primary endpoint. Injected or systemic LL-37 — the form sold online — has never been tested in humans, and the peptide is implicated in the autoimmunity of psoriasis and lupus. It is not authorised anywhere.",
  mechanism:
    "Disrupts microbial membranes directly and modulates innate immunity: it binds and neutralises bacterial lipopolysaccharide, recruits immune cells, promotes keratinocyte migration and angiogenesis in wounds, and can form complexes with self-DNA that activate dendritic cells — the pathway thought to drive inflammation in psoriasis. Its effects are strongly dose- and context-dependent.",
  goals: [
    {
      goal: "injury_recovery",
      evidence: "preliminary",
      summary:
        "Evidence is for topical application to chronic venous leg ulcers only. A phase I/II trial (n = 34) found roughly six-fold faster healing at 0.5 mg/mL, but the phase IIb trial (n = 148) showed no benefit overall, with an effect only in a post-hoc subgroup of large ulcers. There is no human evidence for tendon, ligament, muscle or joint injury, and none for injected use.",
    },
    {
      goal: "general_wellbeing",
      evidence: "insufficient",
      summary:
        "'Immune support' claims rest on in-vitro antimicrobial activity. No human trial has tested systemic LL-37 for infections, immunity or wellbeing, and high local concentrations increased inflammation rather than helping.",
    },
  ],
  overallEvidence: "preliminary",
  humanEvidenceLevel: "early_clinical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; unapproved drug awaiting FDA advisory-committee review for compounding.",
      detail:
        "Cathelicidin LL-37 has never been approved by the FDA. It was placed in 503A 'Category 2' (significant safety risk) in September 2023, then removed from Category 2 in April 2026 after its nomination was withdrawn — removal does not make it eligible for compounding. The FDA has indicated LL-37 will be considered at a Pharmacy Compounding Advisory Committee meeting scheduled before the end of February 2027. Verify against the FDA's current 503A lists.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EU or national marketing authorisation; the topical analogue remains investigational.",
      detail: "Topical LL-37 (ropocamptide) has been studied in EU clinical trials for venous leg ulcers but has no marketing authorisation.",
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
      status: "not_authorised",
      summary: "No marketing authorisation known in any country.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["topical", "subcutaneous"],
  dosingResearch: [
    {
      title: "Topical LL-37 in hard-to-heal venous leg ulcers — first-in-human phase I/II",
      citation: "Grönberg A et al., Wound Repair Regen 2014;22:613–621",
      year: 2014,
      phase: "Phase 1/2",
      design: "Randomised, double-blind, placebo-controlled, dose-ranging after a 3-week open placebo run-in",
      population: "Adults with chronic venous leg ulcers (Sweden)",
      n: 34,
      duration: "4 weeks of treatment, 4 weeks follow-up",
      doses: "LL-37 gel at 0.5, 1.6 or 3.2 mg/mL applied to the ulcer twice weekly, versus placebo gel",
      route: "topical",
      outcome:
        "Healing-rate constants were about six-fold (0.5 mg/mL; P = 0.003) and three-fold (1.6 mg/mL; P = 0.088) higher than placebo, with mean ulcer area falling 68% and 50% respectively. The highest concentration (3.2 mg/mL) produced no improvement.",
      adverseEvents: "No systemic safety concerns. More local wound reactions in the 3.2 mg/mL group; the two lower concentrations were well tolerated.",
      url: "https://doi.org/10.1111/wrr.12211",
    },
    {
      title: "HEAL LL-37 — topical LL-37 in venous leg ulcers, phase IIb",
      citation: "Mahlapuu M et al., Wound Repair Regen 2021;29:938–950",
      year: 2021,
      phase: "Phase 2b",
      design: "Multicentre, randomised, double-blind, placebo-controlled (Poland and Sweden), with compression therapy",
      population: "Adults with hard-to-heal venous leg ulcers (mean age 68; median ulcer duration 20 months)",
      n: 148,
      duration: "13 weeks of treatment, 4 months follow-up",
      doses: "LL-37 gel at 0.5 or 1.6 mg/mL applied twice weekly, versus placebo gel",
      route: "topical",
      outcome:
        "No significant improvement in healing versus placebo in the full population (confirmed complete closure 26.5% vs 24.7% vs 25.3%). A post-hoc analysis suggested benefit with 0.5 mg/mL in ulcers of at least 10 cm². The developer's later programme (ropocamptide) has not led to an authorised product.",
      adverseEvents: "Well tolerated at both strengths; 12 serious adverse events in 11 patients, none judged related to treatment.",
      url: "https://doi.org/10.1111/wrr.12977",
    },
  ],
  dosingResearchNote:
    "Both human trials applied a low-concentration gel directly to chronic skin ulcers; these concentrations are not comparable to any injected dose. No human study has given LL-37 by injection, nasally or orally, so the 'research chemical' vials sold online (typically 50–125 µg subcutaneous 'protocols') represent an entirely untested exposure. Higher local concentrations were less effective and more irritating, so 'more' is not better.",
  contraindications: [
    {
      conditionId: "autoimmune",
      severity: "caution",
      note: "LL-37 complexed with self-DNA is a recognised trigger of dendritic-cell activation in psoriasis and is implicated in lupus and rheumatoid arthritis. Exogenous LL-37 in anyone with an autoimmune or inflammatory skin condition is a theoretical risk with no safety data.",
    },
    {
      conditionId: "active_infection",
      severity: "caution",
      note: "Despite antimicrobial claims, LL-37 is not a substitute for assessment and treatment of an active infection; there is no human evidence for infection control.",
    },
    {
      conditionId: "cancer",
      severity: "caution",
      note: "LL-37 has been reported to promote growth of some tumour types (for example ovarian, lung and breast cancer cells) and to suppress others in laboratory studies; effects in people with cancer are unknown.",
    },
  ],
  interactions: [
    {
      classId: "immunosuppressant",
      severity: "moderate",
      note: "Interactions are unstudied. An innate-immune activator alongside immunosuppressants or biologics for autoimmune disease could counteract treatment or provoke flares — a theoretical concern.",
    },
    {
      classId: "corticosteroid",
      severity: "minor",
      note: "Interactions are unstudied; corticosteroids may blunt any immune effect. Listed for completeness.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or animal reproductive safety data; use in pregnancy or breastfeeding cannot be assessed.",
  },
  commonAdverseEffects: [
    "Local wound irritation or inflammation at higher topical concentrations",
    "Injection-site reactions (anecdotal; no trial data for injected use)",
    "Dermatitis (reported in the phase IIb trial)",
  ],
  seriousAdverseEffects: [
    "Triggering or worsening of autoimmune or inflammatory disease (theoretical, mechanism-based)",
    "Immune reactions to peptide impurities in unregulated products (flagged by the FDA)",
    "Injection-related infection with non-sterile products",
    "Unknown systemic effects — no human data for any non-topical route",
  ],
  monitoring: [
    "Wound size and appearance if used topically under professional supervision",
    "Skin for new or worsening psoriasis-like or inflammatory lesions",
    "Autoimmune symptoms (joint pain, rashes, fatigue), particularly with any autoimmune history",
    "Signs of infection at wounds or injection sites",
  ],
  sourceConsiderations: [
    "Every product available is an unregulated 'research chemical'; the FDA has flagged immunogenicity and impurity risks for LL-37.",
    "The trial material was a pharmaceutical-grade gel formulated for wounds; injectable vials sold online have no human safety data and no independent quality assurance.",
    "The 37-amino-acid sequence is prone to aggregation and degradation, so labelled potency of stored vials is unreliable.",
  ],
  clinicianQuestions: [
    "Is my injury the kind of wound (chronic skin ulcer) that LL-37 has actually been studied for, or a tendon, muscle or joint problem where there is no evidence?",
    "Given that injected LL-37 has never been tested in people, what is realistically known about its safety?",
    "Do I have any autoimmune or inflammatory skin condition that this peptide could plausibly aggravate?",
    "What evidence-based options — physiotherapy, load management, authorised wound care — should be optimised first?",
    "How would we monitor for benefit or for an inflammatory reaction?",
  ],
  alternatives: ["collagen-peptides"],
  stackNotes: [
    {
      with: "thymosin-alpha-1",
      evidence: "none",
      overlap: "Both are immune-modulating peptides.",
      note: "Marketed together as 'immune stacks'; no human data on the combination, and systemic LL-37 has no human trials at all.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      overlap: "Both are promoted for wound and tissue healing.",
      note: "No human data on the combination; BPC-157 lacks human efficacy data and LL-37's evidence is topical only.",
    },
    {
      with: "tb-500",
      evidence: "none",
      overlap: "Both are promoted for healing and recovery.",
      note: "No human data on the combination; TB-500 has no human efficacy data.",
    },
    {
      with: "ghk-cu",
      evidence: "none",
      overlap: "Both are promoted for skin and wound repair.",
      note: "No human data on the combination.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Human cathelicidin antimicrobial peptide (37 amino acids)" },
    { label: "Route studied", value: "Topical gel on chronic ulcers; injected use untested in humans" },
    { label: "Human trials", value: "Two topical trials (n = 34 and n = 148); phase IIb negative overall" },
    { label: "Authorised", value: "Nowhere" },
    { label: "WADA", value: "Not on the Prohibited List" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Grönberg A et al. Treatment with LL-37 is safe and effective in enhancing healing of hard-to-heal venous leg ulcers. Wound Repair Regen 2014", url: "https://doi.org/10.1111/wrr.12211" },
    { label: "Mahlapuu M et al. Evaluation of LL-37 in healing of hard-to-heal venous leg ulcers: multicentre randomised placebo-controlled trial. Wound Repair Regen 2021", url: "https://doi.org/10.1111/wrr.12977" },
    { label: "Lande R et al. Plasmacytoid dendritic cells sense self-DNA coupled with antimicrobial peptide (LL-37) in psoriasis. Nature 2007", url: "https://doi.org/10.1038/nature06116" },
    { label: "FDA — Bulk drug substances that may present significant safety risks (503A Category 2)", url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks" },
    { label: "WADA 2026 Prohibited List", url: "https://www.wada-ama.org/en/prohibited-list" },
  ],
};
