import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SafeImage } from "@/components/ui/SafeImage";
import { CategoryQuoteForm } from "@/components/categories/CategoryQuoteForm";
import { CategoryProductCard } from "@/components/categories/CategoryProductCard";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { RichText } from "@/components/ui/RichText";
import {
  getCategoryAboutContent,
  getCategoryDesignOptions,
  getCategoryHeroCopy,
  getCategoryMaterialSection,
  getCategoryMaterials,
} from "@/data/category-page-content";
import { isEmptyHtml, stripHtml } from "@/lib/html";
import type { CategoryItem, ProductItem } from "@/types";

export function CategoryDetailPage({
  category,
  products,
}: {
  category: CategoryItem;
  products: ProductItem[];
}) {
  const cms = category.cms;
  const hero = getCategoryHeroCopy({
    ...category,
    description: stripHtml(category.description),
  });
  const about = getCategoryAboutContent({
    ...category,
    description: stripHtml(category.description),
  });
  const materialSection = getCategoryMaterialSection(category, products);
  const design = getCategoryDesignOptions(category, products);

  const bannerOn = cms?.bannerEnabled !== false;
  const quoteOn = cms?.bannerQuoteEnabled !== false;
  const listingOn = true;
  const scrollOn = cms?.pageScrollEnabled !== false;
  const hasFaqs = (cms?.faqs?.length || 0) > 0;

  const heroTitle = !isEmptyHtml(cms?.bannerHeading || "")
    ? stripHtml(cms!.bannerHeading!)
    : hero.title;
  const heroImage =
    cms?.bannerImageUrl || category.imageUrl || products[0]?.imageUrl;
  const heroImageAlt =
    cms?.bannerImageAlt || cms?.imageAlt || heroTitle;

  const contentWidth = "max-w-[900px]";

  return (
    <div className="bg-white">
      {bannerOn ? (
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
              <div className="min-w-0">
                {!isEmptyHtml(cms?.bannerHeading || "") ? (
                  <RichText
                    html={cms!.bannerHeading!}
                    className="font-heading text-[1.75rem] font-extrabold tracking-tight text-[#111111] sm:text-[2.1rem] lg:text-[2.35rem] [&_h1]:text-inherit [&_h2]:text-inherit [&_p]:m-0"
                  />
                ) : (
                  <h1 className="font-heading text-[1.75rem] font-extrabold tracking-tight text-[#111111] sm:text-[2.1rem] lg:text-[2.35rem] lg:leading-[1.15]">
                    {heroTitle}
                  </h1>
                )}

                <div className="mt-3.5 space-y-3 text-[13.5px] leading-[1.7] text-[#2a2a2a] sm:text-[14.5px]">
                  {!isEmptyHtml(cms?.bannerDescription || "") ? (
                    <RichText html={cms!.bannerDescription!} />
                  ) : !isEmptyHtml(category.description) &&
                    category.description.includes("<") ? (
                    <RichText html={category.description} />
                  ) : (
                    hero.paragraphs.map((p, i) => <p key={i}>{p}</p>)
                  )}
                </div>

                {cms?.originalPrice != null ? (
                  <p className="mt-4 text-sm font-semibold text-[#172455]">
                    Starting from{" "}
                    <span className="text-[#FF5548]">
                      ${Number(cms.discountedPrice ?? cms.originalPrice).toFixed(2)}
                    </span>
                    {cms.discountedPrice != null &&
                      cms.originalPrice != null &&
                      cms.discountedPrice < cms.originalPrice ? (
                      <span className="ml-2 text-gray-400 line-through">
                        ${Number(cms.originalPrice).toFixed(2)}
                      </span>
                    ) : null}
                  </p>
                ) : null}
              </div>

              <div className="relative mx-auto h-[280px] w-full max-w-[400px] sm:h-[350px] sm:max-w-[460px] lg:mx-0 lg:h-[420px] lg:max-w-none">
                {heroImage ? (
                  <SafeImage
                    src={heroImage}
                    alt={heroImageAlt}
                    title={cms?.bannerImageTitle || cms?.imageTitle || undefined}
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

            {quoteOn ? (
              <div id="category-quote" className="relative z-10 mx-auto mt-7 w-full max-w-[900px] scroll-mt-28 sm:mt-8 lg:mt-9">
                <CategoryQuoteForm
                  productName={heroTitle}
                  startingFrom={
                    cms?.discountedPrice != null
                      ? `$${Number(cms.discountedPrice).toFixed(2)}`
                      : cms?.originalPrice != null
                        ? `$${Number(cms.originalPrice).toFixed(2)}`
                        : "$0.85"
                  }
                  cartItem={{
                    id: `category:${category.id}`,
                    slug: category.slug,
                    name: heroTitle,
                    imageUrl: heroImage,
                    unitPrice: cms?.discountedPrice ?? cms?.originalPrice ?? null,
                    href: `/categories/${category.slug}`,
                  }}
                />
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      {listingOn ? (
        <section className="bg-white pt-12 pb-14 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
          <Container className={contentWidth}>
            <h2 className="text-center font-heading text-2xl font-extrabold tracking-tight text-[#0B1220] sm:text-3xl">
              {cms?.listingHeading || "Explore Packaging Solutions"}
            </h2>
            {!isEmptyHtml(cms?.listingText || "") ? (
              <div className="mx-auto mt-4 max-w-3xl text-center text-[14px] text-[#555]">
                <RichText html={cms!.listingText!} />
              </div>
            ) : null}

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
                    Custom {category.name} are made to your exact size, material,
                    and print specs. Request a quote to get started.
                  </p>
                  {quoteOn ? (
                    <Link
                      href="#category-quote"
                      className="mt-4 inline-block text-sm font-bold text-[#FF5548] hover:text-[#e04337]"
                    >
                      Get a custom quote →
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          </Container>
        </section>
      ) : null}

      {scrollOn ? (
        <section className="bg-white py-6 sm:py-10 lg:py-12">
          <Container className={contentWidth}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 lg:h-[500px] xl:h-[540px]">
              <div className="relative aspect-[5/4] min-h-0 overflow-hidden rounded-[16px] bg-[#F3F1EE] lg:aspect-auto lg:h-full">
                {cms?.pageScrollImageUrl ||
                  about.imageUrl ||
                  products[0]?.imageUrl ? (
                  <SafeImage
                    src={
                      cms?.pageScrollImageUrl ||
                      about.imageUrl ||
                      products[0].imageUrl
                    }
                    alt={cms?.pageScrollImageAlt || about.heading}
                    title={cms?.pageScrollImageTitle || undefined}
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
                {!isEmptyHtml(cms?.pageScrollContent || "") ? (
                  <RichText
                    html={cms!.pageScrollContent!}
                    className="text-[15px] leading-[1.7] text-[#555]"
                  />
                ) : (
                  <>
                    <h2 className="text-[1.55rem] font-semibold leading-snug tracking-tight text-[#FF5548] sm:text-[1.75rem] lg:text-[1.9rem]">
                      {about.heading}
                    </h2>
                    <div className="mt-5 space-y-4 text-[15px] leading-[1.7] text-[#555555] sm:text-base">
                      {about.paragraphs.map((p, i) => (
                        <p key={i}>{stripHtml(p)}</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {cms?.featureEnabled !== false ? (
        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <Container className={contentWidth}>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#0B1220] sm:text-3xl lg:text-[2rem]">
                {materialSection.heading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#444] sm:text-base">
                {materialSection.description}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
              {materialSection.items.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="flex gap-4 sm:gap-5 items-start"
                >
                  <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "Packaging Material"}
                        fill
                        sizes="(max-width: 640px) 112px, 144px"
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <Package className="h-10 w-10" />
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
                    {item.bestFor ? (
                      <p className="mt-2 text-sm text-[#333]">
                        <span className="font-bold">Best for:</span> {item.bestFor}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {hasFaqs ? (
        <section className="border-t border-[#E8EAEF] bg-[#F8FAFC] py-14 sm:py-16">
          <Container className={`${contentWidth} max-w-3xl`}>
            <div className="text-center">
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
                {cms?.faqsHeading || `FAQs about ${heroTitle}`}
              </h2>
              {cms?.faqsSubheading ? (
                <p className="mt-2 text-sm text-[#666]">{cms.faqsSubheading}</p>
              ) : null}
            </div>
            <div className="mt-8 rounded-[12px] border border-[#E5E9F0] bg-white px-4 sm:px-6">
              <FAQAccordion items={cms!.faqs} variant="panel" />
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-white pb-16 pt-4 sm:pb-20 sm:pt-6">
        <Container className={contentWidth}>
          <div className="flex flex-col items-center text-center">
            <Link
              href="/quote"
              className="inline-flex rounded-[6px] bg-[#FF5548] px-8 py-3 text-sm font-bold text-white hover:bg-[#e04337] sm:text-base"
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
                    className="relative aspect-[4/3]"
                  >
                    <Image
                      src={src}
                      alt={`${design.heading} option ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain"
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
