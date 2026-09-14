"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ChartBar,
  Clock,
  FileText,
  Globe,
  Lock,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { GOAL_MAP } from "@/data/goals";
import type { GoalId } from "@/data/types";
import { BRAND, DISCLAIMER_SHORT } from "@/lib/brand";
import { ESTIMATED_MINUTES, progressPercent, resolveStep } from "@/lib/assessment/flow";
import { hasProgress, useAssessmentStore } from "@/lib/assessment/store";
import { SECTION_META, type EntryContext } from "@/lib/assessment/types";
import { cn, formatDate } from "@/lib/utils";
import { COMPOUND_MAP } from "@/data/compounds";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { ConfirmDialog } from "./confirm-dialog";
import { useMounted } from "./hooks";
import { EASE } from "./primitives";

const BENEFITS = [
  {
    icon: ChartBar,
    title: "Evidence grades",
    body: "Strong to insufficient — for your goal, for each compound you're considering.",
  },
  {
    icon: Globe,
    title: "Regulatory status for your country",
    body: "Authorised, investigational or not authorised, taken from our maintained database rather than inferred.",
  },
  {
    icon: ShieldCheck,
    title: "Personal suitability flags",
    body: "Where your history, medicines or plans warrant professional review before going further.",
  },
  {
    icon: MessageSquareText,
    title: "Questions for your clinician",
    body: "Specific, informed questions to take into your next appointment.",
  },
];

/* ------------------------------------------------------------------ */
/* Entry params                                                        */
/* ------------------------------------------------------------------ */

function parseEntry(params: URLSearchParams | null): EntryContext {
  if (!params) return {};
  const rawGoal = params.get("goal");
  const goal = rawGoal && rawGoal in GOAL_MAP ? (rawGoal as GoalId) : undefined;
  const symptom = params.get("symptom") ?? undefined;
  const rawCompound = params.get("compound");
  const compound = rawCompound && COMPOUND_MAP[rawCompound] ? rawCompound : undefined;
  const utm: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith("utm_") && value) utm[key] = value;
  });
  return { goal, symptom, compound, utm: Object.keys(utm).length ? utm : undefined };
}

function IntroWithParams() {
  const params = useSearchParams();
  const entry = React.useMemo(() => parseEntry(params), [params]);
  return <IntroBody entry={entry} />;
}

/** `/assessment/` — the wizard entry. `useSearchParams` is isolated behind Suspense for static export. */
export function AssessmentIntro() {
  return (
    <React.Suspense fallback={<IntroBody entry={{}} />}>
      <IntroWithParams />
    </React.Suspense>
  );
}

/* ------------------------------------------------------------------ */
/* Body                                                                */
/* ------------------------------------------------------------------ */

