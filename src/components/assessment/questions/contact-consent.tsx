"use client";

import * as React from "react";
import { Checkbox } from "radix-ui";
import { Check, Lock, Mail, Stethoscope } from "lucide-react";
import { isValidEmail } from "@/lib/assessment/derived";
import { useAssessmentStore } from "@/lib/assessment/store";
import { cn } from "@/lib/utils";
import { useAnswers, useDebouncedField } from "../hooks";
import { Field, Reveal, TextInput } from "../primitives";

/**
 * Q44 — explicit, separate consent to be contacted about a professional
 * review, plus email (validated) and optional name.
 */
export function ContactConsent({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const consent = Boolean(answers.contactConsent);

  const commitEmail = React.useCallback((v: string) => setAnswers({ contactEmail: v.trim() }), [setAnswers]);
  const commitName = React.useCallback((v: string) => setAnswers({ contactName: v }), [setAnswers]);
  const [email, updateEmail, flushEmail] = useDebouncedField(answers.contactEmail ?? "", commitEmail);
  const [name, updateName, flushName] = useDebouncedField(answers.contactName ?? "", commitName);

  const emailInvalid = Boolean(showErrors && consent && !isValidEmail(email));

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Stethoscope className="h-5 w-5" aria-hidden />
          </span>
          <div className="text-sm leading-relaxed text-ink-2">
            <p className="font-medium text-ink">What a professional review involves</p>
            <p className="mt-1 text-muted">
              A registered clinician reads your report and the answers behind it, then gets in touch to discuss what is
              and isn&apos;t worth pursuing. It does not replace your own GP or specialist, and we will never share your
              details with anyone else.
            </p>
          </div>
        </div>

        <label
          htmlFor="contact-consent"
          className={cn(
            "mt-1 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
            consent ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500" : "border-line hover:border-ink/20",
          )}
        >
          <Checkbox.Root
            id="contact-consent"
            checked={consent}
            onCheckedChange={(v) => setAnswers({ contactConsent: v === true })}
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-white transition-colors",
              consent ? "border-brand-500 bg-brand-500 text-white" : "border-line-strong",
            )}
          >
            <Checkbox.Indicator>
              <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <span className="text-sm leading-relaxed text-ink">
            I would like to be contacted about a professional review of my report, and I agree to share my email address
            for that purpose only.
          </span>
        </label>
      </div>

      <Reveal show={consent}>
        <div className="grid gap-4 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 sm:grid-cols-[1fr_1fr] sm:p-5">
          <Field label="Email address" htmlFor="contact-email" error={emailInvalid ? "Enter a valid email address." : undefined}>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" aria-hidden />
              <TextInput
                id="contact-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                data-autofocus="always"
                value={email}
                aria-invalid={emailInvalid || undefined}
                placeholder="you@example.com"
                onChange={(e) => updateEmail(e.target.value)}
                onBlur={flushEmail}
                onKeyDown={(e) => {
                  if (e.key === "Enter") flushEmail();
                }}
                className="pl-11"
              />
            </div>
          </Field>
          <Field label="Name" htmlFor="contact-name" optional>
            <TextInput
              id="contact-name"
              type="text"
              autoComplete="given-name"
              value={name}
              placeholder="How should we address you?"
              onChange={(e) => updateName(e.target.value)}
              onBlur={flushName}
              onKeyDown={(e) => {
                if (e.key === "Enter") flushName();
              }}
            />
          </Field>
        </div>
      </Reveal>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Your details are stored on this device alongside your answers and only leave it when you send a review request
        from your report. Untick the box at any time to withdraw.
      </p>
    </div>
  );
}
