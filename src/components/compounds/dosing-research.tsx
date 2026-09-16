import type * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROUTE_LABELS, type DosingStudy } from "@/data/types";
import { formatNumber } from "@/lib/compare";
import { cn } from "@/lib/utils";
import { Marker } from "./primitives";

interface Fact {
  label: string;
  value: React.ReactNode;
}

/**
 * Label/value grid that reads as a table from `md` (mono header row, columns
 * divided by hairlines) and stacks into label-over-value rows below it.
 */
function FactTable({ facts, cols, className }: { facts: Fact[]; cols: string; className?: string }) {
  return (
    <dl className={cn("grid md:divide-x md:divide-line", cols, className)}>
      {facts.map((f) => (
        <div key={f.label} className="flex min-w-0 flex-col border-b border-line last:border-b-0 md:border-b-0">
          <dt className="label-mono border-b border-line bg-paper-2 px-4 py-2">{f.label}</dt>
          <dd className="px-4 py-3 text-[14px] leading-relaxed text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ResearchBanner({ className }: { className?: string }) {
  return (
    <div role="note" className={cn("flex gap-3 border border-ink bg-paper-2 px-4 py-3.5 text-[13.5px] leading-relaxed text-ink-3", className)}>
      <Marker className="mt-1.5 bg-caution" />
      <p>
        <strong className="font-semibold text-ink">Research information — not a recommendation.</strong> These are the exposures used in
        published human studies, reported so you can see what has been tested. They are not dosing instructions and do not apply to any
        individual.
      </p>
    </div>
  );
}

function StudyTable({ study, index }: { study: DosingStudy; index: number }) {
  return (
    <article className="border border-ink" aria-labelledby={`study-${index}`}>
      <header className="flex flex-col gap-3 border-b border-ink p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="label-mono tnum">Study {String(index + 1).padStart(2, "0")}</p>
          <h3 id={`study-${index}`} className="mt-1.5 text-[15px] font-semibold leading-snug tracking-normal text-ink">
            {study.title}
          </h3>
          <p className="mt-1.5 font-mono text-[11.5px] leading-relaxed text-muted">
            {study.citation}
            {study.url && (
              <>
                {" · "}
                <a
                  href={study.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-rule inline-flex items-center gap-0.5 text-ink"
                >
                  Source
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </a>
              </>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          {study.phase && (
            <Badge tone="neutral" size="xs">
              {study.phase}
            </Badge>
          )}
          <Badge tone="outline" size="xs" className="tnum">
            {study.year}
          </Badge>
        </div>
      </header>

      <FactTable
        cols="md:grid-cols-5"
        facts={[
          { label: "Design", value: study.design },
          { label: "Population", value: study.population },
          { label: "Participants", value: study.n !== undefined ? <span className="tnum">n = {formatNumber(study.n)}</span> : "Not reported" },
          { label: "Duration", value: study.duration },
          { label: "Route", value: ROUTE_LABELS[study.route] },
        ]}
      />
      <FactTable
        className="border-t border-ink"
        cols="md:grid-cols-3"
        facts={[
          { label: "Doses studied", value: study.doses },
          { label: "Outcome at this exposure", value: study.outcome },
          { label: "Adverse events observed", value: study.adverseEvents },
        ]}
      />
    </article>
  );
}

/**
 * "What the evidence says about dosing": published human studies as bordered
 * tables, or the record's note when no comparable studies exist.
 */
export function DosingResearch({
  studies,
  note,
  compoundName,
}: {
  studies: DosingStudy[];
  note?: string;
  compoundName: string;
}) {
  return (
    <div className="space-y-4">
      <ResearchBanner />

      {studies.length === 0 ? (
        <div className="border border-ink p-5 sm:p-6">
          <p className="label-mono">No studies recorded</p>
          <h3 className="font-display mt-2 text-[1.4rem] uppercase leading-none text-ink">No published human dosing studies</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            {note ??
              `Our database holds no published human study of ${compoundName} with comparable exposure data. Any dose quoted elsewhere is not supported by human trial evidence.`}
          </p>
        </div>
      ) : (
        <>
          {studies.map((study, i) => (
            <StudyTable key={`${study.citation}-${i}`} study={study} index={i} />
          ))}
          {note && <p className="text-[13.5px] leading-relaxed text-muted">{note}</p>}
        </>
      )}
    </div>
  );
}
