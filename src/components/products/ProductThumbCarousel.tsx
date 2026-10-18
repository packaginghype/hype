"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

const VISIBLE = 4;

type Props = {
  images: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function ProductThumbCarousel({
  images,
  activeIndex,
  onSelect,
}: Props) {
  const list = useMemo(() => images.filter(Boolean), [images]);
  const [page, setPage] = useState(0);
  const maxPage = Math.max(0, Math.ceil(list.length / VISIBLE) - 1);
  const start = page * VISIBLE;
  const showArrows = list.length > VISIBLE;

  useEffect(() => {
    if (list.length === 0) return;
    const nextPage = Math.floor(activeIndex / VISIBLE);
    setPage((prev) => (prev === nextPage ? prev : nextPage));
  }, [activeIndex, list.length]);

  if (list.length === 0) return null;

  return (
    <div className="relative px-1 sm:px-2">
      {showArrows ? (
        <>
          <button
            type="button"
            aria-label="Previous images"
            disabled={page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#172455] shadow-sm transition enabled:hover:border-[#FF5548] enabled:hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next images"
            disabled={page >= maxPage}
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#172455] shadow-sm transition enabled:hover:border-[#FF5548] enabled:hover:text-[#FF5548] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      ) : null}

      <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3 px-9 sm:gap-4 sm:px-11">
        {Array.from({ length: VISIBLE }).map((_, slot) => {
          const index = start + slot;
          const src = list[index];
          if (!src) {
            return <div key={`empty-${slot}`} className="aspect-[4/3]" aria-hidden />;
          }
          return (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={activeIndex === index}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg border-2 bg-[#F6F8FA] transition-colors",
                activeIndex === index
                  ? "border-[#FF5548]"
                  : "border-[#E8EAEF] hover:border-[#FF5548]/50"
              )}
            >
              <SafeImage
                src={src}
                alt=""
                fallbackSrc="/images/designs/mailer-box.jpg"
                fill
                sizes="220px"
                className="object-contain p-2"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
