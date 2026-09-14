"use client";

import * as React from "react";
import { FlagBadge } from "@/components/ui/badge";
import type { Flag, FlagSource } from "@/lib/engine/types";
import { FLAG_SOURCE_LABELS } from "@/lib/engine/labels";
import { cn } from "@/lib/utils";
import { MonoLabel } from "./primitives";

const SEVERITY_ORDER = { high: 0, caution: 1, info: 2 } as const;

const SEVERITY_BORDER: Record<Flag["severity"], string> = {
  high: "border-l-concern",
  caution: "border-l-caution",
  info: "border-l-info",
};

/** Flags grouped by source, highest severity first within each group. */
export function FlagList({ flags, className, compact }: { flags: Flag[]; className?: string; compact?: boolean }) {
  const groups = React.useMemo(() => {
    const map = new Map<FlagSource, Flag[]>();
    for (const f of [...flags].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])) {
      map.set(f.source, [...(map.get(f.source) ?? []), f]);
    }
    // Order groups by their most severe flag
    return Array.from(map.entries()).sort(
      ([, a], [, b]) => SEVERITY_ORDER[a[0].severity] - SEVERITY_ORDER[b[0].severity],
    );
  }, [flags]);

  if (flags.length === 0) return null;

  return (
    <div className={cn("space-y-5", className)}>
      {groups.map(([source, items]) => (
        <div key={source}>
          <MonoLabel as="h4" className="mb-2.5">
            {FLAG_SOURCE_LABELS[source]}
          </MonoLabel>
          <ul className="space-y-2.5">
            {items.map((f) => (
              <li
                key={f.id}
                className={cn(
                  "rounded-r-xl border border-line border-l-[3px] bg-white break-inside-avoid",
                  SEVERITY_BORDER[f.severity],
                  compact ? "px-3.5 py-2.5" : "px-4 py-3.5",
                )}
              >
                <div className="flex flex-wrap items-start gap-x-3 gap-y-1.5">
                  <FlagBadge severity={f.severity} className="mt-0.5" />
                  <p className="min-w-0 flex-1 text-[0.95rem] font-medium leading-snug text-ink">{f.title}</p>
                </div>
                {!compact && f.detail && <p className="mt-2 text-sm leading-relaxed text-muted">{f.detail}</p>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
