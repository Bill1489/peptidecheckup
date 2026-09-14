import type { Compound } from "../types";

/**
 * PT-141 (bremelanotide, Vyleesi) — the only authorised medicine in the
 * sexual-health group. Label facts are taken from the current US Prescribing
 * Information (DailyMed) and the RECONNECT phase 3 programme.
 */
export const pt141: Compound = {
  slug: "pt-141",
  name: "PT-141 (bremelanotide)",
  aliases: ["Bremelanotide", "Vyleesi", "PT141", "PT 141", "Rekynda"],
  family: "sexual_health",
  classLabel: "Melanocortin-4 receptor agonist",
  tagline: "FDA-approved on-demand injection for low sexual desire in premenopausal women",
  summary:
    "Bremelanotide is a cyclic peptide analogue of the hormone α-MSH that activates melanocortin receptors in the brain. Under the brand Vyleesi it has been FDA-approved since June 2019 for premenopausal women with acquired, generalised hypoactive sexual desire disorder, taken as a 1.75 mg subcutaneous autoinjector shortly before anticipated sexual activity. Two 24-week phase 3 trials in 1,247 women showed statistically significant but modest gains in desire, with nausea in about 40% of users. It is not authorised in the UK, EU, Australia or Canada and is not licensed for men.",
  mechanism:
    "Activates melanocortin-4 (and to a lesser extent MC1 and MC3) receptors. In the hypothalamus this is thought to shift the balance of dopamine and other neurotransmitters towards sexual excitation rather than inhibition. MC1 activation in skin explains the pigmentation side effect, and central melanocortin activity explains the transient rise in blood pressure and fall in heart rate.",
  goals: [
    {
      goal: "sexual_health",
      evidence: "moderate",
      summary:
        "In premenopausal women with HSDD (RECONNECT, n = 1,247) desire scores rose by 0.5–0.6 points versus 0.2 with placebo on a 1.2–6 scale over 24 weeks, with a matching small fall in distress — statistically significant but modest, and 18% stopped because of side effects. In men, small phase 2 studies of intranasal and subcutaneous bremelanotide produced erections in erectile dysfunction, but the programme was discontinued after blood-pressure concerns; it is not authorised for men or for postmenopausal women.",
    },
    {
      goal: "weight_management",
      evidence: "insufficient",
      summary:
        "Melanocortin-4 receptor activation suppresses appetite in animals and reduced appetite is reported by some users, but bremelanotide has never been studied for weight and is not indicated for it.",
    },
    {
      goal: "skin_cosmetic",
      evidence: "insufficient",
      summary:
        "Bremelanotide is sometimes misused for tanning because it darkens skin; in trials this appeared as focal, patchy hyperpigmentation of the face, gums and breasts that did not always resolve — an adverse effect, not a cosmetic benefit.",
    },
  ],
  overallEvidence: "moderate",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "No MHRA marketing authorisation; not available on the NHS.",
      detail:
        "Bremelanotide has not been licensed in the UK. Products sold online as 'PT-141' are unlicensed medicines of unknown origin.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "authorised",
      summary: "FDA-approved (Vyleesi, June 2019) for premenopausal women with acquired, generalised HSDD; prescription-only.",
      detail:
        "Indicated for premenopausal women whose low desire is not due to a medical or psychiatric condition, relationship problems or a medicine. Not indicated for postmenopausal women or men, or to enhance sexual performance. Supplied as a 1.75 mg/0.3 mL single-dose autoinjector; no more than one dose in 24 hours and no more than eight doses per month are recommended.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EU marketing authorisation; not assessed by the EMA.",
      detail:
        "No centralised or national marketing authorisation exists for bremelanotide in any EU member state. Products sold to EU consumers as 'PT-141' are unauthorised medicinal products.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not registered on the ARTG; prescription-only if accessed via special schemes.",
      detail:
        "No sponsor has registered bremelanotide in Australia. Access would require the TGA's Special Access Scheme or Authorised Prescriber pathway; online 'PT-141' products are unapproved.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not approved by Health Canada.",
      detail: "No Notice of Compliance has been issued; flibanserin (Addyi) is the only authorised HSDD medicine in Canada. Online 'PT-141' products are unauthorised drugs.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Authorised in the US only, as far as we are aware; check your national regulator.",
      detail: "We are not aware of marketing authorisations outside the United States. Verify locally.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous", "intranasal"],
  dosingResearch: [
    {
      title: "RECONNECT — two identical phase 3 trials of as-needed bremelanotide in premenopausal women with HSDD",
      citation: "Kingsberg SA et al., Obstet Gynecol 2019;134:899–908 (Studies 301 and 302)",
      year: 2019,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled (two identical trials)",
      population: "Premenopausal women (mean age 39) with acquired, generalised HSDD for at least six months",
      n: 1247,
      duration: "24 weeks (followed by a 52-week open-label extension)",
      doses: "1.75 mg subcutaneous via autoinjector, self-administered as needed about 45 minutes before anticipated sexual activity; maximum one dose per 24 hours (trials allowed up to 12 doses per month; the label recommends no more than 8). Median 10 doses over 24 weeks.",
      route: "subcutaneous",
      outcome:
        "FSFI desire-domain score rose 0.5 (Study 1) and 0.6 (Study 2) points versus 0.2 with placebo (scale 1.2–6.0; p ≤ 0.0002); distress score (FSDS-DAO item 13) fell 0.7 versus 0.4 points in both studies. Effects were statistically significant but small in absolute terms.",
      adverseEvents:
        "Nausea 40% (versus 1% placebo; 13% needed anti-emetics, 8% stopped), flushing 20%, injection-site reactions 13%, headache 11%, vomiting 5%. Discontinuation for adverse reactions 18% versus 2%. Transient blood-pressure rise of up to 6/3 mmHg with heart-rate fall of up to 5 bpm after each dose; focal hyperpigmentation in 1%.",
      exposure: {
        doseMin: 1.75,
        doseMax: 1.75,
        unit: "mg",
        frequency: "other",
        route: "subcutaneous",
        note: "As needed, no more than one dose per 24 hours and no more than eight doses per month.",
      },
    },
    {
      title: "RECONNECT open-label extension — 52-week safety",
      citation: "Simon JA et al., Obstet Gynecol 2019;134:909–917",
      year: 2019,
      phase: "Phase 3 (open-label extension)",
      design: "Uncontrolled, open-label continuation of the two phase 3 trials",
      population: "Women completing the 24-week double-blind phase who chose to continue",
      n: 684,
      duration: "52 weeks",
      doses: "1.75 mg subcutaneous as needed (median 12 doses over the year)",
      route: "subcutaneous",
      outcome: "Improvements in desire and distress were maintained; no new efficacy signal beyond the controlled phase.",
      adverseEvents:
        "Adverse-event profile matched the controlled phase (nausea, flushing, headache). One case of acute hepatitis with transaminases over 40 times normal after 10 doses in a year, resolving four months after stopping — the drug could not be excluded as the cause.",
      exposure: {
        doseMin: 1.75,
        doseMax: 1.75,
        unit: "mg",
        frequency: "other",
        route: "subcutaneous",
        note: "As needed; most participants used it two to three times per month.",
      },
    },
    {
      title: "Early-phase intranasal bremelanotide in men with erectile dysfunction (development discontinued)",
      citation: "Diamond LE et al., Int J Impot Res 2004;16:51–59",
      year: 2004,
      phase: "Phase 1/2",
      design: "Randomised, double-blind, placebo-controlled, dose-ranging",
      population: "Healthy men and men with mild-to-moderate erectile dysfunction",
      duration: "Single doses",
      doses: "Single intranasal doses (dose-ranging); the intranasal formulation was later abandoned because of blood-pressure increases",
      route: "intranasal",
      outcome: "Dose-related erectile responses on RigiScan monitoring compared with placebo; the finding of increased desire led to the later HSDD programme in women.",
      adverseEvents: "Nausea, flushing and yawning; blood-pressure increases at higher doses drove the decision to stop intranasal development.",
    },
  ],
  dosingResearchNote:
    "The only authorised regimen is 1.75 mg subcutaneously as needed, with at most one dose in 24 hours and eight doses per month; pre-treatment with ondansetron did not reduce nausea in a phase 4 study. Higher or daily dosing increases hyperpigmentation and the time spent with raised blood pressure. Vials and nasal sprays sold online as 'PT-141' are not the approved product and their content is unverified.",
  contraindications: [
    {
      conditionId: "hypertension",
      severity: "absolute",
      note: "Contraindicated in uncontrolled hypertension. Each dose raises systolic blood pressure by up to 6 mmHg for several hours; even controlled hypertension requires a prescriber to confirm control before and during use.",
    },
    {
      conditionId: "cardiovascular",
      severity: "absolute",
      note: "Contraindicated with known cardiovascular disease and not recommended at high cardiovascular risk, because of the repeated transient rise in blood pressure and fall in heart rate.",
    },
    {
      conditionId: "kidney",
      severity: "caution",
      note: "Use with caution in severe renal impairment (eGFR below 30), where nausea and vomiting are more frequent and severe.",
    },
    {
      conditionId: "liver",
      severity: "caution",
      note: "Not evaluated in severe hepatic impairment; a single case of acute hepatitis occurred in the extension study.",
    },
    {
      conditionId: "melanoma_history",
      severity: "caution",
      note: "Not addressed in the label, but bremelanotide also activates the MC1 receptor on pigment cells (causing focal hyperpigmentation); a history of melanoma or atypical moles is worth raising with a dermatologist first.",
    },
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "The licence covers low desire that is not due to a psychiatric condition or to medicines such as antidepressants; those causes need assessment before treatment is considered.",
    },
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Low desire caused by a medical condition (for example thyroid or pituitary disorders, or the menopause) is outside the licence and should be investigated first; the medicine is not indicated after the menopause.",
    },
  ],
  interactions: [
    {
      classId: "other",
      severity: "major",
      note: "Oral naltrexone (for alcohol or opioid dependence): bremelanotide can markedly reduce its absorption, risking treatment failure — the label advises avoiding the combination.",
    },
    {
      classId: "narrow_therapeutic_index",
      severity: "moderate",
      note: "Bremelanotide slows gastric emptying and can reduce the rate and extent of absorption of oral medicines that depend on reaching a threshold concentration.",
    },
    {
      classId: "antibiotic",
      severity: "moderate",
      note: "The label advises avoiding bremelanotide while taking oral antibiotics whose effect depends on reaching threshold blood levels.",
    },
    {
      classId: "antihypertensive",
      severity: "moderate",
      note: "Blood pressure must be controlled before use and checked periodically; the transient post-dose rise adds to whatever the antihypertensive is managing.",
    },
    {
      classId: "beta_blocker",
      severity: "moderate",
      note: "Bremelanotide lowers heart rate by up to 5 bpm for several hours after each dose; combined with a beta blocker this may be noticeable.",
    },
    {
      classId: "glp1_agonist",
      severity: "moderate",
      note: "Both slow gastric emptying and cause nausea; the combination has not been studied and may be poorly tolerated.",
    },
    {
      classId: "nsaid",
      severity: "minor",
      note: "Delayed absorption can postpone the effect of oral painkillers such as indomethacin when rapid onset is wanted.",
    },
    {
      classId: "antidepressant",
      severity: "minor",
      note: "Not a pharmacological interaction, but antidepressant-induced low desire is excluded from the licensed indication and should be addressed with the prescriber first.",
    },
  ],
  pregnancy: {
    status: "not_recommended",
    note: "The label advises effective contraception during use and stopping if pregnancy is suspected; animal studies showed fetal harm at high exposures and a pregnancy registry is in place. It is not known whether bremelanotide passes into breast milk.",
  },
  commonAdverseEffects: [
    "Nausea (about 40%; usually improves after the first or second dose)",
    "Flushing (about 20%)",
    "Injection-site pain, bruising or redness (about 13%)",
    "Headache (about 11%)",
    "Vomiting (about 5%)",
    "Cough, fatigue, hot flush, dizziness, nasal congestion (2–3%)",
    "Reduced appetite",
  ],
  seriousAdverseEffects: [
    "Transient rise in blood pressure (up to 6/3 mmHg) and fall in heart rate after every dose — a cardiovascular risk with frequent use",
    "Focal hyperpigmentation of face, gums or breasts that may not fully resolve (1% with up to 8 doses a month; 38% with daily dosing; more common in darker skin)",
    "Severe nausea requiring anti-emetics or discontinuation",
    "Acute hepatitis (single case in the extension study; causality not excluded)",
    "Severe headache requiring hospital care (single case)",
    "Reduced absorption of oral medicines, including treatment failure of oral naltrexone",
  ],
  monitoring: [
    "Blood pressure and heart rate before starting and periodically during use",
    "Number of doses per month (no more than eight) and spacing (at least 24 hours)",
    "Skin, gums and breasts for new patches of darkening",
    "Nausea, vomiting and hydration, especially in the first doses",
    "Timing of oral medicines relative to injections",
    "Contraception and pregnancy status",
    "Whether desire and distress have meaningfully changed after around eight weeks of use",
  ],
  sourceConsiderations: [
    "In the United States the only legitimate product is the Vyleesi prescription autoinjector; elsewhere no authorised product exists at all.",
    "Vials, pre-filled pens and nasal sprays sold online as 'PT-141' are unapproved, with no assurance of identity, dose, sterility or endotoxin content; nasal formulations were abandoned in development because of blood-pressure effects.",
    "Compounded bremelanotide is not the approved product and has not been shown to be equivalent.",
    "Because bremelanotide is a close relative of Melanotan II, mislabelled or cross-contaminated products are a realistic concern.",
  ],
  clinicianQuestions: [
    "Do I meet the licensed definition — premenopausal, acquired and generalised low desire that is not explained by another condition, a medicine or relationship factors?",
    "Is my blood pressure and cardiovascular risk low enough for a medicine that raises blood pressure after every dose?",
    "How should I handle nausea, and when would we decide it is not working?",
    "Which of my oral medicines could be affected by slowed stomach emptying?",
    "What is my contraception plan, and what should I do if I become pregnant?",
    "Are there non-drug approaches or other licensed options worth considering first?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "kisspeptin",
      evidence: "none",
      overlap: "Both act centrally on sexual-desire pathways in the brain.",
      note: "No study has combined them. Kisspeptin is investigational and given by infusion in research settings only; there is no rationale for combining it with an approved on-demand medicine.",
    },
    {
      with: "melanotan-ii",
      evidence: "none",
      overlap: "Both are melanocortin agonists — bremelanotide is a metabolite of Melanotan II — so the mechanism is duplicated.",
      note: "Combining them stacks the same receptor activity, with additive nausea, blood-pressure rise, pigmentation and (in men) prolonged-erection risk, and adds an unregulated product to a prescription one.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Both slow gastric emptying and commonly cause nausea.",
      note: "No data on combined use; tolerability may be worse and absorption of oral medicines may be further delayed.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Both slow gastric emptying and commonly cause nausea.",
      note: "No data on combined use; tolerability may be worse and absorption of oral medicines may be further delayed.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Melanocortin-4 receptor agonist (α-MSH analogue)" },
    { label: "Route", value: "1.75 mg subcutaneous autoinjector, as needed (≤ 8 doses/month)" },
    { label: "Trial participants", value: "1,247 women in RECONNECT phase 3" },
    { label: "Licensed effect", value: "Desire score +0.3–0.4 vs placebo (1.2–6 scale); nausea in 40%" },
    { label: "Prescription", value: "US only (FDA 2019); not authorised in UK, EU, AU, CA" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    {
      label: "Vyleesi (bremelanotide injection) US Prescribing Information — DailyMed",
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f1d0c1b5-2f39-4bad-a6a4-0066e3ad5dcf",
    },
    {
      label: "FDA news release — FDA approves new treatment for hypoactive sexual desire disorder in premenopausal women (21 June 2019)",
      url: "https://www.fda.gov/news-events/press-announcements/fda-approves-new-treatment-hypoactive-sexual-desire-disorder-premenopausal-women",
    },
    {
      label: "Kingsberg SA et al. Bremelanotide for the treatment of hypoactive sexual desire disorder: two randomized phase 3 trials. Obstet Gynecol 2019;134:899–908",
    },
    {
      label: "Simon JA et al. Long-term safety and efficacy of bremelanotide for hypoactive sexual desire disorder. Obstet Gynecol 2019;134:909–917",
    },
    {
      label: "Diamond LE et al. Double-blind, placebo-controlled evaluation of the safety, pharmacokinetic properties and pharmacodynamic effects of intranasal PT-141 in healthy males and patients with mild-to-moderate erectile dysfunction. Int J Impot Res 2004;16:51–59",
    },
  ],
};
