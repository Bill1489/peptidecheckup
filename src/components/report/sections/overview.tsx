"use client";

import Link from "next/link";
import { JURISDICTION_LABELS } from "@/data/types";
import { SUITABILITY_LABELS, type Report } from "@/lib/engine/types";
import { cn, formatDate } from "@/lib/utils";
import { CompletenessMeter } from "../completeness-meter";
import { MonoLabel, StatTile } from "../primitives";

export function OverviewSection({ report }: { report: Report }) {
  const { overview, completeness } = report;
  const where = report.countryName ?? JURISDICTION_LABELS[report.jurisdiction];
  const missing = completeness.missing;

  return (
    <section id="overview" data-report-section aria-labelledby="overview-heading" className="scroll-mt-28 lg:scroll-mt-24">
      <MonoLabel className="text-ink">Prepared for your discussion with a clinician</MonoLabel>
      <h1
        id="overview-heading"
        className="mt-4 text-balance font-display text-[2.4rem] uppercase leading-[0.95] text-ink sm:text-[3.4rem]"
      >
        Your personal peptide report
      </h1>
      <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted">
        A structured summary of how your goal, medical history and medicines map onto the published evidence and
        regulatory status of the compounds you are considering — and which of our products fit. It does not recommend
        that you take anything.
      </p>

      <dl className="mt-6 grid grid-cols-1 border border-ink sm:grid-cols-3">
        {[
          ["Generated", formatDate(report.generatedAt)],
          ["Jurisdiction", where],
          ["Reference", report.id],
        ].map(([label, value], i) => (
          <div
            key={label}
            className={cn("flex items-baseline justify-between gap-4 px-4 py-3 sm:block", i > 0 && "border-t border-line sm:border-l sm:border-t-0")}
          >
            <dt className="label-mono">{label}</dt>
            <dd className="font-mono text-[12.5px] text-ink sm:mt-1">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="cell-grid mt-6 grid-cols-2 sm:grid-cols-4">
        <StatTile label="Compounds considered" value={overview.compoundsConsidered} />
        <StatTile
          label={SUITABILITY_LABELS.potentially_relevant}
          value={overview.potentiallyRelevant}
          tone={overview.potentiallyRelevant > 0 ? "brand" : "neutral"}
        />
        <StatTile
          label={SUITABILITY_LABELS.higher_concern}
          value={overview.higherConcern}
          tone={overview.higherConcern > 0 ? "danger" : "neutral"}
        />
        <StatTile
          label="Flags raised"
          value={overview.totalFlags}
          tone={overview.highFlags > 0 ? "warning" : "neutral"}
          sub={overview.highFlags > 0 ? `${overview.highFlags} require${overview.highFlags === 1 ? "s" : ""} review` : "None require review"}
        />
      </div>

      <div className="mt-6 grid gap-5 border border-ink bg-paper-2 p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:p-5">
        <CompletenessMeter score={completeness.score} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <MonoLabel className="text-ink">Assessment completeness</MonoLabel>
            {completeness.score < 100 && (
              <Link href="/assessment/start/" className="link-rule no-print font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
                Improve this report
              </Link>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-snug text-ink-3">
            {completeness.score >= 100
              ? "Every section completed — this report is as specific as our questionnaire allows."
              : `${missing.length} item${missing.length === 1 ? "" : "s"} would make this report more specific and can unlock more product matches.`}
          </p>
          {missing.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {missing.slice(0, 4).map((m) => (
                <li key={m} className="border border-ink bg-white px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink">
                  {m}
                </li>
              ))}
              {missing.length > 4 && (
                <li className="px-1 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">+{missing.length - 4} more</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
