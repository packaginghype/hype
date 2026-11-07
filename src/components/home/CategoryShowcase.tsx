import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CatalogTile, CATALOG_TILE } from "@/components/ui/CatalogTile";
import { getCategoryShowcaseCategories } from "@/lib/catalog";

export async function CategoryShowcase() {
  const categories = await getCategoryShowcaseCategories(8);

  if (categories.length === 0) return null;

  return (
    <section className="bg-[#EEF6FF] py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl lg:max-w-4xl">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl lg:text-[2.1rem]">
              Trending & Popular Packaging Categories
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-[15px] lg:text-base">
              Explore custom box categories engineered for strength, shelf presence, and unboxing appeal.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/categories"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] bg-[#172455] px-5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#0f1839]"
            >
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className={`mt-8 ${CATALOG_TILE.grid}`}>
          {categories.map((category) => (
            <CatalogTile
              key={category.id}
              href={`/${category.slug}`}
              title={category.name}
              imageUrl={category.imageUrl}
              imageAlt={category.name}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
