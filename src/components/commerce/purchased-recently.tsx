import { purchasedIn24h } from "@/lib/commerce/recent-orders";
import { cn } from "@/lib/utils";

/**
 * Social-proof chip for a pen. `overlay` sits on the photograph;
 * `inline` sits in the buy column.
 */
export function PurchasedRecently({
  slug,
  variant = "overlay",
  className,
}: {
  slug: string;
  variant?: "overlay" | "inline";
  className?: string;
}) {
  const count = purchasedIn24h(slug);
  const label = `${count} purchased in the last 24 hours`;

  if (variant === "inline") {
    return (
      <p className={cn("inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-[13px] leading-none text-brand-800", className)}>
        <Dot />
        {label}
      </p>
    );
  }

  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-3 left-3 z-[3] inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[11px] font-medium leading-none text-ink shadow-card backdrop-blur-sm",
        className,
      )}
    >
      <Dot />
      <span className="truncate">{count} purchased in 24 hours</span>
    </span>
  );
}

function Dot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
      <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-brand-400" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
    </span>
  );
}
