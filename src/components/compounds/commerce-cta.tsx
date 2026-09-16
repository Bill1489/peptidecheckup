"use client";

import type * as React from "react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Product, ProductVariant } from "@/data/products";
import { useCartStore } from "@/lib/commerce/cart-store";
import { formatMoney } from "@/lib/commerce/money";
import { COMMERCE_STATE_LABELS, COMMERCE_STATE_SHORT, type CompoundCommerce } from "@/lib/compare";

export function AddToCartButton({
  product,
  variant,
  size = "md",
  className,
  children,
}: {
  product: Product;
  variant: ProductVariant;
  size?: ButtonProps["size"];
  className?: string;
  children?: React.ReactNode;
}) {
  const add = useCartStore((s) => s.add);

  const onClick = () => {
    const ok = add(product.id, variant.id);
    if (ok) {
      toast("Added to cart", { description: `${product.name} · ${variant.label} · ${formatMoney(variant.price)}` });
    } else {
      toast.error("Not available", { description: `${product.name} cannot be added to the cart at the moment.` });
    }
  };

  return (
    <Button type="button" onClick={onClick} size={size} className={className}>
      {children ?? COMMERCE_STATE_LABELS.buy}
    </Button>
  );
}

/**
 * The single right action for a compound's shop position: add the default
 * variant to the cart, start a consultation, read why we do not sell it, or
 * ask to be notified.
 */
export function CommerceCta({
  commerce,
  variant,
  size = "md",
  compact = false,
  className,
}: {
  commerce: CompoundCommerce;
  /** Overrides the resolved variant (e.g. after the visitor picks a size). */
  variant?: ProductVariant;
  size?: ButtonProps["size"];
  /** Shorter labels for narrow columns. */
  compact?: boolean;
  className?: string;
}) {
  const { state, product, href } = commerce;
  const labels = compact ? COMMERCE_STATE_SHORT : COMMERCE_STATE_LABELS;
  const chosen = variant ?? commerce.variant;

  if (state === "buy" && product && chosen) {
    return (
      <AddToCartButton product={product} variant={chosen} size={size} className={className}>
        {labels.buy}
      </AddToCartButton>
    );
  }
  if (state === "consultation") {
    return (
      <Button href={href} size={size} variant="secondary" className={className}>
        {labels.consultation}
      </Button>
    );
  }
  if (state === "not_sold") {
    return (
      <Button href={href} size={size} variant="ghost" className={className}>
        {labels.not_sold}
      </Button>
    );
  }
  return (
    <Button href={href} size={size} variant="ghost" className={className}>
      {labels.unstocked}
    </Button>
  );
}
