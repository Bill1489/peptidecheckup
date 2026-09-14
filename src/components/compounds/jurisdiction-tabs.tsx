"use client";

import * as React from "react";
import { Tabs } from "radix-ui";
import { Database } from "lucide-react";
import { RegulatoryBadge } from "@/components/ui/badge";
import { JURISDICTION_LABELS, type Jurisdiction, type RegulatoryEntry } from "@/data/types";
import { cn, formatDate } from "@/lib/utils";
import {
  ALL_JURISDICTIONS,
  JURISDICTION_SHORT,
  isSelectableJurisdiction,
} from "@/lib/compare";
import { useHydratePrefs, usePrefsStore } from "@/lib/compare-store";

/**
 * Regulatory status by jurisdiction. The default tab follows the visitor's
 * saved jurisdiction preference; choosing one of the five main jurisdictions
 * updates that preference so the directory and compare tool stay in step.
 */
export function JurisdictionTabs({
  regulatory,
  compoundName,
}: {
  regulatory: Record<Jurisdiction, RegulatoryEntry>;
  compoundName: string;
}) {
  useHydratePrefs();
  const preferred = usePrefsStore((s) => s.jurisdiction);
  const setJurisdiction = usePrefsStore((s) => s.setJurisdiction);
  // "OTHER" is never persisted, so it lives in local state as an override.
  const [override, setOverride] = React.useState<Jurisdiction | null>(null);
  const value: Jurisdiction = override ?? preferred;

  const onValueChange = (next: string) => {
    if (isSelectableJurisdiction(next)) {
      setJurisdiction(next);
      setOverride(null);
    } else {
      setOverride("OTHER");
    }
  };

  return (
    <Tabs.Root value={value} onValueChange={onValueChange}>
      <Tabs.List aria-label={`Regulatory status of ${compoundName} by jurisdiction`} className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {ALL_JURISDICTIONS.map((j) => (
          <Tabs.Trigger
            key={j}
            value={j}
            className={cn(
              "flex min-h-11 flex-col items-start gap-2 rounded-xl border border-line bg-white p-3 text-left transition-all duration-200 ease-out-expo",
              "hover:border-ink/20 data-[state=active]:border-ink data-[state=active]:shadow-soft",
            )}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="font-mono text-xs font-medium tracking-[0.08em] text-ink">{JURISDICTION_SHORT[j]}</span>
              <span className="hidden truncate text-[0.65rem] text-muted-2 xl:inline">{JURISDICTION_LABELS[j]}</span>
            </span>
            <RegulatoryBadge status={regulatory[j].status} size="xs" />
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {ALL_JURISDICTIONS.map((j) => {
        const entry = regulatory[j];
        return (
          <Tabs.Content
            key={j}
            value={j}
            className="mt-4 rounded-2xl border border-line bg-white p-5 shadow-soft focus-visible:outline-none sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl text-ink sm:text-2xl">{JURISDICTION_LABELS[j]}</h3>
              <RegulatoryBadge status={entry.status} size="md" />
            </div>
            <p className="mt-4 text-base font-medium leading-relaxed text-ink">{entry.summary}</p>
            {entry.detail && <p className="mt-3 text-sm leading-relaxed text-muted">{entry.detail}</p>}
            <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-2">
                Status last reviewed {formatDate(entry.lastReviewed)}
              </p>
              <p className="inline-flex items-center gap-1.5 text-xs text-muted">
                <Database className="h-3.5 w-3.5 text-brand-600" aria-hidden />
                From our maintained database — never inferred
              </p>
            </div>
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
}
