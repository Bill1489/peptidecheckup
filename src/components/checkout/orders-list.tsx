"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/commerce/money";
import { useOrdersStore, type OrderStatus } from "@/lib/commerce/orders";
import { formatDate } from "@/lib/utils";
import { NoticePanel } from "./fields";
import { useMounted } from "./use-mounted";

/** Plain mono status (not a Badge) so it inverts cleanly with the row on hover. */
const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  demo: { label: "Demo", className: "text-brand-600" },
  paid: { label: "Paid", className: "text-ink" },
  pending: { label: "Pending", className: "text-caution" },
};

/** Orders placed from this browser, newest first. */
export function OrdersList() {
  const mounted = useMounted();
  const hydrated = useOrdersStore((s) => s.hydrated);
  const orders = useOrdersStore((s) => s.orders);

  if (!mounted || !hydrated) {
    return (
      <div className="divide-y divide-ink border border-ink" aria-busy="true" aria-label="Loading orders">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex min-h-[64px] items-center gap-4 px-4 py-4">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-3 w-40" />
            <div className="skeleton ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {orders.length === 0 ? (
        <div className="border border-ink p-8 sm:p-10">
          <p className="label-mono text-brand-600">No orders yet</p>
          <h2 className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">Nothing has been ordered from this device</h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Orders you place here will be listed with their order number, date, total and status. Take the assessment first if you want the
            matches and the 10% code.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop" size="lg">
              Go to the shop
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href="/assessment" variant="secondary" size="lg">
              Take the assessment
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="hidden grid-cols-[9rem_1fr_7rem_7rem_2.5rem] gap-4 border-x border-t border-ink px-4 py-2 sm:grid">
            {["Order", "Placed", "Status", "Total", ""].map((h, i) => (
              <span key={i} className={i === 3 ? "label-mono text-right" : "label-mono"}>
                {h}
              </span>
            ))}
          </div>
          <ul className="divide-y divide-ink border border-ink">
            {orders.map((o) => {
              const itemCount = o.lines.reduce((n, l) => n + l.qty, 0);
              const status = STATUS[o.status];
              return (
                <li key={o.id}>
                  <Link
                    href={`/order/?id=${o.id}`}
                    className="hover-invert grid min-h-[64px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-4 text-ink sm:grid-cols-[9rem_1fr_7rem_7rem_2.5rem]"
                    aria-label={`Order ${o.id}, ${formatDate(o.createdAt)}, ${formatMoney(o.total)}, ${status.label}`}
                  >
                    <span className="font-mono text-[14px] font-semibold tnum">{o.id}</span>
                    <span className="row-start-1 justify-self-end font-mono text-[14px] tnum sm:col-start-4 sm:row-auto sm:text-right">{formatMoney(o.total)}</span>
                    <span className="col-span-2 text-[13px] text-muted sm:col-span-1">
                      {formatDate(o.createdAt, { day: "numeric", month: "short", year: "numeric" })} · {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                    <span className={`col-span-2 flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] sm:col-span-1 ${status.className}`}>
                      <span className="h-1.5 w-1.5 bg-current" aria-hidden />
                      {status.label}
                    </span>
                    <ArrowUpRight className="hidden h-4 w-4 justify-self-end sm:block" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <NoticePanel label="Stored on this device">
        Orders are saved in this browser only, so they will not appear on another device or after clearing site data. There are no customer
        accounts in the demo; sign-in and order sync are coming with the customer account release.
      </NoticePanel>
    </div>
  );
}
