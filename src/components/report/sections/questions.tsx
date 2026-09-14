"use client";

import * as React from "react";
import { Activity, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Report } from "@/lib/engine/types";
import { EmptyLine, MonoLabel, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
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
      <Reveal>
        <ReportCard padding="none" className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper-2 px-5 py-3.5 sm:px-7">
            <MonoLabel>
              {report.clinicianQuestions.length} question{report.clinicianQuestions.length === 1 ? "" : "s"}
            </MonoLabel>
            <Button variant="secondary" size="sm" onClick={copyAll} className="no-print" disabled={report.clinicianQuestions.length === 0}>
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copied ? "Copied" : "Copy all"}
            </Button>
          </div>
          {report.clinicianQuestions.length === 0 ? (
            <div className="px-5 py-6 sm:px-7">
              <EmptyLine>No questions could be derived — add compounds to your assessment to generate them.</EmptyLine>
            </div>
          ) : (
            <ol className="divide-y divide-line">
              {report.clinicianQuestions.map((q, i) => (
                <li key={q} className="flex gap-4 px-5 py-4 sm:px-7 break-inside-avoid">
                  <span className="mt-0.5 w-6 shrink-0 font-mono text-[0.72rem] tabular-nums text-brand-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.95rem] leading-relaxed text-ink">{q}</p>
                </li>
              ))}
            </ol>
          )}
        </ReportCard>
      </Reveal>

      <Reveal>
        <ReportCard tone="paper">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-700" aria-hidden />
            <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">Monitoring considerations</h3>
          </div>
          <p className="mt-1 text-sm text-muted">
            What the records of the compounds you are considering say should be watched before and during any use.
            A clinician decides what applies to you.
          </p>
          {report.monitoring.length === 0 ? (
            <EmptyLine>
              <span className="mt-4 block">No monitoring items are listed for the compounds you are considering.</span>
            </EmptyLine>
          ) : (
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {report.monitoring.map((m) => (
                <li key={m} className="flex gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm leading-snug text-ink-2 break-inside-avoid">
                  <span className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" aria-hidden />
                  {m}
                </li>
              ))}
            </ul>
          )}
        </ReportCard>
      </Reveal>
    </ReportSection>
  );
}
