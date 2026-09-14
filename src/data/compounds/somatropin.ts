import type { Compound } from "../types";

/**
 * Somatropin — recombinant human growth hormone. Authorised in all five
 * jurisdictions for specific indications. Claims about healthy-adult use are
 * derived from the systematic reviews and randomised trial listed under
 * `references`; contraindications and interactions follow the product labels.
 */
export const somatropin: Compound = {
  slug: "somatropin",
  name: "Somatropin",
  aliases: [
    "Recombinant human growth hormone",
    "rhGH",
    "hGH",
    "HGH",
    "Genotropin",
    "Norditropin",
    "Humatrope",
    "Omnitrope",
    "Saizen",
    "Zomacton",
    "Nutropin",
    "Serostim",
  ],
  family: "growth_hormone_axis",
  classLabel: "Recombinant human growth hormone",
  tagline: "Prescription growth hormone: proven for deficiency, weak and risky for enhancement",
  summary:
    "Somatropin is recombinant human growth hormone, identical to the 191-amino-acid hormone made by the pituitary. It is authorised in every major jurisdiction as a prescription-only replacement for growth-hormone deficiency in children and adults and for a small number of specific growth disorders. In healthy adults, randomised trials show only small changes in body composition, no gain in strength or performance and a clear excess of adverse effects; in the US, supplying it for anti-ageing or athletic purposes is a federal offence.",
  mechanism:
    "Binds GH receptors on liver, muscle, bone and fat cells, stimulating IGF-1 production and directly promoting fat breakdown, protein synthesis and sodium and water retention. Injected GH produces a sustained, non-pulsatile exposure that suppresses the pituitary's own GH release through somatostatin and IGF-1 feedback, and it antagonises insulin action, raising blood glucose.",
  goals: [
    {
      goal: "muscle_recovery",
      evidence: "limited",
      summary:
        "In healthy older adults (18 randomised trials, 220 GH-treated participants), about 27 weeks of GH increased lean mass by 2.1 kg without improving strength; in young athletes (27 studies, 303 treated), lean mass rose 2.1 kg — largely as extracellular water — with no improvement in strength or exercise capacity.",
    },
    {
      goal: "fat_loss",
      evidence: "limited",
      summary:
        "Fat mass fell by 2.1 kg on average in trials in healthy older adults while weight did not change; in adults with confirmed GH deficiency, replacement reduces visceral fat as a licensed benefit.",
    },
    {
      goal: "athletic_performance",
      evidence: "limited",
      summary:
        "The 2010 Sydney trial of 96 recreational athletes (2 mg daily for eight weeks) improved sprint capacity by 3.9% (8.3% with testosterone) but not endurance, strength or power, and the gain faded within six weeks; GH is prohibited at all times by WADA.",
    },
    {
      goal: "longevity",
      evidence: "insufficient",
      summary:
        "Randomised trials in healthy older adults show no improvement in strength, bone density, lipids or function — only more oedema, joint pain, carpal tunnel syndrome and glucose problems. The Endocrine Society concludes GH cannot be recommended as an anti-ageing therapy, and higher IGF-1 levels have been linked to certain cancers in observational studies.",
    },
  ],
  overallEvidence: "strong",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "authorised",
      summary: "Authorised (MHRA) for GH deficiency and specific growth disorders; prescription-only.",
      detail:
        "Multiple brands (Genotropin, Humatrope, Norditropin, Omnitrope, Saizen, Zomacton, NutropinAq) are licensed for GH deficiency in children and adults, Turner syndrome, chronic kidney disease growth failure, Prader–Willi syndrome, children born small for gestational age and SHOX deficiency. NICE TA64 (adults) and TA188 (children) set the criteria for NHS use. Prescribing for anti-ageing or performance is outside the licence.",
      lastReviewed: "2026-09-01",
    },
    US: {
      status: "authorised",
      summary: "FDA-approved (multiple brands) for GH deficiency and specific indications; prescription-only, with a federal ban on supply for anti-ageing or athletic use.",
      detail:
        "Approved indications include paediatric and adult GH deficiency, Turner syndrome, Prader–Willi syndrome, small-for-gestational-age short stature, idiopathic short stature, SHOX deficiency, Noonan syndrome, chronic kidney disease growth failure, HIV-associated wasting (Serostim) and short bowel syndrome (Zorbtive). Under 21 U.S.C. §333(e), knowingly distributing human growth hormone for any use other than an FDA-authorised medical indication on a physician's order is a federal offence — this specifically covers anti-ageing and athletic enhancement.",
      lastReviewed: "2026-09-01",
    },
    EU: {
      status: "authorised",
      summary: "Authorised centrally (Omnitrope, NutropinAq) and nationally (other brands) for GH deficiency and specific growth disorders; prescription-only.",
      detail: "Omnitrope was the EU's first approved biosimilar (2006). Indications broadly mirror the UK list; national reimbursement rules vary.",
      lastReviewed: "2026-09-01",
    },
    AU: {
      status: "authorised",
      summary: "TGA-registered (multiple brands); prescription-only (Schedule 4) with PBS subsidy restricted to defined criteria.",
      detail: "PBS-subsidised supply runs through the Growth Hormone Programme for paediatric indications and for adults with severe GH deficiency who meet specified criteria.",
      lastReviewed: "2026-09-01",
    },
    CA: {
      status: "authorised",
      summary: "Health Canada-approved (Genotropin, Humatrope, Norditropin, Omnitrope, Saizen and others); prescription-only.",
      lastReviewed: "2026-09-01",
    },
    OTHER: {
      status: "unclear",
      summary: "Authorised in most countries for specific indications; check your national regulator.",
      detail: "Somatropin is approved worldwide, but licensed indications and the legality of off-label supply vary considerably.",
      lastReviewed: "2026-09-01",
    },
  },
  wadaProhibited: true,
  routes: ["subcutaneous"],
  dosingResearch: [
    {
      title: "Systematic review — GH in the healthy elderly",
      citation: "Liu H et al., Ann Intern Med 2007;146:104–115",
      year: 2007,
      phase: "Systematic review of randomised trials",
      design: "31 articles describing 18 randomised controlled trial populations",
      population: "Community-dwelling adults with a mean age of 69 (mean BMI 28) without GH deficiency",
      n: 220,
      duration: "Mean 27 weeks (SD 16)",
      doses: "Mean initial dose 14 µg/kg/day (SD 7), roughly 1 mg/day for an 80 kg adult",
      route: "subcutaneous",
      outcome:
        "Fat mass −2.1 kg and lean mass +2.1 kg versus controls; weight unchanged. No consistent improvement in strength, bone density, lipids (after adjustment) or other clinical outcomes.",
      adverseEvents:
        "Significantly more soft-tissue oedema, arthralgia, carpal tunnel syndrome and gynaecomastia; a non-significant trend to more impaired fasting glucose and new diabetes. Women had more oedema than men.",
      exposure: {
        unit: "mcg/kg",
        frequency: "daily",
        route: "subcutaneous",
        note: "Mean initial dose 14 µg/kg/day (SD 7) across trials; individual trials varied widely",
      },
      url: "https://pubmed.ncbi.nlm.nih.gov/17227934/",
    },
    {
      title: "Systematic review — GH and athletic performance",
      citation: "Liu H et al., Ann Intern Med 2008;148:747–758",
      year: 2008,
      phase: "Systematic review of randomised trials",
      design: "44 articles describing 27 study samples",
      population: "Young (mean age 27), lean, physically fit adults",
      n: 303,
      duration: "Mean 20 days (SD 18) for multi-dose studies; only three studies exceeded 30 days",
      doses: "Mean 36 µg/kg/day (SD 21), roughly 2.5–3 mg/day for an 80 kg adult",
      route: "subcutaneous",
      outcome:
        "Lean body mass +2.1 kg versus controls, but strength and exercise capacity did not improve; exercise lactate levels were higher in two of three studies measuring them.",
      adverseEvents: "Soft-tissue oedema and fatigue were more frequent in GH recipients.",
      exposure: {
        unit: "mcg/kg",
        frequency: "daily",
        route: "subcutaneous",
        note: "Mean 36 µg/kg/day (SD 21) — several times higher than replacement doses used in GH deficiency",
      },
      url: "https://www.acpjournals.org/doi/10.7326/0003-4819-148-10-200805200-00215",
    },
    {
      title: "GH with or without testosterone in recreational athletes",
      citation: "Meinhardt U et al., Ann Intern Med 2010;152:568–577",
      year: 2010,
      phase: "Randomised trial",
      design: "Randomised, double-blind, placebo-controlled; 8 weeks of treatment then 6-week washout",
      population: "Recreationally trained athletes aged about 28 (63 men, 33 women)",
      n: 96,
      duration: "8 weeks",
      doses: "2 mg once daily (men also randomised to testosterone 250 mg weekly intramuscularly or placebo)",
      route: "subcutaneous",
      outcome:
        "GH reduced fat mass and increased lean body mass mainly through extracellular water; sprint capacity rose 3.9% overall and 8.3% with added testosterone, with no change in endurance (VO2max), strength (dead lift) or power (jump height). The sprint gain was no longer present six weeks after stopping.",
      adverseEvents: "Swelling and joint pain were more common with GH; no serious adverse events were reported in the 8-week study.",
      exposure: { doseMin: 2, doseMax: 2, unit: "mg", frequency: "daily", route: "subcutaneous" },
      url: "https://pubmed.ncbi.nlm.nih.gov/20439575/",
    },
  ],
  dosingResearchNote:
    "For comparison, licensed adult GH-deficiency replacement uses much lower, individualised doses: the Endocrine Society guideline (Molitch et al., JCEM 2011) suggests starting at 0.2–0.3 mg/day for adults aged 30–60 (0.1–0.2 mg/day over 60; 0.4–0.5 mg/day under 30), increasing by 0.1–0.2 mg every one to two months to keep IGF-1 within the age-adjusted reference range. The 2–6 mg/day regimens used for enhancement are several times higher and are where oedema, arthralgia and glucose intolerance become common.",
  contraindications: [
    {
      conditionId: "cancer",
      severity: "absolute",
      note: "Contraindicated with any active malignancy; anti-tumour therapy must be complete before treatment. Childhood cancer survivors have a higher rate of second neoplasms on GH, and previous cancer needs oncology review.",
    },
    {
      conditionId: "acromegaly",
      severity: "absolute",
      note: "Adding GH in acromegaly or with an active pituitary tumour is contraindicated.",
    },
    {
      conditionId: "diabetic_retinopathy",
      severity: "absolute",
      note: "Contraindicated in active proliferative or severe non-proliferative diabetic retinopathy.",
    },
    {
      conditionId: "diabetes",
      severity: "caution",
      note: "GH causes insulin resistance and can unmask or worsen diabetes; glucose-lowering medicines often need adjustment and glucose must be monitored.",
    },
    {
      conditionId: "intracranial_hypertension",
      severity: "caution",
      note: "Benign intracranial hypertension (headache, visual disturbance, papilloedema) has been reported, usually early in treatment; previous raised intracranial pressure requires specialist assessment.",
    },
    {
      conditionId: "sleep_apnoea",
      severity: "caution",
      note: "GH can worsen upper-airway obstruction; deaths have occurred in people with Prader–Willi syndrome and severe obesity or respiratory impairment, which is a label contraindication.",
    },
    {
      conditionId: "thyroid",
      severity: "caution",
      note: "GH increases conversion of T4 to T3 and can unmask central hypothyroidism; thyroid function should be checked before and during treatment.",
    },
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "In hypopituitarism, GH increases cortisol clearance and can unmask adrenal insufficiency; glucocorticoid replacement may need adjustment.",
    },
    {
      conditionId: "cardiovascular",
      severity: "caution",
      note: "Fluid retention can worsen heart failure, and GH is contraindicated in acute critical illness (after open-heart or abdominal surgery, multiple trauma or acute respiratory failure) because of increased mortality.",
    },
    {
      conditionId: "hypertension",
      severity: "caution",
      note: "Sodium and water retention can raise blood pressure, particularly at higher doses.",
    },
  ],
  interactions: [
    {
      classId: "corticosteroid",
      severity: "major",
      note: "Glucocorticoids blunt GH's effects, and GH increases cortisol clearance — people on replacement therapy may develop adrenal insufficiency without dose adjustment.",
    },
    {
      classId: "insulin",
      severity: "major",
      note: "GH antagonises insulin; doses usually need adjusting and glucose monitoring is essential.",
    },
    {
      classId: "sulfonylurea",
      severity: "moderate",
      note: "Glucose control may deteriorate; dose review and monitoring advised.",
    },
    {
      classId: "other_glucose_lowering",
      severity: "moderate",
      note: "Glucose-lowering effect may be partly offset; monitoring advised.",
    },
    {
      classId: "hrt",
      severity: "moderate",
      note: "Oral oestrogens blunt IGF-1 generation so women on oral (but not transdermal) oestrogen typically need substantially higher GH doses.",
    },
    {
      classId: "oral_contraceptive",
      severity: "moderate",
      note: "Oral oestrogen-containing contraceptives reduce the IGF-1 response to GH, altering dose requirements.",
    },
    {
      classId: "thyroid_hormone",
      severity: "moderate",
      note: "GH alters thyroid hormone metabolism and can unmask hypothyroidism; levothyroxine doses may need adjustment.",
    },
    {
      classId: "growth_hormone",
      severity: "major",
      note: "Duplicate therapy — including long-acting weekly GH products (somatrogon, somapacitan, lonapegsomatropin).",
    },
    {
      classId: "testosterone",
      severity: "minor",
      note: "Androgens amplify IGF-1 and body-composition responses to GH (as in the Meinhardt trial); combined use outside a licence multiplies adverse-effect risk.",
    },
    {
      classId: "antiepileptic",
      severity: "minor",
      note: "GH can change cytochrome P450 clearance of anticonvulsants; monitoring advised.",
    },
    {
      classId: "narrow_therapeutic_index",
      severity: "minor",
      note: "Clearance of ciclosporin and other CYP450-metabolised narrow-margin medicines may change.",
    },
  ],
  pregnancy: {
    status: "not_recommended",
    note: "Not recommended in pregnancy: placental GH replaces pituitary GH after about 20 weeks, and labels advise stopping if pregnancy occurs. Breastfeeding data are lacking, although GH is unlikely to be absorbed by the infant.",
  },
  commonAdverseEffects: [
    "Peripheral oedema and fluid retention",
    "Joint pain (arthralgia) and stiffness",
    "Muscle pain",
    "Tingling or numbness (paraesthesia) and carpal tunnel syndrome",
    "Headache",
    "Raised blood glucose and insulin resistance",
    "Injection-site reactions and lipoatrophy",
    "Fatigue (reported in athlete trials)",
    "Breast tissue growth in men (gynaecomastia) at higher doses",
  ],
  seriousAdverseEffects: [
    "New-onset type 2 diabetes or glucose intolerance",
    "Benign intracranial hypertension with headache, vomiting and visual disturbance",
    "Worsening of proliferative diabetic retinopathy",
    "Possible growth of existing tumours and second neoplasms in childhood cancer survivors",
    "Increased mortality when given during acute critical illness",
    "Sudden death in Prader–Willi syndrome with severe obesity or respiratory impairment",
    "Unmasking of central hypothyroidism or adrenal insufficiency",
    "Pancreatitis (rare)",
    "Acromegaly-like changes — enlargement of jaw, hands and feet, cardiomyopathy — with prolonged supraphysiological dosing",
  ],
  monitoring: [
    "IGF-1 kept within the age-adjusted reference range, rechecked after every dose change",
    "Fasting glucose and HbA1c at baseline and regularly",
    "Thyroid function before starting and during treatment",
    "Cortisol or adrenal reserve in anyone with pituitary disease",
    "Blood pressure, swelling, joint symptoms and hand tingling",
    "Eye examination if headaches or visual symptoms develop",
    "Age-appropriate cancer screening; lipid profile and bone density in confirmed deficiency",
  ],
  sourceConsiderations: [
    "Prescription-only medicine in every major jurisdiction, requiring a confirmed diagnosis of GH deficiency or another licensed indication.",
    "In the US, distributing GH for anti-ageing or athletic purposes is a federal crime (21 U.S.C. §333(e)); clinics offering 'HGH therapy' without a qualifying diagnosis are operating unlawfully.",
    "Counterfeit and diverted GH is common on the illicit market — vials may contain less GH, none at all, or other hormones; regulators and anti-doping agencies have documented this repeatedly.",
    "GH is a temperature-sensitive protein that needs cold-chain storage; 'HGH' oral sprays, pills and 'releaser' supplements do not contain growth hormone.",
  ],
  clinicianQuestions: [
    "Has GH deficiency actually been confirmed with stimulation testing, or is this based on a single low IGF-1 result?",
    "If I do have deficiency, what starting dose and IGF-1 target will we use, and how often will it be checked?",
    "How will my diabetes, thyroid, steroid or oestrogen medicines be adjusted?",
    "Do I have any cancer history, diabetic eye disease or sleep apnoea that changes the decision?",
    "If the goal is body composition or performance, what does the evidence say I can realistically expect compared with the risks?",
    "Is the product from a licensed pharmacy with an intact cold chain?",
  ],
  alternatives: ["semaglutide", "tirzepatide"],
  stackNotes: [
    {
      with: "tesamorelin",
      evidence: "none",
      overlap: "Duplicate GH-axis stimulation; injected GH suppresses the pituitary response tesamorelin relies on.",
      note: "No rationale or data for combining; IGF-1 and glucose effects would be additive.",
    },
    {
      with: "sermorelin",
      evidence: "none",
      overlap: "Duplicate GH-axis stimulation; exogenous GH suppresses the response to GHRH analogues.",
      note: "No rationale or data for combining.",
    },
    {
      with: "cjc-1295",
      evidence: "none",
      overlap: "Duplicate GH-axis stimulation with days-long additive IGF-1 exposure.",
      note: "No data; CJC-1295 is an unlicensed research chemical.",
    },
    {
      with: "ipamorelin",
      evidence: "none",
      overlap: "Duplicate GH-axis stimulation; exogenous GH suppresses secretagogue responses.",
      note: "No data; ipamorelin is an unlicensed research chemical.",
    },
    {
      with: "igf-1-lr3",
      evidence: "none",
      overlap: "Additive IGF-1 exposure and compounded hypoglycaemia risk.",
      note: "No human data; combines a licensed medicine with an untested laboratory reagent that acts on the same pathway.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      overlap: "Opposing effects on glucose (GH raises it, GLP-1 lowers it) and both are used for body-fat goals.",
      note: "No human studies of the combination; not covered by either licence.",
    },
    {
      with: "bpc-157",
      evidence: "none",
      note: "Marketed together as 'recovery' stacks; no human data for the combination and BPC-157 lacks human efficacy data.",
    },
    {
      with: "tb-500",
      evidence: "none",
      note: "No human data on the combination; TB-500 itself has no human efficacy data.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Recombinant human growth hormone" },
    { label: "Route", value: "Daily subcutaneous injection (weekly long-acting forms exist)" },
    { label: "Licensed for", value: "GH deficiency and specific growth disorders (UK, US, EU, AU, CA)" },
    { label: "Healthy adults", value: "+2.1 kg lean, −2.1 kg fat, no strength gain (n = 220)" },
    { label: "Legal note", value: "WADA-prohibited; US federal offence to supply for anti-ageing or sport" },
  ],
  lastReviewed: "2026-09-01",
  references: [
    { label: "Liu H et al. Systematic review: the safety and efficacy of growth hormone in the healthy elderly. Ann Intern Med 2007", url: "https://pubmed.ncbi.nlm.nih.gov/17227934/" },
    { label: "Liu H et al. Systematic review: the effects of growth hormone on athletic performance. Ann Intern Med 2008", url: "https://www.acpjournals.org/doi/10.7326/0003-4819-148-10-200805200-00215" },
    { label: "Meinhardt U et al. The effects of growth hormone on body composition and physical performance in recreational athletes. Ann Intern Med 2010", url: "https://pubmed.ncbi.nlm.nih.gov/20439575/" },
    { label: "Molitch ME et al. Evaluation and treatment of adult growth hormone deficiency: an Endocrine Society clinical practice guideline. J Clin Endocrinol Metab 2011", url: "https://pubmed.ncbi.nlm.nih.gov/21602453/" },
    { label: "Endocrine Society — Hormones and Aging: Scientific Statement (2023)", url: "https://doi.org/10.1210/clinem/dgad225" },
    { label: "21 U.S.C. §333(e) — Prohibited distribution of human growth hormone", url: "https://www.law.cornell.edu/uscode/text/21/333" },
  ],
};
