import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/checkout/page-title";
import { SHIP_TO_COUNTRIES, shipToCountryName } from "@/components/checkout/shipping-options";
import { joinNames } from "@/components/commerce/product-utils";
import { Button } from "@/components/ui/button";
import { SpecRow } from "@/components/ui/card";
import { PRODUCTS } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";

const FREE_THRESHOLD = formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true });
const VAT_PERCENT = `${Math.round(COMMERCE.vatRate * 100)}%`;
const CUT_OFF = "2 pm";
const STORAGE_LINE = PRODUCTS.find((p) => p.pen)?.pen?.storage ?? "Refrigerate at 2–8 °C. Do not freeze.";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: `Delivery options and prices, free ${COMMERCE.market.short} delivery over ${FREE_THRESHOLD}, the ${CUT_OFF} same-day dispatch cut-off, the ${SHIP_TO_COUNTRIES.length} countries we ship to, and how returns, damaged parcels and VAT are handled.`,
  alternates: { canonical: "/shipping/" },
  openGraph: {
    images: OG_IMAGES,
    title: "Shipping & returns",
    description: `Delivery options, free ${COMMERCE.market.short} delivery over ${FREE_THRESHOLD}, ${CUT_OFF} cut-off, ${SHIP_TO_COUNTRIES.length} destinations, returns and VAT.`,
    url: "/shipping/",
  },
};

/** "United Arab Emirates" · "Saudi Arabia, Qatar, Kuwait, Bahrain and Oman" · "All other destinations" — from the country catalogue. */
function regionsLabel(regions: readonly string[]) {
  if (regions.includes("*")) return "All other destinations";
  return joinNames(regions.map((r) => shipToCountryName(r)));
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
          <Fact label={`Free ${COMMERCE.market.short} delivery`} value={`Standard tracked · orders over ${FREE_THRESHOLD}`} />
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
                Estimates are working days from dispatch, not from the moment you order; the same-day courier delivers on the day of dispatch.{" "}
                {standard && (
                  <>
                    {standard.label} is free on {COMMERCE.market.short} orders of {FREE_THRESHOLD} or more after any discount; same-day, GCC and international rates
                    are always charged. Every option is a chilled service.
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
                Outside the {COMMERCE.market.short}, delivery is by the GCC or international chilled courier service. Import duties and local taxes are charged by the carrier on
                arrival and are the recipient’s responsibility.
              </p>
            </Section>

            {/* Dispatch */}
            <Section id="dispatch" index="03" title="Dispatch and packaging">
              <div className="border border-ink px-4">
                <SpecRow label="Cut-off" value={`${CUT_OFF} ${COMMERCE.market.timezone}, Monday to Friday`} />
                <SpecRow label="Before cut-off" value="Dispatched the same working day" />
                <SpecRow label="After cut-off / weekends" value="Dispatched the next working day" />
                <SpecRow label="Packaging" value="Insulated box with gel packs · tracked · chilled" />
                <SpecRow label="Tracking" value="Emailed when the parcel leaves us" />
                <SpecRow label="Certificate of analysis" value="In the box, per lot, and published online" />
              </div>
              <p>
                Every pen in the range is a pre-filled 3 mL solution and is temperature-sensitive. Pens travel in insulated packaging with gel
                packs on a chilled courier service, with the lot-numbered carton and the certificate of analysis for that lot in the box. Put the
                pen in the fridge as soon as the parcel arrives: {STORAGE_LINE}
              </p>
              <p>
                Pen needles are not included unless the listing says so. We sell no prescription-only medicines and run no consultation service;
                everything we dispatch is a research-use pen from the {BRAND.range.name} range.
              </p>
            </Section>

            {/* Returns */}
            <Section id="returns" index="04" title="Returns">
              <ul className="cell-grid sm:grid-cols-3">
                <ReturnCell title="Unopened pens">
                  Seal intact, within 14 days of delivery, for a refund to the original payment method. Return postage is paid by you unless the
                  pen was faulty or sent in error.
                </ReturnCell>
                <ReturnCell title="Opened pens">
                  Cannot be returned. Once the seal is broken neither sterility nor the cold chain can be verified, so the pen cannot be
                  restocked.
                </ReturnCell>
                <ReturnCell title="Faulty or wrong lot">
                  A pen that arrives warm, with a broken seal, or that does not match the certificate for its lot is replaced or refunded, including
                  return postage where we ask for it back.
                </ReturnCell>
              </ul>
              <p>
                To start a return, email{" "}
                <a href={`mailto:${BRAND.supportEmail}`} className="link-rule">
                  {BRAND.supportEmail}
                </a>{" "}
                with your order number and the lot number on the carton. We confirm the return address and refund within 5 working days of
                receiving the pen.
              </p>
            </Section>

            {/* Damaged or lost */}
            <Section id="damaged" index="05" title="Damaged or lost">
              <p>
                If a parcel arrives damaged or warm, keep the packaging and email a photo of the outer box and the contents within 48 hours of
                delivery. We replace the affected pens or refund them; you do not need to return a damaged pen unless we ask.
              </p>
              <p>
                A parcel is treated as lost when tracking shows no movement for 5 working days ({COMMERCE.market.short}) or 15 working days (international) after
                dispatch. We then re-send the order or refund it in full, at your choice.
              </p>
            </Section>

            {/* VAT */}
            <Section id="vat" index="06" title="VAT and duties">
              <p>
                All prices include {COMMERCE.market.short} VAT at {VAT_PERCENT}; the VAT element is shown on the checkout summary and the order confirmation. There
                is no VAT-exempt pricing for destinations outside the {COMMERCE.market.short} at present.
              </p>
              <p>
                For deliveries outside the {COMMERCE.market.short}, import duties, local VAT or sales taxes and any carrier handling fee are collected on arrival by
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
