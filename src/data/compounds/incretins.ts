import type { Compound } from "../types";
import { tirzepatide } from "./tirzepatide";
import { liraglutide } from "./liraglutide";
import { retatrutide } from "./retatrutide";
import { cagrilintide } from "./cagrilintide";
import { survodutide } from "./survodutide";
import { aod9604 } from "./aod-9604";

/**
 * Group: incretin-based & metabolic compounds
 * (tirzepatide, liraglutide, retatrutide, cagrilintide, survodutide, aod-9604).
 * Each compound lives in its own file in this folder and is registered here.
 * semaglutide is registered directly in index.ts as the reference record.
 */
export const INCRETIN_COMPOUNDS: Compound[] = [
  tirzepatide,
  liraglutide,
  retatrutide,
  cagrilintide,
  survodutide,
  aod9604,
];
