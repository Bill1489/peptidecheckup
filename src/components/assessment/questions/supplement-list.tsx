"use client";

import * as React from "react";
import { AnimatePresence } from "motion/react";
import { useAssessmentStore } from "@/lib/assessment/store";
import type { SupplementEntry } from "@/lib/assessment/types";
import { uid } from "@/lib/utils";
import { useAnswers, useDebouncedField } from "../hooks";
import { AddButton, EntryCard, Field, Select, TextInput } from "../primitives";
import { DebouncedText, FREQUENCY_CHOICES } from "./medication-list";

/** Q21 — repeatable supplement entries (name, amount, frequency). */
export function SupplementList({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const entries = answers.supplements;

  const add = React.useCallback(() => {
    const current = useAssessmentStore.getState().answers.supplements;
    setAnswers({ supplements: [...current, { id: uid("supp"), name: "" }] });
  }, [setAnswers]);

  React.useEffect(() => {
    if (useAssessmentStore.getState().answers.supplements.length === 0) add();
  }, [add]);

  const remove = (id: string) => {
    const current = useAssessmentStore.getState().answers.supplements;
    setAnswers({ supplements: current.filter((s) => s.id !== id) });
  };

  const patch = (id: string, changes: Partial<SupplementEntry>) => {
    const current = useAssessmentStore.getState().answers.supplements;
    setAnswers({ supplements: current.map((s) => (s.id === id ? { ...s, ...changes } : s)) });
  };

  return (
    <div className="grid gap-4">
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => (
          <SupplementCard
            key={entry.id}
            entry={entry}
            index={i}
            showErrors={showErrors}
            onRemove={() => remove(entry.id)}
            onPatch={(changes) => patch(entry.id, changes)}
          />
        ))}
      </AnimatePresence>
      <AddButton onClick={add}>Add another supplement</AddButton>
    </div>
  );
}

function SupplementCard({
  entry,
  index,
  showErrors,
  onRemove,
  onPatch,
}: {
  entry: SupplementEntry;
  index: number;
  showErrors?: boolean;
  onRemove: () => void;
  onPatch: (changes: Partial<SupplementEntry>) => void;
}) {
  const commitName = React.useCallback((v: string) => onPatch({ name: v }), [onPatch]);
  const [name, updateName, flushName] = useDebouncedField(entry.name, commitName);
  const invalid = Boolean(showErrors && !name.trim());

  return (
    <EntryCard index={index} title="Supplement" onRemove={onRemove} removeLabel={`Remove supplement ${index + 1}`} invalid={invalid}>
      <Field label="Name" htmlFor={`${entry.id}-name`} error={invalid ? "Enter the supplement's name." : undefined}>
        <TextInput
          id={`${entry.id}-name`}
          value={name}
          placeholder="e.g. Vitamin D, creatine, ashwagandha"
          aria-invalid={invalid || undefined}
          data-autofocus={index === 0 ? "always" : undefined}
          onChange={(e) => updateName(e.target.value)}
          onBlur={flushName}
          onKeyDown={(e) => {
            if (e.key === "Enter") flushName();
          }}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <DebouncedText
          id={`${entry.id}-amount`}
          label="Amount"
          placeholder="e.g. 4000 IU"
          value={entry.amount ?? ""}
          onCommit={(v) => onPatch({ amount: v })}
        />
        <Field label="Frequency" htmlFor={`${entry.id}-freq`} optional>
          <Select id={`${entry.id}-freq`} value={entry.frequency ?? ""} onChange={(e) => onPatch({ frequency: e.target.value || undefined })}>
            <option value="">Select</option>
            {FREQUENCY_CHOICES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </EntryCard>
  );
}
