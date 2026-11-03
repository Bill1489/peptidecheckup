import { purchasedIn24h } from "@/lib/commerce/recent-orders";
import { cn } from "@/lib/utils";

/**
 * "N purchased in 24 hours" on a pen. Same ink label as the rest of the
 * spec sheet: square, mono, no pill. `overlay` sits on the photograph;
 * `inline` sits under the price.
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
      <p className={cn("mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink", className)}>
        <span className="mr-2 inline-block h-1.5 w-1.5 bg-brand-600 align-middle" aria-hidden />
        {count} purchased in the last 24 hours
      </p>
    );
  }

  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-0 left-0 z-[3] max-w-full bg-ink px-2 py-1 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-white",
        className,
      )}
    >
      {count} purchased in 24 hrs
    </span>
  );
}
