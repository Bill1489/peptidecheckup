import type { Jurisdiction } from "./types";

export interface CountryDef {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  jurisdiction: Jurisdiction;
  flag: string;
}

const EU_MEMBERS: [string, string, string][] = [
  ["AT", "Austria", "🇦🇹"], ["BE", "Belgium", "🇧🇪"], ["BG", "Bulgaria", "🇧🇬"], ["HR", "Croatia", "🇭🇷"],
  ["CY", "Cyprus", "🇨🇾"], ["CZ", "Czechia", "🇨🇿"], ["DK", "Denmark", "🇩🇰"], ["EE", "Estonia", "🇪🇪"],
  ["FI", "Finland", "🇫🇮"], ["FR", "France", "🇫🇷"], ["DE", "Germany", "🇩🇪"], ["GR", "Greece", "🇬🇷"],
  ["HU", "Hungary", "🇭🇺"], ["IE", "Ireland", "🇮🇪"], ["IT", "Italy", "🇮🇹"], ["LV", "Latvia", "🇱🇻"],
  ["LT", "Lithuania", "🇱🇹"], ["LU", "Luxembourg", "🇱🇺"], ["MT", "Malta", "🇲🇹"], ["NL", "Netherlands", "🇳🇱"],
  ["PL", "Poland", "🇵🇱"], ["PT", "Portugal", "🇵🇹"], ["RO", "Romania", "🇷🇴"], ["SK", "Slovakia", "🇸🇰"],
  ["SI", "Slovenia", "🇸🇮"], ["ES", "Spain", "🇪🇸"], ["SE", "Sweden", "🇸🇪"],
  // EEA / EMA-aligned
  ["NO", "Norway", "🇳🇴"], ["IS", "Iceland", "🇮🇸"], ["LI", "Liechtenstein", "🇱🇮"],
];

export const COUNTRIES: CountryDef[] = ([
  { code: "GB", name: "United Kingdom", jurisdiction: "UK", flag: "🇬🇧" },
  { code: "US", name: "United States", jurisdiction: "US", flag: "🇺🇸" },
  { code: "AU", name: "Australia", jurisdiction: "AU", flag: "🇦🇺" },
  { code: "CA", name: "Canada", jurisdiction: "CA", flag: "🇨🇦" },
  ...EU_MEMBERS.map(([code, name, flag]) => ({ code, name, flag, jurisdiction: "EU" as Jurisdiction })),
  { code: "CH", name: "Switzerland", jurisdiction: "OTHER", flag: "🇨🇭" },
  { code: "NZ", name: "New Zealand", jurisdiction: "OTHER", flag: "🇳🇿" },
  { code: "AE", name: "United Arab Emirates", jurisdiction: "OTHER", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", jurisdiction: "OTHER", flag: "🇸🇦" },
  { code: "SG", name: "Singapore", jurisdiction: "OTHER", flag: "🇸🇬" },
  { code: "HK", name: "Hong Kong", jurisdiction: "OTHER", flag: "🇭🇰" },
  { code: "JP", name: "Japan", jurisdiction: "OTHER", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", jurisdiction: "OTHER", flag: "🇰🇷" },
  { code: "IN", name: "India", jurisdiction: "OTHER", flag: "🇮🇳" },
  { code: "ZA", name: "South Africa", jurisdiction: "OTHER", flag: "🇿🇦" },
  { code: "BR", name: "Brazil", jurisdiction: "OTHER", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", jurisdiction: "OTHER", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", jurisdiction: "OTHER", flag: "🇦🇷" },
  { code: "TR", name: "Türkiye", jurisdiction: "OTHER", flag: "🇹🇷" },
  { code: "IL", name: "Israel", jurisdiction: "OTHER", flag: "🇮🇱" },
  { code: "TH", name: "Thailand", jurisdiction: "OTHER", flag: "🇹🇭" },
  { code: "PH", name: "Philippines", jurisdiction: "OTHER", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", jurisdiction: "OTHER", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", jurisdiction: "OTHER", flag: "🇲🇾" },
  { code: "NG", name: "Nigeria", jurisdiction: "OTHER", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", jurisdiction: "OTHER", flag: "🇰🇪" },
  { code: "EG", name: "Egypt", jurisdiction: "OTHER", flag: "🇪🇬" },
  { code: "CN", name: "China", jurisdiction: "OTHER", flag: "🇨🇳" },
  { code: "RU", name: "Russia", jurisdiction: "OTHER", flag: "🇷🇺" },
  { code: "UA", name: "Ukraine", jurisdiction: "OTHER", flag: "🇺🇦" },
  { code: "RS", name: "Serbia", jurisdiction: "OTHER", flag: "🇷🇸" },
  { code: "XX", name: "Other country", jurisdiction: "OTHER", flag: "🌍" },
] as CountryDef[]).sort((a, b) => {
  // Keep the big four at the top, then alphabetical, "Other" last
  const pin = ["GB", "US", "AU", "CA"];
  const ai = pin.indexOf(a.code);
  const bi = pin.indexOf(b.code);
  if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  if (a.code === "XX") return 1;
  if (b.code === "XX") return -1;
  return a.name.localeCompare(b.name);
});

export const COUNTRY_MAP: Record<string, CountryDef> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
);

export function jurisdictionForCountry(code?: string): Jurisdiction {
  if (!code) return "OTHER";
  return COUNTRY_MAP[code]?.jurisdiction ?? "OTHER";
}

export function searchCountries(query: string): CountryDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return COUNTRIES;
  return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q);
}
