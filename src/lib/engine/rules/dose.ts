import type { Compound, DoseUnit, DosingStudy, Route, StudyExposure } from "@/data/types";
import { ROUTE_LABELS } from "@/data/types";
import type { ConsideredDose } from "@/lib/assessment/types";
import type { DoseComparison, Flag } from "../types";
import {
  FREQUENCY_LABELS,
  NO_DOSE_ENTERED,
  PROFESSIONAL_REVIEW_SENTENCE,
  flagId,
  joinList,
} from "../labels";

/**
 * Layer 2 of the dosing section: how the user's considered dose compares
 * with published human study exposures. Purely numeric — no judgement about
 * what the user "should" do.
 */

const RESEARCH_CLAUSE =
  "Study exposures are research information about what was tested in trials, not a recommendation for you.";

/** Units that can be converted by a fixed factor (value in base unit). */
const MASS_FACTORS: Partial<Record<DoseUnit, number>> = {
  g: 1_000_000,
  mg: 1_000,
  mcg: 1,
};

const MASS_PER_KG_FACTORS: Partial<Record<DoseUnit, number>> = {
  "mg/kg": 1_000,
  "mcg/kg": 1,
};

/** Convert `amount` from `from` unit to `to` unit when trivially possible. */
export function convertDose(amount: number, from: DoseUnit, to: DoseUnit): number | undefined {
  if (from === to) return amount;
  const a = MASS_FACTORS[from];
  const b = MASS_FACTORS[to];
  if (a !== undefined && b !== undefined) return (amount * a) / b;
  const c = MASS_PER_KG_FACTORS[from];
  const d = MASS_PER_KG_FACTORS[to];
  if (c !== undefined && d !== undefined) return (amount * c) / d;
  return undefined;
}

export function formatAmount(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  // up to 3 significant decimals, trimmed
  return parseFloat(n.toFixed(3)).toString();
}

export function formatUserDose(dose: ConsideredDose | undefined): string {
  if (!dose || dose.amount === undefined) return "Not provided";
  const parts = [`${formatAmount(dose.amount)}${dose.unit ? ` ${dose.unit}` : ""}`];
  if (dose.frequency) parts.push(FREQUENCY_LABELS[dose.frequency]);
  const label = parts.join(" ");
  return dose.route ? `${label} (${ROUTE_LABELS[dose.route].toLowerCase()})` : label;
}

function formatExposure(e: StudyExposure): string {
  const range =
    e.doseMin !== undefined && e.doseMax !== undefined && e.doseMin !== e.doseMax
      ? `${formatAmount(e.doseMin)}–${formatAmount(e.doseMax)} ${e.unit}`
      : `${formatAmount(e.doseMax ?? e.doseMin ?? 0)} ${e.unit}`;
  return `${range} ${FREQUENCY_LABELS[e.frequency]}`;
}

interface StudyWithExposure {
  study: DosingStudy;
  exposure: StudyExposure;
}

export interface DoseEvaluation {
  comparison: DoseComparison;
  flag?: Flag;
}

