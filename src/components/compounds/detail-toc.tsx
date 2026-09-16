"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TocSection {
  id: string;
  label: string;
}

/**
 * In-page table of contents. A sticky, horizontally scrolling rule of mono
 * labels under the nav on small screens; a numbered vertical list in the
 * sidebar from `lg` upwards. Active item carries a 2px cobalt rule.
 */
export function DetailToc({ sections }: { sections: TocSection[] }) {
  const [active, setActive] = React.useState<string | undefined>(sections[0]?.id);
  const listRef = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Keep the active label in view on the horizontal strip.
  React.useEffect(() => {
    const list = listRef.current;
    if (!list || !active) return;
    const item = list.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!item || list.scrollWidth <= list.clientWidth) return;
    const target = item.offsetLeft - list.clientWidth / 2 + item.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      className="no-print sticky top-[6.1rem] z-30 -mx-4 border-b border-ink bg-white sm:-mx-6 lg:top-[7.1rem] lg:mx-0 lg:self-start lg:border-0"
    >
      <p className="label-mono hidden lg:block">On this page</p>
      <ol
        ref={listRef}
        className="no-scrollbar flex overflow-x-auto px-4 sm:px-6 lg:mt-3 lg:flex-col lg:overflow-visible lg:border-l lg:border-line lg:px-0"
      >
        {sections.map((s, i) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                data-section={s.id}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(s.id)}
                className={cn(
                  "relative flex h-11 items-center gap-2 whitespace-nowrap px-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-150",
                  "lg:-ml-px lg:h-auto lg:border-l-2 lg:py-1.5 lg:pl-4 lg:pr-0",
                  isActive ? "text-ink lg:border-brand-600" : "text-muted hover:text-ink lg:border-transparent",
                )}
              >
                <span className={cn("tnum", isActive ? "text-brand-600" : "text-muted-2")}>{String(i + 1).padStart(2, "0")}</span>
                {s.label}
                {isActive && <span aria-hidden className="absolute inset-x-3 bottom-0 h-[2px] bg-brand-600 lg:hidden" />}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
