import type { Compound } from "../types";

/**
 * KPV — the C-terminal tripeptide (Lys-Pro-Val) of α-melanocyte-stimulating
 * hormone. Anti-inflammatory activity in mouse colitis and skin models; no
 * published human study by any route. Regulatory facts checked against the
 * FDA briefing document for the July 2026 Pharmacy Compounding Advisory
 * Committee meeting and the FDA 503A category lists (September 2023 and
 * April 2026 updates).
 */
export const kpv: Compound = {
  slug: "kpv",
  name: "KPV",
  aliases: ["Lys-Pro-Val", "α-MSH (11–13)", "alpha-MSH fragment"],
  family: "immune",
  classLabel: "Anti-inflammatory tripeptide (α-MSH fragment)",
  tagline: "α-MSH tripeptide with anti-inflammatory animal data and no human trials",
  summary:
    "KPV (lysine-proline-valine) is the C-terminal tripeptide of α-melanocyte-stimulating hormone (α-MSH), a hormone that dampens inflammation as well as driving skin pigmentation. In laboratory and mouse models the fragment keeps the anti-inflammatory activity without the pigmenting effect, and reduces intestinal and skin inflammation. No human trial of KPV has been published for any use, it is not an authorised medicine anywhere, and the FDA's 2026 review found no human exposure data for any route of administration.",
  mechanism:
    "In cell and animal studies KPV is taken into cells by the peptide transporter PepT1 and reduces NF-κB activation and the release of inflammatory cytokines such as TNF-α, IL-6 and IL-8; unlike full-length α-MSH it does not activate melanocortin-1 receptors on melanocytes, so it has no pigmenting effect. The molecular target behind its anti-inflammatory action has not been identified, and none of this has been confirmed in humans.",
  goals: [
    {
      goal: "skin_cosmetic",
      evidence: "insufficient",
      summary:
        "α-MSH-derived peptides reduce inflammation in mouse models of contact dermatitis and improve wound closure in rodents; an in-vitro study found that KPV does not penetrate intact human skin without microneedling or iontophoresis. There are no human studies of KPV for skin ageing, acne, eczema or wound healing.",
    },
    {
      goal: "injury_recovery",
      evidence: "insufficient",
      summary:
        "Repair claims rest on the anti-inflammatory and wound-healing effects of α-MSH peptides in rodents. No study — animal or human — has examined KPV in tendon, ligament, muscle or joint injury.",
    },
    {
      goal: "general_wellbeing",
      evidence: "insufficient",
      summary:
        "Marketed for gut health, 'systemic inflammation' and mast-cell symptoms. Oral KPV reduced experimental colitis in mice in two 2008 studies, but no human trial in inflammatory bowel disease or any other condition has been published.",
    },
  ],
  overallEvidence: "insufficient",
  humanEvidenceLevel: "preclinical_only",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "No marketing authorisation; sold online as a 'research chemical'.",
      detail:
        "No MHRA-licensed medicine contains KPV and it cannot legally be sold or advertised for human use. Products labelled 'for research use only' fall outside medicines quality controls, so identity, purity and sterility are unverified.",
      lastReviewed: "2026-09-16",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; compounding eligibility under review after a 2023 safety listing and a narrow 2026 advisory vote.",
      detail:
        "KPV is not an approved drug and is not on the 503A bulks list. In September 2023 the FDA placed it in 503A Category 2 (significant safety risks) because it had identified no human exposure data. It was removed from Category 2 in April 2026 when the nomination was withdrawn; the FDA then evaluated KPV (free base) and KPV acetate on its own initiative for topical use in wound healing and inflammatory conditions and proposed not adding them, citing poor characterisation and the absence of any human data. On 23 July 2026 the Pharmacy Compounding Advisory Committee nevertheless voted 8–6 (one abstention) to recommend adding KPV to the 503A bulks list. The vote is advisory only: rulemaking is pending and KPV remains unapproved.",
      lastReviewed: "2026-09-16",
    },
    EU: {
      status: "not_authorised",
      summary: "No EMA or national marketing authorisation in any member state.",
      detail: "No application has been made to the EMA. Injectable, oral or topical KPV sold to EU consumers as a 'research peptide' is an unauthorised medicinal product.",
      lastReviewed: "2026-09-16",
    },
    AU: {
      status: "not_authorised",
      summary: "Not on the ARTG; TGA treats injectable peptides as prescription medicines.",
      detail:
        "No product containing KPV is registered on the Australian Register of Therapeutic Goods. The TGA has taken compliance action against online advertising and supply of unapproved peptides.",
      lastReviewed: "2026-09-16",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised by Health Canada.",
      detail: "No Drug Identification Number has been issued for KPV; unauthorised peptides sold online are unapproved drugs under the Food and Drugs Act.",
      lastReviewed: "2026-09-16",
    },
    OTHER: {
      status: "unclear",
      summary: "No known approval by any national medicines regulator; check locally.",
      detail: "We are not aware of any country that has authorised KPV for human use. Verify with your national regulator.",
      lastReviewed: "2026-09-16",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous", "oral", "topical", "intranasal"],
  dosingResearch: [],
  dosingResearchNote:
    "No human study of KPV has been published by any route — no pharmacokinetics, dose-finding, safety or efficacy data — and the FDA's July 2026 briefing document found none either. The mouse colitis studies gave KPV in drinking water or in oral nanoparticles at exposures that cannot be translated to a human dose. Vendor regimens (commonly 200–500 mcg injected daily, or oral capsules) have no evidential basis.",
  contraindications: [
    {
      conditionId: "autoimmune",
      severity: "caution",
      note: "KPV is an immunomodulator in laboratory models, and injected peptides carry an immunogenicity risk that has not been assessed for KPV. Effects in autoimmune disease or alongside immune-modifying treatment are unknown.",
    },
    {
      conditionId: "active_infection",
      severity: "caution",
      note: "A peptide that suppresses inflammatory signalling could in theory blunt the response to infection. There are no human data either way.",
    },
  ],
  interactions: [
    {
      classId: "immunosuppressant",
      severity: "moderate",
      note: "Theoretical additive immune suppression from combining an anti-inflammatory peptide with immunosuppressant or biologic therapy; entirely unstudied in humans.",
    },
    {
      classId: "corticosteroid",
      severity: "moderate",
      note: "Both dampen inflammatory signalling; combined effects, and any masking of infection, are unstudied.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or reproductive-toxicity data exist. An unlicensed peptide of unknown purity is not something to use while pregnant, trying to conceive or breastfeeding.",
  },
  commonAdverseEffects: [
    "Not studied in humans",
    "Injection-site pain, redness or itching (user reports)",
    "Nausea or headache (user reports)",
  ],
  seriousAdverseEffects: [
    "Unknown — no human safety data by any route",
    "Immune reactions to the peptide, aggregates or impurities (the FDA's stated concern for this class of compounded peptide)",
    "Masked or worsened infection from immune suppression (theoretical)",
    "Infection from non-sterile injectable products",
  ],
  monitoring: [
    "Injection sites for infection or persistent reactions",
    "Any new or worsening infection, given the anti-inflammatory mechanism",
    "Whether a diagnosed inflammatory condition is being self-treated in place of assessed care",
    "An objective measure of the skin or repair goal against a realistic baseline",
    "Anti-doping status if you compete in tested sport (not named on the Prohibited List, but non-approved substances fall under S0)",
  ],
  sourceConsiderations: [
    "No authorised, pharmaceutical-grade KPV exists anywhere; every vial, capsule or cream comes from a compounding pharmacy or an unregulated supplier.",
    "The FDA's 2026 review judged KPV 'not well-characterised': naming is inconsistent (free base versus acetate salt), and no public data exist on impurities, aggregates or microbiological quality.",
    "In blends such as the Klow pen, KPV is one of four components; the lot certificate should confirm identity and quantity of each component separately.",
    "Because KPV barely penetrates intact skin, topical products would need a penetration strategy to reach deeper skin layers — a formulation question that vendors rarely address.",
  ],
  clinicianQuestions: [
    "Has the inflammatory or skin problem I want to address been diagnosed, and what are the authorised treatments with actual human evidence?",
    "Given that there are no human studies of KPV at all, what would you need to see before considering it reasonable?",
    "Does my history — autoimmune disease, current infection, immune-modifying medicines — make an immunomodulating peptide a particular concern?",
    "If I have already used KPV, are there any checks you would recommend?",
  ],
  alternatives: ["collagen-peptides"],
  stackNotes: [
    {
      with: "ghk-cu",
      evidence: "none",
      overlap: "Both are marketed for skin repair — GHK-Cu for collagen and remodelling, KPV for inflammation.",
      note: "Commonly blended, as in the Klow pen. There is no human study of either injected compound alone, let alone together.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      overlap: "Both carry anti-inflammatory and repair claims derived from animal models.",
      note: "No human data on the combination; neither has published human efficacy trials.",
    },
    {
      with: "tb-500",
      evidence: "none",
      note: "No human data on the combination; TB-500 has no human data at all.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Tripeptide fragment (residues 11–13) of α-MSH" },
    { label: "Human trials", value: "None published, by any route" },
    { label: "Regulatory status", value: "Not authorised anywhere; US advisory vote (8–6) pending FDA rulemaking" },
    { label: "Anti-doping", value: "Not listed by name; S0 applies to non-approved substances for tested athletes" },
    { label: "Typical sale form", value: "Unregulated vials, capsules and blends" },
  ],
  lastReviewed: "2026-09-16",
  references: [
    {
      label: "Kannengiesser K et al. Melanocortin-derived tripeptide KPV has anti-inflammatory potential in murine models of inflammatory bowel disease. Inflamm Bowel Dis 2008;14:324–331",
      url: "https://doi.org/10.1002/ibd.20334",
    },
    {
      label: "Dalmasso G et al. PepT1-mediated tripeptide KPV uptake reduces intestinal inflammation. Gastroenterology 2008;134:166–178",
      url: "https://doi.org/10.1053/j.gastro.2007.10.026",
    },
    {
      label: "Brzoska T et al. Alpha-melanocyte-stimulating hormone and related tripeptides: biochemistry, antiinflammatory and protective effects in vitro and in vivo, and future perspectives for the treatment of immune-mediated inflammatory diseases. Endocr Rev 2008;29:581–602",
      url: "https://doi.org/10.1210/er.2007-0027",
    },
    {
      label: "FDA — Briefing document for KPV-related bulk drug substances (KPV free base and KPV acetate), Pharmacy Compounding Advisory Committee, 23–24 July 2026",
      url: "https://www.fda.gov/media/193346/download",
    },
    {
      label: "FDA — July 23–24, 2026 meeting of the Pharmacy Compounding Advisory Committee (agenda, briefing materials and votes)",
      url: "https://www.fda.gov/advisory-committees/advisory-committee-calendar/july-23-24-2026-meeting-pharmacy-compounding-advisory-committee-07232026",
    },
    {
      label: "FDA — Certain bulk drug substances for use in compounding that may present significant safety risks (September 2023 listing; KPV removed April 2026)",
      url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    },
  ],
};
