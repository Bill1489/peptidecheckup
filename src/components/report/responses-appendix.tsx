"use client";

import * as React from "react";
import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { CONDITION_MAP } from "@/data/conditions";
import { COUNTRY_MAP } from "@/data/countries";
import { GOAL_MAP } from "@/data/goals";
import { MEDICATION_CLASS_MAP } from "@/data/medications";
import { selectedProducts } from "@/lib/assessment/derived";
import { EXPERIENCE_LABELS, FLOW_SECTIONS, FOCUS_NONE, RISK_QUESTIONS, focusLabel, goalProblemLabel } from "@/lib/assessment/flow";
import { RISK_LABELS } from "@/lib/assessment/summary";
import {
  ALCOHOL_LABELS,
  NICOTINE_LABELS,
  OTC_LABELS,
  SECTION_META,
  TIMEFRAME_LABELS,
  type AssessmentAnswers,
  type SectionId,
  type YesNo,
  type YesNoNA,
  type YesNoUnsure,
} from "@/lib/assessment/types";
import { bmi, cn } from "@/lib/utils";
import { MonoLabel } from "./primitives";

type Row = { label: string; value: React.ReactNode };

const yn = (v: YesNo | YesNoNA | YesNoUnsure | undefined) =>
  v === "yes" ? "Yes" : v === "no" ? "No" : v === "na" ? "Not applicable" : v === "unsure" ? "Unsure" : undefined;

const NOT_ANSWERED = <span className="text-muted-2">Not answered</span>;

function val(v: React.ReactNode | undefined | null | ""): React.ReactNode {
  return v === undefined || v === null || v === "" ? NOT_ANSWERED : v;
}

