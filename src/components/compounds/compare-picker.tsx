"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Dialog } from "radix-ui";
import { Check, Plus, Search, X } from "lucide-react";
import { COMPOUNDS, searchCompounds } from "@/data/compounds";
import { FAMILY_LABELS, type Compound, type CompoundFamily } from "@/data/types";
import { MAX_COMPARE } from "@/lib/compare";
import { cn } from "@/lib/utils";
import { MeterLabel } from "./primitives";

const FAMILY_ORDER = Object.keys(FAMILY_LABELS) as CompoundFamily[];

const GROUP_HEADING =
  "[&_[cmdk-group-heading]]:border-y [&_[cmdk-group-heading]]:border-line [&_[cmdk-group-heading]]:bg-paper-2 [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.12em] [&_[cmdk-group-heading]]:text-muted";

function Item({
  compound,
  added,
  onSelect,
}: {
  compound: Compound;
  added: boolean;
  onSelect: (slug: string) => void;
}) {
  return (
    <Command.Item
      value={compound.slug}
      keywords={[compound.name, ...compound.aliases, compound.classLabel]}
      disabled={added}
      onSelect={onSelect}
      className={cn(
        "group flex min-h-14 cursor-pointer items-center gap-3 border-b border-line px-4 py-2.5 text-[14px] text-ink outline-none transition-colors duration-150 last:border-b-0",
        "data-[selected=true]:bg-ink data-[selected=true]:text-white data-[disabled=true]:cursor-default data-[disabled=true]:opacity-50",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="truncate font-medium">{compound.name}</span>
          {compound.aliases[0] && (
            <span className="truncate text-[12px] text-muted group-data-[selected=true]:text-white/60">{compound.aliases[0]}</span>
          )}
        </span>
        <span className="label-mono mt-0.5 block truncate group-data-[selected=true]:text-white/60">{compound.classLabel}</span>
      </span>
      <MeterLabel level={compound.overallEvidence} chip className="hidden sm:inline-flex" />
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center border transition-colors",
          added ? "border-brand-600 bg-brand-600 text-white" : "border-ink group-data-[selected=true]:border-white",
        )}
        aria-hidden
      >
        {added ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Plus className="h-3.5 w-3.5" />}
      </span>
    </Command.Item>
  );
}

/**
 * Searchable "Add a compound" dialog. Ranking uses the registry's
 * `searchCompounds`, so results match the directory search exactly.
 */
export function ComparePicker({
  open,
  onOpenChange,
  selectedSlugs,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlugs: string[];
  onAdd: (slug: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const trimmed = query.trim();
  const results = trimmed ? searchCompounds(trimmed, COMPOUNDS.length) : [];
  const remaining = MAX_COMPARE - selectedSlugs.length;

  const groups = FAMILY_ORDER.map((family) => ({
    family,
    items: COMPOUNDS.filter((c) => c.family === family),
  })).filter((g) => g.items.length > 0);

  const handleOpenChange = (next: boolean) => {
    if (!next) setQuery("");
    onOpenChange(next);
  };

  const select = (slug: string) => {
    onAdd(slug);
    handleOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/60 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex max-h-[85vh] flex-col overflow-hidden border border-ink bg-white focus:outline-none",
            "data-[state=open]:animate-fade-up sm:inset-x-auto sm:left-1/2 sm:top-[12vh] sm:w-full sm:max-w-lg sm:-translate-x-1/2",
          )}
        >
          <Dialog.Title className="sr-only">Add a compound to compare</Dialog.Title>
          <Command shouldFilter={false} label="Add a compound to compare" className="flex min-h-0 flex-col">
            <div className="flex items-center gap-2 border-b border-ink pl-4 pr-1">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              <Command.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder="Search by name, brand or class"
                className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted-2"
              />
              <Dialog.Close
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-muted transition-colors duration-150 hover:bg-ink hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden />
              </Dialog.Close>
            </div>

            <Command.List className={cn("min-h-0 flex-1 overflow-y-auto", GROUP_HEADING)}>
              <Command.Empty className="px-4 py-10 text-center text-[14px] text-muted">
                No compounds match “{trimmed}”. Try a brand name or drug class.
              </Command.Empty>

              {trimmed ? (
                <Command.Group>
                  {results.map((c) => (
                    <Item key={c.slug} compound={c} added={selectedSlugs.includes(c.slug)} onSelect={select} />
                  ))}
                </Command.Group>
              ) : (
                groups.map((g) => (
                  <Command.Group key={g.family} heading={FAMILY_LABELS[g.family]}>
                    {g.items.map((c) => (
                      <Item key={c.slug} compound={c} added={selectedSlugs.includes(c.slug)} onSelect={select} />
                    ))}
                  </Command.Group>
                ))
              )}
            </Command.List>

            <div className="label-mono flex items-center justify-between gap-3 border-t border-ink px-4 py-2.5">
              <span className="tnum">
                {remaining > 0
                  ? `${remaining} more ${remaining === 1 ? "slot" : "slots"} available`
                  : "Selection full — remove a compound to add another"}
              </span>
              <span className="hidden sm:inline">↑↓ navigate · ↵ add · esc close</span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
