import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryProductCard } from "@/components/categories/CategoryProductCard";
import { CATALOG_TILE } from "@/components/ui/CatalogTile";
import { SearchHeroForm } from "@/components/search/SearchHeroForm";
import { getProductsPaged } from "@/lib/catalog";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";

export const revalidate = 120;

const PAGE_SIZE = 24;

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  if (!query) {
    return {
      title: "Search Products | Custom Packaging",
      description:
        "Search Packaging Hype for custom boxes, mailers, rigid packaging, and more.",
    };
  }
  return {
    title: `Search Results for: ${query}`,
    description: `Explore custom packaging products matching “${query}”. Find boxes, styles, and materials at Packaging Hype.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() || "";
  const pageNum = Math.max(1, Number.parseInt(pageParam || "1", 10) || 1);

  const paged = query
    ? await getProductsPaged({
        query,
        page: pageNum,
        pageSize: PAGE_SIZE,
      })
    : { products: [], total: 0, page: 1, totalPages: 1 };

  const { products, total, page, totalPages } = paged;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — soft teal banner, matches category/home theme */}
      <section className="bg-[#E8F5F2]">
        <div className="mx-auto w-full max-w-[95%] px-4 py-10 sm:max-w-[85%] sm:px-6 sm:py-16 md:max-w-[80%] lg:max-w-[75%] lg:py-20 xl:max-w-[65%] 2xl:max-w-[60%]">
          <h1 className="text-center text-2xl font-bold text-[#172455] sm:text-3xl">
            {query ? (
              <>
                Search Results for:{" "}
                <span className="text-[#FF5548]">{query}</span>
              </>
            ) : (
              "Search Products"
            )}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-[#4B5563] sm:text-[15px]">
            Explore our range of products that match exactly what you&apos;re
            looking for. Still have questions? Enter a new search below or contact
            us through live chat, one of our online forms, or give us a call at{" "}
            <a
              href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
              className="font-semibold text-[#21AAA5] underline-offset-2 hover:underline"
            >
              {VERIFIED_BUSINESS_INFO.phone}
            </a>{" "}
            to speak with a representative now.
          </p>
          <SearchHeroForm initialQuery={query} />
        </div>
      </section>

      <Container className="mx-auto max-w-[1400px] px-5 pb-10 pt-10 sm:px-10 sm:pt-14">
        {query ? (
          <>
            <div className="pb-6">
              <h2 className="text-2xl font-semibold text-[#172455] sm:text-3xl">
                {query}
              </h2>
              <p className="mt-3 max-w-[68%] text-[15px] leading-relaxed text-[#4B5563] sm:text-base">
                Supercharge your brand through the power of custom boxes and custom
                packaging that&apos;s big on wow-factor. With low minimums, free
                design expertise, super fast delivery and unlimited customization.
              </p>
              <p className="mt-2 text-sm text-[#6B7280]">
                {total} result{total === 1 ? "" : "s"} found
              </p>
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                <p className="text-sm font-medium text-gray-500">
                  No products matched “{query}”.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Try a different keyword, or{" "}
                  <Link
                    href="/product"
                    className="font-semibold text-[#FF5548] hover:underline"
                  >
                    browse the full catalog
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <>
                <div className={CATALOG_TILE.grid}>
                  {products.map((product) => (
                    <CategoryProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <p className="text-[13px] text-gray-500">
                      Showing {(page - 1) * PAGE_SIZE + 1}–
                      {Math.min(page * PAGE_SIZE, total)} of {total}
                    </p>
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      basePath="/search"
                      params={{ q: query }}
                    />
                  </div>
                ) : null}
              </>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <p className="text-base font-semibold text-[#172455]">
              Start typing above to find packaging
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Search by product name, material, or style — or{" "}
              <Link
                href="/product"
                className="font-semibold text-[#FF5548] hover:underline"
              >
                view all products
              </Link>
              .
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
