"use client";

import * as React from "react";
import { stepOptions, type SingleStep, type Step } from "@/lib/assessment/flow";
import type { SectionId } from "@/lib/assessment/types";
import { useAnswers, useSetAnswer } from "./hooks";
import { InlineNotice, Reveal } from "./primitives";
import { BodyMetrics } from "./questions/body-metrics";
import { CombinationBuilder } from "./questions/combination-builder";
import { CompoundPicker } from "./questions/compound-picker";
import { ConditionGrid } from "./questions/condition-grid";
import { ContactConsent } from "./questions/contact-consent";
import { CountryPicker } from "./questions/country-picker";
import { DoseInput } from "./questions/dose-input";
import { MedicationList } from "./questions/medication-list";
import { NumberField } from "./questions/number-field";
import { OptionCards } from "./questions/option-cards";
import { OtcChips } from "./questions/otc-chips";
import { PreviousUseList } from "./questions/previous-use-list";
import { ReportWants } from "./questions/report-wants";
import { Review } from "./questions/review";
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
    case "compounds":
      return <CompoundPicker showErrors={showErrors} />;
    case "dose":
      return <DoseInput showErrors={showErrors} />;
    case "combinations":
      return <CombinationBuilder showErrors={showErrors} />;
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
    case "previous-uses":
      return <PreviousUseList showErrors={showErrors} />;
    case "wants":
      return <ReportWants showErrors={showErrors} />;
    case "contact":
      return <ContactConsent showErrors={showErrors} />;
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
        columns={step.columns ?? 1}
      />
      <Reveal show={Boolean(notice)}>{notice && <InlineNotice tone="brand">{notice}</InlineNotice>}</Reveal>
      <Reveal show={showFollowUp}>{step.followUp && <FollowUpText followUp={step.followUp} showErrors={showErrors} />}</Reveal>
    </div>
  );
}
