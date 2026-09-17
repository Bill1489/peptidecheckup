"use client";

import * as React from "react";
import { ALCOHOL_LABELS, NICOTINE_LABELS, type AlcoholUse, type NicotineUse } from "@/lib/assessment/types";
import { useAnswers, useSetAnswer } from "../hooks";
import { FieldError, MonoLabel } from "../primitives";
import { OptionCards } from "./option-cards";

const ALCOHOL = (Object.keys(ALCOHOL_LABELS) as AlcoholUse[]).map((value) => ({ value, label: ALCOHOL_LABELS[value] }));
const NICOTINE = (Object.keys(NICOTINE_LABELS) as NicotineUse[]).map((value) => ({ value, label: NICOTINE_LABELS[value] }));

/** Alcohol and nicotine on one screen — two single-select groups, no auto-advance. */
export function LifestyleStep({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <MonoLabel>Alcohol · in a typical week</MonoLabel>
        <OptionCards label="Alcohol" options={ALCOHOL} value={answers.alcohol} onChange={(v) => setAnswer("alcohol", v as AlcoholUse)} columns={2} numbered={false} />
        {showErrors && !answers.alcohol && <FieldError>Choose one option for alcohol.</FieldError>}
      </div>
      <div className="grid gap-3">
        <MonoLabel>Nicotine · cigarettes, vapes, pouches, patches or gum</MonoLabel>
        <OptionCards label="Nicotine" options={NICOTINE} value={answers.nicotine} onChange={(v) => setAnswer("nicotine", v as NicotineUse)} columns={2} numbered={false} />
        {showErrors && !answers.nicotine && <FieldError>Choose one option for nicotine.</FieldError>}
      </div>
    </div>
  );
}
