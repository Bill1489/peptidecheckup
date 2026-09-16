"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { index } from "./copy";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * In-page table of contents for long trust/legal pages. Rendered as a sticky
 * rail on desktop; tracks the heading nearest the top of the viewport.
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
    <nav aria-label="On this page" className={className}>
      <p className="label-mono mb-3 text-ink">On this page</p>
      <ol className="border-t border-ink">
        {items.map((item, i) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="border-b border-line">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex items-baseline gap-3 py-2 text-[13px] leading-snug transition-colors duration-150",
                  isActive ? "text-brand-600" : "text-ink-3 hover:text-ink",
                )}
              >
                <span className="font-mono text-[10.5px] tnum">{index(i + 1)}</span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Compact horizontal variant shown under the page header on small screens. */
export function TocRow({ items }: { items: TocItem[] }) {
  return (
    <nav aria-label="On this page" className="rule-b lg:hidden">
      <ol className="no-scrollbar container-x flex gap-6 overflow-x-auto">
        {items.map((item, i) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              className="flex h-11 items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3 hover:text-ink"
            >
              <span className="tnum">{index(i + 1)}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
