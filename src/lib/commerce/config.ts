import { BRAND, RESEARCH_USE_LABEL } from "@/lib/brand";

/**
 * Store configuration. Everything a merchant would change lives here.
 */
export const COMMERCE = {
  /** Manufacturer list prices are in UAE dirhams; the store trades in the same currency. */
  currency: "AED" as const,
  locale: "en-AE",
  /** Home market — drives copy ("UAE orders"), domestic shipping and the default checkout country. */
  market: { countryCode: "AE", name: "United Arab Emirates", short: "UAE", timezone: "Gulf Standard Time" },
  /** Prices include VAT (UAE consumer pricing, 5%). */
  taxInclusive: true,
  vatRate: 0.05,
  /** Free standard shipping at or above this subtotal (minor units — fils). */
  freeShippingThreshold: 150000,
  shippingOptions: [
    { id: "standard", label: "Standard chilled courier", eta: "1–2 working days", price: 2500, regions: ["AE"] },
    { id: "express", label: "Same-day (Dubai & Abu Dhabi)", eta: "Order by 2 pm", price: 4500, regions: ["AE"] },
    { id: "gcc", label: "GCC chilled courier", eta: "2–4 working days", price: 9500, regions: ["SA", "QA", "KW", "BH", "OM"] },
    { id: "international", label: "International chilled courier", eta: "3–7 working days", price: 15000, regions: ["*"] },
  ],
  /** Demo promo codes — replace with your platform's discount engine. */
  promoCodes: {
    CHECKUP10: { type: "percent", value: 10, label: "10% off — Peptide Checkup completed" },
    FIRST15: { type: "percent", value: 15, label: "15% off your first order" },
    FREESHIP: { type: "shipping", value: 0, label: "Free standard shipping" },
  } as Record<string, { type: "percent" | "fixed" | "shipping"; value: number; label: string }>,
  /** Countries we ship to (ISO-2). "*" is handled by the international option. */
  shipTo: ["AE", "SA", "QA", "KW", "BH", "OM", "GB", "IE", "DE", "FR", "NL", "ES", "IT", "CH", "US", "CA", "AU", "NZ", "SG", "HK"],
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
    "The Peptide Checkup tells you when not to buy",
  ],
} as const;

export type ShippingOption = (typeof COMMERCE.shippingOptions)[number];
