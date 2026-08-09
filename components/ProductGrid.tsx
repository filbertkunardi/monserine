import type { Product } from "@/lib/shopify/queries";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-neutral-500">No products found.</p>;
  }

  return (
    <div
      className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-7"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
