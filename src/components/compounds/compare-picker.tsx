"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Dialog } from "radix-ui";
import { Check, Plus, Search, X } from "lucide-react";
import { EvidenceMeter } from "@/components/ui/badge";
import { COMPOUNDS, searchCompounds } from "@/data/compounds";
import { EVIDENCE_LABELS, FAMILY_LABELS, type Compound, type CompoundFamily } from "@/data/types";
import { cn } from "@/lib/utils";
import { MAX_COMPARE } from "@/lib/compare";

const FAMILY_ORDER = Object.keys(FAMILY_LABELS) as CompoundFamily[];

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
        "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors",
        "data-[selected=true]:bg-paper-2 data-[disabled=true]:cursor-default data-[disabled=true]:opacity-60",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-medium text-ink">{compound.name}</span>
          {compound.aliases[0] && <span className="truncate text-xs text-muted-2">{compound.aliases[0]}</span>}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[0.62rem] uppercase tracking-[0.12em] text-brand-700">
          {compound.classLabel}
        </span>
      </span>
      <span className="hidden items-center gap-1.5 text-[0.7rem] text-muted sm:flex">
        <EvidenceMeter level={compound.overallEvidence} />
        {EVIDENCE_LABELS[compound.overallEvidence]}
      </span>
      <span
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          added ? "bg-brand-100 text-brand-800" : "bg-paper-2 text-muted",
        )}
        aria-hidden
      >
        {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lift focus:outline-none",
            "data-[state=open]:animate-fade-up sm:inset-x-auto sm:left-1/2 sm:top-[12vh] sm:w-full sm:max-w-lg sm:-translate-x-1/2",
          )}
        >
          <Dialog.Title className="sr-only">Add a compound to compare</Dialog.Title>
          <Command shouldFilter={false} label="Add a compound to compare" className="flex min-h-0 flex-col">
            <div className="flex items-center gap-2 border-b border-line px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-2" aria-hidden />
              <Command.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder="Search by name, brand or class"
                className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted-2"
              />
              <Dialog.Close
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden />
              </Dialog.Close>
            </div>

            <Command.List className="min-h-0 flex-1 overflow-y-auto p-2">
              <Command.Empty className="px-3 py-10 text-center text-sm text-muted">
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
                  <Command.Group
                    key={g.family}
                    heading={FAMILY_LABELS[g.family]}
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.62rem] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted-2"
                  >
                    {g.items.map((c) => (
                      <Item key={c.slug} compound={c} added={selectedSlugs.includes(c.slug)} onSelect={select} />
                    ))}
                  </Command.Group>
                ))
              )}
            </Command.List>

            <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-xs text-muted">
              <span>
                {remaining > 0
                  ? `${remaining} more ${remaining === 1 ? "slot" : "slots"} available`
                  : `Selection full — remove a compound to add another`}
              </span>
              <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-2 sm:inline">
                ↑↓ navigate · ↵ add · esc close
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
