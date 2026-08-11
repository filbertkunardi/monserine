import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/shopify/queries";
import ProductDetail from "@/components/product/ProductDetail";
import BackButton from "@/components/product/BackButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-[clamp(20px,5vw,56px)] pt-6 text-xs font-light text-accent">
        <BackButton />
        <div>
          <Link href="/shop" className="text-accent">
            Shop
          </Link>{" "}
          / {product.title}
        </div>
      </div>

      <ProductDetail product={product} />
    </main>
  );
}
