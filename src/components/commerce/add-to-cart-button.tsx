"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import { defaultVariant, purchasable, type Product } from "@/data/products";
import { useCartStore } from "@/lib/commerce/cart-store";
import { formatMoney } from "@/lib/commerce/money";

/**
 * One-click add for cards and the range table. Adds the product's default
 * variant (one pen) unless a variant id is given; the cart drawer opens.
 */
export function AddToCartButton({
  product,
  variantId,
  qty = 1,
  label = "Add to cart",
  showIcon = true,
  size = "md",
  variant = "primary",
  className,
  children,
}: {
  product: Product;
  variantId?: string;
  qty?: number;
  label?: string;
  showIcon?: boolean;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
  children?: React.ReactNode;
}) {
  const add = useCartStore((s) => s.add);
  const chosen = product.variants.find((v) => v.id === variantId) ?? defaultVariant(product);
  const canBuy = purchasable(product) && (chosen.stock > 0 || product.availability === "preorder");

  const onAdd = () => {
    const ok = add(product.id, chosen.id, qty);
    if (ok) {
      toast(`${product.name} added to cart`, { description: `${qty} × ${chosen.label} · ${formatMoney(chosen.price * qty)}` });
    } else {
      toast("This item can't be added right now.");
    }
  };

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={onAdd} disabled={!canBuy} aria-label={`${label}: ${product.name}`}>
      {children ?? (
        <>
          {label}
          {showIcon && <Plus className="h-3.5 w-3.5" aria-hidden />}
        </>
      )}
    </Button>
  );
}
