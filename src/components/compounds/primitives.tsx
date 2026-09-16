import * as React from "react";
import Link from "next/link";
import { type Badge, EvidenceMeter } from "@/components/ui/badge";
import { EVIDENCE_LABELS, type EvidenceQuality } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Small building blocks shared by the directory, detail and compare surfaces.
 * Server-safe: nothing here reads preferences or browser state.
 */

export type BadgeTone = NonNullable<React.ComponentProps<typeof Badge>["tone"]>;

/**
 * Badges keep their own light chip fills when a `group` card inverts to ink, so
 * most tones stay legible untouched. The two tones drawn directly on the card
 * surface need their ink strokes swapped to white.
 */
export const BADGE_INVERT: Partial<Record<BadgeTone, string>> = {
  outline: "group-hover:border-white group-hover:text-white",
  ink: "group-hover:border-white",
};

/* ------------------------------------------------------------------ */
/* Page header: mono label left, expanded uppercase headline right      */
/* ------------------------------------------------------------------ */

export function IndexHeader({
  label,
  title,
  description,
  children,
}: {
  label: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Rendered under the headline block, e.g. a stats `cell-grid`. */
  children?: React.ReactNode;
}) {
  return (
    <section className="rule-b">
      <div className="container-x py-10 sm:py-14 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
          <p className="label-mono lg:pt-3">{label}</p>
          <div className="min-w-0">
            <h1 className="text-balance text-[2.25rem] uppercase leading-[0.95] sm:text-[3.4rem] lg:text-[4.4rem]">{title}</h1>
            {description && (
              <p className="mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted sm:text-[17px]">{description}</p>
            )}
          </div>
        </div>
        {children && <div className="mt-10 lg:mt-12">{children}</div>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cell grid with filler cells                                         */
/* ------------------------------------------------------------------ */

/** Column counts at base / sm / lg / xl. Omitted breakpoints inherit the previous one. */
export type CellCols = readonly [base: number, sm?: number, lg?: number, xl?: number];

function fillersNeeded(count: number, cols: number): number {
  return cols > 0 ? (cols - (count % cols)) % cols : 0;
}

/**
 * `cell-grid` whose last row is padded with blank cells, so a count that is
 * not a multiple of the column count never leaves ink-filled holes.
 * `className` must carry the matching `grid-cols-*` utilities.
 */
export function CellGrid({
  as: Tag = "div",
  itemAs: Item = "div",
  cols,
  count,
  className,
  children,
  ...rest
}: {
  as?: "div" | "ul" | "ol" | "dl";
  itemAs?: "div" | "li";
  cols: CellCols;
  count: number;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  const [base, sm = base, lg = sm, xl = lg] = cols;
  const needs = {
    base: fillersNeeded(count, base),
    sm: fillersNeeded(count, sm),
    lg: fillersNeeded(count, lg),
    xl: fillersNeeded(count, xl),
  };
  const fillerCount = Math.max(needs.base, needs.sm, needs.lg, needs.xl);

  return (
    <Tag className={cn("cell-grid", className)} {...rest}>
      {children}
      {Array.from({ length: fillerCount }, (_, i) => (
        <Item
          key={`filler-${i}`}
          aria-hidden
          className={cn(
            i < needs.base ? "block" : "hidden",
            i < needs.sm ? "sm:block" : "sm:hidden",
            i < needs.lg ? "lg:block" : "lg:hidden",
            i < needs.xl ? "xl:block" : "xl:hidden",
          )}
        >
          <div className="h-full min-h-12 bg-paper-2" />
        </Item>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Data marks                                                          */
/* ------------------------------------------------------------------ */

/**
 * Evidence meter followed by its grade label. With `chip`, both sit on a white
 * tile — invisible on a white card, and once the surrounding `group` card
 * inverts to ink it keeps the squares and label legible.
 */
export function MeterLabel({ level, chip = false, className }: { level: EvidenceQuality; chip?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[12px] font-medium leading-none",
        chip && "-mx-1.5 -my-1 bg-white px-1.5 py-1 text-ink",
        className,
      )}
    >
      <EvidenceMeter level={level} />
      <span>{EVIDENCE_LABELS[level]}</span>
    </span>
  );
}

/** Square status marker. Pass a background utility, e.g. `bg-accent-500`. */
export function Marker({ className }: { className: string }) {
  return <span aria-hidden className={cn("inline-block h-2.5 w-2.5 shrink-0", className)} />;
}

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

export function EmptyNote({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-[14px] leading-relaxed text-muted", className)}>{children}</p>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="label-mono flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(last && "text-ink")} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className="text-muted-2">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
