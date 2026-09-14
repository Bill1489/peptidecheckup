"use client";

import * as React from "react";
import { FlaskConical } from "lucide-react";
import { getCompound } from "@/data/compounds";
import { ROUTE_LABELS, type DoseFrequency, type DoseUnit, type Route } from "@/data/types";
import { useAssessmentStore } from "@/lib/assessment/store";
import { DOSE_FREQUENCY_LABELS } from "@/lib/assessment/summary";
import type { ConsideredCompound, ConsideredDose } from "@/lib/assessment/types";
import { useAnswers, useSetAnswer } from "../hooks";
import { Field, FieldError, InlineNotice, Select, TextInput } from "../primitives";

const UNITS: DoseUnit[] = ["mg", "mcg", "IU", "g"];
const FREQUENCIES: DoseFrequency[] = ["daily", "twice_daily", "three_times_daily", "weekly", "twice_weekly", "monthly", "once", "other"];
const ALL_ROUTES = Object.keys(ROUTE_LABELS) as Route[];

/**
 * Per-compound optional dose (amount, unit, frequency, route). Research
 * information only — the report compares against published study exposures.
 */
export function DoseInput({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();

  const update = (slug: string, patch: Partial<ConsideredDose>) => {
    const current = useAssessmentStore.getState().answers.consideredCompounds;
    const next: ConsideredCompound[] = current.map((c) => {
      if (c.slug !== slug) return c;
      const dose: ConsideredDose = { ...c.dose, ...patch };
      const empty = dose.amount === undefined && !dose.unit && !dose.frequency && !dose.route;
      return empty ? { slug: c.slug } : { ...c, dose };
    });
    setAnswer("consideredCompounds", next);
  };

  return (
    <div className="grid gap-4">
      {answers.consideredCompounds.map((c, i) => {
        const compound = getCompound(c.slug);
        const routes = compound?.routes.length ? compound.routes : ALL_ROUTES;
        const amountInvalid = Boolean(showErrors && c.dose?.amount !== undefined && !(c.dose.amount > 0));
        return (
          <div key={c.slug} className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{compound?.name ?? c.slug}</p>
                {compound && <p className="text-xs text-muted">{compound.classLabel}</p>}
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-2">
                {i + 1} / {answers.consideredCompounds.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid grid-cols-[1fr_6.5rem] gap-2">
                <Field label="Amount" htmlFor={`dose-${c.slug}-amount`} optional>
                  <AmountInput
                    id={`dose-${c.slug}-amount`}
                    initial={c.dose?.amount}
                    invalid={amountInvalid}
                    autoFocus={i === 0}
                    onCommit={(amount) => update(c.slug, { amount })}
                  />
                </Field>
                <Field label="Unit" htmlFor={`dose-${c.slug}-unit`}>
                  <Select
                    id={`dose-${c.slug}-unit`}
                    value={c.dose?.unit ?? ""}
                    onChange={(e) => update(c.slug, { unit: (e.target.value || undefined) as DoseUnit | undefined })}
                  >
                    <option value="">—</option>
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="Frequency" htmlFor={`dose-${c.slug}-freq`} optional>
                <Select
                  id={`dose-${c.slug}-freq`}
                  value={c.dose?.frequency ?? ""}
                  onChange={(e) =>
                    update(c.slug, { frequency: (e.target.value || undefined) as DoseFrequency | undefined })
                  }
                >
                  <option value="">Select</option>
                  {FREQUENCIES.map((f) => (
                    <option key={f} value={f}>
                      {DOSE_FREQUENCY_LABELS[f]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Route" htmlFor={`dose-${c.slug}-route`} optional className="sm:col-span-2">
                <Select
                  id={`dose-${c.slug}-route`}
                  value={c.dose?.route ?? ""}
                  onChange={(e) => update(c.slug, { route: (e.target.value || undefined) as Route | undefined })}
                >
                  <option value="">Select</option>
                  {routes.map((r) => (
                    <option key={r} value={r}>
                      {ROUTE_LABELS[r]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            {amountInvalid && <FieldError className="mt-3">Enter an amount greater than zero, or leave it blank.</FieldError>}
          </div>
        );
      })}

      <InlineNotice tone="brand">
        <span className="flex items-start gap-2">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            Optional — this lets us compare what you are considering against published study exposures. It is research
            information, not a recommendation, and leaving it blank is fine.
          </span>
        </span>
      </InlineNotice>
    </div>
  );
}

/** Text-backed numeric input so decimals like "0.25" can be typed naturally. */
function AmountInput({
  id,
  initial,
  invalid,
  autoFocus,
  onCommit,
}: {
  id: string;
  initial: number | undefined;
  invalid?: boolean;
  autoFocus?: boolean;
  onCommit: (amount: number | undefined) => void;
}) {
  const [text, setText] = React.useState(initial === undefined ? "" : String(initial));
  return (
    <TextInput
      id={id}
      type="text"
      inputMode="decimal"
      placeholder="e.g. 0.25"
      data-autofocus={autoFocus ? "pointer" : undefined}
      value={text}
      aria-invalid={invalid || undefined}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^\d.,]/g, "").slice(0, 8);
        setText(raw);
        const n = raw === "" ? undefined : Number(raw.replace(",", "."));
        onCommit(n === undefined || Number.isNaN(n) ? undefined : n);
      }}
      className="tabular-nums"
    />
  );
}
