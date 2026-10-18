export function AdminPageSkeleton() {
  return (
    <div className="w-full max-w-none animate-pulse space-y-5 pb-8">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded bg-[#E2E4E8]" />
        <div className="h-4 w-64 max-w-full rounded bg-[#EEF0F4]" />
      </div>

      <div className="h-12 rounded-[8px] border border-[#E8EAEF] bg-white" />

      <div className="grid gap-5 xl:grid-cols-2">
        <SkeletonCard lines={5} />
        <SkeletonCard lines={3} />
      </div>

      <SkeletonCard lines={4} tall />
      <div className="grid gap-5 xl:grid-cols-2">
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
      </div>
    </div>
  );
}

function SkeletonCard({
  lines = 3,
  tall = false,
}: {
  lines?: number;
  tall?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
      <div className="h-10 bg-[#172455]/90" />
      <div className="space-y-3 p-5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cnBar(i === 0 ? "w-1/3" : i === lines - 1 ? "w-2/3" : "w-full")}
            style={{ height: tall && i === lines - 1 ? 120 : 14 }}
          />
        ))}
      </div>
    </div>
  );
}

function cnBar(width: string) {
  return `rounded bg-[#EEF0F4] ${width}`;
}
