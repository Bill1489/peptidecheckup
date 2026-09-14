import type { Compound } from "../types";

/**
 * Collagen peptides — an oral food supplement with a genuine, if modest and
 * largely industry-funded, randomised-trial evidence base. Included so that
 * users comparing 'healing' or 'skin' peptides can see what a legal, low-risk
 * option with human data looks like.
 */
export const collagenPeptides: Compound = {
  slug: "collagen-peptides",
  name: "Collagen peptides",
  aliases: ["Hydrolysed collagen", "Collagen hydrolysate", "Hydrolyzed collagen", "Marine collagen", "Bovine collagen", "Verisol", "Peptan", "Gelatin"],
  family: "cosmetic",
  classLabel: "Oral hydrolysed collagen (food supplement)",
  tagline: "Oral food supplement with modest randomised-trial evidence for skin and joints",
  summary:
    "Collagen peptides are short chains produced by breaking down animal collagen (bovine, porcine, marine or chicken) so that they dissolve in water and are absorbed after ingestion. Taken at 2.5–15 g per day, they have been tested in dozens of randomised trials and several meta-analyses that report small improvements in skin hydration and elasticity over 8–12 weeks, and limited evidence for activity-related joint pain and body composition. They are regulated as a food, not a medicine, and have a good safety record.",
  mechanism:
    "Digestion releases glycine, proline and hydroxyproline together with small bioactive dipeptides (for example prolyl-hydroxyproline) that appear in the blood within an hour and may signal fibroblasts and chondrocytes to synthesise collagen and other matrix proteins. Part of the effect is simply extra protein and collagen-specific amino acids.",
  goals: [
    {
      goal: "skin_cosmetic",
      evidence: "moderate",
      summary:
        "Meta-analyses of 19–26 randomised trials (about 1,100–1,700 participants) report small but consistent improvements in skin hydration and elasticity after 8–12 weeks at 2.5–10 g per day. A 2025 analysis found the effect disappeared in trials without industry funding and in higher-quality studies, so the true effect is probably modest.",
    },
    {
      goal: "injury_recovery",
      evidence: "limited",
      summary:
        "A 24-week trial of 10 g per day in 147 athletes reported small reductions in activity-related joint pain; a short crossover study found 15 g of vitamin-C-enriched gelatin before exercise doubled a blood marker of collagen synthesis. No trial has shown faster healing of a diagnosed tendon or ligament injury.",
    },
    {
      goal: "muscle_recovery",
      evidence: "limited",
      summary:
        "In 53 older men with sarcopenia, 15 g per day alongside 12 weeks of resistance training increased fat-free mass and strength more than placebo. Collagen is an incomplete protein (low in leucine), so it does not replace whey or food protein for muscle building; recovery studies in younger athletes are small and mixed.",
    },
    {
      goal: "hair",
      evidence: "limited",
      summary:
        "Hair claims rest on a few small, manufacturer-funded trials of multi-ingredient supplements containing collagen; no adequately controlled trial has isolated an effect of collagen peptides on hair growth or thickness.",
    },
  ],
  overallEvidence: "moderate",
  humanEvidenceLevel: "food_supplement",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Regulated as a food supplement, not a medicine.",
      detail:
        "Sold legally under the Food Supplements Regulations. Products may not make medicinal claims (for example 'treats arthritis'); no authorised health claims specific to collagen exist in the UK register.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Regulated as a dietary supplement, not a drug.",
      detail:
        "Hydrolysed collagen is sold as a dietary supplement under DSHEA and is generally recognised as safe as a food ingredient. Supplements are not evaluated by the FDA for efficacy before sale and may only carry structure/function claims.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "Regulated as a food supplement; EFSA has not authorised a health claim.",
      detail:
        "Collagen hydrolysate is a permitted food ingredient. EFSA's scientific panel concluded that a cause-and-effect relationship between collagen hydrolysate and maintenance of joints had not been established, so products cannot carry authorised joint or skin health claims.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Sold as a food or as a listed complementary medicine (AUST L); not a registered medicine.",
      detail:
        "Depending on presentation, collagen products are regulated as foods or as low-risk listed medicines on the ARTG, which are assessed for quality and safety but not for efficacy.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Regulated as a natural health product, not a prescription drug.",
      detail: "Hydrolysed collagen products are licensed as natural health products with a Natural Product Number and may carry only the permitted general claims.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Generally sold as a food supplement; claim rules vary by country.",
      detail: "Collagen peptides are available as foods or supplements in most countries; check local rules on health claims.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["oral"],
  dosingResearch: [
    {
      title: "Specific collagen peptides and skin elasticity in women",
      citation: "Proksch E et al., Skin Pharmacol Physiol 2014;27:47–55",
      year: 2014,
      phase: "Randomised controlled trial",
      design: "Randomised, double-blind, placebo-controlled, three-arm",
      population: "Healthy women aged 35–55",
      n: 69,
      duration: "8 weeks (plus 4-week follow-up)",
      doses: "2.5 g or 5.0 g hydrolysed collagen (bovine, Verisol) once daily, or maltodextrin placebo",
      route: "oral",
      outcome:
        "Skin elasticity improved by about 7% versus placebo at 4 and 8 weeks in both dose groups, with no difference between 2.5 g and 5 g; the effect was larger in women over 50. Hydration and roughness changes were not significant.",
      adverseEvents: "No adverse events attributed to the supplement were reported.",
      exposure: { doseMin: 2.5, doseMax: 5, unit: "g", frequency: "daily", route: "oral" },
      url: "https://doi.org/10.1159/000351376",
    },
    {
      title: "Collagen hydrolysate in athletes with activity-related joint pain",
      citation: "Clark KL et al., Curr Med Res Opin 2008;24:1485–1496",
      year: 2008,
      phase: "Randomised controlled trial",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Varsity and club-sport athletes with activity-related joint pain and no diagnosed joint disease",
      n: 147,
      duration: "24 weeks",
      doses: "10 g collagen hydrolysate in 25 mL liquid once daily, or xanthan placebo",
      route: "oral",
      outcome:
        "Among 97 evaluable participants, six of the pain parameters (for example pain when walking: −1.11 vs −0.46 on a 10-point scale) improved significantly more with collagen; effects were larger in the knee-pain subgroup. Differences were small and a third of participants were not evaluable.",
      adverseEvents: "No safety concerns were identified; the supplement was well tolerated.",
      exposure: { doseMin: 10, doseMax: 10, unit: "g", frequency: "daily", route: "oral" },
      url: "https://pure.psu.edu/en/publications/24-week-study-on-the-use-of-collagen-hydrolysate-as-a-dietary-sup/",
    },
    {
      title: "Collagen peptides with resistance training in older men with sarcopenia",
      citation: "Zdzieblik D et al., Br J Nutr 2015;114:1237–1245",
      year: 2015,
      phase: "Randomised controlled trial",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Men aged about 72 with class I or II sarcopenia completing a supervised resistance-training programme",
      n: 53,
      duration: "12 weeks",
      doses: "15 g collagen peptides (Bodybalance) once daily after training, or silica placebo",
      route: "oral",
      outcome:
        "Fat-free mass rose by 4.2 kg versus 2.9 kg with placebo, quadriceps strength by 16.5 versus 7.3 Nm, and fat mass fell by 5.4 versus 3.5 kg — all in addition to the training effect.",
      adverseEvents: "No adverse events attributed to the supplement were reported.",
      exposure: { doseMin: 15, doseMax: 15, unit: "g", frequency: "daily", route: "oral" },
    },
  ],
  dosingResearchNote:
    "Most trials used 2.5–5 g per day for skin and 10–15 g per day for joints or muscle, taken for 8–24 weeks. Many were funded by ingredient manufacturers and used their specific products, so results may not transfer to every brand.",
  contraindications: [
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Collagen adds 10–15 g of protein per day at the higher doses. People with chronic kidney disease who have been advised to limit protein should check with their kidney team first.",
    },
    {
      conditionId: "gastrointestinal",
      severity: "caution",
      note: "Generally well tolerated, but fullness, bloating or reflux are the most common complaints; people with active gastrointestinal disease may notice symptoms more.",
    },
  ],
  interactions: [
    {
      classId: "thyroid_hormone",
      severity: "minor",
      note: "Levothyroxine should be taken on an empty stomach, separated by several hours from protein or calcium-containing supplements such as some marine collagen products, which can reduce its absorption.",
    },
    {
      classId: "narrow_therapeutic_index",
      severity: "minor",
      note: "No specific interactions are documented, but any bulk protein supplement taken at the same time as a medicine that depends on precise absorption is best separated in time.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "As a food-derived protein, hydrolysed collagen is not expected to pose a specific risk, but supplements have not been formally studied in pregnancy or breastfeeding. Discuss with a midwife or doctor, and prefer products with third-party heavy-metal testing.",
  },
  commonAdverseEffects: [
    "Feeling of fullness or bloating",
    "Mild nausea or unpleasant aftertaste",
    "Heartburn or reflux",
    "Loose stools at higher doses",
  ],
  seriousAdverseEffects: [
    "Allergic reactions in people allergic to the source (fish, shellfish, bovine, egg)",
    "Hypercalcaemia has been reported with some calcium-rich marine or shark-cartilage products",
    "Heavy-metal exposure from poorly controlled products (a manufacturing, not a collagen, problem)",
  ],
  monitoring: [
    "Objective before-and-after comparison at 8–12 weeks rather than day-to-day impressions",
    "Total daily protein intake, especially if you also use other protein supplements",
    "Kidney function if you have kidney disease and are adding protein",
    "Allergy symptoms when starting a product from a new animal source",
    "Whether joint or skin changes might have a medical cause that deserves assessment",
  ],
  sourceConsiderations: [
    "Choose products with independent third-party testing (for example Informed Sport, NSF or USP) — analyses have found detectable heavy metals in a proportion of collagen powders.",
    "Check the source (bovine, porcine, marine, chicken) against allergies and dietary or religious requirements.",
    "Trial doses were 2.5–15 g per day; some products deliver only 1–2 g per serving.",
    "Claims of 'type I/II/III' specificity or 'medical grade' are marketing terms; hydrolysis largely destroys the original triple-helix structure.",
  ],
  clinicianQuestions: [
    "Is my skin or joint concern something a supplement could plausibly help, or does it need diagnosis first?",
    "Does my kidney function or protein intake make 10–15 g of additional protein a problem?",
    "If muscle or recovery is my goal, should I prioritise total protein and leucine intake over collagen specifically?",
    "Are there any reasons to avoid a particular collagen source given my allergies or medicines?",
  ],
  alternatives: ["ghk-cu"],
  stackNotes: [
    {
      with: "ghk-cu",
      evidence: "none",
      overlap: "Both are marketed for skin firmness and collagen support.",
      note: "Different routes (oral supplement, topical peptide) and low individual risk, but no study has tested the combination.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      overlap: "Both are marketed for tendon and ligament healing.",
      note: "No data on combined use. Collagen has some human trial evidence for joint pain; BPC-157 has none, so the pairing adds an unregulated injectable to a low-risk food supplement.",
    },
    {
      with: "tb-500",
      evidence: "none",
      overlap: "Both are marketed for tissue repair.",
      note: "No data on combined use; TB-500 has no human data at all.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Protein intake matters during rapid weight loss to limit lean-mass loss.",
      note: "No trial has tested collagen during GLP-1 treatment. Collagen is low in leucine and should not be counted as the main protein source; complete proteins and resistance training are what the evidence supports.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Protein intake matters during rapid weight loss to limit lean-mass loss.",
      note: "No trial has tested collagen during incretin treatment; the same caveat about incomplete protein applies.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Hydrolysed animal collagen (food supplement)" },
    { label: "Trial participants", value: "> 1,700 across 26 randomised skin trials (meta-analysis)" },
    { label: "Studied doses", value: "2.5–5 g/day (skin); 10–15 g/day (joints, muscle)" },
    { label: "Regulatory status", value: "Food supplement in all major jurisdictions" },
    { label: "Anti-doping", value: "Not prohibited" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    {
      label: "de Miranda RB, Weimer P, Rossi RC. Effects of hydrolyzed collagen supplementation on skin aging: systematic review and meta-analysis. Int J Dermatol 2021;60:1449–1461",
      url: "https://pubmed.ncbi.nlm.nih.gov/33742704/",
    },
    {
      label: "Pu SY et al. Effects of oral collagen for skin anti-aging: systematic review and meta-analysis. Nutrients 2023;15:2080",
      url: "https://doi.org/10.3390/nu15092080",
    },
    {
      label: "Effects of collagen supplements on skin aging: meta-analysis by funding source and study quality. Am J Med 2025",
      url: "https://www.amjmed.com/article/S0002-9343(25)00283-9/abstract",
    },
    {
      label: "Proksch E et al. Oral supplementation of specific collagen peptides has beneficial effects on human skin physiology. Skin Pharmacol Physiol 2014;27:47–55",
      url: "https://doi.org/10.1159/000351376",
    },
    {
      label: "Clark KL et al. 24-week study on the use of collagen hydrolysate as a dietary supplement in athletes with activity-related joint pain. Curr Med Res Opin 2008;24:1485–1496",
      url: "https://pure.psu.edu/en/publications/24-week-study-on-the-use-of-collagen-hydrolysate-as-a-dietary-sup/",
    },
    {
      label: "Zdzieblik D et al. Collagen peptide supplementation in combination with resistance training improves body composition in elderly sarcopenic men. Br J Nutr 2015;114:1237–1245",
      url: "https://www.cambridge.org/core/journals/british-journal-of-nutrition/article/collagen-peptide-supplementation-in-combination-with-resistance-training-improves-body-composition-and-increases-muscle-strength-in-elderly-sarcopenic-men-a-randomised-controlled-trial/9426E375742D094F91029FD0364815C4",
    },
  ],
};
