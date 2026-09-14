import type { ConditionDef, ConditionId } from "./types";

/**
 * Q16 — structured medical history categories.
 * `base: true` conditions are shown to everyone; `base: false` are shown only
 * when a selected compound references them in `contraindications`.
 */
export const CONDITIONS: ConditionDef[] = [
  { id: "cardiovascular", label: "Cardiovascular disease", hint: "Heart disease, heart failure, arrhythmia, stroke", base: true },
  { id: "hypertension", label: "High blood pressure", base: true },
  { id: "diabetes", label: "Diabetes", hint: "Type 1, type 2 or gestational", base: true },
  { id: "kidney", label: "Kidney disease", base: true },
  { id: "liver", label: "Liver disease", base: true },
  { id: "gallbladder", label: "Gallbladder disease", hint: "Gallstones, cholecystitis", base: true },
  { id: "pancreatic", label: "Pancreatic disease", hint: "Pancreatitis or other pancreatic conditions", base: true },
  { id: "thyroid", label: "Thyroid disease", hint: "Under- or over-active thyroid, nodules, thyroid cancer", base: true },
  { id: "cancer", label: "Cancer", hint: "Any current or previous cancer diagnosis", base: true },
  { id: "clotting", label: "Blood-clotting disorder", hint: "DVT, PE, haemophilia, or you take blood thinners", base: true },
  { id: "gastrointestinal", label: "Gastrointestinal disease", hint: "IBD, coeliac disease, severe reflux, slow stomach emptying", base: true },
  { id: "psychiatric", label: "Mental health condition", hint: "Depression, anxiety, bipolar disorder, eating disorder", base: true },
  { id: "hormonal", label: "Hormonal disorder", hint: "PCOS, pituitary or adrenal conditions, low testosterone", base: true },
  { id: "other", label: "Other significant condition", base: true },

  // Extended — compound-driven
  { id: "mtc_men2", label: "Personal or family history of medullary thyroid cancer or MEN2", base: false },
  { id: "pancreatitis_history", label: "Previous pancreatitis", base: false },
  { id: "gastroparesis", label: "Gastroparesis (slow stomach emptying)", base: false },
  { id: "eating_disorder", label: "Current or previous eating disorder", base: false },
  { id: "diabetic_retinopathy", label: "Diabetic retinopathy (eye disease)", base: false },
  { id: "melanoma_history", label: "Melanoma or atypical moles", base: false },
  { id: "active_infection", label: "Active infection", base: false },
  { id: "sleep_apnoea", label: "Sleep apnoea", base: false },
  { id: "epilepsy", label: "Epilepsy or seizures", base: false },
  { id: "autoimmune", label: "Autoimmune condition", base: false },
  { id: "acromegaly", label: "Acromegaly or pituitary tumour", base: false },
  { id: "intracranial_hypertension", label: "Raised intracranial pressure", base: false },
  { id: "prolactinoma", label: "Prolactinoma", base: false },
];

export const CONDITION_MAP: Record<ConditionId, ConditionDef> = Object.fromEntries(
  CONDITIONS.map((c) => [c.id, c]),
) as Record<ConditionId, ConditionDef>;

export const BASE_CONDITIONS = CONDITIONS.filter((c) => c.base);
