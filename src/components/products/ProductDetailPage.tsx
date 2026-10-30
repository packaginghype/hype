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
        <Container className={`${contentWidth} py-6 sm:py-8 lg:py-10`}>
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

      <section className="bg-white py-8 sm:py-10">
        <Container className={contentWidth}>
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#E5E7EB] bg-white px-4 py-5 sm:grid-cols-2 sm:px-5 lg:grid-cols-5 lg:gap-2 lg:px-3 lg:py-4">
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
        <section className="bg-white py-12 sm:py-16">
          <Container className={contentWidth}>
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-10 lg:h-[480px] xl:h-[520px]">
              {/* Left Column — Designated Image Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto h-[320px] sm:h-[380px] lg:h-full w-full overflow-hidden rounded-[16px] sm:rounded-[20px] bg-[#F1F3F5] shadow-sm">
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
              <div className="reliable-scroll flex flex-col h-[400px] sm:h-[440px] lg:h-full min-h-0 overflow-y-auto overflow-x-hidden pr-3 sm:pr-4">
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
        <section className="bg-white py-12 sm:py-16">
          <Container className={contentWidth}>
            <div className={cms?.faqsImageUrl ? "max-w-2xl text-left" : "mx-auto max-w-3xl text-center"}>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#111] sm:text-3xl">
                {cms?.faqsHeading || "Frequently Asked Questions"}
              </h2>
              <p className="mt-2 text-sm text-[#888] sm:text-[15px]">
                {cms?.faqsSubheading ||
                  `Here are some common questions about ${product.name.toLowerCase()}.`}
              </p>
            </div>

            {cms?.faqsImageUrl ? (
              <div className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:mt-10 lg:grid-cols-2 lg:gap-6 lg:h-[540px] xl:h-[580px]">
                <div className="relative min-h-[280px] overflow-hidden rounded-[16px] bg-[#EAF2ED] sm:min-h-[340px] lg:min-h-0 lg:h-full">
                  <SafeImage
                    src={cms.faqsImageUrl}
                    alt={cms.faqsImageAlt || `${product.name} FAQs`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />

                </div>

                <div className="flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-[#E5E9F0] bg-white lg:h-full">
                  <div className="faq-scroll min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-5 sm:py-3">
                    <ProductFaq items={faqs} />
                  </div>
                  <div className="shrink-0 border-t border-[#E5E9F0] bg-[#F8FAFC] px-4 py-4 sm:px-5">
                    <p className="text-[13px] font-bold text-[#172455]">
                      Have a technical question?
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#6B7280]">
                      Our packaging experts are available Monday–Friday.
                    </p>
                    <Link
                      href="/contact-us"
                      className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#21AAA5] transition-colors hover:text-[#FF5548]"
                    >
                      Contact support
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto mt-8 max-w-3xl">
                <ProductFaq items={faqs} />
              </div>
            )}
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="bg-[#F6F8FA] py-12 sm:py-16">
          <Container className={contentWidth}>
            <h2 className="text-center font-heading text-2xl font-extrabold tracking-tight text-[#111] sm:text-3xl">
              {cms?.relevantProductsHeading || "Related Products"}
            </h2>
            {cms?.relevantProductsDescription ? (
              <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[#666]">
                {cms.relevantProductsDescription}
              </p>
            ) : null}
            <RelatedProductsCarousel products={related} />
          </Container>
        </section>
      ) : null}

      {relatedBlogs.length > 0 ? (
        <section className="border-t border-gray-100 bg-white py-12 sm:py-16">
          <Container className={contentWidth}>
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
                Packaging Guides & Insights
              </span>
              <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#111] sm:text-3xl">
                {cms?.relatedBlogsHeading || "Related Articles & Packaging Guides"}
              </h2>
              {cms?.relatedBlogsDescription ? (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#666] sm:text-[15px]">
                  {cms.relatedBlogsDescription}
                </p>
              ) : null}
            </div>

            <RelatedBlogsCarousel blogs={relatedBlogs} />
          </Container>
        </section>
      ) : null}
    </div>
  );
}
