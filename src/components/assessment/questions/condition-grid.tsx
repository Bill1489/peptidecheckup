"use client";

import * as React from "react";
import { CircleCheck } from "lucide-react";
import type { ConditionDef, ConditionId, ConditionStatus } from "@/data/types";
import { conditionRows, joinNatural } from "@/lib/assessment/derived";
import { useAssessmentStore } from "@/lib/assessment/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAnswers, useDebouncedField } from "../hooks";
import { Field, MonoLabel, Reveal, Segmented, TextInput } from "../primitives";

const STATUS_OPTIONS: { value: ConditionStatus; label: string }[] = [
  { value: "current", label: "Current" },
  { value: "previous", label: "Previous" },
  { value: "unsure", label: "Unsure" },
  { value: "none", label: "None" },
];

/**
 * Q16 — base conditions plus any extended conditions referenced by the
 * selected compounds' contraindications. One tap per row; default "None".
 */
export function ConditionGrid() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const { base, extended } = React.useMemo(() => conditionRows(answers), [answers]);

  const statusOf = (id: ConditionId): ConditionStatus => answers.conditions[id] ?? "none";

  const setStatus = (id: ConditionId, status: ConditionStatus) => {
    const current = useAssessmentStore.getState().answers.conditions;
    setAnswers({ conditions: { ...current, [id]: status } });
  };

  const clearAll = () => {
    const all: Partial<Record<ConditionId, ConditionStatus>> = {};
    for (const c of base) all[c.id] = "none";
    for (const row of extended) all[row.condition.id] = "none";
    setAnswers({ conditions: all, conditionOtherText: undefined });
  };

  const reported = [...base, ...extended.map((e) => e.condition)].filter((c) => statusOf(c.id) !== "none").length;
  const otherActive = statusOf("other") === "current" || statusOf("other") === "previous" || statusOf("other") === "unsure";

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {reported === 0 ? "Nothing reported yet." : `${reported} ${reported === 1 ? "row" : "rows"} reported.`}
        </p>
        <Button variant="secondary" size="sm" onClick={clearAll}>
          <CircleCheck className="h-4 w-4" aria-hidden />
          I&apos;ve had none of these
        </Button>
      </div>

      <ul className="grid gap-2.5" aria-label="Medical history">
        {base.map((c) => (
          <ConditionRow key={c.id} condition={c} value={statusOf(c.id)} onChange={(s) => setStatus(c.id, s)} />
        ))}
      </ul>

      <Reveal show={otherActive}>
        <OtherConditionField />
      </Reveal>

      {extended.length > 0 && (
        <div className="grid gap-3">
          <div>
            <MonoLabel>Specific to your selection</MonoLabel>
            <p className="mt-1 text-sm text-muted">
              Added because {extended.length === 1 ? "a compound you selected references it" : "compounds you selected reference them"}.
            </p>
          </div>
          <ul className="grid gap-2.5" aria-label="Conditions specific to your selection">
            {extended.map(({ condition, compounds }) => (
              <ConditionRow
                key={condition.id}
                condition={condition}
                value={statusOf(condition.id)}
                onChange={(s) => setStatus(condition.id, s)}
                because={joinNatural(compounds)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ConditionRow({
  condition,
  value,
  onChange,
  because,
}: {
  condition: ConditionDef;
  value: ConditionStatus;
  onChange: (status: ConditionStatus) => void;
  because?: string;
}) {
  const reported = value !== "none";
  return (
    <li
      className={cn(
        "grid gap-3 rounded-2xl border bg-white p-4 shadow-soft transition-colors lg:grid-cols-[1fr_20rem] lg:items-center",
        reported ? "border-brand-300" : "border-line",
      )}
    >
      <div className="min-w-0">
        <p className="font-medium text-ink">{condition.label}</p>
        {condition.hint && <p className="mt-0.5 text-xs leading-snug text-muted">{condition.hint}</p>}
        {because && <p className="mt-1 text-xs text-brand-700">Relevant to {because}</p>}
      </div>
      <Segmented<ConditionStatus> label={condition.label} value={value} onChange={onChange} options={STATUS_OPTIONS} size="sm" />
    </li>
  );
}

function OtherConditionField() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const commit = React.useCallback((v: string) => setAnswers({ conditionOtherText: v }), [setAnswers]);
  const [value, update, flush] = useDebouncedField(answers.conditionOtherText ?? "", commit);
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
      <Field label="Which other condition?" htmlFor="condition-other" optional>
        <TextInput
          id="condition-other"
          value={value}
          placeholder="Name of the condition"
          onChange={(e) => update(e.target.value)}
          onBlur={flush}
          onKeyDown={(e) => {
            if (e.key === "Enter") flush();
          }}
        />
      </Field>
    </div>
  );
}
