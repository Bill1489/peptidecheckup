import { cn } from "@/lib/utils";

/**
 * Empty cells that complete the last row of a `cell-grid`, so the shared-line
 * grid never shows its ink background through a ragged final row. Column
 * counts per breakpoint must mirror the grid's `grid-cols-*` classes.
 */
export function GridFillers({ count, cols }: { count: number; cols: { base: number; lg: number; xl: number } }) {
  const need = (c: number) => (c - (count % c)) % c;
  const base = need(cols.base);
  const lg = need(cols.lg);
  const xl = need(cols.xl);
  const total = Math.max(base, lg, xl);
  if (total === 0) return null;
  return (
    <>
      {Array.from({ length: total }, (_, i) => (
        <li
          key={`filler-${i}`}
          aria-hidden
          className={cn(i < base ? "block" : "hidden", i < lg ? "lg:block" : "lg:hidden", i < xl ? "xl:block" : "xl:hidden")}
        />
      ))}
    </>
  );
}
