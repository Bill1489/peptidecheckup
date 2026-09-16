"use client";

import { ExternalLink } from "lucide-react";
import { Badge, FlagBadge, SuitabilityBadge } from "@/components/ui/badge";
import { ROUTE_LABELS, type DosingStudy } from "@/data/types";
import type { CompoundReport, DoseVerdict, Report } from "@/lib/engine/types";
import { DOSE_VERDICT_LABELS, PROFESSIONAL_REVIEW_SENTENCE, RESEARCH_INFO_LABEL } from "@/lib/engine/labels";
import { cn } from "@/lib/utils";
import { CompoundHeading, DataTable, MonoLabel, Note, ReportCard, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

/** Signal edge for the comparison verdict: cobalt within range, orange above, amber for other differences, ink when not comparable. */
const VERDICT_EDGE: Record<DoseVerdict, string> = {
  within_range: "border-l-brand-600",
  above_range: "border-l-accent-500",
  below_range: "border-l-caution",
  frequency_differs: "border-l-caution",
  route_differs: "border-l-caution",
  no_human_data: "border-l-ink",
  not_comparable: "border-l-ink",
  not_provided: "border-l-ink",
};

function LayerLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <MonoLabel as="h4" className="flex items-center gap-2.5 text-ink">
      <span className="inline-flex h-5 w-5 items-center justify-center bg-ink font-mono text-[10px] text-white">{n}</span>
      {children}
    </MonoLabel>
  );
}

function StudyCell({ s }: { s: DosingStudy }) {
  const meta = [s.phase, String(s.year), s.n !== undefined ? `n = ${s.n.toLocaleString("en-GB")}` : undefined].filter(
    (x): x is string => Boolean(x),
  );
  return (
    <>
      <p className="font-medium leading-snug text-ink">{s.title}</p>
      <p className="mt-1 text-[12.5px] text-muted">
        {s.url ? (
          <a href={s.url} target="_blank" rel="noreferrer noopener" className="link-rule inline-flex items-center gap-1 hover:text-ink">
            {s.citation}
            <ExternalLink className="no-print h-3 w-3" aria-hidden />
          </a>
        ) : (
          s.citation
        )}
      </p>
      <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
        {meta.join(" · ")}
        {meta.length > 0 && " · "}
        {s.design}
      </p>
    </>
  );
}

function CompoundDosing({ c }: { c: CompoundReport }) {
  const riskFlags = c.flags.filter((f) => f.severity !== "info").slice(0, 5);
  const infoFlags = c.flags.filter((f) => f.severity === "info");

  return (
    <ReportCard padding="none">
      <div className="border-b border-ink px-5 py-4 sm:px-6">
        <CompoundHeading name={c.name} meta={c.classLabel} right={<SuitabilityBadge level={c.suitability} size="sm" />} />
      </div>

      {/* Layer A — research */}
      <div className="border-b border-ink px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <LayerLabel n="A">What the evidence says about dosing</LayerLabel>
          <Badge tone="outline" size="xs">
            {RESEARCH_INFO_LABEL}
          </Badge>
        </div>

        {c.dosingResearch.length > 0 ? (
          <DataTable<DosingStudy>
            className="mt-4"
            breakpoint="md"
            caption={`Published human dosing studies of ${c.name}`}
            rows={c.dosingResearch}
            rowKey={(s) => `${s.citation}-${s.year}`}
            columns={[
              { key: "study", header: "Study", className: "min-w-[14rem]", render: (s) => <StudyCell s={s} /> },
              {
                key: "population",
                header: "Population · duration",
                render: (s) => (
                  <>
                    <p>{s.population}</p>
                    <p className="mt-1 font-mono text-[12px] text-muted tnum">{s.duration}</p>
                  </>
                ),
              },
              {
                key: "doses",
                header: "Doses studied",
                className: "font-mono text-[12.5px] tnum",
                render: (s) => s.doses,
              },
              { key: "route", header: "Route", className: "whitespace-nowrap", render: (s) => ROUTE_LABELS[s.route] },
              { key: "outcome", header: "Outcome", className: "min-w-[12rem]", render: (s) => s.outcome },
            ]}
            detail={(s) => (
              <>
                <span className="label-mono mr-2">Adverse events</span>
                {s.adverseEvents}
              </>
            )}
          />
        ) : (
          <Note className="mt-4">{c.dosingResearchNote ?? `No published human dosing studies of ${c.name} are held in our database.`}</Note>
        )}
        {c.dosingResearch.length > 0 && c.dosingResearchNote && (
          <p className="mt-3 text-sm leading-relaxed text-muted">{c.dosingResearchNote}</p>
        )}
      </div>

      {/* Layer B — comparison */}
      <div className="border-b border-ink px-5 py-5 sm:px-6">
        <LayerLabel n="B">How this compares with what you&apos;re considering</LayerLabel>
        <div className={cn("mt-4 border border-ink border-l-[3px] bg-white p-4 break-inside-avoid", VERDICT_EDGE[c.doseComparison.verdict])}>
          <p className="text-[15px] font-medium leading-snug text-ink">{DOSE_VERDICT_LABELS[c.doseComparison.verdict]}</p>
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[12px] text-ink-3">
            <div className="flex gap-2">
              <dt className="uppercase tracking-[0.1em] text-muted">Your dose</dt>
              <dd className="tnum">{c.doseComparison.userDoseLabel}</dd>
            </div>
            {c.doseComparison.referenceStudy && (
              <div className="flex gap-2">
                <dt className="uppercase tracking-[0.1em] text-muted">Reference</dt>
                <dd>{c.doseComparison.referenceStudy}</dd>
              </div>
            )}
          </dl>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-2">{c.doseComparison.explanation}</p>
        </div>
      </div>

      {/* Layer C — personal suitability and risk */}
      <div className="px-5 py-5 sm:px-6">
        <LayerLabel n="C">Personal suitability and risk</LayerLabel>
        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
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
                No compound-specific caution or review-required flags were raised for {c.name}. Global flags, if any, are
                listed in the suitability section.
              </p>
            )}
            <p className="mt-4 border-l-[3px] border-ink pl-3 font-display text-[1.1rem] leading-snug text-ink">{PROFESSIONAL_REVIEW_SENTENCE}</p>
          </div>
        </div>
      </div>
    </ReportCard>
  );
}

export function DosingSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  return (
    <ReportSection
      def={def}
      description="Three layers for each compound: what published human studies actually used, how the dose you entered compares with those exposures, and what your personal flags mean for the decision. None of it is a dosing recommendation."
    >
      {report.compounds.map((c) => (
        <CompoundDosing key={c.slug} c={c} />
      ))}
    </ReportSection>
  );
}
