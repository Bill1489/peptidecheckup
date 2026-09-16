"use client";

import * as React from "react";
import { cmToImperial, imperialToCm, kgToLb, lbToKg, lbToStoneLb } from "@/lib/assessment/derived";
import { bmi } from "@/lib/utils";
import { useAnswers, useSetAnswer } from "../hooks";
import { Field, FieldError, Segmented, TextInput } from "../primitives";

type UnitSystem = "metric" | "imperial";

function num(s: string): number | undefined {
  if (s.trim() === "") return undefined;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

function clean(s: string, decimals: boolean) {
  const re = decimals ? /[^\d.,]/g : /[^\d]/g;
  return s.replace(re, "").slice(0, 6);
}

/**
 * Q12 + Q13 — height & weight with a metric / imperial toggle and a live,
 * neutrally-worded BMI readout. Store values are always metric (cm / kg).
 */
export function BodyMetrics({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();
  const system: UnitSystem = answers.unitSystem;

  const initialImperial = answers.heightCm ? cmToImperial(answers.heightCm) : undefined;
  const [cm, setCm] = React.useState(answers.heightCm ? String(answers.heightCm) : "");
  const [kg, setKg] = React.useState(answers.weightKg ? String(answers.weightKg) : "");
  const [feet, setFeet] = React.useState(initialImperial ? String(initialImperial.feet) : "");
  const [inches, setInches] = React.useState(initialImperial ? String(initialImperial.inches) : "");
  const [lb, setLb] = React.useState(answers.weightKg ? String(kgToLb(answers.weightKg)) : "");

  const switchSystem = (next: UnitSystem) => {
    if (next === system) return;
    setAnswer("unitSystem", next);
    // Re-derive the display strings for the new system from the stored metric values.
    if (next === "imperial") {
      const imp = answers.heightCm ? cmToImperial(answers.heightCm) : undefined;
      setFeet(imp ? String(imp.feet) : "");
      setInches(imp ? String(imp.inches) : "");
      setLb(answers.weightKg ? String(kgToLb(answers.weightKg)) : "");
    } else {
      setCm(answers.heightCm ? String(answers.heightCm) : "");
      setKg(answers.weightKg ? String(answers.weightKg) : "");
    }
  };

  const commitImperialHeight = (f: string, i: string) => {
    const ft = num(f);
    const inch = num(i) ?? 0;
    setAnswer("heightCm", ft === undefined ? undefined : imperialToCm(ft, inch));
  };

  const value = bmi(answers.heightCm, answers.weightKg);
  const heightInvalid = Boolean(showErrors && !(answers.heightCm && answers.heightCm >= 100 && answers.heightCm <= 250));
  const weightInvalid = Boolean(showErrors && !(answers.weightKg && answers.weightKg >= 30 && answers.weightKg <= 350));
  const stones = num(lb) !== undefined ? lbToStoneLb(num(lb) as number) : undefined;

  return (
    <div className="grid gap-6">
      <div className="max-w-xs">
        <Segmented<UnitSystem>
          label="Units"
          value={system}
          onChange={switchSystem}
          options={[
            { value: "metric", label: "Metric" },
            { value: "imperial", label: "Imperial" },
          ]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {system === "metric" ? (
          <Field label="Height" htmlFor="height-cm" error={heightInvalid ? "Enter a height between 100 and 250 cm." : undefined}>
            <div className="relative">
              <TextInput
                id="height-cm"
                type="text"
                inputMode="numeric"
                data-autofocus="always"
                value={cm}
                aria-invalid={heightInvalid || undefined}
                placeholder="175"
                onChange={(e) => {
                  const v = clean(e.target.value, false);
                  setCm(v);
                  setAnswer("heightCm", num(v));
                }}
                className="pr-12 font-mono tnum"
              />
              <Unit>cm</Unit>
            </div>
          </Field>
        ) : (
          <Field label="Height" htmlFor="height-ft" error={heightInvalid ? "Enter a height between 3 ft 4 in and 8 ft 2 in." : undefined}>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <TextInput
                  id="height-ft"
                  type="text"
                  inputMode="numeric"
                  data-autofocus="always"
                  value={feet}
                  aria-invalid={heightInvalid || undefined}
                  aria-label="Feet"
                  placeholder="5"
                  onChange={(e) => {
                    const v = clean(e.target.value, false).slice(0, 1);
                    setFeet(v);
                    commitImperialHeight(v, inches);
                  }}
                  className="pr-10 font-mono tnum"
                />
                <Unit>ft</Unit>
              </div>
              <div className="relative">
                <TextInput
                  id="height-in"
                  type="text"
                  inputMode="numeric"
                  value={inches}
                  aria-invalid={heightInvalid || undefined}
                  aria-label="Inches"
                  placeholder="9"
                  onChange={(e) => {
                    let v = clean(e.target.value, false).slice(0, 2);
                    if (num(v) !== undefined && (num(v) as number) > 11) v = "11";
                    setInches(v);
                    commitImperialHeight(feet, v);
                  }}
                  className="pr-10 font-mono tnum"
                />
                <Unit>in</Unit>
              </div>
            </div>
          </Field>
        )}

        {system === "metric" ? (
          <Field label="Weight" htmlFor="weight-kg" error={weightInvalid ? "Enter a weight between 30 and 350 kg." : undefined}>
            <div className="relative">
              <TextInput
                id="weight-kg"
                type="text"
                inputMode="decimal"
                value={kg}
                aria-invalid={weightInvalid || undefined}
                placeholder="80"
                onChange={(e) => {
                  const v = clean(e.target.value, true);
                  setKg(v);
                  const n = num(v);
                  setAnswer("weightKg", n === undefined ? undefined : Math.round(n * 10) / 10);
                }}
                className="pr-12 font-mono tnum"
              />
              <Unit>kg</Unit>
            </div>
          </Field>
        ) : (
          <Field
            label="Weight"
            htmlFor="weight-lb"
            hint={stones && stones.stone > 0 ? `About ${stones.stone} st ${stones.lb} lb` : undefined}
            error={weightInvalid ? "Enter a weight between 66 and 770 lb." : undefined}
          >
            <div className="relative">
              <TextInput
                id="weight-lb"
                type="text"
                inputMode="decimal"
                value={lb}
                aria-invalid={weightInvalid || undefined}
                placeholder="176"
                onChange={(e) => {
                  const v = clean(e.target.value, true);
                  setLb(v);
                  const n = num(v);
                  setAnswer("weightKg", n === undefined ? undefined : lbToKg(n));
                }}
                className="pr-12 font-mono tnum"
              />
              <Unit>lb</Unit>
            </div>
          </Field>
        )}
      </div>

      {value !== undefined && (
        <div className="flex flex-wrap items-center gap-4 border border-ink bg-paper-2 px-4 py-3">
          <span className="inline-flex items-baseline gap-2 font-mono">
            <span className="label-mono">BMI</span>
            <span className="text-[1.35rem] font-medium leading-none tnum text-ink" aria-live="polite">
              {value.toFixed(1)}
            </span>
          </span>
          <span className="text-xs leading-relaxed text-muted">
            Shown for reference only. BMI is one input among many and is used to interpret licensing criteria and study populations.
          </span>
        </div>
      )}

      {showErrors && !heightInvalid && !weightInvalid && value === undefined && (
        <FieldError>Enter a height and weight so we can calculate your BMI.</FieldError>
      )}
    </div>
  );
}

function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span className="label-mono pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">{children}</span>
  );
}
