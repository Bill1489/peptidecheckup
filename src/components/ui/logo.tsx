import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Mark v2: a peptide chain of square residues resolving into a check —
 * drawn with square caps so it reads as technical, not friendly.
 */
export function LogoMark({
  className,
  tone = "brand",
}: {
  className?: string;
  /** brand = ink nodes + cobalt terminal; light = white on dark; ink = mono */
  tone?: "brand" | "light" | "ink";
}) {
  const stroke = tone === "light" ? "#ffffff" : "#0b0b0c";
  const node = tone === "light" ? "#ffffff" : "#0b0b0c";
  const terminal = tone === "brand" ? "#1d3bff" : tone === "light" ? "#8fa1ff" : "#0b0b0c";
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("h-7 w-7 shrink-0", className)}>
      <path d="M5 17.5 L12.5 25 L27 7" stroke={stroke} strokeWidth="2.6" strokeLinecap="square" strokeLinejoin="miter" />
      <rect x="2.2" y="14.7" width="5.6" height="5.6" fill={node} />
      <rect x="9.7" y="22.2" width="5.6" height="5.6" fill={node} />
      <rect x="17" y="13" width="4.6" height="4.6" fill={node} />
      <rect x="24.2" y="4.2" width="5.6" height="5.6" fill={terminal} />
    </svg>
  );
}

export function Wordmark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "font-display text-[15px] font-extrabold uppercase leading-none tracking-[-0.01em]",
        tone === "dark" ? "text-ink" : "text-white",
        className,
      )}
      style={{ fontStretch: "112%", fontVariationSettings: '"wdth" 112' }}
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
}) {
  return (
    <Link href={href} aria-label={`${BRAND.displayName} home`} className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone === "dark" ? "brand" : "light"} className={markClassName} />
      <Wordmark tone={tone} />
    </Link>
  );
}
