"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
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
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    if (paused || pageCount <= 1) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const id = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount);
    }, 4500);

    return () => window.clearInterval(id);
  }, [paused, pageCount]);

  if (!items.length) return null;

  const goToPage = (index: number) => {
    setPaused(true);
    setPage(((index % pageCount) + pageCount) % pageCount);
    window.setTimeout(() => setPaused(false), 6000);
  };

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-[2.35rem] font-extrabold tracking-tight text-[#172455] leading-tight">
              Packaging Solutions by Industry Needs
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl">
              From beauty and food to retail and e-commerce — explore custom packaging built for
              how your products ship, sell, and get unboxed.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 self-start lg:self-center rounded-[4px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] focus:outline-none"
          >
            View All Industries
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {Array.from({ length: pageCount }).map((_, pageIndex) => {
              const slideItems = items.slice(
                pageIndex * perPage,
                pageIndex * perPage + perPage
              );

              return (
                <div
                  key={pageIndex}
                  className="grid w-full shrink-0 gap-5 sm:gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))`,
                  }}
                >
                  {slideItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/categories/${item.slug}`}
                      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5] focus-visible:ring-offset-2"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#F0EBE3]">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.label}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover object-center"
                          />
                        ) : null}
                      </div>
                      <p className="mt-3 text-center text-sm font-semibold leading-snug text-[#172455] transition-colors group-hover:text-[#FF5548] sm:text-[15px]">
                        {item.label}
                      </p>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="mt-8 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Industry slider pages"
        >
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === page}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToPage(index)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5548]/40"
            >
              <span
                className={cn(
                  "block h-[3px] rounded-full transition-all duration-300",
                  index === page
                    ? "w-8 bg-[#FF5548]"
                    : "w-5 bg-[#D1D5DB] hover:bg-[#9CA3AF]"
                )}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
