import React from "react";
import { ProductItem } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ProductItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({
  products,
  columns = 3,
  className,
}: ProductGridProps) {
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg p-6">
        <p className="text-gray-500 text-sm font-medium">
          No packaging products found in this selection.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", columnClasses[columns], className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
