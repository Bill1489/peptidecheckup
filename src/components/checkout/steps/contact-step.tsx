"use client";

import * as React from "react";
import type { CheckoutContact } from "@/lib/commerce/checkout-store";
import { Checkbox, TextField } from "../fields";
import type { ContactField, Errors } from "../validation";

export function ContactStep({
  value,
  onChange,
  errors,
  showErrors,
}: {
  value: CheckoutContact;
  onChange: (patch: Partial<CheckoutContact>) => void;
  errors: Errors<ContactField>;
  showErrors: boolean;
}) {
  const err = (k: ContactField) => (showErrors ? errors[k] : undefined);
  return (
    <div className="grid gap-5">
      <TextField
        id="contact-email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="name@example.com"
        value={value.email}
        onChange={(v) => onChange({ email: v })}
        error={err("email")}
        hint="Order confirmation and tracking go here."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="contact-name"
          label="Full name"
          autoComplete="name"
          placeholder="First and last name"
          value={value.name}
          onChange={(v) => onChange({ name: v })}
          error={err("name")}
        />
        <TextField
          id="contact-phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+44 7700 900000"
          optional
          value={value.phone}
          onChange={(v) => onChange({ phone: v })}
          error={err("phone")}
          hint="Used by the courier only."
        />
      </div>
      <Checkbox
        id="contact-marketing"
        checked={value.marketingOptIn}
        onChange={(v) => onChange({ marketingOptIn: v })}
        label="Email me batch alerts and evidence updates."
        description="Occasional. New lots, new certificates, new trials. Unsubscribe from any email."
      />
    </div>
  );
}
