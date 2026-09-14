"use client";

import {
  ArrowDownToLine,
  ArrowUpToLine,
  CircleCheck,
  CircleDashed,
  CircleQuestionMark,
  ExternalLink,
  FlaskConical,
  Repeat,
  Route,
} from "lucide-react";
import { FlagBadge, SuitabilityBadge } from "@/components/ui/badge";
import { ROUTE_LABELS } from "@/data/types";
import type { CompoundReport, DoseVerdict, Report } from "@/lib/engine/types";
import { DOSE_VERDICT_LABELS, PROFESSIONAL_REVIEW_SENTENCE, RESEARCH_INFO_LABEL } from "@/lib/engine/labels";
import { cn } from "@/lib/utils";
import { CompoundHeading, Field, MonoLabel, Note, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

const VERDICT_STYLE: Record<DoseVerdict, { icon: React.ReactNode; tone: string; ring: string }> = {
  within_range: {
    icon: <CircleCheck className="h-5 w-5" aria-hidden />,
    tone: "text-emerald-700",
    ring: "border-emerald-200 bg-relevant-soft",
  },
  above_range: {
    icon: <ArrowUpToLine className="h-5 w-5" aria-hidden />,
    tone: "text-rose-700",
    ring: "border-rose-200 bg-concern-soft",
  },
  below_range: {
    icon: <ArrowDownToLine className="h-5 w-5" aria-hidden />,
    tone: "text-amber-700",
    ring: "border-amber-200 bg-caution-soft",
  },
  frequency_differs: {
    icon: <Repeat className="h-5 w-5" aria-hidden />,
    tone: "text-amber-700",
    ring: "border-amber-200 bg-caution-soft",
  },
  route_differs: {
    icon: <Route className="h-5 w-5" aria-hidden />,
    tone: "text-amber-700",
    ring: "border-amber-200 bg-caution-soft",
  },
  no_human_data: {
    icon: <FlaskConical className="h-5 w-5" aria-hidden />,
    tone: "text-ink-3",
    ring: "border-line bg-paper-2",
  },
  not_comparable: {
    icon: <CircleDashed className="h-5 w-5" aria-hidden />,
    tone: "text-ink-3",
    ring: "border-line bg-paper-2",
  },
  not_provided: {
    icon: <CircleQuestionMark className="h-5 w-5" aria-hidden />,
    tone: "text-ink-3",
    ring: "border-line bg-paper-2",
  },
};

function LayerLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <MonoLabel as="h4" className="flex items-center gap-2 text-brand-700">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 font-mono text-[0.6rem] text-brand-800">
        {n}
      </span>
      {children}
    </MonoLabel>
  );
}

