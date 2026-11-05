"use client";

import React, { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { CategoryProductCard } from "@/components/categories/CategoryProductCard";
import type { ProductItem } from "@/types";

const INITIAL = 40;
const STEP = 40;

export function ProductsCatalogSearch({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/product?q=${encodeURIComponent(q)}` : "/product");
  }

  return (
    <div className="mb-10 flex w-full justify-end sm:justify-center md:justify-end">
      <div className="flex w-full flex-col px-0 sm:w-3/4 md:w-2/3 lg:w-1/2">
        <p className="text-center text-2xl font-extrabold tracking-tight text-[#21AAA5] sm:text-left sm:text-3xl">
          SEARCH PRODUCTS
        </p>
        <form onSubmit={onSubmit} className="relative mt-3 flex w-full">
          <label htmlFor="products-catalog-search" className="sr-only">
            Search products
          </label>
          <div className="relative flex w-full rounded-3xl border border-[#21AAA5]">
            <input
              id="products-catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bakery & Cake Boxes"
              autoComplete="off"
              className="w-full rounded-3xl border-none bg-white py-2.5 pl-5 pr-12 text-base text-[#21AAA5] outline-none placeholder:font-medium placeholder:text-[#21AAA5]/80 sm:py-3 sm:pl-6 sm:text-lg"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#21AAA5] transition-colors hover:text-[#178f8b]"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProductsLoadMoreGrid({
  products,
}: {
  products: ProductItem[];
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL);
  const visible = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );
  const hasMore = visibleCount < products.length;

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 py-16 text-center">
        <p className="text-sm font-medium text-gray-500">
          No packaging products found in this selection.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="my-10 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => (
          <CategoryProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore ? (
        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + STEP)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FF5548] px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[#e04337]"
          >
            Load More
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
