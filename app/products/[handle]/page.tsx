import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/shopify/queries";
import ProductGallery from "@/components/product/ProductGallery";
import VariantSelector from "@/components/product/VariantSelector";
import BackButton from "@/components/product/BackButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);

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

      <div className="mx-auto grid max-w-[1200px] items-start gap-14 px-[clamp(20px,5vw,56px)] pb-[72px] pt-6 min-[761px]:grid-cols-2">
        <ProductGallery images={images} title={product.title} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="m-0 font-condensed text-[38px] font-semibold text-dark">{product.title.toUpperCase()}</h1>
          </div>

          <div className="text-sm font-light leading-[1.8] text-body">{product.description}</div>

          <VariantSelector options={product.options} variants={variants} />

          {product.sizeGuide.length > 1 && (
            <div className="flex flex-col gap-2.5 border-t border-black/[0.08] pt-5">
              <div className="font-condensed text-base font-semibold tracking-[0.02em] text-dark">SIZE GUIDE</div>
              <div
                className="grid gap-x-6 gap-y-2 text-[13px] font-light text-body"
                style={{ gridTemplateColumns: `repeat(${product.sizeGuide[0].length}, auto)` }}
              >
                {product.sizeGuide.map((row, i) =>
                  row.map((cell, j) => (
                    <div key={`${i}-${j}`} className={i === 0 ? "font-medium text-dark" : ""}>
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {product.fitDetails.length > 0 && (
            <div className="flex flex-col gap-2.5 border-t border-black/[0.08] pt-5">
              <div className="font-condensed text-base font-semibold tracking-[0.02em] text-dark">FIT DETAILS</div>
              <ul className="m-0 flex flex-col gap-1.5 pl-[18px]">
                {product.fitDetails.map((detail, i) => (
                  <li key={i} className="text-[13px] font-light leading-[1.6] text-body">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
