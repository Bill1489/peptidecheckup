"use client";

import { SuitabilityBadge } from "@/components/ui/badge";
import { SUITABILITY_DESCRIPTIONS, SUITABILITY_LABELS, type Report, type Suitability } from "@/lib/engine/types";
import { FlagList } from "../flag-list";
import { CompoundHeading, EmptyLine, MonoLabel, ReportCard, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

const LABELS: Suitability[] = ["potentially_relevant", "higher_concern", "insufficient_information"];

export function SuitabilitySection({ report, def }: { report: Report; def: ReportSectionDef }) {
  return (
    <ReportSection
      def={def}
      description="Each compound receives one of three labels. They describe whether your responses identified factors that warrant professional review — they are not a clinical determination, and none of them is an instruction."
    >
      <ul className="cell-grid sm:grid-cols-3">
        {LABELS.map((s) => (
          <li key={s} className="p-4 break-inside-avoid">
            <SuitabilityBadge level={s} size="sm" />
            <p className="mt-3 text-xs leading-relaxed text-muted">{SUITABILITY_DESCRIPTIONS[s]}</p>
          </li>
        ))}
      </ul>

      {report.globalFlags.length > 0 && (
        <ReportCard tone="paper">
          <MonoLabel className="text-ink">Applies to everything you&apos;re considering</MonoLabel>
          <h3 className="mt-2 font-display text-[1.35rem] uppercase leading-none text-ink">Person-level flags</h3>
          <p className="mt-2 text-sm text-muted">
            These flags come from your answers about yourself rather than from any single compound, so they count towards
            every label below.
          </p>
          <FlagList flags={report.globalFlags} className="mt-5" />
        </ReportCard>
      )}

      {report.compounds.map((c) => (
        <ReportCard key={c.slug}>
          <CompoundHeading name={c.name} meta={c.classLabel} right={<SuitabilityBadge level={c.suitability} />} />
          <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-2">{c.suitabilityRationale}</p>
          <div className="mt-5 border-t border-line pt-5">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <MonoLabel as="h4" className="text-ink">
                Compound-specific flags
              </MonoLabel>
              <MonoLabel className="tnum">
                {c.flags.length} flag{c.flags.length === 1 ? "" : "s"}
              </MonoLabel>
            </div>
            {c.flags.length > 0 ? (
              <FlagList flags={c.flags} />
            ) : (
              <EmptyLine>
                No compound-specific flags were raised for {c.name}.{" "}
                {report.globalFlags.length > 0
                  ? "The flags that apply to everything you're considering still count towards its label."
                  : `Its label of “${SUITABILITY_LABELS[c.suitability]}” rests on evidence, regulatory status and goal alignment alone.`}
              </EmptyLine>
            )}
          </div>
        </ReportCard>
      ))}
    </ReportSection>
  );
}
