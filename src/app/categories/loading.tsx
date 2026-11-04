export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Aligned with CategoryCollectionPage */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
            {/* Left Column: Breadcrumb -> Title -> Copy -> CTA */}
            <div className="flex min-w-0 flex-col justify-start lg:min-h-[420px]">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-14 animate-pulse rounded bg-[#F1F3F5]" />
                <span className="text-[#D1D5DB]">/</span>
                <div className="h-3.5 w-24 animate-pulse rounded bg-[#E8EAEF]" />
              </div>

              <div className="mt-4 h-9 w-4/5 animate-pulse rounded-lg bg-[#E8EAEF] sm:mt-5 sm:h-11" />

              <div className="mt-3 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-[#F1F3F5]" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-[#F1F3F5]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#F1F3F5]" />
              </div>

              <div className="mt-5 sm:mt-6">
                <div className="h-11 w-44 animate-pulse rounded-[4px] bg-[#FF5548]/30" />
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="min-w-0">
              <div className="aspect-[4/3] w-full animate-pulse rounded-none bg-[#F3F3F3] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Browse Grid Section */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
          {/* Centered Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-[#E8EAEF]" />
            <div className="mx-auto mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-[#F1F3F5]" />
          </div>

          {/* Search bar skeleton */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="h-12 w-full animate-pulse rounded-full border border-[#E2E4E8] bg-[#F6F8FA]" />
          </div>

          {/* 4-column Category Grid */}
          <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square animate-pulse rounded-none bg-[#F0EBE3]" />
                <div className="mx-auto h-4 w-2/3 animate-pulse rounded bg-[#E8EAEF]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
