import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/queries";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;
  const images = product.images.edges.map((e) => e.node);
  const primaryImage = images[0] ?? product.featuredImage;
  const hoverImage = images[1];

  return (
    <Link href={`/products/${product.handle}`} className="flex flex-col gap-3 text-inherit">
      <div className="relative aspect-[3/4] overflow-hidden bg-creamPanel">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover object-top"
          />
        ) : null}
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt={hoverImage.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover object-top opacity-0 transition-opacity duration-300 hover:opacity-100"
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-medium text-dark">{product.title}</div>
        <div className="text-[13px] font-light text-accent">{formatPrice(price.amount, price.currencyCode)}</div>
      </div>
    </Link>
  );
}
