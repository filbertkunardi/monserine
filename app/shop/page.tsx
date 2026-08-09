import { getProducts, getProductsByCollection, type Product } from "@/lib/shopify/queries";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  tops: "Tops",
  dresses: "Dresses",
  "skirts-and-skorts": "Skirts and Skorts",
  sets: "Sets",
  outerwear: "Outerwear",
};

async function loadProducts(
  category?: string
): Promise<{ products: Product[]; error: string | null; missingCollection: boolean }> {
  try {
    if (category) {
      const products = await getProductsByCollection(category);
      if (products === null) return { products: [], error: null, missingCollection: true };
      return { products, error: null, missingCollection: false };
    }
    const products = await getProducts();
    return { products, error: null, missingCollection: false };
  } catch (err) {
    console.error("Failed to load products from Shopify:", err);
    return {
      products: [],
      error: "Products could not be loaded. Please check back shortly.",
      missingCollection: false,
    };
  }
}

export default async function ShopAllPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { products, error, missingCollection } = await loadProducts(category);
  const heading = category ? (CATEGORY_LABELS[category] ?? category).toUpperCase() : "SHOP ALL";

  return (
    <main>
      <div className="px-[clamp(20px,5vw,56px)] pb-10 pt-[clamp(48px,8vw,72px)] text-center">
        <h1 className="m-0 font-condensed text-[clamp(32px,6vw,48px)] font-semibold text-dark">{heading}</h1>
      </div>
      <div className="px-[clamp(20px,5vw,56px)] pb-[88px]">
        {error ? (
          <p className="text-center text-sm text-body">{error}</p>
        ) : missingCollection ? (
          <p className="text-center text-sm text-body">This category isn&apos;t set up yet. Check back soon.</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </main>
  );
}
