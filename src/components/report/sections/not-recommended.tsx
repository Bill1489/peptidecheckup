"use client";

import type { Report } from "@/lib/engine/types";
import { NOT_RECOMMENDED_EMPTY } from "@/lib/engine/labels";
import { MonoLabel, ReportCard, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

export function NotRecommendedSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const items = report.notRecommended;
  return (
    <ReportSection
      def={def}
      description="Compounds — and combinations — whose label is Higher concern, with the reasons expressed as what triggered the flag. This is a list of things to review, not a list of prohibitions."
    >
      {items.length === 0 ? (
        <ReportCard tone="paper">
          <MonoLabel className="text-ink">Nothing listed</MonoLabel>
          <h3 className="mt-2 font-display text-[1.35rem] uppercase leading-none text-ink">No review-required items</h3>
          <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-2">{NOT_RECOMMENDED_EMPTY}</p>
        </ReportCard>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.slug}>
              <ReportCard className="border-l-[3px] border-l-accent-500">
                <MonoLabel className="text-accent-600">Higher concern</MonoLabel>
                <h3 className="mt-2 font-display text-[1.35rem] uppercase leading-none text-ink">{item.name}</h3>
                <MonoLabel className="mt-5">Why this needs professional review</MonoLabel>
                <ul className="mt-2 space-y-1.5">
                  {item.reasons.map((r) => (
                    <li key={r} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                      <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 bg-accent-500" aria-hidden />
                      {r}
                    </li>
                  ))}
                </ul>
              </ReportCard>
            </li>
          ))}
        </ul>
      )}
    </ReportSection>
  );
}
