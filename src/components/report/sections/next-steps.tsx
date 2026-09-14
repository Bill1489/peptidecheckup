"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Columns2, Database, Mail, Printer, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BRAND, DISCLAIMER_REPORT } from "@/lib/brand";
import type { Report } from "@/lib/engine/types";
import { submitLead } from "@/lib/leads";
import { formatDate } from "@/lib/utils";
import { MonoLabel, Note, ReportCard, ReportSection } from "../primitives";
import { ResponsesAppendix } from "../responses-appendix";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

type LeadStatus = "idle" | "sending" | "sent";

export function NextStepsSection({
  report,
  def,
  compareHref,
}: {
  report: Report;
  def: ReportSectionDef;
  compareHref?: string;
}) {
  const [status, setStatus] = React.useState<LeadStatus>("idle");
  const email = report.answers.contactEmail?.trim();
  const canRequest = report.contactRequested && Boolean(email);

  const lastReviewed = report.compounds
    .map((c) => c.lastReviewed)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);

  const request = async () => {
    if (!email) return;
    setStatus("sending");
    const result = await submitLead({
      email,
      name: report.answers.contactName?.trim() || undefined,
      reportId: report.id,
      generatedAt: report.generatedAt,
      goal: report.objective.goal,
      compounds: report.compounds.map((c) => c.slug),
      countryCode: report.answers.countryCode,
      jurisdiction: report.jurisdiction,
      consent: true,
      source: "report",
    });
    if (result.ok) {
      setStatus("sent");
      toast("Request received", {
        description: `We'll be in touch at ${email}. Reference ${report.id}.`,
      });
    } else {
      setStatus("idle");
      toast("Couldn't send your request", { description: result.error ?? "Please try again in a moment." });
    }
  };

  return (
    <ReportSection def={def}>
      <Reveal>
        <ReportCard tone="ink" padding="lg" className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl print:hidden" aria-hidden />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <MonoLabel className="flex items-center gap-2 text-brand-300">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Request a clinician review
              </MonoLabel>
              <h3 className="mt-3 font-display text-2xl leading-tight tracking-[-0.02em] text-white sm:text-[1.75rem]">
                Have a qualified professional go through this with you
              </h3>
              <p className="mt-3 max-w-lg text-pretty text-[0.95rem] leading-relaxed text-white/70">
                {canRequest
                  ? `You asked to be contacted about a professional review. We'll use the reference above and the email you gave — ${email} — to arrange it. Nothing is shared with anyone else.`
                  : "You didn't opt in to a clinician review in your assessment. You can add your details in the “Your report” section — nothing is shared without your explicit consent."}
              </p>
              {canRequest && (
                <p className="mt-3 flex items-center gap-2 font-mono text-[0.72rem] text-white/60">
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  {email}
                </p>
              )}
            </div>
            <div className="no-print flex flex-col gap-2 sm:flex-row lg:flex-col">
              {canRequest ? (
                <Button
                  variant="inverted"
                  size="lg"
                  onClick={request}
                  loading={status === "sending"}
                  disabled={status === "sent"}
                  className="min-w-56"
                >
                  {status === "sent" ? <Check className="h-4 w-4" aria-hidden /> : status === "idle" ? <Send className="h-4 w-4" aria-hidden /> : null}
                  {status === "sent" ? "Request received" : status === "sending" ? "Sending" : "Request a clinician review"}
                </Button>
              ) : (
                <Button href="/assessment/start/" variant="inverted" size="lg" className="min-w-56">
                  Add my details
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
              )}
            </div>
          </div>
        </ReportCard>
      </Reveal>

      <Reveal>
        <div className="no-print grid gap-3 sm:grid-cols-3">
          {compareHref && (
            <Button href={compareHref} variant="secondary" size="lg" className="w-full">
              <Columns2 className="h-4 w-4" aria-hidden />
              Compare these compounds
            </Button>
          )}
          <Button variant="secondary" size="lg" className="w-full" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden />
            Print / Save as PDF
          </Button>
          <Button href="/peptides/" variant="secondary" size="lg" className="w-full">
            Browse all peptides
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </Reveal>

      <Reveal>
        <ReportCard>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">Your responses</h3>
            <MonoLabel className="text-[0.62rem] text-muted-2">Appendix · as entered</MonoLabel>
          </div>
          <p className="mt-1 text-sm text-muted">
            Everything this report was generated from. If something is wrong or missing,{" "}
            <Link href="/assessment/start/" className="no-print font-medium text-brand-700 underline-offset-4 hover:underline">
              edit your assessment
            </Link>
            <span className="hidden print:inline">edit your assessment</span> and the report will regenerate.
          </p>
          <div className="mt-4">
            <ResponsesAppendix answers={report.answers} />
          </div>
        </ReportCard>
      </Reveal>

      <Reveal>
        <Note tone="neutral" className="border-line-strong">
          <p className="font-medium text-ink">About this report</p>
          <p className="mt-1.5 text-ink-3">{DISCLAIMER_REPORT}</p>
        </Note>
      </Reveal>

      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-2">
          <span className="inline-flex items-center gap-2">
            <Database className="h-3.5 w-3.5" aria-hidden />
            Evidence database last reviewed {lastReviewed ? formatDate(lastReviewed) : "—"}
          </span>
          <span>
            {BRAND.displayName} · Report {report.id} · {formatDate(report.generatedAt)}
          </span>
        </div>
      </Reveal>
    </ReportSection>
  );
}
