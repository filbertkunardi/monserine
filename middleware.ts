import { NextResponse, type NextRequest } from "next/server";
import { COUNTRY_COOKIE, isValidCountry } from "@/lib/countries";

// Netlify's Next.js runtime populates `.geo` on the request at the edge;
// it isn't part of NextRequest's own type since Next.js 15 dropped it.
type NetlifyGeoRequest = NextRequest & { geo?: { country?: { code?: string } } };

export function middleware(request: NextRequest) {
  if (request.cookies.get(COUNTRY_COOKIE)) {
    return NextResponse.next();
  }

  const detected = (request as NetlifyGeoRequest).geo?.country?.code;
  if (!detected || !isValidCountry(detected)) {
    return NextResponse.next();
  }

  request.cookies.set(COUNTRY_COOKIE, detected);
  const response = NextResponse.next({ request });
  response.cookies.set(COUNTRY_COOKIE, detected, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
