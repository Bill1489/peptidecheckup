"use client";

import { Globe } from "lucide-react";
import { SuitabilityBadge } from "@/components/ui/badge";
import { SUITABILITY_DESCRIPTIONS, SUITABILITY_LABELS, type Report, type Suitability } from "@/lib/engine/types";
import { FlagList } from "../flag-list";
import { CompoundHeading, EmptyLine, MonoLabel, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

const LABELS: Suitability[] = ["potentially_relevant", "higher_concern", "insufficient_information"];

export function SuitabilitySection({ report, def }: { report: Report; def: ReportSectionDef }) {
  return (
    <ReportSection
      def={def}
      description="Each compound receives one of three labels. They describe whether your responses identified factors that warrant professional review — they are not a clinical determination, and none of them is an instruction."
    >
      <Reveal>
        <ul className="grid gap-3 sm:grid-cols-3">
          {LABELS.map((s) => (
            <li key={s} className="rounded-xl border border-line bg-white px-4 py-3.5 break-inside-avoid">
              <SuitabilityBadge level={s} size="sm" />
              <p className="mt-2.5 text-xs leading-relaxed text-muted">{SUITABILITY_DESCRIPTIONS[s]}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {report.globalFlags.length > 0 && (
        <Reveal>
          <ReportCard tone="paper">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 shadow-soft">
                <Globe className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">
                  Applies to everything you&apos;re considering
                </h3>
                <p className="mt-1 text-sm text-muted">
                  These flags come from your answers about yourself rather than from any single compound, so they
                  count towards every label below.
                </p>
              </div>
            </div>
            <FlagList flags={report.globalFlags} className="mt-6" />
          </ReportCard>
        </Reveal>
      )}

      {report.compounds.map((c, i) => (
        <Reveal key={c.slug} delay={Math.min(i, 3) * 0.04}>
          <ReportCard>
            <CompoundHeading name={c.name} meta={c.classLabel} right={<SuitabilityBadge level={c.suitability} />} />
            <p className="mt-4 text-pretty text-[0.95rem] leading-relaxed text-ink-2">{c.suitabilityRationale}</p>
            <div className="mt-6 border-t border-line pt-6">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <MonoLabel as="h4">Compound-specific flags</MonoLabel>
                <MonoLabel className="text-[0.62rem] text-muted-2">
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
        </Reveal>
      ))}
    </ReportSection>
  );
}
