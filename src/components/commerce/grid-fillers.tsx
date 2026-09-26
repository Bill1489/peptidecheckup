import { cn } from "@/lib/utils";

export interface GridCols {
  base: number;
  sm?: number;
  md?: number;
  lg: number;
  xl: number;
}

/**
 * Empty cells that complete the last row of a `cell-grid`, so the shared-line
 * grid never shows its ink background through a ragged final row. Column
 * counts per breakpoint must mirror the grid's `grid-cols-*` classes; `sm` and
 * `md` inherit the count below them when omitted.
 */
export function GridFillers({ count, cols }: { count: number; cols: GridCols }) {
  const need = (c: number) => (c - (count % c)) % c;
  const sm = cols.sm ?? cols.base;
  const md = cols.md ?? sm;
  const at = { base: need(cols.base), sm: need(sm), md: need(md), lg: need(cols.lg), xl: need(cols.xl) };
  const total = Math.max(at.base, at.sm, at.md, at.lg, at.xl);
  if (total === 0) return null;
  return (
    <>
      {Array.from({ length: total }, (_, i) => (
        <li
          key={`filler-${i}`}
          aria-hidden
          className={cn(
            i < at.base ? "block" : "hidden",
            i < at.sm ? "sm:block" : "sm:hidden",
            i < at.md ? "md:block" : "md:hidden",
            i < at.lg ? "lg:block" : "lg:hidden",
            i < at.xl ? "xl:block" : "xl:hidden",
          )}
        />
      ))}
    </>
  );
}
