"use client";

import * as React from "react";
import { AnimatePresence } from "motion/react";
import { searchCompounds } from "@/data/compounds";
import type { Compound } from "@/data/types";
import { useAssessmentStore } from "@/lib/assessment/store";
import {
  ADVERSE_LABELS,
  DURATION_LABELS,
  type AdverseSeverity,
  type PreviousUse,
  type YesNo,
} from "@/lib/assessment/types";
import { uid } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAnswers, useDebouncedField } from "../hooks";
import { AddButton, Chip, Combobox, EntryCard, Field, Reveal, Segmented, Select } from "../primitives";

type Duration = NonNullable<PreviousUse["duration"]>;
const DURATIONS = Object.keys(DURATION_LABELS) as Duration[];
const ADVERSE = Object.keys(ADVERSE_LABELS) as AdverseSeverity[];

/** Q26–Q30 — one entry per previously used compound. */
export function PreviousUseList({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const entries = answers.previousUses;

  const add = React.useCallback(() => {
    const current = useAssessmentStore.getState().answers.previousUses;
    setAnswers({ previousUses: [...current, { id: uid("use"), name: "" }] });
  }, [setAnswers]);

  React.useEffect(() => {
    if (useAssessmentStore.getState().answers.previousUses.length === 0) add();
  }, [add]);

  const remove = (id: string) => {
    const current = useAssessmentStore.getState().answers.previousUses;
    setAnswers({ previousUses: current.filter((u) => u.id !== id) });
  };

  const patch = (id: string, changes: Partial<PreviousUse>) => {
    const current = useAssessmentStore.getState().answers.previousUses;
    setAnswers({ previousUses: current.map((u) => (u.id === id ? { ...u, ...changes } : u)) });
  };

  return (
    <div className="grid gap-4">
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => (
          <PreviousUseCard
            key={entry.id}
            entry={entry}
            index={i}
            showErrors={showErrors}
            onRemove={() => remove(entry.id)}
            onPatch={(changes) => patch(entry.id, changes)}
          />
        ))}
      </AnimatePresence>
      <AddButton onClick={add}>Add another compound</AddButton>
    </div>
  );
}

function PreviousUseCard({
  entry,
  index,
  showErrors,
  onRemove,
  onPatch,
}: {
  entry: PreviousUse;
  index: number;
  showErrors?: boolean;
  onRemove: () => void;
  onPatch: (changes: Partial<PreviousUse>) => void;
}) {
  const commitName = React.useCallback(
    (text: string) => {
      const q = text.trim().toLowerCase();
      const exact = q
        ? searchCompounds(q, 5).find((c) => c.name.toLowerCase() === q || c.aliases.some((a) => a.toLowerCase() === q))
        : undefined;
      onPatch({ name: text, slug: exact?.slug });
    },
    [onPatch],
  );
  const [name, updateName, flushName] = useDebouncedField(entry.name, commitName);
  const suggestions = React.useMemo(() => (name.trim().length >= 2 ? searchCompounds(name, 6) : []), [name]);
  const invalid = Boolean(showErrors && !name.trim());
  const hadAdverse = entry.adverse === "mild" || entry.adverse === "moderate" || entry.adverse === "severe";

  return (
    <EntryCard index={index} title="Compound" onRemove={onRemove} removeLabel={`Remove compound ${index + 1}`} invalid={invalid}>
      <Field
        label="Which compound?"
        htmlFor={`${entry.id}-name`}
        error={invalid ? "Enter the compound's name." : undefined}
        hint={
          entry.slug ? (
            <span className="inline-flex items-center gap-2">
              <Badge tone="brand" size="xs">
                In our database
              </Badge>
              We&apos;ll link your experience to its record.
            </span>
          ) : (
            "Search our database, or type any name."
          )
        }
      >
        <Combobox<Compound>
          id={`${entry.id}-name`}
          value={name}
          onInputChange={updateName}
          onBlur={flushName}
          onKeyDown={(e) => {
            if (e.key === "Enter") flushName();
          }}
          items={suggestions}
          getKey={(c) => c.slug}
          onSelect={(c) => {
            updateName(c.name);
            onPatch({ name: c.name, slug: c.slug });
          }}
          renderItem={(c) => (
            <span className="flex items-center justify-between gap-3">
              <span className="font-medium text-ink">{c.name}</span>
              <span className="text-xs text-muted">{c.classLabel}</span>
            </span>
          )}
          placeholder="Start typing"
          invalid={invalid}
          autoFocus={index === 0 ? "always" : undefined}
        />
      </Field>

      <Field label="How long did you use it for?" htmlFor={`${entry.id}-duration`} optional>
        <Select id={`${entry.id}-duration`} value={entry.duration ?? ""} onChange={(e) => onPatch({ duration: (e.target.value || undefined) as Duration | undefined })}>
          <option value="">Select</option>
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {DURATION_LABELS[d]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Did you have any adverse effects?" optional>
        <div role="radiogroup" aria-label="Adverse effects" className="flex flex-wrap gap-2">
          {ADVERSE.map((level) => (
            <Chip
              key={level}
              role="radio"
              aria-checked={entry.adverse === level}
              selected={entry.adverse === level}
              onClick={() => onPatch({ adverse: level, ...(level === "none" || level === "unsure" ? { stoppedDueToAdverse: undefined } : {}) })}
            >
              {ADVERSE_LABELS[level]}
            </Chip>
          ))}
        </div>
      </Field>

      <Reveal show={hadAdverse}>
        <Field label="Did you stop because of them?" optional>
          <div className="max-w-xs">
            <Segmented<YesNo>
              label="Stopped because of adverse effects"
              value={entry.stoppedDueToAdverse}
              onChange={(v) => onPatch({ stoppedDueToAdverse: v })}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>
        </Field>
      </Reveal>

      <Field label="Was your use supervised by a clinician?" optional>
        <div className="max-w-xs">
          <Segmented<YesNo>
            label="Supervised by a clinician"
            value={entry.supervised}
            onChange={(v) => onPatch({ supervised: v })}
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
