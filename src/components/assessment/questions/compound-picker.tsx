"use client";

import * as React from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Plus, Search, Sparkles } from "lucide-react";
import { COMPOUNDS, compoundsForGoal, searchCompounds } from "@/data/compounds";
import { GOAL_MAP } from "@/data/goals";
import { EVIDENCE_LABELS, FAMILY_LABELS, type Compound, type CompoundFamily, type EvidenceQuality } from "@/data/types";
import type { ConsideredCompound } from "@/lib/assessment/types";
import { useAssessmentStore } from "@/lib/assessment/store";
import { cn } from "@/lib/utils";
import { EvidenceMeter } from "@/components/ui/badge";
import { useAnswers, useDebouncedField } from "../hooks";
import { EASE, Field, RemovableChip, TextInput } from "../primitives";

const GROUP_CLASS =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.65rem] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-brand-700";

const FAMILY_ORDER = Object.keys(FAMILY_LABELS) as CompoundFamily[];

/**
 * Q5 — searchable multi-select over the compound registry. Goal-relevant
 * suggestions first (from `compoundsForGoal`), then everything grouped by
 * family. Never hard-codes slugs.
 */
export function CompoundPicker({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const [query, setQuery] = React.useState("");
  const [showOther, setShowOther] = React.useState(Boolean(answers.otherCompoundText));
  const reduced = useReducedMotion();

  const selected = answers.consideredCompounds;
  const selectedSlugs = React.useMemo(() => new Set(selected.map((c) => c.slug)), [selected]);
  const goal = answers.primaryGoal;
  const goalLabel = goal ? GOAL_MAP[goal]?.label : undefined;

  const goalMatches = React.useMemo(() => (goal ? compoundsForGoal(goal) : []), [goal]);
  const evidenceFor = React.useCallback(
    (c: Compound): EvidenceQuality | undefined => (goal ? c.goals.find((g) => g.goal === goal)?.evidence : undefined),
    [goal],
  );

  const trimmed = query.trim();
  const results = React.useMemo(() => (trimmed ? searchCompounds(trimmed, 12) : null), [trimmed]);

  const families = React.useMemo(
    () =>
      FAMILY_ORDER.map((family) => ({ family, compounds: COMPOUNDS.filter((c) => c.family === family) })).filter(
        (g) => g.compounds.length > 0,
      ),
    [],
  );

  const toggle = (slug: string) => {
    const a = useAssessmentStore.getState().answers;
    const exists = a.consideredCompounds.some((c) => c.slug === slug);
    let consideredCompounds: ConsideredCompound[];
    let combinations = a.combinations;
    if (exists) {
      consideredCompounds = a.consideredCompounds.filter((c) => c.slug !== slug);
      combinations = a.combinations.map((combo) => combo.filter((s) => s !== slug)).filter((combo) => combo.length >= 2);
    } else {
      consideredCompounds = [...a.consideredCompounds, { slug }];
    }
    setAnswers({ consideredCompounds, combinations });
  };

  const addOther = () => {
    setAnswers({ otherCompoundText: trimmed });
    setShowOther(true);
    setQuery("");
  };

  const invalid = Boolean(showErrors && selected.length === 0 && !answers.otherCompoundText?.trim());

  return (
    <div className="grid gap-5">
      <AnimatePresence initial={false}>
        {selected.length > 0 && (
          <motion.div
            key="selected"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2" aria-label="Selected compounds">
              {selected.map((c) => {
                const compound = COMPOUNDS.find((x) => x.slug === c.slug);
                return (
                  <RemovableChip key={c.slug} label={compound?.name ?? c.slug} onRemove={() => toggle(c.slug)}>
                    {compound?.name ?? c.slug}
                  </RemovableChip>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Command
        shouldFilter={false}
        label="Search compounds"
        loop
        className={cn(
          "overflow-hidden rounded-2xl border bg-white shadow-soft",
          invalid ? "border-concern/60" : "border-line",
        )}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-2" aria-hidden />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search by name, brand or class"
            data-autofocus="pointer"
            className="h-13 w-full bg-transparent text-base text-ink placeholder:text-muted-2 focus:outline-none"
          />
        </div>

        <Command.List className="max-h-[26rem] overflow-y-auto p-1.5">
          {results ? (
            <>
              {results.length === 0 && (
                <p className="px-4 pb-2 pt-6 text-center text-sm text-muted">
                  Nothing in our database matches “{trimmed}”.
                </p>
              )}
              {results.map((c) => (
                <CompoundItem
                  key={c.slug}
                  value={`result:${c.slug}`}
                  compound={c}
                  selected={selectedSlugs.has(c.slug)}
                  evidence={evidenceFor(c)}
                  onSelect={() => toggle(c.slug)}
                />
              ))}
              <Command.Item
                value={`other:${trimmed}`}
                onSelect={addOther}
                className="mt-1 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line-strong px-3 py-2 text-sm text-brand-700 transition-colors data-[selected=true]:bg-brand-50"
              >
                <Plus className="h-4 w-4 shrink-0" aria-hidden />
                <span>
                  Add “{trimmed}” as something else
                </span>
              </Command.Item>
            </>
          ) : (
            <>
              {goalMatches.length > 0 && goalLabel && (
                <Command.Group
                  heading={
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" aria-hidden />
                      Researched for {goalLabel.toLowerCase()}
                    </span>
                  }
                  className={GROUP_CLASS}
                >
                  {goalMatches.map(({ compound, evidence }) => (
                    <CompoundItem
                      key={compound.slug}
                      value={`goal:${compound.slug}`}
                      compound={compound}
                      selected={selectedSlugs.has(compound.slug)}
                      evidence={evidence}
                      onSelect={() => toggle(compound.slug)}
                    />
                  ))}
                </Command.Group>
              )}
              {families.map(({ family, compounds }) => (
                <Command.Group
                  key={family}
                  heading={goalMatches.length ? `All compounds · ${FAMILY_LABELS[family]}` : FAMILY_LABELS[family]}
                  className={GROUP_CLASS}
                >
                  {compounds.map((c) => (
                    <CompoundItem
                      key={c.slug}
                      value={`${family}:${c.slug}`}
                      compound={c}
                      selected={selectedSlugs.has(c.slug)}
                      evidence={evidenceFor(c)}
                      onSelect={() => toggle(c.slug)}
                    />
                  ))}
                </Command.Group>
              ))}
            </>
          )}
        </Command.List>
      </Command>

      <div className="grid gap-3">
        {!showOther ? (
          <button
            type="button"
            onClick={() => setShowOther(true)}
            className="inline-flex min-h-11 items-center justify-self-start text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
          >
            Considering something that isn&apos;t listed?
          </button>
        ) : (
          <OtherCompoundField />
        )}
      </div>
    </div>
  );
}

function CompoundItem({
  value,
  compound,
  selected,
  evidence,
  onSelect,
}: {
  value: string;
  compound: Compound;
  selected: boolean;
  evidence?: EvidenceQuality;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={value}
      keywords={[compound.name, ...compound.aliases]}
      onSelect={onSelect}
      aria-checked={selected}
      className={cn(
        "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors",
        "data-[selected=true]:bg-paper-2",
        selected && "bg-brand-50 data-[selected=true]:bg-brand-50",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          selected ? "border-brand-500 bg-brand-500 text-white" : "border-line-strong bg-white text-transparent",
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.95rem] font-medium text-ink">{compound.name}</span>
        <span className="block truncate text-xs text-muted">{compound.classLabel}</span>
      </span>
      {evidence && (
        <span className="flex shrink-0 flex-col items-end gap-1">
          <EvidenceMeter level={evidence} />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-2">
            {EVIDENCE_LABELS[evidence]}
          </span>
        </span>
      )}
    </Command.Item>
  );
}

function OtherCompoundField() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const commit = React.useCallback((v: string) => setAnswers({ otherCompoundText: v }), [setAnswers]);
  const [value, update, flush] = useDebouncedField(answers.otherCompoundText ?? "", commit);

  return (
    <div className="rounded-2xl border border-line bg-paper-2/60 p-4">
      <Field
        label="Something else"
        htmlFor="other-compound"
        hint="We'll include it in your report as “not in our database” so a clinician can look into it."
      >
        <TextInput
          id="other-compound"
          value={value}
          placeholder="Name of the compound or product"
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
