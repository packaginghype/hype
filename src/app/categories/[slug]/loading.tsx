export default function CategoryDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-100 bg-white py-6 sm:py-8 lg:py-10">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
            {/* Left column */}
            <div className="min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-16 animate-pulse rounded bg-[#F1F3F5]" />
                <span className="text-[#D1D5DB]">/</span>
                <div className="h-3.5 w-24 animate-pulse rounded bg-[#F1F3F5]" />
                <span className="text-[#D1D5DB]">/</span>
                <div className="h-3.5 w-32 animate-pulse rounded bg-[#E8EAEF]" />
              </div>

              {/* Title */}
              <div className="mt-4 h-9 w-4/5 animate-pulse rounded-lg bg-[#E8EAEF] sm:mt-5 sm:h-10" />

              {/* Description lines */}
              <div className="mt-3.5 space-y-2.5">
                <div className="h-4 w-full animate-pulse rounded bg-[#F1F3F5]" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-[#F1F3F5]" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-[#F1F3F5]" />
              </div>

            </div>

            {/* Right column: Image placeholder */}
            <div className="relative mx-auto h-[280px] w-full max-w-[400px] animate-pulse rounded-xl bg-[#F6F8FA] sm:h-[350px] sm:max-w-[460px] lg:mx-0 lg:h-[420px] lg:max-w-none" />
          </div>

          {/* Quote Form Card Skeleton */}
          <div className="mx-auto mt-7 w-full max-w-[900px] rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-5 sm:mt-8 sm:p-7">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="h-5 w-44 animate-pulse rounded bg-[#E8EAEF]" />
              <div className="h-4 w-28 animate-pulse rounded bg-[#F1F3F5]" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-16 animate-pulse rounded bg-[#E8EAEF]" />
                  <div className="h-10 animate-pulse rounded-md border border-[#E5E7EB] bg-white" />
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-20 animate-pulse rounded bg-[#E8EAEF]" />
                  <div className="h-10 animate-pulse rounded-md border border-[#E5E7EB] bg-white" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <div className="h-11 w-48 animate-pulse rounded-[4px] bg-[#FF5548]/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Listing Skeleton */}
      <section className="bg-white py-12 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-[#E8EAEF]" />
          <div className="mx-auto mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-[#F1F3F5]" />

          <div className="mt-10 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4 lg:gap-7">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square animate-pulse rounded-[6px] bg-[#F6F8FA]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#E8EAEF]" />
                <div className="h-3.5 w-1/2 animate-pulse rounded bg-[#F1F3F5]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
