"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * Sticky in-page table of contents for long trust/legal pages. Tracks the
 * heading nearest the top of the viewport and highlights it.
 */
export function Toc({ items, className }: { items: TocItem[]; className?: string }) {
  const [active, setActive] = React.useState<string>(items[0]?.id ?? "");

  React.useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const onScroll = () => {
      const line = window.innerHeight * 0.28;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top - line <= 0) current = h.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className={cn("text-sm", className)}>
      <p className="mb-3 font-mono text-[0.66rem] font-medium uppercase tracking-[0.18em] text-muted-2">On this page</p>
      <ol className="relative border-l border-line">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="relative">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l py-1.5 pl-4 leading-snug transition-colors",
                  isActive
                    ? "border-brand-600 font-medium text-ink"
                    : "border-transparent text-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
