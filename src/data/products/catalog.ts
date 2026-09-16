import { RESEARCH_USE_LABEL } from "@/lib/brand";
import type { Product } from "./types";

/**
 * Aervyn product catalogue — six pre-filled, dose-dial peptide pens (3 mL).
 * Prices in pence, VAT-inclusive. PRICES ARE PLACEHOLDERS pending the client's
 * price list. Photography lives in /public/products.
 */

export const RX_LABEL =
  "Prescription-only medicine. Not sold directly — supplied by our partner prescriber after an online consultation and prescription.";
export const NOT_SOLD_LABEL = "Listed for information only. Aervyn does not sell this compound.";
export const SUPPLEMENT_LABEL = "Food supplement. Not a medicine. Do not exceed the stated dose.";
export const COSMETIC_LABEL = "Cosmetic product for external use only.";
export const SUPPLIES_LABEL = "General laboratory supplies.";

const PEN_STORAGE = "Refrigerate at 2–8 °C. Do not freeze. Keep the cap on and the pen out of direct light between uses.";
const PEN_DIALING = "Dose-dial pen with a numbered window; the dial sets the volume delivered per actuation.";
const IN_THE_BOX = "1 × pre-filled 3 mL pen · lot-numbered outer carton · certificate of analysis · pen-needle compatibility note";

