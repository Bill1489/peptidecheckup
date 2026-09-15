"use client";

import * as React from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/commerce/cart-store";
import { cn } from "@/lib/utils";

/** Nav cart trigger — count badge + opens the drawer. Renders 0 until hydrated. */
export function CartButton({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const lines = useCartStore((s) => s.lines);
  const hydrated = useCartStore((s) => s.hydrated);
  const setOpen = useCartStore((s) => s.setOpen);
  const count = hydrated ? lines.reduce((n, l) => n + l.qty, 0) : 0;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className={cn(
        "relative inline-flex h-11 items-center gap-2 border px-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors",
        tone === "dark"
          ? "border-ink bg-white text-ink hover:bg-ink hover:text-white"
          : "border-white/40 bg-transparent text-white hover:bg-white hover:text-ink",
        className,
      )}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">Cart</span>
      <span
        className={cn(
          "inline-flex h-5 min-w-5 items-center justify-center px-1 font-mono text-[10.5px] tnum",
          count > 0 ? "bg-brand-600 text-white" : "bg-paper-3 text-ink",
        )}
      >
        {count}
      </span>
    </button>
  );
}
