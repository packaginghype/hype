import React from "react";
import Image from "next/image";
import {
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
import {
  getProductAboutContent,
  getProductFaqs,
  PRODUCT_TRUST_BADGES,
} from "@/data/product-page-content";
import { formatMoney } from "@/lib/cart";
import type { ProductItem } from "@/types";

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
}: {
  product: ProductItem;
  related: ProductItem[];
}) {
  const about = getProductAboutContent(product);
  const faqs = getProductFaqs(product);
  const startingFrom = product.startingPrice
    ? formatMoney(product.startingPrice)
    : "Contact";
  const contentWidth = "max-w-[1180px]";

  return (
    <div className="bg-white">
      <section className="border-b border-gray-100 bg-white">
        <Container className={`${contentWidth} py-6 sm:py-8 lg:py-10`}>
          <ProductHero
            product={product}
            startingFrom={startingFrom}
            breadcrumbs={[
              {
                label: product.categoryName
                  .toLowerCase()
                  .startsWith("custom ")
                  ? product.categoryName
                  : `Custom ${product.categoryName}`,
                href: `/categories/${product.categorySlug}`,
              },
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 lg:h-[480px] xl:h-[520px]">
            <div className="relative aspect-[5/4] min-h-0 overflow-hidden rounded-[16px] bg-[#F3F1EE] lg:aspect-auto lg:h-full">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
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
              <p className="text-[15px] leading-[1.7] text-[#555]">{about.intro}</p>
              <h2 className="mt-6 text-[1.45rem] font-semibold leading-snug tracking-tight text-[#FF5548] sm:text-[1.7rem]">
                {about.heading}
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-[#555]">
                {about.body}
              </p>
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] text-[#444]">
                {about.styles.map((style) => (
                  <li key={style}>{style}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#F6F8FA] py-12 sm:py-16">
        <Container className={contentWidth}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#111] sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-[#888] sm:text-[15px]">
              Here are some common questions about {product.name.toLowerCase()}.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <ProductFaq items={faqs} />
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="bg-white py-12 sm:py-16">
          <Container className={contentWidth}>
            <h2 className="text-center font-heading text-2xl font-extrabold tracking-tight text-[#111] sm:text-3xl">
              Related Products
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
              {related.slice(0, 4).map((item) => (
                <CategoryProductCard key={item.id} product={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
