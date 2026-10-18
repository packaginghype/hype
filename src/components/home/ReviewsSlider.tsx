"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const REVIEWS = [
  {
    name: "Sarah Mitchell",
    role: "Founder, Glow Botanics",
    quote:
      "Our soap boxes looked premium and arrived on time. The team helped refine our dieline and the print quality exceeded expectations.",
  },
  {
    name: "James Carter",
    role: "Ops Lead, Northline Goods",
    quote:
      "Reliable mailers, clear communication, and free shipping made scaling our e-commerce packaging painless. We’ll reorder every quarter.",
  },
  {
    name: "Aisha Rahman",
    role: "Brand Manager, Candle & Co.",
    quote:
      "Rigid boxes with soft-touch finish elevated our unboxing. Design support was fast and the MOQ worked perfectly for a growing brand.",
  },
  {
    name: "Daniel Ortiz",
    role: "Owner, FreshBite Bakery",
    quote:
      "Custom bakery boxes held up in transit and looked sharp on the shelf. Pricing was competitive and turnaround stayed on schedule.",
  },
] as const;

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

export function ReviewsSlider() {
  const perPage = usePerPage();
  const pageCount = Math.max(1, Math.ceil(REVIEWS.length / perPage));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const goNext = () => setPage((p) => (p + 1) % pageCount);

  return (
    <section className="border-y border-[#D5E8DC] bg-[#F3FAF6] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
              Trusted by Growing Brands
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
              What Our Customers Say
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#5B667A] sm:text-[15px]">
              Real feedback from brands that ship with Packaging Hype.
            </p>
          </div>

          {pageCount > 1 ? (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous reviews"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#D5E8DC] bg-white text-[#172455] shadow-sm transition-colors hover:border-[#FF5548] hover:text-[#FF5548]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next reviews"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#D5E8DC] bg-white text-[#172455] shadow-sm transition-colors hover:border-[#FF5548] hover:text-[#FF5548]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="relative mt-9">
          {pageCount > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous reviews"
                className="absolute -left-3 sm:-left-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#D5E8DC] bg-white/95 text-[#172455] shadow-lg transition-all hover:scale-105 hover:border-[#FF5548] hover:text-[#FF5548]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next reviews"
                className="absolute -right-3 sm:-right-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#D5E8DC] bg-white/95 text-[#172455] shadow-lg transition-all hover:scale-105 hover:border-[#FF5548] hover:text-[#FF5548]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: pageCount }).map((_, pageIndex) => {
                const slideItems = REVIEWS.slice(
                  pageIndex * perPage,
                  pageIndex * perPage + perPage
                );

                return (
                  <div
                    key={pageIndex}
                    className="grid w-full shrink-0 gap-4 sm:gap-5"
                    style={{
                      gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))`,
                    }}
                  >
                    {slideItems.map((review) => (
                      <article
                        key={review.name}
                        className="flex h-full min-h-[280px] flex-col rounded-[14px] border border-[#DCEFE4] bg-white p-5 shadow-[0_10px_28px_-18px_rgba(23,36,85,0.28)] sm:min-h-[300px] sm:p-6"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-0.5 text-[#FF5548]">
                            {Array.from({ length: 5 }).map((_, i) => (
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
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {pageCount > 1 ? (
          <div
            className="mt-7 flex items-center justify-center gap-1.5"
            role="tablist"
            aria-label="Review slides"
          >
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === page}
                aria-label={`Go to review slide ${index + 1}`}
                onClick={() => setPage(index)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5548]/40"
              >
                <span
                  className={cn(
                    "block h-[3px] rounded-full transition-all duration-300",
                    index === page
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
