import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Logo mark: a short peptide chain (beads) that resolves into a check mark —
 * "peptides, checked". Works at 16px favicon size and at hero scale.
 */
export function LogoMark({
  className,
  tone = "brand",
}: {
  className?: string;
  /** brand = teal on light; light = white on dark; ink = dark mono */
  tone?: "brand" | "light" | "ink";
}) {
  const stroke = tone === "light" ? "#ffffff" : tone === "ink" ? "#0b1220" : "#1f6e61";
  const bead = tone === "light" ? "#7cc3b3" : tone === "ink" ? "#0b1220" : "#2c8877";
  const beadHi = tone === "light" ? "#ffffff" : tone === "ink" ? "#3a4556" : "#0a211e";
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <path
        d="M6.5 17.5 L13 24 L25.5 8.5"
        stroke={stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="17.5" r="3.4" fill={bead} />
      <circle cx="13" cy="24" r="3.4" fill={beadHi} />
      <circle cx="19.25" cy="16.25" r="2.6" fill={bead} />
      <circle cx="25.5" cy="8.5" r="3.4" fill={beadHi} />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "font-sans text-[1.15rem] font-semibold tracking-[-0.03em] leading-none",
        tone === "dark" ? "text-ink" : "text-white",
        className,
      )}
    >
      {BRAND.wordmark.a}
      <span className={tone === "dark" ? "text-brand-600" : "text-brand-300"}>{BRAND.wordmark.b}</span>
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
    <Link
      href={href}
      aria-label={`${BRAND.displayName} home`}
      className={cn("inline-flex items-center gap-2.5 rounded-md", className)}
    >
      <LogoMark tone={tone === "dark" ? "brand" : "light"} className={markClassName} />
      <Wordmark tone={tone} />
    </Link>
  );
}
