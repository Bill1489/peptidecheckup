"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/lib/leads";

export function NewsletterForm({ compact }: { compact?: boolean }) {
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
      await submitLead({ kind: "newsletter", email, source: "footer" });
      setDone(true);
      toast("Subscribed. Batch alerts and evidence updates only.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <p className="border border-ink px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
        Subscribed — check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full border border-ink" aria-label="Newsletter signup">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={`min-w-0 flex-1 bg-white px-4 text-[14px] text-ink placeholder:text-muted-2 focus:outline-none ${compact ? "h-11" : "h-12"}`}
      />
      <button
        type="submit"
        disabled={busy}
        className={`inline-flex items-center gap-2 border-l border-ink bg-ink px-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-600 disabled:opacity-50 ${compact ? "h-11" : "h-12"}`}
      >
        Subscribe
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
