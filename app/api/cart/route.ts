import { NextRequest, NextResponse } from "next/server";
import { getCartId, setCartId } from "@/lib/cart";
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
  const cart = cartId
    ? await addCartLine(cartId, merchandiseId, quantity)
    : await createCart(merchandiseId, quantity);

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
