"use client";

import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { ProductItem } from "@/types";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SafeImage } from "@/components/ui/SafeImage";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-white border border-[#E7E7E7] rounded-[5px] overflow-hidden card-hover-effect">
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full aspect-square bg-[#F6F8FA] overflow-hidden flex items-center justify-center p-4 focus:outline-none"
        tabIndex={-1}
        aria-hidden="true"
      >
        <SafeImage
          src={product.imageUrl || ""}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4"
          loading="lazy"
        />

        <div className="absolute bottom-2 left-2 bg-[#172455]/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
          MOQ: {product.minQuantity} units
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <Link
          href={`/category/${product.categorySlug}`}
          className="text-[11px] font-bold text-[#21AAA5] uppercase tracking-wider hover:underline"
        >
          {product.categoryName}
        </Link>

        <h3 className="mt-1 text-base font-bold text-[#172455] hover:text-[#FF5548] transition-colors">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold uppercase text-gray-400">
              Pricing Model
            </span>
            <span className="text-xs font-bold text-[#172455]">
              {product.startingPrice
                ? `From $${product.startingPrice.toFixed(2)}/ea`
                : "Custom Quote"}
            </span>
          </div>

          <AddToCartButton
            item={{
              id: `product:${product.id}`,
              slug: product.slug,
              name: product.name,
              imageUrl: product.imageUrl,
              unitPrice: product.startingPrice ?? null,
              quantity: 1,
              href: `/product/${product.slug}`,
            }}
            label="Add"
            redirectToCart={false}
            className="shrink-0 px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
