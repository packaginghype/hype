"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import type { RelatedBlogItem } from "@/types";

function usePerPage() {
  const [perPage, setPerPage] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setPerPage(1);
      else if (w < 1024) setPerPage(2);
      else setPerPage(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return perPage;
}

export function RelatedBlogsCarousel({ blogs }: { blogs: RelatedBlogItem[] }) {
  const perPage = usePerPage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const maxIndex = Math.max(0, blogs.length - perPage);
  const canSlide = blogs.length > perPage;

  useEffect(() => {
    setCurrentIndex((curr) => Math.min(curr, Math.max(0, blogs.length - perPage)));
  }, [perPage, blogs.length]);

  const goPrev = () => setCurrentIndex((p) => (p <= 0 ? maxIndex : p - 1));
  const goNext = () => setCurrentIndex((p) => (p >= maxIndex ? 0 : p + 1));

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
    setTouchStart(null);
  };

  // Same track/item width math as ReviewsSlider
  const trackWidth = canSlide ? `${(blogs.length / perPage) * 100}%` : "100%";
  const itemWidth = canSlide ? `${100 / blogs.length}%` : `${100 / perPage}%`;
  const transform = canSlide
    ? `translateX(-${(currentIndex * 100) / blogs.length}%)`
    : "none";

  return (
    <div className="relative mt-8">
      {/* Sliding viewport */}
      <div
        className="overflow-hidden -mx-2 sm:-mx-3"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ width: trackWidth, transform }}
        >
          {blogs.map((blog) => {
            const img =
              blog.thumbnailImageUrl ||
              blog.featuredImage ||
              "/images/blog-mailer-boxes.jpg";
            return (
              <div
                key={blog.id}
                className="shrink-0 px-2 sm:px-3"
                style={{ width: itemWidth }}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8EAEF] bg-white">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F3EF]"
                  >
                    <SafeImage
                      src={img}
                      alt={blog.title}
                      fallbackSrc="/images/blog-mailer-boxes.jpg"
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized={img.startsWith("http")}
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF5548]">
                      Guide
                    </p>
                    <h3 className="mt-1.5 text-[15px] font-bold leading-snug text-[#172455] transition-colors group-hover:text-[#FF5548]">
                      <Link href={`/blog/${blog.slug}`} className="focus:outline-none">
                        {blog.title}
                      </Link>
                    </h3>
                    {blog.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {blog.excerpt}
                      </p>
                    ) : null}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-[#172455] transition-colors hover:text-[#FF5548]"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      {canSlide && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous articles"
            className="absolute -left-4 top-[40%] z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5548] text-white shadow-lg transition-all hover:bg-[#e04337] sm:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next articles"
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
              onClick={() => setCurrentIndex(Math.min(Math.max(0, i), maxIndex))}
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

