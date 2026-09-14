"use client";

import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StackEvidence } from "@/data/types";
import type { Report, StackAnalysis } from "@/lib/engine/types";
import { STACK_EVIDENCE_LABELS, UNCERTAINTY_LABELS } from "@/lib/engine/labels";
import { MonoLabel, Note, ReportCard, ReportSection, StatTile } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

const EVIDENCE_TONE: Record<StackEvidence | "mixed", "success" | "warning" | "neutral" | "info"> = {
  studied: "success",
  limited: "warning",
  none: "neutral",
  mixed: "info",
};

const UNCERTAINTY_TONE: Record<StackAnalysis["uncertainty"], "success" | "warning" | "danger" | "neutral"> = {
  low: "success",
  moderate: "warning",
  moderate_high: "warning",
  high: "danger",
};

export function StackSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const stack = report.stack;
  if (!stack) return null;

  return (
    <ReportSection
      def={def}
      description={`You indicated you might combine ${stack.compounds.map((c) => c.name).join(", ")}. Each pair is checked against the stack notes in our database.`}
    >
      <Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatTile label="Number of compounds" value={stack.count} />
          <StatTile
            label="Evidence supporting combination"
            value={STACK_EVIDENCE_LABELS[stack.combinationEvidence]}
            tone={stack.combinationEvidence === "studied" ? "success" : stack.combinationEvidence === "none" ? "danger" : "warning"}
          />
          <StatTile label="Overlapping considerations" value={stack.overlappingConsiderations.length} />
          <StatTile label="Evidence gaps" value={stack.evidenceGaps} tone={stack.evidenceGaps > 0 ? "warning" : "neutral"} />
          <StatTile
            label="Overall uncertainty"
            value={UNCERTAINTY_LABELS[stack.uncertainty]}
            tone={UNCERTAINTY_TONE[stack.uncertainty] === "neutral" ? "neutral" : UNCERTAINTY_TONE[stack.uncertainty]}
            className="col-span-2 sm:col-span-1"
          />
        </div>
      </Reveal>

      <Reveal>
        <ReportCard padding="none" className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line bg-paper-2 px-5 py-3.5 sm:px-7">
            <Layers className="h-4 w-4 text-brand-700" aria-hidden />
            <MonoLabel>Pairwise evidence</MonoLabel>
          </div>
          <ul className="divide-y divide-line">
            {stack.pairs.map((p) => (
              <li key={`${p.a}+${p.b}`} className="px-5 py-5 sm:px-7 break-inside-avoid">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">
                    {p.aName} <span className="text-muted-2">+</span> {p.bName}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone={EVIDENCE_TONE[p.evidence]} dot>
                      Evidence: {STACK_EVIDENCE_LABELS[p.evidence]}
                    </Badge>
                    {p.duplication && (
                      <Badge tone="danger" dot>
                        Duplicate mechanism
                      </Badge>
                    )}
                  </div>
                </div>
                {p.overlap && <p className="mt-2 text-sm italic leading-relaxed text-ink-3">{p.overlap}</p>}
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.note}</p>
              </li>
            ))}
          </ul>
        </ReportCard>
      </Reveal>

      <Reveal>
        <Note tone={stack.combinationEvidence === "studied" ? "brand" : "warning"} className="text-[0.95rem]">
          <p className="font-display text-lg leading-snug text-ink">{stack.summary}</p>
        </Note>
      </Reveal>
    </ReportSection>
  );
}
