import { getCompounds } from "@/data/compounds";
import { BASE_CONDITIONS, CONDITION_MAP } from "@/data/conditions";
import { COUNTRY_MAP, jurisdictionForCountry } from "@/data/countries";
import { MEDICATION_CLASS_MAP } from "@/data/medications";
import { JURISDICTION_LABELS, type Compound, type ConditionDef, type ConditionId } from "@/data/types";
import type { AssessmentAnswers } from "./types";

/**
 * Pure helpers that derive UI facts from the current answers and the
 * compound database. Nothing here writes state or renders.
 */

/* ------------------------------------------------------------------ */
/* Compounds                                                           */
/* ------------------------------------------------------------------ */

export function selectedCompounds(a: AssessmentAnswers): Compound[] {
  return getCompounds(a.consideredCompounds.map((c) => c.slug));
}

/** "A", "A and B", "A, B and C" */
export function joinNatural(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/* ------------------------------------------------------------------ */
/* Conditions (Q16)                                                    */
/* ------------------------------------------------------------------ */

export interface ExtendedConditionRow {
  condition: ConditionDef;
  /** Names of the selected compounds whose contraindications reference it */
  compounds: string[];
}

/**
 * Extended (non-base) conditions referenced by the selected compounds'
 * contraindications, de-duplicated and ordered by how many compounds cite
 * them, then alphabetically.
 */
export function extendedConditionsFor(a: AssessmentAnswers): ExtendedConditionRow[] {
  const map = new Map<ConditionId, string[]>();
  for (const compound of selectedCompounds(a)) {
    for (const ci of compound.contraindications) {
      const def = CONDITION_MAP[ci.conditionId];
      if (!def || def.base) continue;
      const list = map.get(ci.conditionId) ?? [];
      if (!list.includes(compound.name)) list.push(compound.name);
      map.set(ci.conditionId, list);
    }
  }
  return Array.from(map.entries())
    .map(([id, compounds]) => ({ condition: CONDITION_MAP[id], compounds }))
    .sort(
      (x, y) => y.compounds.length - x.compounds.length || x.condition.label.localeCompare(y.condition.label),
    );
}

export function conditionRows(a: AssessmentAnswers): { base: ConditionDef[]; extended: ExtendedConditionRow[] } {
  return { base: BASE_CONDITIONS, extended: extendedConditionsFor(a) };
}

/* ------------------------------------------------------------------ */
/* Risk-screening hints (Q36–Q42), tailored to the selection           */
/* ------------------------------------------------------------------ */

const MAX_HINT_COMPOUNDS = 2;

export function riskHint(stepId: string, a: AssessmentAnswers): string | undefined {
  const compounds = selectedCompounds(a);
  const names = compounds.map((c) => c.name);

  switch (stepId) {
    case "serious-allergy":
      return "For example anaphylaxis, swelling of the face or throat, or any reaction that needed emergency treatment.";

    case "component-allergy":
      return names.length
        ? `This covers the active compound and any excipients listed on the product leaflet. You are considering ${joinNatural(names)}.`
        : "This covers the active compound and any excipients listed on the product leaflet.";

    case "previous-reaction": {
      const classes = uniq(compounds.map((c) => c.classLabel));
      return classes.length
        ? `Similar treatments include anything in the same class as what you are considering: ${joinNatural(classes.map(lowerFirst))}.`
        : "Similar treatments include other peptides, injectable medicines or products with the same mechanism.";
    }

    case "severe-symptoms":
      return "For example unexplained weight loss, persistent pain, blood in your urine or stool, or symptoms that no clinician has assessed yet.";

    case "advised-against": {
      const parts = compounds
        .map((c) => {
          const labels = uniq(
            c.contraindications
              .filter((x) => x.severity === "absolute")
              .map((x) => CONDITION_MAP[x.conditionId]?.label)
              .filter((l): l is string => Boolean(l)),
          );
          return labels.length
            ? `For ${c.name}, product information advises against use with ${joinNatural(labels.map(lowerFirst))}.`
            : null;
        })
        .filter((p): p is string => Boolean(p))
        .slice(0, MAX_HINT_COMPOUNDS);
      return parts.length
        ? parts.join(" ")
        : "This includes advice from a GP, pharmacist, specialist, dentist or other registered professional.";
    }

    case "under-investigation": {
      const absolute: string[] = [];
      const caution: string[] = [];
      for (const c of compounds) {
        for (const x of c.contraindications) {
          const label = CONDITION_MAP[x.conditionId]?.label;
          if (!label) continue;
          (x.severity === "absolute" ? absolute : caution).push(label);
        }
      }
      const labels = uniq([...absolute, ...caution]).slice(0, 6);
      return labels.length
        ? `Relevant conditions for your selection include ${joinNatural(labels.map(lowerFirst))}.`
        : "For example tests, scans or referrals that have not yet produced a diagnosis.";
    }

    case "interacting-treatment": {
      const parts = compounds
        .map((c) => {
          const labels = uniq(
            c.interactions
              .filter((x) => x.severity === "major")
              .map((x) => MEDICATION_CLASS_MAP[x.classId]?.label)
              .filter((l): l is string => Boolean(l)),
          );
          return labels.length
            ? `For ${c.name}, the most significant known interactions are with ${joinNatural(labels.map(lowerFirst))}.`
            : null;
        })
        .filter((p): p is string => Boolean(p))
        .slice(0, MAX_HINT_COMPOUNDS);
      return parts.length
        ? parts.join(" ")
        : "Including prescribed medicines, other peptides, and treatments such as chemotherapy, immunotherapy or hormone therapy.";
    }

    default:
      return undefined;
  }
}

function lowerFirst(s: string) {
  // Keep acronyms (e.g. "MEN2", "DVT") intact.
  if (!s) return s;
  const first = s[0];
  const second = s[1];
  if (second && second === second.toUpperCase() && /[A-Z]/.test(second)) return s;
  return first.toLowerCase() + s.slice(1);
}

/* ------------------------------------------------------------------ */
/* Units & body metrics                                                */
/* ------------------------------------------------------------------ */

const CM_PER_INCH = 2.54;
const KG_PER_LB = 0.45359237;

export function cmToImperial(cm: number): { feet: number; inches: number } {
  const totalInches = cm / CM_PER_INCH;
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches - feet * 12);
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }
  return { feet, inches };
}

