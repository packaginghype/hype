"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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

export function ReviewsSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = REVIEWS.length;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, total]);

  const go = (next: number) => {
    setPaused(true);
    setIndex(((next % total) + total) % total);
    window.setTimeout(() => setPaused(false), 7000);
  };

  const review = REVIEWS[index];

  return (
    <section className="border-y border-[#E8EAEF] bg-[#F6F8FA] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
            Trusted by Growing Brands
          </p>
          <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
            What Our Customers Say
          </h2>
        </div>

        <div
          className="relative mx-auto mt-8 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="rounded-[8px] bg-white px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex items-center justify-center gap-1 text-[#FF5548]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
              ))}
            </div>
            <blockquote className="mt-5 text-center text-[15px] leading-relaxed text-[#444] sm:text-base">
              “{review.quote}”
            </blockquote>
            <div className="mt-6 text-center">
              <p className="text-sm font-bold text-[#172455]">{review.name}</p>
              <p className="mt-0.5 text-[12.5px] text-gray-500">{review.role}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => go(index - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-[#E2E4E8] bg-white text-[#172455] transition-colors hover:border-[#172455]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Reviews">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Review ${i + 1}`}
                  onClick={() => go(i)}
                  className="flex h-8 w-8 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block h-[3px] rounded-full transition-all",
                      i === index ? "w-7 bg-[#FF5548]" : "w-4 bg-[#D1D5DB]"
                    )}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Next review"
              onClick={() => go(index + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-[#E2E4E8] bg-white text-[#172455] transition-colors hover:border-[#172455]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
