import { RESEARCH_USE_LABEL } from "@/lib/brand";
import type { Product } from "./types";

/**
 * Product catalog. Prices in pence, VAT-inclusive.
 * The first three records are the reference records for tone and structure.
 */

export const RX_LABEL =
  "Prescription-only medicine. Not sold directly — supplied by our partner prescriber after an online consultation and prescription.";
export const SUPPLEMENT_LABEL = "Food supplement. Not a medicine. Do not exceed the stated dose.";
export const COSMETIC_LABEL = "Cosmetic product for external use only.";
export const SUPPLIES_LABEL = "General laboratory supplies.";

export const CATALOG: Product[] = [
  {
    id: "prd_bpc157",
    slug: "bpc-157",
    name: "BPC-157",
    subtitle: "Lyophilised · 5 mg or 10 mg vial",
    compoundSlug: "bpc-157",
    category: "peptide",
    channel: "research",
    availability: "in_stock",
    variants: [
      { id: "var_bpc157_5", sku: "PC-BPC-005", label: "5 mg", price: 3495, stock: 120, unitNote: "£6.99 / mg" },
      { id: "var_bpc157_10", sku: "PC-BPC-010", label: "10 mg", price: 5995, compareAtPrice: 6990, stock: 64, unitNote: "£6.00 / mg" },
    ],
    defaultVariantId: "var_bpc157_5",
    form: "Lyophilised powder in a 3 mL borosilicate vial, argon-flushed and crimp-sealed",
    purity: "≥ 99% (HPLC)",
    specs: [
      { label: "Sequence", value: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val" },
      { label: "Molecular weight", value: "1419.5 g/mol" },
      { label: "Form", value: "Acetate salt, lyophilised" },
      { label: "Storage", value: "−20 °C sealed; 2–8 °C after reconstitution" },
      { label: "Solubility", value: "Bacteriostatic water, ≥ 1 mg/mL" },
    ],
    description:
      "Synthetic pentadecapeptide supplied as a lyophilised powder for laboratory research. Each lot is identity-confirmed by LC-MS and purity-tested by HPLC at an independent UK laboratory; the certificate of analysis is published against the batch number printed on the vial.",
    highlights: ["Independent HPLC + LC-MS per batch", "Endotoxin tested", "Argon-flushed, crimp-sealed vial", "Batch CoA published"],
    coa: { batch: "BPC-2609-A", testedOn: "2026-09-02", lab: "Janoshik Analytical", purity: "99.4% (HPLC)", identity: "Confirmed (LC-MS)", endotoxin: "< 0.5 EU/mg" },
    regulatoryLabel: RESEARCH_USE_LABEL,
    goals: ["injury_recovery", "muscle_recovery"],
    tags: ["tissue repair", "bestseller"],
    visual: { format: "vial", tone: "ink", accentText: "BPC-157" },
    featured: true,
    bestseller: true,
    shipping: { weightGrams: 40 },
    lastUpdated: "2026-09-14",
  },
  {
    id: "prd_bacwater",
    slug: "bacteriostatic-water",
    name: "Bacteriostatic water",
    subtitle: "0.9% benzyl alcohol · 10 mL",
    category: "supplies",
    channel: "supplies",
    availability: "in_stock",
    variants: [
      { id: "var_bacwater_10", sku: "PC-SUP-BW10", label: "10 mL", price: 695, stock: 400 },
      { id: "var_bacwater_30", sku: "PC-SUP-BW30", label: "30 mL", price: 1295, stock: 180 },
    ],
    defaultVariantId: "var_bacwater_10",
    form: "Sterile water for reconstitution with 0.9% benzyl alcohol, multi-dose glass vial",
    specs: [
      { label: "Preservative", value: "0.9% benzyl alcohol" },
      { label: "Vial", value: "Type I glass, rubber stopper, flip-off cap" },
      { label: "Shelf life", value: "28 days after first puncture" },
    ],
    description:
      "Multi-dose sterile diluent for reconstituting lyophilised peptides. The benzyl alcohol preservative inhibits bacterial growth for up to 28 days after first use.",
    highlights: ["Sterile, sealed", "28-day multi-dose", "Pairs with any lyophilised vial"],
    regulatoryLabel: SUPPLIES_LABEL,
    goals: [],
    tags: ["supplies", "reconstitution"],
    visual: { format: "vial", tone: "grey", accentText: "BAC H₂O" },
    shipping: { weightGrams: 45 },
    lastUpdated: "2026-09-14",
  },
  {
    id: "prd_semaglutide",
    slug: "semaglutide",
    name: "Semaglutide",
    subtitle: "Prescription-only · weekly injection",
    compoundSlug: "semaglutide",
    category: "peptide",
    channel: "prescription",
    availability: "consultation",
    variants: [{ id: "var_sema_consult", sku: "PC-RX-SEMA", label: "Consultation", price: 0, stock: 0 }],
    defaultVariantId: "var_sema_consult",
    form: "Licensed pre-filled pen (Wegovy), dispensed by a UK-registered pharmacy after prescription",
    specs: [
      { label: "Licence", value: "MHRA-authorised for weight management (Wegovy)" },
      { label: "Route", value: "Subcutaneous, once weekly" },
      { label: "Eligibility", value: "BMI ≥ 30, or ≥ 27 with a weight-related condition" },
      { label: "Supply", value: "Partner prescriber + registered pharmacy" },
    ],
    description:
      "Semaglutide is a licensed medicine and can only be supplied against a prescription. Start an online consultation with our partner prescriber; if it is appropriate for you, the medicine is dispensed by a registered pharmacy with clinical follow-up.",
    highlights: ["Licensed product only", "Clinical eligibility check", "Registered pharmacy dispensing", "Follow-up included"],
    regulatoryLabel: RX_LABEL,
    goals: ["weight_management", "fat_loss"],
    tags: ["GLP-1", "weight"],
    visual: { format: "pen", tone: "cobalt", accentText: "SEMA" },
    featured: true,
    shipping: { weightGrams: 60, coldChain: true },
    lastUpdated: "2026-09-14",
  },
];
