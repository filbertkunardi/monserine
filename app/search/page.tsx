import Link from "next/link";
import { getProducts, type Product } from "@/lib/shopify/queries";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

async function loadResults(q: string): Promise<{ products: Product[]; error: string | null }> {
  try {
    const products = await getProducts({ query: q, first: 48 });
    return { products, error: null };
  } catch (err) {
    console.error("Failed to search products from Shopify:", err);
    return { products: [], error: "Search is unavailable right now. Please try again shortly." };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const { products, error } = query ? await loadResults(query) : { products: [], error: null };

  return (
    <main>
      <div className="px-[clamp(20px,5vw,56px)] pb-10 pt-[clamp(48px,8vw,72px)] text-center">
        <h1 className="m-0 font-condensed text-[clamp(32px,6vw,48px)] font-semibold text-dark">
          {query ? `RESULTS FOR "${query.toUpperCase()}"` : "SEARCH"}
        </h1>
      </div>
      <div className="px-[clamp(20px,5vw,56px)] pb-[88px]">
        {!query ? (
          <p className="text-center text-sm text-body">Enter a search term above to find products.</p>
        ) : error ? (
          <p className="text-center text-sm text-body">{error}</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-6 text-center">
            <p className="text-sm text-body">No products found.</p>
            <Link
              href="/shop"
              className="inline-block bg-button px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-cream"
            >
              Explore All Products
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </main>
  );
}
