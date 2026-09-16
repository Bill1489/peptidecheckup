import type { CheckoutAcknowledgements, CheckoutAddress, CheckoutContact } from "@/lib/commerce/checkout-store";
import { cardNumberValid, cvcValid, expiryValid, type CardDetails } from "./card-format";
import { NO_POSTCODE_COUNTRIES, canShipTo } from "./shipping-options";

/** Field → message. An empty object means valid. */
export type Errors<K extends string> = Partial<Record<K, string>>;

export const hasErrors = (errors: object) => Object.keys(errors).length > 0;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

export type ContactField = "email" | "name" | "phone";

export function validateContact(c: CheckoutContact): Errors<ContactField> {
  const errors: Errors<ContactField> = {};
  const email = c.email.trim();
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address, e.g. name@example.com.";
  if (c.name.trim().length < 2) errors.name = "Enter your full name.";
  const phone = c.phone.trim();
  if (phone && !PHONE_RE.test(phone)) errors.phone = "Enter a valid phone number, or leave it blank.";
  return errors;
}

export type AddressField = "line1" | "city" | "postcode" | "countryCode";

export function validateAddress(a: CheckoutAddress): Errors<AddressField> {
  const errors: Errors<AddressField> = {};
  if (!a.countryCode || !canShipTo(a.countryCode)) errors.countryCode = "Choose a country we ship to.";
  if (a.line1.trim().length < 3) errors.line1 = "Enter the first line of the address.";
  if (a.city.trim().length < 2) errors.city = "Enter the town or city.";
  const postcode = a.postcode.trim();
  const postcodeOptional = NO_POSTCODE_COUNTRIES.includes(a.countryCode);
  if (!postcodeOptional) {
    if (!postcode) errors.postcode = a.countryCode === "GB" ? "Enter the postcode." : "Enter the postal code.";
    else if (a.countryCode === "GB" && !UK_POSTCODE_RE.test(postcode)) errors.postcode = "Enter a valid UK postcode, e.g. EC1A 1BB.";
    else if (postcode.length < 3) errors.postcode = "Enter a valid postal code.";
  }
  return errors;
}

export type CardField = "name" | "number" | "expiry" | "cvc";

export function validateCard(card: CardDetails): Errors<CardField> {
  const errors: Errors<CardField> = {};
  if (card.name.trim().length < 2) errors.name = "Enter the name on the card.";
  if (!cardNumberValid(card.number)) errors.number = "Enter a card number of 13 to 19 digits.";
  if (!expiryValid(card.expiry)) errors.expiry = "Enter a valid expiry date (MM / YY) in the future.";
  if (!cvcValid(card.cvc)) errors.cvc = "Enter the 3 or 4 digit security code.";
  return errors;
}

export type AckField = "age18" | "researchUse" | "terms";

export function validateAcknowledgements(
  acks: CheckoutAcknowledgements,
  opts: { requireAge: boolean; requireResearch: boolean },
): Errors<AckField> {
  const errors: Errors<AckField> = {};
  if (opts.requireAge && !acks.age18) errors.age18 = "You must confirm you are 18 or over.";
  if (opts.requireResearch && !acks.researchUse) errors.researchUse = "You must acknowledge the research-use terms for the research products in this order.";
  if (!acks.terms) errors.terms = "You must accept the terms of sale to place the order.";
  return errors;
}
