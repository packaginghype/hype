"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, Clock } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import type { RelatedBlogItem } from "@/types";

function estimateReadMinutes(text?: string | null): number {
  const words = (text || "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  if (words < 40) return 4;
  return Math.max(1, Math.round(words / 200));
}

function formatBlogDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RelatedBlogsCarousel({ blogs }: { blogs: RelatedBlogItem[] }) {
  const items = blogs.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {items.map((blog) => {
        const img =
          blog.thumbnailImageUrl ||
          blog.featuredImage ||
          "/images/blog-mailer-boxes.jpg";
        const minutes = estimateReadMinutes(blog.excerpt);
        const dateLabel = formatBlogDate(blog.publishedDate);

        return (
          <article
            key={blog.id}
            className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#E5E9F0] bg-white shadow-[0_8px_28px_-18px_rgba(23,36,85,0.18)]"
          >
            <Link
              href={`/blog/${blog.slug}`}
              className="relative aspect-[16/11] w-full overflow-hidden bg-[#F6F8FA]"
            >
              <SafeImage
                src={img}
                alt={blog.title}
                fallbackSrc="/images/blog-mailer-boxes.jpg"
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized={img.startsWith("http")}
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#172455] shadow-sm">
                Guide
              </span>
            </Link>

            <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-4">
              <div className="flex items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#8B7355]">
                  <Clock className="h-3.5 w-3.5 text-[#FF5548]" aria-hidden />
                  {minutes} min read
                </p>
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8B7355]"
                  aria-hidden
                >
                  <Bookmark className="h-4 w-4" />
                </span>
              </div>

              <h3 className="mt-2 font-heading text-[16px] font-bold leading-snug tracking-tight text-[#172455] sm:text-[17px]">
                <Link
                  href={`/blog/${blog.slug}`}
                  className="transition-colors hover:text-[#FF5548] focus:outline-none"
                >
                  {blog.title}
                </Link>
              </h3>

              {blog.excerpt ? (
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#6B7280]">
                  {blog.excerpt}
                </p>
              ) : null}

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#F0EBE3] pt-3.5">
                <p className="text-[12px] text-[#9CA3AF]">{dateLabel}</p>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1 text-[13px] font-bold text-[#172455] transition-colors hover:text-[#FF5548]"
                >
                  Read Article →
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
