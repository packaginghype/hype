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
import { CategoryProductCard } from "@/components/categories/CategoryProductCard";
import ProductHero from "@/components/products/ProductHero";
import { ProductFaq } from "@/components/products/ProductFaq";
import { RichText } from "@/components/ui/RichText";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  getProductAboutContent,
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
  const about = getProductAboutContent(product);
  const faqs = getProductFaqs(product);
  const cms = product.cms;
  const startingFrom = product.startingPrice
    ? formatMoney(product.startingPrice)
    : "Contact";
  const contentWidth = "max-w-[1180px]";
  const detailHtml =
    cms?.detailShortDescription || product.fullDescription || "";
  const scrollOn = cms?.pageScrollEnabled !== false;
  const specs = cms?.specs || [];

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
                      href: `/categories/${product.categorySlug}`,
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

      <section className="bg-white py-10 sm:py-14">
        <Container className={contentWidth}>
          {cms?.detailHeading ? (
            <h2 className="mb-6 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
              {cms.detailHeading}
            </h2>
          ) : null}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 lg:h-[480px] xl:h-[520px]">
            <div className="relative aspect-[4/3] min-h-0 overflow-hidden rounded-[16px] bg-[#F3F1EE] lg:aspect-auto lg:h-full">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={cms?.thumbnailAlt || product.name}
                  title={cms?.thumbnailTitle || product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 sm:p-6"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <Package className="h-14 w-14" />
                </div>
              )}
            </div>

            <div className="reliable-scroll h-[420px] min-h-0 overflow-y-auto pr-3 sm:h-[460px] lg:h-full">
              {!isEmptyHtml(detailHtml) ? (
                <RichText
                  html={detailHtml}
                  className="text-[15px] leading-[1.7] text-[#555]"
                />
              ) : (
                <>
                  <p className="text-[15px] leading-[1.7] text-[#555]">
                    {about.intro}
                  </p>
                  <h2 className="mt-6 text-[1.45rem] font-semibold leading-snug tracking-tight text-[#FF5548] sm:text-[1.7rem]">
                    {about.heading}
                  </h2>
                  <p className="mt-4 text-[15px] leading-[1.7] text-[#555]">
                    {about.body}
                  </p>
                </>
              )}
              {!isEmptyHtml(cms?.thumbnailSubDescription || "") ? (
                <div className="mt-6">
                  <RichText
                    html={cms!.thumbnailSubDescription!}
                    className="text-[15px] leading-[1.7] text-[#555]"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {cms?.videoUrl ? (
        <section className="bg-[#F6F8FA] py-12 sm:py-16">
          <Container className={contentWidth}>
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div className="overflow-hidden rounded-[12px] bg-black">
                <video
                  controls
                  poster={cms.videoThumbnailUrl || undefined}
                  className="aspect-video w-full"
                  preload="metadata"
                >
                  <source src={cms.videoUrl} type="video/mp4" />
                </video>
              </div>
              {cms.videoDescription ? (
                <p className="text-[15px] leading-relaxed text-[#555]">
                  {cms.videoDescription}
                </p>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      {(cms?.specsHeading || specs.length > 0) && (
        <section className="bg-white py-12 sm:py-16">
          <Container className={contentWidth}>
            {cms?.specsHeading ? (
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
                {cms.specsHeading}
              </h2>
            ) : null}
            {!isEmptyHtml(cms?.specsDescription || "") ? (
              <div className="mt-4 max-w-3xl">
                <RichText
                  html={cms!.specsDescription!}
                  className="text-[15px] leading-[1.7] text-[#555]"
                />
              </div>
            ) : null}
            {cms?.specsTableHeading ? (
              <h3 className="mt-8 text-lg font-bold text-[#172455]">
                {cms.specsTableHeading}
              </h3>
            ) : null}
            {specs.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-[8px] border border-[#E5E7EB]">
                <table className="min-w-full text-left text-sm">
                  <tbody>
                    {specs.map((row) => (
                      <tr
                        key={`${row.heading}-${row.details.slice(0, 12)}`}
                        className="border-b border-[#E5E7EB] last:border-b-0"
                      >
                        <th className="w-[34%] bg-[#F6F8FA] px-4 py-3 font-bold text-[#172455]">
                          {row.heading}
                        </th>
                        <td className="px-4 py-3 text-[#4B5563]">{row.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </Container>
        </section>
      )}

      {scrollOn &&
      (cms?.pageScrollImageUrl || !isEmptyHtml(cms?.pageScrollContent || "")) ? (
        <section className="bg-[#F6F8FA] py-12 sm:py-16">
          <Container className={contentWidth}>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              {cms?.pageScrollImageUrl ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-white">
                  <SafeImage
                    src={cms.pageScrollImageUrl}
                    alt={cms.pageScrollImageAlt || product.name}
                    title={cms.pageScrollImageTitle || product.name}
                    fill
                    className="object-contain p-4 sm:p-6"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              {!isEmptyHtml(cms?.pageScrollContent || "") ? (
                <RichText
                  html={cms!.pageScrollContent!}
                  className="text-[15px] leading-[1.7] text-[#555]"
                />
              ) : null}
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
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F1839]/45 via-transparent to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="max-w-xs text-[13px] font-semibold leading-snug text-white sm:text-sm">
                      Custom sizes, materials, and finishes — built for your brand.
                    </p>
                    <Link
                      href="/quote"
                      className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-white transition-colors hover:text-[#FF5548]"
                    >
                      Get a free quote
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
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
            <div className="mt-8 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
              {related.slice(0, 4).map((item) => (
                <CategoryProductCard key={item.id} product={item} />
              ))}
            </div>
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

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedBlogs.map((blog) => {
                const img =
                  blog.thumbnailImageUrl ||
                  blog.featuredImage ||
                  "/images/blog-mailer-boxes.jpg";
                return (
                  <article
                    key={blog.id}
                    className="group flex flex-col overflow-hidden rounded-[14px] border border-[#E8EAEF] bg-white shadow-sm transition-all duration-300 hover:border-[#FF5548]/40 hover:shadow-md"
                  >
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="relative aspect-[16/10] w-full overflow-hidden bg-[#F6F8FA]"
                    >
                      <SafeImage
                        src={img}
                        alt={blog.title}
                        fallbackSrc="/images/blog-mailer-boxes.jpg"
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized={img.startsWith("http")}
                      />
                    </Link>

                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF5548]">
                        Guide
                      </p>
                      <h3 className="mt-1.5 text-[15px] font-bold leading-snug text-[#172455] transition-colors group-hover:text-[#FF5548]">
                        <Link href={`/blog/${blog.slug}`} className="focus:outline-none">
                          {blog.title}
                        </Link>
                      </h3>
                      {blog.excerpt ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                          {blog.excerpt}
                        </p>
                      ) : null}

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-[#172455] transition-colors hover:text-[#FF5548]"
                        >
                          Read Article →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
