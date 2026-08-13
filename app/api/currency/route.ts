import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COUNTRY_COOKIE, isValidCountry } from "@/lib/countries";
import { getCartId } from "@/lib/cart";
import { updateCartCountry } from "@/lib/shopify/queries";

export async function POST(req: NextRequest) {
  const { country } = (await req.json()) as { country?: string };

  if (!country || !isValidCountry(country)) {
    return NextResponse.json({ error: "Unsupported country" }, { status: 400 });
  }

  const store = await cookies();
  store.set(COUNTRY_COOKIE, country, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  const cartId = await getCartId();
  if (cartId) {
    try {
      await updateCartCountry(cartId, country);
    } catch (err) {
      console.error("Failed to update existing cart's currency:", err);
    }
  }

  return NextResponse.json({ country });
}
