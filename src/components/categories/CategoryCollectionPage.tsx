"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Package } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import type { CategoryItem } from "@/types";
import type { CategoryGroupKey } from "@/data/category-groups";
import { CATEGORY_GROUPS } from "@/data/category-groups";

export function CategoryCollectionPage({
  group,
  categories,
}: {
  group: CategoryGroupKey;
  categories: CategoryItem[];
}) {
  const meta = CATEGORY_GROUPS[group];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.slug.includes(q)
    );
  }, [categories, query]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Aligned with ProductHero position & styling */}
      <section className="border-b border-gray-100 bg-white">
        <Container className="max-w-[1180px] py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
            {/* Left Column: Breadcrumb -> Title -> Copy -> CTA */}
            <div className="flex min-w-0 flex-col justify-start lg:min-h-[420px]">
              <Breadcrumbs variant="slash" items={[{ label: meta.title }]} />

              <h1 className="mt-4 font-heading text-[1.65rem] font-extrabold leading-tight tracking-tight text-[#111111] sm:mt-5 sm:text-[1.9rem] lg:text-[2.05rem]">
                {meta.headline}
              </h1>

              <p className="mt-3 text-[14px] leading-[1.65] text-[#333] sm:text-[14.5px]">
                {meta.description}
              </p>

              <div className="mt-5 sm:mt-6">
                <Button href="/quote" variant="primary" size="md" className="h-11 px-6 font-bold">
                  <span>Request a Quote</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Column: Flush image stretching to full left-column height (~500px) */}
            <div className="min-w-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F3F3] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px]">
                <Image
                  src={meta.heroImage}
                  alt={meta.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Browse grid */}
      <section className="py-14 sm:py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172455]">
              {meta.browseLabel}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Search and explore {categories.length} packaging options in this collection.
            </p>
          </div>

          <div className="mt-8 mx-auto max-w-xl">
            <label className="relative block">
              <span className="sr-only">Search {meta.title}</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${meta.title.toLowerCase()}...`}
                className="w-full rounded-full border border-[#E2E4E8] bg-[#F6F8FA] px-5 py-3.5 pr-12 text-sm text-[#172455] outline-none focus:border-[#FF5548] focus:bg-white"
              />
              <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5548]" />
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-12 text-center text-sm text-gray-500">
              No matches for “{query}”. Try another keyword.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
              {filtered.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5] focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#F0EBE3]">
                    <SafeImage
                      src={category.imageUrl || ""}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold leading-snug text-[#172455] transition-colors group-hover:text-[#FF5548] sm:text-[15px]">
                    Custom {category.name.replace(/^Custom\s+/i, "")}
                  </p>
                  {typeof category.productCount === "number" ? (
                    <p className="mt-1 text-center text-xs text-gray-400">
                      {category.productCount} products
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

    </div>
  );
}
