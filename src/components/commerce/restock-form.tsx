"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { submitLead } from "@/lib/leads";
import { cn } from "@/lib/utils";

/** "Notify me" for out-of-stock lots. One field, one button, one promise. */
export function RestockForm({ product, className, id }: { product: Product; className?: string; id?: string }) {
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      const res = await submitLead({ kind: "restock", email: email.trim(), productSlug: product.slug, source: "pdp" });
      if (!res.ok) {
        toast("Couldn't save that. Try again in a moment.");
        return;
      }
      setDone(true);
      toast("Restock alert set", { description: `${product.name} — one email when the next certified lot ships.` });
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div id={id} className={cn("border border-ink p-4", className)}>
        <p className="label-mono text-brand-600">Alert set</p>
        <p className="mt-2 text-[14px] text-ink">
          We will email <span className="font-mono text-[13px]">{email}</span> once when the next lot of {product.name} has a published certificate. Nothing else.
        </p>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} className={className} aria-label={`Notify me when ${product.name} is back in stock`}>
      <p className="label-mono mb-2 flex items-center gap-2">
        <Bell className="h-3 w-3" aria-hidden />
        Out of stock · notify me
      </p>
      <div className="flex border border-ink">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="h-12 min-w-0 flex-1 bg-white px-4 text-[14px] text-ink placeholder:text-muted-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 items-center border-l border-ink bg-ink px-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
        >
          Notify me
        </button>
      </div>
      <p className="mt-2 text-[12px] text-muted">One email when the next batch is certified. No marketing.</p>
    </form>
  );
}
