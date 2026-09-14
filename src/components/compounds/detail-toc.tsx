"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TocSection {
  id: string;
  label: string;
}

/**
 * In-page table of contents. Horizontal, sticky pill strip under the nav on
 * small screens; vertical sticky list in the sidebar from `lg` upwards.
 */
export function DetailToc({ sections }: { sections: TocSection[] }) {
  const [active, setActive] = React.useState<string | undefined>(sections[0]?.id);
  const listRef = React.useRef<HTMLUListElement>(null);

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

  // Keep the active pill in view on the horizontal strip.
  React.useEffect(() => {
    const list = listRef.current;
    if (!list || !active) return;
    const pill = list.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!pill || list.scrollWidth <= list.clientWidth) return;
    const target = pill.offsetLeft - list.clientWidth / 2 + pill.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      className="no-print sticky top-16 z-30 -mx-5 border-b border-line bg-paper/90 backdrop-blur-md sm:top-[4.5rem] sm:-mx-8 lg:top-28 lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:backdrop-blur-none"
    >
      <p className="hidden font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-2 lg:block">On this page</p>
      <ul
        ref={listRef}
        className="no-scrollbar flex gap-1 overflow-x-auto px-5 py-2.5 sm:px-8 lg:mt-3 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-line lg:px-0 lg:py-0"
      >
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                data-section={s.id}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(s.id)}
                className={cn(
                  "inline-flex h-9 items-center whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors lg:-ml-px lg:h-auto lg:rounded-none lg:border-l-2 lg:py-1.5 lg:pl-4 lg:pr-0 lg:text-[0.82rem]",
                  isActive
                    ? "bg-ink text-white lg:border-brand-600 lg:bg-transparent lg:text-ink"
                    : "text-muted hover:bg-paper-2 hover:text-ink lg:border-transparent lg:hover:bg-transparent",
                )}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
