"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

const VISIBLE = 4;

export default function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const list = useMemo(() => images.filter(Boolean), [images]);
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(0);

  const maxPage = Math.max(0, Math.ceil(list.length / VISIBLE) - 1);
  const current = list[active] || list[0];
  const start = page * VISIBLE;
  const canPrev = page > 0;
  const canNext = page < maxPage;
  const showArrows = list.length > VISIBLE;

  useEffect(() => {
    if (list.length === 0) return;
    const nextPage = Math.floor(active / VISIBLE);
    setPage((prev) => (prev === nextPage ? prev : nextPage));
  }, [active, list.length]);

  return (
    <div className="space-y-4">
      <div className="group relative aspect-square overflow-hidden rounded-xl bg-[#F6F8FA]">
        <SafeImage
          src={current || "/images/designs/mailer-box.jpg"}
          alt={name}
          fallbackSrc="/images/designs/mailer-box.jpg"
          fill
          sizes="(max-width: 1024px) 100vw, 48vw"
          className="object-contain p-4 sm:p-6"
          priority
        />

        {list.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setActive((curr) => (curr - 1 + list.length) % list.length)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-[#172455] shadow-md transition-all hover:scale-105 hover:border-[#FF5548] hover:text-[#FF5548] focus:outline-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActive((curr) => (curr + 1) % list.length)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-[#172455] shadow-md transition-all hover:scale-105 hover:border-[#FF5548] hover:text-[#FF5548] focus:outline-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>

      {list.length > 0 ? (
        <div className="relative">
          {showArrows ? (
            <>
              <button
                type="button"
                aria-label="Previous images"
                disabled={!canPrev}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="absolute -left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#172455] shadow-sm transition enabled:hover:border-[#FF5548] enabled:hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30 sm:-left-3"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next images"
                disabled={!canNext}
                onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                className="absolute -right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#172455] shadow-sm transition enabled:hover:border-[#FF5548] enabled:hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30 sm:-right-3"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : null}

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {Array.from({ length: VISIBLE }).map((_, slot) => {
              const index = start + slot;
              const src = list[index];
              if (!src) {
                return (
                  <div
                    key={`empty-${slot}`}
                    className="aspect-square"
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
                  aria-current={active === index}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2 bg-[#F6F8FA] transition-colors",
                    active === index
                      ? "border-[#FF5548]"
                      : "border-[#E8EAEF] hover:border-[#FF5548]/50"
                  )}
                >
                  <SafeImage
                    src={src}
                    alt=""
                    fallbackSrc="/images/designs/mailer-box.jpg"
                    fill
                    sizes="140px"
                    className="object-contain p-2"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
