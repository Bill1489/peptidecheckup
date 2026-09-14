import type { Compound } from "../types";

/**
 * DSIP (delta sleep-inducing peptide) — endogenous nonapeptide first isolated
 * in 1977. Human data are small 1980s–1990s intravenous studies with mixed
 * results; there are no modern trials and no authorisation anywhere.
 */
export const dsip: Compound = {
  slug: "dsip",
  name: "DSIP",
  aliases: ["Delta sleep-inducing peptide", "Emideltide", "Deltaran", "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu"],
  family: "neuro",
  classLabel: "Endogenous neuropeptide (nonapeptide)",
  tagline: "1970s 'sleep peptide' with small, inconsistent human studies and no modern trials",
  summary:
    "Delta sleep-inducing peptide is a nine-amino-acid peptide isolated in 1977 from the cerebral venous blood of rabbits during electrically induced sleep. A handful of small double-blind studies in the 1980s and early 1990s gave it intravenously to people with insomnia or withdrawal syndromes, with weak and inconsistent effects. No receptor has been identified, no modern randomised trial exists, and it is not authorised as a medicine anywhere.",
  mechanism:
    "Unknown. DSIP crosses the blood–brain barrier and has been reported to modulate slow-wave sleep, stress-hormone release and pain thresholds in animals, but no specific receptor has been identified and later groups struggled to reproduce the original sleep-promoting findings.",
  goals: [
    {
      goal: "sleep",
      evidence: "preliminary",
      summary:
        "Small double-blind studies (6–16 participants) of intravenous DSIP reported modestly higher sleep efficiency and shorter sleep latency in chronic insomnia, but the effects were weak, delayed by about an hour, and the 1992 replication concluded short-term treatment was unlikely to be of major benefit. No study has tested the injectable or nasal products sold today.",
    },
    {
      goal: "general_wellbeing",
      evidence: "insufficient",
      summary:
        "Claims of reduced stress, improved daytime alertness or pain relief rest on 1980s case series and animal work; there is no controlled human evidence for mood, energy or focus.",
    },
  ],
  overallEvidence: "preliminary",
  humanEvidenceLevel: "early_clinical",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised as a medicine; sold only as an unregulated 'research chemical'.",
      detail: "No MHRA marketing authorisation for any indication.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "not_authorised",
      summary: "Not FDA-approved; unapproved drug whose compounding status has been reviewed by the FDA.",
      detail:
        "Emideltide (DSIP) has never been approved by the FDA. It was placed in 503A 'Category 2' (significant safety risk) in September 2023 — the FDA noted immunogenicity and impurity concerns and no safety data for the proposed route — then removed from Category 2 in April 2026 after its nomination was withdrawn. In July 2026 the FDA's Pharmacy Compounding Advisory Committee voted against adding emideltide to the 503A bulks list. Removal from Category 2 does not make a substance eligible for compounding.",
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
      summary: "No marketing authorisation known in any country.",
      detail: "A DSIP-based product ('Deltaran') has been marketed in Russia as a dietary or 'bioregulator' product rather than as a medicine with proven efficacy. Check your national regulator.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: false,
  routes: ["subcutaneous", "intravenous", "intranasal"],
  dosingResearch: [
    {
      title: "Effects of DSIP in man — five double-blind intravenous studies",
      citation: "Schneider-Helmert D, Schoenenberger GA, Neuropsychobiology 1983;9:197–206",
      year: 1983,
      phase: "Early clinical (exploratory)",
      design: "Series of small double-blind, placebo-controlled studies with polysomnography",
      population: "Healthy volunteers and adults with chronic insomnia (groups of roughly 4–6)",
      duration: "Single injections or up to four consecutive daily injections",
      doses: "25 nmol/kg body weight by slow intravenous injection (roughly 2 mg for a 70 kg adult)",
      route: "intravenous",
      outcome:
        "Sleep induction was delayed by about an hour with effects lasting many hours; the authors reported normalisation of disturbed sleep after four consecutive injections in insomniacs and improved daytime alertness. Findings from this single group were not consistently reproduced by others.",
      adverseEvents: "Reported as well tolerated; slow injection was described as essential. Systematic safety reporting was minimal.",
      exposure: { doseMin: 25, doseMax: 25, unit: "nmol/kg", frequency: "daily", route: "intravenous", note: "Intravenous research dosing; not comparable to injected or nasal products sold online" },
      url: "https://doi.org/10.1159/000117964",
    },
    {
      title: "DSIP in chronic insomnia — double-blind matched-pairs study",
      citation: "Bes F et al., Neuropsychobiology 1992;26:193–197",
      year: 1992,
      phase: "Early clinical (exploratory)",
      design: "Double-blind, placebo-controlled, matched-pairs parallel groups with five laboratory nights",
      population: "Adults (34–65 years) with chronic insomnia of at least three years",
      n: 16,
      duration: "3 treatment nights",
      doses: "25 nmol/kg intravenously in the afternoon before each of three consecutive nights, versus glucose placebo",
      route: "intravenous",
      outcome:
        "Higher sleep efficiency and shorter sleep latency versus placebo, but the effects were weak, partly attributable to change in the placebo group, and subjective sleep quality did not improve. The authors concluded short-term DSIP was not likely to be of major therapeutic benefit.",
      adverseEvents: "No adverse effects reported.",
      exposure: { doseMin: 25, doseMax: 25, unit: "nmol/kg", frequency: "daily", route: "intravenous" },
    },
  ],
  dosingResearchNote:
    "All human dosing data are 1980s–1990s intravenous research studies of at most 16 people. Nothing published supports the subcutaneous or nasal 'protocols' (typically 100–300 µg before bed) circulating online; these are a different, unstudied exposure.",
  contraindications: [
    {
      conditionId: "sleep_apnoea",
      severity: "caution",
      note: "Any compound promoted for sedation or deeper sleep warrants caution where sleep apnoea is present or suspected; effects on breathing during sleep have not been studied.",
    },
    {
      conditionId: "psychiatric",
      severity: "caution",
      note: "Depression and other mental-health conditions are common causes of insomnia and need assessment in their own right; DSIP has not been studied in these groups.",
    },
  ],
  interactions: [
    {
      classId: "benzodiazepine_sedative",
      severity: "moderate",
      note: "Interactions are unstudied. Additive central nervous system depression with benzodiazepines, Z-drugs or other sedatives is a theoretical concern.",
    },
    {
      classId: "opioid",
      severity: "moderate",
      note: "Interactions are unstudied. DSIP was historically trialled in opiate withdrawal; combined sedation or respiratory effects with opioids cannot be excluded.",
    },
  ],
  pregnancy: {
    status: "insufficient_data",
    note: "No human or animal reproductive safety data; use in pregnancy or breastfeeding cannot be assessed.",
  },
  commonAdverseEffects: [
    "Drowsiness or grogginess",
    "Headache",
    "Injection-site reactions",
    "Vivid dreams (anecdotal)",
  ],
  seriousAdverseEffects: [
    "Immune reactions to peptide impurities in unregulated products (flagged by the FDA)",
    "Injection-related infection with non-sterile products",
    "Unknown long-term effects — no controlled data beyond a few days of use",
  ],
  monitoring: [
    "Sleep diary or wearable data: sleep latency, night-time waking and total sleep time",
    "Daytime sleepiness and next-day functioning",
    "Breathing during sleep if there are any features of sleep apnoea",
    "Mood, given the overlap between insomnia and depression",
  ],
  sourceConsiderations: [
    "Every product available is an unregulated 'research chemical'; the FDA has specifically flagged immunogenicity and impurity risks for DSIP.",
    "The only human studies used pharmaceutical-grade material given intravenously in a laboratory; vials sold for home injection have no quality assurance.",
    "Labelled quantity and identity of online products are frequently unverified; independent certificates of analysis are rare.",
  ],
  clinicianQuestions: [
    "Has the cause of my poor sleep (sleep apnoea, mood, pain, habits) been properly assessed?",
    "What evidence-based options — cognitive behavioural therapy for insomnia or authorised medicines — should be tried first?",
    "Given that the human studies are decades old and inconsistent, what is realistically known about DSIP's benefits?",
    "How would this interact with my sedatives, painkillers or alcohol use?",
    "What would we monitor, and when would we stop?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "selank",
      evidence: "none",
      overlap: "Both have been associated with sedation or calming.",
      note: "No human data on the combination; overlapping sedative-type effects are a theoretical concern.",
    },
    {
      with: "semax",
      evidence: "none",
      note: "No human data; the compounds are marketed for opposing purposes (sleep versus daytime activation).",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      overlap: "Both are marketed in 'sleep and growth hormone' stacks, since GH release peaks in slow-wave sleep.",
      note: "No human study has tested DSIP with any growth-hormone secretagogue; the sleep rationale is theoretical.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      overlap: "Both are marketed in 'sleep and growth hormone' stacks.",
      note: "No human study has tested DSIP with any growth-hormone secretagogue.",
    },
    {
      with: "epitalon",
      evidence: "none",
      overlap: "Both are marketed for sleep via claimed effects on melatonin or circadian rhythm.",
      note: "No combination data; neither compound has controlled modern human evidence for sleep.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Endogenous nonapeptide, isolated 1977" },
    { label: "Route studied", value: "Intravenous (research only); injected/nasal products unstudied" },
    { label: "Human trials", value: "Small 1980s–1990s studies, largest n = 16" },
    { label: "Authorised", value: "Nowhere" },
    { label: "WADA", value: "Not on the Prohibited List" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Schneider-Helmert D, Schoenenberger GA. Effects of DSIP in man. Neuropsychobiology 1983", url: "https://doi.org/10.1159/000117964" },
    { label: "Bes F et al. Effects of delta sleep-inducing peptide on sleep of chronic insomniac patients: a double-blind study. Neuropsychobiology 1992;26:193–197" },
    { label: "Graf MV, Kastin AJ. Delta-sleep-inducing peptide (DSIP): a review. Neurosci Biobehav Rev 1984", url: "https://doi.org/10.1016/0149-7634(84)90022-8" },
    { label: "FDA — Bulk drug substances that may present significant safety risks (503A Category 2)", url: "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks" },
    { label: "WADA 2026 Prohibited List", url: "https://www.wada-ama.org/en/prohibited-list" },
  ],
};
