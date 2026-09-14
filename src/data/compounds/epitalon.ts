import type { Compound } from "../types";

/**
 * Epitalon (Epithalon) — synthetic tetrapeptide modelled on the bovine pineal
 * extract 'epithalamin'. Telomerase and lifespan claims rest on in-vitro and
 * animal work from a single research group; human data concern the extract,
 * not the tetrapeptide, and are not blinded. No authorisation anywhere.
 */
export const epitalon: Compound = {
  slug: "epitalon",
  name: "Epitalon",
  aliases: ["Epithalon", "Epithalone", "Epithalamin (extract)", "Ala-Glu-Asp-Gly", "AEDG peptide"],
  family: "longevity_metabolic",
  classLabel: "Synthetic pineal-derived tetrapeptide",
  tagline: "'Telomerase-activating' longevity peptide with no controlled human trials",
  summary:
    "Epitalon is a synthetic four-amino-acid peptide (Ala-Glu-Asp-Gly) developed in St Petersburg as the presumed active component of epithalamin, a bovine pineal gland extract. Claims that it activates telomerase, restores melatonin rhythm and extends lifespan come almost entirely from in-vitro and animal studies by the originating group. The only long-term human data concern the epithalamin extract in small, non-blinded Russian studies of older adults; epitalon itself has no rigorous human trials and no marketing authorisation anywhere.",
  mechanism:
    "Proposed to induce telomerase expression and telomere elongation in cultured human cells, to normalise pineal melatonin secretion, and to act as an antioxidant. These mechanisms have been reported mainly by one research group and the relevance of cell-culture telomerase induction to human ageing is unproven.",
  goals: [
    {
      goal: "longevity",
      evidence: "insufficient",
      summary:
        "Lifespan extension is reported in mice, rats and fruit flies. Human mortality data (a 28% lower 12-year mortality in 79 elderly cardiac patients) come from small, non-blinded studies of the epithalamin extract, not the synthetic tetrapeptide, and have never been independently replicated.",
    },
    {
      goal: "sleep",
      evidence: "insufficient",
      summary:
        "Claims rest on normalisation of night-time melatonin in a small Russian study of the extract and on animal circadian data; no controlled human study has measured sleep with epitalon.",
    },
    {
      goal: "general_wellbeing",
      evidence: "insufficient",
      summary: "No controlled human evidence for energy, mood or any wellbeing outcome.",
    },
  ],
  overallEvidence: "insufficient",
  humanEvidenceLevel: "preclinical_only",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; unapproved drug whose compounding status is under FDA review.",
      detail:
        "Epitalon has never been approved by the FDA. It was placed in 503A 'Category 2' (significant safety risk) in September 2023 — the FDA cited immunogenicity, aggregation and impurity risks and no safety data for the proposed route — then removed from Category 2 in April 2026 after its nomination was withdrawn. In July 2026 the FDA's Pharmacy Compounding Advisory Committee voted, against the advice of FDA reviewers, to recommend adding epitalon to the 503A bulks list; the recommendation is non-binding and rulemaking had not been completed at the time of this review.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EU or national marketing authorisation; sold only as a 'research chemical'.",
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
      summary: "No marketing authorisation as a medicine known in any country.",
      detail:
        "Epithalamin (the extract) was registered in the former Soviet Union and Russia, and epitalon-containing products are sold in Russia as 'peptide bioregulator' supplements. These are not evidence-based medicines authorisations. Check your national regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous", "intramuscular", "intranasal", "oral"],
  dosingResearch: [],
  dosingResearchNote:
    "No controlled human dosing study of epitalon exists. Telomerase and lifespan data are from cell culture and animals; the human mortality studies used the epithalamin extract (typically 10 mg intramuscularly on alternate days in short courses repeated over years) in small, non-blinded Russian cohorts. Vendor 'protocols' such as '10 mg daily for 10 days' or '5–10 mg subcutaneously, twice a year' are marketing conventions, not evidence.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "caution",
      note: "Telomerase activation is a hallmark of most cancers. Animal studies reported fewer tumours, but the effect of a claimed telomerase activator on an existing or previous malignancy in humans is unknown.",
    },
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Claimed effects on pineal and pituitary hormone rhythms are unstudied in people with endocrine disorders.",
    },
  ],
  interactions: [
    {
      classId: "chemotherapy",
      severity: "moderate",
      note: "Interactions are unstudied. A compound marketed as a telomerase activator is a theoretical concern alongside cancer treatment and should be disclosed to the oncology team.",
    },
    {
      classId: "hrt",
      severity: "minor",
      note: "Interactions are unstudied; listed because of claimed effects on neuroendocrine hormone rhythms.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or animal reproductive safety data; use in pregnancy or breastfeeding cannot be assessed.",
  },
  commonAdverseEffects: [
    "Injection-site reactions",
    "Headache",
    "Drowsiness or changes in sleep timing (anecdotal)",
  ],
  seriousAdverseEffects: [
    "Immune reactions to peptide aggregates or impurities in unregulated products (flagged by the FDA)",
    "Theoretical concern about telomerase activation in undiagnosed malignancy",
    "Injection-related infection with non-sterile products",
    "Unknown long-term effects — no controlled human safety data",
  ],
  monitoring: [
    "A clear, measurable objective — 'longevity' cannot be monitored; sleep or energy outcomes can",
    "Age-appropriate cancer screening, given the telomerase claims",
    "Sleep timing and quality if used for sleep",
    "Injection sites for reactions or infection",
  ],
  sourceConsiderations: [
    "Every product available is an unregulated 'research chemical'; the FDA has flagged aggregation, impurity and immunogenicity risks for epitalon.",
    "Oral 'peptide bioregulator' capsules sold under similar names are supplements with no evidence of absorption or effect.",
    "Independent certificates of analysis rarely confirm identity, purity and sterility of vials sold for injection.",
  ],
  clinicianQuestions: [
    "Is there any human evidence that epitalon itself, rather than the pineal extract it is modelled on, does anything?",
    "What is the concern about telomerase activation for someone with my cancer history or risk factors?",
    "Which interventions with actual human longevity evidence — blood pressure, lipids, activity, sleep — should come first?",
    "How would we know whether it is working, and what would make us stop?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "mots-c",
      evidence: "none",
      overlap: "Both are marketed as 'longevity' peptides.",
      note: "Commonly sold together in longevity stacks; no human data on either compound alone or in combination.",
    },
    {
      with: "thymosin-alpha-1",
      evidence: "none",
      note: "The extract-era Russian studies combined epithalamin with the thymic extract thymalin, not thymosin alpha-1; no data on this combination.",
    },
    {
      with: "dsip",
      evidence: "none",
      overlap: "Both are marketed for sleep via claimed effects on melatonin or circadian rhythm.",
      note: "No combination data; neither compound has controlled modern human evidence for sleep.",
    },
    {
      with: "elamipretide",
      evidence: "none",
      overlap: "Both are marketed as 'cellular ageing' peptides.",
      note: "No human data on the combination; elamipretide's approved use is a rare mitochondrial disease, not ageing.",
    },
    {
      with: "ghk-cu",
      evidence: "none",
      overlap: "Both appear in 'anti-ageing' stacks.",
      note: "No combination data.",
    },
    {
      with: "selank",
      evidence: "none",
      note: "Marketed together as 'bioregulator' stacks; no combination data and neither compound has robust human evidence.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Synthetic pineal-derived tetrapeptide (Ala-Glu-Asp-Gly)" },
    { label: "Route", value: "Injected or nasal 'research' products; oral supplements unproven" },
    { label: "Human trials", value: "None of epitalon; small non-blinded studies of the extract" },
    { label: "Authorised", value: "Nowhere" },
    { label: "WADA", value: "Not on the Prohibited List" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Khavinson VK, Bondarev IE, Butyugov AA. Epithalon peptide induces telomerase activity and telomere elongation in human somatic cells. Bull Exp Biol Med 2003;135:590–592" },
    { label: "Korkushko OV et al. Geroprotective effect of epithalamine in elderly subjects with accelerated aging. Bull Exp Biol Med 2006;142:356–359" },
    { label: "Korkushko OV et al. Peptide geroprotector from the pituitary gland inhibits rapid aging of elderly people: 15-year follow-up. Bull Exp Biol Med 2011", url: "https://doi.org/10.1007/s10517-011-1332-x" },
    { label: "Khavinson VK, Morozov VG. Geroprotective effect of thymalin and epithalamin. Adv Gerontol 2002", url: "https://pubmed.ncbi.nlm.nih.gov/12577695/" },
    { label: "FDA — Bulk drug substances that may present significant safety risks (503A Category 2)", url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks" },
  ],
};
