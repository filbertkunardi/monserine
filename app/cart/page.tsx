import Link from "next/link";
import { getCartId } from "@/lib/cart";
import { getCart } from "@/lib/shopify/queries";
import CartLineRow from "@/components/CartLineRow";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cartId = await getCartId();
  const cart = cartId ? await getCart(cartId) : null;
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];

  return (
    <main className="mx-auto max-w-2xl px-[clamp(20px,5vw,56px)] py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-condensed text-2xl font-semibold uppercase tracking-[0.1em] text-dark">Cart</h1>
        <Link href="/" className="text-sm text-dark">
          Continue shopping
        </Link>
      </header>

      {lines.length === 0 ? (
        <p className="text-sm font-light text-body">Your cart is empty.</p>
      ) : (
        <>
          <div>
            {lines.map((line) => (
              <CartLineRow key={line.id} line={line} />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between text-sm text-dark">
            <span>Total</span>
            <span>{formatPrice(cart!.cost.totalAmount.amount, cart!.cost.totalAmount.currencyCode)}</span>
          </div>
          <a
            href={cart!.checkoutUrl}
            className="mt-6 block w-full bg-dark py-3 text-center text-xs font-medium uppercase tracking-[0.08em] text-cream"
          >
            Checkout
          </a>
        </>
      )}
    </main>
  );
}
