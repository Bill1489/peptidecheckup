import { cn } from "@/lib/utils";

/**
 * Decorative peptide-chain motif echoing the logo mark: beads joined by a
 * stroke. Pure inline SVG, inherits `currentColor` for the chain and uses
 * theme fills for the beads so it sits naturally on light and dark surfaces.
 */
const POINTS: readonly [number, number][] = [
  [24, 300],
  [124, 226],
  [222, 262],
  [318, 150],
  [420, 186],
  [522, 72],
  [596, 104],
];

export function BeadChain({
  className,
  tone = "light",
}: {
  className?: string;
  /** light = on paper; dark = on ink */
  tone?: "light" | "dark";
}) {
  const path = POINTS.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const beadFills =
    tone === "light"
      ? ["fill-brand-300", "fill-brand-600", "fill-white", "fill-brand-400", "fill-brand-200", "fill-brand-700", "fill-white"]
      : ["fill-brand-400", "fill-brand-200", "fill-ink", "fill-brand-300", "fill-brand-500", "fill-brand-200", "fill-ink"];
  return (
    <svg
      viewBox="0 0 620 340"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
    >
      <path d={path} stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {POINTS.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 === 2 ? 11 : 14}
          className={cn(beadFills[i], i % 3 === 2 && "stroke-current")}
          strokeWidth={i % 3 === 2 ? 6 : 0}
        />
      ))}
    </svg>
  );
}

/** Small horizontal chain used as a section ornament / divider. */
export function BeadRule({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" aria-hidden="true" className={cn("h-3 w-30 text-brand-300", className)}>
      <path d="M6 6 H114" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {[6, 33, 60, 87, 114].map((x, i) => (
        <circle key={x} cx={x} cy="6" r={i % 2 === 0 ? 4 : 3} className={i % 2 === 0 ? "fill-brand-500" : "fill-brand-300"} />
      ))}
    </svg>
  );
}
