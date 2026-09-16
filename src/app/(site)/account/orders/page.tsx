import type { Metadata } from "next";
import { OrdersList } from "@/components/checkout/orders-list";
import { PageTitle } from "@/components/checkout/page-title";

export const metadata: Metadata = {
  title: "Your orders",
  description: "Orders placed from this device, with order number, date, total and status. No account is needed in the demo.",
  robots: { index: false, follow: false },
};

export default function AccountOrdersPage() {
  return (
    <>
      <PageTitle
        label="Account"
        size="md"
        title="Your orders"
        description="Orders placed from this browser, newest first. Open one to see the confirmation, delivery estimate and receipt."
      />
      <div className="container-x py-10 lg:py-14">
        <div className="mx-auto max-w-4xl">
          <OrdersList />
        </div>
      </div>
    </>
  );
}
