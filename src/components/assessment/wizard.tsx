"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { countryName } from "@/lib/assessment/derived";
import {
  STEPS,
  firstStepOfSection,
  getStep,
  isSectionSkippable,
  isVisible,
  minutesRemaining,
  nextStep,
  positionOf,
  prevStep,
  progressPercent,
  resolveStep,
  sectionEyebrow,
  sectionProgress,
  skipTarget,
  stepError,
  stepOptions,
  type Step,
} from "@/lib/assessment/flow";
import { useAssessmentStore } from "@/lib/assessment/store";
import type { SectionId } from "@/lib/assessment/types";
import { formatDate } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/card";
import { ActionBar } from "./action-bar";
import { GeneratingScreen } from "./generating";
import { useAnswers, useCoarsePointer, useMounted } from "./hooks";
import { EASE } from "./primitives";
import { AUTO_ADVANCE_MS } from "./questions/option-cards";
import { StepRenderer } from "./step-renderer";
import { TopBar } from "./top-bar";
import { Under18Screen } from "./under-18";
import { WizardSkeleton } from "./wizard-skeleton";

type Direction = 1 | -1;

function makeVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1, transition: { duration: 0.15 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }
  return {
    enter: (dir: Direction) => ({ x: dir * 24, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: EASE } },
    exit: (dir: Direction) => ({ x: dir * -24, opacity: 0, transition: { duration: 0.16, ease: EASE } }),
  };
}

/**
 * The assessment wizard — a state machine over `flow.ts` driven by
 * `store.position`. Renders inside the chrome-less (flow) layout.
 */
