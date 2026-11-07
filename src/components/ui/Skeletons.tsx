import React from "react";
import { Container } from "@/components/ui/Container";

/**
 * Shimmer pulse placeholder block
 */
export function SkeletonBlock({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`animate-pulse rounded bg-[#E8EAEF] ${className}`}
    />
  );
}

/**
 * Realistic Product Detail Skeleton
 * Matches ProductHero.tsx (aspect-[4/3], CategoryQuoteForm layout, 4 thumbs)
 */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white">
        <Container className="pt-3 sm:pt-4 lg:pt-6">
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-3.5 xl:gap-4">
            {/* Left: Breadcrumbs + Title + Description + Quote Form */}
            <div className="flex h-full min-h-0 min-w-0 flex-col justify-between">
              <div>
                {/* Breadcrumb skeleton */}
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="h-3.5 w-14" />
                  <span className="text-[#D1D5DB]">/</span>
                  <SkeletonBlock className="h-3.5 w-24" />
                  <span className="text-[#D1D5DB]">/</span>
                  <SkeletonBlock className="h-3.5 w-32" />
                </div>

                {/* Title */}
                <SkeletonBlock className="mt-3 h-8 w-4/5 sm:mt-4 sm:h-9 lg:h-10" />

                {/* Description lines (4 lines with natural widths) */}
                <div className="mt-3 space-y-2">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-11/12" />
                  <SkeletonBlock className="h-4 w-4/5" />
                  <SkeletonBlock className="h-4 w-2/3" />
                </div>
              </div>

              {/* Quote Form Skeleton (exact replica of CategoryQuoteForm) */}
              <div className="mt-4 overflow-hidden rounded-[8px] border border-[#E5E7EB] shadow-sm lg:mt-auto">
                {/* Coral Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FF5548] px-4 py-3 sm:px-5">
                  <div className="h-5 w-36 rounded bg-white/40" />
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="h-2.5 w-16 rounded bg-white/40" />
                      <div className="h-5 w-20 rounded bg-white/70" />
                    </div>
                    <div className="h-7 w-px bg-white/30" />
                    <div className="flex flex-col gap-1">
                      <div className="h-2.5 w-14 rounded bg-white/40" />
                      <div className="h-4 w-14 rounded bg-white/70" />
                    </div>
                    <div className="h-9 w-24 rounded bg-[#172455]/80" />
                  </div>
                </div>

                {/* Form Fields Area */}
                <div className="space-y-3 bg-white p-4 sm:p-5">
                  {/* Row 1: Name, Email, Phone, Quantity */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                  </div>

                  {/* Row 2: Length, Width, Depth, Colors */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                  </div>

                  {/* Row 3: File, Stock, Message, Submit */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                    <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                    <SkeletonBlock className="h-10 rounded-[4px] bg-[#FF5548]/40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Gallery Skeleton (4:3 aspect ratio matching ProductHero.tsx) */}
            <div className="flex min-w-0 flex-col gap-1 sm:gap-1.5">
              {/* Main 4:3 Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F3F4F6] sm:rounded-[10px]">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-[#E5E7EB] opacity-60" />
                </div>
              </div>

              {/* 4 Thumbnail Skeletons (4:3 aspect ratio matching ProductHero) */}
              <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-[6px] border border-[#E5E7EB] bg-[#F3F4F6] sm:rounded-[8px]"
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Badges */}
      <section className="mt-8 border-t border-[#F0F2F5] bg-white py-6">
        <Container>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-[8px] border border-[#E5E7EB] p-3"
              >
                <div className="h-9 w-9 shrink-0 rounded-full bg-[#E8F5F2]" />
                <div className="space-y-1">
                  <SkeletonBlock className="h-3 w-20" />
                  <SkeletonBlock className="h-2.5 w-14" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

/**
 * Realistic Category Detail Skeleton
 * Matches CategoryDetailPage.tsx (two-tone top, quote form, 4-column product grid)
 */
export function CategoryDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Hero with soft mint bg */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 bottom-[10.5rem] bg-[#E8F5F2] sm:bottom-[11.5rem] lg:bottom-[12rem]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[10.5rem] bg-white sm:h-[11.5rem] lg:h-[12rem]"
        />

        <Container className="relative z-10 max-w-[900px] pt-3 sm:pt-4 lg:pt-5">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8 lg:min-h-[340px]">
            {/* Left text */}
            <div className="flex flex-col justify-start">
              <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
                <SkeletonBlock className="h-3.5 w-16" />
                <span className="text-[#D1D5DB]">/</span>
                <SkeletonBlock className="h-3.5 w-28" />
              </div>
              <SkeletonBlock className="h-9 w-4/5 sm:h-11" />
              <div className="mt-3 space-y-2">
                <SkeletonBlock className="h-3.5 w-full" />
                <SkeletonBlock className="h-3.5 w-11/12" />
                <SkeletonBlock className="h-3.5 w-4/5" />
                <SkeletonBlock className="h-3.5 w-3/4" />
              </div>
            </div>

            {/* Right category image */}
            <div className="relative mx-auto flex h-[240px] w-full max-w-[380px] items-center justify-center sm:h-[300px] sm:max-w-[420px] lg:mx-0 lg:h-[340px]">
              <div className="h-44 w-44 rounded-2xl bg-white/70 shadow-sm" />
            </div>
          </div>

          {/* Centered Quote Form */}
          <div className="relative z-10 mx-auto mt-7 w-full max-w-[900px] overflow-hidden rounded-[8px] border border-[#E5E7EB] shadow-sm sm:mt-8 lg:mt-9">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FF5548] px-4 py-3 sm:px-5">
              <div className="h-5 w-36 rounded bg-white/40" />
              <div className="flex items-center gap-3">
                <div className="h-5 w-24 rounded bg-white/60" />
                <div className="h-9 w-24 rounded bg-[#172455]/80" />
              </div>
            </div>
            <div className="space-y-3 bg-white p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                <SkeletonBlock className="h-10 rounded-[4px] border border-[#D9DDE3] bg-[#FAFAFA]" />
                <SkeletonBlock className="h-10 rounded-[4px] bg-[#FF5548]/40" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Product Grid Section */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="mb-6 flex flex-col items-center text-center">
            <SkeletonBlock className="h-8 w-64 sm:h-9" />
            <SkeletonBlock className="mt-2 h-4 w-96 max-w-full" />
          </div>

          {/* 8 Product Cards Grid (4 columns) */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm"
              >
                {/* 1:1 Aspect Ratio Image */}
                <div className="relative aspect-square w-full bg-[#F3F4F6]">
                  <div className="flex h-full items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-[#E5E7EB] opacity-60" />
                  </div>
                </div>
                {/* Title */}
                <div className="p-3.5 text-center">
                  <SkeletonBlock className="mx-auto h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

/**
 * Realistic Blog Detail Skeleton
 */
export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-white border-b border-gray-100 pt-6 pb-8 sm:pt-8 sm:pb-10 lg:pt-10 lg:pb-12">
        <Container className="max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SkeletonBlock className="h-3.5 w-14" />
                <span className="text-[#D1D5DB]">/</span>
                <SkeletonBlock className="h-3.5 w-16" />
                <span className="text-[#D1D5DB]">/</span>
                <SkeletonBlock className="h-3.5 w-40" />
              </div>
              <SkeletonBlock className="h-9 w-4/5 sm:h-11" />
              <div className="mt-4 space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <SkeletonBlock className="h-4 w-3/4" />
              </div>
            </div>
            <div className="aspect-[4/3] w-full rounded-2xl bg-[#F6F8FA] animate-pulse" />
          </div>
        </Container>
      </section>

      {/* Main content */}
      <Container className="max-w-6xl pt-8 pb-12">
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-11/12" />
          <SkeletonBlock className="h-4 w-4/5" />
        </div>
      </Container>
    </div>
  );
}

/**
 * Realistic Full Homepage Skeleton
 * Pixel-accurate replica of the entire homepage layout:
 * Hero (mint bg with rounded corner), Trust bar, Industry carousel,
 * Trending products 4x2 grid, Category showcase 4x2 grid, and About section.
 */
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section Skeleton */}
      <section className="relative overflow-hidden">
        <div className="relative isolate overflow-hidden bg-[#D8EDE3] rounded-br-[3rem] sm:rounded-br-[4.5rem] lg:rounded-br-[6rem]">
          <Container className="relative py-6 sm:py-8 lg:py-10">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
              {/* Left text */}
              <div className="flex flex-col items-start lg:col-span-6 xl:col-span-5">
                <SkeletonBlock className="h-10 w-4/5 sm:h-12 lg:h-14 bg-white/60" />
                <SkeletonBlock className="mt-3 h-10 w-3/5 sm:h-12 lg:h-14 bg-white/60" />
                <div className="mt-4 w-full space-y-2.5">
                  <SkeletonBlock className="h-4 w-full bg-white/50" />
                  <SkeletonBlock className="h-4 w-5/6 bg-white/50" />
                  <SkeletonBlock className="h-4 w-2/3 bg-white/50" />
                </div>
                <SkeletonBlock className="mt-6 h-12 w-44 rounded-[5px] bg-[#FF5548]/40" />
              </div>

              {/* Right hero image block */}
              <div className="lg:col-span-6 xl:col-span-7">
                <div className="relative aspect-[5/4] w-full max-w-xl lg:aspect-[16/11] lg:max-w-none overflow-hidden rounded-2xl bg-white/60 animate-pulse" />
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* 2. Trust Benefits Bar Skeleton */}
      <section className="border-b border-[#E8EAEF] bg-white">
        <Container className="py-4 sm:py-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="h-8 w-8 shrink-0 rounded-full bg-[#E8F5F2]" />
                <SkeletonBlock className="h-3.5 w-24" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Industry Solutions Section Skeleton */}
      <section className="bg-[#EEF6FF] py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <SkeletonBlock className="h-8 w-72 sm:h-9" />
              <SkeletonBlock className="mt-2 h-4 w-full max-w-xl" />
            </div>
            <SkeletonBlock className="h-11 w-40 rounded-[5px] bg-[#FF5548]/40 shrink-0" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm"
              >
                <div className="aspect-square w-full bg-[#F3F4F6] animate-pulse" />
                <div className="p-3.5 text-center">
                  <SkeletonBlock className="mx-auto h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Trending & Popular Products Section Skeleton */}
      <section className="bg-white py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <SkeletonBlock className="h-8 w-64 sm:h-9" />
              <SkeletonBlock className="mt-2 h-4 w-full max-w-lg" />
            </div>
            <SkeletonBlock className="h-11 w-40 rounded-[5px] bg-[#FF5548]/40 shrink-0" />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm"
              >
                <div className="aspect-square w-full bg-[#F3F4F6] animate-pulse" />
                <div className="p-3.5 text-center">
                  <SkeletonBlock className="mx-auto h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Trending & Popular Categories Section Skeleton */}
      <section className="bg-[#EEF6FF] py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <SkeletonBlock className="h-8 w-80 sm:h-9" />
              <SkeletonBlock className="mt-2 h-4 w-full max-w-md" />
            </div>
            <SkeletonBlock className="h-11 w-40 rounded-[5px] bg-[#172455]/40 shrink-0" />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm"
              >
                <div className="aspect-square w-full bg-[#F3F4F6] animate-pulse" />
                <div className="p-3.5 text-center">
                  <SkeletonBlock className="mx-auto h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. About Who We Are Skeleton */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="aspect-[4/3] w-full rounded-2xl bg-[#E8EAEF] animate-pulse" />
            <div className="space-y-4">
              <SkeletonBlock className="h-8 w-3/4 sm:h-9" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-11/12" />
              <SkeletonBlock className="h-4 w-4/5" />
              <SkeletonBlock className="h-4 w-2/3" />
              <SkeletonBlock className="mt-6 h-11 w-44 rounded-[5px] bg-[#172455]/40" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

/**
 * Root General Page Skeleton (for instant navigation on any route)
 */
export function GeneralPageSkeleton() {
  return (
    <div className="min-h-[70vh] bg-white py-10">
      <Container>
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-10 w-2/3 max-w-md" />
          <SkeletonBlock className="h-4 w-full max-w-2xl" />
          <SkeletonBlock className="h-4 w-5/6 max-w-xl" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-[#F3F4F6]" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

