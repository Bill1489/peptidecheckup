import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/checkout/page-title";
import { SHIP_TO_COUNTRIES } from "@/components/checkout/shipping-options";
import { Button } from "@/components/ui/button";
import { SpecRow } from "@/components/ui/card";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";

const FREE_THRESHOLD = formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true });
const VAT_PERCENT = `${Math.round(COMMERCE.vatRate * 100)}%`;
const CUT_OFF = "2 pm";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: `Delivery options and prices, free UK delivery over ${FREE_THRESHOLD}, the ${CUT_OFF} same-day dispatch cut-off, the ${SHIP_TO_COUNTRIES.length} countries we ship to, and how returns, damaged parcels and VAT are handled.`,
  alternates: { canonical: "/shipping/" },
  openGraph: {
    images: OG_IMAGES,
    title: "Shipping & returns",
    description: `Delivery options, free UK delivery over ${FREE_THRESHOLD}, ${CUT_OFF} cut-off, ${SHIP_TO_COUNTRIES.length} destinations, returns and VAT.`,
    url: "/shipping/",
  },
};

function regionsLabel(regions: readonly string[]) {
  if (regions.includes("*")) return "All other destinations";
  return regions.map((r) => (r === "GB" ? "United Kingdom" : r)).join(", ");
}

const SECTIONS = [
  { id: "delivery", label: "Delivery options" },
  { id: "destinations", label: "Where we ship" },
  { id: "dispatch", label: "Dispatch and packaging" },
  { id: "returns", label: "Returns" },
  { id: "damaged", label: "Damaged or lost" },
  { id: "vat", label: "VAT and duties" },
];

