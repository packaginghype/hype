import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CategoryQuoteForm } from "@/components/categories/CategoryQuoteForm";
import { CategoryProductCard } from "@/components/categories/CategoryProductCard";
import {
  getCategoryAboutContent,
  getCategoryDesignOptions,
  getCategoryHeroCopy,
  getCategoryMaterials,
} from "@/data/category-page-content";
import type { CategoryItem, ProductItem } from "@/types";

export function CategoryDetailPage({
  category,
  products,
}: {
  category: CategoryItem;
  products: ProductItem[];
}) {
  const hero = getCategoryHeroCopy(category);
  const about = getCategoryAboutContent(category);
  const materials = getCategoryMaterials(category, products);
  const design = getCategoryDesignOptions(category, products);
  const heroImage = category.imageUrl || products[0]?.imageUrl;

  const contentWidth = "max-w-[980px]";

  return (
    <div className="bg-white">
      {/*
        Hero + quote as one band.
        Mint background runs from the top down to ~mid quote form (red-line mark),
        then white continues underneath the lower half of the form.
      */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 bottom-[10.5rem] bg-[#E8F5F2] sm:bottom-[11.5rem] lg:bottom-[12rem]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[10.5rem] bg-white sm:h-[11.5rem] lg:h-[12rem]"
        />

        <Container className={`relative z-10 ${contentWidth} pt-8 sm:pt-10 lg:pt-12`}>
          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-2 lg:gap-8">
            <div className="max-w-md lg:max-w-lg">
              <h1 className="font-heading text-[1.75rem] font-extrabold tracking-tight text-[#111111] sm:text-[2.1rem] lg:text-[2.35rem] lg:leading-[1.15]">
                {hero.title}
              </h1>
              <div className="mt-3.5 space-y-3 text-[13.5px] leading-[1.7] text-[#2a2a2a] sm:text-[14.5px]">
                {hero.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="relative mx-auto h-[210px] w-full max-w-[340px] sm:h-[250px] sm:max-w-[380px] lg:mx-0 lg:h-[270px] lg:max-w-none">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={hero.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-contain drop-shadow-[0_14px_26px_rgba(15,23,42,0.13)]"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <Package className="h-14 w-14" />
                </div>
              )}
            </div>
          </div>

          <div id="category-quote" className="relative z-10 mt-7 scroll-mt-28 sm:mt-8 lg:mt-9">
            <CategoryQuoteForm
              productName={hero.title}
              cartItem={{
                id: `category:${category.id}`,
                slug: category.slug,
                name: hero.title,
                imageUrl: heroImage,
                unitPrice: null,
                href: `/categories/${category.slug}`,
              }}
            />
          </div>
        </Container>
      </section>

      {/* Explore products — simple name cards, 4 per row */}
      <section className="bg-white pt-12 pb-14 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
        <Container className={contentWidth}>
          <h2 className="text-center font-heading text-2xl font-extrabold tracking-tight text-[#0B1220] sm:text-3xl">
            Explore Packaging Solutions
          </h2>

          <div className="mt-10">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4 lg:gap-7">
                {products.map((product) => (
                  <CategoryProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-[#F6F8FA] p-8 text-center">
                <p className="text-sm text-gray-600">
                  Custom {category.name} are made to your exact size, material, and
                  print specs. Request a quote to get started.
                </p>
                <Link
                  href="#category-quote"
                  className="mt-4 inline-block text-sm font-bold text-[#FF5548] hover:text-[#e04337]"
                >
                  Get a custom quote →
                </Link>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* About / reliable-style section */}
      <section className="bg-white py-6 sm:py-10 lg:py-12">
        <Container className={contentWidth}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 lg:h-[500px] xl:h-[540px]">
            <div className="relative aspect-[5/4] min-h-0 overflow-hidden rounded-[16px] bg-[#F3F1EE] lg:aspect-auto lg:h-full">
              {about.imageUrl || products[0]?.imageUrl ? (
                <Image
                  src={about.imageUrl || products[0].imageUrl}
                  alt={about.heading}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <Package className="h-14 w-14" />
                </div>
              )}
            </div>

            <div className="reliable-scroll h-[420px] min-h-0 overflow-y-auto pr-3 sm:h-[460px] lg:h-full">
              <h2 className="text-[1.55rem] font-semibold leading-snug tracking-tight text-[#FF5548] sm:text-[1.75rem] lg:text-[1.9rem]">
                {about.heading}
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-[1.7] text-[#555555] sm:text-base">
                {about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Materials explorer */}
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <Container className={contentWidth}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#0B1220] sm:text-3xl lg:text-[2rem]">
              Explore the Material For {hero.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#444] sm:text-base">
              Discover premium materials like natural kraft, corrugated, and
              eco-friendly options for durable, sustainable, and customizable{" "}
              {category.name.toLowerCase()}.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
            {materials.map((item) => (
              <div key={item.title} className="flex gap-4 sm:gap-5">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-[#F6F8FA] sm:h-32 sm:w-32">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="128px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-base font-bold text-[#0B1220] sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#555]">
                    {item.description}
                  </p>
                  <p className="mt-2 text-sm text-[#333]">
                    <span className="font-bold">Best for:</span> {item.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Design options */}
      <section className="bg-white pb-16 pt-4 sm:pb-20 sm:pt-6">
        <Container className={contentWidth}>
          <div className="flex flex-col items-center text-center">
            <Link
              href="/quote"
              className="inline-flex rounded-[6px] bg-[#FF5548] px-8 py-3 text-sm font-bold text-[#0B1220] hover:bg-[#e04337] sm:text-base"
            >
              Get Free Quote
            </Link>

            <h2 className="mt-8 font-heading text-2xl font-extrabold tracking-tight text-[#0B1220] sm:text-3xl">
              {design.heading}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#444] sm:text-base">
              {design.description}
            </p>

            {design.images.length > 0 && (
              <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
                {design.images.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F6F8FA]"
                  >
                    <Image
                      src={src}
                      alt={`${design.heading} option ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-4"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
