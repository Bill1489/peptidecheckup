"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { JURISDICTION_LABELS } from "@/data/types";
import { BRAND } from "@/lib/brand";
import { useAssessmentStore } from "@/lib/assessment/store";
import { generateReport } from "@/lib/engine/generate";
import type { Report } from "@/lib/engine/types";
import { ReportHeader } from "./report-header";
import { ReportToc, ReportTocMobile, useActiveSection } from "./report-toc";
import { reportSections, type ReportSectionDef, type ReportSectionId } from "./sections";
import { OverviewSection } from "./sections/overview";
import { ObjectiveSection } from "./sections/objective";
import { ConsideringSection } from "./sections/considering";
import { EvidenceSection } from "./sections/evidence";
import { RegulatorySection } from "./sections/regulatory";
import { SuitabilitySection } from "./sections/suitability";
import { MatchesSection } from "./sections/matches";
import { DosingSection } from "./sections/dosing";
import { StackSection } from "./sections/stack";
import { NotRecommendedSection } from "./sections/not-recommended";
import { OptionsSection } from "./sections/options";
import { QuestionsSection } from "./sections/questions";
import { SourceSection } from "./sections/source";
import { NextStepsSection } from "./sections/next-steps";

/* Client-only flag that is `false` during SSR/hydration and `true` afterwards — no setState in effects needed. */
const noopSubscribe = () => () => {};
function useMounted() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function ReportView() {
  const mounted = useMounted();
  const hydrated = useAssessmentStore((s) => s.hydrated);
  const answers = useAssessmentStore((s) => s.answers);
  const lastReport = useAssessmentStore((s) => s.lastReport);
  const setLastReport = useAssessmentStore((s) => s.setLastReport);
  const reset = useAssessmentStore((s) => s.reset);
  const router = useRouter();

  const ready = mounted && hydrated;
  const meaningful = Boolean(answers.primaryGoal || answers.consideredCompounds.length > 0);

  const report = React.useMemo<Report | null>(() => {
    if (!ready || !meaningful) return null;
    if (lastReport && JSON.stringify(lastReport.answers) === JSON.stringify(answers)) return lastReport;
    return generateReport(answers);
  }, [ready, meaningful, lastReport, answers]);

  React.useEffect(() => {
    if (report && report !== lastReport) setLastReport(report);
  }, [report, lastReport, setLastReport]);

  const startOver = () => {
    reset();
    router.push("/assessment/");
  };

  if (!ready) return <ReportSkeleton />;
  if (!report) return <ReportEmptyState />;
  return <ReportDocument report={report} onStartOver={startOver} />;
}

/* ------------------------------------------------------------------ */

export function ReportDocument({ report, onStartOver }: { report: Report; onStartOver: () => void }) {
  const sections = React.useMemo(() => reportSections(report), [report]);
  const ids = React.useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  const byId = React.useMemo(() => new Map<ReportSectionId, ReportSectionDef>(sections.map((s) => [s.id, s])), [sections]);
  const def = (id: ReportSectionId) => byId.get(id) ?? sections[0];

  const compareHref = report.compounds.length > 0 ? `/compare/?c=${report.compounds.map((c) => c.slug).join(",")}` : undefined;
  const where = report.countryName ?? JURISDICTION_LABELS[report.jurisdiction];

  return (
    <div className="min-h-screen bg-white">
      <ReportHeader generatedAt={report.generatedAt} jurisdiction={where} compareHref={compareHref} onStartOver={onStartOver} />
      <ReportTocMobile sections={sections} active={active} />

      <div className="container-x py-8 sm:py-10 lg:py-14">
        <div className="lg:grid lg:grid-cols-[12.5rem_minmax(0,48rem)] lg:justify-center lg:gap-12 xl:grid-cols-[13rem_minmax(0,48rem)_13rem] xl:gap-14 print:block">
          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-24">
              <ReportToc sections={sections} active={active} />
            </div>
          </aside>

          <article className="mx-auto w-full max-w-3xl space-y-14 sm:space-y-16 lg:mx-0 print:mx-auto" data-report>
            <OverviewSection report={report} />
            <ObjectiveSection report={report} def={def("objective")} />
            <ConsideringSection report={report} def={def("considering")} />
            <EvidenceSection report={report} def={def("evidence")} />
            <RegulatorySection report={report} def={def("regulatory")} />
            <SuitabilitySection report={report} def={def("suitability")} />
            <MatchesSection report={report} def={def("matches")} />
            <DosingSection report={report} def={def("dosing")} />
            {report.stack && <StackSection report={report} def={def("stack")} />}
            <NotRecommendedSection report={report} def={def("not-recommended")} />
            <OptionsSection report={report} def={def("options")} />
            <QuestionsSection report={report} def={def("questions")} />
            <SourceSection report={report} def={def("source")} />
            <NextStepsSection report={report} def={def("next-steps")} compareHref={compareHref} />
          </article>

          <div className="hidden xl:block" aria-hidden />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FlowHeader() {
  return (
    <div className="rule-b">
      <div className="container-x flex h-14 items-center gap-3 sm:h-16">
        <Link href="/" aria-label={`${BRAND.displayName} home`} className="inline-flex items-center">
          <LogoMark className="h-7 w-7" />
        </Link>
        <p className="label-mono text-ink">Report</p>
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="min-h-screen bg-white" aria-busy="true" aria-live="polite">
      <FlowHeader />
      <div className="container-x py-14">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="skeleton h-3 w-56" />
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="mt-8 grid grid-cols-2 gap-px border border-line sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24" />
            ))}
          </div>
          <div className="skeleton mt-8 h-64" />
        </div>
      </div>
      <p className="sr-only">Loading your report</p>
    </div>
  );
}

function ReportEmptyState() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FlowHeader />
      <div className="container-narrow flex flex-1 flex-col justify-center py-20">
        <p className="label-mono text-ink">Your report</p>
        <h1 className="mt-4 font-display text-[2.4rem] uppercase leading-[0.95] text-ink sm:text-[3.2rem]">No report yet</h1>
        <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-muted">
          Your personal report is generated from your assessment answers, right here in your browser. Complete the
          assessment — about seven minutes — and it will appear on this page with your product matches.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/assessment/" size="lg">
            Start assessment
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button href="/shop/" size="lg" variant="secondary">
            Browse the shop
          </Button>
        </div>
      </div>
    </div>
  );
}
