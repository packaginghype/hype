"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";
import type { CategoryItem } from "@/types";

type IndustryItem = CategoryItem & { label: string };

function usePerPage() {
  const [perPage, setPerPage] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setPerPage(1);
      else if (w < 768) setPerPage(2);
      else if (w < 1024) setPerPage(3);
      else setPerPage(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perPage;
}

export function IndustrySolutionsSection({ items }: { items: IndustryItem[] }) {
  const perPage = usePerPage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const maxIndex = Math.max(0, items.length - perPage);
  const canSlide = items.length > perPage;

  useEffect(() => {
    setCurrentIndex((curr) => Math.min(curr, Math.max(0, items.length - perPage)));
  }, [perPage, items.length]);

  if (!items.length) return null;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };
  const goNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };
  const goToIndex = (index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      goNext();
    } else if (diff < -50) {
      goPrev();
    }
    setTouchStart(null);
  };

  const trackWidth = items.length > perPage ? `${(items.length / perPage) * 100}%` : "100%";
  const itemWidth = items.length > perPage ? `${100 / items.length}%` : `${100 / perPage}%`;
  const transform = canSlide ? `translateX(-${(currentIndex * 100) / items.length}%)` : "none";

  return (
    <section className="relative bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-[#172455] sm:text-3xl lg:text-[2.35rem]">
              Packaging Solutions by Industry Needs
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
              From beauty and food to retail and e-commerce — explore custom
              packaging built for how your products ship, sell, and get unboxed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            <Link
              href="/industries"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] focus:outline-none"
            >
              View All Industries
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          {canSlide ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous industry"
                className="absolute -left-3 sm:-left-5 top-[38%] z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E2E4E8] bg-white/95 text-[#172455] shadow-lg transition-all hover:scale-105 hover:border-[#FF5548] hover:text-[#FF5548]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next industry"
                className="absolute -right-3 sm:-right-5 top-[38%] z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E2E4E8] bg-white/95 text-[#172455] shadow-lg transition-all hover:scale-105 hover:border-[#FF5548] hover:text-[#FF5548]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <div
            className="overflow-hidden -mx-2.5 sm:-mx-3"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                width: trackWidth,
                transform,
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 px-2.5 sm:px-3"
                  style={{ width: itemWidth }}
                >
                  <Link
                    href={`/industry/${item.slug}`}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5] focus-visible:ring-offset-2"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#F0EBE3]">
                      <SafeImage
                        src={item.imageUrl || ""}
                        alt={item.label}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-3 text-center text-sm font-semibold leading-snug text-[#172455] transition-colors group-hover:text-[#FF5548] sm:text-[15px]">
                      {item.label}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {canSlide ? (
          <div
            className="mt-8 flex items-center justify-center gap-1.5"
            role="tablist"
            aria-label="Industry slider pages"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToIndex(index)}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5548]/40"
              >
                <span
                  className={cn(
                    "block h-[3px] rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "w-8 bg-[#FF5548]"
                      : "w-5 bg-[#D1D5DB] hover:bg-[#9CA3AF]"
                  )}
                />
              </button>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
