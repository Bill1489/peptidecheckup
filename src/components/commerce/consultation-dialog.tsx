"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { COMMERCE } from "@/lib/commerce/config";
import { submitLead } from "@/lib/leads";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function regionName(code: string) {
  try {
    return new Intl.DisplayNames(["en-GB"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

const COUNTRIES = COMMERCE.shipTo.map((code) => ({ code, name: regionName(code) })).sort((a, b) => a.name.localeCompare(b.name));

const fieldClass =
  "h-12 w-full border border-ink bg-white px-3 text-[14px] text-ink placeholder:text-muted-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600 disabled:opacity-50";

/**
 * Lead form for prescription-channel products. Nothing is sold here: the
 * request goes to the partner prescriber, who decides whether to proceed.
 */
export function ConsultationDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const reduce = useReducedMotion();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("GB");
  const [consent, setConsent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (!consent) return setError("Tick the consent box to continue.");
    setBusy(true);
    try {
      const res = await submitLead({
        kind: "consultation",
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim() || undefined,
        countryCode: country,
        productSlug: product.slug,
        compounds: product.compoundSlug ? [product.compoundSlug] : undefined,
        consent: true,
        source: "pdp",
      });
      if (!res.ok) {
        setError(res.error ?? "Something went wrong. Try again in a moment.");
        return;
      }
      setDone(true);
      toast("Consultation request sent", { description: `${product.name} · ${COMMERCE.prescriberPartner} will be in touch by email.` });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-ink/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed inset-0 z-50 flex items-end justify-center focus:outline-none sm:items-center sm:p-4"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.22, ease: EASE }}
                // The content element fills the viewport so the panel can be centred; a
                // click on the padding around the panel closes, like a backdrop click.
                onClick={(e) => {
                  if (e.target === e.currentTarget) onOpenChange(false);
                }}
              >
                <div className="max-h-[92vh] w-full overflow-y-auto border-t border-ink bg-white sm:max-w-lg sm:border">
                  <div className="flex items-start justify-between gap-4 border-b border-ink px-5 py-4 sm:px-6">
                    <div>
                      <p className="label-mono text-brand-600">Consultation request</p>
                      <Dialog.Title className="mt-2 text-[1.5rem] uppercase sm:text-[1.75rem]">{product.name}</Dialog.Title>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close"
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-ink text-ink hover:bg-ink hover:text-white"
                      >
                        <X className="h-4 w-4" aria-hidden />
                      </button>
                    </Dialog.Close>
                  </div>

                  {done ? (
                    <div className="px-5 py-8 sm:px-6">
                      <span className="inline-flex h-10 w-10 items-center justify-center bg-brand-600 text-white">
                        <Check className="h-5 w-5" aria-hidden />
                      </span>
                      <h3 className="mt-5 text-[1.25rem] uppercase">Request received</h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-muted">
                        {COMMERCE.prescriberPartner.charAt(0).toUpperCase() + COMMERCE.prescriberPartner.slice(1)} will email {email} with a
                        secure link to the medical questionnaire. A prescription is issued only if the licensed criteria are met — the consultation
                        can, and sometimes does, say no.
                      </p>
                      <Dialog.Close asChild>
                        <Button variant="primary" size="lg" className="mt-6 w-full sm:w-auto">
                          Done
                        </Button>
                      </Dialog.Close>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="px-5 py-5 sm:px-6" noValidate>
                      <p className="text-[13.5px] leading-relaxed text-muted">
                        {product.name} is a prescription-only medicine. Leave your details and {COMMERCE.prescriberPartner} will send a secure
                        questionnaire. There is no charge to enquire and no obligation.
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Field label="Name" htmlFor="consult-name">
                          <input id="consult-name" className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                        </Field>
                        <Field label="Email" htmlFor="consult-email">
                          <input
                            id="consult-email"
                            type="email"
                            className={fieldClass}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                          />
                        </Field>
                        <Field label="Phone (optional)" htmlFor="consult-phone">
                          <input id="consult-phone" type="tel" className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
                        </Field>
                        <Field label="Country" htmlFor="consult-country">
                          <select id="consult-country" className={cn(fieldClass, "appearance-none")} value={country} onChange={(e) => setCountry(e.target.value)}>
                            {COUNTRIES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      <label className="mt-4 flex cursor-pointer items-start gap-3 border border-line p-3 text-[12.5px] leading-relaxed text-ink-3 hover:border-ink">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-ink bg-white checked:bg-brand-600 checked:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        />
                        <span>
                          I am 18 or over and consent to {COMMERCE.prescriberPartner} contacting me about this request. My details are shared with
                          the prescriber only.
                        </span>
                      </label>

                      {error && (
                        <p role="alert" className="mt-3 border-l-2 border-accent-500 pl-3 text-[13px] text-accent-700">
                          {error}
                        </p>
                      )}

                      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Dialog.Close asChild>
                          <Button variant="secondary" size="lg" type="button">
                            Cancel
                          </Button>
                        </Dialog.Close>
                        <Button variant="primary" size="lg" type="submit" loading={busy}>
                          Send request
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-mono mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}
