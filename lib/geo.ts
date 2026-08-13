import { cookies } from "next/headers";
import { COUNTRY_COOKIE, DEFAULT_COUNTRY, isValidCountry } from "@/lib/countries";

export async function getVisitorCountry(): Promise<string> {
  const store = await cookies();
  const value = store.get(COUNTRY_COOKIE)?.value;
  return value && isValidCountry(value) ? value : DEFAULT_COUNTRY;
}
