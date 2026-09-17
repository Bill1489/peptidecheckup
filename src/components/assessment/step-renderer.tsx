"use client";

import * as React from "react";
import { stepOptions, type SingleStep, type Step } from "@/lib/assessment/flow";
import type { SectionId } from "@/lib/assessment/types";
import { useAnswers, useSetAnswer } from "./hooks";
import { InlineNotice, Reveal } from "./primitives";
import { BodyMetrics } from "./questions/body-metrics";
import { ConditionGrid } from "./questions/condition-grid";
import { CountryPicker } from "./questions/country-picker";
import { FocusCards } from "./questions/focus-cards";
import { GoalCards } from "./questions/goal-cards";
import { LifestyleStep } from "./questions/lifestyle";
import { MedicationList } from "./questions/medication-list";
import { NumberField } from "./questions/number-field";
import { OptionCards } from "./questions/option-cards";
import { OtcChips } from "./questions/otc-chips";
import { ProductPicker } from "./questions/product-picker";
import { Review } from "./questions/review";
import { SafetyGrid } from "./questions/safety-grid";
import { SecondaryGoals } from "./questions/secondary-goals";
import { SupplementList } from "./questions/supplement-list";
import { FollowUpText, TextArea } from "./questions/text-area";
import { YesNoCards } from "./questions/yes-no-cards";

export interface StepRendererProps {
  step: Step;
  showErrors: boolean;
  onAdvance: () => void;
  onEdit: (stepId: string) => void;
  onAddSection: (sectionId: SectionId) => void;
}

/** Maps a step definition to its question component. */
export function StepRenderer({ step, showErrors, onAdvance, onEdit, onAddSection }: StepRendererProps) {
  switch (step.kind) {
    case "single":
      return <SingleSelect step={step} showErrors={showErrors} onAdvance={onAdvance} />;
    case "yesno":
      return <YesNoCards step={step} showErrors={showErrors} onAdvance={onAdvance} />;
    case "text":
      return <TextArea step={step} />;
    case "number":
      return <NumberField step={step} showErrors={showErrors} />;
    case "goal":
      return <GoalCards onAdvance={onAdvance} />;
    case "focus":
      return <FocusCards showErrors={showErrors} />;
    case "secondary-goals":
      return <SecondaryGoals />;
    case "products":
      return <ProductPicker />;
    case "body":
      return <BodyMetrics showErrors={showErrors} />;
    case "country":
      return <CountryPicker onAdvance={onAdvance} />;
    case "conditions":
      return <ConditionGrid />;
    case "medications":
      return <MedicationList showErrors={showErrors} />;
    case "otc":
      return <OtcChips />;
    case "supplements":
      return <SupplementList showErrors={showErrors} />;
    case "lifestyle":
      return <LifestyleStep showErrors={showErrors} />;
    case "safety":
      return <SafetyGrid showErrors={showErrors} />;
    case "review":
      return <Review onEdit={onEdit} onAddSection={onAddSection} />;
    default:
      return null;
  }
}

function SingleSelect({ step, showErrors, onAdvance }: { step: SingleStep; showErrors: boolean; onAdvance: () => void }) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();
  const value = answers[step.field] as string | undefined;
  const options = React.useMemo(() => stepOptions(step, answers), [step, answers]);
  const notice = step.notice?.(answers);
  const showFollowUp = Boolean(step.followUp && value && step.followUp.when.includes(value));

  return (
    <div className="grid gap-4">
      <OptionCards
        label={step.title}
        options={options}
        value={value}
        onChange={(v) => setAnswer(step.field, v)}
        onAdvance={onAdvance}
        columns={step.columns ?? (options.length >= 4 ? 2 : 1)}
      />
      <Reveal show={Boolean(notice)}>{notice && <InlineNotice tone="brand">{notice}</InlineNotice>}</Reveal>
      <Reveal show={showFollowUp}>{step.followUp && <FollowUpText followUp={step.followUp} showErrors={showErrors} />}</Reveal>
    </div>
  );
}
