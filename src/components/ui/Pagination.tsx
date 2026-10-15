import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function buildHref(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number
) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
    pages.add(total - 3);
  }

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("…");
    out.push(sorted[i]);
  }
  return out;
}

export function Pagination({
  page,
  totalPages,
  basePath = "/products",
  params = {},
  className,
}: {
  page: number;
  totalPages: number;
  basePath?: string;
  params?: Record<string, string | undefined>;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  const numbers = pageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}
    >
      {prev ? (
        <Link
          href={buildHref(basePath, params, prev)}
          className="inline-flex h-9 items-center gap-1 rounded-[5px] border border-[#E2E4E8] bg-white px-3 text-[13px] font-semibold text-[#172455] transition-colors hover:border-[#172455]"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Link>
      ) : (
        <span className="inline-flex h-9 items-center gap-1 rounded-[5px] border border-[#EEE] px-3 text-[13px] font-semibold text-gray-300">
          <ChevronLeft className="h-4 w-4" />
          Prev
        </span>
      )}

      {numbers.map((n, idx) =>
        n === "…" ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex h-9 w-9 items-center justify-center text-sm text-gray-400"
          >
            …
          </span>
        ) : (
          <Link
            key={n}
            href={buildHref(basePath, params, n)}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-[5px] text-[13px] font-semibold transition-colors",
              n === page
                ? "bg-[#172455] text-white"
                : "border border-[#E2E4E8] bg-white text-[#172455] hover:border-[#172455]"
            )}
          >
            {n}
          </Link>
        )
      )}

      {next ? (
        <Link
          href={buildHref(basePath, params, next)}
          className="inline-flex h-9 items-center gap-1 rounded-[5px] border border-[#E2E4E8] bg-white px-3 text-[13px] font-semibold text-[#172455] transition-colors hover:border-[#172455]"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex h-9 items-center gap-1 rounded-[5px] border border-[#EEE] px-3 text-[13px] font-semibold text-gray-300">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
