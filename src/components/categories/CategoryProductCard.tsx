import React from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import type { ProductItem } from "@/types";

export function CategoryProductCard({ product }: { product: ProductItem }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square overflow-hidden bg-[#F6F8FA]">
        <SafeImage
          src={product.imageUrl || ""}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <p className="mt-3 text-center text-sm font-semibold leading-snug text-[#172455] transition-colors duration-200 group-hover:text-[#FF5548] sm:text-[15px]">
        {product.name}
      </p>
    </Link>
  );
}
