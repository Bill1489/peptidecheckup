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
    const elements = sectionIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
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

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

/** Sticky desktop table of contents: mono numbered list, cobalt bar on the active item. */
export function ReportToc({ sections, active }: { sections: ReportSectionDef[]; active?: string }) {
  return (
    <nav aria-label="Report contents" className="no-print">
      <p className="label-mono mb-3 text-ink">Contents</p>
      <ol className="border-l border-line">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(s.id);
                }}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative flex items-baseline gap-2.5 py-1.5 pl-4 pr-2 font-mono text-[11px] uppercase leading-snug tracking-[0.08em] transition-colors",
                  isActive ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {isActive && <span className="absolute -left-px top-0 h-full w-[3px] bg-brand-600" aria-hidden />}
                <span className="w-5 shrink-0 tnum text-muted-2">{s.number || "—"}</span>
                <span>{s.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Horizontal mono-tag TOC for mobile / tablet, sticky under the header. */
export function ReportTocMobile({ sections, active }: { sections: ReportSectionDef[]; active?: string }) {
  const listRef = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    if (!active || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-id="${active}"]`);
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Report contents" className="no-print rule-b sticky top-14 z-30 bg-white sm:top-16 lg:hidden">
      <ol ref={listRef} className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} data-id={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(s.id);
                }}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-none border px-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] transition-colors",
                  isActive ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-3 hover:border-ink hover:text-ink",
                )}
              >
                {s.number && <span className={cn("tnum", isActive ? "text-brand-300" : "text-muted-2")}>{s.number}</span>}
                {s.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
