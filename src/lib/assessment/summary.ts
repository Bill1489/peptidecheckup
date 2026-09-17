import { CONDITION_MAP } from "@/data/conditions";
import { COUNTRY_MAP } from "@/data/countries";
import { GOAL_MAP } from "@/data/goals";
import type { ConditionId } from "@/data/types";
import { bmi } from "@/lib/utils";
import { formatHeight, formatWeight, jurisdictionLabel, selectedProducts } from "./derived";
import { EXPERIENCE_LABELS, FLOW_SECTIONS, RISK_QUESTIONS, focusLabel, goalProblemLabel, type Step } from "./flow";
import {
  ALCOHOL_LABELS,
  NICOTINE_LABELS,
  OTC_LABELS,
  SECTION_META,
  TIMEFRAME_LABELS,
  type AssessmentAnswers,
  type SectionId,
} from "./types";

/**
 * Builds the grouped summary shown on the review screen. Each row points at
 * the step it came from so "Edit" can jump straight there.
 */

export interface ReviewRow {
  stepId: Step["id"];
  label: string;
  value: string;
}

export type ReviewStatus = "complete" | "skipped" | "in_progress" | "not_started";

export interface ReviewSection {
  id: SectionId;
  title: string;
  optional: boolean;
  status: ReviewStatus;
  rows: ReviewRow[];
}

const YES_NO_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  na: "Not applicable",
  unsure: "Unsure",
  not_sure: "Not sure yet",
  prefer_not: "Prefer not to say",
};

/** Short risk-row labels for the review and the appendix, keyed by field. */
export const RISK_LABELS: Record<(typeof RISK_QUESTIONS)[number]["field"], string> = {
  seriousAllergy: "Serious allergic reaction to a medicine",
  componentAllergy: "Allergy to a component",
  previousSeriousReaction: "Previous serious reaction to a similar treatment",
  severeSymptoms: "Unexplained or severe symptoms",
  advisedAgainst: "Advised not to use this type of treatment",
  underInvestigation: "Under investigation",
  interactingTreatment: "Treatment that could interact",
};

function yn(v?: string): string | undefined {
  return v ? YES_NO_LABELS[v] ?? v : undefined;
}

function withDetails(v?: string, details?: string): string | undefined {
  const base = yn(v);
  if (!base) return undefined;
  return details?.trim() ? `${base} — ${details.trim()}` : base;
}

function row(stepId: string, label: string, value: string | undefined | null): ReviewRow | null {
  return value ? { stepId, label, value } : null;
}

function compact(rows: (ReviewRow | null)[]): ReviewRow[] {
  return rows.filter((r): r is ReviewRow => r !== null);
}

