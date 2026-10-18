export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section skeleton */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
            {/* Left: breadcrumb + title + description + quote form */}
            <div className="min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-16 animate-pulse rounded bg-[#F1F3F5]" />
                <span className="text-[#D1D5DB]">/</span>
                <div className="h-3.5 w-28 animate-pulse rounded bg-[#F1F3F5]" />
                <span className="text-[#D1D5DB]">/</span>
                <div className="h-3.5 w-36 animate-pulse rounded bg-[#E8EAEF]" />
              </div>

              {/* Product Title */}
              <div className="mt-4 h-9 w-4/5 animate-pulse rounded-lg bg-[#E8EAEF] sm:mt-5 sm:h-10" />

              {/* Description */}
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-[#F1F3F5]" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-[#F1F3F5]" />
              </div>

              {/* Quote Form Container */}
              <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F6F8FA] p-5 space-y-4 sm:mt-6">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-40 animate-pulse rounded bg-[#E8EAEF]" />
                  <div className="h-4 w-28 animate-pulse rounded bg-[#F1F3F5]" />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-3 w-16 animate-pulse rounded bg-[#E8EAEF]" />
                      <div className="h-9 animate-pulse rounded-md border border-[#E5E7EB] bg-white" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-3 w-20 animate-pulse rounded bg-[#E8EAEF]" />
                      <div className="h-9 animate-pulse rounded-md border border-[#E5E7EB] bg-white" />
                    </div>
                  ))}
                </div>
                <div className="h-12 w-full animate-pulse rounded-md bg-[#FF5548]/30" />
              </div>
            </div>

            {/* Right: image gallery skeleton */}
            <div className="min-w-0 space-y-0">
              <div className="relative min-h-[300px] w-full animate-pulse bg-[#F3F3F3] sm:min-h-[380px] lg:h-[480px]" />
              <div className="grid grid-cols-4 gap-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse bg-[#EBEBEB]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges skeleton */}
      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#E5E7EB] bg-white px-4 py-5 sm:grid-cols-2 sm:px-5 lg:grid-cols-5 lg:gap-2 lg:px-3 lg:py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-2 py-1">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#EAF7F6]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 animate-pulse rounded bg-[#E8EAEF]" />
                  <div className="h-3 w-32 animate-pulse rounded bg-[#F1F3F5]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
