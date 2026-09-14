import type { Compound } from "../types";
import { selank } from "./selank";
import { semax } from "./semax";
import { dsip } from "./dsip";
import { epitalon } from "./epitalon";
import { motsC } from "./mots-c";
import { elamipretide } from "./elamipretide";
import { thymosinAlpha1 } from "./thymosin-alpha-1";
import { ll37 } from "./ll-37";

/**
 * Group: cognition/sleep, longevity & immune compounds
 * (selank, semax, dsip, epitalon, mots-c, elamipretide, thymosin-alpha-1, ll-37).
 * Each compound lives in its own file in this folder and is registered here.
 */
export const NEURO_LONGEVITY_IMMUNE_COMPOUNDS: Compound[] = [
  selank,
  semax,
  dsip,
  epitalon,
  motsC,
  elamipretide,
  thymosinAlpha1,
  ll37,
];
