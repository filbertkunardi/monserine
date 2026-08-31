import { NextRequest, NextResponse } from "next/server";
import { getCartId, setCartId } from "@/lib/cart";
import { getSession } from "@/lib/session";
import { decodeIdTokenEmail } from "@/lib/shopify/customerAccount";
import { addCartLine, createCart, getCart, removeCartLine, updateCartLine } from "@/lib/shopify/queries";

export async function GET() {
  const cartId = await getCartId();
  if (!cartId) {
    return NextResponse.json({ cart: null });
  }
  const cart = await getCart(cartId);
  return NextResponse.json({ cart });
}

export async function POST(req: NextRequest) {
  const { merchandiseId, quantity } = (await req.json()) as { merchandiseId: string; quantity: number };
  if (!merchandiseId || !quantity) {
    return NextResponse.json({ error: "merchandiseId and quantity are required" }, { status: 400 });
  }

  const cartId = await getCartId();
  let cart;
  if (cartId) {
    cart = await addCartLine(cartId, merchandiseId, quantity);
  } else {
    const session = await getSession();
    const email = session.idToken ? decodeIdTokenEmail(session.idToken) : null;
    cart = await createCart(merchandiseId, quantity, email ?? undefined);
  }

  await setCartId(cart.id);
  return NextResponse.json({ cart });
}

export async function PATCH(req: NextRequest) {
  const { lineId, quantity } = (await req.json()) as { lineId: string; quantity: number };
  const cartId = await getCartId();
  if (!cartId) {
    return NextResponse.json({ error: "No active cart" }, { status: 400 });
  }
  const cart = await updateCartLine(cartId, lineId, quantity);
  return NextResponse.json({ cart });
}

export async function DELETE(req: NextRequest) {
  const { lineId } = (await req.json()) as { lineId: string };
  const cartId = await getCartId();
  if (!cartId) {
    return NextResponse.json({ error: "No active cart" }, { status: 400 });
  }
  const cart = await removeCartLine(cartId, lineId);
  return NextResponse.json({ cart });
}
