import React from "react";
import { CatalogTile } from "@/components/ui/CatalogTile";
import type { ProductItem } from "@/types";

export function CategoryProductCard({ product }: { product: ProductItem }) {
  return (
    <CatalogTile
      href={`/product/${product.slug}`}
      title={product.name}
      imageUrl={product.imageUrl}
      imageAlt={product.name}
    />
  );
}
