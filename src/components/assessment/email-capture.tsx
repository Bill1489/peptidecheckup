"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Checkbox } from "radix-ui";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import type { GoalId } from "@/data/types";
import { isValidEmail } from "@/lib/assessment/derived";
import { submitLead } from "@/lib/leads";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { FieldError, TextInput } from "./primitives";

export const EMAIL_CONSENT_LABEL = "Email me my report and occasional evidence updates. Unsubscribe any time.";

/**
 * Optional lead-capture step shown once the report has been generated and
 * before the user is taken to it (BRIEF §6a). Skippable; consent is explicit.
 */
export function EmailCaptureScreen({
  initialEmail,
  goal,
  compounds,
  countryCode,
  onSent,
  onSkip,
}: {
  initialEmail?: string;
  goal?: GoalId;
  compounds: string[];
  countryCode?: string;
  /** Called after the lead has been submitted (or attempted) with the validated email. */
  onSent: (email: string) => void;
  onSkip: () => void;
}) {
  const reduced = useReducedMotion();
  const [email, setEmail] = React.useState(initialEmail ?? "");
  const [consent, setConsent] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [sending, setSending] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(id);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!consent) {
      setError("Tick the box so we can email you the report.");
      return;
    }
    setError(undefined);
    setSending(true);
    const result = await submitLead({
      kind: "report_email",
      email: trimmed,
      consent: true,
      goal,
      compounds,
      countryCode,
      source: "generating",
    });
    if (result.ok) {
      toast("Report on its way", { description: `We'll email a copy to ${trimmed}.` });
    } else {
      toast("Couldn't send the email", { description: "Your report is still available here. Try again from the report page." });
    }
    onSent(trimmed);
  };

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-white"
    >
      <div className="border-b border-white/20">
        <div className="container-x flex h-14 items-center justify-between sm:h-16">
          <LogoMark tone="light" className="h-7 w-7" />
          <p className="label-mono text-white/60">Report ready</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <p className="label-mono text-brand-300">One more thing · optional</p>
        <h1 className="mt-4 font-display text-[2rem] uppercase leading-[0.98] text-white sm:text-[2.6rem]">
          Where should we send your report?
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
          We can email you a copy to keep and to share with a clinician. Your answers stay on this device either way.
        </p>

        <form onSubmit={submit} noValidate className="mt-8 border border-white bg-white p-5 text-ink sm:p-6">
          <label htmlFor="report-email" className="label-mono text-ink">
            Email
          </label>
          <TextInput
            ref={inputRef}
            id="report-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? "report-email-error" : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            className="mt-2"
          />

          <label
            htmlFor="report-email-consent"
            className={cn(
              "mt-4 flex cursor-pointer items-start gap-3 border p-3.5 text-sm leading-relaxed transition-colors",
              consent ? "border-ink bg-paper-2" : "border-line hover:border-ink",
            )}
          >
            <Checkbox.Root
              id="report-email-consent"
              checked={consent}
              onCheckedChange={(v) => {
                setConsent(v === true);
                if (error) setError(undefined);
              }}
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-none border bg-white transition-colors",
                consent ? "border-brand-600 bg-brand-600 text-white" : "border-ink",
              )}
            >
              <Checkbox.Indicator>
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="text-ink">{EMAIL_CONSENT_LABEL}</span>
          </label>

          {error && (
            <div id="report-email-error" className="mt-3">
              <FieldError>{error}</FieldError>
            </div>
          )}

          <Button type="submit" size="lg" loading={sending} className="mt-5 w-full">
            Send &amp; view report
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <button
            type="button"
            onClick={onSkip}
            disabled={sending}
            className="link-rule mt-4 inline-flex min-h-11 w-full items-center justify-center text-sm text-ink-3 hover:text-ink disabled:opacity-40"
          >
            Skip — just show my report
          </button>
        </form>

        <p className="mt-5 text-xs leading-relaxed text-white/50">
          Your email is used to send the report and occasional evidence updates. It is never shared or sold.
        </p>
      </div>
    </motion.div>
  );
}
