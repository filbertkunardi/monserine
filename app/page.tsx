import { getProducts, type Product } from "@/lib/shopify/queries";
import Hero from "@/components/home/Hero";
import ProductRail from "@/components/home/ProductRail";
import CommunityRail from "@/components/home/CommunityRail";
import NewsletterForm from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";

async function loadJustArrived(): Promise<{ products: Product[]; error: string | null }> {
  try {
    const products = await getProducts({ first: 9, sortKey: "CREATED_AT", reverse: true });
    return { products, error: null };
  } catch (err) {
    console.error("Failed to load products from Shopify:", err);
    return {
      products: [],
      error:
        "Products could not be loaded. Add your Shopify credentials to .env.local (see .env.local.example) and restart the dev server.",
    };
  }
}

export default async function HomePage() {
  const { products, error } = await loadJustArrived();

  return (
    <main>
      <Hero />
      {error ? (
        <p className="px-[clamp(20px,5vw,56px)] py-10 text-center text-sm text-body">{error}</p>
      ) : (
        products.length > 0 && <ProductRail products={products} />
      )}
      <CommunityRail />
      <div className="flex flex-col items-center gap-4 bg-creamPanel px-[clamp(20px,5vw,56px)] py-14 pb-16 text-center">
        <div className="max-w-[340px] text-[13px] font-light leading-[1.6] text-body">
          Be the first to know about new arrivals and restocks.
        </div>
        <NewsletterForm width={280} />
      </div>
    </main>
  );
}
