import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Mark v3 — "the chain": four square residues on a zig-zag peptide backbone,
 * the terminal residue in cobalt (the one the Checkup lands on). Square caps,
 * mitred joins, no curves — technical, not friendly. Geometry is shared with
 * `src/app/icon.svg` and the logo kit in the brand folder.
 */
export const MARK_PATH = "M4 23 L12 9 L20 23 L28 9";
export const MARK_NODES: readonly [number, number][] = [
  [0.75, 19.75],
  [8.75, 5.75],
  [16.75, 19.75],
  [24.75, 5.75],
];
export const MARK_NODE_SIZE = 6.5;

export function LogoMark({
  className,
  tone = "brand",
}: {
  className?: string;
  /** brand = ink nodes + cobalt terminal; light = white on dark; ink = mono */
  tone?: "brand" | "light" | "ink";
}) {
  const ink = tone === "light" ? "#ffffff" : "#3c332f";
  const terminal = tone === "brand" ? "#9a5560" : tone === "light" ? "#f6e6e4" : "#3c332f";
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("h-7 w-7 shrink-0", className)}>
      <path d={MARK_PATH} stroke={ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {MARK_NODES.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={MARK_NODE_SIZE} height={MARK_NODE_SIZE} rx="1.6" fill={i === MARK_NODES.length - 1 ? terminal : ink} />
      ))}
    </svg>
  );
}

export function Wordmark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "font-display text-[18px] font-medium leading-none tracking-[-0.02em]",
        tone === "dark" ? "text-ink" : "text-white",
        className,
      )}
      style={{ fontVariationSettings: '"SOFT" 40, "opsz" 36, "wght" 520' }}
    >
      {BRAND.wordmark.a}
      <span className={tone === "dark" ? "text-brand-600" : "text-brand-300"}> {BRAND.wordmark.b}</span>
    </span>
  );
}

export function Logo({
  href = "/",
  tone = "dark",
  className,
  markClassName,
}: {
  href?: string;
  tone?: "dark" | "light";
  className?: string;
  markClassName?: string;
  /** Accepted for API compatibility; the Compare Peptide wordmark has no descriptor line. */
  descriptor?: boolean;
}) {
  return (
    <Link href={href} aria-label={`${BRAND.displayName} home`} className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone === "dark" ? "brand" : "light"} className={markClassName} />
      <Wordmark tone={tone} />
    </Link>
  );
}
