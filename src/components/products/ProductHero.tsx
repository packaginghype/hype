"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryQuoteForm } from "@/components/categories/CategoryQuoteForm";
import { RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/utils";
import type { ProductItem } from "@/types";

const VISIBLE = 4;

type Crumb = { label: string; href?: string };

export default function ProductHero({
  product,
  startingFrom,
  breadcrumbs,
}: {
  product: ProductItem;
  startingFrom: string;
  breadcrumbs: Crumb[];
}) {
  const images = useMemo(() => {
    if (product.imageUrls && product.imageUrls.length > 0) return product.imageUrls;
    return product.imageUrl ? [product.imageUrl] : [];
  }, [product.imageUrl, product.imageUrls]);

  const [active, setActive] = useState(0);
  const [page, setPage] = useState(0);
  const leftRef = useRef<HTMLDivElement>(null);

  const current = images[active] || images[0];
  const maxPage = Math.max(0, Math.ceil(images.length / VISIBLE) - 1);
  const start = page * VISIBLE;
  const showArrows = images.length > VISIBLE;

  useEffect(() => {
    if (images.length === 0) return;
    const nextPage = Math.floor(active / VISIBLE);
    setPage((prev) => (prev === nextPage ? prev : nextPage));
  }, [active, images.length]);

  const prevImage = () => {
    setActive((curr) => (curr - 1 + images.length) % images.length);
  };
  const nextImage = () => {
    setActive((curr) => (curr + 1) % images.length);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
      {/* Left — breadcrumb → title → copy → form */}
      <div ref={leftRef} className="min-w-0">
        <Breadcrumbs variant="slash" items={breadcrumbs} />

        <h1 className="mt-4 text-[1.65rem] font-extrabold leading-tight tracking-tight text-[#111111] sm:mt-5 sm:text-[1.9rem] lg:text-[2.05rem]">
          {product.name}
        </h1>
        {product.description ? (
          <div className="mt-3 w-full text-[14px] leading-[1.65] text-[#333] sm:text-[14.5px] [&>p]:mb-2 [&>p:last-child]:mb-0">
            <RichText html={product.description} />
          </div>
        ) : null}

        <div id="product-quote" className="mt-5 scroll-mt-28 sm:mt-6">
          <CategoryQuoteForm
            productName={product.name}
            startingFrom={startingFrom}
            originalPrice={product.originalPrice ?? product.startingPrice}
            discountedPrice={product.discountedPrice}
            priceUnit={product.priceUnit || "per box"}
            inStock={product.inStock}
            fullWidthSubmit
            cartItem={{
              id: `product:${product.id}`,
              slug: product.slug,
              name: product.name,
              imageUrl: product.imageUrl,
              unitPrice: product.discountedPrice ?? product.startingPrice ?? null,
              href: `/product/${product.slug}`,
            }}
          />
        </div>
      </div>

      {/* Right — gallery: 1:1 square frame adhering to 900x900 admin specs */}
      <div className="min-w-0">
        <div className="group relative aspect-square w-full overflow-hidden rounded-[8px] sm:rounded-[10px] bg-[#F3F3F3]">
          <SafeImage
            src={current || ""}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-contain p-2 sm:p-4 transition-opacity duration-300"
            priority
          />

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-[#172455] shadow-md transition-all hover:scale-105 hover:border-[#FF5548] hover:text-[#FF5548] focus:outline-none"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-[#172455] shadow-md transition-all hover:scale-105 hover:border-[#FF5548] hover:text-[#FF5548] focus:outline-none"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div className="relative mt-3 sm:mt-3.5">
            {showArrows ? (
              <>
                <button
                  type="button"
                  aria-label="Previous images"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="absolute -left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#172455] shadow-md transition-all hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next images"
                  disabled={page >= maxPage}
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  className="absolute -right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#172455] shadow-md transition-all hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            ) : null}

            <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
              {images.slice(start, start + VISIBLE).map((src, i) => {
                const index = start + i;
                return (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`View image ${index + 1}`}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-[6px] sm:rounded-[8px] bg-[#F3F3F3] transition-all",
                      active === index
                        ? "border-2 border-[#FF5548] shadow-sm"
                        : "border border-[#E5E7EB] hover:border-[#cbd5e1]"
                    )}
                  >
                    <SafeImage
                      src={src}
                      alt=""
                      fill
                      sizes="140px"
                      className="object-contain p-1"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
