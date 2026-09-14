"use client";

import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SOURCE_LABELS } from "@/lib/assessment/types";
import type { Report, SourceAssessment } from "@/lib/engine/types";
import { SOURCE_LEVEL_DESCRIPTIONS } from "@/lib/engine/labels";
import { MonoLabel, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

const LEVEL_TONE: Record<SourceAssessment["level"], "success" | "warning" | "danger"> = {
  lower: "success",
  moderate: "warning",
  higher: "danger",
};

export function SourceSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const s = report.sourceAssessment;
  const source = report.answers.source;
  return (
    <ReportSection
      def={def}
      description="Supply risk is assessed separately from the compound: the same molecule from a licensed pharmacy and from a research-chemical vendor is not the same product."
    >
      <Reveal>
        <ReportCard>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-brand-700">
                <Package className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">{s.headline}</h3>
                <p className="mt-1 text-sm text-muted">
                  {source ? `Source you described: ${SOURCE_LABELS[source].toLowerCase()}` : "Source not described"}
                </p>
              </div>
            </div>
            <Badge tone={LEVEL_TONE[s.level]} size="md" dot>
              {s.headline}
            </Badge>
          </div>
          <p className="mt-5 text-pretty text-[0.95rem] leading-relaxed text-ink-2">{SOURCE_LEVEL_DESCRIPTIONS[s.level]}</p>
          <div className="mt-6 border-t border-line pt-6">
            <MonoLabel as="h4">Considerations</MonoLabel>
            <ul className="mt-3 space-y-2.5">
              {s.points.map((p) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-ink-2 break-inside-avoid">
                  <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-ink/40" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </ReportCard>
      </Reveal>
    </ReportSection>
  );
}
