import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { PageTitle } from "@/components/checkout/page-title";
import { COMMERCE } from "@/lib/commerce/config";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Contact, delivery, payment and review. Research products require 18+ and intended-use confirmation before the order is placed.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageTitle
        label="Checkout"
        size="md"
        title="Checkout"
        meta={
          COMMERCE.paymentProvider === "mock"
            ? "Demo checkout · No payment is taken · Orders are stored on this device"
            : "Secure payment via Stripe · 18+ only · Research-use labelling"
        }
      />
      <CheckoutFlow />
    </>
  );
}
