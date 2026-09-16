"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Report } from "@/lib/engine/types";
import { EmptyLine, MonoLabel, ReportCard, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

export function QuestionsSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const [copied, setCopied] = React.useState(false);

  const copyAll = async () => {
    const text = report.clinicianQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Questions copied", { description: `${report.clinicianQuestions.length} questions are on your clipboard.` });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast("Couldn't copy automatically", { description: "Select the list and copy it manually." });
    }
  };

  return (
    <ReportSection
      def={def}
      description="Questions are drawn from the flags this report raised for you and from each compound's record. Take them, and the monitoring list, to your appointment."
    >
      <ReportCard padding="none">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink bg-paper-2 px-5 py-3 sm:px-6">
          <MonoLabel className="text-ink tnum">
            {report.clinicianQuestions.length} question{report.clinicianQuestions.length === 1 ? "" : "s"}
          </MonoLabel>
          <Button variant="secondary" size="sm" onClick={copyAll} className="no-print" disabled={report.clinicianQuestions.length === 0}>
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied ? "Copied" : "Copy all"}
          </Button>
        </div>
        {report.clinicianQuestions.length === 0 ? (
          <div className="px-5 py-6 sm:px-6">
            <EmptyLine>No questions could be derived — add compounds to your assessment to generate them.</EmptyLine>
          </div>
        ) : (
          <ol>
            {report.clinicianQuestions.map((q, i) => (
              <li key={q} className="flex gap-4 border-b border-line px-5 py-4 last:border-b-0 sm:px-6 break-inside-avoid">
                <span className="mt-0.5 w-6 shrink-0 font-mono text-[12px] tnum text-brand-600">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[15px] leading-relaxed text-ink">{q}</p>
              </li>
            ))}
          </ol>
        )}
      </ReportCard>

      <ReportCard tone="paper">
        <h3 className="font-display text-[1.2rem] uppercase leading-none text-ink">Monitoring considerations</h3>
        <p className="mt-2 text-sm text-muted">
          What the records of the compounds you are considering say should be watched before and during any use. A
          clinician decides what applies to you.
        </p>
        {report.monitoring.length === 0 ? (
          <EmptyLine>
            <span className="mt-4 block">No monitoring items are listed for the compounds you are considering.</span>
          </EmptyLine>
        ) : (
          <ul className="cell-grid mt-5 sm:grid-cols-2 sm:[&>*:nth-child(odd):last-child]:col-span-2">
            {report.monitoring.map((m) => (
              <li key={m} className="flex gap-3 px-4 py-3 text-sm leading-snug text-ink-2 break-inside-avoid">
                <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden />
                {m}
              </li>
            ))}
          </ul>
        )}
      </ReportCard>
    </ReportSection>
  );
}
