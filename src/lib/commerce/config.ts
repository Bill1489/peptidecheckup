import { BRAND, RESEARCH_USE_LABEL } from "@/lib/brand";

/**
 * Store configuration. Everything a merchant would change lives here.
 */
export const COMMERCE = {
  /** The store trades in pounds sterling. */
  currency: "GBP" as const,
  locale: "en-GB",
  /** Home market — drives copy ("UK orders"), domestic shipping and the default checkout country. */
  market: { countryCode: "GB", name: "United Kingdom", short: "UK", timezone: "UK time" },
  /**
   * How sterling prices are set. The manufacturer lists in UAE dirhams
   * (docs/AERVYN-PRICES-2026-09-26.txt); each pen's GBP price is that list
   * price × `rate`, rounded to the nearest `roundTo` minor units. The rate is
   * fixed, not live — review it monthly and regenerate the catalogue prices
   * (docs/GBP-PRICES-2026-09-26.txt has the working).
   */
  pricing: { listCurrency: "AED", rate: 0.205, rateSetOn: "2026-09-26", roundTo: 500 },
  /** Prices include VAT (UK consumer pricing, 20%). */
  taxInclusive: true,
  vatRate: 0.2,
  /** Free standard shipping at or above this subtotal (minor units — pence). */
  freeShippingThreshold: 30000,
  shippingOptions: [
    { id: "standard", label: "Standard chilled courier", eta: "1–2 working days", price: 595, regions: ["GB"] },
    { id: "express", label: "Next-day pre-noon chilled courier", eta: "Next working day · order by 2 pm", price: 995, regions: ["GB"] },
    { id: "eu", label: "EU chilled courier", eta: "2–4 working days", price: 1495, regions: ["IE", "DE", "FR", "NL", "ES", "IT"] },
    { id: "international", label: "International chilled courier", eta: "3–7 working days", price: 2495, regions: ["*"] },
  ],
  /** Demo promo codes — replace with your platform's discount engine. */
  promoCodes: {
    CHECKUP10: { type: "percent", value: 10, label: "10% off — Checkup completed" },
    FIRST15: { type: "percent", value: 15, label: "15% off your first order" },
    FREESHIP: { type: "shipping", value: 0, label: "Free standard shipping" },
  } as Record<string, { type: "percent" | "fixed" | "shipping"; value: number; label: string }>,
  /** Countries we ship to (ISO-2). "*" is handled by the international option. */
  shipTo: ["GB", "IE", "DE", "FR", "NL", "ES", "IT", "CH", "US", "CA", "AU", "NZ", "SG", "HK", "AE", "SA", "QA", "KW", "BH", "OM"],
  /** Checkout acknowledgements required for research-channel products. */
  requireAgeConfirmation: true,
  requireResearchAcknowledgement: true,
  researchLabel: RESEARCH_USE_LABEL,
  /** Name used for the prescriber partner in consultation flows. */
  prescriberPartner: "our partner prescriber",
  /**
   * Payment provider. "mock" completes an order locally (demo).
   * Set NEXT_PUBLIC_PAYMENT_PROVIDER=stripe and the Stripe keys to switch.
   */
  paymentProvider: (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? "mock") as "mock" | "stripe",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  /** Webhook that receives orders / leads as JSON (Zapier, Make, your API). */
  orderWebhook: process.env.NEXT_PUBLIC_ORDER_WEBHOOK,
  leadWebhook: process.env.NEXT_PUBLIC_LEAD_WEBHOOK,
  supportEmail: BRAND.supportEmail,
  /** Trust facts shown in the ticker / footer. Keep true. */
  trustFacts: [
    "Pre-filled dose-dial pens · no reconstitution",
    "Every lot third-party tested",
    "Certificate of analysis published per lot",
    "Ships chilled · same-day dispatch before 2 pm",
    "18+ only · research use labelling",
    "The Checkup tells you when not to buy",
  ],
} as const;

export type ShippingOption = (typeof COMMERCE.shippingOptions)[number];
