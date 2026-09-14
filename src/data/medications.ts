import type { MedicationClassDef, MedicationClassId, MedicationDef } from "./types";

/** Medication classes the rules engine reasons about (Q19). */
export const MEDICATION_CLASSES: MedicationClassDef[] = [
  { id: "insulin", label: "Insulin", examples: "Lantus, NovoRapid, Humalog, Tresiba" },
  { id: "sulfonylurea", label: "Sulfonylurea", examples: "Gliclazide, glimepiride, glipizide" },
  { id: "other_glucose_lowering", label: "Other glucose-lowering medicine", examples: "Metformin, SGLT2 inhibitors, DPP-4 inhibitors" },
  { id: "glp1_agonist", label: "GLP-1 / incretin medicine", examples: "Ozempic, Wegovy, Mounjaro, Saxenda" },
  { id: "anticoagulant", label: "Anticoagulant (blood thinner)", examples: "Warfarin, apixaban, rivaroxaban" },
  { id: "antiplatelet", label: "Antiplatelet", examples: "Aspirin (low dose), clopidogrel" },
  { id: "antihypertensive", label: "Blood pressure medicine", examples: "Ramipril, amlodipine, losartan" },
  { id: "beta_blocker", label: "Beta blocker", examples: "Bisoprolol, propranolol, atenolol" },
  { id: "diuretic", label: "Diuretic", examples: "Furosemide, bendroflumethiazide" },
  { id: "statin", label: "Statin / lipid-lowering", examples: "Atorvastatin, simvastatin" },
  { id: "thyroid_hormone", label: "Thyroid hormone", examples: "Levothyroxine, liothyronine" },
  { id: "corticosteroid", label: "Corticosteroid", examples: "Prednisolone, dexamethasone, hydrocortisone" },
  { id: "oral_contraceptive", label: "Oral contraceptive", examples: "Combined pill, progestogen-only pill" },
  { id: "hrt", label: "Hormone replacement therapy", examples: "Oestrogen, progesterone" },
  { id: "testosterone", label: "Testosterone / anabolic hormone", examples: "Testosterone gel or injection" },
  { id: "growth_hormone", label: "Growth hormone", examples: "Somatropin" },
  { id: "antidepressant", label: "Antidepressant", examples: "Sertraline, fluoxetine, venlafaxine, mirtazapine" },
  { id: "antipsychotic", label: "Antipsychotic / mood stabiliser", examples: "Quetiapine, olanzapine, lithium" },
  { id: "benzodiazepine_sedative", label: "Sedative / sleep medicine", examples: "Diazepam, zopiclone" },
  { id: "antiepileptic", label: "Anti-epileptic", examples: "Lamotrigine, levetiracetam, valproate" },
  { id: "opioid", label: "Opioid painkiller", examples: "Codeine, tramadol, morphine" },
  { id: "stimulant", label: "Stimulant", examples: "Methylphenidate, lisdexamfetamine" },
  { id: "immunosuppressant", label: "Immunosuppressant / biologic", examples: "Methotrexate, tacrolimus, adalimumab" },
  { id: "chemotherapy", label: "Cancer treatment", examples: "Chemotherapy, hormone therapy, immunotherapy" },
  { id: "pde5_inhibitor", label: "Erectile dysfunction medicine", examples: "Sildenafil, tadalafil" },
  { id: "nitrate", label: "Nitrate", examples: "GTN spray, isosorbide mononitrate" },
  { id: "nsaid", label: "Anti-inflammatory painkiller", examples: "Ibuprofen, naproxen, diclofenac" },
  { id: "antihistamine", label: "Antihistamine", examples: "Cetirizine, loratadine, fexofenadine" },
  { id: "acid_reducer", label: "Acid-reducing medicine", examples: "Omeprazole, lansoprazole, famotidine" },
  { id: "antibiotic", label: "Antibiotic", examples: "Amoxicillin, doxycycline" },
  { id: "narrow_therapeutic_index", label: "Narrow-therapeutic-index medicine", examples: "Lithium, digoxin, ciclosporin" },
  { id: "levothyroxine_like", label: "Thyroid hormone (alias)", examples: "Levothyroxine" },
  { id: "other", label: "Other / not sure", examples: "" },
];

export const MEDICATION_CLASS_MAP: Record<MedicationClassId, MedicationClassDef> = Object.fromEntries(
  MEDICATION_CLASSES.map((c) => [c.id, c]),
) as Record<MedicationClassId, MedicationClassDef>;

/**
 * Searchable medication dictionary (generic + brand names → class).
 * Used by the assessment to classify what the user types so the rules
 * engine can reason about interactions. Extend freely.
 */
