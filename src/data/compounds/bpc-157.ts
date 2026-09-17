import type { Compound } from "../types";

/**
 * BPC-157 — a research peptide with an extensive rodent literature and almost
 * no published human evidence. Regulatory facts below were checked against the
 * FDA 503A category list (updated May 2026), the FDA compounding safety-risk
 * page and the WADA 2025 Prohibited List.
 */
export const bpc157: Compound = {
  slug: "bpc-157",
  name: "BPC-157",
  aliases: ["Body Protection Compound-157", "BPC 157", "Bepecin", "PL 14736", "Pentadecapeptide BPC"],
  family: "tissue_repair",
  classLabel: "Synthetic pentadecapeptide",
  tagline: "Widely sold 'healing peptide' with animal data but no published human trials",
  summary:
    "BPC-157 is a synthetic 15-amino-acid peptide based on a partial sequence of a protein found in human gastric juice. A single research group in Zagreb has published hundreds of rodent studies reporting faster healing of tendon, ligament, muscle, bone, gut and blood-vessel injuries. No randomised human efficacy trial has ever been published, it is not authorised as a medicine anywhere, and it is prohibited in sport.",
  mechanism:
    "In animal models BPC-157 appears to promote blood-vessel formation (angiogenesis via VEGFR2 signalling), modulate the nitric-oxide system, increase growth-hormone receptor expression in tendon cells and stabilise the gut lining. Whether any of this happens in humans at the doses sold online is unknown.",
  goals: [
    {
      goal: "injury_recovery",
      evidence: "insufficient",
      summary:
        "Rat models of Achilles tendon, medial collateral ligament and muscle-crush injury show faster healing; there are no controlled human trials. A retrospective series of 16 intra-articular knee injections and case reports are the only human data.",
    },
    {
      goal: "muscle_recovery",
      evidence: "insufficient",
      summary:
        "Claims of faster recovery from training rest entirely on rodent muscle-injury models; no human study has measured strength, soreness or recovery time.",
    },
    {
      goal: "general_wellbeing",
      evidence: "insufficient",
      summary:
        "Marketed for gut health, mood and 'systemic repair'. Rodent studies of NSAID-induced gut damage and colitis exist; a Croatian phase 2 ulcerative-colitis trial was completed in the early 2000s but its results were never published.",
    },
  ],
  overallEvidence: "insufficient",
  humanEvidenceLevel: "preclinical_only",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "No marketing authorisation; sold online as a 'research chemical'.",
      detail:
        "No MHRA-licensed medicine contains BPC-157 and it cannot legally be sold or advertised for human use. Products labelled 'not for human consumption' fall outside medicines quality controls, so identity, purity and sterility are unverified.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; compounding eligibility under review after a 2023 safety listing.",
      detail:
        "BPC-157 is not an approved drug. In September 2023 the FDA placed it in 503A Category 2 (significant safety risks: immunogenicity, peptide impurities and no human safety data for the proposed routes), making it ineligible for pharmacy compounding. It was removed from Category 2 in April 2026 only because its nomination was withdrawn; in July 2026 the Pharmacy Compounding Advisory Committee narrowly recommended it be considered for the 503A bulks list. Final FDA rulemaking is pending, and a favourable committee vote is not approval.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EMA or national marketing authorisation in any member state.",
      detail:
        "No application has been made to the EMA. Injectable and oral products sold to EU consumers as 'research peptides' are unauthorised medicinal products.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not on the ARTG; TGA has acted against online peptide sellers.",
      detail:
        "No product containing BPC-157 is registered on the Australian Register of Therapeutic Goods. The TGA treats injectable peptides as prescription medicines and has issued infringement notices for unlawful advertising and supply of unapproved peptides.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised by Health Canada.",
      detail:
        "No Drug Identification Number has been issued. Injectable peptides sold online without authorisation are unapproved drugs under the Food and Drugs Act.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "No known approval by any national medicines regulator; check locally.",
      detail: "We are not aware of any country that has authorised BPC-157 for human therapeutic use. Verify with your national regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: true,
  routes: ["subcutaneous", "oral"],
  dosingResearch: [],
  dosingResearchNote:
    "There are no published human dose-finding or efficacy studies. A placebo-controlled phase 1 study of a rectal formulation in 32 healthy men (Pliva, early 2000s) and a 2015 oral phase 1 study in 42 volunteers (NCT02637284) were never published in full; a Croatian phase 2 ulcerative-colitis trial has no public results. Published human data are limited to a two-person intravenous pilot (2025), a 12-person uncontrolled bladder-instillation pilot and a retrospective knee-injection series. The 'protocols' quoted by vendors (typically 200–500 mcg per day) are extrapolated from rodent mg/kg doses and are not evidence of safety or efficacy in people.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "caution",
      note: "BPC-157 promotes new blood-vessel growth and growth-factor signalling in animal models. Whether this could affect an existing or previous tumour is unknown, so any cancer history needs specialist review.",
    },
    {
      conditionId: "clotting",
      severity: "caution",
      note: "Animal studies report effects on blood vessels, platelets and the nitric-oxide system in both directions; there are no human data on bleeding or clotting risk.",
    },
    {
      conditionId: "gastrointestinal",
      severity: "caution",
      note: "Marketed heavily for gut conditions, but no human trial in inflammatory bowel disease has been published; symptoms attributed to a diagnosed condition should be assessed rather than self-treated.",
    },
    {
      conditionId: "autoimmune",
      severity: "caution",
      note: "The FDA has flagged an immunogenicity risk for injected BPC-157; effects in people with autoimmune disease or on immune-modifying treatment are unknown.",
    },
  ],
  interactions: [
    {
      classId: "anticoagulant",
      severity: "moderate",
      note: "Interactions are entirely unstudied in humans. Because BPC-157 alters vascular and platelet biology in animals, combining it with a blood thinner should not be assumed safe.",
    },
    {
      classId: "antiplatelet",
      severity: "moderate",
      note: "As for anticoagulants: no human data, and animal studies show effects on platelet function.",
    },
    {
      classId: "chemotherapy",
      severity: "moderate",
      note: "A pro-angiogenic peptide could in theory counteract anti-angiogenic cancer treatments; nobody has tested this. Any cancer treatment should be disclosed to the treating oncologist.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or formal animal reproductive-toxicity data exist. An unlicensed peptide of unknown purity is not something to use while pregnant, trying to conceive or breastfeeding.",
  },
  commonAdverseEffects: [
    "Not systematically studied in humans",
    "Injection-site pain, redness or bruising (user reports)",
    "Nausea (user reports)",
    "Dizziness or light-headedness (user reports)",
    "Fatigue or headache (user reports)",
  ],
  seriousAdverseEffects: [
    "Unknown — no controlled human safety data",
    "Theoretical stimulation of tumour blood supply (angiogenic activity in animals)",
    "Immune reactions to the peptide or to impurities (FDA-identified risk for injected use)",
    "Infection or abscess from non-sterile injectable products",
    "Unpredictable effects from mislabelled or contaminated vials",
  ],
  monitoring: [
    "Injection sites for infection or persistent reactions",
    "Any new or changing lump, mole or unexplained symptom, given the angiogenic mechanism",
    "Bleeding or bruising if combined with any blood thinner",
    "Whether the underlying injury has been properly diagnosed and imaged",
    "Anti-doping status if you compete in tested sport (prohibited at all times under S0)",
  ],
  sourceConsiderations: [
    "There is no pharmaceutical-grade, authorised BPC-157 product anywhere; every vial or capsule comes from an unregulated supply chain with no GMP assurance.",
    "Independent testing of 'research' peptides has repeatedly found under-dosing, wrong peptides, bacterial endotoxin and heavy-metal contamination; a certificate of analysis supplied by the seller is not independent verification.",
    "The FDA's 2023 safety listing cited immunogenicity risk, peptide-related impurities and poorly characterised active ingredient — problems that apply directly to grey-market products.",
    "Oral capsules are marketed on the basis that BPC-157 is 'stable in gastric juice'; whether meaningful amounts are absorbed in humans has never been shown.",
  ],
  clinicianQuestions: [
    "Has my injury been properly diagnosed, and what does the evidence-based rehabilitation pathway look like?",
    "Given that there are no published human trials, what would you need to see before considering this reasonable?",
    "Does my medical history — especially any cancer, clotting or autoimmune condition — make an angiogenic peptide a particular concern?",
    "If I have already used BPC-157, are there any checks you would recommend?",
    "Are there authorised treatments or supplements with actual human evidence for my goal?",
  ],
  alternatives: ["collagen-peptides"],
  stackNotes: [
    {
      with: "tb-500",
      evidence: "none",
      overlap: "Both are marketed as tissue-repair peptides acting through angiogenesis and cell migration.",
      note: "The most commonly co-marketed 'healing stack'. There are no human data for either peptide alone, let alone together; combining two angiogenic agents of unknown purity compounds the uncertainty rather than the benefit.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      note: "No human studies of BPC-157 combined with growth-hormone secretagogues; both are WADA-prohibited.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      note: "No human studies of BPC-157 combined with growth-hormone secretagogues; both are WADA-prohibited.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      note: "Sometimes promoted to 'protect the gut' during GLP-1 treatment. No human data; gastrointestinal symptoms on semaglutide should be managed with the prescriber.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      note: "No human data on this combination; gastrointestinal effects of tirzepatide should be managed with the prescriber rather than with an unlicensed peptide.",
    },
    {
      with: "ghk-cu",
      evidence: "none",
      note: "No human data. Both are promoted for repair and both show angiogenic activity in laboratory models.",
    },
    {
      with: "kpv",
      evidence: "none",
      overlap: "Both carry anti-inflammatory and repair claims derived from animal models.",
      note: "Blended together in the Klow pen. No human data on the combination; neither has published human efficacy trials.",
    },
    {
      with: "nad",
      evidence: "none",
      note: "Marketed together in 'recovery' stacks. No human data on the combination, and neither has controlled human efficacy data for recovery.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Synthetic 15-amino-acid peptide (gastric-juice derived)" },
    { label: "Human trials", value: "None published; phase 1 and phase 2 results never released" },
    { label: "Regulatory status", value: "Not authorised anywhere; US compounding review ongoing" },
    { label: "Anti-doping", value: "Prohibited at all times (WADA S0)" },
    { label: "Typical sale form", value: "Unregulated injectable vials and oral capsules" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    {
      label: "FDA — Certain bulk drug substances for use in compounding that may present significant safety risks (BPC-157 entry)",
      url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    },
    {
      label: "FDA — Bulk drug substances nominated for use in compounding under section 503A (categories, updated May 2026)",
      url: "https://www.fda.gov/media/94155/download",
    },
    {
      label: "Regeneration or Risk? A narrative review of BPC-157 for musculoskeletal healing (2025)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12446177/",
    },
    {
      label: "ClinicalTrials.gov NCT02637284 — PCO-02 (oral BPC-157) phase 1 safety and pharmacokinetics (no results posted)",
      url: "https://clinicaltrials.gov/study/NCT02637284",
    },
    {
      label: "USADA — BPC-157: experimental peptide creates risk for athletes",
      url: "https://www.usada.org/spirit-of-sport/bpc-157-peptide-prohibited/",
    },
    {
      label: "WADA Prohibited List 2025 (S0 non-approved substances)",
      url: "https://www.wada-ama.org/sites/default/files/2024-09/2025list_en_final_clean_12_september_2024.pdf",
    },
  ],
};
