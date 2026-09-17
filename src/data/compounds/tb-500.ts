import type { Compound } from "../types";

/**
 * TB-500 — a synthetic fragment of thymosin beta-4. The record deliberately
 * separates the fragment (no human trials) from full-length thymosin beta-4
 * (RegeneRx RGN-259 / RGN-137), which has been through phase 2/3 trials as
 * eye drops and topical gel. Regulatory facts checked against the FDA 503A
 * category list (May 2026) and the WADA 2025 Prohibited List.
 */
export const tb500: Compound = {
  slug: "tb-500",
  name: "TB-500",
  aliases: ["Thymosin beta-4 fragment", "Tβ4 17–23", "LKKTETQ", "Ac-LKKTETQ", "TB500", "Thymosin beta 4 (TB-500)"],
  family: "tissue_repair",
  classLabel: "Synthetic thymosin β4 fragment (residues 17–23)",
  tagline: "Thymosin β4 fragment sold for healing; no human trials of the fragment",
  summary:
    "TB-500 is a short synthetic peptide (Ac-LKKTETQ) copying the actin-binding region of thymosin beta-4, a 43-amino-acid protein involved in cell migration and wound repair. Full-length thymosin beta-4 has been tested in human trials as eye drops and skin gel with mixed results, but the TB-500 fragment sold online has never been studied in people. It is not authorised anywhere and is prohibited in sport as a growth-factor derivative.",
  mechanism:
    "Thymosin β4 binds actin and regulates its assembly, which in laboratory and animal models promotes cell migration, new blood-vessel formation, reduced inflammation and scar-free wound healing. The 17–23 fragment retains the actin-binding sequence; whether it reproduces the parent protein's effects in humans has not been tested.",
  goals: [
    {
      goal: "injury_recovery",
      evidence: "insufficient",
      summary:
        "Animal studies of full-length thymosin β4 show faster wound closure and improved cardiac and corneal repair. No human study of the TB-500 fragment exists for any injury; the parent protein's human trials are in eye and skin wounds, not musculoskeletal injury.",
    },
    {
      goal: "muscle_recovery",
      evidence: "insufficient",
      summary:
        "Rodent and horse data suggest thymosin β4 influences muscle repair; there are no human recovery, soreness or strength studies of TB-500.",
    },
    {
      goal: "athletic_performance",
      evidence: "insufficient",
      summary:
        "No performance data in humans. TB-500 has a history of illicit use in horse racing, which is why doping-control laboratories developed tests for it.",
    },
    {
      goal: "hair",
      evidence: "insufficient",
      summary:
        "Hair-growth claims rest on mouse studies in which thymosin β4 accelerated follicle development; nothing has been published in humans.",
    },
  ],
  overallEvidence: "insufficient",
  humanEvidenceLevel: "preclinical_only",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "No marketing authorisation; sold online as a 'research chemical'.",
      detail:
        "No MHRA-licensed medicine contains TB-500 or thymosin β4. Products labelled 'for research use only' fall outside medicines quality controls.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; compounding eligibility under review after a 2023 safety listing.",
      detail:
        "The thymosin β4 fragment (LKKTETQ) was placed in 503A Category 2 in September 2023 because the FDA had no human exposure data and identified immunogenicity and impurity risks. It was removed from Category 2 in April 2026 when its nomination was withdrawn, and in July 2026 the Pharmacy Compounding Advisory Committee recommended it be considered for the 503A bulks list. Rulemaking is pending; the fragment remains unapproved and not a component of any approved drug. Full-length thymosin β4 (RGN-259) is investigational only.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EMA or national authorisation for TB-500 or thymosin β4.",
      detail:
        "RGN-259 (full-length thymosin β4 eye drops) has been trialled in Europe but is not authorised. TB-500 fragment products sold to consumers are unauthorised medicinal products.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not on the ARTG; TGA treats injectable peptides as prescription medicines.",
      detail:
        "No product containing TB-500 is registered on the Australian Register of Therapeutic Goods. The TGA has taken compliance action against online advertising and supply of unapproved peptides.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised by Health Canada.",
      detail: "No Drug Identification Number has been issued for TB-500 or thymosin β4; unauthorised injectable peptides are unapproved drugs.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "No known approval by any national medicines regulator; check locally.",
      detail: "We are not aware of any country that has authorised TB-500 for human use. Verify with your national regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: true,
  routes: ["subcutaneous", "intramuscular"],
  dosingResearch: [
    {
      title: "Full-length thymosin β4 (RGN-259 0.1% eye drops), NOT the TB-500 fragment — SEER-1 in neurotrophic keratopathy",
      citation: "Sosne G et al., Int J Mol Sci 2023;24(1):554",
      year: 2023,
      phase: "Phase 3 (terminated early for slow recruitment)",
      design: "Randomised, double-masked, placebo-controlled",
      population: "Adults with stage 2–3 neurotrophic keratopathy (persistent corneal epithelial defects)",
      n: 18,
      duration: "4 weeks of treatment, follow-up to day 43",
      doses: "0.1% timbetasin (thymosin β4) ophthalmic solution, one drop five times daily — a topical eye medicine, not an injected peptide",
      route: "topical",
      outcome:
        "Complete corneal healing at 4 weeks in 6 of 10 treated versus 1 of 8 placebo eyes (p = 0.0656, not statistically significant); the later European SEER-3 trial missed its primary endpoint and the US SEER-2 trial reads out in late 2026.",
      adverseEvents: "No significant adverse effects were observed; the three phase 3 dry-eye trials (ARISE) also reported a benign safety profile in over 1,600 participants.",
      url: "https://www.mdpi.com/1422-0067/24/1/554",
    },
  ],
  dosingResearchNote:
    "The study above used the full 43-amino-acid thymosin β4 protein as eye drops and is included only to show what human research on the parent molecule looks like. The TB-500 fragment that is sold for injection has no human pharmacokinetic, dose-finding, safety or efficacy studies of any kind — the FDA stated in 2023 that it had identified no human exposure data. Vendor 'loading and maintenance' schedules (commonly 2–5 mg per week) are extrapolated from veterinary and animal use and are not evidence.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "caution",
      note: "Thymosin β4 is over-expressed in several tumour types and promotes angiogenesis and cell migration in cancer models; the effect of exogenous peptide on an existing or previous cancer is unknown.",
    },
    {
      conditionId: "clotting",
      severity: "caution",
      note: "Thymosin β4 is abundant in platelets and influences clot structure in laboratory studies; there are no human data on bleeding or thrombosis risk.",
    },
    {
      conditionId: "autoimmune",
      severity: "caution",
      note: "The FDA has flagged immunogenicity and aggregation risk for the injected fragment; effects in autoimmune disease or alongside immune-modifying therapy are unknown.",
    },
  ],
  interactions: [
    {
      classId: "anticoagulant",
      severity: "moderate",
      note: "Interactions are unstudied in humans. Given thymosin β4's role in platelet and actin biology, combination with a blood thinner should not be assumed safe.",
    },
    {
      classId: "chemotherapy",
      severity: "moderate",
      note: "A pro-angiogenic, pro-migratory peptide could in theory oppose anti-angiogenic or anti-metastatic cancer treatment; this has not been tested. Disclose to the treating oncologist.",
    },
    {
      classId: "immunosuppressant",
      severity: "minor",
      note: "Thymosin β4 has anti-inflammatory and immune-modulating actions in animals; no human data on combined use with immunosuppressants.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or reproductive-toxicity data exist for the fragment. An unlicensed injectable of unknown purity is not something to use while pregnant, trying to conceive or breastfeeding.",
  },
  commonAdverseEffects: [
    "Not systematically studied in humans",
    "Injection-site pain, redness or bruising (user reports)",
    "Headache or lethargy shortly after injection (user reports)",
    "Transient nausea or 'head rush' (user reports)",
  ],
  seriousAdverseEffects: [
    "Unknown — no human safety data for the fragment",
    "Theoretical promotion of tumour growth or spread (angiogenic and pro-migratory activity)",
    "Immune reactions to the peptide, aggregates or impurities (FDA-identified risk)",
    "Infection from non-sterile injectable products",
    "Unpredictable effects from mislabelled or contaminated vials",
  ],
  monitoring: [
    "Injection sites for infection or persistent reactions",
    "Any new lump, changing mole or unexplained symptom, given the angiogenic mechanism",
    "Bleeding or bruising if combined with any blood thinner",
    "Whether the underlying injury has been properly diagnosed and imaged",
    "Anti-doping status if you compete in tested sport (prohibited at all times under S2.3)",
  ],
  sourceConsiderations: [
    "No authorised, pharmaceutical-grade TB-500 exists anywhere; all products come from unregulated suppliers with no GMP assurance.",
    "Identity is a specific problem: vials sold as 'TB-500' may contain the fragment, full-length thymosin β4, a different peptide or nothing active — independent analyses of grey-market peptides have found all of these.",
    "The FDA's 2023 safety listing cited aggregation, peptide-related impurities and immunogenicity — risks that are greatest for poorly manufactured injectables.",
    "Regulators in the UK, Australia and Canada have acted against online sellers of unapproved injectable peptides; a seller's certificate of analysis is not independent verification.",
  ],
  clinicianQuestions: [
    "Has my injury been properly diagnosed, and what does the evidence-based rehabilitation pathway look like?",
    "Do I understand that the human trials I have read about used full-length thymosin β4 as eye drops, not the injectable fragment?",
    "Does my history — any cancer, clotting or autoimmune condition — make an angiogenic peptide a particular concern?",
    "If I have already used TB-500, are there any checks you would recommend?",
    "Are there authorised treatments or supplements with actual human evidence for my goal?",
  ],
  alternatives: ["collagen-peptides"],
  stackNotes: [
    {
      with: "bpc-157",
      evidence: "none",
      overlap: "Both are marketed as tissue-repair peptides acting through angiogenesis and cell migration.",
      note: "The most commonly co-marketed 'healing stack'. Neither peptide has human efficacy data alone; there are no data on the combination, and both are WADA-prohibited.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      note: "No human studies of TB-500 combined with growth-hormone secretagogues; both are WADA-prohibited.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      note: "No human studies of TB-500 combined with growth-hormone secretagogues; both are WADA-prohibited.",
    },
    {
      with: "igf-1-lr3",
      evidence: "none",
      overlap: "Both sit in WADA's S2.3 growth-factor category and both drive cell growth and migration.",
      note: "No human data; combining two growth-factor-type agents of unknown purity multiplies theoretical tumour-promotion concerns.",
    },
    {
      with: "thymosin-alpha-1",
      evidence: "none",
      overlap: "Similar names, different peptides: thymosin α1 is an immune-modulating peptide, thymosin β4 an actin-binding repair protein.",
      note: "The two are often confused or sold together; there are no human data on combined use.",
    },
    {
      with: "ghk-cu",
      evidence: "none",
      note: "No human data. Both are promoted for repair and both show angiogenic activity in laboratory models.",
    },
    {
      with: "kpv",
      evidence: "none",
      note: "Blended together in the Klow pen. No human data on the combination; TB-500 has no human data at all and KPV has none by any route.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Synthetic 7-amino-acid fragment of thymosin β4" },
    { label: "Human trials", value: "None for the fragment; parent protein trialled as eye drops (mixed results)" },
    { label: "Regulatory status", value: "Not authorised anywhere; US compounding review ongoing" },
    { label: "Anti-doping", value: "Prohibited at all times (WADA S2.3 growth factors)" },
    { label: "Typical sale form", value: "Unregulated injectable vials (2 mg / 5 mg / 10 mg)" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    {
      label: "WADA Prohibited List 2025 — S2.3 growth factors: 'thymosin-β4 and its derivatives e.g. TB-500'",
      url: "https://www.wada-ama.org/sites/default/files/2024-09/2025list_en_final_clean_12_september_2024.pdf",
    },
    {
      label: "FDA — Certain bulk drug substances for use in compounding that may present significant safety risks (thymosin β4 fragment entry)",
      url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    },
    {
      label: "Sosne G et al. 0.1% RGN-259 (thymosin β4) ophthalmic solution in neurotrophic keratopathy — phase 3 (SEER-1). Int J Mol Sci 2023",
      url: "https://www.mdpi.com/1422-0067/24/1/554",
    },
    {
      label: "Goldstein AL, Hannappel E, Sosne G, Kleinman HK. Thymosin β4: a multi-functional regenerative peptide. Expert Opin Biol Ther 2012;12:37–51",
    },
    {
      label: "Ho ENM et al. Doping control analysis of TB-500, a synthetic version of an active region of thymosin β4, in equine urine and plasma. J Chromatogr A 2012;1265:57–69",
    },
    {
      label: "RegeneRx — RGN-259 development programme (neurotrophic keratopathy and dry eye)",
      url: "https://www.regenerx.com/RGN-259",
    },
  ],
};
