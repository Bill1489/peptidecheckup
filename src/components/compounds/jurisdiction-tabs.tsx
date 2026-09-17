"use client";

import * as React from "react";
import { Tabs } from "radix-ui";
import { REGULATORY_TONE, RegulatoryBadge } from "@/components/ui/badge";
import { SpecRow } from "@/components/ui/card";
import { JURISDICTION_LABELS, REGULATORY_LABELS, type Jurisdiction, type RegulatoryEntry } from "@/data/types";
import { ALL_JURISDICTIONS, JURISDICTION_SHORT, isSelectableJurisdiction } from "@/lib/compare";
import { useHydratePrefs, usePrefsStore } from "@/lib/compare-store";
import { cn, formatDate } from "@/lib/utils";

/** Keeps an outlined badge visible once its tab cell fills ink. */
const ACTIVE_BADGE_INVERT = "group-data-[state=active]/tab:border-white group-data-[state=active]/tab:text-white";

/**
 * Regulatory status by jurisdiction as a bordered tab row. The default tab
 * follows the visitor's saved jurisdiction preference; choosing one of the five
 * main jurisdictions updates that preference so the directory and compare tool
 * stay in step.
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
      <Tabs.List
        aria-label={`Regulatory status of ${compoundName} by jurisdiction`}
        className="grid grid-cols-3 gap-px border border-ink bg-ink sm:grid-cols-6"
      >
        {ALL_JURISDICTIONS.map((j) => {
          const status = regulatory[j].status;
          return (
            <Tabs.Trigger
              key={j}
              value={j}
              className={cn(
                "group/tab flex min-h-14 flex-col items-start justify-between gap-2 bg-white p-3 text-left text-ink transition-colors duration-150",
                "hover:bg-paper-2 data-[state=active]:bg-ink data-[state=active]:text-white data-[state=active]:hover:bg-ink",
              )}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="font-mono text-[12px] font-semibold tracking-[0.08em]">{JURISDICTION_SHORT[j]}</span>
                <span className="label-mono hidden break-words group-data-[state=active]/tab:text-white/60 xl:inline">
                  {JURISDICTION_LABELS[j]}
                </span>
              </span>
              <RegulatoryBadge
                status={status}
                size="xs"
                className={REGULATORY_TONE[status] === "outline" ? ACTIVE_BADGE_INVERT : undefined}
              />
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      {ALL_JURISDICTIONS.map((j) => {
        const entry = regulatory[j];
        return (
          <Tabs.Content key={j} value={j} className="border border-t-0 border-ink p-5 focus-visible:outline-none sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-display text-[1.4rem] uppercase leading-none text-ink sm:text-[1.7rem]">{JURISDICTION_LABELS[j]}</h3>
              <RegulatoryBadge status={entry.status} size="md" />
            </div>
            <p className="mt-4 text-[15px] font-medium leading-relaxed text-ink">{entry.summary}</p>
            {entry.detail && <p className="mt-3 text-[14px] leading-relaxed text-muted">{entry.detail}</p>}
            <div className="mt-5 border-t border-line">
              <SpecRow label="Status" value={REGULATORY_LABELS[entry.status]} />
              <SpecRow label="Status last reviewed" value={formatDate(entry.lastReviewed)} />
              <SpecRow label="Source" value="Our maintained database — never inferred" />
            </div>
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
}
