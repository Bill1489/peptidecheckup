import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Helix glyph — the mark on Aervyn packaging, where a stylised double helix
 * stands in for the "Y" of AERVYN. Drawn as two interleaved strands with rungs.
 */
export function HelixGlyph({
  className,
  color = "currentColor",
  strokeWidth = 2.2,
}: {
  className?: string;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 32" fill="none" aria-hidden="true" className={cn("h-[1em] w-[0.75em] shrink-0", className)}>
      <path
        d="M5 2 C5 9 19 11 19 16 C19 21 5 23 5 30"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M19 2 C19 9 5 11 5 16 C5 21 19 23 19 30"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path d="M7.5 6.5 H16.5 M7 25.5 H17 M9.5 12 H14.5 M9.5 20 H14.5" stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
    </svg>
  );
}

/** Square mark for favicons, avatars, footer. */
export function LogoMark({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "light" | "ink";
}) {
  const bg = tone === "light" ? "#ffffff" : "#0b0b0c";
  const fg = tone === "light" ? "#0b0b0c" : tone === "brand" ? "#5d76ff" : "#ffffff";
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("h-7 w-7 shrink-0", className)}>
      <rect width="32" height="32" fill={bg} />
      <path d="M11 5 C11 12 21 14 21 18 C21 22 11 24 11 29" stroke={fg} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M21 5 C21 12 11 14 11 18 C11 22 21 24 21 29" stroke={fg} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M13 9 H19 M13 26 H19 M14.5 14.5 H17.5 M14.5 21.5 H17.5" stroke={fg} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "dark",
  descriptor = true,
}: {
  className?: string;
  tone?: "dark" | "light";
  descriptor?: boolean;
}) {
  const color = tone === "dark" ? "text-ink" : "text-white";
  const accent = tone === "dark" ? "#1d3bff" : "#8fa1ff";
  return (
    <span className={cn("inline-flex flex-col leading-none", color, className)}>
      <span
        className="inline-flex items-center font-display text-[17px] font-extrabold uppercase tracking-[0.18em]"
        style={{ fontStretch: "112%", fontVariationSettings: '"wdth" 112' }}
      >
        {BRAND.wordmark.a}
        <HelixGlyph color={accent} className="mx-[0.02em] h-[1.05em]" />
        {BRAND.wordmark.b}
      </span>
      {descriptor && (
        <span className={cn("mt-1 font-mono text-[7.5px] uppercase tracking-[0.34em]", tone === "dark" ? "text-muted" : "text-white/60")}>
          {BRAND.descriptor}
        </span>
      )}
    </span>
  );
}

export function Logo({
  href = "/",
  tone = "dark",
  className,
  descriptor = true,
}: {
  href?: string;
  tone?: "dark" | "light";
  className?: string;
  markClassName?: string;
  descriptor?: boolean;
}) {
  return (
    <Link href={href} aria-label={`${BRAND.displayName} home`} className={cn("inline-flex items-center", className)}>
      <Wordmark tone={tone} descriptor={descriptor} />
    </Link>
  );
}
