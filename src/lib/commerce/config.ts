import { BRAND, RESEARCH_USE_LABEL } from "@/lib/brand";

/**
 * Store configuration. Everything a merchant would change lives here.
 */
export const COMMERCE = {
  currency: "GBP" as const,
  locale: "en-GB",
  /** Prices include VAT (UK consumer pricing). */
  taxInclusive: true,
  vatRate: 0.2,
  /** Free standard shipping at or above this subtotal (minor units). */
  freeShippingThreshold: 15000,
  shippingOptions: [
    { id: "standard", label: "Standard tracked", eta: "2–3 working days", price: 495, regions: ["GB"] },
    { id: "express", label: "Next working day", eta: "Order by 2 pm", price: 895, regions: ["GB"] },
    { id: "international", label: "International tracked", eta: "5–10 working days", price: 1495, regions: ["*"] },
  ],
  /** Demo promo codes — replace with your platform's discount engine. */
  promoCodes: {
    CHECKUP10: { type: "percent", value: 10, label: "10% off — Peptide Checkup completed" },
    FIRST15: { type: "percent", value: 15, label: "15% off your first order" },
    FREESHIP: { type: "shipping", value: 0, label: "Free standard shipping" },
  } as Record<string, { type: "percent" | "fixed" | "shipping"; value: number; label: string }>,
  /** Countries we ship to (ISO-2). "*" is handled by the international option. */
  shipTo: ["GB", "IE", "DE", "FR", "NL", "ES", "IT", "SE", "DK", "AT", "BE", "PT", "PL", "US", "CA", "AU", "NZ", "AE"],
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
    "Ships chilled · same day before 2 pm (UK)",
    "18+ only · research use labelling",
    "The Peptide Checkup tells you when not to buy",
  ],
} as const;

export type ShippingOption = (typeof COMMERCE.shippingOptions)[number];
