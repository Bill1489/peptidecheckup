import type { Compound } from "../types";

/**
 * Gonadorelin — synthetic gonadotropin-releasing hormone (GnRH), the native
 * hypothalamic decapeptide. Licensed as a single-injection diagnostic test of
 * pituitary gonadotroph function (HRF in the UK; Factrel, discontinued, in the
 * US) and as pulsatile pump therapy for hypothalamic amenorrhoea and
 * hypogonadotropic hypogonadism (Lutrepulse/Lutrelef; discontinued in the US
 * and Canada). Widely compounded in the US as an hCG alternative alongside
 * testosterone therapy — a use with no controlled trials. Regulatory facts
 * checked against the eMC SmPC for HRF (revised August 2022), Drugs@FDA
 * (NDA 018123, NDA 019687), the FDA 503A nominations list (May 2026) and 503B
 * category list (March 2025), the Health Canada Drug Product Database and the
 * WADA 2026 Prohibited List.
 */
export const gonadorelin: Compound = {
  slug: "gonadorelin",
  name: "Gonadorelin",
  aliases: ["GnRH", "LHRH", "Gonadotropin-releasing hormone", "Factrel", "HRF"],
  family: "sexual_health",
  classLabel: "Gonadotropin-releasing hormone (GnRH) decapeptide",
  tagline: "Native GnRH: a licensed pituitary test and pump therapy, compounded off-label with testosterone",
  summary:
    "Gonadorelin is the synthetic form of gonadotropin-releasing hormone (GnRH), the ten-amino-acid hypothalamic hormone that drives the pituitary to release luteinising hormone (LH) and follicle-stimulating hormone (FSH). It has been a licensed medicine for decades — as a single 100 mcg injection to test pituitary gonadotroph function (still authorised in the UK as HRF) and, delivered in pulses every 60–120 minutes by a portable pump, to restore ovulation in hypothalamic amenorrhoea and fertility in hypogonadotropic hypogonadism. The pump products have been withdrawn from the US and Canadian markets for commercial reasons. Its plasma half-life is about four minutes, so how it is given matters: pulses stimulate the axis, whereas continuous or long-acting exposure shuts it down. In the US it is widely compounded and prescribed alongside testosterone therapy to keep the testes signalling — a use supported by physiology and small observational series rather than controlled trials.",
  mechanism:
    "Binds GnRH receptors on pituitary gonadotrophs and triggers release of LH and FSH, which in turn drive testicular testosterone production and spermatogenesis, or ovarian follicle development and oestradiol. Because the receptor desensitises under constant stimulation, only intermittent (pulsatile) exposure maintains gonadotropin output; sustained exposure — the basis of GnRH-agonist treatment for prostate cancer and endometriosis — suppresses the axis. Gonadorelin is cleared within minutes, so a single injection produces a short LH surge and pump therapy has to deliver a pulse roughly every 90 minutes.",
  goals: [
    {
      goal: "sexual_health",
      evidence: "limited",
      summary:
        "Strong evidence exists for pulsatile GnRH in specific diagnoses — a 25-year cohort of 66 women with hypothalamic amenorrhoea achieved a 65.9% live-birth rate per treatment, and a meta-analysis of 420 men with congenital hypogonadotropic hypogonadism found spermatogenesis induced sooner than with gonadotropins. The use most often marketed — injections alongside testosterone therapy to preserve testicular size, fertility or libido — rests on physiology, hCG data and small uncontrolled series; no randomised trial of gonadorelin for this purpose has been published, and it does not treat erectile dysfunction or low desire directly.",
    },
    {
      goal: "general_wellbeing",
      evidence: "insufficient",
      summary:
        "Any effect on energy, mood or wellbeing would be indirect, through restored gonadotropin and sex-steroid output in someone whose axis is suppressed or deficient. No trial has measured wellbeing outcomes with gonadorelin, and in people with a normal axis there is no reason to expect a benefit.",
    },
    {
      goal: "longevity",
      evidence: "insufficient",
      summary:
        "Marketed as 'hormone optimisation' for ageing men. There are no human data linking gonadorelin to healthspan, body composition or any ageing outcome, and the age-related fall in testosterone is mostly testicular rather than hypothalamic, which limits what a GnRH signal can restore.",
    },
  ],
  overallEvidence: "moderate",
  humanEvidenceLevel: "approved_medicine",
  regulatory: {
    UK: {
      status: "authorised",
      summary: "Authorised (MHRA) as a 100 mcg diagnostic injection (HRF); prescription-only. Not licensed for any treatment use.",
      detail:
        "Gonadorelin 100 micrograms powder for solution for injection (HRF 100 microgram; PL 17509/0005, Esteve Pharmaceuticals) is licensed as a single subcutaneous or intravenous injection to evaluate the response of the pituitary gonadotrophs, and is listed on the eMC with an SmPC revised in August 2022. No UK product is licensed for pulsatile-pump therapy or for use alongside testosterone; such use would be off-label or with an unlicensed import, and gonadorelin sold online as a 'research peptide' is an unlicensed medicine.",
      lastReviewed: "2026-09-26",
    },
    US: {
      status: "not_authorised",
      summary: "Both FDA-approved products (Factrel, Lutrepulse) are discontinued; widely compounded on prescription, especially with testosterone therapy.",
      detail:
        "Factrel (gonadorelin hydrochloride, NDA 018123) was approved as a diagnostic for pituitary gonadotropin response and Lutrepulse (gonadorelin acetate, NDA 019687) for pulsatile treatment of primary hypothalamic amenorrhoea; Drugs@FDA lists every strength of both as discontinued. Because gonadorelin was a component of approved drugs and is not on the list of drugs withdrawn for safety reasons, 503A pharmacies may compound it against individual prescriptions, and gonadorelin acetate appears in 503B Category 1 (bulk substances under evaluation for outsourcing facilities; list updated March 2025), so 503B facilities may also use it under the FDA's interim policy. It does not appear anywhere on the 503A nominations list (May 2026). Compounded gonadorelin — commonly prescribed with testosterone as an alternative to hCG — is not FDA-approved for that or any other use, and has not been evaluated by the FDA for safety or effectiveness.",
      lastReviewed: "2026-09-26",
    },
    EU: {
      status: "unclear",
      summary: "No centrally authorised product; national licences for diagnostic injection and pulsatile-pump therapy exist in some member states.",
      detail:
        "Gonadorelin has never been through the EMA's centralised procedure. Diagnostic gonadorelin injections and Ferring's pulsatile-pump product (Lutrelef) hold national authorisations in some countries — the Swiss and German-speaking centres that publish on pump therapy use Lutrelef — while other member states have no licensed product. Status, brand and indication therefore vary; check the national register. Off-label use with testosterone is not covered by any EU licence.",
      lastReviewed: "2026-09-26",
    },
    AU: {
      status: "not_authorised",
      summary: "No human gonadorelin product registered on the ARTG as far as we can establish; veterinary products are APVMA-registered; compounded on prescription by some pharmacies.",
      detail:
        "Gonadorelin is registered in Australia for cattle (for example Gonabreed, Fertagyl). We could find no human product on the Australian Register of Therapeutic Goods. Compounding pharmacies supply gonadorelin against individual prescriptions, but compounded products are not evaluated by the TGA, and the TGA has taken compliance action against online advertising and supply of unapproved peptides.",
      lastReviewed: "2026-09-26",
    },
    CA: {
      status: "not_authorised",
      summary: "No marketed human product: Factrel, Lutrepulse and Relisorm have all been cancelled; several veterinary products remain on the market.",
      detail:
        "The Health Canada Drug Product Database shows every human gonadorelin product as cancelled — Factrel (Wyeth-Ayerst) in the 1990s, Relisorm (EMD Serono) in 2019 and Lutrepulse 0.8 mg (Ferring) on 24 December 2024, with the remaining Lutrepulse listing dormant since 2017. Veterinary gonadorelin products (Factrel for cattle, Fertiline, Gonabreed, Ovarelin, Gonavet, Fertagyl 2) are marketed. Any human supply would be a pharmacy compounded preparation or an import under the Special Access Programme.",
      lastReviewed: "2026-09-26",
    },
    OTHER: {
      status: "unclear",
      summary: "Licensed in some countries as a diagnostic or pump therapy; veterinary products are widespread; check your national regulator.",
      detail: "Pulsatile GnRH pumps using gonadorelin acetate are in routine clinical use in China, where most recent outcome studies originate. Elsewhere availability ranges from a licensed diagnostic to nothing at all. Verify with your national medicines regulator.",
      lastReviewed: "2026-09-26",
    },
  },
  wadaProhibited: true,
  routes: ["subcutaneous", "intravenous", "intranasal"],
  dosingResearch: [
    {
      title: "Pulsatile subcutaneous GnRH for ovulation induction in functional hypothalamic amenorrhoea — 25-year single-centre cohort",
      citation: "Quaas P et al., J Assist Reprod Genet 2022;39:2729–2736",
      year: 2022,
      phase: "Observational",
      design: "Retrospective cohort (1996–2020) with a matched control group for birth weight",
      population: "Infertile women with functional hypothalamic amenorrhoea",
      n: 66,
      duration: "212 ovulation-induction cycles across 82 treatments",
      doses: "10 mcg gonadorelin (Lutrelef) subcutaneously every 90 minutes by portable pump",
      route: "subcutaneous",
      outcome:
        "Ovulation in 96% of cycles, monofollicular in 75%; live-birth rate 65.9% per treatment; cumulative clinical pregnancy rate 74.4%; one twin pregnancy (1.6%); newborn birth weight comparable to controls.",
      adverseEvents: "Miscarriage rate 11.5%; no ovarian hyperstimulation syndrome reported; local pump-site problems were not systematically recorded.",
      exposure: {
        doseMin: 10,
        doseMax: 10,
        unit: "mcg",
        frequency: "other",
        route: "subcutaneous",
        note: "one 10 mcg pulse every 90 minutes (about 16 pulses a day) for the duration of each cycle",
      },
      url: "https://doi.org/10.1007/s10815-022-02656-0",
    },
    {
      title: "Pulsatile GnRH pump in adult men with congenital hypogonadotropic hypogonadism — medium-term outcomes",
      citation: "Jiang H et al., Transl Androl Urol 2025;14:2043–2058",
      year: 2025,
      phase: "Observational",
      design: "Retrospective single-centre cohort with 6-, 12- and 24-month assessments",
      population: "Adult men with congenital hypogonadotropic hypogonadism",
      n: 54,
      duration: "Mean follow-up 15.9 months (range 3–40)",
      doses:
        "Gonadorelin acetate 10 mcg per pulse every 90 minutes subcutaneously (16 pulses/24 h), increased in 5 mcg steps according to LH, FSH and testosterone; a single 100 mcg intravenous dose was used for the baseline stimulation test",
      route: "subcutaneous",
      outcome:
        "Mean testicular volume rose from 3.2 mL to 9.7 mL and serum testosterone from 48 to 381 ng/dL at two years, with further gains between 6 and 24 months. Of the men treated for more than six months, 27 (79.4%) produced sperm, first appearing after about six months on average.",
      adverseEvents: "No infusion-related complications reported; the study was retrospective and not designed to capture adverse events systematically.",
      exposure: {
        doseMin: 10,
        doseMax: 20,
        unit: "mcg",
        frequency: "other",
        route: "subcutaneous",
        note: "one pulse every 90 minutes by pump, titrated in 5 mcg increments",
      },
      url: "https://doi.org/10.21037/tau-2025-199",
    },
  ],
  dosingResearchNote:
    "Every controlled or cohort study of gonadorelin uses one of two regimens: a single 100 mcg injection as a diagnostic test, or micro-pulses of 5–20 mcg every 60–120 minutes from a programmable pump. The compounded regimens marketed with testosterone therapy — typically 100–200 mcg injected once or twice a day, or several times a week — have no published trial behind them and are not pulsatile in the physiological sense; with a four-minute half-life each injection produces a brief LH surge rather than sustained signalling, and the dose–response for testicular preservation has never been established.",
  contraindications: [
    {
      conditionId: "hormonal",
      severity: "caution",
      note: "Gonadorelin only works if the pituitary can respond: it is ineffective in primary (testicular or ovarian) failure and in pituitary disease, and pointless where the axis is intact. Pituitary tumours, hyperprolactinaemia, PCOS and any unexplained hormonal disorder need specialist assessment first, and any use with testosterone therapy should be supervised by the prescriber managing that therapy.",
    },
    {
      conditionId: "cancer",
      severity: "caution",
      note: "Stimulating LH, FSH and sex-steroid output is a theoretical concern in hormone-sensitive cancers — prostate, breast, ovarian and endometrial — where the standard treatment is to suppress exactly this axis. A current or previous hormone-sensitive cancer needs oncology input before any GnRH stimulation.",
    },
  ],
  interactions: [
    {
      classId: "testosterone",
      severity: "moderate",
      note: "Exogenous testosterone suppresses hypothalamic GnRH and pituitary LH/FSH; gonadorelin is prescribed alongside it precisely to counter that. The combination has no controlled trial data, changes the testosterone and oestradiol levels the prescriber is monitoring, and should only be run under the supervision of whoever manages the testosterone.",
    },
    {
      classId: "hrt",
      severity: "moderate",
      note: "Oestrogen and progestogen feed back on the pituitary and blunt the gonadotropin response, so gonadorelin's effect — and the diagnostic test result — is altered; combined use has no evidential basis outside fertility clinics.",
    },
    {
      classId: "oral_contraceptive",
      severity: "minor",
      note: "Hormonal contraception suppresses the gonadotropin response and defeats the purpose of pulsatile GnRH; the diagnostic test is not interpretable on the pill. No safety interaction, but no rationale for combining them either.",
    },
  ],
  pregnancy: {
    status: "contraindicated",
    note: "The UK licence lists known or suspected pregnancy as a contraindication and states that gonadorelin should not be given to pregnant women or nursing mothers; pump therapy for ovulation induction is stopped as soon as pregnancy is confirmed. There is no reason to use gonadorelin in pregnancy or while breastfeeding.",
  },
  commonAdverseEffects: [
    "Injection- or pump-site pain, redness, itching or induration",
    "Headache",
    "Nausea and abdominal discomfort",
    "Flushing, light-headedness or a fast heartbeat (rare in the licensed diagnostic use)",
    "Transient rise in LH, FSH and sex steroids — oestradiol-related effects (breast tenderness, mood change) in some men",
    "Acne or oily skin with rising testosterone",
  ],
  seriousAdverseEffects: [
    "Allergic and anaphylactoid reactions (reported with both the diagnostic test and pump therapy; more frequent than with gonadotropins in the male CHH meta-analysis)",
    "Multiple pregnancy and ovarian hyperstimulation during ovulation induction (low with pulsatile GnRH, but not zero)",
    "Paradoxical suppression of the axis if exposure is continuous or too frequent — the opposite of the intended effect",
    "Stimulation of a hormone-sensitive tumour (theoretical)",
    "Antibody formation against the peptide with repeated exposure (rare in the licence)",
    "Infection, abscess or sepsis from a pump or injection site, particularly with non-sterile compounded products (sepsis is listed in the UK licence with unknown frequency)",
  ],
  monitoring: [
    "LH, FSH and total testosterone (or oestradiol and follicle tracking in women), before starting and during use — the response is the only evidence it is working",
    "Semen analysis or testicular volume if fertility or testicular size is the goal",
    "Oestradiol and haematocrit when combined with testosterone therapy",
    "Pump or injection sites for reactions and infection",
    "Prostate symptoms and PSA in men over 40, as with any testosterone-raising treatment",
    "Anti-doping status: prohibited at all times for male athletes (WADA S2.2.1)",
  ],
  sourceConsiderations: [
    "Licensed gonadorelin exists — the UK diagnostic injection and national pump products in parts of Europe — but only as prescription medicines for specific indications; nothing sold for use alongside testosterone is an authorised product.",
    "US compounded gonadorelin is legal to compound and comes from state-licensed 503A pharmacies or 503B outsourcing facilities; it is not FDA-approved and quality varies with the compounder.",
    "'Research' vials and pens sold online fall outside every medicines quality system; identity, content and sterility rest on the vendor's certificate.",
    "The licensed product is a powder that is reconstituted immediately before use and discarded after 24 hours; a pre-filled aqueous pen relies on the manufacturer's own stability data, which should be requested.",
    "Veterinary gonadorelin (for cattle) is the same molecule but is formulated and tested for animals; it is not a legitimate human supply.",
  ],
  clinicianQuestions: [
    "Is my hypothalamic–pituitary axis actually suppressed or deficient, and has that been shown with blood tests rather than assumed?",
    "If I am on testosterone therapy and want to preserve fertility or testicular size, how do gonadorelin, hCG and a break from testosterone compare in evidence and in what you have seen in practice?",
    "How will you check that it is working — which hormones, how often — and what result would make us stop?",
    "Do I have any hormone-sensitive condition, or a family history of prostate or breast cancer, that makes stimulating this axis a concern?",
    "If I compete in tested sport, do you understand that gonadorelin is prohibited at all times for men?",
  ],
  alternatives: [],
  stackNotes: [
    {
      with: "pt-141",
      evidence: "none",
      overlap: "Both are sold for sexual health, but gonadorelin acts on the hormonal axis while PT-141 acts on brain melanocortin receptors.",
      note: "No study has combined them. They address different problems — hormonal signalling versus desire — and there is no rationale or safety data for using both.",
    },
    {
      with: "tesamorelin",
      evidence: "none",
      overlap: "Both are hypothalamic releasing-hormone analogues (GnRH and GHRH) acting on different pituitary cells.",
      note: "Marketed together in 'hormone optimisation' protocols. No human data on the combination; each stimulates a separate pituitary axis and there is no reason to expect one to help the other.",
    },
    {
      with: "semaglutide",
      evidence: "none",
      note: "No human data on the combination. Weight loss with a GLP-1 medicine can itself raise testosterone in men with obesity, which complicates interpreting any gonadorelin effect.",
    },
  ],
  keyFacts: [
    { label: "Class", value: "Synthetic native GnRH (10 amino acids)" },
    { label: "Licensed uses", value: "Pituitary function test (UK: HRF); pulsatile pump for amenorrhoea and hypogonadotropic hypogonadism (some countries)" },
    { label: "Half-life", value: "About 4 minutes — pulses stimulate, continuous exposure suppresses" },
    { label: "Use with testosterone", value: "Compounded in the US; no controlled trials" },
    { label: "Anti-doping", value: "Prohibited at all times in males (WADA S2.2.1)" },
  ],
  lastReviewed: "2026-09-26",
  references: [
    {
      label: "Gonadorelin 100 micrograms powder for solution for injection (HRF 100 microgram) — Summary of Product Characteristics, Esteve Pharmaceuticals (eMC, revised August 2022)",
      url: "https://www.medicines.org.uk/emc/product/4853/smpc",
    },
    {
      label: "Leyendecker G, Wildt L, Hansmann M. Pregnancies following chronic intermittent (pulsatile) administration of Gn-RH by means of a portable pump ('Zyklomat') — a new approach to the treatment of infertility in hypothalamic amenorrhea. J Clin Endocrinol Metab 1980;51:1214–1216",
      url: "https://doi.org/10.1210/jcem-51-5-1214",
    },
    {
      label: "Wei C et al. Spermatogenesis of male patients with congenital hypogonadotropic hypogonadism receiving pulsatile gonadotropin-releasing hormone therapy versus gonadotropin therapy: a systematic review and meta-analysis. World J Mens Health 2021;39:654–665",
      url: "https://doi.org/10.5534/wjmh.200043",
    },
    {
      label: "Quaas P et al. Use of pulsatile gonadotropin-releasing hormone (GnRH) in patients with functional hypothalamic amenorrhea (FHA) results in monofollicular ovulation and high cumulative live birth rates: a 25-year cohort. J Assist Reprod Genet 2022;39:2729–2736",
      url: "https://doi.org/10.1007/s10815-022-02656-0",
    },
    {
      label: "Jiang H et al. Therapeutic effects of a pulsatile GnRH pump on adult male patients with congenital hypogonadotropic hypogonadism (CHH): a retrospective study. Transl Androl Urol 2025;14:2043–2058",
      url: "https://doi.org/10.21037/tau-2025-199",
    },
    {
      label: "Cretu AM et al. Emerging peptide and neuroendocrine strategies for TRT-induced reproductive suppression and functional male hypogonadism: a narrative review. Front Reprod Health 2026;8:1914709",
      url: "https://doi.org/10.3389/frph.2026.1914709",
    },
    {
      label: "Filicori M. Pulsatile gonadotropin-releasing hormone: clinical applications of a physiologic paradigm. F S Rep 2023;4(2 Suppl):20–26",
      url: "https://doi.org/10.1016/j.xfre.2023.01.007",
    },
    {
      label: "Drugs@FDA — Factrel (gonadorelin hydrochloride), NDA 018123; Lutrepulse (gonadorelin acetate), NDA 019687 — all strengths listed as discontinued",
      url: "https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=018123",
    },
    {
      label: "FDA — Bulk drug substances nominated for use in compounding under section 503B (gonadorelin acetate in 503B Category 1; updated March 2025)",
      url: "https://www.fda.gov/media/94164/download",
    },
    {
      label: "World Anti-Doping Agency — 2026 Prohibited List, S2.2.1 testosterone-stimulating peptides in males (GnRH, gonadorelin)",
      url: "https://www.wada-ama.org/sites/default/files/2025-09/2026list_en_final_clean_september_2025.pdf",
    },
  ],
};
