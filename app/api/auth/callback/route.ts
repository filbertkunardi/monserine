import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeIdTokenEmail, exchangeCodeForTokens } from "@/lib/shopify/customerAccount";
import { getSession } from "@/lib/session";
import { getCartId } from "@/lib/cart";
import { updateCartEmail } from "@/lib/shopify/queries";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const store = await cookies();
  const verifier = store.get("monserine_pkce_verifier")?.value;
  const expectedState = store.get("monserine_oauth_state")?.value;
  store.delete("monserine_pkce_verifier");
  store.delete("monserine_oauth_state");

  if (!code || !verifier || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/account?error=auth_failed", req.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code, verifier);

    const session = await getSession();
    session.accessToken = tokens.access_token;
    session.refreshToken = tokens.refresh_token;
    session.idToken = tokens.id_token;
    session.expiresAt = Date.now() + tokens.expires_in * 1000;
    await session.save();

    const cartId = await getCartId();
    const email = decodeIdTokenEmail(tokens.id_token);
    if (cartId && email) {
      try {
        await updateCartEmail(cartId, email);
      } catch (err) {
        console.error("Failed to sync buyer email to existing cart:", err);
      }
    }
  } catch (err) {
    console.error("Shopify customer account token exchange failed:", err);
    return NextResponse.redirect(new URL("/account?error=auth_failed", req.url));
  }

  return NextResponse.redirect(new URL("/account", req.url));
}
