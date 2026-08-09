import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildAuthorizeUrl, generatePkce, generateState } from "@/lib/shopify/customerAccount";

const SHORT_LIVED_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 600,
};

export async function GET() {
  const { verifier, challenge } = generatePkce();
  const state = generateState();

  const store = await cookies();
  store.set("monserine_pkce_verifier", verifier, SHORT_LIVED_COOKIE_OPTS);
  store.set("monserine_oauth_state", state, SHORT_LIVED_COOKIE_OPTS);

  const authorizeUrl = buildAuthorizeUrl({ state, codeChallenge: challenge });
  return NextResponse.redirect(authorizeUrl);
}