export function imperialToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * CM_PER_INCH);
}

export function kgToLb(kg: number): number {
  return Math.round(kg / KG_PER_LB);
}

export function lbToKg(lb: number): number {
  return Math.round(lb * KG_PER_LB * 10) / 10;
}

export function lbToStoneLb(lb: number): { stone: number; lb: number } {
  const stone = Math.floor(lb / 14);
  return { stone, lb: Math.round(lb - stone * 14) };
}

export function formatHeight(cm: number | undefined, system: "metric" | "imperial"): string {
  if (!cm) return "";
  if (system === "imperial") {
    const { feet, inches } = cmToImperial(cm);
    return `${feet} ft ${inches} in (${cm} cm)`;
  }
  const { feet, inches } = cmToImperial(cm);
  return `${cm} cm (${feet} ft ${inches} in)`;
}

export function formatWeight(kg: number | undefined, system: "metric" | "imperial"): string {
  if (!kg) return "";
  const lb = kgToLb(kg);
  if (system === "imperial") return `${lb} lb (${kg} kg)`;
  return `${kg} kg (${lb} lb)`;
}

export function plausibleBody(heightCm?: number, weightKg?: number): boolean {
  return (
    typeof heightCm === "number" &&
    typeof weightKg === "number" &&
    heightCm >= 100 &&
    heightCm <= 250 &&
    weightKg >= 30 &&
    weightKg <= 350
  );
}

/* ------------------------------------------------------------------ */
/* Country                                                             */
/* ------------------------------------------------------------------ */

export function countryName(code?: string): string | undefined {
  return code ? COUNTRY_MAP[code]?.name : undefined;
}

export function jurisdictionLabel(code?: string): string {
  return JURISDICTION_LABELS[jurisdictionForCountry(code)];
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value?: string): boolean {
  return Boolean(value && EMAIL_RE.test(value.trim()));
}

export function filled(value?: string): boolean {
  return Boolean(value && value.trim().length > 0);
}

/* ------------------------------------------------------------------ */
/* Copy                                                                */
/* ------------------------------------------------------------------ */

export const PREGNANCY_NOTICE =
  "Thank you for telling us. Because you're pregnant, trying to conceive or breastfeeding, most compounds in our database are not recommended and your report will reflect that. Please discuss any plans with your midwife, GP or specialist.";
