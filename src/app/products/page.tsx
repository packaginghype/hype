import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { QuoteCTA } from "@/components/ui/QuoteCTA";
import {
  getAllCategories,
  getAllProducts,
  getPublishedProductCount,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Custom Packaging Products & Boxes Catalog",
  description:
    "Browse our verified catalog of custom packaging boxes, folding cartons, corrugated mailers, and flexible barrier packaging. Wholesale pricing with low 100 MOQ.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const [products, categories, totalCount] = await Promise.all([
    getAllProducts({ categorySlug: category, query: q }),
    getAllCategories(),
    getPublishedProductCount(),
  ]);

  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: "Products Catalog" }]} />

        <div className="mt-6 mb-10">
          <SectionHeading
            badge="Wholesale Packaging Catalog"
            title={q ? `Search results for “${q}”` : "Custom Boxes & Packaging Products"}
            description={
              q
                ? `${products.length} product${products.length === 1 ? "" : "s"} matched your search.`
                : "Explore our range of custom manufactured packaging. Filter by industry category, review technical specifications, and request immediate factory quotes."
            }
            align="left"
            className="mb-6 max-w-3xl"
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                !category
                  ? "bg-[#172455] text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
              }`}
            >
              All Products ({totalCount})
            </Link>

            {categories.slice(0, 12).map((cat) => {
              const isActive = category === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-[#172455] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {cat.name}
                  {typeof cat.productCount === "number" ? ` (${cat.productCount})` : ""}
                </Link>
              );
            })}
          </div>
        </div>

        <ProductGrid products={products} columns={3} />
      </Container>

      <div className="mt-20">
        <QuoteCTA />
      </div>
    </div>
  );
}
