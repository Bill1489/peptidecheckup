"use client";

import { toast } from "sonner";
import { useCartStore } from "@/lib/commerce/cart-store";

/**
 * One-tap add for single-variant, purchasable products. The store re-reads
 * price from the catalogue and opens the cart drawer; we only confirm.
 * Styling is passed in by the tile so the button and the "View" link match.
 */
export function QuickAdd({
  productId,
  variantId,
  name,
  variantLabel,
  className,
}: {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  className?: string;
}) {
  const add = useCartStore((s) => s.add);

  const onClick = () => {
    const ok = add(productId, variantId, 1);
    toast(ok ? `Added to cart: ${name} · ${variantLabel}` : `${name} is not available right now.`);
  };

  return (
    <button type="button" onClick={onClick} aria-label={`Add ${name} (${variantLabel}) to cart`} className={className}>
      Add
    </button>
  );
}
