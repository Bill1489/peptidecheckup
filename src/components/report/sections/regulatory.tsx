"use client";

import { RegulatoryBadge } from "@/components/ui/badge";
import { JURISDICTION_LABELS } from "@/data/types";
import type { CompoundReport, Report } from "@/lib/engine/types";
import { formatDate } from "@/lib/utils";
import { DataTable, MonoLabel, Note, ReportSection } from "../primitives";
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonoLabel className="text-ink">
          Jurisdiction · {jurisdiction}
          {report.countryName && report.countryName !== jurisdiction && <span className="text-muted"> · {report.countryName}</span>}
        </MonoLabel>
        <MonoLabel className="tnum">
          {report.compounds.length} compound{report.compounds.length === 1 ? "" : "s"}
        </MonoLabel>
      </div>

      <DataTable<CompoundReport>
        caption={`Regulatory status of each compound in ${jurisdiction}`}
        rows={report.compounds}
        rowKey={(c) => c.slug}
        columns={[
          {
            key: "compound",
            header: "Compound",
            className: "w-[11rem]",
            render: (c) => <span className="font-display text-[1.05rem] uppercase leading-none text-ink">{c.name}</span>,
          },
          {
            key: "status",
            header: "Status",
            className: "w-[11rem]",
            render: (c) => <RegulatoryBadge status={c.regulatory.status} />,
          },
          {
            key: "summary",
            header: "Summary",
            render: (c) => (
              <>
                <p className="font-medium text-ink">{c.regulatory.summary}</p>
                {c.regulatory.detail && <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{c.regulatory.detail}</p>}
              </>
            ),
          },
          {
            key: "reviewed",
            header: "Reviewed",
            className: "w-[8.5rem] whitespace-nowrap font-mono text-[12px] tnum",
            render: (c) => formatDate(c.regulatory.lastReviewed, { day: "2-digit", month: "short", year: "numeric" }),
          },
        ]}
      />

      <Note>
        From our maintained regulatory database — never inferred. Status describes whether a compound holds a marketing
        authorisation as a medicine in this jurisdiction; it says nothing about whether it is appropriate for you.
      </Note>
    </ReportSection>
  );
}
