"use client";

import { Database } from "lucide-react";
import { RegulatoryBadge } from "@/components/ui/badge";
import { JURISDICTION_LABELS } from "@/data/types";
import type { Report } from "@/lib/engine/types";
import { formatDate } from "@/lib/utils";
import { MonoLabel, Note, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

export function RegulatorySection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const jurisdiction = JURISDICTION_LABELS[report.jurisdiction];
  return (
    <ReportSection
      def={def}
      description={
        report.countryName
          ? `Status for ${report.countryName}, assessed under the ${jurisdiction} entry in our regulatory database.`
          : "You didn't select a country, so status is shown for other jurisdictions in general."
      }
    >
      <Reveal>
        <ReportCard padding="none" className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper-2 px-5 py-3.5 sm:px-7">
            <MonoLabel>
              Jurisdiction · <span className="text-ink">{jurisdiction}</span>
              {report.countryName && report.countryName !== jurisdiction && (
                <span className="text-muted-2"> · {report.countryName}</span>
              )}
            </MonoLabel>
            <MonoLabel className="text-[0.62rem] text-muted-2">
              {report.compounds.length} compound{report.compounds.length === 1 ? "" : "s"}
            </MonoLabel>
          </div>
          <ul className="divide-y divide-line">
            {report.compounds.map((c) => (
              <li key={c.slug} className="grid gap-3 px-5 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:px-7 break-inside-avoid">
                <div>
                  <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">{c.name}</h3>
                  <div className="mt-2">
                    <RegulatoryBadge status={c.regulatory.status} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.95rem] font-medium leading-snug text-ink-2">{c.regulatory.summary}</p>
                  {c.regulatory.detail && <p className="mt-2 text-sm leading-relaxed text-muted">{c.regulatory.detail}</p>}
                  <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-2">
                    Last reviewed {formatDate(c.regulatory.lastReviewed)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ReportCard>
      </Reveal>
      <Reveal>
        <Note icon={<Database className="h-4 w-4" aria-hidden />}>
          From our maintained regulatory database — never inferred. Status describes whether a compound holds a
          marketing authorisation as a medicine in this jurisdiction; it says nothing about whether it is appropriate
          for you.
        </Note>
      </Reveal>
    </ReportSection>
  );
}
