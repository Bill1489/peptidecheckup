"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Fade-up on scroll, once. Print always shows content (Tailwind `print:` utilities
 * override the inline styles motion sets), and reduced-motion users get no animation.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const reduced = useReducedMotion();
  const Tag = as === "section" ? motion.section : as === "li" ? motion.li : motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={reduced ? { duration: 0 } : { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("print:opacity-100! print:transform-none!", className)}
    >
      {children}
    </Tag>
  );
}
