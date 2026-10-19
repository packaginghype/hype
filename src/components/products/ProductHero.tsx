"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryQuoteForm } from "@/components/categories/CategoryQuoteForm";
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
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  const current = images[active] || images[0];
  const maxPage = Math.max(0, Math.ceil(images.length / VISIBLE) - 1);
  const start = page * VISIBLE;
  const showArrows = images.length > VISIBLE;
  const visibleCount = Math.min(VISIBLE, Math.max(images.length, 1));

  useEffect(() => {
    if (images.length === 0) return;
    const nextPage = Math.floor(active / VISIBLE);
    setPage((prev) => (prev === nextPage ? prev : nextPage));
  }, [active, images.length]);

  // Gallery top = breadcrumb top; gallery image bottom = Get A Quote bottom
  useLayoutEffect(() => {
    const left = leftRef.current;
    if (!left) return;

    const sync = () => {
      if (window.matchMedia("(min-width: 1024px)").matches === false) {
        setImageHeight(null);
        return;
      }
      const btn = left.querySelector<HTMLElement>("[data-quote-submit]");
      const top = left.getBoundingClientRect().top;
      const bottom = (btn ?? left).getBoundingClientRect().bottom;
      setImageHeight(Math.max(280, Math.round(bottom - top)));
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(left);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

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
          <p className="mt-3 w-full text-[14px] leading-[1.65] text-[#333] sm:text-[14.5px]">
            {product.description}
          </p>
        ) : null}

        <div id="product-quote" className="mt-5 scroll-mt-28 sm:mt-6">
          <CategoryQuoteForm
            productName={product.name}
            startingFrom={startingFrom}
            fullWidthSubmit
            cartItem={{
              id: `product:${product.id}`,
              slug: product.slug,
              name: product.name,
              imageUrl: product.imageUrl,
              unitPrice: product.startingPrice ?? null,
              href: `/products/${product.slug}`,
            }}
          />
        </div>
      </div>

      {/* Right — gallery starts with breadcrumb; no image padding; flush thumbs */}
      <div className="min-w-0">
        <div
          className="group relative min-h-[280px] overflow-hidden bg-[#F3F3F3] lg:min-h-[500px]"
          style={imageHeight ? { height: imageHeight } : undefined}
        >
          <SafeImage
            src={current || ""}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-contain p-4 sm:p-6 transition-opacity duration-300"
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

        {images.length > 0 ? (
          <div className="relative">
            {showArrows ? (
              <>
                <button
                  type="button"
                  aria-label="Previous images"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="absolute left-1 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/90 text-[#172455] shadow enabled:hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next images"
                  disabled={page >= maxPage}
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  className="absolute right-1 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/90 text-[#172455] shadow enabled:hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            ) : null}

            <div className="grid grid-cols-4 gap-0">
              {Array.from({ length: visibleCount }).map((_, slot) => {
                const index = start + slot;
                const src = images[index];
                if (!src) {
                  return (
                    <div
                      key={`empty-${slot}`}
                      className="aspect-square bg-[#F3F3F3]"
                      aria-hidden
                    />
                  );
                }
                return (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`View image ${index + 1}`}
                    className={cn(
                      "relative aspect-square overflow-hidden bg-[#F3F3F3]",
                      active === index ? "ring-2 ring-inset ring-[#FF5548]" : ""
                    )}
                  >
                    <SafeImage
                      src={src}
                      alt=""
                      fill
                      sizes="160px"
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
