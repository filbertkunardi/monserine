import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { buildLogoutUrl } from "@/lib/shopify/customerAccount";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const idToken = session.idToken;
  session.destroy();

  if (idToken) {
    const postLogoutRedirectUri = new URL("/", req.url).toString();
    return NextResponse.redirect(buildLogoutUrl(idToken, postLogoutRedirectUri));
  }

  return NextResponse.redirect(new URL("/", req.url));
}
