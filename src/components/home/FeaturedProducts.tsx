import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getFeaturedProducts } from "@/lib/catalog";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(6);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <SectionHeading
            badge="Verified Live Catalog"
            title="Featured Custom Packaging"
            description="Explore popular custom packaging formats crafted for retail shelves, e-commerce unboxing, and secure shipping."
            align="left"
            className="mb-0 max-w-2xl"
          />

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#21AAA5] hover:text-[#172455] transition-colors whitespace-nowrap"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={products} columns={3} />
      </Container>
    </section>
  );
}
