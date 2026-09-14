"use client";

import { CircleCheck, ShieldAlert } from "lucide-react";
import type { Report } from "@/lib/engine/types";
import { NOT_RECOMMENDED_EMPTY } from "@/lib/engine/labels";
import { MonoLabel, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

export function NotRecommendedSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const items = report.notRecommended;
  return (
    <ReportSection
      def={def}
      description="Compounds — and combinations — whose label is Higher concern, with the reasons expressed as what triggered the flag. This is a list of things to review, not a list of prohibitions."
    >
      {items.length === 0 ? (
        <Reveal>
          <ReportCard tone="paper" className="flex items-start gap-4">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-relevant-soft text-emerald-700">
              <CircleCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">No review-required items</h3>
              <p className="mt-2 text-pretty text-[0.95rem] leading-relaxed text-ink-2">{NOT_RECOMMENDED_EMPTY}</p>
            </div>
          </ReportCard>
        </Reveal>
      ) : (
        <ul className="space-y-4">
          {items.map((item, i) => (
            <Reveal key={item.slug} as="li" delay={Math.min(i, 3) * 0.04}>
              <ReportCard className="border-l-[3px] border-l-concern">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-concern-soft text-rose-700">
                    <ShieldAlert className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">{item.name}</h3>
                    <MonoLabel className="mt-3 text-[0.62rem]">Why this needs professional review</MonoLabel>
                    <ul className="mt-2 space-y-1.5">
                      {item.reasons.map((r) => (
                        <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
                          <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-rose-400" aria-hidden />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ReportCard>
            </Reveal>
          ))}
        </ul>
      )}
    </ReportSection>
  );
}
