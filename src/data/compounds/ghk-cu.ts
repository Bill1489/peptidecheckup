import type { Compound } from "../types";

/**
 * GHK-Cu — a naturally occurring copper-binding tripeptide with decades of
 * topical cosmetic use and small industry-run skin studies. Injectable use is
 * unregulated and has no human data. FDA 503A status checked against the
 * category list updated May 2026.
 */
export const ghkCu: Compound = {
  slug: "ghk-cu",
  name: "GHK-Cu",
  aliases: ["Copper peptide", "Copper tripeptide-1", "Glycyl-L-histidyl-L-lysine copper", "GHK-copper", "Cu-GHK", "GHK"],
  family: "cosmetic",
  classLabel: "Copper-binding tripeptide",
  tagline: "Topical copper peptide with modest cosmetic data; injectable use is untested",
  summary:
    "GHK-Cu is the copper complex of a three-amino-acid peptide found naturally in human plasma, saliva and urine, where its concentration falls with age. It has been a cosmetic ingredient since the 1990s, and small, mostly manufacturer-run studies report firmer, smoother facial skin after 12 weeks of topical use. Injectable GHK-Cu sold online has never been studied in people and is not an authorised medicine anywhere.",
  mechanism:
    "In cell culture and animal wounds GHK-Cu delivers copper to enzymes involved in collagen and elastin cross-linking, stimulates fibroblasts to make collagen, glycosaminoglycans and decorin, modulates matrix metalloproteinases, dampens inflammation and promotes new blood-vessel and nerve growth. Topically it penetrates the outer skin layers; systemic effects after injection are unstudied in humans.",
  goals: [
    {
      goal: "skin_cosmetic",
      evidence: "limited",
      summary:
        "Small 12-week facial-cream studies (n ≈ 70, presented as conference abstracts and book chapters rather than full peer-reviewed trials) reported improved skin firmness, density and fine lines; comparisons against vitamin C and tretinoin creams were pilot-sized. Effects are modest and the best data are industry-linked.",
    },
    {
      goal: "hair",
      evidence: "preliminary",
      summary:
        "Copper peptides enlarged hair follicles and prolonged the growth phase in mouse and laboratory studies; early manufacturer studies of copper-peptide hair products were small and not published in full. No robust human trial exists.",
    },
    {
      goal: "injury_recovery",
      evidence: "insufficient",
      summary:
        "Wound-healing benefits are documented in rats, rabbits, dogs and pigs and in small studies of chronic skin ulcers, but there are no human data on tendon, ligament, joint or muscle injury and none at all for injected GHK-Cu.",
    },
  ],
  overallEvidence: "limited",
  humanEvidenceLevel: "cosmetic_topical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; permitted as a topical cosmetic ingredient.",
      detail:
        "Copper tripeptide-1 is a legal cosmetic ingredient under the UK Cosmetics Regulation, provided products make only cosmetic claims. No MHRA-licensed medicine contains GHK-Cu; injectable vials sold as 'research chemicals' are unlicensed and cannot be marketed for human use.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved as a drug; legal in cosmetics; injectable compounding not permitted.",
      detail:
        "GHK-Cu (INCI: copper tripeptide-1) is widely used in cosmetics regulated by the FDA as such. For pharmacy compounding, non-injectable GHK-Cu sits in 503A Category 1 (nominated and under evaluation; re-listed in May 2026 after a nomination mix-up). Injectable GHK-Cu was placed in Category 2 in September 2023 for safety concerns and removed in April 2026 only because its nomination was withdrawn; the FDA intends to consult its Pharmacy Compounding Advisory Committee before the end of February 2027. No form of GHK-Cu is an approved drug.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; permitted as a topical cosmetic ingredient.",
      detail:
        "Copper tripeptide-1 is listed in the EU cosmetic ingredient database (CosIng) and may be used in cosmetics under Regulation (EC) 1223/2009. No medicinal product containing GHK-Cu is authorised by the EMA or any member state.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not a registered medicine; cosmetic use permitted; injectable products unapproved.",
      detail:
        "Topical cosmetic products are regulated as cosmetics. No GHK-Cu product is on the Australian Register of Therapeutic Goods, and injectable peptides are treated by the TGA as prescription medicines that cannot be lawfully supplied without approval.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised as a drug by Health Canada; cosmetic use permitted.",
      detail: "Cosmetic products containing copper tripeptide-1 are regulated under the Cosmetic Regulations. No Drug Identification Number exists for GHK-Cu; injectable products are unauthorised drugs.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Generally legal as a cosmetic ingredient; no known approval as a medicine.",
      detail: "Cosmetic rules vary by country. We are not aware of any national authorisation of GHK-Cu as a medicine.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["topical", "subcutaneous"],
  dosingResearch: [
    {
      title: "GHK-Cu facial cream in women with photoaged skin (conference presentation)",
      citation: "Leyden J, Stephens T, Finkey M, Appa Y, Barkovic S. Proc Am Acad Dermatol 60th Annual Meeting 2002, abstract P68",
      year: 2002,
      phase: "Cosmetic efficacy study",
      design: "Controlled 12-week facial study (full methods not published in a peer-reviewed journal)",
      population: "Women with mild to advanced facial photoageing",
      n: 71,
      duration: "12 weeks",
      doses: "GHK-Cu-containing facial cream applied to the face; peptide concentration not reported in the abstract",
      route: "topical",
      outcome:
        "Reported improvements in skin laxity, clarity and appearance, reduced fine lines and wrinkle depth, and increased skin density and thickness compared with control.",
      adverseEvents: "No significant irritation reported; the abstract gives no systematic adverse-event data.",
    },
    {
      title: "Topical copper-peptide cream compared with vitamin C cream and tretinoin on skin ultrastructure",
      citation: "Abdulghani AA et al., Disease Management and Clinical Outcomes 1998;1(4):136–141",
      year: 1998,
      phase: "Pilot",
      design: "Pilot clinical, histological and ultrastructural comparison",
      population: "Adult women; creams applied to thigh skin",
      duration: "12 weeks",
      doses: "Copper-peptide cream, vitamin C cream, melatonin cream or tretinoin applied daily; peptide concentration not reported",
      route: "topical",
      outcome:
        "Increased collagen production on biopsy in 70% of participants using the copper-peptide cream versus 50% with vitamin C and 40% with tretinoin — a small pilot without formal statistics.",
      adverseEvents: "Copper-peptide cream was well tolerated; tretinoin caused the expected irritation.",
      url: "https://doi.org/10.1016/s1088-3371(98)00011-4",
    },
  ],
  dosingResearchNote:
    "Human data exist only for topical creams, and even these are small, industry-linked studies that did not report the peptide concentration and were never published as full randomised trials. There are no human studies of injected GHK-Cu — no pharmacokinetics, no dose-finding, no safety data. Injection 'protocols' circulating online (often 1–2 mg per day) have no evidential basis.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "caution",
      note: "GHK-Cu promotes angiogenesis and broadly alters gene expression in laboratory models. Topical cosmetic use is not known to be a problem, but systemic (injected) use in anyone with a current or previous cancer is uncharted.",
    },
    {
      conditionId: "liver",
      severity: "caution",
      note: "Injected GHK-Cu delivers copper systemically. People with liver disease or a copper-handling disorder such as Wilson's disease should not add exogenous copper without specialist advice.",
    },
    {
      conditionId: "autoimmune",
      severity: "caution",
      note: "Injected peptides of uncertain purity carry an immunogenicity risk that has not been evaluated for GHK-Cu; relevant where there is autoimmune disease or immune-modifying treatment.",
    },
  ],
  interactions: [
    {
      classId: "chemotherapy",
      severity: "moderate",
      note: "Interactions are unstudied. A pro-angiogenic peptide given systemically could in theory oppose anti-angiogenic cancer therapy; disclose any use to the treating oncologist.",
    },
    {
      classId: "corticosteroid",
      severity: "minor",
      note: "Topical corticosteroids thin skin and slow wound healing; there are no data on combining them with copper-peptide products, but the effects would be expected to oppose each other.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "Topical cosmetic use has not been linked to reported harm but has not been formally studied. Injected GHK-Cu has no human data at all and is not appropriate while pregnant, trying to conceive or breastfeeding.",
  },
  commonAdverseEffects: [
    "Topical: mild stinging, redness or itching at application site",
    "Topical: occasional contact dermatitis",
    "Topical: blue-tinted product may discolour fabrics",
    "Injected: no systematic human data — injection-site reactions reported by users",
  ],
  seriousAdverseEffects: [
    "Injected: unknown — no human safety studies",
    "Injected: theoretical copper accumulation with repeated systemic dosing",
    "Injected: immune reactions to the peptide or impurities",
    "Injected: infection from non-sterile products",
    "Topical: serious reactions are rare; allergic contact dermatitis is possible",
  ],
  monitoring: [
    "Skin tolerance during the first weeks of topical use",
    "Realistic before-and-after comparison at 12 weeks, the duration used in the studies",
    "Any injection-site infection or systemic symptoms if injected products have been used",
    "Liver function and copper status if injected regularly (no human reference data exist)",
  ],
  sourceConsiderations: [
    "Topical products from established cosmetic brands are manufactured under cosmetic GMP and are the only form with any human data.",
    "Injectable 'GHK-Cu' vials come from unregulated research-chemical suppliers with no GMP assurance; identity, copper content, purity, sterility and endotoxin levels are unverified.",
    "In September 2023 the FDA cited significant safety risks for injectable GHK-Cu in compounding; the 2026 removal from that list was procedural and did not clear it.",
    "Copper peptides can be destabilised by strong acids (for example high-strength vitamin C serums) in the same formulation; product compatibility is a formulation, not a medical, question.",
  ],
  clinicianQuestions: [
    "Is a topical copper-peptide product a reasonable addition to an evidence-based skincare routine (sunscreen, retinoids) for my concern?",
    "Is there any reason — cancer history, liver or copper disorders, autoimmune disease — that a systemic copper peptide would be a concern for me?",
    "If hair loss is my goal, what authorised treatments have actual trial evidence?",
    "If I have already injected GHK-Cu, is any testing worthwhile?",
  ],
  alternatives: ["collagen-peptides"],
  stackNotes: [
    {
      with: "collagen-peptides",
      evidence: "none",
      overlap: "Both are marketed for skin firmness and collagen support.",
      note: "Different routes (topical peptide, oral supplement) and low individual risk, but no study has tested the combination; any benefit is assumed rather than shown.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      overlap: "Both are promoted for repair and both are angiogenic in laboratory models.",
      note: "No human data on the combination, and no human data on injected GHK-Cu alone.",
    },
    {
      with: "tb-500",
      evidence: "none",
      overlap: "Both are promoted for repair and both are angiogenic in laboratory models.",
      note: "No human data on the combination; TB-500 has no human data at all.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Naturally occurring copper-binding tripeptide" },
    { label: "Human evidence", value: "Small 12-week topical studies (n ≈ 70); none for injection" },
    { label: "Regulatory status", value: "Legal cosmetic ingredient; not a medicine anywhere" },
    { label: "Anti-doping", value: "Not named on the WADA Prohibited List" },
    { label: "Route in studies", value: "Topical cream; injected use is unregulated" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    {
      label: "Pickart L, Margolina A. Regenerative and protective actions of the GHK-Cu peptide in the light of the new gene data. Int J Mol Sci 2018;19:1987",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6073405/",
    },
    {
      label: "Pickart L, Vasquez-Soltero JM, Margolina A. GHK peptide as a natural modulator of multiple cellular pathways in skin regeneration. Biomed Res Int 2015;2015:648108",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4508379/",
    },
    {
      label: "Leyden J et al. Skin care benefits of copper peptide containing facial cream. Proc Am Acad Dermatol 60th Annual Meeting 2002 (abstract)",
    },
    {
      label: "Abdulghani AA et al. Effects of topical creams containing vitamin C, a copper-binding peptide cream and melatonin compared with tretinoin on the ultrastructure of normal skin. Dis Manag Clin Outcomes 1998;1:136–141",
      url: "https://doi.org/10.1016/s1088-3371(98)00011-4",
    },
    {
      label: "Maquart FX et al. Stimulation of collagen synthesis in fibroblast cultures by the tripeptide-copper complex GHK-Cu2+. FEBS Lett 1988;238:343–346",
    },
    {
      label: "FDA — Bulk drug substances nominated for use in compounding under section 503A (GHK-Cu category notes, updated May 2026)",
      url: "https://www.fda.gov/media/94155/download",
    },
  ],
};
