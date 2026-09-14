"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ReportSectionDef } from "./sections";

/** Tracks which report section currently sits in the reading band near the top of the viewport. */
export function useActiveSection(ids: string[]): string | undefined {
  const [active, setActive] = React.useState<string | undefined>(undefined);
  const key = ids.join("|");

  React.useEffect(() => {
    const sectionIds = key.split("|").filter(Boolean);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const positions = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) positions.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : Number.NaN);
        const visible = sectionIds
          .filter((id) => Number.isFinite(positions.get(id)))
          .sort((a, b) => (positions.get(a) as number) - (positions.get(b) as number));
        if (visible.length > 0) setActive(visible[0]);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 8;
      if (atBottom) setActive(sectionIds[sectionIds.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [key]);

  return active;
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

/** Sticky desktop table of contents. */
export function ReportToc({ sections, active }: { sections: ReportSectionDef[]; active?: string }) {
  return (
    <nav aria-label="Report contents" className="no-print">
      <p className="mb-4 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-muted">Contents</p>
      <ol className="relative space-y-0.5 border-l border-line">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(s.id);
                }}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px flex items-baseline gap-2.5 border-l-2 py-1.5 pl-4 pr-2 text-[0.82rem] leading-snug transition-colors",
                  isActive
                    ? "border-brand-600 text-ink"
                    : "border-transparent text-muted hover:border-line-strong hover:text-ink",
                )}
              >
                <span className="w-5 shrink-0 font-mono text-[0.65rem] tabular-nums text-muted-2">{s.number || "—"}</span>
                <span className="text-balance">{s.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Horizontal chip TOC for mobile / tablet, sticky under the header. */
export function ReportTocMobile({ sections, active }: { sections: ReportSectionDef[]; active?: string }) {
  const listRef = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    if (!active || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-id="${active}"]`);
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Report contents" className="no-print sticky top-16 z-30 border-b border-line bg-paper/90 backdrop-blur lg:hidden">
      <ol ref={listRef} className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 py-2.5 sm:px-8">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} data-id={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(s.id);
                }}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-xs font-medium transition-colors",
                  isActive ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-3 hover:border-line-strong",
                )}
              >
                {s.number && <span className="font-mono text-[0.62rem] tabular-nums opacity-70">{s.number}</span>}
                {s.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