export function AssessmentWizard() {
  const router = useRouter();
  const mounted = useMounted();
  const reducedMotion = useReducedMotion() ?? false;
  const coarse = useCoarsePointer();

  const hydrated = useAssessmentStore((s) => s.hydrated);
  const answers = useAnswers();
  const position = useAssessmentStore((s) => s.position);
  const setPosition = useAssessmentStore((s) => s.setPosition);
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const setAnswer = useAssessmentStore((s) => s.setAnswer);
  const start = useAssessmentStore((s) => s.start);
  const complete = useAssessmentStore((s) => s.complete);

  const [direction, setDirection] = React.useState<Direction>(1);
  const [attemptedStepId, setAttemptedStepId] = React.useState<string | null>(null);
  const [underage, setUnderage] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const keyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const ready = mounted && hydrated;
  const step = React.useMemo(() => resolveStep(answers, position), [answers, position]);
  const showErrors = attemptedStepId === step.id;
  const error = showErrors ? stepError(step, answers) : undefined;
  const percent = React.useMemo(() => progressPercent(answers, position), [answers, position]);
  const sections = React.useMemo(() => sectionProgress(answers, position), [answers, position]);
  const minutesLeft = React.useMemo(() => minutesRemaining(answers, position), [answers, position]);
  const variants = React.useMemo(() => makeVariants(reducedMotion), [reducedMotion]);

  /* Make sure a direct visit to /assessment/start/ still records a start time. */
  React.useEffect(() => {
    if (ready && !answers.startedAt) start();
  }, [ready, answers.startedAt, start]);

  /* Warm up the report route while the user reviews. */
  React.useEffect(() => {
    if (step.kind === "review") router.prefetch("/report/");
  }, [step.kind, router]);

  React.useEffect(
    () => () => {
      if (keyTimer.current) clearTimeout(keyTimer.current);
    },
    [],
  );

  /* ---------------------------------------------------------------- */
  /* Navigation                                                        */
  /* ---------------------------------------------------------------- */

  const go = React.useCallback(
    (target: Step, dir: Direction) => {
      setDirection(dir);
      setPosition(positionOf(target));
      setAttemptedStepId(null);
      if (typeof window !== "undefined" && window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      }
    },
    [setPosition, reducedMotion],
  );

  /** Drop blank repeatable entries when leaving a list step so the store stays clean. */
  const cleanupOnLeave = React.useCallback(
    (leaving: Step) => {
      const a = useAssessmentStore.getState().answers;
      if (leaving.kind === "medications") {
        const pruned = a.prescriptions.filter((p) => p.name.trim());
        if (pruned.length !== a.prescriptions.length) setAnswers({ prescriptions: pruned });
      } else if (leaving.kind === "supplements") {
        const pruned = a.supplements.filter((s) => s.name.trim());
        if (pruned.length !== a.supplements.length) setAnswers({ supplements: pruned });
      } else if (leaving.kind === "previous-uses") {
        const pruned = a.previousUses.filter((u) => u.name.trim());
        if (pruned.length !== a.previousUses.length) setAnswers({ previousUses: pruned });
      }
    },
    [setAnswers],
  );

  const goNext = React.useCallback(() => {
    const state = useAssessmentStore.getState();
    const a = state.answers;
    const current = resolveStep(a, state.position);

    if (current.kind === "number" && typeof a.age === "number" && a.age > 0 && a.age < 18) {
      setUnderage(true);
      return;
    }
    if (!current.valid(a)) {
      setAttemptedStepId(current.id);
      return;
    }
    cleanupOnLeave(current);
    const next = nextStep(a, state.position);
    if (!next) return;
    if (next.section !== current.section || next.kind === "review") state.markSectionComplete(current.section);
    go(next, 1);
  }, [cleanupOnLeave, go]);

  /** Auto-advance callback that is a no-op if the user has already moved on (avoids double advances). */
  const advanceFrom = React.useCallback(
    (stepId: string) => () => {
      const state = useAssessmentStore.getState();
      if (resolveStep(state.answers, state.position).id !== stepId) return;
      goNext();
    },
    [goNext],
  );
  const onAdvance = React.useMemo(() => advanceFrom(step.id), [advanceFrom, step.id]);

  const goBack = React.useCallback(() => {
    const state = useAssessmentStore.getState();
    const current = resolveStep(state.answers, state.position);
    cleanupOnLeave(current);
    const prev = prevStep(state.answers, state.position);
    if (prev) go(prev, -1);
  }, [cleanupOnLeave, go]);

  const skipSection = React.useCallback(() => {
    const state = useAssessmentStore.getState();
    const current = resolveStep(state.answers, state.position);
    cleanupOnLeave(current);
    state.markSectionSkipped(current.section);
    go(skipTarget(state.answers, current.section), 1);
  }, [cleanupOnLeave, go]);

  const jumpToSection = React.useCallback(
    (section: SectionId) => {
      const state = useAssessmentStore.getState();
      const current = resolveStep(state.answers, state.position);
      const first = firstStepOfSection(state.answers, section);
      if (!first) return;
      cleanupOnLeave(current);
      if (state.answers.skippedSections.includes(section)) state.unskipSection(section);
      go(first, STEPS.indexOf(first) < STEPS.indexOf(current) ? -1 : 1);
    },
    [cleanupOnLeave, go],
  );

  const editStep = React.useCallback(
    (stepId: string) => {
      const state = useAssessmentStore.getState();
      const current = resolveStep(state.answers, state.position);
      const target = getStep(stepId);
      if (!target) return;
      const resolved = isVisible(target, state.answers) ? target : resolveStep(state.answers, positionOf(target));
      go(resolved, STEPS.indexOf(resolved) < STEPS.indexOf(current) ? -1 : 1);
    },
    [go],
  );

  const generate = React.useCallback(() => {
    const state = useAssessmentStore.getState();
    if (!state.answers.skippedSections.includes("final")) state.markSectionComplete("final");
    complete();
    setGenerating(true);
  }, [complete]);

  const saveAndExit = React.useCallback(() => {
    toast.success("Progress saved on this device", {
      description: "Come back any time and we'll pick up where you left off.",
    });
    router.push("/assessment/");
  }, [router]);

  const onPrimary = React.useCallback(() => {
    if (step.kind === "review") generate();
    else goNext();
  }, [step.kind, generate, goNext]);

  /* ---------------------------------------------------------------- */
  /* Keyboard                                                          */
  /* ---------------------------------------------------------------- */

  React.useEffect(() => {
    if (!ready || underage || generating) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey) return;
      const t = e.target instanceof HTMLElement ? e.target : null;
      const tag = t?.tagName ?? "";
      const role = t?.getAttribute("role");
      const isOption = Boolean(t?.hasAttribute("data-option"));
      const inField = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || Boolean(t?.isContentEditable);
      if (t?.closest('[role="dialog"], [role="alertdialog"], [cmdk-root]')) return;

      if (e.key === "Enter") {
        if (e.shiftKey) return;
        if (tag === "TEXTAREA" && !(e.metaKey || e.ctrlKey)) return;
        if (tag === "SELECT" || tag === "A") return;
        if ((tag === "BUTTON" || role === "radio" || role === "checkbox" || role === "switch") && !isOption) return;
        e.preventDefault();
        onPrimary();
        return;
      }

      const optionStep = step.kind === "single" || step.kind === "yesno";
      if (inField || !optionStep) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
        return;
      }
      if (/^[1-9]$/.test(e.key) && !e.metaKey && !e.ctrlKey) {
        const options = stepOptions(step, useAssessmentStore.getState().answers);
        const option = options[Number(e.key) - 1];
        if (!option) return;
        e.preventDefault();
        setAnswer(step.field, option.value);
        const needsFollowUp = option.followUp || option.noAutoAdvance || step.followUp?.when.includes(option.value);
        if (keyTimer.current) clearTimeout(keyTimer.current);
        if (!needsFollowUp) keyTimer.current = setTimeout(advanceFrom(step.id), AUTO_ADVANCE_MS);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, underage, generating, step, onPrimary, goNext, goBack, setAnswer, advanceFrom]);

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  if (!ready) return <WizardSkeleton />;

  const isReview = step.kind === "review";
  const nextLabel = isReview ? "Generate my report" : step.optional && step.isEmpty?.(answers) ? "Skip" : "Continue";
  const canBack = Boolean(prevStep(answers, position));
  const eyebrow = sectionEyebrow(step);
  const compoundCount = answers.consideredCompounds.length + (answers.otherCompoundText?.trim() ? 1 : 0);
  const country = countryName(answers.countryCode) ?? "your country";

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <TopBar sections={sections} percent={percent} minutesLeft={minutesLeft} onJump={jumpToSection} onSaveExit={saveAndExit} />

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {underage ? "This assessment is for adults." : `${eyebrow}. ${step.title}`}
      </div>

      {underage ? (
        <div className="flex flex-1 flex-col">
          <Under18Screen
            onBack={() => {
              setAnswers({ age: undefined });
              setUnderage(false);
              setAttemptedStepId(null);
            }}
          />
        </div>
      ) : (
        <>
          <div className="flex-1">
            <div className="container-narrow overflow-x-clip py-8 sm:py-12">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <StepBody step={step} eyebrow={eyebrow} coarse={coarse} completedAt={isReview ? answers.completedAt : undefined}>
                    <StepRenderer
                      step={step}
                      showErrors={showErrors}
                      onAdvance={onAdvance}
                      onEdit={editStep}
                      onAddSection={jumpToSection}
                    />
                  </StepBody>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <ActionBar
            canBack={canBack}
            onBack={goBack}
            onNext={onPrimary}
            nextLabel={nextLabel}
            isReview={isReview}
            skippable={isSectionSkippable(step)}
            onSkipSection={skipSection}
            error={error}
            hideKeyHint={coarse}
          />
        </>
      )}

      <AnimatePresence>
        {generating && (
          <GeneratingScreen
            lines={[
              "Mapping your goal to the evidence base",
              `Checking regulatory status for ${country}`,
              `Screening ${compoundCount} ${compoundCount === 1 ? "compound" : "compounds"} against your history`,
              "Compiling clinician questions",
            ]}
            onDone={() => router.push("/report/")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Question frame: eyebrow → display-serif title → help → content. Autofocuses
 * the first `[data-autofocus]` control on mount (skipping search boxes on
 * touch devices so the keyboard doesn't hide the suggestions).
 */
function StepBody({
  step,
  eyebrow,
  coarse,
  completedAt,
  children,
}: {
  step: Step;
  eyebrow: string;
  coarse: boolean;
  completedAt?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>("[data-autofocus]");
    if (!el) return;
    if (el.dataset.autofocus === "pointer" && coarse) return;
    const id = window.setTimeout(() => el.focus({ preventScroll: true }), 40);
    return () => window.clearTimeout(id);
  }, [coarse]);

  return (
    <div ref={ref}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 text-balance font-display text-2xl leading-[1.15] tracking-tight text-ink sm:text-3xl">{step.title}</h1>
      {step.help && <p className="mt-3 max-w-prose text-pretty text-base leading-relaxed text-muted">{step.help}</p>}
      {completedAt && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs text-muted shadow-soft">
          <CalendarClock className="h-3.5 w-3.5 text-brand-600" aria-hidden />
          You generated a report on {formatDate(completedAt)}. Generating again replaces it.
        </p>
      )}
      <div className="mt-8">{children}</div>
    </div>
  );
}
