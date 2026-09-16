"use client";

import { Badge } from "@/components/ui/badge";
import { SOURCE_LABELS } from "@/lib/assessment/types";
import type { Report, SourceAssessment } from "@/lib/engine/types";
import { SOURCE_LEVEL_DESCRIPTIONS } from "@/lib/engine/labels";
import { MonoLabel, ReportCard, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

const LEVEL_TONE: Record<SourceAssessment["level"], "brand" | "warning" | "danger"> = {
  lower: "brand",
  moderate: "warning",
  higher: "danger",
};

const LEVEL_EDGE: Record<SourceAssessment["level"], string> = {
  lower: "border-l-brand-600",
  moderate: "border-l-caution",
  higher: "border-l-accent-500",
};

export function SourceSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const s = report.sourceAssessment;
  const source = report.answers.source;
  return (
    <ReportSection
      def={def}
      description="Supply risk is assessed separately from the compound: the same molecule from a licensed pharmacy and from a research-chemical vendor is not the same product. Every product we sell ships with a published, batch-specific certificate of analysis."
    >
      <ReportCard className={`border-l-[3px] ${LEVEL_EDGE[s.level]}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <MonoLabel>{source ? `Source you described · ${SOURCE_LABELS[source]}` : "Source not described"}</MonoLabel>
            <h3 className="mt-2 font-display text-[1.35rem] uppercase leading-none text-ink">{s.headline}</h3>
          </div>
          <Badge tone={LEVEL_TONE[s.level]} size="md" dot>
            {s.headline}
          </Badge>
        </div>
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-2">{SOURCE_LEVEL_DESCRIPTIONS[s.level]}</p>
        <div className="mt-5 border-t border-line pt-5">
          <MonoLabel as="h4" className="text-ink">
            Considerations
          </MonoLabel>
          <ul className="mt-3 space-y-2.5">
            {s.points.map((p) => (
              <li key={p} className="flex gap-3 text-sm leading-relaxed text-ink-2 break-inside-avoid">
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 bg-ink" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </ReportCard>
    </ReportSection>
  );
}
