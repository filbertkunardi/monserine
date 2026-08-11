"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/queries";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "prev" ? "Scroll left" : "Scroll right"}
      className={`absolute top-[calc(50%-44px)] ${
        direction === "prev" ? "-left-5" : "-right-5"
      } flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-cream shadow-[0_4px_12px_rgba(0,0,0,0.08)]`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="2">
        {direction === "prev" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

export default function ProductRail({ products }: { products: Product[] }) {
  const scroll = useHorizontalScroll<HTMLDivElement>();

  return (
    <div className="px-[clamp(20px,5vw,56px)] pb-16 pt-[clamp(48px,8vw,80px)]">
      <div className="mb-11 flex flex-col items-center gap-0.5 text-center">
        <div className="font-display text-xl font-medium uppercase tracking-[0.14em] text-black">Just Arrived</div>
        <h2 className="-mt-2.5 font-script text-4xl font-normal leading-none tracking-normal text-dark lowercase">
          explore our newest arrivals
        </h2>
      </div>

      <div className="relative">
        <div
          ref={scroll.ref}
          onMouseDown={scroll.onDragStart}
          onMouseMove={scroll.onDragMove}
          onMouseUp={scroll.onDragEnd}
          onMouseLeave={scroll.onDragEnd}
          onScroll={scroll.onScroll}
          className={`scroll-hide flex select-none gap-7 overflow-x-auto ${scroll.dragCursor}`}
        >
          {products.map((product) => {
            const price = product.priceRange.minVariantPrice;
            const images = product.images.edges.map((e) => e.node);
            const primaryImage = images[0] ?? product.featuredImage;
            const hoverImage = images[1];
            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                draggable={false}
                onClick={scroll.onLinkClick}
                className="flex flex-none flex-col gap-3 text-inherit"
                style={{ flexBasis: "min(260px, 78vw)" }}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-creamPanel">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.altText ?? product.title}
                      fill
                      sizes="260px"
                      className="object-cover object-top"
                    />
                  )}
                  {hoverImage && (
                    <Image
                      src={hoverImage.url}
                      alt={hoverImage.altText ?? product.title}
                      fill
                      sizes="260px"
                      className="object-cover object-top opacity-0 transition-opacity duration-300 hover:opacity-100"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-sm font-medium text-dark">{product.title}</div>
                  <div className="text-[13px] font-light text-accent">
                    {formatPrice(price.amount, price.currencyCode)}
                  </div>
                </div>
              </Link>
            );
          })}
          <Link
            href="/shop"
            draggable={false}
            className="flex flex-none flex-col items-center justify-center gap-2.5 self-start bg-[#F3EFE9] text-center text-inherit"
            style={{ flexBasis: "min(260px, 78vw)", aspectRatio: "3/4" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2B2926" strokeWidth="1.8">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
            <div className="font-condensed text-[15px] font-semibold uppercase tracking-[0.06em] text-dark">
              Browse All
            </div>
          </Link>
        </div>
        {scroll.showPrev && <ArrowButton direction="prev" onClick={scroll.scrollPrev} />}
        {scroll.showNext && <ArrowButton direction="next" onClick={scroll.scrollNext} />}
      </div>
    </div>
  );
}
