// ICU/CLDR versions disagree on default fraction digits for some currencies
// (notably IDR, between Node's bundled ICU and browsers'), which causes SSR
// hydration mismatches. Force digits explicitly per currency instead of
// relying on Intl's default.
const ZERO_DECIMAL_CURRENCIES = new Set(["IDR", "JPY", "KRW", "VND"]);

export function formatPrice(amount: string | number, currencyCode: string): string {
  const digits = ZERO_DECIMAL_CURRENCIES.has(currencyCode) ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(amount));
}