export function compareDose(compound: Compound, dose: ConsideredDose | undefined): DoseEvaluation {
  const userDoseLabel = formatUserDose(dose);

  if (!dose || dose.amount === undefined || dose.amount <= 0) {
    return {
      comparison: { userDoseLabel: "Not provided", verdict: "not_provided", explanation: NO_DOSE_ENTERED },
    };
  }

  const studies: StudyWithExposure[] = compound.dosingResearch.flatMap((study) =>
    study.exposure ? [{ study, exposure: study.exposure }] : [],
  );

  if (studies.length === 0) {
    return {
      comparison: {
        userDoseLabel,
        verdict: "no_human_data",
        explanation: `There are no human study exposures for ${compound.name} in our database that can be compared numerically, so your considered dose cannot be placed against published research.${
          compound.dosingResearchNote ? ` ${compound.dosingResearchNote}` : ""
        } ${RESEARCH_CLAUSE}`,
      },
    };
  }

  if (!dose.unit) {
    return {
      comparison: {
        userDoseLabel,
        verdict: "not_comparable",
        explanation: `You entered an amount without a unit. Published exposures for ${compound.name} are recorded in ${joinList(
          Array.from(new Set(studies.map((s) => s.exposure.unit))),
        )}; add a unit to compare. ${RESEARCH_CLAUSE}`,
      },
    };
  }

  if (!dose.frequency) {
    return {
      comparison: {
        userDoseLabel,
        verdict: "not_comparable",
        explanation: `You entered an amount without a frequency. Dose comparisons depend on how often a dose is taken — the published studies used ${joinList(
          Array.from(new Set(studies.map((s) => FREQUENCY_LABELS[s.exposure.frequency]))),
        )} dosing. Add a frequency to compare. ${RESEARCH_CLAUSE}`,
      },
    };
  }

  const amount = dose.amount;
  const userUnit: DoseUnit = dose.unit;
  const frequency = dose.frequency;

  // Route: fall back to the compound's primary route when the user didn't specify one.
  const route: Route | undefined = dose.route ?? compound.routes[0];
  const assumedRoute =
    !dose.route && route ? ` (assuming ${ROUTE_LABELS[route].toLowerCase()}, the primary studied route)` : "";

  const sameRoute = studies.filter((s) => s.exposure.route === route);
  if (sameRoute.length === 0) {
    const studiedRoutes = Array.from(new Set(studies.map((s) => ROUTE_LABELS[s.exposure.route].toLowerCase())));
    return {
      comparison: {
        userDoseLabel,
        verdict: "route_differs",
        explanation: `Your considered route${assumedRoute} — ${
          route ? ROUTE_LABELS[route].toLowerCase() : "unspecified"
        } — differs from the published human studies of ${compound.name}, which used ${joinList(
          studiedRoutes,
        )} administration. Exposure by a different route cannot be compared, because absorption and bioavailability differ. ${RESEARCH_CLAUSE} ${PROFESSIONAL_REVIEW_SENTENCE}`,
        referenceStudy: studies[0].study.citation,
      },
    };
  }

  const sameFrequency = sameRoute.filter((s) => s.exposure.frequency === frequency);
  if (sameFrequency.length === 0) {
    const studyFrequencies = Array.from(new Set(sameRoute.map((s) => FREQUENCY_LABELS[s.exposure.frequency])));
    return {
      comparison: {
        userDoseLabel,
        verdict: "frequency_differs",
        explanation: `You are considering ${FREQUENCY_LABELS[frequency]} dosing${assumedRoute}; the published human studies of ${
          compound.name
        } by this route used ${joinList(studyFrequencies)} dosing (${joinList(
          Array.from(new Set(sameRoute.map((s) => formatExposure(s.exposure)))),
        )}). Because total exposure depends on frequency, the amounts cannot be compared directly. ${RESEARCH_CLAUSE} ${PROFESSIONAL_REVIEW_SENTENCE}`,
        referenceStudy: sameRoute[0].study.citation,
      },
    };
  }

  // Convert the user's amount into each study's unit; keep the ones that convert.
  const comparable = sameFrequency.flatMap((s) => {
    const converted = convertDose(amount, userUnit, s.exposure.unit);
    return converted === undefined ? [] : [{ ...s, converted }];
  });

  if (comparable.length === 0) {
    return {
      comparison: {
        userDoseLabel,
        verdict: "not_comparable",
        explanation: `Your dose is expressed in ${userUnit}, but the published exposures for ${compound.name} are recorded in ${joinList(
          Array.from(new Set(sameFrequency.map((s) => s.exposure.unit))),
        )}. These cannot be converted without information we do not have (for example body weight or product potency). ${RESEARCH_CLAUSE}`,
        referenceStudy: sameFrequency[0].study.citation,
      },
    };
  }

  const lows = comparable.map((s) => s.exposure.doseMin ?? s.exposure.doseMax).filter((n): n is number => n !== undefined);
  const highs = comparable.map((s) => s.exposure.doseMax ?? s.exposure.doseMin).filter((n): n is number => n !== undefined);
  const overallMin = Math.min(...lows);
  const overallMax = Math.max(...highs);
  const unit = comparable[0].exposure.unit;
  const x = comparable[0].converted;

  const containing = comparable.find((s) => {
    const lo = s.exposure.doseMin ?? s.exposure.doseMax ?? 0;
    const hi = s.exposure.doseMax ?? s.exposure.doseMin ?? 0;
    return x >= lo && x <= hi;
  });
  const highest = comparable.reduce((best, s) =>
    (s.exposure.doseMax ?? s.exposure.doseMin ?? 0) > (best.exposure.doseMax ?? best.exposure.doseMin ?? 0) ? s : best,
  );
  const lowest = comparable.reduce((best, s) =>
    (s.exposure.doseMin ?? s.exposure.doseMax ?? 0) < (best.exposure.doseMin ?? best.exposure.doseMax ?? 0) ? s : best,
  );

  const freqLabel = FREQUENCY_LABELS[frequency];
  const rangeLabel = `${formatAmount(overallMin)}–${formatAmount(overallMax)} ${unit} ${freqLabel}`;

  if (x > overallMax) {
    const excess = overallMax > 0 ? Math.round((x / overallMax) * 100) / 100 : undefined;
    return {
      comparison: {
        userDoseLabel,
        verdict: "above_range",
        explanation: `Your considered dose (${userDoseLabel}${assumedRoute}) is above the highest exposure in the published human studies we hold for ${compound.name}: ${formatAmount(
          overallMax,
        )} ${unit} ${freqLabel} in ${highest.study.citation}${
          excess !== undefined && excess >= 1.05 ? ` — roughly ${excess}× that exposure` : ""
        }. Adverse-event rates above the studied range have not been characterised in trials. ${RESEARCH_CLAUSE} ${PROFESSIONAL_REVIEW_SENTENCE}`,
        referenceStudy: highest.study.citation,
      },
      flag: {
        id: flagId("dose", compound.slug, "above-range"),
        severity: "caution",
        source: "dose",
        title: "Considered dose exceeds the highest published human study exposure",
        detail: `You entered ${userDoseLabel} for ${compound.name}. The highest exposure in the published human studies in our database is ${formatAmount(
          overallMax,
        )} ${unit} ${freqLabel} (${highest.study.citation}). Safety above the studied range has not been characterised.`,
        compounds: [compound.slug],
      },
    };
  }

  if (x < overallMin) {
    return {
      comparison: {
        userDoseLabel,
        verdict: "below_range",
        explanation: `Your considered dose (${userDoseLabel}${assumedRoute}) is below the lowest exposure in the published human studies we hold for ${compound.name}: ${formatAmount(
          overallMin,
        )} ${unit} ${freqLabel} in ${lowest.study.citation}. The studied effects and adverse-event rates relate to the range ${rangeLabel}; effects below it have not been characterised. ${RESEARCH_CLAUSE} ${PROFESSIONAL_REVIEW_SENTENCE}`,
        referenceStudy: lowest.study.citation,
      },
    };
  }

  const ref = containing ?? comparable[0];
  return {
    comparison: {
      userDoseLabel,
      verdict: "within_range",
      explanation: `Your considered dose (${userDoseLabel}${assumedRoute}) falls within the range used in the published human studies we hold for ${compound.name} (${rangeLabel}; ${ref.study.citation}${
        ref.exposure.note ? ` — ${ref.exposure.note}` : ""
      }). Being within a studied range says nothing about whether it is appropriate for you — that depends on the factors in your personal suitability assessment. ${RESEARCH_CLAUSE}`,
      referenceStudy: ref.study.citation,
    },
  };
}
