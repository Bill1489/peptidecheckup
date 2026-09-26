import { COMMERCE, type ShippingOption } from "@/lib/commerce/config";
import { COUNTRIES, COUNTRY_MAP, type CountryDef } from "@/data/countries";

const MARKET = COMMERCE.market.countryCode;

/** Regions served by a dedicated (non catch-all) option other than the home market — the GCC courier's countries. */
const REGIONAL_CODES: readonly string[] = COMMERCE.shippingOptions.flatMap((o) => (o.regions as readonly string[]).filter((r) => r !== "*" && r !== MARKET));

/**
 * Ship-to destinations the country catalogue does not yet carry (it is built
 * around the assessment's regulatory jurisdictions). Named here so the
 * checkout select and the shipping page never show a bare ISO code.
 */
const EXTRA_COUNTRIES: Record<string, CountryDef> = {
  QA: { code: "QA", name: "Qatar", jurisdiction: "OTHER", flag: "🇶🇦" },
  KW: { code: "KW", name: "Kuwait", jurisdiction: "OTHER", flag: "🇰🇼" },
  BH: { code: "BH", name: "Bahrain", jurisdiction: "OTHER", flag: "🇧🇭" },
  OM: { code: "OM", name: "Oman", jurisdiction: "OTHER", flag: "🇴🇲" },
};

/** Country record for a ship-to code, from the catalogue or the local fallback. */
export function shipToCountry(code: string): CountryDef | undefined {
  return COUNTRY_MAP[code] ?? EXTRA_COUNTRIES[code];
}

/** Display name for a ship-to code; the code itself when unknown. */
export function shipToCountryName(code: string): string {
  return shipToCountry(code)?.name ?? code;
}

/**
 * Countries we ship to: the home market first, then the countries a regional
 * courier serves, then everywhere else in the catalogue's order.
 */
export const SHIP_TO_COUNTRIES: CountryDef[] = (COMMERCE.shipTo as readonly string[])
  .map((code) => shipToCountry(code))
  .filter((c): c is CountryDef => c !== undefined)
  .sort((a, b) => rank(a.code) - rank(b.code) || COUNTRIES.indexOf(a) - COUNTRIES.indexOf(b));

function rank(code: string): number {
  if (code === MARKET) return 0;
  const regional = REGIONAL_CODES.indexOf(code);
  if (regional !== -1) return 1 + regional;
  return 100;
}

export function canShipTo(countryCode: string): boolean {
  return (COMMERCE.shipTo as readonly string[]).includes(countryCode);
}

/** The home market — same-day and standard couriers, free standard delivery over the threshold. */
export function isDomestic(countryCode: string): boolean {
  return countryCode === MARKET;
}

/** A country served by a regional (non catch-all) courier other than the home market's. */
export function isRegional(countryCode: string): boolean {
  return REGIONAL_CODES.includes(countryCode);
}

/** "United Arab Emirates" · "GCC" · "International" — the delivery zone shown next to the method list. */
export function zoneLabel(countryCode: string): string {
  if (isDomestic(countryCode)) return COMMERCE.market.name;
  if (isRegional(countryCode)) {
    const option = COMMERCE.shippingOptions.find((o) => (o.regions as readonly string[]).includes(countryCode));
    return option?.id.toUpperCase() ?? "Regional";
  }
  return "International";
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
export const NO_POSTCODE_COUNTRIES: readonly string[] = ["AE", "HK"];
