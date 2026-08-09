import Link from "next/link";
import { getSession } from "@/lib/session";
import { refreshTokens } from "@/lib/shopify/customerAccount";
import { getCustomerWithOrders, type Customer } from "@/lib/shopify/customerQueries";

export const dynamic = "force-dynamic";

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

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
          className="inline-block bg-dark px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-cream"
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
              {customer.orders.edges.map(({ node: order }) => (
                <div key={order.id} className="border border-black/[0.08] p-4 text-sm">
                  <div className="flex items-center justify-between text-dark">
                    <span className="font-medium">{order.name}</span>
                    <span>{formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}</span>
                  </div>
                  <p className="mt-1 text-xs font-light text-body">
                    {new Date(order.processedAt).toLocaleDateString()} · {order.financialStatus ?? "N/A"} ·{" "}
                    {order.fulfillmentStatus ?? "N/A"}
                  </p>
                  <ul className="mt-2 text-xs font-light text-body">
                    {order.lineItems.edges.map(({ node: item }, i) => (
                      <li key={i}>
                        {item.quantity} × {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
