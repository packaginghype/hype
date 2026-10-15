"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Package } from "lucide-react";
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
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-[#F6F8FA]">
        <Container className="py-8 sm:py-12 lg:py-14">
          <Breadcrumbs items={[{ label: meta.title }]} />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#21AAA5]">
                {meta.eyebrow}
              </p>
              <h1 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-[#172455] leading-[1.15]">
                {meta.headline}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                {meta.description}
              </p>
              <div className="mt-7">
                <Button href="/quote" variant="primary" size="lg">
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-white">
              <Image
                src={meta.heroImage}
                alt={meta.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
                priority
              />
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
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <Package className="h-10 w-10" />
                      </div>
                    )}
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
