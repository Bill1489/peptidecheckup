"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { GOAL_MAP } from "@/data/goals";
import { PRODUCTS } from "@/data/products";
import type { GoalId } from "@/data/types";
import { BRAND, DISCLAIMER_SHORT } from "@/lib/brand";
import { ESTIMATED_MINUTES, progressPercent, resolveStep } from "@/lib/assessment/flow";
import { hasProgress, useAssessmentStore } from "@/lib/assessment/store";
import { SECTION_META, type EntryContext } from "@/lib/assessment/types";
import { resultHref } from "@/lib/match";
import { cn, formatDate } from "@/lib/utils";
import { COMPOUND_MAP } from "@/data/compounds";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ConfirmDialog } from "./confirm-dialog";
import { useMounted } from "./hooks";

const BENEFITS = [
  {
    title: "One pen, with a fit score",
    body: "Each of the six pens is scored 0–100 against your goal, focus areas and evidence. You land on the one that fits, with the reasons spelled out.",
  },
  {
    title: "Evidence grade for your goal",
    body: "Strong to insufficient, from our maintained database. When the evidence is early or animal-only, the result says so.",
  },
  {
    title: "Regulatory status where you live",
    body: "Authorised, investigational or not authorised — taken from the database, never inferred.",
  },
  {
    title: "A no, when your history says no",
    body: "A safety flag or a Higher concern label rules a pen out. Nothing goes in the cart; you get the reasons and a clinician link instead.",
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
  const hydrated = useAssessmentStore((s) => s.hydrated);
  const answers = useAssessmentStore((s) => s.answers);
  const position = useAssessmentStore((s) => s.position);
  const lastReport = useAssessmentStore((s) => s.lastReport);
  const lastMatch = useAssessmentStore((s) => s.lastMatch);
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
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="rule-b">
        <div className="container-x flex h-14 items-center justify-between gap-4 sm:h-16">
          <Logo />
          <p className="label-mono text-ink">
            ≈{ESTIMATED_MINUTES} min · Private · No account
          </p>
        </div>
      </header>

      <main className="container-x flex-1 py-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Left: headline + action */}
          <div>
            <p className="label-mono text-ink">
              {BRAND.assessmentName} · {BRAND.range.name} pens
            </p>
            <h1 className="mt-5 text-balance font-display text-[2.6rem] uppercase leading-[0.95] text-ink sm:text-[3.6rem] lg:text-[4.4rem]">
              Seven minutes. Six pens. One honest answer.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:text-[17px]">
              Tell us what you want to change, then a short screen of your history, medicines and safety questions. The{" "}
              {BRAND.assessmentName} scores every {BRAND.range.name} pen against your answers and the published evidence, sends you
              to the one that fits — and tells you when none of them should be bought.
            </p>

            {(preselected || goal) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {preselected && <Tag label="Checking">{preselected.name}</Tag>}
                {goal && (
                  <Tag label="Goal" onRemove={() => setUseGoal(false)} removeLabel="Clear goal">
                    {goal.label}
                  </Tag>
                )}
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
                />
              ) : hasReport ? (
                <ReportCard
                  completedAt={answers.completedAt}
                  onView={() => go(lastMatch ? resultHref(lastMatch) : "/report/")}
                  onNew={() => setConfirm("new")}
                />
              ) : (
                <div className="grid gap-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button size="xl" onClick={begin} loading={leaving} className="sm:min-w-[12rem]">
                      Begin
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                    <span className="text-sm text-muted">Around {ESTIMATED_MINUTES} minutes. You can save and come back.</span>
                  </div>
                  <PrivacyLine />
                </div>
              )}
            </div>
          </div>

          {/* Right: the range + what you'll get */}
          <aside className="lg:pt-8">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <p className="label-mono text-ink">The range · six pre-filled pens</p>
              <Link href="/shop/" className="link-rule font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
                Shop
              </Link>
            </div>
            <ul className="cell-grid grid-cols-3" aria-label="The six pens">
              {PRODUCTS.map((p) => (
                <li key={p.id} className="flex flex-col p-3 sm:p-4">
                  <ProductImage product={p} prefer="pack" frame="square" sizes="(min-width: 1024px) 12vw, 30vw" className="w-full" />
                  <span className="mt-2 flex items-center gap-1.5">
                    <ProductSwatch product={p} />
                    <span className="break-words font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink">{p.name}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="label-mono mb-3 mt-8 text-ink">What you&apos;ll get</p>
            <ol className="cell-grid sm:grid-cols-2">
              {BENEFITS.map((b, i) => (
                <li key={b.title} className="p-5">
                  <p className="label-mono tnum">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-3 text-[1.05rem] font-bold leading-tight text-ink">{b.title}</h2>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{b.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-4 bg-ink p-6 text-white sm:p-7">
              <p className="label-mono text-brand-300">Brand promise</p>
              <p className="mt-3 font-display text-[1.5rem] uppercase leading-[0.98] sm:text-[1.75rem]">
                The {BRAND.assessmentName} can tell you not to buy. That&apos;s the point.
              </p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-white/70">
                A <span className="text-white">Higher concern</span> label links to a clinician, not a checkout. Matching is
                deterministic: a clinician-reviewable rules engine reads our maintained evidence and regulatory database —
                nothing is generated freehand.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="rule-t">
        <div className="container-x flex flex-col gap-3 py-6 text-xs leading-relaxed text-muted sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl">{DISCLAIMER_SHORT}</p>
          <nav className="flex gap-5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.1em]" aria-label="Legal">
            <Link href="/privacy" className="link-rule text-ink">
              Privacy
            </Link>
            <Link href="/methodology" className="link-rule text-ink">
              Methodology
            </Link>
            <Link href="/safety" className="link-rule text-ink">
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
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** Bordered mono tag, optionally removable. */
function Tag({
  label,
  children,
  onRemove,
  removeLabel,
}: {
  label: string;
  children: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  return (
    <span className="inline-flex min-h-11 items-center border border-ink bg-white pl-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink">
      <span className="text-muted">{label}</span>
      <span className="mx-1.5 text-muted-2" aria-hidden>
        ·
      </span>
      <span className={cn(!onRemove && "pr-3")}>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="ml-1 inline-flex h-11 w-11 items-center justify-center border-l border-ink text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </span>
  );
}

function PrivacyLine({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-3 text-sm leading-relaxed text-muted", className)}>
      <span className="mt-[0.45rem] h-2 w-2 shrink-0 bg-brand-600" aria-hidden />
      <span>
        Your answers stay on this device. No account, no upload — nothing leaves your browser unless you ask us to email
        your report or arrange a clinician review.
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
}: {
  percent: number;
  section: string;
  startedAt?: string;
  onResume: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="border border-ink bg-white p-5 sm:p-6">
      <p className="label-mono text-brand-600">Welcome back</p>
      <h2 className="mt-2 font-display text-[1.5rem] uppercase leading-[0.98] text-ink">Resume where you left off</h2>
      <p className="mt-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-muted">
        <span className="tnum text-ink">{percent}%</span> complete · {section}
        {startedAt ? ` · Started ${formatDate(startedAt)}` : ""}
      </p>
      <div className="mt-4 h-[2px] w-full bg-line" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-brand-600" style={{ width: `${Math.max(percent, 2)}%` }} />
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button size="lg" onClick={onResume}>
          Resume
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button size="lg" variant="secondary" onClick={onRestart}>
          Start over
        </Button>
      </div>
    </div>
  );
}

function ReportCard({ completedAt, onView, onNew }: { completedAt?: string; onView: () => void; onNew: () => void }) {
  return (
    <div className="border border-ink bg-white p-5 sm:p-6">
      <p className="label-mono text-brand-600">Your report is ready</p>
      <h2 className="mt-2 font-display text-[1.5rem] uppercase leading-[0.98] text-ink">Pick up your report</h2>
      <p className="mt-2 text-sm text-muted">
        {completedAt ? `Completed ${formatDate(completedAt)}. ` : ""}
        It&apos;s saved on this device, with your match.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button size="lg" onClick={onView}>
          View your result
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button size="lg" variant="secondary" onClick={onNew}>
          Start a new assessment
        </Button>
      </div>
    </div>
  );
}
