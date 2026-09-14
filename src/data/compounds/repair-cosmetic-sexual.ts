import type { Compound } from "../types";
import { bpc157 } from "./bpc-157";
import { tb500 } from "./tb-500";
import { ghkCu } from "./ghk-cu";
import { collagenPeptides } from "./collagen-peptides";
import { pt141 } from "./pt-141";
import { kisspeptin } from "./kisspeptin";
import { melanotanII } from "./melanotan-ii";

/**
 * Group: tissue repair, cosmetic & sexual health compounds
 * (bpc-157, tb-500, ghk-cu, collagen-peptides, pt-141, kisspeptin, melanotan-ii).
 * Each compound lives in its own file in this folder and is registered here.
 */
export const REPAIR_COSMETIC_SEXUAL_COMPOUNDS: Compound[] = [
  bpc157,
  tb500,
  ghkCu,
  collagenPeptides,
  pt141,
  kisspeptin,
  melanotanII,
];
