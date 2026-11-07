import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CategoryProductCard } from "@/components/categories/CategoryProductCard";
import { CATALOG_TILE } from "@/components/ui/CatalogTile";
import { getFeaturedProducts, getProductsByIds } from "@/lib/catalog";
import { HOME_PAGE_DEFAULTS, type HomePageData } from "@/lib/home-page-schema";

export async function FeaturedProducts({
  trendingHeading = HOME_PAGE_DEFAULTS.trendingHeading,
  trendingSubtext = HOME_PAGE_DEFAULTS.trendingSubtext,
  trendingProductIds = HOME_PAGE_DEFAULTS.trendingProductIds,
}: Partial<
  Pick<HomePageData, "trendingHeading" | "trendingSubtext" | "trendingProductIds">
> = {}) {
  const ids = trendingProductIds?.filter(Boolean) || [];
  const products =
    ids.length > 0 ? await getProductsByIds(ids) : await getFeaturedProducts(8);

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl lg:max-w-4xl">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl lg:text-[2.1rem]">
              {trendingHeading || "Trending & Popular Products"}
            </h2>
            {trendingSubtext ? (
              <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-[15px] lg:text-base">
                {trendingSubtext}
              </p>
            ) : null}
          </div>
          <div className="shrink-0">
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] bg-[#FF5548] px-5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#e04337]"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {products.length > 0 ? (
          <div className={`mt-8 ${CATALOG_TILE.grid}`}>
            {products.map((product) => (
              <CategoryProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
