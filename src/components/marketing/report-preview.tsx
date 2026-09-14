"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { EVIDENCE_LABELS } from "@/data/types";
import { SUITABILITY_DESCRIPTIONS } from "@/lib/engine/types";
import { formatDate, cn } from "@/lib/utils";
import { EvidenceMeter, FlagBadge, RegulatoryBadge, SuitabilityBadge } from "@/components/ui/badge";
import { BeadChain } from "./bead-chain";
import { EASE_OUT_EXPO } from "./reveal";
import type { ReportPreviewData } from "./report-preview-data";

/**
 * Stylised report composition built from the real report components.
 * Hero mode: cards stagger in on load, float gently, parallax against scroll
 * and overlap in a layered stack from `sm`. `compact` mode (landing pages):
 * a tidy two-column grid that reveals when scrolled into view.
 */
export function ReportPreview({
  data,
  className,
  compact = false,
  label = "Example report · illustrative",
}: {
  data: ReportPreviewData;
  className?: string;
  compact?: boolean;
  label?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const cards: { key: string; node: React.ReactNode; layout: string; depth: number }[] = [];

  if (data.primary) {
    cards.push({
      key: "suitability",
      depth: 1,
      layout: "sm:left-0 sm:top-[9%] sm:w-[70%] sm:z-30",
      node: (
        <PreviewCard eyebrow={`Personal suitability · ${data.goalLabel}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[0.98rem] font-medium text-ink">{data.primary.name}</p>
              <p className="truncate text-xs text-muted">{data.primary.classLabel}</p>
            </div>
            <SuitabilityBadge level={data.primary.suitability} size="sm" />
          </div>
          <p className="mt-3 text-pretty text-xs leading-relaxed text-muted">
            {SUITABILITY_DESCRIPTIONS[data.primary.suitability]}
          </p>
        </PreviewCard>
      ),
    });
  }

  if (data.evidence.length > 0) {
    cards.push({
      key: "evidence",
      depth: 0.4,
      layout: "sm:right-0 sm:top-0 sm:w-[60%] sm:z-20",
      node: (
        <PreviewCard eyebrow={`Evidence for ${data.goalLabel.toLowerCase()}`}>
          <ul className="space-y-2.5">
            {data.evidence.map((c) => (
              <li key={c.slug} className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-ink-2">{c.name}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <EvidenceMeter level={c.evidence} />
                  <span className="w-[5rem] text-right font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
                    {EVIDENCE_LABELS[c.evidence]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </PreviewCard>
      ),
    });
  }

  if (data.regulatory) {
    cards.push({
      key: "regulatory",
      depth: 1.4,
      layout: "sm:left-[5%] sm:bottom-[11%] sm:w-[54%] sm:z-20",
      node: (
        <PreviewCard eyebrow={`Regulatory status · ${data.regulatory.jurisdictionLabel}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <RegulatoryBadge status={data.regulatory.status} size="sm" />
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-2">
              Reviewed {formatDate(data.regulatory.lastReviewed, { month: "short" })}
            </span>
          </div>
        </PreviewCard>
      ),
    });
  }

  if (data.flags.length > 0) {
    cards.push({
      key: "flags",
      depth: 0.8,
      layout: "sm:right-[2%] sm:bottom-0 sm:w-[52%] sm:z-30",
      node: (
        <PreviewCard eyebrow="Flags from your answers">
          <ul className="space-y-2">
            {data.flags.map((f) => (
              <li key={f.title} className="flex items-start gap-2.5">
                <FlagBadge severity={f.severity} className="mt-px shrink-0" />
                <span className="text-xs leading-snug text-ink-2">{f.title}</span>
              </li>
            ))}
          </ul>
        </PreviewCard>
      ),
    });
  }

  return (
    <div ref={ref} className={cn("relative isolate", className)}>
      {/* Backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 inset-y-6 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-100/80 via-paper-2 to-accent-100/50 blur-2xl"
      />
      <BeadChain
        className="pointer-events-none absolute -right-6 top-1/2 -z-10 w-[78%] -translate-y-1/2 text-brand-200/80"
        tone="light"
      />

      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted backdrop-blur sm:absolute sm:-top-3 sm:left-2 sm:z-40 sm:mb-0">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />
        {label}
      </p>

      <div className={cn("relative grid gap-3", !compact && "sm:block sm:min-h-[34rem]", compact && "sm:grid-cols-2")}>
        {/* In the hero composition, phones see the two lead cards only; the full stack appears from `sm`. */}
        {cards.map((card, i) => (
          <FloatingCard
            key={card.key}
            index={i}
            depth={card.depth}
            progress={scrollYProgress}
            reduce={!!reduce}
            trigger={compact ? "inView" : "mount"}
            className={cn(!compact && "sm:absolute", !compact && card.layout, !compact && i >= 2 && "hidden sm:block")}
          >
            {card.node}
          </FloatingCard>
        ))}
      </div>
    </div>
  );
}

function FloatingCard({
  children,
  index,
  depth,
  progress,
  reduce,
  className,
  trigger,
}: {
  children: React.ReactNode;
  index: number;
  depth: number;
  progress: MotionValue<number>;
  reduce: boolean;
  className?: string;
  /** Hero: animate on load. Below the fold: animate when scrolled into view. */
  trigger: "mount" | "inView";
}) {
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [28 * depth, -36 * depth]);
  const visible = { opacity: 1, y: 0, scale: 1 };
  return (
    <motion.div style={{ y }} className={className}>
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.98 }}
        animate={trigger === "mount" ? visible : undefined}
        whileInView={trigger === "inView" ? visible : undefined}
        viewport={{ once: true, margin: "0px 0px -48px 0px" }}
        transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.25 + index * 0.12, ease: EASE_OUT_EXPO }}
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -5 - index, 0] }}
          transition={reduce ? undefined : { duration: 6 + index * 1.3, repeat: Infinity, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PreviewCard({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white/95 p-4 shadow-card backdrop-blur-sm sm:p-5">
      <p className="mb-3 font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted-2">{eyebrow}</p>
      {children}
    </div>
  );
}
