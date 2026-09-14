"use client";

import * as React from "react";
import { AnimatePresence } from "motion/react";
import { MEDICATION_CLASS_MAP, MEDICATIONS, searchMedications } from "@/data/medications";
import type { MedicationDef } from "@/data/types";
import { useAssessmentStore } from "@/lib/assessment/store";
import type { MedicationEntry, YesNo } from "@/lib/assessment/types";
import { uid } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAnswers, useDebouncedField } from "../hooks";
import { AddButton, Combobox, EntryCard, Field, Segmented, Select, TextInput } from "../primitives";

export const FREQUENCY_CHOICES = ["Once daily", "Twice daily", "Weekly", "As needed", "Other"] as const;

function exactMatch(text: string): MedicationDef | undefined {
  const q = text.trim().toLowerCase();
  if (!q) return undefined;
  return MEDICATIONS.find((m) => m.name.toLowerCase() === q || m.aliases.some((a) => a.toLowerCase() === q));
}

/**
 * Q19 — repeatable prescription entries. The name field autocompletes from
 * `searchMedications`; a match fills `medicationId` + `classId`, otherwise
 * free text is stored with classId "other".
 */
export function MedicationList({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const entries = answers.prescriptions;

  const add = React.useCallback(() => {
    const current = useAssessmentStore.getState().answers.prescriptions;
    setAnswers({ prescriptions: [...current, { id: uid("rx"), name: "" }] });
  }, [setAnswers]);

  // Always show at least one entry card (empty entries are pruned by the wizard on leaving the step).
  React.useEffect(() => {
    if (useAssessmentStore.getState().answers.prescriptions.length === 0) add();
  }, [add]);

  const remove = (id: string) => {
    const current = useAssessmentStore.getState().answers.prescriptions;
    setAnswers({ prescriptions: current.filter((p) => p.id !== id) });
  };

  const patch = (id: string, changes: Partial<MedicationEntry>) => {
    const current = useAssessmentStore.getState().answers.prescriptions;
    setAnswers({ prescriptions: current.map((p) => (p.id === id ? { ...p, ...changes } : p)) });
  };

  return (
    <div className="grid gap-4">
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => (
          <MedicationCard
            key={entry.id}
            entry={entry}
            index={i}
            showErrors={showErrors}
            onRemove={() => remove(entry.id)}
            onPatch={(changes) => patch(entry.id, changes)}
          />
        ))}
      </AnimatePresence>
      <AddButton onClick={add}>Add another medicine</AddButton>
    </div>
  );
}

function MedicationCard({
  entry,
  index,
  showErrors,
  onRemove,
  onPatch,
}: {
  entry: MedicationEntry;
  index: number;
  showErrors?: boolean;
  onRemove: () => void;
  onPatch: (changes: Partial<MedicationEntry>) => void;
}) {
  const commitName = React.useCallback(
    (text: string) => {
      const match = exactMatch(text);
      onPatch(
        match
          ? { name: text, medicationId: match.id, classId: match.classId }
          : { name: text, medicationId: undefined, classId: text.trim() ? "other" : undefined },
      );
    },
    [onPatch],
  );
  const [name, updateName, flushName] = useDebouncedField(entry.name, commitName);
  const suggestions = React.useMemo(() => searchMedications(name, 6), [name]);
  const matchedClass = entry.medicationId && entry.classId ? MEDICATION_CLASS_MAP[entry.classId] : undefined;
  const invalid = Boolean(showErrors && !name.trim());

  return (
    <EntryCard index={index} title="Medicine" onRemove={onRemove} removeLabel={`Remove medicine ${index + 1}`} invalid={invalid}>
      <Field
        label="Name"
        htmlFor={`${entry.id}-name`}
        error={invalid ? "Enter the medicine's name." : undefined}
        hint={
          matchedClass ? (
            <span className="inline-flex items-center gap-2">
              <Badge tone="brand" size="xs">
                Matched
              </Badge>
              {matchedClass.label}
            </span>
          ) : name.trim() && !entry.medicationId ? (
            "Not in our dictionary — we'll include it as typed."
          ) : (
            "Generic or brand name, e.g. metformin or Ozempic."
          )
        }
      >
        <Combobox<MedicationDef>
          id={`${entry.id}-name`}
          value={name}
          onInputChange={updateName}
          onBlur={flushName}
          onKeyDown={(e) => {
            if (e.key === "Enter") flushName();
          }}
          items={suggestions}
          getKey={(m) => m.id}
          onSelect={(m) => {
            updateName(m.name);
            onPatch({ name: m.name, medicationId: m.id, classId: m.classId });
          }}
          renderItem={(m) => (
            <span className="flex items-center justify-between gap-3">
              <span>
                <span className="font-medium text-ink">{m.name}</span>
                {m.aliases.length > 0 && <span className="ml-2 text-xs text-muted">{m.aliases.slice(0, 3).join(", ")}</span>}
              </span>
              <span className="hidden text-xs text-muted-2 sm:inline">{MEDICATION_CLASS_MAP[m.classId]?.label}</span>
            </span>
          )}
          placeholder="Start typing"
          invalid={invalid}
          autoFocus={index === 0 ? "always" : undefined}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <DebouncedText
          id={`${entry.id}-strength`}
          label="Strength"
          placeholder="e.g. 500 mg"
          value={entry.strength ?? ""}
          onCommit={(v) => onPatch({ strength: v })}
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

      <DebouncedText
        id={`${entry.id}-reason`}
        label="What is it for?"
        placeholder="e.g. Blood pressure"
        value={entry.reason ?? ""}
        onCommit={(v) => onPatch({ reason: v })}
      />

      <Field label="Prescribed by a clinician?" optional>
        <div className="max-w-xs">
          <Segmented<YesNo>
            label="Prescribed by a clinician"
            value={entry.prescribed}
            onChange={(v) => onPatch({ prescribed: v })}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
        </div>
      </Field>
    </EntryCard>
  );
}

/** Small debounced text field for optional entry details. */
export function DebouncedText({
  id,
  label,
  placeholder,
  value,
  onCommit,
  optional = true,
  autoFocus,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onCommit: (value: string) => void;
  optional?: boolean;
  autoFocus?: "always" | "pointer";
}) {
  const [local, update, flush] = useDebouncedField(value, onCommit);
  return (
    <Field label={label} htmlFor={id} optional={optional}>
      <TextInput
        id={id}
        value={local}
        placeholder={placeholder}
        data-autofocus={autoFocus}
        onChange={(e) => update(e.target.value)}
        onBlur={flush}
        onKeyDown={(e) => {
          if (e.key === "Enter") flush();
        }}
      />
    </Field>
  );
}
