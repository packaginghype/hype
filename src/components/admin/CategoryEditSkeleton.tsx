import React from "react";

export function CategoryEditSkeleton() {
  return (
    <div className="w-full max-w-none animate-pulse space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3.5 w-28 rounded bg-[#E2E4E8]" />
          <div className="h-8 w-64 max-w-full rounded bg-[#D5DAE2]" />
          <div className="h-4 w-44 rounded bg-[#EEF0F4]" />
        </div>
        <div className="h-9 w-32 rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
      </div>

      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[#E8EAEF] bg-white px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded bg-[#E2E4E8]" />
          <div className="h-4 w-28 rounded bg-[#FFC5C1]" />
        </div>
        <div className="h-3 w-48 rounded bg-[#EEF0F4]" />
      </div>

      {/* Row 1: Basic Info & Pricing */}
      <div className="grid gap-5 xl:grid-cols-2">
        {/* Basic Info */}
        <div className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
          <div className="flex h-10 items-center bg-[#172455] px-5">
            <div className="h-3.5 w-24 rounded bg-white/30" />
          </div>
          <div className="space-y-4 p-5">
            <div>
              <div className="mb-2 h-3 w-16 rounded bg-[#E2E4E8]" />
              <div className="h-10 w-full rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <div className="mb-2 h-3 w-20 rounded bg-[#E2E4E8]" />
                <div className="h-10 w-full rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
              </div>
              <div>
                <div className="mb-2 h-3 w-24 rounded bg-[#E2E4E8]" />
                <div className="h-10 w-full rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
              </div>
              <div>
                <div className="mb-2 h-3 w-16 rounded bg-[#E2E4E8]" />
                <div className="h-10 w-full rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
              </div>
            </div>
            <div>
              <div className="mb-2 h-3 w-24 rounded bg-[#E2E4E8]" />
              <SkeletonEditor lines={3} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
          <div className="flex h-10 items-center bg-[#172455] px-5">
            <div className="h-3.5 w-20 rounded bg-white/30" />
          </div>
          <div className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 h-3 w-24 rounded bg-[#E2E4E8]" />
                <div className="h-10 w-full rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
              </div>
              <div>
                <div className="mb-2 h-3 w-28 rounded bg-[#E2E4E8]" />
                <div className="h-10 w-full rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
              </div>
            </div>
            <div>
              <div className="mb-2 h-3 w-16 rounded bg-[#E2E4E8]" />
              <div className="inline-flex h-9 w-32 rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Banner Section */}
      <div className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
        <div className="flex h-10 items-center bg-[#172455] px-5">
          <div className="h-3.5 w-20 rounded bg-white/30" />
        </div>
        <div className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-2 h-3 w-32 rounded bg-[#E2E4E8]" />
              <div className="h-9 w-28 rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
            </div>
            <div>
              <div className="mb-2 h-3 w-40 rounded bg-[#E2E4E8]" />
              <div className="h-9 w-28 rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
            </div>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <div>
              <div className="mb-2 h-3 w-28 rounded bg-[#E2E4E8]" />
              <SkeletonEditor lines={2} />
            </div>
            <div>
              <div className="mb-2 h-3 w-32 rounded bg-[#E2E4E8]" />
              <SkeletonEditor lines={3} />
            </div>
          </div>
          <div>
            <div className="mb-2 h-3 w-24 rounded bg-[#E2E4E8]" />
            <SkeletonUploadBox />
          </div>
        </div>
      </div>

      {/* Row 3: Thumbnail & Widgets */}
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
          <div className="flex h-10 items-center bg-[#172455] px-5">
            <div className="h-3.5 w-24 rounded bg-white/30" />
          </div>
          <div className="space-y-4 p-5">
            <SkeletonUploadBox />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-10 rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
              <div className="h-10 rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
          <div className="flex h-10 items-center bg-[#172455] px-5">
            <div className="h-3.5 w-32 rounded bg-white/30" />
          </div>
          <div className="space-y-3 p-5">
            <div className="h-3 w-36 rounded bg-[#E2E4E8]" />
            <div className="h-44 w-full rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
          </div>
        </div>
      </div>

      {/* Bottom Fixed Action Bar Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E8EAEF] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:left-64">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-64 rounded bg-[#EEF0F4]" />
          <div className="flex gap-3">
            <div className="h-9 w-20 rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC]" />
            <div className="h-9 w-24 rounded-[4px] bg-[#FF5548]/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonEditor({ lines = 2 }: { lines?: number }) {
  return (
    <div className="overflow-hidden rounded-[4px] border border-[#E2E4E8] bg-white">
      {/* Editor toolbar placeholder */}
      <div className="flex h-9 items-center gap-2 border-b border-[#E8EAEF] bg-[#F8FAFC] px-3">
        <div className="h-4 w-16 rounded bg-[#E2E4E8]" />
        <div className="h-4 w-6 rounded bg-[#E2E4E8]" />
        <div className="h-4 w-6 rounded bg-[#E2E4E8]" />
        <div className="h-4 w-6 rounded bg-[#E2E4E8]" />
        <div className="h-4 w-12 rounded bg-[#E2E4E8]" />
      </div>
      {/* Editor content placeholder */}
      <div className="space-y-2 p-3.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded bg-[#F1F3F6] ${
              i === lines - 1 ? "w-3/5" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonUploadBox() {
  return (
    <div className="flex h-32 flex-col items-center justify-center rounded-[6px] border-2 border-dashed border-[#D5DAE2] bg-[#FAFBFD] p-4 text-center">
      <div className="h-8 w-8 rounded-full bg-[#E2E4E8]" />
      <div className="mt-2 h-3.5 w-44 rounded bg-[#E2E4E8]" />
      <div className="mt-1 h-2.5 w-28 rounded bg-[#EEF0F4]" />
    </div>
  );
}
