import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CategoryProductCard } from "@/components/categories/CategoryProductCard";
import { getFeaturedProducts } from "@/lib/catalog";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
              Best Sellers
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
              Trending & Popular Products
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-[15px]">
              Explore packaging formats brands reorder most — from retail cartons to
              e-commerce mailers.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center gap-2 rounded-[5px] bg-[#FF5548] px-5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#e04337]"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {products.map((product) => (
              <CategoryProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
