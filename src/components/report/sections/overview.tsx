"use client";

import Link from "next/link";
import { ArrowUpRight, Stethoscope } from "lucide-react";
import { JURISDICTION_LABELS } from "@/data/types";
import { SUITABILITY_LABELS, type Report } from "@/lib/engine/types";
import { formatDate } from "@/lib/utils";
import { CompletenessRing } from "../completeness-ring";
import { MonoLabel, ReportCard, StatTile } from "../primitives";
import { Reveal } from "../reveal";
import { useCountUp } from "../use-count-up";

function Count({ value }: { value: number }) {
  const n = useCountUp(value);
  return <>{n}</>;
}

export function OverviewSection({ report }: { report: Report }) {
  const { overview, completeness } = report;
  const where = report.countryName ?? JURISDICTION_LABELS[report.jurisdiction];

  return (
    <section id="overview" data-report-section aria-labelledby="overview-heading" className="scroll-mt-32 lg:scroll-mt-28">
      <Reveal>
        <ReportCard padding="lg" className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-50 blur-3xl print:hidden" aria-hidden />
          <div className="relative">
            <MonoLabel className="flex items-start gap-2 text-brand-700">
              <Stethoscope className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Prepared for your discussion with a clinician</span>
            </MonoLabel>
            <h1
              id="overview-heading"
              className="mt-4 font-display text-[2.2rem] font-normal leading-[1.05] tracking-[-0.025em] text-ink text-balance sm:text-[2.9rem]"
            >
              Your personal peptide report
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-muted">
              A structured summary of how your goal, medical history and medicines map onto the published evidence
              and regulatory status of the compounds you are considering. It does not recommend that you take
              anything.
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
              <div className="flex gap-2">
                <dt className="text-muted-2">Generated</dt>
                <dd className="text-ink-3">{formatDate(report.generatedAt)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-2">Jurisdiction</dt>
                <dd className="text-ink-3">{where}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-2">Reference</dt>
                <dd className="text-ink-3">{report.id}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Compounds considered" value={<Count value={overview.compoundsConsidered} />} />
            <StatTile
              label={SUITABILITY_LABELS.potentially_relevant}
              value={<Count value={overview.potentiallyRelevant} />}
              tone={overview.potentiallyRelevant > 0 ? "success" : "neutral"}
            />
            <StatTile
              label={SUITABILITY_LABELS.higher_concern}
              value={<Count value={overview.higherConcern} />}
              tone={overview.higherConcern > 0 ? "danger" : "neutral"}
            />
            <StatTile
              label="Flags raised"
              value={<Count value={overview.totalFlags} />}
              tone={overview.highFlags > 0 ? "warning" : "neutral"}
              sub={
                overview.highFlags > 0
                  ? `${overview.highFlags} require${overview.highFlags === 1 ? "s" : ""} review`
                  : "None require review"
              }
            />
          </div>

          <div className="mt-4 grid gap-5 rounded-xl border border-line bg-paper-2 px-5 py-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <CompletenessRing score={completeness.score} size={96} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <MonoLabel className="text-[0.62rem]">Assessment completeness</MonoLabel>
                {completeness.score < 100 && (
                  <Link
                    href="/assessment/start/"
                    className="no-print inline-flex items-center gap-1 text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
                  >
                    Improve this report
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-snug text-ink-3">
                {completeness.score >= 100
                  ? "Every section completed — this report is as specific as our questionnaire allows."
                  : `${completeness.missing.length} item${completeness.missing.length === 1 ? "" : "s"} would make this report more specific.`}
              </p>
              {completeness.missing.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {completeness.missing.slice(0, 4).map((m) => (
                    <li key={m} className="rounded-full border border-line bg-white px-2.5 py-1 text-xs text-muted">
                      {m}
                    </li>
                  ))}
                  {completeness.missing.length > 4 && (
                    <li className="rounded-full px-2 py-1 text-xs text-muted-2">+{completeness.missing.length - 4} more</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </ReportCard>
      </Reveal>
    </section>
  );
}
