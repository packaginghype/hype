export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1360px] px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8 lg:pt-10">
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center gap-2 min-[1200px]:mb-2 min-[1400px]:mb-6">
          <div className="h-3.5 w-12 animate-pulse rounded bg-[#F1F3F5]" />
          <span className="text-[#D1D5DB]">&gt;</span>
          <div className="h-3.5 w-20 animate-pulse rounded bg-[#E8EAEF]" />
        </div>

        {/* Hero: copy + image */}
        <div className="grid grid-cols-1 items-start gap-8 min-[1200px]:grid-cols-2 min-[1400px]:grid-cols-[1fr_648px] xl:gap-16">
          <div>
            <div className="h-8 w-full max-w-xl animate-pulse rounded-lg bg-[#E8EAEF] md:h-11" />
            <div className="mt-4 space-y-2 md:mt-6">
              <div className="h-4 w-full animate-pulse rounded bg-[#F1F3F5]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#F1F3F5]" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-[#F1F3F5]" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#F1F3F5]" />
            </div>
            <div className="mt-4 h-12 w-44 animate-pulse rounded-md bg-[#FF5548]/25" />
          </div>
          <div className="min-h-[240px] w-full animate-pulse rounded-2xl bg-[#F1F3F5] min-[1200px]:h-[450px] min-[1400px]:h-[523px]" />
        </div>

        {/* Search */}
        <div className="mb-10 mt-10 flex w-full justify-end sm:mt-12 sm:justify-center md:justify-end">
          <div className="flex w-full flex-col sm:w-3/4 md:w-2/3 lg:w-1/2">
            <div className="h-8 w-52 animate-pulse rounded bg-[#EAF7F6] sm:h-9" />
            <div className="mt-3 h-12 w-full animate-pulse rounded-3xl border border-[#21AAA5]/30 bg-white" />
          </div>
        </div>

        {/* Section heading */}
        <div>
          <div className="h-8 w-80 max-w-full animate-pulse rounded-lg bg-[#E8EAEF]" />
          <div className="mt-2 space-y-2">
            <div className="h-4 w-full max-w-3xl animate-pulse rounded bg-[#F1F3F5]" />
            <div className="h-4 w-2/3 max-w-2xl animate-pulse rounded bg-[#F1F3F5]" />
          </div>
        </div>

        {/* Product grid */}
        <div className="my-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white"
            >
              <div className="aspect-square animate-pulse bg-[#F1F3F5]" />
              <div className="px-3 py-3.5">
                <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-[#E8EAEF]" />
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mb-6 flex justify-center">
          <div className="h-12 w-36 animate-pulse rounded-md bg-[#FF5548]/20" />
        </div>
      </div>
    </div>
  );
}
