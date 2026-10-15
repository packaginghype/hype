import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryProductCard } from "@/components/categories/CategoryProductCard";
import { QuoteCTA } from "@/components/ui/QuoteCTA";
import {
  getAllCategories,
  getProductsPaged,
  getPublishedProductCount,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Custom Packaging Products & Boxes Catalog",
  description:
    "Browse our verified catalog of custom packaging boxes, folding cartons, corrugated mailers, and flexible barrier packaging. Wholesale pricing with low 100 MOQ.",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 16;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page: pageParam } = await searchParams;
  const pageNum = Math.max(1, Number.parseInt(pageParam || "1", 10) || 1);

  const [paged, categories, totalCount] = await Promise.all([
    getProductsPaged({
      categorySlug: category,
      query: q,
      page: pageNum,
      pageSize: PAGE_SIZE,
    }),
    getAllCategories(),
    getPublishedProductCount(),
  ]);

  const { products, total, page, totalPages } = paged;
  const filterParams = { category, q };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-14">
      <Container>
        <Breadcrumbs items={[{ label: "Products Catalog" }]} />

        <div className="mb-8 mt-6">
          <SectionHeading
            badge="Wholesale Packaging Catalog"
            title={q ? `Search results for “${q}”` : "Custom Boxes & Packaging Products"}
            description={
              q
                ? `${total} product${total === 1 ? "" : "s"} matched your search.`
                : `Browse ${totalCount} custom packaging products. Filter by category and open any card for details.`
            }
            align="left"
            className="mb-6 max-w-3xl"
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
            <Link
              href={q ? `/products?q=${encodeURIComponent(q)}` : "/products"}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                !category
                  ? "bg-[#172455] text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              All Products ({totalCount})
            </Link>

            {categories.slice(0, 12).map((cat) => {
              const isActive = category === cat.slug;
              const href = q
                ? `/products?category=${cat.slug}&q=${encodeURIComponent(q)}`
                : `/products?category=${cat.slug}`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#172455] text-white"
                      : "border border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {cat.name}
                  {typeof cat.productCount === "number"
                    ? ` (${cat.productCount})`
                    : ""}
                </Link>
              );
            })}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 py-16 text-center">
            <p className="text-sm font-medium text-gray-500">
              No packaging products found in this selection.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
              {products.map((product) => (
                <CategoryProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-[13px] text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <Pagination
                page={page}
                totalPages={totalPages}
                basePath="/products"
                params={filterParams}
              />
            </div>
          </>
        )}
      </Container>

      <div className="mt-16">
        <QuoteCTA />
      </div>
    </div>
  );
}
