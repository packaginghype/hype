function cleanHeadingHtml(raw: string): string {
  if (!raw) return "";
  let s = raw.trim();
  s = s.replace(/^<(?:h[1-6]|p)[^>]*>/i, "").replace(/<\/(?:h[1-6]|p)>$/i, "").trim();
  s = s.replace(/<\/(?:h[1-6]|p)>\s*<(?:h[1-6]|p)[^>]*>/gi, "<br />");
  return s;
}

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SafeImage } from "@/components/ui/SafeImage";
import { CategoryQuoteForm } from "@/components/categories/CategoryQuoteForm";
import { CategoryProductGrid } from "@/components/categories/CategoryProductGrid";
import { CATALOG_TILE } from "@/components/ui/CatalogTile";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CATEGORY_GROUP_META, type CategoryGroupKey } from "@/lib/category-groups";
import { FAQAccordion, FaqAccentHeading } from "@/components/ui/FAQAccordion";
import { RichText } from "@/components/ui/RichText";
import {
  getCategoryAboutContent,
  getCategoryHeroCopy,
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

  const groupKey = (category.group || "categories") as CategoryGroupKey;
  const groupMeta = CATEGORY_GROUP_META[groupKey] || CATEGORY_GROUP_META.categories;
  const breadcrumbItems = [
    {
      label: groupMeta.singularLabel,
      href: groupMeta.publicHref,
    },
    {
      label: category.name,
    },
  ];

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

          <Container className={`relative z-10 ${contentWidth} pt-3 sm:pt-4 lg:pt-5`}>
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8 lg:min-h-[340px] xl:min-h-[360px]">
              <div className="flex flex-col justify-start text-left min-w-0 lg:min-h-[340px] xl:min-h-[360px]">
                <Breadcrumbs
                  variant="slash"
                  items={breadcrumbItems}
                  className="mb-2 sm:mb-2.5"
                />
                <h1
                  style={{ lineHeight: 1.08 }}
                  className="banner-heading m-0 font-heading text-[1.75rem] font-extrabold tracking-tight text-[#111111] leading-[1.08] sm:text-[2.1rem] sm:leading-[1.08] lg:text-[2.35rem] lg:leading-[1.08]"
                >
                  {!isEmptyHtml(cms?.bannerHeading || "") ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: cleanHeadingHtml(cms!.bannerHeading!),
                      }}
                    />
                  ) : (
                    heroTitle
                  )}
                </h1>

                <div className="mt-3 max-h-[260px] space-y-2.5 overflow-y-auto pr-1.5 text-left text-[13.5px] leading-[1.65] text-[#2a2a2a] [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin] sm:max-h-[280px] sm:text-[14px] lg:max-h-[300px] xl:max-h-[320px]">
                  {!isEmptyHtml(cms?.bannerDescription || "") ? (
                    <RichText
                      html={cms!.bannerDescription!}
                      className="text-left"
                    />
                  ) : !isEmptyHtml(category.description) &&
                    category.description.includes("<") ? (
                    <RichText
                      html={category.description}
                      className="text-left"
                    />
                  ) : (
                    hero.paragraphs.map((p, i) => (
                      <p key={i} className="text-left">
                        {p}
                      </p>
                    ))
                  )}
                </div>
              </div>

              <div className="relative mx-auto flex h-[240px] w-full max-w-[380px] items-center justify-center bg-transparent sm:h-[300px] sm:max-w-[420px] lg:mx-0 lg:h-[340px] xl:h-[360px] lg:max-w-none">
                {heroImage ? (
                  <SafeImage
                    src={heroImage}
                    alt={heroImageAlt}
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
                  originalPrice={cms?.originalPrice}
                  discountedPrice={cms?.discountedPrice}
                  inStock={cms?.inStock}
                  priceUnit="per box"
                  startingFrom={
                    cms?.discountedPrice != null
                      ? "$" + Number(cms.discountedPrice).toFixed(2)
                      : cms?.originalPrice != null
                        ? "$" + Number(cms.originalPrice).toFixed(2)
                        : "$0.85"
                  }
                  cartItem={{
                    id: `category:${category.id}`,
                    slug: category.slug,
                    name: heroTitle,
                    imageUrl: heroImage,
                    unitPrice: cms?.discountedPrice ?? cms?.originalPrice ?? null,
                    href:
                      category.group === "industries"
                        ? `/${category.slug}`
                        : `/${category.slug}`,
                  }}
                />
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      {listingOn ? (
        <section className="bg-white pt-10 pb-4 sm:pt-12 sm:pb-6 lg:pt-14 lg:pb-6">
          <Container className={contentWidth}>
            <div className="text-left">
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#0B1220] sm:text-3xl text-left">
                {cms?.listingHeading || "Explore Packaging Solutions"}
              </h2>
              {!isEmptyHtml(cms?.listingText || "") ? (
                <div className="mt-3.5 max-w-3xl text-left text-[14px] leading-relaxed text-[#555] [&_p]:text-left">
                  <RichText html={cms!.listingText!} className="text-left" />
                </div>
              ) : null}
            </div>

            <div className="mt-10">
              {products.length > 0 ? (
                <CategoryProductGrid products={products} />
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
        <section className="bg-white pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-6 lg:pb-14">
          <Container className={contentWidth}>
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-10 lg:h-[480px] xl:h-[520px]">
              {/* Left Column — 900 × 900 px (1:1) */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm sm:rounded-[20px] lg:h-full">
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
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <Package className="h-16 w-16" />
                  </div>
                )}
              </div>

              <div className="reliable-scroll flex h-[400px] min-h-0 flex-col overflow-y-auto overflow-x-hidden pr-3 sm:h-[440px] sm:pr-4 lg:h-full">
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

      


      {hasFaqs ? (
        <section className="bg-[#F6F8FA] py-8 sm:py-10 lg:py-12">
          <Container className={contentWidth}>
            <div
              className={
                cms?.faqsImageUrl
                  ? "max-w-2xl text-left"
                  : "mx-auto max-w-2xl text-center"
              }
            >
              <FaqAccentHeading
                text={
                  cms?.faqsHeading?.trim() ||
                  `Frequently Asked Questions About ${heroTitle}`
                }
                className={cms?.faqsImageUrl ? undefined : "text-center"}
              />
              {cms?.faqsSubheading ? (
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280] sm:text-[15px]">
                  {cms.faqsSubheading}
                </p>
              ) : null}
            </div>

            {cms?.faqsImageUrl ? (
              <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-8">
                {/* Image: compact, restrained size so section fits cleanly in first view */}
                <div className="min-w-0 lg:col-span-5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-sm">
                    <SafeImage
                      src={cms.faqsImageUrl}
                      alt={cms.faqsImageAlt || `FAQs about ${heroTitle}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 480px"
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                {/* FAQ List: max-h aligned with image, clean scroll if many, fits in view */}
                <div className="flex min-w-0 flex-col justify-between lg:col-span-7">
                  <div className="max-h-[320px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                    <FAQAccordion items={cms!.faqs} variant="pills" />
                  </div>
                  <div className="mt-3.5 flex items-center justify-between border-t border-gray-200/80 pt-2.5">
                    <div>
                      <p className="font-heading text-xs font-bold text-[#172455] sm:text-[13px]">
                        Still have a question?
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        Our team is here to assist with sizing, materials, and design.
                      </p>
                    </div>
                    <Link
                      href="/contact-us"
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF5548] hover:underline"
                    >
                      Contact support
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto mt-6 max-w-3xl">
                <FAQAccordion items={cms!.faqs} variant="pills" />
              </div>
            )}
          </Container>
        </section>
      ) : null}

      
    </div>
  );
}