export const CATALOG: Product[] = [
  /* ------------------------------------------------------------------ */
  /* Tesamorelin — visceral fat / body composition                       */
  /* ------------------------------------------------------------------ */
  {
    id: "prd_tesamorelin_pen",
    slug: "tesamorelin",
    name: "Tesamorelin",
    subtitle: "Peptide pen · 20 mg / 3 mL",
    compoundSlug: "tesamorelin",
    category: "peptide",
    channel: "research",
    availability: "in_stock",
    variants: [
      { id: "var_tes_1", sku: "AV-TES-20-1", label: "1 pen · 20 mg", price: 14900, stock: 60 },
      { id: "var_tes_2", sku: "AV-TES-20-2", label: "2 pens · 40 mg", price: 27400, compareAtPrice: 29800, stock: 30, unitNote: "Save £24" },
    ],
    defaultVariantId: "var_tes_1",
    form: "Pre-filled multi-dose pen, 3 mL, dose-dial, 20 mg tesamorelin in solution",
    purity: "≥ 99% (HPLC)",
    specs: [
      { label: "Contents", value: "Tesamorelin 20 mg in 3 mL" },
      { label: "Concentration", value: "6.7 mg/mL" },
      { label: "Class", value: "GHRH analogue (44 amino acids, stabilised)" },
      { label: "Format", value: "Pre-filled dose-dial pen" },
      { label: "Storage", value: PEN_STORAGE },
      { label: "In the box", value: IN_THE_BOX },
    ],
    description:
      "Tesamorelin is a stabilised analogue of growth-hormone-releasing hormone. It is the most-studied compound in the Aervyn range: a licensed version (Egrifta) is approved in the US for reducing excess abdominal fat in HIV-associated lipodystrophy, and the trial programme behind it is the basis of the evidence record linked below. The Aervyn pen is supplied for research use as a pre-filled 3 mL dose-dial pen — no reconstitution, no vials, no drawing up.",
    highlights: [
      "Pre-filled pen — no reconstitution",
      "Identity confirmed by LC-MS per lot",
      "Purity ≥ 99% by HPLC",
      "Certificate published against the lot number",
    ],
    coa: {
      batch: "AV-TES-2609-A",
      testedOn: "2026-09-03",
      lab: "Janoshik Analytical",
      purity: "99.3% (HPLC)",
      identity: "Confirmed (LC-MS)",
      endotoxin: "< 0.5 EU/mg",
    },
    regulatoryLabel: RESEARCH_USE_LABEL,
    goals: ["fat_loss", "weight_management", "longevity"],
    tags: ["visceral fat", "body composition", "GHRH", "bestseller"],
    visual: { format: "pen", tone: "white", accentText: "TESA", color: "#c8202f" },
    images: [
      { src: "/products/tesamorelin-box.jpg", alt: "Aervyn Tesamorelin peptide pen, 20 mg / 3 mL, with its carton", kind: "pack", width: 853, height: 1024 },
      { src: "/products/tesamorelin-hand.jpg", alt: "Aervyn Tesamorelin pen held in a hand", kind: "hand", width: 819, height: 1024 },
    ],
    pen: {
      volumeMl: 3,
      totalMg: 20,
      concentration: "6.7 mg/mL",
      composition: "Tesamorelin 20 mg",
      storage: PEN_STORAGE,
      dialing: PEN_DIALING,
    },
    bestFor: "Stubborn abdominal fat and body composition — the compound with the strongest human evidence in the range.",
    matchFor: [
      "Belly fat that does not move with diet and training",
      "Body composition rather than scale weight",
      "Wanting the compound with the most human trial data",
    ],
    featured: true,
    bestseller: true,
    shipping: { weightGrams: 90, coldChain: true },
    lastUpdated: "2026-09-16",
  },

  /* ------------------------------------------------------------------ */
  /* MOTS-c — metabolic energy / endurance / longevity                   */
  /* ------------------------------------------------------------------ */
  {
    id: "prd_motsc_pen",
    slug: "mots-c",
    name: "MOTS-C",
    subtitle: "Peptide pen · 60 mg / 3 mL",
    compoundSlug: "mots-c",
    category: "peptide",
    channel: "research",
    availability: "in_stock",
    variants: [
      { id: "var_mots_1", sku: "AV-MOT-60-1", label: "1 pen · 60 mg", price: 12900, stock: 45 },
      { id: "var_mots_2", sku: "AV-MOT-60-2", label: "2 pens · 120 mg", price: 23800, compareAtPrice: 25800, stock: 20, unitNote: "Save £20" },
    ],
    defaultVariantId: "var_mots_1",
    form: "Pre-filled multi-dose pen, 3 mL, dose-dial, 60 mg MOTS-c in solution",
    purity: "≥ 99% (HPLC)",
    specs: [
      { label: "Contents", value: "MOTS-c 60 mg in 3 mL" },
      { label: "Concentration", value: "20 mg/mL" },
      { label: "Class", value: "Mitochondrial-derived peptide (16 amino acids)" },
      { label: "Format", value: "Pre-filled dose-dial pen" },
      { label: "Storage", value: PEN_STORAGE },
      { label: "In the box", value: IN_THE_BOX },
    ],
    description:
      "MOTS-c is a 16-amino-acid peptide encoded in mitochondrial DNA and studied for its role in metabolic regulation and exercise capacity — almost entirely in animal and cell models so far. It is named on the WADA Prohibited List. The Aervyn pen supplies 60 mg in 3 mL for research use, pre-filled and dose-dial.",
    highlights: [
      "Pre-filled pen — no reconstitution",
      "Identity confirmed by LC-MS per lot",
      "Purity ≥ 99% by HPLC",
      "Named on the WADA list — flagged for tested athletes",
    ],
    coa: {
      batch: "AV-MOT-2609-A",
      testedOn: "2026-09-04",
      lab: "Janoshik Analytical",
      purity: "99.1% (HPLC)",
      identity: "Confirmed (LC-MS)",
      endotoxin: "< 0.5 EU/mg",
    },
    regulatoryLabel: RESEARCH_USE_LABEL,
    goals: ["general_wellbeing", "longevity", "athletic_performance", "fat_loss"],
    tags: ["metabolic", "energy", "mitochondria", "endurance"],
    visual: { format: "pen", tone: "white", accentText: "MOTS-C", color: "#1fa0d8" },
    images: [
      { src: "/products/mots-c-box.jpg", alt: "Aervyn MOTS-C peptide pen, 60 mg / 3 mL, with its carton", kind: "pack", width: 853, height: 1024 },
      { src: "/products/mots-c-hand.jpg", alt: "Aervyn MOTS-C pen held in a hand", kind: "hand", width: 819, height: 1024 },
    ],
    pen: {
      volumeMl: 3,
      totalMg: 60,
      concentration: "20 mg/mL",
      composition: "MOTS-c 60 mg",
      storage: PEN_STORAGE,
      dialing: PEN_DIALING,
    },
    bestFor: "Low metabolic energy, flagging endurance and healthy-ageing goals — with the caveat that the human evidence is still early.",
    matchFor: [
      "Energy and stamina that have dropped off",
      "Metabolic health and healthy ageing",
      "Endurance-focused training (not for tested athletes)",
    ],
    featured: true,
    isNew: true,
    shipping: { weightGrams: 90, coldChain: true },
    lastUpdated: "2026-09-16",
  },

  /* ------------------------------------------------------------------ */
  /* GHK-Cu — skin, hair, repair                                         */
  /* ------------------------------------------------------------------ */
  {
    id: "prd_ghkcu_pen",
    slug: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Peptide pen · 100 mg / 3 mL",
    compoundSlug: "ghk-cu",
    category: "peptide",
    channel: "research",
    availability: "in_stock",
    variants: [
      { id: "var_ghk_1", sku: "AV-GHK-100-1", label: "1 pen · 100 mg", price: 8900, stock: 80 },
      { id: "var_ghk_2", sku: "AV-GHK-100-2", label: "2 pens · 200 mg", price: 16400, compareAtPrice: 17800, stock: 40, unitNote: "Save £14" },
    ],
    defaultVariantId: "var_ghk_1",
    form: "Pre-filled multi-dose pen, 3 mL, dose-dial, 100 mg GHK-Cu (copper tripeptide) in solution",
    purity: "≥ 99% (HPLC)",
    specs: [
      { label: "Contents", value: "GHK-Cu 100 mg in 3 mL" },
      { label: "Concentration", value: "33.3 mg/mL" },
      { label: "Class", value: "Copper tripeptide (Gly-His-Lys · Cu²⁺)" },
      { label: "Format", value: "Pre-filled dose-dial pen" },
      { label: "Storage", value: PEN_STORAGE },
      { label: "In the box", value: IN_THE_BOX },
    ],
    description:
      "GHK-Cu is a naturally occurring copper-binding tripeptide with decades of use as a topical cosmetic ingredient, where small controlled studies report improved skin firmness and reduced fine lines; topical hair studies are preliminary. Injectable GHK-Cu has no human trials and is supplied here for research use only, pre-filled at 100 mg in 3 mL.",
    highlights: [
      "Pre-filled pen — no reconstitution",
      "Copper content and identity confirmed per lot",
      "Purity ≥ 99% by HPLC",
      "The blue pen — distinct carton colour for easy identification",
    ],
    coa: {
      batch: "AV-GHK-2609-B",
      testedOn: "2026-09-05",
      lab: "Janoshik Analytical",
      purity: "99.4% (HPLC)",
      identity: "Confirmed (LC-MS)",
      endotoxin: "< 0.5 EU/mg",
    },
    regulatoryLabel: RESEARCH_USE_LABEL,
    goals: ["skin_cosmetic", "hair", "injury_recovery"],
    tags: ["skin", "hair", "copper peptide", "repair"],
    visual: { format: "pen", tone: "white", accentText: "GHK-CU", color: "#d97a2e" },
    images: [
      { src: "/products/ghk-cu-box.jpg", alt: "Aervyn GHK-Cu peptide pen, 100 mg / 3 mL, with its carton", kind: "pack", width: 853, height: 1024 },
    ],
    pen: {
      volumeMl: 3,
      totalMg: 100,
      concentration: "33.3 mg/mL",
      composition: "GHK-Cu 100 mg",
      storage: PEN_STORAGE,
      dialing: PEN_DIALING,
    },
    bestFor: "Skin quality, firmness and hair goals where a single-compound copper peptide is the fit.",
    matchFor: ["Skin ageing, firmness and texture", "Hair thinning or shedding", "Surface repair and wound-healing research interests"],
    featured: true,
    shipping: { weightGrams: 90, coldChain: true },
    lastUpdated: "2026-09-16",
  },

  /* ------------------------------------------------------------------ */
  /* NAD+ — cellular energy / healthy ageing                             */
  /* ------------------------------------------------------------------ */
  {
    id: "prd_nad_pen",
    slug: "nad",
    name: "NAD+",
    subtitle: "Pen · 500 mg / 3 mL",
    compoundSlug: "nad",
    category: "peptide",
    channel: "research",
    availability: "in_stock",
    variants: [
      { id: "var_nad_1", sku: "AV-NAD-500-1", label: "1 pen · 500 mg", price: 11900, stock: 70 },
      { id: "var_nad_2", sku: "AV-NAD-500-2", label: "2 pens · 1,000 mg", price: 21900, compareAtPrice: 23800, stock: 35, unitNote: "Save £19" },
    ],
    defaultVariantId: "var_nad_1",
    form: "Pre-filled multi-dose pen, 3 mL, dose-dial, 500 mg nicotinamide adenine dinucleotide in solution",
    purity: "≥ 99% (HPLC)",
    specs: [
      { label: "Contents", value: "NAD+ 500 mg in 3 mL" },
      { label: "Concentration", value: "166.7 mg/mL" },
      { label: "Class", value: "Coenzyme (nicotinamide adenine dinucleotide) — not a peptide" },
      { label: "Format", value: "Pre-filled dose-dial pen" },
      { label: "Storage", value: PEN_STORAGE },
      { label: "In the box", value: IN_THE_BOX },
    ],
    description:
      "NAD+ is a coenzyme central to cellular energy metabolism whose levels decline with age. Human evidence exists mainly for oral precursors (nicotinamide riboside, NMN) and for intravenous NAD+ in small studies; injectable NAD+ itself has limited controlled data. The Aervyn pen supplies 500 mg in 3 mL for research use. It is the one product in the range that is not a peptide.",
    highlights: [
      "Pre-filled pen — no reconstitution",
      "Identity and assay confirmed per lot",
      "Purity ≥ 99% by HPLC",
      "Not a peptide — a coenzyme; labelled as such",
    ],
    coa: {
      batch: "AV-NAD-2609-A",
      testedOn: "2026-09-02",
      lab: "Janoshik Analytical",
      purity: "99.6% (HPLC)",
      identity: "Confirmed (LC-MS)",
      endotoxin: "< 0.5 EU/mg",
    },
    regulatoryLabel: RESEARCH_USE_LABEL,
    goals: ["general_wellbeing", "longevity", "athletic_performance"],
    tags: ["cellular energy", "healthy ageing", "recovery", "coenzyme"],
    visual: { format: "pen", tone: "white", accentText: "NAD+", color: "#1f3fbf" },
    images: [
      { src: "/products/nad-box.jpg", alt: "Aervyn NAD+ pen, 500 mg / 3 mL, with its carton", kind: "pack", width: 853, height: 1024 },
      { src: "/products/nad-hand.jpg", alt: "Aervyn NAD+ pen held in a hand", kind: "hand", width: 819, height: 1024 },
    ],
    pen: {
      volumeMl: 3,
      totalMg: 500,
      concentration: "166.7 mg/mL",
      composition: "NAD+ 500 mg",
      storage: PEN_STORAGE,
      dialing: PEN_DIALING,
    },
    bestFor: "Persistent tiredness, slow recovery and healthy-ageing goals where cellular energy is the theme.",
    matchFor: ["Feeling tired all the time despite sleeping", "Slow recovery between sessions or after illness", "Healthy ageing and long-term energy"],
    featured: true,
    bestseller: true,
    shipping: { weightGrams: 90, coldChain: true },
    lastUpdated: "2026-09-16",
  },

  /* ------------------------------------------------------------------ */
  /* Wolverine — BPC-157 + TB-500 repair blend                           */
  /* ------------------------------------------------------------------ */
  {
    id: "prd_wolverine_pen",
    slug: "wolverine",
    name: "Wolverine",
    subtitle: "BPC-157 + TB-500 · 40 mg / 3 mL",
    category: "peptide",
    channel: "research",
    availability: "in_stock",
    variants: [
      { id: "var_wol_1", sku: "AV-WOL-40-1", label: "1 pen · 40 mg", price: 13900, stock: 55 },
      { id: "var_wol_2", sku: "AV-WOL-40-2", label: "2 pens · 80 mg", price: 25600, compareAtPrice: 27800, stock: 25, unitNote: "Save £22" },
    ],
    defaultVariantId: "var_wol_1",
    form: "Pre-filled multi-dose pen, 3 mL, dose-dial, BPC-157 and TB-500 in solution, 40 mg total",
    purity: "≥ 99% per component (HPLC)",
    specs: [
      { label: "Contents", value: "BPC-157 + TB-500, 40 mg total in 3 mL" },
      { label: "Concentration", value: "13.3 mg/mL (combined)" },
      { label: "Components", value: "BPC-157 (pentadecapeptide) · TB-500 (thymosin β4 fragment)" },
      { label: "Format", value: "Pre-filled dose-dial pen" },
      { label: "Storage", value: PEN_STORAGE },
      { label: "In the box", value: IN_THE_BOX },
    ],
    description:
      "Wolverine combines the two most widely researched tissue-repair peptides — BPC-157 and TB-500 — in one pre-filled pen. Both have extensive animal data on tendon, ligament and muscle healing and no published human efficacy trials; the combination itself has not been studied in people, and the evidence record says so. Supplied for research use, 40 mg total in 3 mL, with the component split stated on the lot certificate.",
    highlights: [
      "Two repair peptides, one pen",
      "Both components identity-confirmed by LC-MS",
      "Purity ≥ 99% per component",
      "Combination evidence graded honestly in the report",
    ],
    coa: {
      batch: "AV-WOL-2609-A",
      testedOn: "2026-09-03",
      lab: "Janoshik Analytical",
      purity: "99.2% / 99.0% (HPLC, per component)",
      identity: "Both components confirmed (LC-MS)",
      endotoxin: "< 0.5 EU/mg",
    },
    regulatoryLabel: RESEARCH_USE_LABEL,
    goals: ["injury_recovery", "muscle_recovery", "athletic_performance"],
    tags: ["repair", "tendon", "ligament", "blend", "bestseller"],
    visual: { format: "pen", tone: "white", accentText: "WOLV", color: "#2e8b6e" },
    images: [
      { src: "/products/wolverine-box.jpg", alt: "Aervyn Wolverine peptide pen (BPC-157 + TB-500), 40 mg / 3 mL, with its carton", kind: "pack", width: 853, height: 1024 },
    ],
    blend: ["bpc-157", "tb-500"],
    pen: {
      volumeMl: 3,
      totalMg: 40,
      concentration: "13.3 mg/mL combined",
      composition: "BPC-157 + TB-500 · 40 mg total (component split on the lot certificate)",
      storage: PEN_STORAGE,
      dialing: PEN_DIALING,
    },
    bestFor: "Nagging tendon, ligament and muscle injuries — the repair blend.",
    matchFor: ["A tendon, ligament or joint injury that will not settle", "Recurring strains from training", "Post-injury recovery support (not for tested athletes)"],
    featured: true,
    bestseller: true,
    shipping: { weightGrams: 90, coldChain: true },
    lastUpdated: "2026-09-16",
  },

  /* ------------------------------------------------------------------ */
  /* Klow — GHK-Cu + BPC-157 + TB-500 + KPV skin & repair blend          */
  /* ------------------------------------------------------------------ */
  {
    id: "prd_klow_pen",
    slug: "klow",
    name: "Klow",
    subtitle: "GHK-Cu + BPC-157 + TB-500 + KPV · 80 mg / 3 mL",
    category: "peptide",
    channel: "research",
    availability: "in_stock",
    variants: [
      { id: "var_klow_1", sku: "AV-KLW-80-1", label: "1 pen · 80 mg", price: 17900, stock: 40 },
      { id: "var_klow_2", sku: "AV-KLW-80-2", label: "2 pens · 160 mg", price: 32900, compareAtPrice: 35800, stock: 18, unitNote: "Save £29" },
    ],
    defaultVariantId: "var_klow_1",
    form: "Pre-filled multi-dose pen, 3 mL, dose-dial, four-peptide blend in solution, 80 mg total",
    purity: "≥ 99% per component (HPLC)",
    specs: [
      { label: "Contents", value: "GHK-Cu + BPC-157 + TB-500 + KPV, 80 mg total in 3 mL" },
      { label: "Concentration", value: "26.7 mg/mL (combined)" },
      { label: "Components", value: "GHK-Cu 50 mg · BPC-157 10 mg · TB-500 10 mg · KPV 10 mg (verify against the lot certificate)" },
      { label: "Format", value: "Pre-filled dose-dial pen" },
      { label: "Storage", value: PEN_STORAGE },
      { label: "In the box", value: IN_THE_BOX },
    ],
    description:
      "Klow is a four-peptide skin-and-repair blend: the copper tripeptide GHK-Cu, the tissue-repair peptides BPC-157 and TB-500, and KPV, an anti-inflammatory fragment of α-MSH. Each component has its own evidence record; the four-way combination has never been studied in people, and the Peptide Checkup report grades it accordingly. Supplied for research use, 80 mg total in 3 mL, pre-filled.",
    highlights: [
      "Four peptides, one pen",
      "All four components identity-confirmed by LC-MS",
      "Purity ≥ 99% per component",
      "Combination evidence graded honestly in the report",
    ],
    coa: {
      batch: "AV-KLW-2609-A",
      testedOn: "2026-09-04",
      lab: "Janoshik Analytical",
      purity: "≥ 99.0% each component (HPLC)",
      identity: "All four components confirmed (LC-MS)",
      endotoxin: "< 0.5 EU/mg",
    },
    regulatoryLabel: RESEARCH_USE_LABEL,
    goals: ["skin_cosmetic", "injury_recovery", "muscle_recovery"],
    tags: ["skin", "repair", "inflammation", "blend"],
    visual: { format: "pen", tone: "white", accentText: "KLOW", color: "#1d8fbf" },
    images: [
      { src: "/products/klow-box.jpg", alt: "Aervyn Klow peptide pen (GHK-Cu + BPC-157 + TB-500 + KPV), 80 mg / 3 mL, with its carton", kind: "pack", width: 853, height: 1024 },
      { src: "/products/klow-hand.jpg", alt: "Aervyn Klow pen held in a hand", kind: "hand", width: 819, height: 1024 },
    ],
    blend: ["ghk-cu", "bpc-157", "tb-500", "kpv"],
    pen: {
      volumeMl: 3,
      totalMg: 80,
      concentration: "26.7 mg/mL combined",
      composition: "GHK-Cu 50 mg · BPC-157 10 mg · TB-500 10 mg · KPV 10 mg (verify against the lot certificate)",
      storage: PEN_STORAGE,
      dialing: PEN_DIALING,
    },
    bestFor: "Skin and surface repair with an inflammatory component — the broadest blend in the range.",
    matchFor: ["Skin quality plus slow-healing marks, scars or irritation", "Repair goals where inflammation is part of the picture", "Wanting skin and recovery support in one pen"],
    featured: true,
    isNew: true,
    shipping: { weightGrams: 90, coldChain: true },
    lastUpdated: "2026-09-16",
  },
];
