"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { HOME_PAGE_DEFAULTS, type HomePageData } from "@/lib/home-page-schema";
import type { PublicCustomerReview } from "@/lib/customer-reviews";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function usePerPage() {
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setPerPage(1);
      else if (w < 1024) setPerPage(2);
      else setPerPage(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perPage;
}

export function ReviewsSlider({
  reviewsEyebrow = HOME_PAGE_DEFAULTS.reviewsEyebrow,
  reviewsHeading = HOME_PAGE_DEFAULTS.reviewsHeading,
  reviewsSubtext = HOME_PAGE_DEFAULTS.reviewsSubtext,
  reviews = [],
}: Partial<
  Pick<HomePageData, "reviewsEyebrow" | "reviewsHeading" | "reviewsSubtext">
> & { reviews?: PublicCustomerReview[] } = {}) {
  const list = (reviews || []).filter((r) => r.quote?.trim() && r.name?.trim());
  const perPage = usePerPage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const maxIndex = Math.max(0, list.length - perPage);
  const canSlide = list.length > perPage;

  useEffect(() => {
    setCurrentIndex((curr) => Math.min(curr, Math.max(0, list.length - perPage)));
  }, [perPage, list.length]);

  if (list.length === 0) return null;

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

  const trackWidth = list.length > perPage ? `${(list.length / perPage) * 100}%` : "100%";
  const itemWidth = list.length > perPage ? `${100 / list.length}%` : `${100 / perPage}%`;
  const transform = canSlide ? `translateX(-${(currentIndex * 100) / list.length}%)` : "none";

  return (
    <section className="border-y border-[#D5E8DC] bg-[#F3FAF6] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {reviewsEyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
                {reviewsEyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
              {reviewsHeading || "What Our Customers Say"}
            </h2>
            {reviewsSubtext ? (
              <p className="mt-2 text-[14px] leading-relaxed text-[#5B667A] sm:text-[15px]">
                {reviewsSubtext}
              </p>
            ) : null}
          </div>

          {canSlide ? (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous review"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#D5E8DC] bg-white text-[#172455] shadow-sm transition-colors hover:border-[#FF5548] hover:text-[#FF5548]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next review"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#D5E8DC] bg-white text-[#172455] shadow-sm transition-colors hover:border-[#FF5548] hover:text-[#FF5548]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="relative mt-9">
          <div
            className="overflow-hidden -mx-2 sm:-mx-2.5"
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
              {list.map((review, reviewIndex) => (
                <div
                  key={review.id || `${review.name}-${reviewIndex}`}
                  className="shrink-0 px-2 sm:px-2.5"
                  style={{ width: itemWidth }}
                >
                  <article className="flex h-full min-h-[280px] flex-col rounded-[14px] border border-[#DCEFE4] bg-white p-5 shadow-[0_10px_28px_-18px_rgba(23,36,85,0.28)] sm:min-h-[300px] sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-0.5 text-[#FF5548]">
                        {Array.from({ length: review.rating || 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-current"
                            aria-hidden
                          />
                        ))}
                      </div>
                      <Quote
                        className="h-5 w-5 text-[#21AAA5]/35"
                        aria-hidden
                      />
                    </div>

                    <blockquote className="mt-4 flex-1 text-[13.5px] leading-relaxed text-[#3F4A5E] sm:text-[14px]">
                      “{review.quote}”
                    </blockquote>

                    <div className="mt-5 flex items-center gap-3 border-t border-[#EEF3F0] pt-4">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF7F6] text-[12px] font-bold text-[#172455]"
                        aria-hidden
                      >
                        {initials(review.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#172455]">
                          {review.name}
                        </p>
                        <p className="truncate text-[12px] text-[#6B7280]">
                          {review.role}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        {canSlide ? (
          <div
            className="mt-7 flex items-center justify-center gap-1.5"
            role="tablist"
            aria-label="Review slides"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to review slide ${index + 1}`}
                onClick={() => goToIndex(index)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5548]/40"
              >
                <span
                  className={cn(
                    "block h-[3px] rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "w-8 bg-[#FF5548]"
                      : "w-5 bg-[#C5D4CC] hover:bg-[#9CA3AF]"
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
