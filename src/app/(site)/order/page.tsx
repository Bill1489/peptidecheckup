import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation, OrderSkeleton } from "@/components/checkout/order-confirmation";

export const metadata: Metadata = {
  title: "Order confirmation",
  description: "Your order number, what happens next, delivery estimate, items and totals. Orders are stored on the device they were placed from.",
  robots: { index: false, follow: false },
};

export default function OrderPage() {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderConfirmation />
    </Suspense>
  );
}
