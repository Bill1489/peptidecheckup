"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const VIEWPORT = { once: true, margin: "0px 0px -72px 0px" } as const;

/**
 * Fade-up once when scrolled into view. Server HTML renders the element with
 * opacity 0 and the animation runs on hydration; with reduced motion the
 * element appears instantly instead of moving.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  duration = 0.7,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  }),
};

/**
 * Staggered list reveal. Wrap children in <StaggerItem>.
 * Renders a plain element (`as`) so it can be a <ul>, <ol> or <div>.
 */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const Tag = as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  return (
    <Tag
      className={className}
      variants={containerVariants}
      custom={reduce ? 0 : stagger}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
  y = 16,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
  y?: number;
}) {
  const reduce = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.6, ease: EASE_OUT_EXPO } },
  };
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}
