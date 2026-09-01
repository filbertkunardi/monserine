import { NextResponse, type NextRequest } from "next/server";
import { COUNTRY_COOKIE, isValidCountry } from "@/lib/countries";

// Netlify's Next.js runtime populates `.geo` on the request at the edge;
// it isn't part of NextRequest's own type since Next.js 15 dropped it.
type NetlifyGeoRequest = NextRequest & { geo?: { country?: { code?: string } } };

// TEMPORARY: diagnosing why Netlify's geo detection isn't populating.
// Remove this debug header + the candidate-header block once resolved.
const CANDIDATE_GEO_HEADERS = [
  "x-nf-geo",
  "x-country",
  "x-country-code",
  "x-nf-client-connection-ip",
  "x-nf-request-id",
  "cf-ipcountry",
  "x-vercel-ip-country",
];

export function middleware(request: NextRequest) {
  const debugInfo = JSON.stringify({
    geo: (request as NetlifyGeoRequest).geo ?? null,
    headers: Object.fromEntries(
      CANDIDATE_GEO_HEADERS.map((h) => [h, request.headers.get(h)]).filter(([, v]) => v !== null)
    ),
  });

  if (request.cookies.get(COUNTRY_COOKIE)) {
    const res = NextResponse.next();
    res.headers.set("x-debug-geo", debugInfo);
    return res;
  }

  const detected = (request as NetlifyGeoRequest).geo?.country?.code;
  if (!detected || !isValidCountry(detected)) {
    const res = NextResponse.next();
    res.headers.set("x-debug-geo", debugInfo);
    return res;
  }

  request.cookies.set(COUNTRY_COOKIE, detected);
  const response = NextResponse.next({ request });
  response.cookies.set(COUNTRY_COOKIE, detected, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });
  response.headers.set("x-debug-geo", debugInfo);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
