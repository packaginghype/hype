"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryQuoteForm } from "@/components/categories/CategoryQuoteForm";
import { RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/utils";
import type { ProductItem } from "@/types";

const VISIBLE = 4;
const THUMB_GAP_PX = 6;
/** Whole lines only — never clip mid-glyph */
const DESC_LINE_CLAMP = "line-clamp-[9]";

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
  const [thumbOffset, setThumbOffset] = useState(0);
  const [thumbStep, setThumbStep] = useState(0);
  const [descOpen, setDescOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descTitleId = useId();

  const descRef = useRef<HTMLDivElement>(null);
  const thumbViewportRef = useRef<HTMLDivElement>(null);

  const maxThumbOffset = Math.max(0, images.length - VISIBLE);
  const showThumbArrows = images.length > VISIBLE;
  const thumbItemWidth = Math.max(0, thumbStep - THUMB_GAP_PX);

  useEffect(() => {
    if (images.length === 0) return;
    setThumbOffset((prev) => {
      if (active < prev) return active;
      if (active >= prev + VISIBLE) return active - VISIBLE + 1;
      return Math.min(prev, maxThumbOffset);
    });
  }, [active, images.length, maxThumbOffset]);

  useEffect(() => {
    const viewport = thumbViewportRef.current;
    if (!viewport) return;

    const measure = () => {
      const width = viewport.clientWidth;
      setThumbStep((width - (VISIBLE - 1) * THUMB_GAP_PX) / VISIBLE + THUMB_GAP_PX);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [images.length]);

  useEffect(() => {
    const check = () => {
      const inner = descRef.current;
      if (!inner) return;
      // Only show "See More" when there is genuinely hidden content
      // (a full line height ~24px minimum to avoid pixel-rounding false positives)
      setIsOverflowing(inner.scrollHeight - inner.clientHeight >= 40);
    };
    check();
    const id = requestAnimationFrame(check);
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", check);
    };
  }, [product.description]);

  useEffect(() => {
    if (!descOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDescOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [descOpen]);

  const prevImage = () => {
    setActive((curr) => (curr - 1 + images.length) % images.length);
  };
  const nextImage = () => {
    setActive((curr) => (curr + 1) % images.length);
  };

  const slideThumbs = (dir: -1 | 1) => {
    setThumbOffset((prev) => Math.min(maxThumbOffset, Math.max(0, prev + dir)));
  };

  return (
    <div>
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-3.5 xl:gap-4">
        {/* Left: title, longer description, quote form stretched to gallery bottom */}
        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <div>
            <Breadcrumbs variant="slash" items={breadcrumbs} />

            <h1 className="mt-2 text-left text-[1.65rem] font-extrabold leading-tight tracking-tight text-[#111111] sm:mt-4 sm:text-[1.9rem] lg:text-[2.05rem]">
              {product.name}
            </h1>

            {product.description ? (
              <div className="relative mt-2.5 shrink-0 sm:mt-3">
                <div
                  ref={descRef}
                  className={cn(
                    DESC_LINE_CLAMP,
                    "text-left text-[14px] leading-[1.7] text-[#444] sm:text-[14.5px]",
                    "[&_p]:mb-0 [&_p+p]:mt-[0.85em]"
                  )}
                >
                  <RichText html={product.description} />
                </div>

                {isOverflowing ? (
                  <button
                    type="button"
                    onClick={() => setDescOpen(true)}
                    className="absolute bottom-0 right-0 z-[1] cursor-pointer bg-white pl-1 text-[13px] font-semibold leading-[1.7] text-[#FF5548] before:absolute before:inset-y-0 before:right-full before:w-12 before:bg-gradient-to-r before:from-transparent before:to-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5548]/40"
                  >
                    … See More
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {descOpen && product.description ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
              <button
                type="button"
                aria-label="Close description"
                className="absolute inset-0 bg-[#0F1839]/55 backdrop-blur-[3px]"
                onClick={() => setDescOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={descTitleId}
                className="relative z-10 flex max-h-[min(78vh,640px)] w-full max-w-2xl flex-col overflow-hidden rounded-[14px] border border-white/20 bg-white shadow-[0_24px_80px_-20px_rgba(15,24,57,0.55)]"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#EEF1F6] px-5 py-4">
                  <h2
                    id={descTitleId}
                    className="text-lg font-extrabold leading-snug text-[#172455]"
                  >
                    {product.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setDescOpen(false)}
                    className="cursor-pointer rounded-md p-2 text-[#6B7280] transition-colors hover:bg-[#F6F8FA] hover:text-[#172455]"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="overflow-y-auto px-5 py-4 text-left text-[14.5px] leading-[1.75] text-[#444] [&>p]:mb-3 [&>p:last-child]:mb-0">
                  <RichText html={product.description} />
                </div>
              </div>
            </div>
          ) : null}

          <div
            id="product-quote"
            className="mt-4 scroll-mt-28 lg:mt-auto"
          >
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

        {/* Right: main image + thumbnails */}
        <div className="flex min-w-0 flex-col gap-1 sm:gap-1.5">
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-white sm:rounded-[10px]">
            {images.map((src, index) => (
              <div
                key={`${src}-main-${index}`}
                className={cn(
                  "absolute inset-0 transition-opacity duration-300 ease-out",
                  active === index ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                aria-hidden={active !== index}
              >
                <SafeImage
                  src={src}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-contain object-center"
                  priority={index === 0}
                />
              </div>
            ))}

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
            <div className="relative min-w-0 shrink-0">
              {showThumbArrows ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous thumbnail"
                    disabled={thumbOffset <= 0}
                    onClick={() => slideThumbs(-1)}
                    className="absolute -left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#172455] shadow-md transition-all hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next thumbnail"
                    disabled={thumbOffset >= maxThumbOffset}
                    onClick={() => slideThumbs(1)}
                    className="absolute -right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#172455] shadow-md transition-all hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              ) : null}

              <div ref={thumbViewportRef} className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-out will-change-transform"
                  style={{
                    gap: `${THUMB_GAP_PX}px`,
                    transform: `translate3d(-${thumbOffset * thumbStep}px, 0, 0)`,
                  }}
                >
                  {images.map((src, index) => (
                    <button
                      key={`${src}-thumb-${index}`}
                      type="button"
                      onClick={() => setActive(index)}
                      aria-label={`View image ${index + 1}`}
                      className={cn(
                        "relative aspect-[4/3] shrink-0 overflow-hidden rounded-[6px] bg-white transition-[border-color,box-shadow] duration-200 sm:rounded-[8px]",
                        active === index
                          ? "border-2 border-[#FF5548] shadow-sm"
                          : "border border-[#E5E7EB] hover:border-[#cbd5e1]"
                      )}
                      style={{
                        width: thumbItemWidth
                          ? `${thumbItemWidth}px`
                          : `calc((100% - ${(VISIBLE - 1) * THUMB_GAP_PX}px) / ${VISIBLE})`,
                      }}
                    >
                      <SafeImage
                        src={src}
                        alt=""
                        fill
                        sizes="140px"
                        className="object-contain object-center"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