function CompoundDosing({ c, index }: { c: CompoundReport; index: number }) {
  const v = VERDICT_STYLE[c.doseComparison.verdict];
  const riskFlags = c.flags.filter((f) => f.severity !== "info").slice(0, 5);
  const infoFlags = c.flags.filter((f) => f.severity === "info");

  return (
    <Reveal delay={Math.min(index, 3) * 0.04}>
      <ReportCard padding="none" className="overflow-hidden">
        <div className="border-b border-line px-5 py-5 sm:px-7">
          <CompoundHeading name={c.name} meta={c.classLabel} right={<SuitabilityBadge level={c.suitability} size="sm" />} />
        </div>

        {/* Layer A — research */}
        <div className="border-b border-line px-5 py-6 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LayerLabel n="A">What the evidence says about dosing</LayerLabel>
            <span className="rounded-full border border-line bg-paper-2 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
              {RESEARCH_INFO_LABEL}
            </span>
          </div>

          {c.dosingResearch.length > 0 ? (
            <ol className="mt-5 space-y-4">
              {c.dosingResearch.map((s) => (
                <li key={`${s.citation}-${s.year}`} className="rounded-xl border border-line bg-paper-2/60 p-4 sm:p-5 break-inside-avoid">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[0.95rem] font-medium leading-snug text-ink">{s.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 underline-offset-4 hover:text-ink hover:underline"
                          >
                            {s.citation}
                            <ExternalLink className="no-print h-3 w-3" aria-hidden />
                          </a>
                        ) : (
                          s.citation
                        )}
                      </p>
                    </div>
                    <ul className="flex flex-wrap gap-1.5">
                      {[s.phase, s.year.toString(), s.n !== undefined ? `n = ${s.n.toLocaleString("en-GB")}` : undefined]
                        .filter((x): x is string => Boolean(x))
                        .map((chip) => (
                          <li key={chip} className="rounded-full bg-white px-2.5 py-1 font-mono text-[0.62rem] text-ink-3 ring-1 ring-line">
                            {chip}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <p className="mt-2 text-xs text-muted">{s.design}</p>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Population" valueClassName="text-sm">
                      {s.population}
                    </Field>
                    <Field label="Duration" valueClassName="text-sm">
                      {s.duration}
                    </Field>
                    <Field label="Doses studied" valueClassName="text-sm font-mono text-[0.82rem]">
                      {s.doses}
                    </Field>
                    <Field label="Route" valueClassName="text-sm">
                      {ROUTE_LABELS[s.route]}
                    </Field>
                    <Field label="Outcome" valueClassName="text-sm" className="sm:col-span-2">
                      {s.outcome}
                    </Field>
                    <Field label="Adverse events" valueClassName="text-sm" className="sm:col-span-2">
                      {s.adverseEvents}
                    </Field>
                  </dl>
                </li>
              ))}
            </ol>
          ) : (
            <Note className="mt-5" icon={<FlaskConical className="h-4 w-4" aria-hidden />}>
              {c.dosingResearchNote ?? `No published human dosing studies of ${c.name} are held in our database.`}
            </Note>
          )}
          {c.dosingResearch.length > 0 && c.dosingResearchNote && (
            <p className="mt-4 text-sm leading-relaxed text-muted">{c.dosingResearchNote}</p>
          )}
        </div>

        {/* Layer B — comparison */}
        <div className="border-b border-line px-5 py-6 sm:px-7">
          <LayerLabel n="B">How this compares with what you&apos;re considering</LayerLabel>
          <div className={cn("mt-5 rounded-xl border p-4 sm:p-5 break-inside-avoid", v.ring)}>
            <div className="flex flex-wrap items-start gap-3">
              <span className={cn("mt-0.5 shrink-0", v.tone)}>{v.icon}</span>
              <div className="min-w-0 flex-1">
                <p className={cn("text-[0.95rem] font-medium leading-snug", v.tone)}>
                  {DOSE_VERDICT_LABELS[c.doseComparison.verdict]}
                </p>
                <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.72rem] text-ink-3">
                  <div className="flex gap-2">
                    <dt className="uppercase tracking-[0.12em] text-muted-2">Your dose</dt>
                    <dd>{c.doseComparison.userDoseLabel}</dd>
                  </div>
                  {c.doseComparison.referenceStudy && (
                    <div className="flex gap-2">
                      <dt className="uppercase tracking-[0.12em] text-muted-2">Reference</dt>
                      <dd>{c.doseComparison.referenceStudy}</dd>
                    </div>
                  )}
                </dl>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-2">{c.doseComparison.explanation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layer C — personal suitability and risk */}
        <div className="px-5 py-6 sm:px-7">
          <LayerLabel n="C">Personal suitability and risk</LayerLabel>
          <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
            <SuitabilityBadge level={c.suitability} />
            <div className="min-w-0">
              {riskFlags.length > 0 ? (
                <ul className="space-y-2">
                  {riskFlags.map((f) => (
                    <li key={f.id} className="flex items-start gap-2.5 text-sm leading-snug text-ink-2">
                      <FlagBadge severity={f.severity} className="mt-0.5 shrink-0" />
                      <span>{f.title}</span>
                    </li>
                  ))}
                  {infoFlags.length > 0 && (
                    <li className="text-xs text-muted">
                      + {infoFlags.length} informational note{infoFlags.length === 1 ? "" : "s"} in the suitability section
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-muted">
                  No compound-specific caution or review-required flags were raised for {c.name}. Global flags, if any,
                  are listed in the suitability section.
                </p>
              )}
              <p className="mt-4 border-l-2 border-ink pl-3 font-display text-lg leading-snug text-ink">
                {PROFESSIONAL_REVIEW_SENTENCE}
              </p>
            </div>
          </div>
        </div>
      </ReportCard>
    </Reveal>
  );
}

export function DosingSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  return (
    <ReportSection
      def={def}
      description="Three layers for each compound: what published human studies actually used, how the dose you entered compares with those exposures, and what your personal flags mean for the decision. None of it is a dosing recommendation."
    >
      {report.compounds.map((c, i) => (
        <CompoundDosing key={c.slug} c={c} index={i} />
      ))}
    </ReportSection>
  );
}
