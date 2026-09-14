import type { Compound } from "../types";
import { tesamorelin } from "./tesamorelin";
import { sermorelin } from "./sermorelin";
import { cjc1295 } from "./cjc-1295";
import { ipamorelin } from "./ipamorelin";
import { somatropin } from "./somatropin";
import { igf1Lr3 } from "./igf-1-lr3";

/**
 * Group: growth-hormone-axis compounds
 * (tesamorelin, sermorelin, cjc-1295, ipamorelin, somatropin, igf-1-lr3).
 * Each compound lives in its own file in this folder and is registered here.
 */
export const GH_AXIS_COMPOUNDS: Compound[] = [
  tesamorelin,
  sermorelin,
  cjc1295,
  ipamorelin,
  somatropin,
  igf1Lr3,
];
