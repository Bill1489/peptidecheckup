"use client";

import Link from "next/link";
import { Accordion } from "radix-ui";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "./faq-data";

/**
 * FAQ on Radix Accordion: bordered rows, a numbered mono index, and a
 * plus/minus glyph drawn from two 1px bars. No height animation.
 */
export function Faq({ items, className, defaultOpen }: { items: FaqItem[]; className?: string; defaultOpen?: string }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue={defaultOpen} className={cn("border-t border-ink", className)}>
      {items.map((item, i) => (
        <Accordion.Item key={item.id} value={item.id} className="border-b border-ink">
          <Accordion.Header asChild>
            <h3 className="m-0 font-sans font-medium tracking-normal [font-stretch:100%] [font-variation-settings:normal]">
              <Accordion.Trigger className="group flex min-h-[44px] w-full items-start justify-between gap-6 py-4 text-left text-[15px] leading-snug text-ink transition-colors duration-150 hover:text-brand-600 data-[state=open]:text-brand-600 sm:text-[16px]">
                <span className="flex gap-4">
                  <span className="label-mono mt-[3px] shrink-0 tnum">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-pretty">{item.question}</span>
                </span>
                <span className="relative mt-1 h-4 w-4 shrink-0" aria-hidden>
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-150 group-data-[state=open]:scale-y-0" />
                </span>
              </Accordion.Trigger>
            </h3>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-fade-in">
            <div className="pb-5 pl-10 pr-10 text-[14px] leading-relaxed text-ink-3 sm:pl-[3.4rem]">
              <p className="text-pretty">{item.answer}</p>
              {item.link && (
                <Link
                  href={item.link.href}
                  className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink link-rule"
                >
                  {item.link.label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
