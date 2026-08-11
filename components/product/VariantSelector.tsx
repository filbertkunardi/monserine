"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProductOption, ProductVariant } from "@/lib/shopify/queries";

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function defaultSelection(variants: ProductVariant[]): Record<string, string> {
  const variant = variants.find((v) => v.availableForSale) ?? variants[0];
  const selection: Record<string, string> = {};
  for (const opt of variant?.selectedOptions ?? []) selection[opt.name] = opt.value;
  return selection;
}

export default function VariantSelector({
  options,
  variants,
  onVariantChange,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  onVariantChange?: (variant: ProductVariant | undefined) => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, string>>(() => defaultSelection(variants));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const matchedVariant = useMemo(
    () => variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)),
    [variants, selected]
  );

  const initialVariant = useRef(matchedVariant);
  useEffect(() => {
    if (matchedVariant === initialVariant.current) return;
    onVariantChange?.(matchedVariant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedVariant]);

  const showSelector = !(options.length === 1 && options[0].name === "Title");

  function addToBag() {
    if (!matchedVariant) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId: matchedVariant.id, quantity: 1 }),
      });
      if (!res.ok) {
        setError("Could not add to bag");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-medium text-dark">
        {matchedVariant
          ? formatPrice(matchedVariant.price.amount, matchedVariant.price.currencyCode)
          : formatPrice(variants[0].price.amount, variants[0].price.currencyCode)}
      </div>

      {showSelector &&
        options.map((option) => (
          <div key={option.name} className="flex flex-col gap-2.5">
            <div className="text-xs font-semibold uppercase tracking-[0.06em] text-accent">{option.name}</div>
            <div className="flex flex-wrap gap-2.5">
              {option.values.map((value) => {
                const isSelected = selected[option.name] === value;
                return (
                  <button
                    key={value}
                    onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                    className={`border px-[18px] py-2.5 text-[13px] font-medium ${
                      isSelected ? "border-dark bg-dark text-cream" : "border-dark text-dark"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      <button
        onClick={addToBag}
        disabled={!matchedVariant || !matchedVariant.availableForSale || isPending}
        className="w-fit bg-dark px-8 py-4 text-xs font-medium uppercase tracking-[0.08em] text-cream disabled:cursor-not-allowed disabled:opacity-40"
      >
        {matchedVariant?.availableForSale === false ? "Sold Out" : isPending ? "Adding..." : "Add to Bag"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
