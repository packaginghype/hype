"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryProductCard } from "@/components/categories/CategoryProductCard";
import type { ProductItem } from "@/types";

/** Number of cards visible at a time — responsive */
function usePerPage() {
  const [perPage, setPerPage] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setPerPage(2);
      else if (w < 1024) setPerPage(2);
      else setPerPage(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perPage;
}

export function RelatedProductsCarousel({
  products,
}: {
  products: ProductItem[];
}) {
  const perPage = usePerPage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const maxIndex = Math.max(0, products.length - perPage);
  const canSlide = products.length > perPage;

  // Clamp index when perPage changes on resize
  useEffect(() => {
    setCurrentIndex((curr) =>
      Math.min(curr, Math.max(0, products.length - perPage))
    );
  }, [perPage, products.length]);

  const goPrev = () =>
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const goNext = () =>
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
    setTouchStart(null);
  };

  // Same math as ReviewsSlider ↓
  const trackWidth = canSlide
    ? `${(products.length / perPage) * 100}%`
    : "100%";
  const itemWidth = canSlide
    ? `${100 / products.length}%`
    : `${100 / perPage}%`;
  const transform = canSlide
    ? `translateX(-${(currentIndex * 100) / products.length}%)`
    : "none";

  return (
    <div className="relative mt-8">
      {/* Overflow-hidden viewport */}
      <div
        className="overflow-hidden -mx-2 sm:-mx-3"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ width: trackWidth, transform }}
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="shrink-0 px-2 sm:px-3"
              style={{ width: itemWidth }}
            >
              <CategoryProductCard product={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows — only shown when there's more to slide */}
      {canSlide && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous products"
            className="absolute -left-4 top-[40%] z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5548] text-white shadow-lg transition-all hover:bg-[#e04337] sm:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next products"
            className="absolute -right-4 top-[40%] z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5548] text-white shadow-lg transition-all hover:bg-[#e04337] sm:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {canSlide && (
        <div className="mt-6 flex justify-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() =>
                setCurrentIndex(Math.min(Math.max(0, i), maxIndex))
              }
              aria-label={`Go to slide ${i + 1}`}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full focus:outline-none"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-8 bg-[#FF5548]"
                    : "w-5 bg-[#D1D5DB] hover:bg-[#9CA3AF]"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