function rowsFor(section: SectionId, a: AssessmentAnswers): ReviewRow[] {
  switch (section) {
    case "goals":
      return compact([
        row("goal", "What you want to change", goalProblemLabel(a.primaryGoal)),
        row("focus", "Sounds like you", a.focusAreas.length ? a.focusAreas.map(focusLabel).join("; ") : undefined),
        row(
          "secondary-goals",
          "Also working on",
          a.secondaryGoals.length
            ? a.secondaryGoals.map((g) => goalProblemLabel(g) ?? GOAL_MAP[g]?.label ?? g).join("; ")
            : a.completedSections.includes("goals")
              ? "Nothing else"
              : undefined,
        ),
        row("timeframe", "Timeframe", a.timeframe ? TIMEFRAME_LABELS[a.timeframe] : undefined),
        row("experience", "Peptide experience", a.experienceLevel ? EXPERIENCE_LABELS[a.experienceLevel] : undefined),
      ]);
    case "considering": {
      const pens = selectedProducts(a).map((p) => p.name);
      return compact([
        row(
          "products",
          "Pens in mind",
          pens.length ? pens.join(", ") : a.completedSections.includes("considering") ? "None — let the quiz decide" : undefined,
        ),
        row("currently-taking", "Currently using a peptide", yn(a.currentlyTaking)),
      ]);
    }
    case "basics": {
      const country = a.countryCode ? COUNTRY_MAP[a.countryCode] : undefined;
      const b = bmi(a.heightCm, a.weightKg);
      return compact([
        row("age", "Age", a.age ? `${a.age}` : undefined),
        row("sex", "Sex", a.sex ? { female: "Female", male: "Male", prefer_not: "Prefer not to say" }[a.sex] : undefined),
        row("body", "Height", formatHeight(a.heightCm, a.unitSystem) || undefined),
        row("body", "Weight", formatWeight(a.weightKg, a.unitSystem) || undefined),
        row("body", "BMI", b ? `${b}` : undefined),
        row(
          "country",
          "Country",
          country ? `${country.name} · Regulatory view: ${jurisdictionLabel(country.code)}` : undefined,
        ),
        row("pregnancy", "Pregnant, trying or breastfeeding", yn(a.pregnancy)),
      ]);
    }
    case "medical": {
      const reported = (Object.entries(a.conditions) as [ConditionId, string][])
        .filter(([, status]) => status && status !== "none")
        .map(([id, status]) => `${CONDITION_MAP[id]?.label ?? id} (${status})`);
      return compact([
        row(
          "conditions",
          "Conditions",
          reported.length ? reported.join("; ") : a.completedSections.includes("medical") ? "None reported" : undefined,
        ),
        row("conditions", "Other condition", a.conditionOtherText?.trim()),
        row("surgery", "Relevant surgery", withDetails(a.relevantSurgery, a.surgeryDetails)),
        row("symptoms", "Current symptoms", withDetails(a.currentSymptoms, a.symptomsDetails)),
      ]);
    }
    case "medications": {
      const rx = a.prescriptions
        .filter((p) => p.name.trim())
        .map((p) => (p.strength?.trim() ? `${p.name.trim()} ${p.strength.trim()}` : p.name.trim()));
      const otc = a.otc.map((o) => (o === "other" && a.otcOtherText?.trim() ? a.otcOtherText.trim() : OTC_LABELS[o]));
      const supp = a.supplements.filter((s) => s.name.trim()).map((s) => s.name.trim());
      return compact([
        row(
          "prescriptions",
          "Prescription medicines",
          a.takesPrescription === "no" ? "None" : rx.length ? rx.join(", ") : undefined,
        ),
        row("otc", "Over-the-counter", otc.length ? otc.join(", ") : undefined),
        row("supplements", "Supplements", a.takesSupplements === "no" ? "None" : supp.length ? supp.join(", ") : undefined),
        row("lifestyle", "Alcohol", a.alcohol ? ALCOHOL_LABELS[a.alcohol] : undefined),
        row("lifestyle", "Nicotine", a.nicotine ? NICOTINE_LABELS[a.nicotine] : undefined),
      ]);
    }
    case "risk":
      return compact([
        ...RISK_QUESTIONS.map((q) => row("safety", RISK_LABELS[q.field], yn(a[q.field]))),
        row("safety", "Details", a.riskDetails?.trim()),
        row("tested-athlete", "Competes in drug-tested sport", yn(a.testedAthlete)),
      ]);
    case "final":
      return compact([row("anything-else", "Anything else", a.anythingElse?.trim())]);
    default:
      return [];
  }
}

export function buildReview(a: AssessmentAnswers): ReviewSection[] {
  return FLOW_SECTIONS.map((id) => {
    const rows = rowsFor(id, a);
    let status: ReviewStatus;
    if (a.completedSections.includes(id)) status = "complete";
    else if (a.skippedSections.includes(id)) status = "skipped";
    else if (rows.length) status = "in_progress";
    else status = "not_started";
    const meta = SECTION_META[id];
    return { id, title: meta.title, optional: meta.optional, status, rows };
  });
}
