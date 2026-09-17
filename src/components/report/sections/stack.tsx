"use client";

import { Badge } from "@/components/ui/badge";
import type { StackEvidence } from "@/data/types";
import type { Report, StackAnalysis } from "@/lib/engine/types";
import { STACK_EVIDENCE_LABELS, UNCERTAINTY_LABELS } from "@/lib/engine/labels";
import { MonoLabel, Note, ReportCard, ReportSection, StatTile } from "../primitives";
import type { ReportSectionDef } from "../sections";

const EVIDENCE_TONE: Record<StackEvidence | "mixed", "brand" | "warning" | "neutral" | "outline"> = {
  studied: "brand",
  limited: "warning",
  none: "neutral",
  mixed: "outline",
};

const UNCERTAINTY_TONE: Record<StackAnalysis["uncertainty"], "brand" | "warning" | "danger" | "neutral"> = {
  low: "brand",
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
      description={`Some pens in this report blend more than one compound — ${stack.compounds.map((c) => c.name).join(", ")} between them. Each pair inside a blend is checked against the stack notes in our database; a pen is only as well-evidenced as its least-studied pairing.`}
    >
      <div className="cell-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Number of compounds" value={stack.count} />
        <StatTile
          label="Evidence supporting combination"
          value={STACK_EVIDENCE_LABELS[stack.combinationEvidence]}
          tone={stack.combinationEvidence === "studied" ? "brand" : stack.combinationEvidence === "none" ? "danger" : "warning"}
        />
        <StatTile label="Overlapping considerations" value={stack.overlappingConsiderations.length} />
        <StatTile label="Evidence gaps" value={stack.evidenceGaps} tone={stack.evidenceGaps > 0 ? "warning" : "neutral"} />
        <StatTile
          label="Overall uncertainty"
          value={UNCERTAINTY_LABELS[stack.uncertainty]}
          tone={UNCERTAINTY_TONE[stack.uncertainty]}
          className="col-span-2 lg:col-span-1"
        />
      </div>

      <ReportCard padding="none">
        <div className="border-b border-ink bg-paper-2 px-5 py-3 sm:px-6">
          <MonoLabel className="text-ink">Pairwise evidence</MonoLabel>
        </div>
        <ul>
          {stack.pairs.map((p) => (
            <li key={`${p.a}+${p.b}`} className="border-b border-line px-5 py-5 last:border-b-0 sm:px-6 break-inside-avoid">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-[1.2rem] uppercase leading-none text-ink">
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
              {p.overlap && <p className="mt-3 text-sm leading-relaxed text-ink">{p.overlap}</p>}
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.note}</p>
            </li>
          ))}
        </ul>
      </ReportCard>

      <Note tone={stack.combinationEvidence === "studied" ? "brand" : "warning"}>
        <p className="font-display text-[1.1rem] leading-snug text-ink">{stack.summary}</p>
      </Note>
    </ReportSection>
  );
}
