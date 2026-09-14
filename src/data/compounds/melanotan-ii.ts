import type { Compound } from "../types";

/**
 * Melanotan II — an abandoned 1990s research compound now sold illegally for
 * tanning and libido. This record is deliberately 'higher concern': regulators
 * in the UK, Australia and the US have issued explicit public warnings, and the
 * only human trials are a three-person phase 1 and two ten-man pilots.
 * Regulatory facts checked against the MHRA FOI 24/274 response, the TGA
 * melanotan warning and the FDA compounding safety-risk page (2026).
 */
export const melanotanII: Compound = {
  slug: "melanotan-ii",
  name: "Melanotan II",
  aliases: ["MT-II", "MT2", "Melanotan 2", "Melanotan-II", "Barbie peptide", "Tanning injection", "Nasal tanning spray"],
  family: "sexual_health",
  classLabel: "Non-selective melanocortin receptor agonist (α-MSH analogue)",
  tagline: "Unlicensed tanning and libido peptide that regulators have publicly warned against",
  summary:
    "Melanotan II is a synthetic cyclic analogue of the pigment hormone α-MSH developed in the 1990s as a sunless-tanning drug. Development was abandoned after early trials, but it is now sold illegally online as injections and nasal sprays for tanning and sexual effects. The MHRA, the TGA and the FDA have all warned against its use because of reports of new or changing moles, melanoma, kidney damage, rhabdomyolysis, encephalopathy and prolonged erections, and because the products' contents are unknown. It has never been approved anywhere.",
  mechanism:
    "Activates all melanocortin receptors without selectivity: MC1 on skin pigment cells (tanning and darkening of moles), MC4 in the brain (sexual arousal, appetite suppression, blood-pressure and heart-rate changes) and MC3/MC5 (less well understood). Its deamidated metabolite is bremelanotide (PT-141), which was developed separately as a more selective MC4 agonist.",
  goals: [
    {
      goal: "skin_cosmetic",
      evidence: "preliminary",
      summary:
        "Tanning was documented in a 1996 phase 1 study of three men given subcutaneous injections on alternate days for two weeks; two of the three darkened. No larger controlled study of Melanotan II for tanning was ever published — the tanning programme moved to the related compound Melanotan I (afamelanotide), which became a licensed medicine for a rare light-sensitivity disorder, not for cosmetic tanning.",
    },
    {
      goal: "sexual_health",
      evidence: "preliminary",
      summary:
        "Two double-blind crossover pilots (10 men each) in the late 1990s found 0.025 mg/kg subcutaneously produced erections without sexual stimulation in most men with psychogenic or organic erectile dysfunction, with nausea and yawning as the main side effects. Development stopped; the effect was pursued instead through bremelanotide. No data in women.",
    },
    {
      goal: "fat_loss",
      evidence: "insufficient",
      summary:
        "Appetite suppression is a consistent side effect through MC4 receptor activation, and some users take it for that reason, but no study has ever measured weight or body composition.",
    },
  ],
  overallEvidence: "preliminary",
  humanEvidenceLevel: "early_clinical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Never licensed; MHRA has repeatedly removed products and advises users to stop.",
      detail:
        "Injectable Melanotan II is classed as an unlicensed medicine and cannot legally be sold, supplied or advertised. The MHRA has taken enforcement action for over a decade and states its advice to anyone who has used Melanotan II injections or nasal sprays is to stop immediately and report side effects via the Yellow Card scheme. Nasal sprays sold without medicinal claims currently fall outside medicines law, which is a regulatory gap rather than a sign of safety.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Never FDA-approved; flagged for serious safety risks in compounding.",
      detail:
        "Melanotan II has never been approved for any use. The FDA placed it in 503A Category 2 in September 2023, citing published reports of melanoma, posterior reversible encephalopathy syndrome, sympathomimetic toxidrome and priapism plus immunogenicity and impurity risks. It was removed from Category 2 in April 2026 only because its nomination was withdrawn, and the FDA has scheduled advisory-committee review before the end of February 2027. It remains ineligible for legitimate compounding and illegal to sell for human use.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No authorisation in any member state; national agencies have warned against it.",
      detail:
        "Melanotan II has no EMA or national marketing authorisation. Medicines agencies in several member states (including Denmark and the Netherlands) have issued public warnings about illegal tanning injections and sprays.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not approved; TGA says 'don't risk using tanning products containing melanotan'.",
      detail:
        "The TGA states melanotan is not approved for sale or use as a tanning agent in Australia, that supplying it without a prescription is illegal in any form (spray, tablet, injection or cream), and it has issued infringement notices totalling over AUD 100,000 to individuals supplying Melanotan II.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised by Health Canada; unauthorised tanning products are unapproved drugs.",
      detail: "No Drug Identification Number exists. Health Canada has previously advised consumers not to use unauthorised tanning injections or sprays.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Not approved by any national medicines regulator that we are aware of.",
      detail: "Melanotan II is a discontinued development compound with no marketing authorisation anywhere. Verify with your national regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: true,
  routes: ["subcutaneous", "intranasal"],
  dosingResearch: [
    {
      title: "Pilot phase 1 study of Melanotan II in healthy men (tanning)",
      citation: "Dorr RT et al., Life Sci 1996;58:1777–1784",
      year: 1996,
      phase: "Phase 1 (pilot)",
      design: "Single-blind, placebo-controlled, alternating-day saline or Melanotan II, dose escalation",
      population: "Healthy adult men",
      n: 3,
      duration: "Two weeks (five active doses)",
      doses: "Subcutaneous Melanotan II starting at 0.01 mg/kg, escalated in 0.005 mg/kg steps to 0.025–0.03 mg/kg, on alternating days with saline",
      route: "subcutaneous",
      outcome:
        "Two of three men developed measurable darkening of the face, upper body and buttocks one week after dosing ended. The authors recommended 0.025 mg/kg as the maximum dose for further study.",
      adverseEvents:
        "Mild nausea at most dose levels; stretching and yawning followed by spontaneous penile erections lasting intermittently for 1–5 hours in all three men at 0.025 mg/kg; grade 2 somnolence and fatigue at 0.03 mg/kg.",
      exposure: {
        doseMin: 0.01,
        doseMax: 0.03,
        unit: "mg/kg",
        frequency: "other",
        route: "subcutaneous",
        note: "Alternate-day dosing over two weeks in a supervised phase 1 setting.",
      },
      url: "https://doi.org/10.1016/0024-3205(96)00160-9",
    },
    {
      title: "Melanotan II in men with psychogenic erectile dysfunction",
      citation: "Wessells H et al., J Urol 1998;160:389–393",
      year: 1998,
      phase: "Phase 2 (pilot)",
      design: "Randomised, double-blind, placebo-controlled crossover",
      population: "Men with erectile dysfunction of no known organic cause",
      n: 10,
      duration: "Single doses with 6-hour RigiScan monitoring",
      doses: "0.025 mg/kg Melanotan II subcutaneously versus vehicle",
      route: "subcutaneous",
      outcome:
        "Clinically apparent erections in 8 of 10 men; mean duration of tip rigidity above 80% was 38 minutes versus 3 minutes with placebo (p = 0.0045), without sexual stimulation.",
      adverseEvents: "Nausea, stretching and yawning, and decreased appetite were more frequent than with placebo; none required treatment in this study.",
      exposure: { doseMin: 0.025, doseMax: 0.025, unit: "mg/kg", frequency: "once", route: "subcutaneous" },
      url: "https://pubmed.ncbi.nlm.nih.gov/9679884/",
    },
    {
      title: "Melanotan II in men with erectile dysfunction and organic risk factors",
      citation: "Wessells H et al., Urology 2000;56:641–646",
      year: 2000,
      phase: "Phase 2 (pilot)",
      design: "Randomised, double-blind, placebo-controlled crossover (two doses each of active and vehicle)",
      population: "Men with erectile dysfunction and organic risk factors (for example diabetes, vascular disease)",
      n: 10,
      duration: "Single doses with 6-hour RigiScan monitoring",
      doses: "0.025 mg/kg Melanotan II subcutaneously versus vehicle, each given twice",
      route: "subcutaneous",
      outcome:
        "Erections after 12 of 19 active injections versus 1 of 21 placebo injections; tip rigidity above 80% lasted 45 minutes versus 2 minutes (p = 0.047); self-rated sexual desire was higher after Melanotan II.",
      adverseEvents: "Nausea and stretching/yawning were more frequent with Melanotan II; 4 of 19 active injections caused severe nausea.",
      exposure: { doseMin: 0.025, doseMax: 0.025, unit: "mg/kg", frequency: "once", route: "subcutaneous" },
      url: "https://doi.org/10.1016/S0090-4295(00)00680-4",
    },
  ],
  dosingResearchNote:
    "These early-phase studies involved 23 men in total, given single supervised doses or a two-week course, and the compound was never taken further because of its side-effect profile. Nothing is known about the safety of the repeated 'loading and maintenance' injections or daily nasal sprays used for tanning, which typically expose users for far longer than any trial did. Illegal products are also of unknown strength, so a stated dose means little.",
  contraindications: [
    {
      conditionId: "melanoma_history",
      severity: "absolute",
      note: "Melanotan II stimulates pigment cells directly. Case reports describe new melanomas and rapidly changing or eruptive moles in users; anyone with a history of melanoma or atypical moles should not be exposed to it.",
    },
    {
      conditionId: "cancer",
      severity: "caution",
      note: "Beyond melanoma, the effect of a non-selective melanocortin agonist on other cancers is unknown; any cancer history should be disclosed.",
    },
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "Melanocortin agonists raise blood pressure and alter heart rate; the FDA has cited a sympathomimetic toxidrome (racing heart, hypertension, agitation) in case reports. Existing heart disease increases the risk.",
    },
    {
      conditionId: "hypertension",
      severity: "caution",
      note: "Expected transient blood-pressure rises after each dose (documented for the related medicine bremelanotide) are more dangerous with pre-existing hypertension, and posterior reversible encephalopathy syndrome has been reported.",
    },
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Case reports include renal infarction and rhabdomyolysis-related kidney injury after Melanotan II use; pre-existing kidney disease reduces reserve.",
    },
    {
      conditionId: "clotting",
      severity: "caution",
      note: "Reported renal infarction and priapism point to vascular effects; a clotting disorder or blood-thinner use adds uncertainty.",
    },
  ],
  interactions: [
    {
      classId: "antihypertensive",
      severity: "moderate",
      note: "Melanocortin agonists transiently raise blood pressure after each dose, working against blood-pressure treatment; the combination is unstudied.",
    },
    {
      classId: "pde5_inhibitor",
      severity: "moderate",
      note: "Melanotan II produces spontaneous erections on its own; combining it with sildenafil-type medicines risks prolonged, painful erections (priapism), which has been reported with Melanotan II alone.",
    },
    {
      classId: "stimulant",
      severity: "moderate",
      note: "The FDA has cited sympathomimetic toxidrome with Melanotan II; adding stimulant medicines could compound the cardiovascular effects.",
    },
    {
      classId: "glp1_agonist",
      severity: "minor",
      note: "Both suppress appetite and cause nausea; the combination is unstudied and may be poorly tolerated.",
    },
  ],
  pregnancy: {
    status: "not_recommended",
    note: "No human or animal reproductive data exist, the related medicine bremelanotide caused fetal harm in animal studies, and regulators advise that nobody should use Melanotan II. It should not be used while pregnant, trying to conceive or breastfeeding.",
  },
  commonAdverseEffects: [
    "Nausea and vomiting (very common, especially with early doses)",
    "Facial flushing",
    "Loss of appetite",
    "Yawning and stretching followed by spontaneous erections",
    "Fatigue and drowsiness",
    "Darkening of existing moles and freckles; new moles",
    "Uneven or patchy pigmentation",
    "Injection-site reactions or nasal irritation",
  ],
  seriousAdverseEffects: [
    "Melanoma and rapidly changing or eruptive moles (case reports; regulators' principal concern)",
    "Priapism (prolonged painful erection needing emergency treatment)",
    "Rhabdomyolysis (muscle breakdown) and acute kidney injury",
    "Renal infarction",
    "Posterior reversible encephalopathy syndrome (brain swelling with headache, seizures, visual loss)",
    "Sympathomimetic toxidrome: severe hypertension, rapid heart rate, agitation",
    "Infection or contamination reactions from illegally manufactured products",
  ],
  monitoring: [
    "Full skin check by a doctor or dermatologist, with photographs of moles, before and after any exposure",
    "Any mole that changes size, shape or colour, or any new mole — seek urgent assessment",
    "Blood pressure and heart rate",
    "Severe headache, visual disturbance or confusion (possible encephalopathy) — emergency",
    "Muscle pain with dark urine (possible rhabdomyolysis) — emergency",
    "An erection lasting more than four hours — emergency",
    "Report any adverse effect to the national regulator (Yellow Card in the UK)",
  ],
  sourceConsiderations: [
    "There is no legal, pharmaceutical-grade Melanotan II anywhere; every product is manufactured and sold illegally, with no GMP oversight.",
    "Analyses of seized tanning products have found wrong doses, unidentified impurities and bacterial contamination; injecting or spraying them adds infection and immune risks to the drug's own.",
    "Regulators (MHRA, TGA, FDA and others) have published explicit warnings; the MHRA's advice to anyone using Melanotan II injections or nasal sprays is to stop.",
    "Nasal sprays are marketed as a 'safer' alternative; they deliver the same drug, with the same systemic effects, and are equally unregulated.",
  ],
  clinicianQuestions: [
    "If I have used Melanotan II, can you examine my skin and document my moles for future comparison?",
    "Do I have any cardiovascular, kidney or clotting history that makes the reported adverse events more likely for me?",
    "If sexual function is my real concern, what licensed, properly studied options exist?",
    "If tanning or appearance is my goal, what are the safe alternatives, and is a melanoma-risk assessment worthwhile?",
    "How do I report side effects I have already experienced?",
  ],
  alternatives: ["pt-141"],
  stackNotes: [
    {
      with: "pt-141",
      evidence: "none",
      overlap: "Both are melanocortin agonists — bremelanotide is a metabolite of Melanotan II — so the mechanism is duplicated.",
      note: "Combining them stacks the same receptor activity with additive nausea, blood-pressure rise, pigmentation and (in men) prolonged-erection risk. There is no rationale and no data.",
    },
    {
      with: "kisspeptin",
      evidence: "none",
      overlap: "Both are marketed online for libido.",
      note: "No data on the combination; kisspeptin adds unstudied hormone-axis stimulation to a compound with its own serious safety signals.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Both suppress appetite and cause nausea.",
      note: "No data on the combination; tolerability is likely to be worse, and Melanotan II's appetite effect is not a studied weight-loss mechanism.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Both suppress appetite and cause nausea.",
      note: "No data on the combination; tolerability is likely to be worse.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Non-selective melanocortin agonist (α-MSH analogue)" },
    { label: "Human trials", value: "3-man phase 1 (1996) and two 10-man erectile-dysfunction pilots; development abandoned" },
    { label: "Regulatory status", value: "Never approved anywhere; MHRA, TGA and FDA warnings" },
    { label: "Anti-doping", value: "Not named on the WADA list, but non-approved substances are prohibited under S0" },
    { label: "Typical sale form", value: "Illegal injectable vials and nasal tanning sprays" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    {
      label: "Dorr RT et al. Evaluation of Melanotan-II, a superpotent cyclic melanotropic peptide in a pilot phase-I clinical study. Life Sci 1996;58:1777–1784",
      url: "https://doi.org/10.1016/0024-3205(96)00160-9",
    },
    {
      label: "Wessells H et al. Synthetic melanotropic peptide initiates erections in men with psychogenic erectile dysfunction: double-blind, placebo controlled crossover study. J Urol 1998;160:389–393",
      url: "https://pubmed.ncbi.nlm.nih.gov/9679884/",
    },
    {
      label: "Wessells H et al. Effect of an α-melanocyte stimulating hormone analog on penile erection and sexual desire in men with organic erectile dysfunction. Urology 2000;56:641–646",
      url: "https://doi.org/10.1016/S0090-4295(00)00680-4",
    },
    {
      label: "TGA — Don't risk using tanning products containing melanotan",
      url: "https://www.tga.gov.au/news/blog/dont-risk-using-tanning-products-containing-melanotan",
    },
    {
      label: "MHRA — FOI 24/274: side-effect reports and regulatory position on Melanotan II products",
      url: "https://assets.publishing.service.gov.uk/media/669fbd3aa3c2a28abb50d55a/Final_Redaction_FOI_24_274.pdf",
    },
    {
      label: "FDA — Certain bulk drug substances for use in compounding that may present significant safety risks (Melanotan II entry)",
      url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    },
  ],
};
