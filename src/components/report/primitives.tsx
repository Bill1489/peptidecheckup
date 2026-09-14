"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import type { ReportSectionDef } from "./sections";

/* ------------------------------------------------------------------ */
/* Section wrapper                                                     */
/* ------------------------------------------------------------------ */

export function ReportSection({
  def,
  description,
  children,
  className,
}: {
  def: ReportSectionDef;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={def.id}
      data-report-section
      aria-labelledby={`${def.id}-heading`}
      className={cn("scroll-mt-32 lg:scroll-mt-28", def.printBreak && "print-break", className)}
    >
      <Reveal>
        <header className="mb-8 max-w-2xl">
          <MonoLabel className="text-brand-700">
            <span className="tabular-nums">{def.number}</span>
            <span aria-hidden className="mx-2 text-muted-2">
              ·
            </span>
            {def.label}
          </MonoLabel>
          <h2
            id={`${def.id}-heading`}
            className="mt-3 font-display text-[1.75rem] font-normal leading-[1.12] tracking-[-0.02em] text-ink text-balance sm:text-[2.1rem]"
          >
            {def.heading}
          </h2>
          {description && <p className="mt-3 text-pretty text-[0.95rem] leading-relaxed text-muted">{description}</p>}
        </header>
      </Reveal>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Small typographic pieces                                            */
/* ------------------------------------------------------------------ */

export function MonoLabel({
  className,
  children,
  as: Tag = "p",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "p" | "span" | "dt" | "h3" | "h4";
}) {
  return (
    <Tag className={cn("font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted", className)}>
      {children}
    </Tag>
  );
}

export function ReportCard({
  className,
  children,
  as: Tag = "div",
  tone = "white",
  padding = "md",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  tone?: "white" | "paper" | "ink" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border break-inside-avoid print:shadow-none",
        tone === "white" && "border-line bg-white shadow-soft",
        tone === "paper" && "border-line bg-paper-2",
        tone === "ink" && "border-ink bg-ink text-white",
        tone === "outline" && "border-line-strong bg-transparent",
        padding === "sm" && "p-4 sm:p-5",
        padding === "md" && "p-5 sm:p-7",
        padding === "lg" && "p-6 sm:p-9",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Compound header used at the top of per-compound cards. */
export function CompoundHeading({
  name,
  meta,
  right,
  size = "md",
}: {
  name: string;
  meta?: React.ReactNode;
  right?: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h3
          className={cn(
            "font-display font-normal leading-tight tracking-[-0.02em] text-ink",
            size === "md" ? "text-[1.45rem]" : "text-xl",
          )}
        >
          {name}
        </h3>
        {meta && <p className="mt-1 text-sm text-muted">{meta}</p>}
      </div>
      {right && <div className="flex shrink-0 flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}

/** Definition-style field: mono label above a value. */
export function Field({
  label,
  children,
  className,
  valueClassName,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={className}>
      <MonoLabel as="dt">{label}</MonoLabel>
      <dd className={cn("mt-1.5 text-[0.95rem] leading-relaxed text-ink-2", valueClassName)}>{children}</dd>
    </div>
  );
}

/** Bordered note (used for disclaimers and research-information labels). */
export function Note({
  children,
  className,
  tone = "neutral",
  icon,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "brand" | "warning" | "danger" | "success" | "info";
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed break-inside-avoid",
        tone === "neutral" && "border-line bg-paper-2 text-ink-3",
        tone === "brand" && "border-brand-200 bg-brand-50 text-brand-900",
        tone === "warning" && "border-amber-200 bg-caution-soft text-amber-900",
        tone === "danger" && "border-rose-200 bg-concern-soft text-rose-900",
        tone === "success" && "border-emerald-200 bg-relevant-soft text-emerald-900",
        tone === "info" && "border-blue-200 bg-info-soft text-blue-900",
        className,
      )}
    >
      {icon && <span className="mt-0.5 shrink-0 opacity-80">{icon}</span>}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Hairline-separated stat tile. */
export function StatTile({
  label,
  value,
  sub,
  tone = "neutral",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "neutral" | "success" | "danger" | "warning" | "brand";
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5 rounded-xl border border-line bg-white px-4 py-4 break-inside-avoid", className)}>
      <MonoLabel className="text-[0.62rem]">{label}</MonoLabel>
      <div
        className={cn(
          "font-display text-3xl leading-none tracking-[-0.03em] tabular-nums",
          tone === "neutral" && "text-ink",
          tone === "success" && "text-emerald-700",
          tone === "danger" && "text-rose-700",
          tone === "warning" && "text-amber-700",
          tone === "brand" && "text-brand-700",
        )}
      >
        {value}
      </div>
      {sub && <p className="text-xs leading-snug text-muted">{sub}</p>}
    </div>
  );
}

export function EmptyLine({ children }: { children: React.ReactNode }) {
  return <p className="text-sm italic text-muted">{children}</p>;
}
