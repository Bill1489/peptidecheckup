"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Columns2, Printer, Send, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isValidEmail } from "@/lib/assessment/derived";
import { BRAND, DISCLAIMER_REPORT } from "@/lib/brand";
import type { Report } from "@/lib/engine/types";
import { submitLead } from "@/lib/leads";
import { formatDate } from "@/lib/utils";
import { MonoLabel, Note, ReportCard, ReportSection } from "../primitives";
import { scrollToSection } from "../report-toc";
import { ResponsesAppendix } from "../responses-appendix";
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
  const [emailInput, setEmailInput] = React.useState(report.answers.contactEmail ?? "");
  const [inputError, setInputError] = React.useState<string | undefined>(undefined);
  const storedEmail = report.answers.contactEmail?.trim();
  const canRequest = report.contactRequested && Boolean(storedEmail);
  const hasConcern = report.overview.higherConcern > 0;

  const lastReviewed = report.compounds
    .map((c) => c.lastReviewed)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);

  const request = async () => {
    const email = canRequest ? storedEmail : emailInput.trim();
    if (!email || !isValidEmail(email)) {
      setInputError("Enter a valid email address.");
      return;
    }
    setInputError(undefined);
    setStatus("sending");
    const result = await submitLead({
      kind: "report",
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
      toast("Request received", { description: `We'll be in touch at ${email}. Reference ${report.id}.` });
    } else {
      setStatus("idle");
      toast("Couldn't send your request", { description: result.error ?? "Please try again in a moment." });
    }
  };

  return (
    <ReportSection
      def={def}
      description={
        hasConcern
          ? "At least one compound carries a Higher concern label. Talk it through with a clinician before you buy anything — the match section only offers pens your labels allow."
          : "Your match is above. Take this report to a clinician before starting anything, and quote the reference number if you ask us for a review."
      }
    >
      <ReportCard tone="ink" padding="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <MonoLabel className="text-brand-300">Request a clinician review</MonoLabel>
            <h3 className="mt-3 font-display text-[1.5rem] uppercase leading-[0.98] text-white sm:text-[1.75rem]">
              Have a qualified professional go through this with you
            </h3>
            <p className="mt-3 max-w-lg text-pretty text-[15px] leading-relaxed text-white/70">
              {canRequest
                ? `You asked to be contacted about a professional review. We'll use the reference above and the email you gave — ${storedEmail} — to arrange it. Nothing is shared with anyone else.`
                : "A registered clinician reads this report and the answers behind it, then gets in touch to discuss what is and is not worth pursuing. Enter an email to ask for one — it is used for that purpose only and never shared."}
            </p>
            {canRequest && <p className="mt-3 font-mono text-[12px] text-white/60">{storedEmail}</p>}
          </div>
          <div className="no-print flex flex-col gap-2 lg:min-w-72">
            {!canRequest && status !== "sent" && (
              <div>
                <label htmlFor="review-email" className="sr-only">
                  Email for clinician review
                </label>
                <input
                  id="review-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={emailInput}
                  aria-invalid={Boolean(inputError) || undefined}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (inputError) setInputError(undefined);
                  }}
                  className="h-12 w-full rounded-none border border-white/40 bg-transparent px-3 text-[15px] text-white placeholder:text-white/40 focus:border-white focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                />
                {inputError && (
                  <p role="alert" className="mt-2 text-xs text-accent-300">
                    {inputError}
                  </p>
                )}
              </div>
            )}
            <Button variant="inverted" size="lg" onClick={request} loading={status === "sending"} disabled={status === "sent"} className="w-full">
              {status === "sent" ? <Check className="h-4 w-4" aria-hidden /> : status === "idle" ? <Send className="h-4 w-4" aria-hidden /> : null}
              {status === "sent" ? "Request received" : status === "sending" ? "Sending" : "Request a clinician review"}
            </Button>
          </div>
        </div>
      </ReportCard>

      <div className="no-print grid gap-3 sm:grid-cols-2">
        <Button size="lg" className="w-full" onClick={() => scrollToSection("matches")}>
          <ShoppingBag className="h-4 w-4" aria-hidden />
          See your match
        </Button>
        {compareHref && (
          <Button href={compareHref} variant="secondary" size="lg" className="w-full">
            <Columns2 className="h-4 w-4" aria-hidden />
            Compare these compounds
          </Button>
        )}
        <Button variant="secondary" size="lg" className="w-full" onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden />
          Print / save as PDF
        </Button>
        <Button href="/shop/" variant="secondary" size="lg" className="w-full">
          Browse the shop
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      <ReportCard>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-display text-[1.2rem] uppercase leading-none text-ink">Your responses</h3>
          <MonoLabel>Appendix · as entered</MonoLabel>
        </div>
        <p className="mt-2 text-sm text-muted">
          Everything this report was generated from. If something is wrong or missing,{" "}
          <Link href="/assessment/start/" className="link-rule no-print text-ink">
            edit your answers
          </Link>
          <span className="hidden print:inline">edit your answers</span> and the report — and your match — will regenerate.
        </p>
        <div className="mt-4 border-t border-ink">
          <ResponsesAppendix answers={report.answers} />
        </div>
      </ReportCard>

      <Note tone="neutral">
        <p className="font-medium text-ink">About this report</p>
        <p className="mt-1.5 text-ink-3">{DISCLAIMER_REPORT}</p>
      </Note>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink pt-5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
        <span>Evidence database last reviewed {lastReviewed ? formatDate(lastReviewed) : "—"}</span>
        <span>
          {BRAND.displayName} · Report {report.id} · {formatDate(report.generatedAt)}
        </span>
      </div>
    </ReportSection>
  );
}