export const MEDICATIONS: MedicationDef[] = [
  // Diabetes
  { id: "metformin", name: "Metformin", aliases: ["Glucophage"], classId: "other_glucose_lowering" },
  { id: "gliclazide", name: "Gliclazide", aliases: ["Diamicron"], classId: "sulfonylurea" },
  { id: "glimepiride", name: "Glimepiride", aliases: ["Amaryl"], classId: "sulfonylurea" },
  { id: "glipizide", name: "Glipizide", aliases: ["Glucotrol"], classId: "sulfonylurea" },
  { id: "insulin_glargine", name: "Insulin glargine", aliases: ["Lantus", "Toujeo", "Basaglar"], classId: "insulin" },
  { id: "insulin_aspart", name: "Insulin aspart", aliases: ["NovoRapid", "Fiasp"], classId: "insulin" },
  { id: "insulin_lispro", name: "Insulin lispro", aliases: ["Humalog"], classId: "insulin" },
  { id: "insulin_degludec", name: "Insulin degludec", aliases: ["Tresiba"], classId: "insulin" },
  { id: "insulin_generic", name: "Insulin (any)", aliases: ["insulin"], classId: "insulin" },
  { id: "empagliflozin", name: "Empagliflozin", aliases: ["Jardiance"], classId: "other_glucose_lowering" },
  { id: "dapagliflozin", name: "Dapagliflozin", aliases: ["Forxiga", "Farxiga"], classId: "other_glucose_lowering" },
  { id: "sitagliptin", name: "Sitagliptin", aliases: ["Januvia"], classId: "other_glucose_lowering" },
  { id: "pioglitazone", name: "Pioglitazone", aliases: ["Actos"], classId: "other_glucose_lowering" },
  { id: "semaglutide_rx", name: "Semaglutide", aliases: ["Ozempic", "Wegovy", "Rybelsus"], classId: "glp1_agonist" },
  { id: "tirzepatide_rx", name: "Tirzepatide", aliases: ["Mounjaro", "Zepbound"], classId: "glp1_agonist" },
  { id: "liraglutide_rx", name: "Liraglutide", aliases: ["Saxenda", "Victoza"], classId: "glp1_agonist" },
  { id: "dulaglutide", name: "Dulaglutide", aliases: ["Trulicity"], classId: "glp1_agonist" },
  // Anticoagulants / antiplatelets
  { id: "warfarin", name: "Warfarin", aliases: ["Coumadin"], classId: "anticoagulant" },
  { id: "apixaban", name: "Apixaban", aliases: ["Eliquis"], classId: "anticoagulant" },
  { id: "rivaroxaban", name: "Rivaroxaban", aliases: ["Xarelto"], classId: "anticoagulant" },
  { id: "edoxaban", name: "Edoxaban", aliases: ["Lixiana", "Savaysa"], classId: "anticoagulant" },
  { id: "dabigatran", name: "Dabigatran", aliases: ["Pradaxa"], classId: "anticoagulant" },
  { id: "enoxaparin", name: "Enoxaparin", aliases: ["Clexane", "Lovenox"], classId: "anticoagulant" },
  { id: "aspirin", name: "Aspirin", aliases: ["acetylsalicylic acid"], classId: "antiplatelet" },
  { id: "clopidogrel", name: "Clopidogrel", aliases: ["Plavix"], classId: "antiplatelet" },
  // Cardiovascular
  { id: "ramipril", name: "Ramipril", aliases: ["Altace"], classId: "antihypertensive" },
  { id: "lisinopril", name: "Lisinopril", aliases: ["Zestril"], classId: "antihypertensive" },
  { id: "losartan", name: "Losartan", aliases: ["Cozaar"], classId: "antihypertensive" },
  { id: "candesartan", name: "Candesartan", aliases: ["Atacand"], classId: "antihypertensive" },
  { id: "amlodipine", name: "Amlodipine", aliases: ["Norvasc", "Istin"], classId: "antihypertensive" },
  { id: "doxazosin", name: "Doxazosin", aliases: ["Cardura"], classId: "antihypertensive" },
  { id: "bisoprolol", name: "Bisoprolol", aliases: ["Cardicor"], classId: "beta_blocker" },
  { id: "propranolol", name: "Propranolol", aliases: ["Inderal"], classId: "beta_blocker" },
  { id: "atenolol", name: "Atenolol", aliases: ["Tenormin"], classId: "beta_blocker" },
  { id: "metoprolol", name: "Metoprolol", aliases: ["Lopressor"], classId: "beta_blocker" },
  { id: "furosemide", name: "Furosemide", aliases: ["Lasix"], classId: "diuretic" },
  { id: "bendroflumethiazide", name: "Bendroflumethiazide", aliases: [], classId: "diuretic" },
  { id: "spironolactone", name: "Spironolactone", aliases: ["Aldactone"], classId: "diuretic" },
  { id: "atorvastatin", name: "Atorvastatin", aliases: ["Lipitor"], classId: "statin" },
  { id: "simvastatin", name: "Simvastatin", aliases: ["Zocor"], classId: "statin" },
  { id: "rosuvastatin", name: "Rosuvastatin", aliases: ["Crestor"], classId: "statin" },
  { id: "digoxin", name: "Digoxin", aliases: ["Lanoxin"], classId: "narrow_therapeutic_index" },
  { id: "gtn", name: "Glyceryl trinitrate", aliases: ["GTN", "nitroglycerin"], classId: "nitrate" },
  { id: "isosorbide", name: "Isosorbide mononitrate", aliases: ["Imdur"], classId: "nitrate" },
  // Thyroid / hormones
  { id: "levothyroxine", name: "Levothyroxine", aliases: ["Synthroid", "Eltroxin", "thyroxine"], classId: "thyroid_hormone" },
  { id: "liothyronine", name: "Liothyronine", aliases: ["T3", "Cytomel"], classId: "thyroid_hormone" },
  { id: "carbimazole", name: "Carbimazole", aliases: ["methimazole"], classId: "other" },
  { id: "prednisolone", name: "Prednisolone", aliases: ["prednisone"], classId: "corticosteroid" },
  { id: "dexamethasone", name: "Dexamethasone", aliases: [], classId: "corticosteroid" },
  { id: "hydrocortisone", name: "Hydrocortisone", aliases: [], classId: "corticosteroid" },
  { id: "combined_pill", name: "Combined oral contraceptive pill", aliases: ["Microgynon", "Rigevidon", "Yasmin", "the pill"], classId: "oral_contraceptive" },
  { id: "pop", name: "Progestogen-only pill", aliases: ["mini pill", "desogestrel", "Cerazette"], classId: "oral_contraceptive" },
  { id: "hrt_generic", name: "HRT", aliases: ["oestrogen", "estradiol", "Evorel", "Utrogestan"], classId: "hrt" },
  { id: "testosterone", name: "Testosterone", aliases: ["Testogel", "Sustanon", "Nebido", "TRT"], classId: "testosterone" },
  { id: "somatropin_rx", name: "Somatropin (growth hormone)", aliases: ["Genotropin", "Norditropin", "hGH"], classId: "growth_hormone" },
  // Mental health / neuro
  { id: "sertraline", name: "Sertraline", aliases: ["Zoloft", "Lustral"], classId: "antidepressant" },
  { id: "fluoxetine", name: "Fluoxetine", aliases: ["Prozac"], classId: "antidepressant" },
  { id: "citalopram", name: "Citalopram", aliases: ["Cipramil", "Celexa"], classId: "antidepressant" },
  { id: "escitalopram", name: "Escitalopram", aliases: ["Cipralex", "Lexapro"], classId: "antidepressant" },
  { id: "venlafaxine", name: "Venlafaxine", aliases: ["Effexor"], classId: "antidepressant" },
  { id: "duloxetine", name: "Duloxetine", aliases: ["Cymbalta"], classId: "antidepressant" },
  { id: "mirtazapine", name: "Mirtazapine", aliases: ["Remeron"], classId: "antidepressant" },
  { id: "amitriptyline", name: "Amitriptyline", aliases: [], classId: "antidepressant" },
  { id: "bupropion", name: "Bupropion", aliases: ["Wellbutrin", "Zyban"], classId: "antidepressant" },
  { id: "quetiapine", name: "Quetiapine", aliases: ["Seroquel"], classId: "antipsychotic" },
  { id: "olanzapine", name: "Olanzapine", aliases: ["Zyprexa"], classId: "antipsychotic" },
  { id: "aripiprazole", name: "Aripiprazole", aliases: ["Abilify"], classId: "antipsychotic" },
  { id: "lithium", name: "Lithium", aliases: ["Priadel"], classId: "narrow_therapeutic_index" },
  { id: "diazepam", name: "Diazepam", aliases: ["Valium"], classId: "benzodiazepine_sedative" },
  { id: "zopiclone", name: "Zopiclone", aliases: ["Zimovane"], classId: "benzodiazepine_sedative" },
  { id: "lamotrigine", name: "Lamotrigine", aliases: ["Lamictal"], classId: "antiepileptic" },
  { id: "levetiracetam", name: "Levetiracetam", aliases: ["Keppra"], classId: "antiepileptic" },
  { id: "valproate", name: "Sodium valproate", aliases: ["Epilim", "Depakote"], classId: "antiepileptic" },
  { id: "methylphenidate", name: "Methylphenidate", aliases: ["Ritalin", "Concerta"], classId: "stimulant" },
  { id: "lisdexamfetamine", name: "Lisdexamfetamine", aliases: ["Elvanse", "Vyvanse"], classId: "stimulant" },
  // Pain
  { id: "codeine", name: "Codeine", aliases: ["co-codamol"], classId: "opioid" },
  { id: "tramadol", name: "Tramadol", aliases: [], classId: "opioid" },
  { id: "morphine", name: "Morphine", aliases: ["MST", "Oramorph"], classId: "opioid" },
  { id: "oxycodone", name: "Oxycodone", aliases: ["OxyContin"], classId: "opioid" },
  { id: "ibuprofen", name: "Ibuprofen", aliases: ["Nurofen", "Advil"], classId: "nsaid" },
  { id: "naproxen", name: "Naproxen", aliases: ["Naprosyn", "Aleve"], classId: "nsaid" },
  { id: "diclofenac", name: "Diclofenac", aliases: ["Voltarol"], classId: "nsaid" },
  { id: "paracetamol", name: "Paracetamol", aliases: ["acetaminophen", "Tylenol"], classId: "other" },
  // Immune / cancer
  { id: "methotrexate", name: "Methotrexate", aliases: [], classId: "immunosuppressant" },
  { id: "azathioprine", name: "Azathioprine", aliases: ["Imuran"], classId: "immunosuppressant" },
  { id: "tacrolimus", name: "Tacrolimus", aliases: ["Prograf"], classId: "immunosuppressant" },
  { id: "ciclosporin", name: "Ciclosporin", aliases: ["cyclosporine"], classId: "narrow_therapeutic_index" },
  { id: "adalimumab", name: "Adalimumab", aliases: ["Humira"], classId: "immunosuppressant" },
  { id: "tamoxifen", name: "Tamoxifen", aliases: [], classId: "chemotherapy" },
  { id: "letrozole", name: "Letrozole", aliases: ["Femara"], classId: "chemotherapy" },
  { id: "chemo_generic", name: "Chemotherapy (any)", aliases: ["chemotherapy", "immunotherapy"], classId: "chemotherapy" },
  // Sexual health
  { id: "sildenafil", name: "Sildenafil", aliases: ["Viagra"], classId: "pde5_inhibitor" },
  { id: "tadalafil", name: "Tadalafil", aliases: ["Cialis"], classId: "pde5_inhibitor" },
  // GI / allergy
  { id: "omeprazole", name: "Omeprazole", aliases: ["Losec", "Prilosec"], classId: "acid_reducer" },
  { id: "lansoprazole", name: "Lansoprazole", aliases: ["Zoton"], classId: "acid_reducer" },
  { id: "esomeprazole", name: "Esomeprazole", aliases: ["Nexium"], classId: "acid_reducer" },
  { id: "famotidine", name: "Famotidine", aliases: ["Pepcid"], classId: "acid_reducer" },
  { id: "cetirizine", name: "Cetirizine", aliases: ["Zirtek", "Zyrtec"], classId: "antihistamine" },
  { id: "loratadine", name: "Loratadine", aliases: ["Clarityn", "Claritin"], classId: "antihistamine" },
  { id: "fexofenadine", name: "Fexofenadine", aliases: ["Allegra"], classId: "antihistamine" },
  // Antibiotics
  { id: "amoxicillin", name: "Amoxicillin", aliases: [], classId: "antibiotic" },
  { id: "doxycycline", name: "Doxycycline", aliases: [], classId: "antibiotic" },
];

/** Case-insensitive search across generic names and aliases. */
export function searchMedications(query: string, limit = 8): MedicationDef[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const scored = MEDICATIONS.map((m) => {
    const name = m.name.toLowerCase();
    let score = 0;
    if (name.startsWith(q)) score = 3;
    else if (name.includes(q)) score = 2;
    else if (m.aliases.some((a) => a.toLowerCase().startsWith(q))) score = 2;
    else if (m.aliases.some((a) => a.toLowerCase().includes(q))) score = 1;
    return { m, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.m.name.localeCompare(b.m.name));
  return scored.slice(0, limit).map((s) => s.m);
}

export function findMedication(id: string): MedicationDef | undefined {
  return MEDICATIONS.find((m) => m.id === id);
}
