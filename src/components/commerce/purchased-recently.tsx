import { purchasedIn24h } from "@/lib/commerce/recent-orders";
import { cn } from "@/lib/utils";

/**
 * Quiet count on a pen. A paper label on the photograph, and the same
 * line under the price. No pulse, no pill.
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

  if (variant === "inline") {
    return (
      <p className={cn("mt-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-2", className)}>
        <span className="h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden />
        {count} purchased in the last 24 hours
      </p>
    );
  }

  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-2.5 left-2.5 z-[3] border border-line bg-white/95 px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.08em] text-ink",
        className,
      )}
    >
      {count} in 24 hours
    </span>
  );
}
