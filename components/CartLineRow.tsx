"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Cart } from "@/lib/shopify/queries";
import { formatPrice } from "@/lib/format";

type Line = Cart["lines"]["edges"][number]["node"];

export default function CartLineRow({ line }: { line: Line }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateQuantity(quantity: number) {
    startTransition(async () => {
      if (quantity <= 0) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineId: line.id }),
        });
      } else {
        await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineId: line.id, quantity }),
        });
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4 border-b border-black/[0.08] py-4">
      <div className="h-24 w-20 overflow-hidden bg-creamPanel">
        {line.merchandise.image && (
          <Image
            src={line.merchandise.image.url}
            alt={line.merchandise.image.altText ?? line.merchandise.product.title}
            width={160}
            height={192}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-dark">{line.merchandise.product.title}</p>
        <p className="text-xs font-light text-body">{line.merchandise.title}</p>
        <p className="mt-1 text-sm text-dark">
          {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={isPending}
          onClick={() => updateQuantity(line.quantity - 1)}
          className="h-7 w-7 border border-dark text-dark disabled:opacity-40"
        >
          -
        </button>
        <span className="w-6 text-center text-sm text-dark">{line.quantity}</span>
        <button
          disabled={isPending}
          onClick={() => updateQuantity(line.quantity + 1)}
          className="h-7 w-7 border border-dark text-dark disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
