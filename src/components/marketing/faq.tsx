"use client";

import * as React from "react";
import Link from "next/link";
import { Accordion } from "radix-ui";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "./reveal";
import type { FaqItem } from "./faq-data";

/**
 * Accessible FAQ built on Radix Accordion. Height is animated with motion
 * (Radix owns the a11y wiring; we own the presentation).
 */
export function Faq({
  items,
  className,
  defaultOpen,
}: {
  items: FaqItem[];
  className?: string;
  defaultOpen?: string;
}) {
  const [open, setOpen] = React.useState<string>(defaultOpen ?? "");
  const reduce = useReducedMotion();

  return (
    <Accordion.Root
      type="single"
      collapsible
      value={open}
      onValueChange={setOpen}
      className={cn("divide-y divide-line border-y border-line", className)}
    >
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <Accordion.Item key={item.id} value={item.id}>
            <Accordion.Header asChild>
              <h3 className="m-0 font-sans tracking-normal [font-variation-settings:normal]">
                <Accordion.Trigger
                  className={cn(
                    "group flex min-h-[44px] w-full items-start justify-between gap-6 py-5 text-left text-[1.02rem] font-medium leading-snug text-ink transition-colors sm:text-[1.08rem]",
                    "hover:text-brand-700 data-[state=open]:text-brand-800",
                  )}
                >
                  <span className="text-pretty">{item.question}</span>
                  <span
                    className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-muted transition-all duration-300 ease-out-expo group-hover:border-brand-400 group-hover:text-brand-700 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-500 group-data-[state=open]:bg-brand-50 group-data-[state=open]:text-brand-700"
                    aria-hidden
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>
            <Accordion.Content forceMount asChild>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE_OUT_EXPO }}
                style={{ overflow: "hidden" }}
                aria-hidden={!isOpen}
              >
                <div className="pb-6 pr-10 text-[0.98rem] leading-relaxed text-muted">
                  <p className="text-pretty">{item.answer}</p>
                  {item.link && (
                    <Link
                      href={item.link.href}
                      tabIndex={isOpen ? 0 : -1}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
                    >
                      {item.link.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  )}
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
