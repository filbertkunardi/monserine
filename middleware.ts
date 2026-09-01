import { NextResponse, type NextRequest } from "next/server";
import { COUNTRY_COOKIE, isValidCountry } from "@/lib/countries";

// Netlify's edge proxy sends geolocation as a base64-encoded JSON header,
// not as `.geo` on the request object (that's never populated in practice).
type NetlifyGeo = { country?: { code?: string } };

function detectCountry(request: NextRequest): string | undefined {
  const raw = request.headers.get("x-nf-geo");
  if (!raw) return undefined;
  try {
    const geo = JSON.parse(atob(raw)) as NetlifyGeo;
    return geo.country?.code;
  } catch {
    return undefined;
  }
}

export function middleware(request: NextRequest) {
  // TEMPORARY diagnostics
  const raw = request.headers.get("x-nf-geo");
  let decoded: unknown = null;
  let decodeError: string | null = null;
  try {
    decoded = raw ? JSON.parse(atob(raw)) : null;
  } catch (e) {
    decodeError = String(e);
  }
  const debugInfo = JSON.stringify({
    hasCookie: !!request.cookies.get(COUNTRY_COOKIE),
    rawPresent: !!raw,
    decoded,
    decodeError,
  });

  if (request.cookies.get(COUNTRY_COOKIE)) {
    const res = NextResponse.next();
    res.headers.set("x-debug-geo2", debugInfo);
    return res;
  }

  const detected = detectCountry(request);
  if (!detected || !isValidCountry(detected)) {
    const res = NextResponse.next();
    res.headers.set("x-debug-geo2", debugInfo);
    return res;
  }

  request.cookies.set(COUNTRY_COOKIE, detected);
  const response = NextResponse.next({ request });
  response.cookies.set(COUNTRY_COOKIE, detected, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });
  response.headers.set("x-debug-geo2", debugInfo);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
