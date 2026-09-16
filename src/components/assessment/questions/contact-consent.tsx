"use client";

import * as React from "react";
import { Checkbox } from "radix-ui";
import { Check } from "lucide-react";
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
      <div className="border border-ink bg-white">
        <div className="border-b border-ink p-4 sm:p-5">
          <p className="label-mono text-ink">What a professional review involves</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            A registered clinician reads your report and the answers behind it, then gets in touch to discuss what is
            and isn&apos;t worth pursuing. It does not replace your own GP or specialist, and we will never share your
            details with anyone else.
          </p>
        </div>

        <label
          htmlFor="contact-consent"
          className={cn(
            "flex cursor-pointer items-start gap-3 p-4 transition-colors sm:p-5",
            consent ? "bg-paper-2" : "bg-white hover:bg-paper-2",
          )}
        >
          <Checkbox.Root
            id="contact-consent"
            checked={consent}
            onCheckedChange={(v) => setAnswers({ contactConsent: v === true })}
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-none border bg-white transition-colors",
              consent ? "border-brand-600 bg-brand-600 text-white" : "border-ink",
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
        <div className="grid gap-4 border border-ink border-l-[3px] border-l-brand-600 bg-white p-4 sm:grid-cols-2 sm:p-5">
          <Field label="Email address" htmlFor="contact-email" error={emailInvalid ? "Enter a valid email address." : undefined}>
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
            />
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

      <p className="flex items-start gap-3 text-xs leading-relaxed text-muted">
        <span className="mt-[0.35rem] h-2 w-2 shrink-0 bg-brand-600" aria-hidden />
        Your details are stored on this device alongside your answers and only leave it when you send a review request
        from your report. Untick the box at any time to withdraw.
      </p>
    </div>
  );
}
