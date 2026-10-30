"use client";

import React, { useState } from "react";
import { CategoryProductCard } from "./CategoryProductCard";
import { CATALOG_TILE } from "@/components/ui/CatalogTile";
import type { ProductItem } from "@/types";

interface CategoryProductGridProps {
  products: ProductItem[];
  initialCount?: number;
  stepCount?: number;
}

export function CategoryProductGrid({
  products,
  initialCount = 20, // 5 rows * 4 columns on desktop grid
  stepCount = 20,
}: CategoryProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + stepCount);
  };

  return (
    <div>
      <div className={CATALOG_TILE.grid}>
        {visibleProducts.map((product) => (
          <CategoryProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center justify-center rounded-[6px] border-2 border-[#172455] bg-white px-8 py-3 text-sm font-bold text-[#172455] shadow-sm transition-all duration-200 hover:bg-[#172455] hover:text-white hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#172455] focus:ring-offset-2"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

