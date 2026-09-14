import { ExternalLink, FlaskConical, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROUTE_LABELS, type DosingStudy } from "@/data/types";
import { formatNumber } from "@/lib/compare";
import { cn } from "@/lib/utils";

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-2">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-ink">{value}</dd>
    </div>
  );
}

export function ResearchBanner({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-xl border border-caution/25 bg-caution-soft px-4 py-3.5 text-sm leading-relaxed text-amber-900",
        className,
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>
        <strong className="font-semibold">Research information — not a recommendation.</strong> These are the exposures used in
        published human studies, reported so you can see what has actually been tested. They are not dosing instructions and do not
        apply to any individual.
      </p>
    </div>
  );
}

function StudyCard({ study, index }: { study: DosingStudy; index: number }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6" aria-labelledby={`study-${index}`}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 id={`study-${index}`} className="font-display text-xl leading-snug text-ink">
            {study.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted">
            {study.citation}
            {study.url && (
              <>
                {" · "}
                <a
                  href={study.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 font-medium text-brand-700 underline-offset-4 hover:underline"
                >
                  Source
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              </>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          {study.phase && (
            <Badge tone="info" size="xs">
              {study.phase}
            </Badge>
          )}
          <Badge tone="neutral" size="xs">
            {study.year}
          </Badge>
        </div>
      </header>

      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Design" value={study.design} />
        <Fact label="Population" value={study.population} />
        <Fact label="Participants" value={study.n !== undefined ? `n = ${formatNumber(study.n)}` : "Not reported"} />
        <Fact label="Duration" value={study.duration} />
      </dl>

      <dl className="mt-4 grid gap-4 rounded-xl bg-paper-2 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <Fact label="Doses studied" value={study.doses} />
        <Fact label="Route" value={ROUTE_LABELS[study.route]} />
      </dl>

      <dl className="mt-4 grid gap-4 md:grid-cols-2">
        <Fact label="Outcome at this exposure" value={study.outcome} />
        <Fact label="Adverse events observed" value={study.adverseEvents} />
      </dl>
    </article>
  );
}

/**
 * "What the evidence says about dosing": published human studies as structured
 * cards, or the record's note when no comparable studies exist.
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
        <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-line-strong bg-paper-2/70 p-5 sm:flex-row sm:items-start sm:p-6">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-muted shadow-soft">
            <FlaskConical className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="font-display text-xl text-ink">No published human dosing studies recorded</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {note ??
                `Our database holds no published human study of ${compoundName} with comparable exposure data. Any dose quoted elsewhere is not supported by human trial evidence.`}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {studies.map((study, i) => (
              <StudyCard key={`${study.citation}-${i}`} study={study} index={i} />
            ))}
          </div>
          {note && (
            <p className="flex gap-2 text-sm leading-relaxed text-muted">
              <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-muted-2" aria-hidden />
              <span>{note}</span>
            </p>
          )}
        </>
      )}
    </div>
  );
}
