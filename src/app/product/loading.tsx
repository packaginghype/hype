export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-16 animate-pulse rounded bg-[#F1F3F5]" />
          <span className="text-[#D1D5DB]">/</span>
          <div className="h-3.5 w-28 animate-pulse rounded bg-[#E8EAEF]" />
        </div>

        {/* Section Heading */}
        <div className="mb-8 mt-6">
          <div className="h-5 w-44 animate-pulse rounded-full bg-[#EAF7F6]" />
          <div className="mt-3 h-8 w-80 max-w-full animate-pulse rounded-lg bg-[#E8EAEF] sm:h-9" />
          <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-[#F1F3F5]" />

          {/* Filter pills horizontal strip */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-3 pt-1">
            <div className="h-8 w-28 shrink-0 animate-pulse rounded-full bg-[#172455]/20" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 shrink-0 animate-pulse rounded-full border border-gray-200 bg-white"
              />
            ))}
          </div>
        </div>

        {/* 4-column Product Grid */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square animate-pulse rounded-[5px] bg-[#F1F3F5]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#E8EAEF]" />
              <div className="h-3.5 w-1/2 animate-pulse rounded bg-[#F1F3F5]" />
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="h-4 w-36 animate-pulse rounded bg-[#F1F3F5]" />
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-9 animate-pulse rounded border border-gray-200 bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
