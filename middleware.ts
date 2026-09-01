import { NextResponse, type NextRequest } from "next/server";
import { COUNTRY_COOKIE, isValidCountry } from "@/lib/countries";

// Netlify's edge proxy sets this header directly on requests reaching
// middleware (the richer `x-nf-geo` JSON blob is only added later, when
// forwarding to the origin function, so middleware never sees it).
function detectCountry(request: NextRequest): string | undefined {
  return request.headers.get("x-country") ?? undefined;
}

export function middleware(request: NextRequest) {
  if (request.cookies.get(COUNTRY_COOKIE)) {
    return NextResponse.next();
  }

  const detected = detectCountry(request);
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
