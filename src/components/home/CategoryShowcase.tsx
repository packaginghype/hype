import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { VERIFIED_CATEGORIES } from "@/data/verified-data";

export function CategoryShowcase() {
  // Showcase top 8 popular packaging categories
  const featuredCategories = VERIFIED_CATEGORIES.slice(0, 8);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <SectionHeading
            badge="Tailored Packaging Solutions"
            title="Explore Packaging by Category"
            description="Discover our extensive range of custom boxes, bags, and cartons engineered specifically for your product's weight, dimensions, and shelf presentation."
            align="left"
            className="mb-0 max-w-2xl"
          />

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#21AAA5] hover:text-[#172455] transition-colors whitespace-nowrap"
          >
            <span>View All 20 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
