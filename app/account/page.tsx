import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { refreshTokens } from "@/lib/shopify/customerAccount";
import { getCustomerWithOrders, type Customer, type Money } from "@/lib/shopify/customerQueries";
import { formatPrice } from "@/lib/format";

function money(m: Money | null | undefined): string | null {
  return m ? formatPrice(m.amount, m.currencyCode) : null;
}

export const dynamic = "force-dynamic";

async function loadCustomer(): Promise<{ customer: Customer | null; error: string | null }> {
  let session;
  try {
    session = await getSession();
  } catch (err) {
    console.error("Session unavailable:", err);
    return { customer: null, error: "SESSION_SECRET is not configured yet." };
  }

  if (!session.accessToken || !session.refreshToken) {
    return { customer: null, error: null };
  }

  try {
    if (session.expiresAt && Date.now() > session.expiresAt) {
      const tokens = await refreshTokens(session.refreshToken);
      session.accessToken = tokens.access_token;
      session.refreshToken = tokens.refresh_token;
      session.idToken = tokens.id_token;
      session.expiresAt = Date.now() + tokens.expires_in * 1000;
      await session.save();
    }

    const customer = await getCustomerWithOrders(session.accessToken);
    return { customer, error: null };
  } catch (err) {
    console.error("Failed to load customer/orders from Shopify:", err);
    session.destroy();
    return { customer: null, error: null };
  }
}

export default async function AccountPage() {
  const { customer, error } = await loadCustomer();

  return (
    <main className="mx-auto max-w-2xl px-[clamp(20px,5vw,56px)] py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-condensed text-2xl font-semibold uppercase tracking-[0.1em] text-dark">Account</h1>
        <Link href="/" className="text-sm text-dark">
          Back to shop
        </Link>
      </header>

      {error && <p className="mb-6 text-sm font-light text-body">{error}</p>}

      {!customer ? (
        <a
          href="/api/auth/login"
          className="inline-block bg-button px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-cream"
        >
          Log in with Shopify
        </a>
      ) : (
        <div>
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-dark">
              {customer.firstName ?? customer.emailAddress?.emailAddress ?? "Welcome back"}
            </p>
            <a href="/api/auth/logout" className="text-sm text-dark underline">
              Log out
            </a>
          </div>

          <h2 className="mb-4 font-condensed text-sm font-semibold uppercase tracking-[0.06em] text-dark">
            Order history
          </h2>
          {customer.orders.edges.length === 0 ? (
            <p className="text-sm font-light text-body">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {customer.orders.edges.map(({ node: order }) => {
                const tracking = order.fulfillments.edges
                  .flatMap(({ node: f }) => f.trackingInformation)
                  .find((t) => t.number || t.url);

                return (
                  <div key={order.id} className="border border-black/[0.08] p-4 text-sm">
                    <div className="flex items-center justify-between text-dark">
                      <span className="font-medium">{order.name}</span>
                      <span>{formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}</span>
                    </div>
                    <p className="mt-1 text-xs font-light text-body">
                      {new Date(order.processedAt).toLocaleDateString()} · {order.financialStatus ?? "N/A"} ·{" "}
                      {order.fulfillmentStatus ?? "N/A"}
                    </p>

                    <div className="mt-3 space-y-3">
                      {order.lineItems.edges.map(({ node: item }, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-14 w-11 flex-none overflow-hidden bg-creamPanel">
                            {item.image && (
                              <Image
                                src={item.image.url}
                                alt={item.image.altText ?? item.title}
                                width={88}
                                height={112}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 text-xs">
                            <p className="text-dark">{item.title}</p>
                            {item.variantTitle && <p className="font-light text-body">{item.variantTitle}</p>}
                            <p className="font-light text-body">Qty {item.quantity}</p>
                          </div>
                          {item.totalPrice && <span className="text-xs text-dark">{money(item.totalPrice)}</span>}
                        </div>
                      ))}
                    </div>

                    {tracking && (
                      <p className="mt-3 text-xs font-light text-body">
                        Tracking:{" "}
                        {tracking.url ? (
                          <a href={tracking.url} target="_blank" rel="noopener" className="underline">
                            {tracking.company ?? "Carrier"} {tracking.number ?? ""}
                          </a>
                        ) : (
                          `${tracking.company ?? "Carrier"} ${tracking.number ?? ""}`
                        )}
                      </p>
                    )}

                    <div className="mt-3 space-y-0.5 border-t border-black/[0.08] pt-3 text-xs text-body">
                      {money(order.subtotal) && (
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{money(order.subtotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{money(order.totalShipping)}</span>
                      </div>
                      {money(order.totalTax) && (
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{money(order.totalTax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium text-dark">
                        <span>Total</span>
                        <span>{money(order.totalPrice)}</span>
                      </div>
                    </div>

                    {order.shippingAddress && order.shippingAddress.formatted.length > 0 && (
                      <div className="mt-3 border-t border-black/[0.08] pt-3 text-xs font-light text-body">
                        <p className="mb-1 font-medium text-dark">Shipping address</p>
                        {order.shippingAddress.formatted.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    )}

                    <a
                      href={order.statusPageUrl}
                      target="_blank"
                      rel="noopener"
                      className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.05em] text-dark underline"
                    >
                      View full order details ↗
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
