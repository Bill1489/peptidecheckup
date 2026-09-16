import { COMMERCE, type ShippingOption } from "@/lib/commerce/config";
import { COUNTRIES, type CountryDef } from "@/data/countries";

/** Countries we ship to, in the catalogue's display order (UK first, then alphabetical). */
export const SHIP_TO_COUNTRIES: CountryDef[] = COUNTRIES.filter((c) => (COMMERCE.shipTo as readonly string[]).includes(c.code));

export function canShipTo(countryCode: string): boolean {
  return (COMMERCE.shipTo as readonly string[]).includes(countryCode);
}

export function isDomestic(countryCode: string): boolean {
  return countryCode === "GB";
}

/**
 * Shipping options for a destination. Options list the regions they serve;
 * "*" is the catch-all used when nothing matches the country directly.
 */
export function shippingOptionsFor(countryCode: string): ShippingOption[] {
  const direct = COMMERCE.shippingOptions.filter((o) => (o.regions as readonly string[]).includes(countryCode));
  if (direct.length > 0) return direct;
  return COMMERCE.shippingOptions.filter((o) => (o.regions as readonly string[]).includes("*"));
}

/** The option to use: the chosen one if it serves the country, otherwise the first that does. */
export function resolveShippingOption(countryCode: string, chosenId: string): ShippingOption {
  const options = shippingOptionsFor(countryCode);
  return options.find((o) => o.id === chosenId) ?? options[0] ?? COMMERCE.shippingOptions[0];
}

export function getShippingOption(id: string): ShippingOption | undefined {
  return COMMERCE.shippingOptions.find((o) => o.id === id);
}

/** Countries with no postal-code system among the ones we ship to. */
export const NO_POSTCODE_COUNTRIES: readonly string[] = ["AE"];
