"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { COUNTRY_MAP, searchCountries } from "@/data/countries";
import { jurisdictionLabel } from "@/lib/assessment/derived";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnswers, useLatest, useSetAnswer } from "../hooks";
import { AUTO_ADVANCE_MS, Marker } from "./option-cards";

/**
 * Q14 — searchable country list (cmdk). Shows the jurisdiction the regulatory
 * view maps to, e.g. "Regulatory view: United Kingdom".
 */
export function CountryPicker({ onAdvance }: { onAdvance?: () => void }) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState(!answers.countryCode);
  const advanceRef = useLatest(onAdvance);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const selected = answers.countryCode ? COUNTRY_MAP[answers.countryCode] : undefined;
  const results = React.useMemo(() => searchCountries(query), [query]);

  const choose = (code: string) => {
    setAnswer("countryCode", code);
    setEditing(false);
    setQuery("");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => advanceRef.current?.(), AUTO_ADVANCE_MS);
  };

  if (selected && !editing) {
    return (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-ink bg-ink p-4 text-white">
          <div className="flex items-center gap-3">
            <Marker selected />
            <div>
              <p className="text-[15px] font-medium">{selected.name}</p>
              <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/60">
                Regulatory view · <span className="text-white">{jurisdictionLabel(selected.code)}</span>
              </p>
            </div>
          </div>
          <Button
            variant="inverted"
            size="sm"
            onClick={() => {
              if (timer.current) clearTimeout(timer.current);
              setEditing(true);
            }}
          >
            Change
          </Button>
        </div>
        <p className="flex items-start gap-3 text-xs leading-relaxed text-muted">
          <span className="mt-[0.35rem] h-2 w-2 shrink-0 bg-brand-600" aria-hidden />
          Regulatory status in your report comes from our database for this jurisdiction and is never inferred.
        </p>
      </div>
    );
  }

  return (
    <Command shouldFilter={false} label="Search countries" className="overflow-hidden rounded-none border border-ink bg-white" loop>
      <div className="flex items-center gap-3 border-b border-ink px-4">
        <Search className="h-4 w-4 shrink-0 text-ink" aria-hidden />
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Start typing a country"
          data-autofocus="pointer"
          className="h-12 w-full bg-transparent text-[15px] text-ink placeholder:text-muted-2 focus:outline-none"
        />
      </div>
      <Command.List className="max-h-[22rem] overflow-y-auto">
        <Command.Empty className="px-4 py-8 text-center text-sm text-muted">
          No match. Try a different spelling, or choose “Other country”.
        </Command.Empty>
        {results.map((c) => {
          const isSelected = c.code === answers.countryCode;
          return (
            <Command.Item
              key={c.code}
              value={c.code}
              keywords={[c.name]}
              onSelect={() => choose(c.code)}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-3 border-b border-line px-4 py-2 text-[15px] text-ink transition-colors last:border-b-0",
                "data-[selected=true]:bg-paper-2",
              )}
            >
              <Marker selected={isSelected} />
              <span className="flex-1">{c.name}</span>
              <Badge tone="neutral" size="xs" className="hidden sm:inline-flex">
                {jurisdictionLabel(c.code)}
              </Badge>
            </Command.Item>
          );
        })}
      </Command.List>
    </Command>
  );
}