export default function ShippingPage() {
  const standard = COMMERCE.shippingOptions.find((o) => o.id === "standard");

  return (
    <>
      <PageTitle
        label="Policy"
        title="Shipping & returns"
        description="Delivery options, destinations, dispatch times and how returns are handled. Generated from the store configuration, so what you read here is what the checkout charges."
        meta={`Last reviewed ${new Date().getFullYear()} · ${BRAND.legalName}`}
      />

      {/* Quick facts */}
      <section className="container-x pt-8 lg:pt-10" aria-label="Key facts">
        <dl className="cell-grid sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Same-day dispatch" value={`Order by ${CUT_OFF}, working days`} />
          <Fact label="Free UK delivery" value={`Standard tracked · orders over ${FREE_THRESHOLD}`} />
          <Fact label="Ships to" value={`${SHIP_TO_COUNTRIES.length} countries`} />
          <Fact label="Prices" value={`Include VAT at ${VAT_PERCENT}`} />
        </dl>
      </section>

      <div className="container-x py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
          <nav className="hidden lg:block" aria-label="On this page">
            <ol className="sticky top-28 grid gap-1 border-l border-ink">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="label-mono -ml-px flex items-center gap-3 border-l border-transparent py-1.5 pl-4 text-ink-3 hover:border-brand-600 hover:text-ink">
                    <span className="tnum text-muted-2">{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="grid max-w-3xl gap-14">
            {/* Delivery options */}
            <Section id="delivery" index="01" title="Delivery options">
              <div className="overflow-x-auto border border-ink">
                <table className="w-full min-w-[32rem] border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-ink bg-paper-2">
                      <th scope="col" className="label-mono px-4 py-3 font-medium">
                        Option
                      </th>
                      <th scope="col" className="label-mono px-4 py-3 font-medium">
                        Estimate
                      </th>
                      <th scope="col" className="label-mono px-4 py-3 font-medium">
                        Destinations
                      </th>
                      <th scope="col" className="label-mono px-4 py-3 text-right font-medium">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {COMMERCE.shippingOptions.map((o) => (
                      <tr key={o.id}>
                        <td className="px-4 py-3 font-medium text-ink">{o.label}</td>
                        <td className="px-4 py-3 text-ink-3">{o.eta}</td>
                        <td className="px-4 py-3 text-ink-3">{regionsLabel(o.regions)}</td>
                        <td className="px-4 py-3 text-right font-mono tnum text-ink">
                          {formatMoney(o.price)}
                          {o.id === "standard" && <span className="block font-mono text-[10.5px] uppercase tracking-[0.1em] text-brand-600">Free over {FREE_THRESHOLD}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Estimates are working days from dispatch, not from the moment you order.{" "}
                {standard && (
                  <>
                    {standard.label} is free on UK orders of {FREE_THRESHOLD} or more after any discount; express and international rates are
                    always charged.
                  </>
                )}
              </p>
            </Section>

            {/* Destinations */}
            <Section id="destinations" index="02" title="Where we ship">
              <p>
                We currently deliver to {SHIP_TO_COUNTRIES.length} countries. Research products are supplied to laboratories and qualified
                researchers; we may ask for confirmation of intended use before dispatch, and we decline orders where import of the product is
                prohibited.
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {SHIP_TO_COUNTRIES.map((c) => (
                  <li key={c.code} className="inline-flex h-8 items-center gap-2 border border-ink px-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink">
                    <span className="text-muted">{c.code}</span>
                    {c.name}
                  </li>
                ))}
              </ul>
              <p>
                Outside the UK, delivery is by the international tracked service. Import duties and local taxes are charged by the carrier on
                arrival and are the recipient’s responsibility.
              </p>
            </Section>

            {/* Dispatch */}
            <Section id="dispatch" index="03" title="Dispatch and packaging">
              <div className="border border-ink px-4">
                <SpecRow label="Cut-off" value={`${CUT_OFF} UK time, Monday to Friday`} />
                <SpecRow label="Before cut-off" value="Dispatched the same working day" />
                <SpecRow label="After cut-off / weekends" value="Dispatched the next working day" />
                <SpecRow label="Tracking" value="Emailed when the parcel leaves the lab" />
                <SpecRow label="Certificate of analysis" value="In the box, per batch, and published online" />
              </div>
              <p>
                Lyophilised peptides are stable at ambient temperature for the duration of transit. Vials are argon-flushed and crimp-sealed,
                packed in a rigid inner box with the batch certificate of analysis. Store as specified on the product page as soon as the parcel
                arrives.
              </p>
              <p>
                Pre-filled pens are prescription-only medicines and are never dispatched by us. If a consultation with our partner prescriber
                results in a prescription, the dispensing pharmacy ships the medicine in temperature-controlled packaging with a monitored cold
                chain and its own tracking.
              </p>
            </Section>

            {/* Returns */}
            <Section id="returns" index="04" title="Returns">
              <ul className="cell-grid sm:grid-cols-3">
                <ReturnCell title="Research products">
                  Unopened, seal intact, within 14 days of delivery. Opened or reconstituted vials cannot be returned because sterility cannot
                  be verified.
                </ReturnCell>
                <ReturnCell title="Prescription medicines">
                  Supplied and handled by the dispensing pharmacy under its own returns policy. Medicines cannot be returned to us.
                </ReturnCell>
                <ReturnCell title="Supplies, supplements and cosmetics">
                  Unopened and unused, within 14 days of delivery. Sterile items with a broken seal are not returnable.
                </ReturnCell>
              </ul>
              <p>
                To start a return, email{" "}
                <a href={`mailto:${BRAND.supportEmail}`} className="link-rule">
                  {BRAND.supportEmail}
                </a>{" "}
                with your order number. We confirm the return address and refund to the original payment method within 5 working days of
                receiving the goods. Return postage is paid by the customer unless the item was faulty or sent in error.
              </p>
            </Section>

            {/* Damaged or lost */}
            <Section id="damaged" index="05" title="Damaged or lost">
              <p>
                If a parcel arrives damaged, keep the packaging and email a photo of the outer box and the contents within 48 hours of
                delivery. We replace the affected items or refund them; you do not need to return damaged vials.
              </p>
              <p>
                A parcel is treated as lost when tracking shows no movement for 5 working days (UK) or 15 working days (international) after
                dispatch. We then re-send the order or refund it in full, at your choice.
              </p>
            </Section>

            {/* VAT */}
            <Section id="vat" index="06" title="VAT and duties">
              <p>
                All prices include UK VAT at {VAT_PERCENT}; the VAT element is shown on the checkout summary and the order confirmation. There
                is no VAT-exempt pricing for non-UK destinations at present.
              </p>
              <p>
                For deliveries outside the UK, import duties, local VAT or sales taxes and any carrier handling fee are collected on arrival by
                the carrier and are not included in the price.
              </p>
            </Section>

            <div className="flex flex-col gap-4 border border-ink p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="label-mono text-brand-600">Questions</p>
                <p className="mt-2 text-[15px] text-ink">A person reads every message. Include your order number if you have one.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button href={`mailto:${BRAND.supportEmail}`} variant="primary" size="md">
                  Email support
                </Button>
                <Button href="/account/orders" variant="secondary" size="md">
                  Your orders
                </Button>
              </div>
            </div>

            <p className="text-[12.5px] leading-relaxed text-muted">
              Your statutory rights are not affected. Sale of research products is subject to the{" "}
              <Link href="/terms" className="link-rule">
                terms of sale
              </Link>
              ; research products are not for human consumption and are supplied to purchasers who are 18 or over and have confirmed their
              intended use at checkout.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 sm:p-5">
      <dt className="label-mono">{label}</dt>
      <dd className="mt-2 text-[15px] font-medium text-ink">{value}</dd>
    </div>
  );
}

function Section({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28" aria-labelledby={`${id}-title`}>
      <div className="mb-5 flex items-baseline gap-4">
        <span className="label-mono tnum text-brand-600">{index}</span>
        <h2 id={`${id}-title`} className="text-[1.5rem] uppercase sm:text-[1.9rem]">
          {title}
        </h2>
      </div>
      <div className="grid gap-5 text-[15px] leading-relaxed text-ink-2">{children}</div>
    </section>
  );
}

function ReturnCell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="p-4 sm:p-5">
      <p className="text-[14px] font-semibold text-ink">{title}</p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{children}</p>
    </li>
  );
}
