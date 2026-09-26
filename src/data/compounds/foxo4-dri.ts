import type { Compound } from "../types";

/**
 * FOXO4-DRI — a designed "senolytic" peptide from the de Keizer laboratory
 * (Baar et al., Cell 2017). A D-retro-inverso version of a FOXO4 fragment that
 * blocks the FOXO4–p53 interaction and pushes senescent cells into apoptosis.
 * Animal data only: no human trial has been published or, as far as we could
 * establish, registered. Regulatory facts checked against the FDA 503A
 * nominations list (May 2026), the FDA 503B category list (March 2025),
 * ClinicalTrials.gov and the WADA 2026 Prohibited List.
 */
export const foxo4Dri: Compound = {
  slug: "foxo4-dri",
  name: "FOXO4-DRI",
  aliases: ["FOXO4-D-Retro-Inverso", "Proxofim"],
  family: "longevity_metabolic",
  classLabel: "FOXO4–p53 interfering peptide (D-retro-inverso)",
  tagline: "Designed senolytic peptide that rejuvenated aged mice; no human data of any kind",
  summary:
    "FOXO4-DRI is a synthetic peptide designed in 2017 to kill senescent cells — damaged cells that have stopped dividing but linger and secrete inflammatory signals, and which accumulate with age. It copies a stretch of the FOXO4 protein but is built from D-amino acids in reverse order (a 'D-retro-inverso' design) so that it survives in the body, and it works by prising apart FOXO4 and p53, which frees p53 to trigger apoptosis in senescent cells while sparing healthy ones. In the original Cell paper it restored fitness, fur density and kidney function in both prematurely ageing and naturally aged mice and protected against doxorubicin toxicity, which made it one of the most talked-about senolytics. Nine years on it remains a laboratory tool: no human trial has been published, none is registered on ClinicalTrials.gov, and it is not an authorised medicine or a permitted compounding ingredient anywhere.",
  mechanism:
    "In senescent cells the transcription factor FOXO4 binds p53 in the nucleus and holds it there, which keeps the cell alive despite its damage. FOXO4-DRI is a cell-penetrating peptide that competes for this interaction; 2025 structural work shows it targets the disordered transactivation domain of p53. Displaced p53 leaves the nucleus and triggers mitochondrial apoptosis, selectively in cells that depend on the FOXO4–p53 brake. Because the peptide is built from D-amino acids in reverse sequence, it resists breakdown by proteases and persists longer than a natural peptide would. All of this has been shown in cell culture and mice only.",
  goals: [
    {
      goal: "longevity",
      evidence: "insufficient",
      summary:
        "Marketed as an anti-ageing 'senolytic'. In mice, three intraperitoneal doses cleared senescent cells and improved fitness (activity and responsiveness), fur density and renal function in fast-ageing and naturally aged animals; later mouse work reports restored testosterone output from aged Leydig cells, improved spermatogenesis and effects on vascular and lung fibrosis models. There is no human study of any size, so nothing is known about whether senescent-cell clearance in people improves any measure of ageing, or at what cost.",
    },
    {
      goal: "general_wellbeing",
      evidence: "insufficient",
      summary:
        "Claims about energy, recovery and 'feeling younger' extrapolate from mouse behaviour and biomarkers. No human has been dosed in a published study, so there is no evidence for any subjective or functional outcome.",
    },
  ],
  overallEvidence: "insufficient",
  humanEvidenceLevel: "preclinical_only",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "No marketing authorisation; sold online as a 'research chemical'.",
      detail:
        "No MHRA-licensed medicine contains FOXO4-DRI and it cannot legally be sold or advertised for human use. Products labelled 'for research use only' fall outside medicines quality controls, so identity, purity and sterility are unverified.",
      lastReviewed: "2026-09-26",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved and not on any FDA compounding list; there is no lawful route to a human FOXO4-DRI product.",
      detail:
        "FOXO4-DRI has never been the subject of an approved application or, as far as we can establish, an investigational new drug application with published results. It does not appear in any category of the FDA's 503A bulk-substance nominations list (updated May 2026) or the 503B list (updated March 2025), has no USP monograph and is not a component of any approved drug, so neither 503A pharmacies nor 503B outsourcing facilities may compound it. Vials and pens sold online are unapproved new drugs.",
      lastReviewed: "2026-09-26",
    },
    EU: {
      status: "not_authorised",
      summary: "No EMA or national marketing authorisation in any member state.",
      detail:
        "No application has been made to the EMA and no national licence exists. The peptide was designed at University Medical Center Utrecht and its inventors' spin-out, Cleara Biotech, is Dutch, but any clinical development would still be at the pre-approval stage. FOXO4-DRI sold to EU consumers as a 'research peptide' is an unauthorised medicinal product.",
      lastReviewed: "2026-09-26",
    },
    AU: {
      status: "not_authorised",
      summary: "Not on the ARTG; TGA treats injectable peptides as prescription medicines.",
      detail:
        "No product containing FOXO4-DRI is registered on the Australian Register of Therapeutic Goods. The TGA has taken compliance action against online advertising and supply of unapproved peptides.",
      lastReviewed: "2026-09-26",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised by Health Canada.",
      detail: "No Drug Identification Number has been issued for FOXO4-DRI; unauthorised peptides sold online are unapproved drugs under the Food and Drugs Act.",
      lastReviewed: "2026-09-26",
    },
    OTHER: {
      status: "unclear",
      summary: "No known approval by any national medicines regulator; check locally.",
      detail: "We are not aware of any country that has authorised FOXO4-DRI for human use, or of any registered human trial. Verify with your national regulator.",
      lastReviewed: "2026-09-26",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous"],
  dosingResearch: [],
  dosingResearchNote:
    "There is no human study of FOXO4-DRI — no pharmacokinetics, no dose-finding, no safety data and no efficacy data by any route. The mouse regimen in the 2017 Cell paper, and in most work since, was 5 mg/kg injected intraperitoneally on alternate days for three doses (about a week), sometimes repeated; one 2025 study dosed 5 mg/kg every two days for a month. Mouse intraperitoneal doses do not translate to a human subcutaneous dose, and the vendor protocols in circulation (commonly 5–10 mg per injection, two or three times a week for one to two weeks) are not derived from any human data.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "caution",
      note: "FOXO4-DRI acts through p53, the pathway most often disrupted in cancer, and is designed to kill cells that have entered senescence — a state that chemotherapy and radiotherapy deliberately induce in tumour cells. Whether releasing p53 or removing senescent tumour cells helps or harms a person with cancer is unknown; nobody with a current or previous cancer should use it outside a trial.",
    },
    {
      conditionId: "autoimmune",
      severity: "caution",
      note: "Senescent cells have physiological roles in wound healing and tissue repair, and killing them releases cell contents that can provoke inflammation. Effects in autoimmune disease, or alongside immune-modifying treatment, have not been studied in any species beyond mice.",
    },
  ],
  interactions: [
    {
      classId: "chemotherapy",
      severity: "moderate",
      note: "Theoretical and unstudied in humans. FOXO4-DRI protected mice from doxorubicin toxicity, but it also targets the p53 pathway that many cancer treatments rely on and clears the senescent cells that treatment induces; the net effect on treatment efficacy is unknown. Anyone receiving cancer treatment should disclose any senolytic use to their oncologist.",
    },
    {
      classId: "immunosuppressant",
      severity: "moderate",
      note: "Theoretical. Senescent-cell clearance changes tissue inflammation and repair; combined with immunosuppressants or biologics the effect on infection risk and wound healing is entirely untested.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or reproductive-toxicity data exist. Senescence and p53 signalling are part of normal placental and fetal development, so a peptide that kills senescent cells is not something to use while pregnant, trying to conceive or breastfeeding.",
  },
  commonAdverseEffects: [
    "Not studied in humans",
    "Injection-site pain, redness or swelling (user reports)",
    "Fatigue, flu-like symptoms or headache in the days after injection (user reports; attributed by users to cell clearance, but unverified)",
  ],
  seriousAdverseEffects: [
    "Unknown — no human safety data by any route",
    "Off-target apoptosis in healthy tissue (the selectivity for senescent cells has been shown only in mouse tissues and cell lines)",
    "Impaired wound healing or tissue repair from removing senescent cells that have a physiological role (theoretical)",
    "Immune reactions to a D-amino-acid peptide, its aggregates or impurities",
    "Interference with cancer surveillance or treatment through the p53 pathway (theoretical)",
    "Infection from non-sterile injectable products",
  ],
  monitoring: [
    "Whether there is any measurable problem to treat — 'senescent-cell burden' cannot be measured in routine clinical practice, so there is no baseline and no way to show an effect",
    "Injection sites for infection or persistent reactions",
    "Any new lump, unexplained weight loss or other symptom that would prompt cancer assessment, given the p53 mechanism",
    "Slow-healing wounds or new joint, skin or lung symptoms after use",
    "Anti-doping status for tested athletes: not named on the Prohibited List, but as a non-approved substance it falls under S0 and is prohibited at all times",
  ],
  sourceConsiderations: [
    "No authorised or pharmaceutical-grade FOXO4-DRI exists anywhere; every vial or pen comes from an unregulated supplier or a compounder acting outside the rules.",
    "It is a 46-residue D-amino-acid peptide with a cell-penetrating tag — expensive and difficult to synthesise, so purity claims deserve independent verification, and a low price is a warning sign.",
    "Because the full D-amino-acid sequence is costly to make, a shorter or partly L-amino-acid peptide could be sold under the same name; identity by mass spectrometry, not just HPLC purity, is the relevant check.",
    "There are no published stability data for the peptide in aqueous solution; a pre-filled multi-dose pen relies entirely on the manufacturer's own testing.",
  ],
  clinicianQuestions: [
    "Is there any human evidence at all for this peptide, and what would you need to see before regarding it as reasonable to try?",
    "Given that it works through p53, is there anything in my history — cancer, family cancer risk, autoimmune disease — that makes it a particular concern?",
    "What can we actually measure, before and after, that would show it had done anything?",
    "If I have already used it, are there any checks you would recommend?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "epitalon",
      evidence: "none",
      overlap: "Both are marketed for ageing — FOXO4-DRI as a senolytic, epitalon for telomeres and circadian rhythm.",
      note: "Sold together in 'longevity' stacks. No human data on either compound alone, let alone in combination.",
    },
    {
      with: "mots-c",
      evidence: "none",
      overlap: "Both appear in 'cellular ageing' stacks; MOTS-c targets mitochondrial metabolism rather than senescence.",
      note: "No human data on the combination; neither has human efficacy data of its own.",
    },
    {
      with: "nad",
      evidence: "none",
      overlap: "Both are promoted for healthy ageing; NAD+ supports the DNA-repair and metabolic enzymes of cells that FOXO4-DRI is designed to remove.",
      note: "No human data on the combination. The human evidence for NAD+ is for oral precursors, and FOXO4-DRI has none.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Designed FOXO4–p53 interfering peptide, D-retro-inverso" },
    { label: "Origin", value: "Baar et al., Cell 2017 (de Keizer laboratory, Utrecht)" },
    { label: "Human trials", value: "None published; none registered on ClinicalTrials.gov" },
    { label: "Regulatory status", value: "Not authorised anywhere; not on any FDA compounding list" },
    { label: "Anti-doping", value: "Not listed by name; S0 (non-approved substances) applies" },
  ],
  lastReviewed: "2026-09-26",
  references: [
    {
      label: "Baar MP et al. Targeted apoptosis of senescent cells restores tissue homeostasis in response to chemotoxicity and aging. Cell 2017;169:132–147.e16",
      url: "https://doi.org/10.1016/j.cell.2017.02.031",
    },
    {
      label: "Bourgeois B et al. The disordered p53 transactivation domain is the target of FOXO4 and the senolytic compound FOXO4-DRI. Nat Commun 2025;16:5672",
      url: "https://doi.org/10.1038/s41467-025-60844-9",
    },
    {
      label: "Zhang C et al. FOXO4-DRI alleviates age-related testosterone secretion insufficiency by targeting senescent Leydig cells in aged mice. Aging (Albany NY) 2020;12:1272–1284",
      url: "https://doi.org/10.18632/aging.102682",
    },
    {
      label: "Chaib S, Tchkonia T, Kirkland JL. Cellular senescence and senolytics: the path to the clinic. Nat Med 2022;28:1556–1568",
      url: "https://doi.org/10.1038/s41591-022-01923-y",
    },
    {
      label: "FDA — Bulk drug substances nominated for use in compounding under section 503A (FOXO4-DRI not listed in any category; updated May 2026)",
      url: "https://www.fda.gov/media/94155/download",
    },
    {
      label: "World Anti-Doping Agency — 2026 Prohibited List, S0 non-approved substances",
      url: "https://www.wada-ama.org/sites/default/files/2025-09/2026list_en_final_clean_september_2025.pdf",
    },
  ],
};
