import type { Compound } from "../types";

/**
 * Tesamorelin — synthetic GHRH analogue. Claims are derived from the US
 * prescribing information (Egrifta SV / Egrifta WR), the EMA withdrawal
 * documentation and the peer-reviewed trials listed under `references`.
 * Keep language neutral and non-prescriptive.
 */
export const tesamorelin: Compound = {
  slug: "tesamorelin",
  name: "Tesamorelin",
  aliases: ["Egrifta", "Egrifta SV", "Egrifta WR", "TH9507", "Tesa"],
  family: "growth_hormone_axis",
  classLabel: "Synthetic GHRH analogue",
  tagline: "Licensed GHRH analogue that reduces visceral fat in HIV-associated lipodystrophy",
  summary:
    "Tesamorelin is a stabilised synthetic analogue of growth-hormone-releasing hormone (GHRH 1–44) that prompts the pituitary to release the body's own growth hormone. It is approved in the United States and Canada for one narrow indication — reducing excess abdominal (visceral) fat in adults with HIV who have lipodystrophy — on the basis of two 26-week Phase 3 trials. It is not authorised in the UK, EU or Australia, and the US label states that it is not indicated for weight-loss management.",
  mechanism:
    "Binds GHRH receptors on pituitary somatotroph cells, stimulating pulsatile release of endogenous growth hormone, which raises IGF-1 and promotes breakdown of fat, particularly visceral fat. Because release stays under normal feedback control, GH pulsatility is preserved, unlike with injected growth hormone. A trans-3-hexenoic acid modification protects the peptide from rapid enzymatic breakdown.",
  goals: [
    {
      goal: "fat_loss",
      evidence: "moderate",
      summary:
        "In two Phase 3 trials in adults with HIV-associated abdominal fat accumulation (pooled n = 806), 2 mg daily reduced visceral adipose tissue by about 15% relative to placebo at 26 weeks, with no change in subcutaneous fat, and the fat returned within months of stopping. Evidence outside HIV lipodystrophy is limited to one 12-month trial of 60 adults with abdominal obesity, which showed a similar visceral-fat reduction without weight change.",
    },
    {
      goal: "weight_management",
      evidence: "insufficient",
      summary:
        "Body weight was essentially unchanged in the trials — tesamorelin shifts visceral fat rather than reducing overall weight — and the US label states that it is not indicated for weight-loss management.",
    },
    {
      goal: "longevity",
      evidence: "preliminary",
      summary:
        "A 12-month randomised trial in 61 people with HIV and fatty liver disease reduced liver fat by about a third (absolute change −4.1 percentage points versus placebo) and fewer participants progressed in fibrosis. No data exist on cardiovascular events or lifespan, and the label notes that long-term cardiovascular safety has not been established.",
    },
    {
      goal: "muscle_recovery",
      evidence: "insufficient",
      summary:
        "Small gains in lean mass were secondary findings in the HIV trials; there are no studies of strength, recovery or training adaptation in any population.",
    },
  ],
  overallEvidence: "strong",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "not_authorised",
      summary: "Not authorised by the MHRA; no UK marketing authorisation has ever been granted.",
      detail:
        "Tesamorelin has never held a UK licence. Any supply would be an unlicensed import on a named-patient basis under the prescriber's responsibility; vials sold online as 'research chemicals' are not medicines and are not quality-assured.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "authorised",
      summary:
        "FDA-approved (Egrifta SV, Egrifta WR) to reduce excess abdominal fat in HIV-infected adults with lipodystrophy; prescription-only.",
      detail:
        "First approved in November 2010 (Egrifta, 2 mg daily). Egrifta SV (2 mg once daily) and Egrifta WR (1.28 mg once daily, approved March 2025) are the current formulations and are not substitutable. Limitations of use in the label: not indicated for weight-loss management; long-term cardiovascular safety not established. Compounded or 'research-grade' tesamorelin is not FDA-approved.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "not_authorised",
      summary: "No EU marketing authorisation; the application was withdrawn in 2012.",
      detail:
        "Ferrer Internacional withdrew the centralised marketing authorisation application for Egrifta on 21 June 2012 after the CHMP indicated that the data did not allow it to conclude on a positive benefit–risk balance. No subsequent application has been made.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "not_authorised",
      summary: "Not registered on the Australian Register of Therapeutic Goods.",
      detail: "Not TGA-registered. Importation for personal use would require a prescription under the Personal Importation Scheme; 'research chemical' products are not evaluated for quality or safety.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "authorised",
      summary: "Health Canada-approved (Egrifta) for excess abdominal fat in HIV-associated lipodystrophy; prescription-only.",
      detail:
        "Health Canada issued a Notice of Compliance for Egrifta in 2014 for the same indication as in the US. Commercial availability in Canada has been limited; check current supply with a pharmacist.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Approved in only a small number of countries; check your national regulator.",
      detail: "Tesamorelin is authorised in very few jurisdictions outside North America. Verify with your national medicines regulator before assuming legal supply.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: true,
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "Pivotal Phase 3 — tesamorelin in HIV-infected adults with abdominal fat accumulation",
      citation: "Falutz J et al., N Engl J Med 2007;357:2359–2370",
      year: 2007,
      phase: "Phase 3",
      design: "Randomised, double-blind, placebo-controlled",
      population: "Adults with HIV on stable antiretroviral therapy with excess abdominal fat (86% men)",
      n: 412,
      duration: "26 weeks",
      doses: "2 mg once daily",
      route: "subcutaneous",
      outcome:
        "Visceral adipose tissue changed −15.2% with tesamorelin vs +5.0% with placebo; triglycerides fell 50 mg/dL vs a rise of 9 mg/dL; IGF-1 rose 81% vs −5%. No significant differences in glucose measures.",
      adverseEvents:
        "Overall adverse-event rates did not differ significantly, but more tesamorelin participants withdrew because of an adverse event; injection-site reactions, arthralgia and peripheral oedema were the most frequent drug-related events.",
      exposure: { doseMin: 2, doseMax: 2, unit: "mg", frequency: "daily", route: "subcutaneous" },
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa072375",
    },
    {
      title: "Pooled analysis of the two Phase 3 trials with 26-week safety extension",
      citation: "Falutz J et al., J Clin Endocrinol Metab 2010;95:4291–4304",
      year: 2010,
      phase: "Phase 3",
      design: "Pooled analysis of two randomised, double-blind, placebo-controlled trials; re-randomised extension to 52 weeks",
      population: "Adults with HIV-associated abdominal fat accumulation (543 tesamorelin, 263 placebo)",
      n: 806,
      duration: "26 weeks, then 26-week extension",
      doses: "2 mg once daily; at week 26 tesamorelin recipients were re-randomised to continue or switch to placebo",
      route: "subcutaneous",
      outcome:
        "Visceral fat −24 cm² vs +2 cm² at 26 weeks (treatment effect −15.4%); subcutaneous fat unchanged; IGF-1 +108 ng/mL vs +7 ng/mL. Those continuing to 52 weeks kept a −17.5% reduction; those switched to placebo regained visceral fat towards baseline within 13 weeks.",
      adverseEvents:
        "Injection-site reactions (17% vs 6%), arthralgia (13% vs 11%), peripheral oedema (6% vs 2%), myalgia and paraesthesia; hypersensitivity reactions in 4%. HbA1c reached ≥ 6.5% in 5% vs 1% (hazard ratio 3.3). About half of participants developed anti-tesamorelin antibodies without loss of effect.",
      exposure: { doseMin: 2, doseMax: 2, unit: "mg", frequency: "daily", route: "subcutaneous" },
    },
    {
      title: "Tesamorelin for non-alcoholic fatty liver disease in HIV",
      citation: "Stanley TL et al., Lancet HIV 2019;6:e821–e830",
      year: 2019,
      phase: "Phase 2",
      design: "Randomised, double-blind, placebo-controlled, multicentre",
      population: "Adults with HIV and hepatic fat fraction ≥ 5% on MR spectroscopy",
      n: 61,
      duration: "12 months (then 6-month open-label phase)",
      doses: "2 mg once daily",
      route: "subcutaneous",
      outcome:
        "Hepatic fat fraction fell by an absolute 4.1 percentage points more than placebo (37% relative reduction); 35% vs 4% reached a hepatic fat fraction below 5%. Fasting glucose and HbA1c did not differ between groups.",
      adverseEvents: "More localised injection-site complaints with tesamorelin; none judged serious.",
      exposure: { doseMin: 2, doseMax: 2, unit: "mg", frequency: "daily", route: "subcutaneous" },
      url: "https://www.thelancet.com/journals/lanhiv/article/PIIS2352-3018(19)30338-8/fulltext",
    },
  ],
  dosingResearchNote:
    "All efficacy data come from adults with HIV. The newer Egrifta WR formulation delivers 1.28 mg daily and was approved on pharmacokinetic bioequivalence to the original 2 mg dose rather than on new outcome trials.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "absolute",
      note: "Contraindicated with active malignancy — tesamorelin raises GH and IGF-1, which are growth factors. Previous cancer must be inactive with treatment complete, and the label advises stopping if any recurrence is suspected.",
    },
    {
      conditionId: "hormonal",
      severity: "absolute",
      note: "Contraindicated where the hypothalamic–pituitary axis is disrupted (hypopituitarism, pituitary tumour or surgery, head irradiation or head trauma), because it cannot work without a functioning pituitary. Other hormonal disorders need specialist assessment.",
    },
    {
      conditionId: "acromegaly",
      severity: "absolute",
      note: "Stimulating further GH release in acromegaly or with a pituitary tumour is inappropriate; these conditions fall under the label contraindication for pituitary disease.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "Tesamorelin can cause glucose intolerance; in the trials, new HbA1c ≥ 6.5% occurred in 5% vs 1% with placebo. Glucose status should be evaluated before starting and monitored throughout.",
    },
    {
      conditionId: "diabetic_retinopathy",
      severity: "caution",
      note: "Because IGF-1 rises, the label asks for regular retinal monitoring in people with diabetes for development or worsening of retinopathy.",
    },
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "Long-term cardiovascular safety has not been established; fluid retention can occur, and GH-axis stimulation is advised against in acute critical illness (for example after cardiac or abdominal surgery).",
    },
  ],
  interactions: [
    {
      classId: "growth_hormone",
      severity: "major",
      note: "Duplicate GH-axis stimulation: injected growth hormone suppresses the pituitary response that tesamorelin relies on, and IGF-1 exposure becomes additive. No safety data for the combination.",
    },
    {
      classId: "corticosteroid",
      severity: "moderate",
      note: "GH increases cortisol clearance (via 11β-HSD1); people on glucocorticoid replacement may need dose adjustment, and glucocorticoids raise glucose alongside tesamorelin.",
    },
    {
      classId: "insulin",
      severity: "moderate",
      note: "Tesamorelin opposes insulin action; glucose monitoring and possible insulin adjustment are advised.",
    },
    {
      classId: "sulfonylurea",
      severity: "moderate",
      note: "Glucose control may deteriorate; monitoring is advised when starting or stopping tesamorelin.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "minor",
      note: "Glucose-lowering effect may be partly offset; monitoring advised.",
    },
    {
      classId: "hrt",
      severity: "minor",
      note: "Oral oestrogens blunt hepatic IGF-1 generation, which may reduce the response to GH-axis stimulation.",
    },
    {
      classId: "oral_contraceptive",
      severity: "minor",
      note: "Oral oestrogen-containing contraceptives may blunt the IGF-1 response; no formal interaction study.",
    },
    {
      classId: "antiepileptic",
      severity: "minor",
      note: "GH can alter cytochrome P450 clearance of medicines such as anticonvulsants; the label advises monitoring when combined.",
    },
    {
      classId: "narrow_therapeutic_index",
      severity: "minor",
      note: "Clearance of ciclosporin and other CYP450-metabolised narrow-margin medicines may change; closer level monitoring advised.",
    },
  ],
  pregnancy: {
    status: "contraindicated",
    note: "Contraindicated in pregnancy: visceral fat normally increases during pregnancy, modifying it offers no benefit, and animal studies showed fetal harm. Breastfeeding data are lacking; the label advises against use.",
  },
  commonAdverseEffects: [
    "Injection-site reactions (redness, itching, pain, bruising) — about 1 in 6",
    "Joint pain (arthralgia) and limb pain",
    "Peripheral oedema and fluid retention",
    "Muscle aches and stiffness",
    "Tingling or numbness (paraesthesia)",
    "Raised blood glucose",
    "Rash or itching (hypersensitivity in about 4%)",
    "Nausea and vomiting",
    "Night sweats",
  ],
  seriousAdverseEffects: [
    "New-onset diabetes or glucose intolerance (HbA1c ≥ 6.5% in 5% vs 1% with placebo)",
    "Persistent IGF-1 elevation (above 3 standard deviations in about a third at 26 weeks) with unknown long-term effects",
    "Hypersensitivity reactions including urticaria",
    "Carpal tunnel syndrome and other fluid-retention complications",
    "Possible acceleration of an existing malignancy (contraindicated in active cancer)",
    "Worsening of diabetic retinopathy",
    "Increased mortality when GH-axis agents are given during acute critical illness (class warning)",
  ],
  monitoring: [
    "IGF-1 at baseline and periodically — the label suggests reconsidering treatment if levels stay above 3 standard deviations",
    "Fasting glucose and HbA1c before starting and at regular intervals",
    "Retinal examination in anyone with diabetes",
    "Waist circumference or imaging response at 26 weeks — treatment is usually reassessed if visceral fat has not fallen",
    "Swelling, joint pain and hand tingling (fluid retention)",
    "Blood pressure and any symptoms of hypersensitivity",
    "Age- and HIV-appropriate cancer screening",
  ],
  sourceConsiderations: [
    "Prescription-only in the US and Canada and unavailable as a licensed medicine in the UK, EU and Australia — legitimate supply outside North America is effectively limited to unlicensed import under a prescriber.",
    "Two non-substitutable formulations exist (Egrifta SV 2 mg daily; Egrifta WR 1.28 mg daily) with different reconstitution and storage instructions — a common source of dosing confusion.",
    "'Research chemical' tesamorelin vials are not the authorised product, are not tested for identity, sterility or potency, and are frequently mislabelled.",
    "The product requires reconstitution with the supplied bacteriostatic water and correct storage; degraded peptide loses activity.",
  ],
  clinicianQuestions: [
    "Do I meet the licensed indication (HIV-associated lipodystrophy with excess abdominal fat)? If not, what is the legal and evidence basis for using it in my country?",
    "What are my baseline IGF-1, fasting glucose and HbA1c, and how often will they be rechecked?",
    "Do I have any pituitary history, cancer history or diabetic eye disease that rules this out?",
    "How will we judge whether it is working at 26 weeks, and what happens to visceral fat when I stop?",
    "Which formulation and dose is being prescribed, and how is it reconstituted and stored?",
    "Are any of my medicines — steroids, diabetes medicines, oral oestrogen — likely to interact?",
  ],
  alternatives: ["semaglutide", "tirzepatide"],
  stackNotes: [
    {
      with: "sermorelin",
      evidence: "none",
      overlap: "Both are GHRH analogues acting on the same pituitary receptor.",
      note: "Duplicate GHRH stimulation with no human data; there is no rationale for combining two GHRH analogues.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      overlap: "Both are GHRH analogues; CJC-1295 adds days-long receptor stimulation.",
      note: "Duplicate mechanism, no safety data, and CJC-1295 is an unlicensed research chemical.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      overlap: "Both raise GH and IGF-1 via complementary receptors (GHRH and ghrelin receptor).",
      note: "No clinical trials of tesamorelin with any GH secretagogue; additive IGF-1 exposure and glucose effects are expected.",
    },
    {
      with: "somatropin",
      evidence: "none",
      overlap: "Duplicate GH-axis stimulation; injected GH suppresses the pituitary response tesamorelin depends on.",
      note: "No rationale or data for combining; IGF-1 and glucose effects would be additive.",
    },
    {
      with: "igf-1-lr3",
      evidence: "none",
      overlap: "Additive IGF-1 activity from an unlicensed analogue with no human data.",
      note: "No human data; combines a monitored, licensed medicine with an untested laboratory reagent.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Both are used for body-fat goals but act through unrelated mechanisms.",
      note: "No human studies of GHRH analogues combined with GLP-1 medicines; tesamorelin is not licensed for weight loss.",
    },
    {
      with: "tirzepatide",
      evidence: "none",
      overlap: "Both are used for body-fat goals; GH-axis stimulation raises glucose while incretins lower it.",
      note: "No human data on the combination.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "Marketed together as 'recovery' stacks; no human data on the combination and BPC-157 lacks human efficacy data.",
    },
    {
      with: "nad",
      evidence: "none",
      overlap: "Both are promoted for healthy ageing and body composition.",
      note: "No human studies of tesamorelin combined with NAD+ or its precursors.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Synthetic GHRH analogue" },
    { label: "Route", value: "Daily subcutaneous injection" },
    { label: "Licensed for", value: "Visceral fat in HIV-associated lipodystrophy (US, Canada)" },
    { label: "Trial effect", value: "≈ 15% visceral fat reduction at 26 weeks; reverses on stopping" },
    { label: "Not authorised", value: "UK, EU (application withdrawn 2012), Australia" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Falutz J et al. Metabolic effects of a growth hormone-releasing factor in patients with HIV. NEJM 2007", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa072375" },
    { label: "Falutz J et al. Pooled analysis of two Phase 3 trials with safety extension. J Clin Endocrinol Metab 2010;95:4291–4304" },
    { label: "Stanley TL et al. Tesamorelin for NAFLD in HIV. Lancet HIV 2019", url: "https://www.thelancet.com/journals/lanhiv/article/PIIS2352-3018(19)30338-8/fulltext" },
    { label: "Makimura H et al. Tesamorelin in obese adults with reduced GH secretion (12-month RCT). J Clin Endocrinol Metab 2012" },
    { label: "Egrifta WR US Prescribing Information (FDA, March 2025)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/022505s020lbl.pdf" },
    { label: "EMA — Egrifta: withdrawal of the marketing authorisation application (2012)", url: "https://www.ema.europa.eu/en/medicines/human/EPAR/egrifta" },
  ],
};
