import type { Compound } from "../types";

/**
 * Kisspeptin — an investigational reproductive neuropeptide with genuine but
 * early human research (Imperial College London). Not a medicine anywhere;
 * kisspeptin-10 remains in FDA 503A Category 2 (list updated May 2026) and
 * kisspeptin is named on the WADA 2025 Prohibited List (S2.2.1).
 */
export const kisspeptin: Compound = {
  slug: "kisspeptin",
  name: "Kisspeptin",
  aliases: ["Kisspeptin-10", "Kisspeptin-54", "KP-10", "KP-54", "Metastin", "KISS1 peptide"],
  family: "sexual_health",
  classLabel: "Hypothalamic neuropeptide (KISS1 receptor agonist)",
  tagline: "Investigational reproductive hormone studied for low desire and IVF, not a medicine",
  summary:
    "Kisspeptin is a naturally occurring peptide that sits at the top of the reproductive hormone axis, driving the release of GnRH and therefore LH, FSH and sex steroids. It exists in several lengths (kisspeptin-54 and -10 are the most studied) and is given by intravenous infusion or single injection in clinical research at Imperial College London, where small randomised studies have shown changes in sexual brain processing in men and women with low desire and safe triggering of egg maturation in IVF. It is not authorised anywhere, remains on the FDA's compounding safety-risk list, and is prohibited in sport for men.",
  mechanism:
    "Binds the KISS1 receptor (GPR54) on hypothalamic GnRH neurons, releasing GnRH and so LH and FSH from the pituitary, which in turn raise testosterone or oestradiol. Kisspeptin neurons also project to limbic brain regions, and functional MRI studies suggest direct effects on sexual and emotional processing that are separate from the hormone rise. Continuous high exposure desensitises the receptor and suppresses the axis.",
  goals: [
    {
      goal: "sexual_health",
      evidence: "preliminary",
      summary:
        "In two double-blind crossover studies (32 men and 32 women with hypoactive sexual desire disorder), a 75-minute kisspeptin-54 infusion altered activity in sexual-processing brain regions, increased penile response to erotic videos by up to 56% and modestly improved some self-reported measures, with no adverse effects. These are single-dose mechanistic studies, not treatment trials, and nothing has been tested as a self-injected product.",
    },
    {
      goal: "other",
      evidence: "limited",
      summary:
        "Fertility research: a single subcutaneous kisspeptin-54 injection triggered egg maturation in 95% of 60 women at high risk of ovarian hyperstimulation during IVF, with no moderate or severe hyperstimulation. It is also used as a diagnostic stimulation test in delayed puberty. These are specialist, clinic-based uses under trial protocols.",
    },
    {
      goal: "general_wellbeing",
      evidence: "insufficient",
      summary:
        "Sold online as a 'natural testosterone booster'. Acute kisspeptin doses do raise LH and testosterone for a few hours in research settings, but repeated dosing desensitises the axis and no study has shown improvements in energy, mood, body composition or long-term testosterone.",
    },
  ],
  overallEvidence: "preliminary",
  humanEvidenceLevel: "early_clinical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "No marketing authorisation; used only in ethically approved clinical research.",
      detail:
        "Kisspeptin is administered in the UK solely within MHRA-authorised clinical trials (for example at Imperial College London and Hammersmith Hospital). No licensed medicine contains it, and products sold online as 'kisspeptin-10' are unlicensed medicines.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; kisspeptin-10 remains in 503A Category 2 (significant safety risks).",
      detail:
        "The FDA placed kisspeptin-10 in 503A Category 2 in September 2023, citing insufficient safety information for compounded use, and unlike several other peptides it was still listed there on the May 2026 update — so it cannot be compounded by pharmacies. A synthetic kisspeptin receptor agonist (MVT-602/TAK-448) has been studied in early trials but is not approved.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EMA or national marketing authorisation; investigational only.",
      detail: "No kisspeptin product is authorised in any member state. Online 'research peptide' products are unauthorised medicinal products.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not registered on the ARTG.",
      detail: "No product containing kisspeptin is registered by the TGA; injectable peptides are treated as prescription medicines and unapproved products cannot be lawfully supplied.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "not_authorised",
      summary: "Not authorised by Health Canada.",
      detail: "No Drug Identification Number exists for kisspeptin; unauthorised injectable peptides are unapproved drugs.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "No known approval by any national medicines regulator; check locally.",
      detail: "We are not aware of any country that has authorised kisspeptin for human therapeutic use. Verify with your national regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: true,
  routes: ["intravenous", "subcutaneous"],
  dosingResearch: [
    {
      title: "Kisspeptin-54 infusion in men with hypoactive sexual desire disorder",
      citation: "Thurston L et al., JAMA Netw Open 2023;6(2):e2254313",
      year: 2023,
      phase: "Phase 2 (mechanistic)",
      design: "Randomised, double-blind, placebo-controlled, two-way crossover",
      population: "Heterosexual men (mean age 38) with hypoactive sexual desire disorder",
      n: 32,
      duration: "Two single 75-minute infusions at least 7 days apart",
      doses: "Kisspeptin-54 1 nmol/kg per hour by intravenous infusion for 75 minutes (about 1.25 nmol/kg in total) versus rate-matched placebo",
      route: "intravenous",
      outcome:
        "Kisspeptin modulated activity in sexual-processing brain regions on functional MRI (Cohen d = 0.81), increased penile tumescence in response to erotic videos by up to 56% more than placebo, and increased self-rated 'happiness about sex'.",
      adverseEvents: "Well tolerated; no side effects or adverse events were reported, and blood pressure and heart rate were unchanged.",
      exposure: {
        doseMin: 1,
        doseMax: 1,
        unit: "nmol/kg",
        frequency: "once",
        route: "intravenous",
        note: "1 nmol/kg per hour for 75 minutes under medical supervision; not comparable to self-injection.",
      },
      url: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2800937",
    },
    {
      title: "Kisspeptin-54 infusion in women with hypoactive sexual desire disorder",
      citation: "Thurston L et al., JAMA Netw Open 2022;5(10):e2236131",
      year: 2022,
      phase: "Phase 2 (mechanistic)",
      design: "Randomised, double-masked, placebo-controlled, two-way crossover",
      population: "Premenopausal women (mean age 29) with hypoactive sexual desire disorder",
      n: 32,
      duration: "Two single 75-minute infusions at least one month apart",
      doses: "Kisspeptin-54 1 nmol/kg per hour by intravenous infusion for 75 minutes versus equivalent-rate placebo",
      route: "intravenous",
      outcome:
        "Kisspeptin altered brain responses to erotic videos and attractive faces; women with greater sexual distress showed greater kisspeptin-enhanced hippocampal activity. LH rose by about 2 IU/L; sex-steroid levels did not change during the infusion.",
      adverseEvents: "Well tolerated with no reported adverse effects.",
      exposure: {
        doseMin: 1,
        doseMax: 1,
        unit: "nmol/kg",
        frequency: "once",
        route: "intravenous",
        note: "1 nmol/kg per hour for 75 minutes under medical supervision; not comparable to self-injection.",
      },
      url: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2797718",
    },
    {
      title: "Kisspeptin-54 to trigger egg maturation in IVF (women at high risk of ovarian hyperstimulation)",
      citation: "Abbara A et al., J Clin Endocrinol Metab 2015;100:3322–3331",
      year: 2015,
      phase: "Phase 2",
      design: "Open-label, randomised, adaptive dose-allocation",
      population: "Women undergoing IVF at high risk of ovarian hyperstimulation syndrome",
      n: 60,
      duration: "Single injection; oocyte retrieval 36 hours later",
      doses: "One subcutaneous injection of kisspeptin-54 at 3.2, 6.4, 9.6 or 12.8 nmol/kg after standard ovarian stimulation",
      route: "subcutaneous",
      outcome:
        "Egg maturation occurred in 95% of women; live-birth rate per embryo transfer was 45% overall and 62% at the 9.6 nmol/kg dose.",
      adverseEvents: "No woman developed moderate, severe or critical ovarian hyperstimulation syndrome; the injection was well tolerated.",
      exposure: {
        doseMin: 3.2,
        doseMax: 12.8,
        unit: "nmol/kg",
        frequency: "once",
        route: "subcutaneous",
        note: "Single clinic-administered dose within an IVF protocol.",
      },
      url: "https://doi.org/10.1210/jc.2015-2332",
    },
  ],
  dosingResearchNote:
    "Every human study has used pharmaceutical-grade kisspeptin-54 (or kisspeptin-10 in physiology experiments) given once, in hospital, with hormone monitoring. Research on repeated dosing shows the reproductive axis becomes desensitised within days at higher exposures. There are no studies of the self-injected kisspeptin-10 'libido' or 'testosterone' protocols sold online, and the doses quoted (often 100–200 mcg) bear no relationship to the weight-based nmol/kg regimens used in trials.",
  contraindications: [
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Kisspeptin directly stimulates the pituitary–gonadal axis. Anyone with a pituitary, ovarian or testicular disorder (including PCOS, hypogonadism or on fertility treatment) needs endocrine assessment before any exposure.",
    },
    {
      conditionId: "cancer",
      severity: "caution",
      note: "Acute doses raise testosterone or oestradiol. The effect on hormone-sensitive cancers such as breast or prostate cancer is unknown and potentially unfavourable.",
    },
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "Kisspeptin acts on limbic and emotional brain circuits; its effects in people with active mood disorders have not been studied, and low desire linked to depression or its treatment needs a different approach.",
    },
  ],
  interactions: [
    {
      classId: "testosterone",
      severity: "moderate",
      note: "Exogenous testosterone suppresses the very axis kisspeptin stimulates, so the hormonal effect would be blunted or unpredictable; the combination is unstudied and both are relevant to anti-doping rules.",
    },
    {
      classId: "hrt",
      severity: "moderate",
      note: "Oestrogen or progestogen therapy changes pituitary responsiveness to kisspeptin; no data on combined use.",
    },
    {
      classId: "chemotherapy",
      severity: "moderate",
      note: "Hormonal cancer treatments (GnRH analogues, aromatase inhibitors, anti-androgens, tamoxifen) work by suppressing or blocking the sex-steroid axis; kisspeptin could oppose them. Disclose any use to the oncology team.",
    },
    {
      classId: "oral_contraceptive",
      severity: "minor",
      note: "Hormonal contraception blunts the LH response to kisspeptin in research studies; there is no evidence that kisspeptin reduces contraceptive efficacy, but the combination is unstudied outside trials.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "The placenta produces very large amounts of kisspeptin and the peptide is being studied as a marker of pregnancy complications, but exogenous kisspeptin has only ever been given as a single IVF trigger before conception. There are no data on use during pregnancy or breastfeeding.",
  },
  commonAdverseEffects: [
    "Infusions and single injections in trials: no side effects reported",
    "Transient rise in LH, FSH and sex-steroid levels for several hours",
    "Injection-site reactions (grey-market products)",
    "Possible transient flushing or warmth (occasionally reported in physiology studies)",
  ],
  seriousAdverseEffects: [
    "None reported in published trials (all single, supervised doses)",
    "Desensitisation and suppression of the reproductive axis with repeated high-dose exposure",
    "Theoretical stimulation of hormone-sensitive tumours",
    "Unknown effects of chronic self-administration — never studied",
    "Immune reactions or infection from unregulated injectable products",
  ],
  monitoring: [
    "Reproductive hormones (LH, FSH, testosterone or oestradiol) before and during any exposure",
    "Menstrual cycle regularity in women",
    "Mood and desire using a validated questionnaire rather than impressions",
    "Injection sites for reactions if injected products have been used",
    "Anti-doping status: named on the WADA list for male athletes (S2.2.1)",
  ],
  sourceConsiderations: [
    "No authorised kisspeptin product exists anywhere; the peptide used in trials is manufactured to clinical-trial GMP standards for hospital use only.",
    "Vials sold online as 'kisspeptin-10' are unregulated research chemicals with no assurance of identity, purity, sterility or endotoxin content — and kisspeptin-10 remains on the FDA's Category 2 safety-risk list.",
    "Kisspeptin-10 and kisspeptin-54 have different pharmacokinetics; results from -54 infusion studies cannot be transferred to -10 injections.",
    "The investigational kisspeptin receptor agonist (MVT-602) is not commercially available; products claiming to contain it are suspect.",
  ],
  clinicianQuestions: [
    "Has my low desire been properly assessed — hormones, medicines, mood, relationship factors — before considering any hormonal intervention?",
    "Do I have any hormone-sensitive condition or cancer history that makes stimulating the reproductive axis a concern?",
    "Do I understand that the published studies were single supervised infusions and say nothing about self-injection?",
    "If fertility is the issue, what established treatments should I be considering?",
    "Am I subject to anti-doping rules?",
  ],
  alternatives: ["pt-141"],
  stackNotes: [
    {
      with: "pt-141",
      evidence: "none",
      overlap: "Both act centrally on sexual-desire pathways in the brain.",
      note: "Never studied together. PT-141 is an approved on-demand medicine (in the US); kisspeptin is an investigational infusion. There is no rationale for combining them outside a trial.",
    },
    {
      with: "melanotan-ii",
      evidence: "none",
      overlap: "Both are marketed online for libido.",
      note: "No data on the combination. Melanotan II carries its own serious safety warnings; adding an unstudied hormone-axis stimulant compounds the uncertainty.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      overlap: "Both stimulate pituitary hormone release via hypothalamic pathways.",
      note: "No human data on combining reproductive-axis and growth-hormone-axis secretagogues; both are WADA-prohibited.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      overlap: "Both stimulate pituitary hormone release via hypothalamic pathways.",
      note: "No human data on combining reproductive-axis and growth-hormone-axis secretagogues; both are WADA-prohibited.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Hypothalamic neuropeptide upstream of GnRH" },
    { label: "Human evidence", value: "Single-dose crossover studies (n = 32 each) and a 60-woman IVF trial" },
    { label: "Regulatory status", value: "Investigational; not authorised anywhere; FDA Category 2 (kisspeptin-10)" },
    { label: "Anti-doping", value: "Prohibited at all times in males (WADA S2.2.1)" },
    { label: "Route in studies", value: "Hospital IV infusion or single clinic injection" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    {
      label: "Thurston L et al. Effects of kisspeptin on sexual brain processing and penile tumescence in men with hypoactive sexual desire disorder. JAMA Netw Open 2023;6:e2254313",
      url: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2800937",
    },
    {
      label: "Thurston L et al. Effects of kisspeptin administration in women with hypoactive sexual desire disorder. JAMA Netw Open 2022;5:e2236131",
      url: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2797718",
    },
    {
      label: "Abbara A et al. Efficacy of kisspeptin-54 to trigger oocyte maturation in women at high risk of OHSS during IVF. J Clin Endocrinol Metab 2015;100:3322–3331",
      url: "https://doi.org/10.1210/jc.2015-2332",
    },
    {
      label: "Jayasena CN et al. Kisspeptin-54 triggers egg maturation in women undergoing in vitro fertilization. J Clin Invest 2014;124:3667–3677",
      url: "https://doi.org/10.1172/JCI75730",
    },
    {
      label: "WADA Prohibited List 2025 — S2.2.1 testosterone-stimulating peptides in males, including kisspeptin and its agonist analogues",
      url: "https://www.wada-ama.org/sites/default/files/2024-09/2025list_en_final_clean_12_september_2024.pdf",
    },
    {
      label: "FDA — Bulk drug substances nominated for use in compounding under section 503A (kisspeptin-10 in Category 2, updated May 2026)",
      url: "https://www.fda.gov/media/94155/download",
    },
  ],
};