function rowsFor(section: SectionId, a: AssessmentAnswers): Row[] {
  switch (section) {
    case "goals": {
      const focus = a.focusAreas.filter((f) => f !== FOCUS_NONE).map(focusLabel);
      return [
        { label: "What you want to change", value: val(goalProblemLabel(a.primaryGoal)) },
        {
          label: "Sounds like you",
          value: focus.length > 0 ? focus.join("; ") : a.focusAreas.includes(FOCUS_NONE) ? "None of these" : NOT_ANSWERED,
        },
        {
          label: "Also working on",
          value: a.secondaryGoals.length > 0 ? a.secondaryGoals.map((g) => goalProblemLabel(g) ?? GOAL_MAP[g]?.label ?? g).join("; ") : "Nothing else",
        },
        { label: "Timeframe", value: val(a.timeframe ? TIMEFRAME_LABELS[a.timeframe] : undefined) },
        { label: "Peptide experience", value: val(a.experienceLevel ? EXPERIENCE_LABELS[a.experienceLevel] : undefined) },
      ];
    }
    case "considering": {
      const pens = selectedProducts(a);
      return [
        {
          label: "Pens in mind",
          value: pens.length > 0 ? pens.map((p) => p.name).join(", ") : "None — let the quiz decide",
        },
        { label: "Currently using a peptide or similar", value: val(yn(a.currentlyTaking)) },
      ];
    }
    case "basics": {
      const b = bmi(a.heightCm, a.weightKg);
      return [
        { label: "Age", value: val(a.age) },
        {
          label: "Sex",
          value: val(a.sex === "male" ? "Male" : a.sex === "female" ? "Female" : a.sex === "prefer_not" ? "Prefer not to say" : undefined),
        },
        { label: "Height", value: val(a.heightCm ? `${a.heightCm} cm` : undefined) },
        { label: "Weight", value: val(a.weightKg ? `${a.weightKg} kg` : undefined) },
        { label: "BMI (calculated)", value: val(b) },
        { label: "Country", value: val(a.countryCode ? COUNTRY_MAP[a.countryCode]?.name ?? a.countryCode : undefined) },
        {
          label: "Pregnant, trying or breastfeeding",
          value: val(
            a.pregnancy === "yes" ? "Yes" : a.pregnancy === "no" ? "No" : a.pregnancy === "na" ? "Not applicable" : a.pregnancy === "prefer_not" ? "Prefer not to say" : undefined,
          ),
        },
      ];
    }
    case "medical": {
      const entries = Object.entries(a.conditions).filter(([, s]) => s && s !== "none");
      return [
        {
          label: "Conditions",
          value:
            entries.length > 0 ? (
              <ul className="space-y-1">
                {entries.map(([id, status]) => (
                  <li key={id}>
                    {CONDITION_MAP[id as keyof typeof CONDITION_MAP]?.label ?? id}
                    <span className="ml-2 font-mono text-xs uppercase tracking-wider text-muted">{status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              "None reported"
            ),
        },
        { label: "Other condition", value: val(a.conditionOtherText?.trim()) },
        { label: "Relevant surgery", value: val(yn(a.relevantSurgery)) },
        { label: "Surgery details", value: val(a.surgeryDetails?.trim()) },
        { label: "Current concerning symptoms", value: val(yn(a.currentSymptoms)) },
        { label: "Symptom details", value: val(a.symptomsDetails?.trim()) },
      ];
    }
    case "medications":
      return [
        {
          label: "Prescription medicines",
          value:
            a.prescriptions.length > 0 ? (
              <ul className="space-y-1">
                {a.prescriptions.map((p) => (
                  <li key={p.id}>
                    {p.name}
                    {p.strength && <span className="text-muted"> · {p.strength}</span>}
                    {p.frequency && <span className="text-muted"> · {p.frequency}</span>}
                    {p.classId && <span className="ml-2 font-mono text-xs text-muted">{MEDICATION_CLASS_MAP[p.classId].label}</span>}
                    {p.prescribed === "no" && <span className="ml-2 font-mono text-xs text-caution">not prescribed</span>}
                  </li>
                ))}
              </ul>
            ) : (
              val(a.takesPrescription === "no" ? "None" : undefined)
            ),
        },
        {
          label: "Over-the-counter",
          value: a.otc.length > 0 ? a.otc.map((o) => (o === "other" && a.otcOtherText ? `Other (${a.otcOtherText})` : OTC_LABELS[o])).join(", ") : "None",
        },
        {
          label: "Supplements",
          value:
            a.supplements.length > 0
              ? a.supplements.map((s) => [s.name, s.amount, s.frequency].filter(Boolean).join(" · ")).join("; ")
              : val(a.takesSupplements === "no" ? "None" : undefined),
        },
        { label: "Alcohol", value: val(a.alcohol ? ALCOHOL_LABELS[a.alcohol] : undefined) },
        { label: "Nicotine", value: val(a.nicotine ? NICOTINE_LABELS[a.nicotine] : undefined) },
      ];
    case "risk":
      return [
        ...RISK_QUESTIONS.map((q) => ({ label: RISK_LABELS[q.field], value: val(yn(a[q.field])) })),
        { label: "Details", value: val(a.riskDetails?.trim()) },
        { label: "Competes in drug-tested sport", value: val(yn(a.testedAthlete)) },
      ];
    case "final":
      return [
        { label: "Anything else", value: val(a.anythingElse?.trim()) },
        { label: "Clinician review requested", value: a.contactConsent ? "Yes" : "No" },
        { label: "Contact email", value: val(a.contactConsent ? a.contactEmail : undefined) },
      ];
    default:
      return [];
  }
}

export function ResponsesAppendix({ answers }: { answers: AssessmentAnswers }) {
  return (
    <Accordion.Root type="multiple" defaultValue={["goals"]} className="divide-y divide-line" data-report-appendix>
      {FLOW_SECTIONS.map((id, i) => {
        const meta = SECTION_META[id];
        const skipped = answers.skippedSections.includes(id);
        const completed = answers.completedSections.includes(id);
        const rows = rowsFor(id, answers);
        return (
          <Accordion.Item key={id} value={id} className="break-inside-avoid">
            <Accordion.Header>
              <Accordion.Trigger className="group flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left hover:text-brand-600">
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="label-mono tnum">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] font-bold text-ink group-hover:text-inherit">{meta.title}</span>
                  <span className={cn("font-mono text-[10.5px] uppercase tracking-[0.1em]", skipped ? "text-caution" : "text-muted-2")}>
                    {skipped ? "Skipped" : completed ? "Completed" : "Not completed"}
                  </span>
                </span>
                <ChevronDown
                  className="no-print h-4 w-4 shrink-0 text-ink transition-transform duration-150 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content forceMount className="pb-5 data-[state=closed]:hidden print:block!">
              <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[14rem_1fr]">
                {rows.map((r) => (
                  <React.Fragment key={r.label}>
                    <MonoLabel as="dt" className="pt-0.5">
                      {r.label}
                    </MonoLabel>
                    <dd className="text-sm leading-relaxed text-ink-2">{r.value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
