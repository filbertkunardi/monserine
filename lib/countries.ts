export const COUNTRY_COOKIE = "monserine_country";
export const DEFAULT_COUNTRY = "ID";

// Countries enabled as Shopify Markets on this store, with the exact name
// Shopify's localization query returns (must match for customerAddressCreate's
// `country` field to be recognized) and that market's currency.
export const COUNTRIES: { code: string; name: string; currency: string }[] = [
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "BN", name: "Brunei", currency: "BND" },
  { code: "CZ", name: "Czechia", currency: "CZK" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "HK", name: "Hong Kong SAR", currency: "HKD" },
  { code: "ID", name: "Indonesia", currency: "IDR" },
  { code: "JP", name: "Japan", currency: "JPY" },
  { code: "KH", name: "Cambodia", currency: "KHR" },
  { code: "KR", name: "South Korea", currency: "KRW" },
  { code: "MY", name: "Malaysia", currency: "MYR" },
  { code: "NZ", name: "New Zealand", currency: "NZD" },
  { code: "PH", name: "Philippines", currency: "PHP" },
  { code: "SG", name: "Singapore", currency: "SGD" },
  { code: "TH", name: "Thailand", currency: "THB" },
  { code: "TW", name: "Taiwan", currency: "TWD" },
  { code: "US", name: "United States", currency: "USD" },
  { code: "VN", name: "Vietnam", currency: "VND" },
];

export const COUNTRY_NAMES: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.name])
);

const VALID_CODES = new Set(COUNTRIES.map((c) => c.code));

export function isValidCountry(code: string): boolean {
  return VALID_CODES.has(code);
}