function IntroBody({ entry }: { entry: EntryContext }) {
  const router = useRouter();
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const hydrated = useAssessmentStore((s) => s.hydrated);
  const answers = useAssessmentStore((s) => s.answers);
  const position = useAssessmentStore((s) => s.position);
  const lastReport = useAssessmentStore((s) => s.lastReport);
  const start = useAssessmentStore((s) => s.start);
  const reset = useAssessmentStore((s) => s.reset);
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const preselected = entry.compound ? COMPOUND_MAP[entry.compound] : undefined;

  /** Add the compound from a detail-page deep link to the considered list (once). */
  const applyPreselectedCompound = () => {
    if (!preselected) return;
    const current = useAssessmentStore.getState().answers.consideredCompounds;
    if (current.some((c) => c.slug === preselected.slug)) return;
    setAnswers({ consideredCompounds: [...current, { slug: preselected.slug }] });
  };

  const [useGoal, setUseGoal] = React.useState(true);
  const [confirm, setConfirm] = React.useState<null | "restart" | "new">(null);
  /** True once a navigation has been requested — keeps the UI stable while the router transitions. */
  const [leaving, setLeaving] = React.useState(false);

  const ready = mounted && hydrated;
  const goal = useGoal && entry.goal ? GOAL_MAP[entry.goal] : undefined;
  const effectiveEntry: EntryContext = { ...entry, goal: goal?.id };

  const hasReport = ready && !leaving && Boolean(answers.completedAt) && Boolean(lastReport);
  // Completed but no stored report (e.g. the report page never ran) → treat as resumable at the review step.
  const canResume = ready && !leaving && !hasReport && hasProgress(answers);

  const go = (href: string) => {
    setLeaving(true);
    router.push(href);
  };

  const begin = () => {
    // Nothing meaningful saved → start clean so the start time and entry context are fresh.
    if (!hasProgress(answers)) reset();
    start(effectiveEntry);
    applyPreselectedCompound();
    go("/assessment/start/");
  };

  const startFresh = () => {
    reset();
    start(effectiveEntry);
    applyPreselectedCompound();
    go("/assessment/start/");
  };

  const percent = ready ? progressPercent(answers, position) : 0;
  const currentSection = ready ? SECTION_META[resolveStep(answers, position).section].title : "";

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="container-x flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Logo />
        <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted sm:text-[0.7rem]">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          <span>
            ≈{ESTIMATED_MINUTES} min<span className="hidden sm:inline">utes</span> · Private · No account
          </span>
        </p>
      </header>

      <main className="container-x flex-1 pb-16 pt-6 sm:pt-12 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* Left: hero + action */}
          <div className="animate-fade-up">
            <Eyebrow>{BRAND.displayName} assessment</Eyebrow>
            <h1 className="mt-4 text-balance font-display text-4xl leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.4rem]">
              Let&apos;s find out what&apos;s worth discussing with your clinician
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              A few structured questions about your goal, what you&apos;re considering and your health. We map your answers
              against the published evidence and regulatory status, then build a report you can take to a clinician.
            </p>

            {preselected && (
              <div className="mt-6 mr-2 inline-flex items-center gap-2 rounded-full border border-line-strong bg-white py-2 pl-4 pr-4 text-sm text-ink">
                Checking: <span className="font-medium">{preselected.name}</span>
              </div>
            )}
            {goal && (
              <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-brand-200 bg-brand-50 py-1 pl-4 pr-1.5 text-sm text-brand-900">
                <span>
                  Your goal: <span className="font-medium">{goal.label}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setUseGoal(false)}
                  className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
                >
                  change
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </div>
            )}

            <div className="mt-10 min-h-[9rem]">
              {canResume ? (
                <ResumeCard
                  percent={percent}
                  section={currentSection}
                  startedAt={answers.startedAt}
                  onResume={() => go("/assessment/start/")}
                  onRestart={() => setConfirm("restart")}
                  reduced={Boolean(reduced)}
                />
              ) : hasReport ? (
                <ReportCard
                  completedAt={answers.completedAt}
                  onView={() => go("/report/")}
                  onNew={() => setConfirm("new")}
                  reduced={Boolean(reduced)}
                />
              ) : (
                <div className="grid gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button size="xl" onClick={begin} loading={leaving} className="sm:min-w-[12rem]">
                      Begin
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
                    </Button>
                    <span className="text-sm text-muted">
                      Around {ESTIMATED_MINUTES} minutes. You can save and come back.
                    </span>
                  </div>
                  <PrivacyLine />
                </div>
              )}
            </div>
          </div>

          {/* Right: what you'll get */}
          <aside className="animate-fade-up [animation-delay:120ms] lg:pt-10">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
              <Eyebrow>What you&apos;ll get</Eyebrow>
              <ul className="mt-5 grid gap-5">
                {BENEFITS.map((b) => (
                  <li key={b.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <b.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-ink">{b.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted">{b.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-xs leading-relaxed text-muted">
                  Reports are produced by a deterministic, clinician-reviewable rules engine reading our maintained
                  compound, evidence and regulatory database. Nothing is generated freehand.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="container-x flex flex-col gap-3 py-6 text-xs leading-relaxed text-muted-2 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl">{DISCLAIMER_SHORT}</p>
          <nav className="flex gap-4 whitespace-nowrap" aria-label="Legal">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/methodology" className="hover:text-ink">
              Methodology
            </Link>
            <Link href="/safety" className="hover:text-ink">
              Safety
            </Link>
          </nav>
        </div>
      </footer>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={confirm === "new" ? "Start a new assessment?" : "Start over?"}
        description={
          confirm === "new"
            ? "This clears your saved answers and your current report from this device, and begins a fresh assessment."
            : "This clears the answers saved on this device and begins a fresh assessment. It can't be undone."
        }
        confirmLabel={confirm === "new" ? "Start new assessment" : "Start over"}
        destructive
        onConfirm={startFresh}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

function PrivacyLine({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 text-sm leading-relaxed text-muted", className)}>
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
      <span>
        Your answers stay on this device. No account, no upload — nothing leaves your browser unless you ask for a
        clinician review.
      </span>
    </p>
  );
}

function ResumeCard({
  percent,
  section,
  startedAt,
  onResume,
  onRestart,
  reduced,
}: {
  percent: number;
  section: string;
  startedAt?: string;
  onResume: () => void;
  onRestart: () => void;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-3xl border border-brand-200 bg-white p-6 shadow-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>Welcome back</Eyebrow>
          <h2 className="mt-2 font-display text-2xl text-ink">Resume where you left off</h2>
          <p className="mt-1 text-sm text-muted">
            {percent}% complete · {section}
            {startedAt ? ` · Started ${formatDate(startedAt)}` : ""}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <UserRound className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink/8" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="h-full rounded-full bg-brand-500"
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${Math.max(percent, 2)}%` }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        />
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button size="lg" onClick={onResume}>
          Resume
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button size="lg" variant="ghost" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Start over
        </Button>
      </div>
    </motion.div>
  );
}

function ReportCard({
  completedAt,
  onView,
  onNew,
  reduced,
}: {
  completedAt?: string;
  onView: () => void;
  onNew: () => void;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-3xl border border-line bg-white p-6 shadow-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>Your report is ready</Eyebrow>
          <h2 className="mt-2 font-display text-2xl text-ink">Pick up your report</h2>
          <p className="mt-1 text-sm text-muted">
            {completedAt ? `Completed ${formatDate(completedAt)}. ` : ""}
            It&apos;s saved on this device.
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <FileText className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button size="lg" onClick={onView}>
          View your report
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button size="lg" variant="secondary" onClick={onNew}>
          Start a new assessment
        </Button>
      </div>
    </motion.div>
  );
}
