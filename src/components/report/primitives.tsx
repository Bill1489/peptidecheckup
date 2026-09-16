"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
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
      className={cn("scroll-mt-28 border-t border-ink pt-10 lg:scroll-mt-24", def.printBreak && "print-break", className)}
    >
      <header className="mb-8 max-w-2xl">
        <MonoLabel className="text-ink">
          <span className="tnum">{def.number}</span>
          <span aria-hidden className="mx-2 text-muted-2">
            ·
          </span>
          {def.label}
        </MonoLabel>
        <h2
          id={`${def.id}-heading`}
          className="mt-3 text-balance font-display text-[1.75rem] uppercase leading-[0.98] text-ink sm:text-[2.25rem]"
        >
          {def.heading}
        </h2>
        {description && <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted">{description}</p>}
      </header>
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
  return <Tag className={cn("label-mono", className)}>{children}</Tag>;
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
        "rounded-none border break-inside-avoid",
        tone === "white" && "border-ink bg-white text-ink",
        tone === "paper" && "border-line bg-paper-2 text-ink",
        tone === "ink" && "border-ink bg-ink text-white",
        tone === "outline" && "border-ink bg-transparent text-ink",
        padding === "sm" && "p-4 sm:p-5",
        padding === "md" && "p-5 sm:p-6",
        padding === "lg" && "p-6 sm:p-8",
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
        <h3 className={cn("font-display uppercase leading-none text-ink", size === "md" ? "text-[1.35rem]" : "text-[1.15rem]")}>{name}</h3>
        {meta && <p className="mt-1.5 text-[13px] text-muted">{meta}</p>}
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
      <dd className={cn("mt-1.5 text-[15px] leading-relaxed text-ink-2", valueClassName)}>{children}</dd>
    </div>
  );
}

/** Bordered note with a 3px signal edge (disclaimers, research-information labels). */
export function Note({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "brand" | "warning" | "danger";
}) {
  return (
    <div
      className={cn(
        "rounded-none border border-ink border-l-[3px] px-4 py-3.5 text-sm leading-relaxed break-inside-avoid",
        tone === "neutral" && "border-l-ink bg-paper-2 text-ink-3",
        tone === "brand" && "border-l-brand-600 bg-white text-ink-2",
        tone === "warning" && "border-l-caution bg-caution-soft text-ink-2",
        tone === "danger" && "border-l-accent-500 bg-accent-100 text-ink-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Stat cell for a `cell-grid`: mono label, big tabular number. */
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
  tone?: "neutral" | "brand" | "danger" | "warning";
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 p-4 break-inside-avoid sm:p-5", className)}>
      <MonoLabel>{label}</MonoLabel>
      <div
        className={cn(
          "font-display text-[2.25rem] leading-none tnum sm:text-[2.6rem]",
          tone === "neutral" && "text-ink",
          tone === "brand" && "text-brand-600",
          tone === "danger" && "text-accent-500",
          tone === "warning" && "text-caution",
        )}
      >
        {value}
      </div>
      {sub && <p className="text-xs leading-snug text-muted">{sub}</p>}
    </div>
  );
}

export function EmptyLine({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-muted">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Data table                                                          */
/* ------------------------------------------------------------------ */

export interface DataColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** Applied to the desktop cell */
  className?: string;
}

type TableBreakpoint = "sm" | "md" | "lg";
const TABLE_AT: Record<TableBreakpoint, string> = { sm: "hidden sm:table", md: "hidden md:table", lg: "hidden lg:table" };
const LIST_AT: Record<TableBreakpoint, string> = { sm: "sm:hidden", md: "md:hidden", lg: "lg:hidden" };

/**
 * Bordered table with mono headers. Renders as a real table from `breakpoint`
 * up and as stacked label/value blocks on narrower screens so nothing overflows.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  detail,
  caption,
  className,
  breakpoint = "sm",
}: {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Optional full-width line rendered under each row */
  detail?: (row: T) => React.ReactNode;
  caption?: string;
  className?: string;
  breakpoint?: TableBreakpoint;
}) {
  return (
    <div className={cn("rounded-none border border-ink bg-white break-inside-avoid", className)}>
      <table className={cn("w-full border-collapse text-left text-[13.5px]", TABLE_AT[breakpoint])}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-ink bg-paper-2">
            {columns.map((c) => (
              <th key={c.key} scope="col" className="label-mono px-4 py-3 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const extra = detail?.(row);
            return (
              <React.Fragment key={rowKey(row)}>
                <tr className={cn("border-b border-line", !extra && "last:border-b-0")}>
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-4 py-3 align-top leading-relaxed text-ink-2", c.className)}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
                {extra && (
                  <tr className="border-b border-line last:border-b-0">
                    <td colSpan={columns.length} className="px-4 pb-3.5 pt-0 text-[13px] leading-relaxed text-muted">
                      {extra}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <ul className={LIST_AT[breakpoint]}>
        {rows.map((row) => {
          const extra = detail?.(row);
          return (
            <li key={rowKey(row)} className="border-b border-line p-4 last:border-b-0">
              <dl className="grid gap-3">
                {columns.map((c) => (
                  <div key={c.key}>
                    <dt className="label-mono">{c.header}</dt>
                    <dd className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{c.render(row)}</dd>
                  </div>
                ))}
              </dl>
              {extra && <p className="mt-3 text-[13px] leading-relaxed text-muted">{extra}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
