"use client";

import React from "react";
import Link from "next/link";
import { ProductItem } from "@/types";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SafeImage } from "@/components/ui/SafeImage";
import { CATALOG_TILE } from "@/components/ui/CatalogTile";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={`${CATALOG_TILE.shell} cursor-default`}>
      <Link
        href={`/product/${product.slug}`}
        className={`${CATALOG_TILE.media} focus:outline-none`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <SafeImage
          src={product.imageUrl || ""}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={CATALOG_TILE.mediaImage}
          loading="lazy"
        />

        <div className="absolute bottom-3 left-3 rounded bg-[#172455]/85 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
          MOQ: {product.minQuantity} units
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link
          href={`/category/${product.categorySlug}`}
          className="text-[11px] font-bold uppercase tracking-wider text-[#21AAA5] hover:underline"
        >
          {product.categoryName}
        </Link>

        <h3 className="mt-1 text-base font-bold text-[#172455] transition-colors hover:text-[#FF5548]">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex min-w-0 flex-col">
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
