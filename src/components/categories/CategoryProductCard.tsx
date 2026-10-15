import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { ProductItem } from "@/types";

export function CategoryProductCard({ product }: { product: ProductItem }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5] focus-visible:ring-offset-2 rounded-xl"
    >
      <div className="overflow-hidden rounded-xl border border-[#E8EAEF] bg-white transition-[transform,box-shadow,border-color] duration-200 ease-out group-hover:-translate-y-1 group-hover:border-[#D5DAE3] group-hover:shadow-[0_10px_24px_-8px_rgba(23,36,85,0.14)]">
        <div className="relative aspect-square bg-[#F6F8FA]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <Package className="h-9 w-9" />
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-semibold leading-snug text-[#172455] transition-colors duration-200 group-hover:text-[#FF5548] sm:text-[15px]">
        {product.name}
      </p>
    </Link>
  );
}
