import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Headphones,
  Leaf,
  Package,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RelatedProductsCarousel } from "@/components/products/RelatedProductsCarousel";
import { RelatedBlogsCarousel } from "@/components/products/RelatedBlogsCarousel";
import ProductHero from "@/components/products/ProductHero";
import { ProductFloatingVideo } from "@/components/products/ProductFloatingVideo";
import { ProductFaq } from "@/components/products/ProductFaq";
import { FaqAccentHeading } from "@/components/ui/FAQAccordion";
import { RichText } from "@/components/ui/RichText";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  getProductFaqs,
  PRODUCT_TRUST_BADGES,
} from "@/data/product-page-content";
import { formatMoney } from "@/lib/cart";
import { isEmptyHtml } from "@/lib/html";
import type { ProductItem, RelatedBlogItem } from "@/types";

const trustIcons = {
  badge: Award,
  leaf: Leaf,
  headset: Headphones,
  truck: Truck,
  box: Package,
};

export default function ProductDetailPage({
  product,
  related,
  relatedBlogs = [],
}: {
  product: ProductItem;
  related: ProductItem[];
  relatedBlogs?: RelatedBlogItem[];
}) {
  const faqs = getProductFaqs(product);
  const cms = product.cms;
  const startingFrom = product.discountedPrice != null
    ? formatMoney(product.discountedPrice)
    : product.startingPrice
      ? formatMoney(product.startingPrice)
      : "Contact";
  const contentWidth = "max-w-[1180px]";
  const scrollOn = cms?.pageScrollEnabled !== false;
  const scrollImage = cms?.pageScrollImageUrl || product.imageUrl;

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-white">
        <Container className={`${contentWidth} py-4 sm:py-8 lg:py-10`}>
          <ProductHero
            product={product}
            startingFrom={startingFrom}
            breadcrumbs={[
              ...(product.breadcrumbs && product.breadcrumbs.length > 0
                ? product.breadcrumbs
                : [
                    {
                      label: product.categoryName
                        .toLowerCase()
                        .startsWith("custom ")
                        ? product.categoryName
                        : `Custom ${product.categoryName}`,
                      href: `/${product.categorySlug}`,
                    },
                  ]),
              { label: product.name },
            ]}
          />
        </Container>
      </section>

      <section className="bg-white py-5 sm:py-10">
        <Container className={contentWidth}>
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 py-4 sm:grid-cols-2 sm:gap-4 sm:px-5 sm:py-5 lg:grid-cols-5 lg:gap-2 lg:px-3 lg:py-4">
            {PRODUCT_TRUST_BADGES.map((badge) => {
              const Icon = trustIcons[badge.icon];
              return (
                <div
                  key={badge.title}
                  className="flex items-start gap-3 px-2 py-1 lg:flex-col lg:items-center lg:px-2 lg:text-center xl:flex-row xl:items-start xl:text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF7F6] text-[#21AAA5]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#172455]">
                      {badge.title}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-snug text-[#666]">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {cms?.videoUrl || (product as { videoUrl?: string }).videoUrl ? (
        <ProductFloatingVideo
          product={product}
          videoUrl={cms?.videoUrl || (product as { videoUrl?: string }).videoUrl!}
          posterUrl={
            cms?.videoThumbnailUrl ||
            (product as { videoThumbnailUrl?: string }).videoThumbnailUrl ||
            undefined
          }
          description={
            cms?.videoDescription ||
            (product as { videoDescription?: string }).videoDescription ||
            undefined
          }
          startingPrice={startingFrom}
        />
      ) : null}

      {scrollOn &&
      (scrollImage || !isEmptyHtml(cms?.pageScrollContent || "")) ? (
        <section className="bg-white py-6 sm:py-12 lg:py-16">
          <Container className={contentWidth}>
            <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 lg:gap-10 lg:h-[480px] xl:h-[520px]">
              {/* Left Column — Designated Image Frame (1200 × 900 px, 4:3) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm sm:rounded-[20px] lg:h-full">
                {scrollImage ? (
                  <SafeImage
                    src={scrollImage}
                    alt={cms?.pageScrollImageAlt || product.name}
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

              {/* Right Column — Scrollable Content Section with Coral Headings and Slim Scrollbar */}
              <div className="reliable-scroll flex max-h-[min(70vh,420px)] min-h-0 flex-col overflow-y-auto overflow-x-hidden pr-2 sm:h-[440px] sm:max-h-none sm:pr-4 lg:h-full">
                {!isEmptyHtml(cms?.pageScrollContent || "") ? (
                  <RichText
                    html={cms!.pageScrollContent!}
                    className="text-[14px] sm:text-[14.5px] leading-[1.75] text-[#4A5568] [&_h1]:text-[1.4rem] [&_h1]:font-bold [&_h1]:text-[#FF5548] [&_h1]:tracking-tight [&_h1]:mb-3 [&_h1]:mt-6 [&_h1:first-child]:mt-0 [&_h2]:text-[1.3rem] [&_h2]:font-bold [&_h2]:text-[#FF5548] [&_h2]:tracking-tight [&_h2]:mb-2.5 [&_h2]:mt-5 [&_h2:first-child]:mt-0 [&_h3]:text-[1.15rem] [&_h3]:font-bold [&_h3]:text-[#FF5548] [&_h3]:tracking-tight [&_h3]:mb-2 [&_h3]:mt-4 [&_h3:first-child]:mt-0 [&_h4]:text-[1.05rem] [&_h4]:font-bold [&_h4]:text-[#FF5548] [&_h4]:mb-2 [&_h4]:mt-3 [&_p]:mb-3.5 [&_p]:leading-[1.75] [&_p:last-child]:mb-0 [&_ul]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5"
                  />
                ) : null}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section className="bg-[#F6F8FA] py-8 sm:py-10 lg:py-12">
          <Container className={contentWidth}>
            <div className="max-w-2xl text-left">
              <FaqAccentHeading
                text={
                  cms?.faqsHeading?.trim() ||
                  `Frequently Asked Questions About ${product.name}`
                }
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
                      alt={cms.faqsImageAlt || `${product.name} FAQs`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 480px"
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                {/* FAQ List: max-h aligned with image, clean scroll if many, fits in view */}
                <div className="flex min-w-0 flex-col justify-between lg:col-span-7">
                  <div className="max-h-[320px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                    <ProductFaq items={faqs} />
                  </div>
                  <div className="mt-3.5 flex items-center justify-between border-t border-gray-200/80 pt-2.5">
                    <div>
                      <p className="font-heading text-xs font-bold text-[#172455] sm:text-[13px]">
                        Have a technical question?
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        Our packaging experts are available Monday–Friday.
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
              <div className="mt-6 max-w-3xl">
                <ProductFaq items={faqs} />
              </div>
            )}
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="bg-[#F6F8FA] py-6 sm:py-12 lg:py-16">
          <Container className={contentWidth}>
            <h2 className="text-left font-heading text-2xl font-extrabold tracking-tight text-[#111] sm:text-3xl">
              {cms?.relevantProductsHeading || "Related Products"}
            </h2>
            {cms?.relevantProductsDescription ? (
              <p className="mt-2 max-w-2xl text-left text-sm text-[#666]">
                {cms.relevantProductsDescription}
              </p>
            ) : null}
            <RelatedProductsCarousel products={related} />
          </Container>
        </section>
      ) : null}

      {relatedBlogs.length > 0 ? (
        <section className="bg-[#F6F8FA] py-8 sm:py-12 lg:py-16">
          <Container className={contentWidth}>
            <div className="max-w-2xl text-left">
              <FaqAccentHeading
                text={
                  cms?.relatedBlogsHeading?.trim() ||
                  "Explore More Packaging Guides"
                }
              />
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6B7280] sm:text-[15px]">
                {cms?.relatedBlogsDescription?.trim() ||
                  "Continue learning with practical packaging guides, material tips, and helpful resources for your next custom box project."}
              </p>
            </div>

            <RelatedBlogsCarousel blogs={relatedBlogs} />
          </Container>
        </section>
      ) : null}
    </div>
  );
}
