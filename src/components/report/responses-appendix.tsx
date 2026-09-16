"use client";

import * as React from "react";
import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { CONDITION_MAP } from "@/data/conditions";
import { COUNTRY_MAP } from "@/data/countries";
import { GOAL_MAP } from "@/data/goals";
import { MEDICATION_CLASS_MAP } from "@/data/medications";
import { getCompound } from "@/data/compounds";
import {
  ADVERSE_LABELS,
  ALCOHOL_LABELS,
  DURATION_LABELS,
  IMPORTANCE_LABELS,
  INFLUENCE_LABELS,
  NICOTINE_LABELS,
  OTC_LABELS,
  RECREATIONAL_LABELS,
  REPORT_WANTS,
  SECTION_META,
  SOURCE_LABELS,
  TIMEFRAME_LABELS,
  type AssessmentAnswers,
  type SectionId,
  type YesNo,
  type YesNoNA,
  type YesNoUnsure,
} from "@/lib/assessment/types";
import { formatUserDose } from "@/lib/engine/rules/dose";
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
    case "goals":
      return [
        {
          label: "Primary goal",
          value: val(a.primaryGoal === "other" ? a.otherGoalText?.trim() || "Other" : a.primaryGoal ? GOAL_MAP[a.primaryGoal].label : undefined),
        },
        { label: "What success looks like", value: val(a.successDescription?.trim()) },
        { label: "Importance", value: val(a.importance ? IMPORTANCE_LABELS[a.importance] : undefined) },
        { label: "Timeframe", value: val(a.timeframe ? TIMEFRAME_LABELS[a.timeframe] : undefined) },
      ];
    case "considering":
      return [
        {
          label: "Compounds",
          value:
            a.consideredCompounds.length > 0 ? (
              <ul className="space-y-1">
                {a.consideredCompounds.map((c) => (
                  <li key={c.slug}>
                    {getCompound(c.slug)?.name ?? c.slug}
                    {c.dose?.amount !== undefined && (
                      <span className="ml-2 font-mono text-xs text-muted">{formatUserDose(c.dose)}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              NOT_ANSWERED
            ),
        },
        { label: "Other compound", value: val(a.otherCompoundText?.trim()) },
        { label: "Currently taking any", value: val(yn(a.currentlyTaking)) },
        {
          label: "Considering more than one",
          value: val(a.consideringMultiple === "not_sure" ? "Not sure" : a.consideringMultiple === "yes" ? "Yes" : a.consideringMultiple === "no" ? "No" : undefined),
        },
        {
          label: "Combinations",
          value:
            a.combinations.length > 0
              ? a.combinations.map((combo) => combo.map((s) => getCompound(s)?.name ?? s).join(" + ")).join("; ")
              : NOT_ANSWERED,
        },
        { label: "Why these compounds", value: val(a.whyChosen?.trim()) },
        {
          label: "Where the idea came from",
          value: a.influence && a.influence.length > 0 ? a.influence.map((i) => INFLUENCE_LABELS[i]).join(", ") : NOT_ANSWERED,
        },
      ];
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
        { label: "Recreational substances", value: val(a.recreational ? RECREATIONAL_LABELS[a.recreational] : undefined) },
        { label: "Alcohol", value: val(a.alcohol ? ALCOHOL_LABELS[a.alcohol] : undefined) },
        { label: "Nicotine", value: val(a.nicotine ? NICOTINE_LABELS[a.nicotine] : undefined) },
      ];
    case "experience":
      return [
        { label: "Used a peptide before", value: val(yn(a.previousPeptideUse)) },
        {
          label: "Previous use",
          value:
            a.previousUses.length > 0 ? (
              <ul className="space-y-1">
                {a.previousUses.map((u) => (
                  <li key={u.id}>
                    {u.name}
                    {u.duration && <span className="text-muted"> · {DURATION_LABELS[u.duration]}</span>}
                    {u.adverse && <span className="text-muted"> · adverse effects: {ADVERSE_LABELS[u.adverse].toLowerCase()}</span>}
                    {u.stoppedDueToAdverse === "yes" && <span className="text-muted"> · stopped because of them</span>}
                    {u.supervised && <span className="text-muted"> · {u.supervised === "yes" ? "supervised" : "unsupervised"}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              NOT_ANSWERED
            ),
        },
        { label: "Previously stopped a treatment as ineffective", value: val(yn(a.stoppedIneffective)) },
      ];
    case "source":
      return [
        {
          label: "Where you would obtain it",
          value: val(a.source ? (a.source === "other" && a.sourceOtherText ? `Other (${a.sourceOtherText})` : SOURCE_LABELS[a.source]) : undefined),
        },
        { label: "Prescribed", value: val(yn(a.prescribed)) },
        { label: "Authorised in your country", value: val(yn(a.authorisedKnown)) },
        { label: "Independent quality documentation", value: val(yn(a.qualityDocs)) },
      ];
    case "risk":
      return [
        { label: "Serious allergic reaction to a medicine", value: val(yn(a.seriousAllergy)) },
        { label: "Known allergy to a component", value: val(yn(a.componentAllergy)) },
        { label: "Previous serious reaction to similar treatment", value: val(yn(a.previousSeriousReaction)) },
        { label: "Unexplained or severe current symptoms", value: val(yn(a.severeSymptoms)) },
        { label: "Advised against this type of treatment", value: val(yn(a.advisedAgainst)) },
        { label: "Under investigation for a relevant condition", value: val(yn(a.underInvestigation)) },
        { label: "Receiving a treatment that could interact", value: val(yn(a.interactingTreatment)) },
        { label: "Details", value: val(a.riskDetails?.trim()) },
      ];
    case "wants":
      return [
        {
          label: "What you wanted the report to tell you",
          value:
            a.reportWants.length > 0
              ? REPORT_WANTS.filter((w) => a.reportWants.includes(w.id))
                  .map((w) => w.label)
                  .join("; ")
              : NOT_ANSWERED,
        },
        { label: "Clinician review requested", value: a.contactConsent ? "Yes" : "No" },
        { label: "Contact email", value: val(a.contactConsent ? a.contactEmail : undefined) },
      ];
    case "final":
      return [{ label: "Anything else", value: val(a.anythingElse?.trim()) }];
  }
}

const APPENDIX_SECTIONS: SectionId[] = [
  "goals",
  "considering",
  "basics",
  "medical",
  "medications",
  "experience",
  "source",
  "risk",
  "wants",
  "final",
];

export function ResponsesAppendix({ answers }: { answers: AssessmentAnswers }) {
  return (
    <Accordion.Root type="multiple" defaultValue={["goals"]} className="divide-y divide-line" data-report-appendix>
      {APPENDIX_SECTIONS.map((id, i) => {
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
