"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { toast } from "sonner";
import { countryName, RANGE_COMPOUND_SLUGS } from "@/lib/assessment/derived";
import {
  AUTO_COMPLETE_SECTIONS,
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
import { BRAND } from "@/lib/brand";
import { useCartStore } from "@/lib/commerce/cart-store";
import { buildQuizResult, resultHref } from "@/lib/match";
import { formatDate } from "@/lib/utils";
import { ActionBar } from "./action-bar";
import { EmailCaptureScreen } from "./email-capture";
import { GeneratingScreen } from "./generating";
import { useAnswers, useCoarsePointer, useMounted } from "./hooks";
import { AUTO_ADVANCE_MS } from "./questions/option-cards";
import { StepRenderer } from "./step-renderer";
import { TopBar } from "./top-bar";
import { Under18Screen } from "./under-18";
import { WizardSkeleton } from "./wizard-skeleton";

type Direction = 1 | -1;
type Phase = "idle" | "generating" | "email";

/** Direction-aware step transition: opacity + 6px, 180 ms in, 120 ms out. */
function makeVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1, transition: { duration: 0.12 } },
      exit: { opacity: 0, transition: { duration: 0.08 } },
    };
  }
  return {
    enter: (dir: Direction) => ({ x: dir * 6, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
    exit: (dir: Direction) => ({ x: dir * -6, opacity: 0, transition: { duration: 0.12, ease: "easeIn" } }),
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
  const lastMatch = useAssessmentStore((s) => s.lastMatch);
  const setPosition = useAssessmentStore((s) => s.setPosition);
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const setAnswer = useAssessmentStore((s) => s.setAnswer);
  const start = useAssessmentStore((s) => s.start);
  const complete = useAssessmentStore((s) => s.complete);

  const [direction, setDirection] = React.useState<Direction>(1);
  const [attemptedStepId, setAttemptedStepId] = React.useState<string | null>(null);
  const [underage, setUnderage] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>("idle");
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

  /**
   * "Find my match": complete the sections the flow no longer asks about, run
   * the rules engine and the matcher on this device, store both, unlock the
   * assessment promo, then show the generating sequence and the email step.
   */
  const generate = React.useCallback(() => {
    const state = useAssessmentStore.getState();
    if (!state.answers.skippedSections.includes("final")) state.markSectionComplete("final");
    for (const section of AUTO_COMPLETE_SECTIONS) state.markSectionComplete(section);
    complete();
    const { report, match } = buildQuizResult(useAssessmentStore.getState().answers);
    state.setLastReport(report);
    state.setLastMatch(match);
    useCartStore.getState().setAssessmentCompleted(true);
    router.prefetch(resultHref(match));
    setPhase("generating");
  }, [complete, router]);

  /** Route to the matched pen's page, or to the report when nothing matched. */
  const openResult = React.useCallback(() => {
    const match = useAssessmentStore.getState().lastMatch;
    router.push(match ? resultHref(match) : "/report/");
  }, [router]);

  /** Email captured (and, optionally, a clinician review requested) — keep the stored report in step with the answers. */
  const onEmailSent = React.useCallback(
    (email: string, reviewRequested: boolean) => {
      const state = useAssessmentStore.getState();
      const contactConsent = reviewRequested || Boolean(state.answers.contactConsent);
      setAnswers({ contactEmail: email, contactConsent });
      if (state.lastReport) {
        state.setLastReport({
          ...state.lastReport,
          contactRequested: contactConsent,
          answers: { ...state.lastReport.answers, contactEmail: email, contactConsent },
        });
      }
      openResult();
    },
    [setAnswers, openResult],
  );

  const saveAndExit = React.useCallback(() => {
    toast("Progress saved on this device", {
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
    if (!ready || underage || phase !== "idle") return;

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
  }, [ready, underage, phase, step, onPrimary, goNext, goBack, setAnswer, advanceFrom]);

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  if (!ready) return <WizardSkeleton />;

  const isReview = step.kind === "review";
  const nextLabel = isReview ? "Find my match" : step.optional && step.isEmpty?.(answers) ? "Skip" : "Continue";
  const canBack = Boolean(prevStep(answers, position));
  const eyebrow = sectionEyebrow(step);
  const compoundSlugs = answers.consideredCompounds.map((c) => c.slug);
  const country = countryName(answers.countryCode) ?? "your country";
  const hasPrimary = Boolean(lastMatch?.primary);

  return (
    <div className="flex min-h-dvh flex-col bg-white">
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
                <motion.div key={step.id} custom={direction} variants={variants} initial="enter" animate="center" exit="exit">
                  <StepBody step={step} eyebrow={eyebrow} coarse={coarse} completedAt={isReview ? answers.completedAt : undefined}>
                    <StepRenderer step={step} showErrors={showErrors} onAdvance={onAdvance} onEdit={editStep} onAddSection={jumpToSection} />
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
        {phase === "generating" && (
          <GeneratingScreen
            key="generating"
            lines={[
              "Mapping your goal and focus areas to the six pens",
              `Checking regulatory status for ${country}`,
              `Screening ${RANGE_COMPOUND_SLUGS.length} compounds in the range against your history`,
              "Scoring each pen 0–100 for fit",
              "Applying your safety screen to the result",
            ]}
            onDone={() => setPhase("email")}
          />
        )}
        {phase === "email" && (
          <EmailCaptureScreen
            key="email"
            initialEmail={answers.contactEmail}
            initialReview={Boolean(answers.contactConsent)}
            goal={answers.primaryGoal}
            compounds={compoundSlugs}
            countryCode={answers.countryCode}
            resultLabel={hasPrimary ? "my match" : "my report"}
            onSent={onEmailSent}
            onSkip={openResult}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Question frame: mono section label → uppercase expanded title → help →
 * content. Autofocuses the first `[data-autofocus]` control on mount
 * (skipping search boxes on touch devices so the keyboard doesn't hide the
 * suggestions).
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
      <p className="label-mono text-ink">{eyebrow}</p>
      <h1 className="mt-4 text-balance font-display text-[1.7rem] uppercase leading-[0.98] text-ink sm:text-[2.2rem]">{step.title}</h1>
      {step.help && <p className="mt-4 max-w-prose text-pretty text-[15px] leading-relaxed text-muted">{step.help}</p>}
      {completedAt && (
        <p className="mt-4 inline-flex items-start gap-2 border border-ink border-l-[3px] border-l-brand-600 bg-white px-3 py-2 text-[13px] leading-snug text-ink-2">
          You completed the {BRAND.assessmentName} on {formatDate(completedAt)}. Finding your match again replaces that result and its
          report.
        </p>
      )}
      <div className="mt-8">{children}</div>
    </div>
  );
}
