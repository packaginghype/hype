import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SafeImage } from "@/components/ui/SafeImage";
import { QuoteCTA } from "@/components/ui/QuoteCTA";
import {
  ProductsCatalogSearch,
  ProductsLoadMoreGrid,
} from "@/components/products/ProductsCatalogClient";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Custom Packaging Products & Boxes Catalog",
  description:
    "Find the perfect packaging solution tailored to your business needs. Browse our wholesale catalog of custom boxes organized by industry — retail, e-commerce, food, cosmetics, and more.",
};

export const revalidate = 120;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const products = await getAllProducts({
    query: query || undefined,
  });

  const heroImage =
    products.find((p) => p.imageUrl)?.imageUrl ||
    "/images/hero-packaging.jpg";

  return (
    <div className="min-h-screen bg-white">
      <Container className="pb-6 pt-6 sm:pb-8 sm:pt-8 lg:pt-10">
        {/* Breadcrumbs — Erixum style: Home > Products */}
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-gray-600 min-[1200px]:mb-2 min-[1400px]:mb-6">
          <ol className="inline space-x-2">
            <li className="inline items-center">
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-[#FF5548]"
              >
                Home
              </Link>
              <span className="mx-2 text-gray-400">&gt;</span>
            </li>
            <li className="inline items-center">
              <span className="font-medium text-[#172455]">Products</span>
            </li>
          </ol>
        </nav>

        {/* Hero: copy + CTA | image */}
        <div className="grid grid-cols-1 items-start justify-center gap-8 min-[1200px]:grid-cols-2 min-[1400px]:grid-cols-[1fr_648px] xl:gap-16">
          <div>
            <h1 className="font-heading text-[24px] font-bold leading-8 text-[#172455] md:text-[36px] md:leading-[44px]">
              {query
                ? `Search results for “${query}”`
                : "Packaging Boxes Solutions by Industry Needs"}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#374151] md:mt-6">
              {query
                ? `${products.length} product${products.length === 1 ? "" : "s"} matched your search. Refine your query or browse the full catalog below.`
                : "Find the perfect packaging solution tailored to your business needs. Our premium packaging collection is thoughtfully organized by industry from retail and e-commerce to food, cosmetics, and more. Each solution is designed to provide specialized protection, enhance product presentation, and strengthen your brand identity, ensuring your products stand out while staying safe and professionally packaged."}
            </p>
            <div className="mt-4 text-center sm:text-start">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FF5548] px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[#e04337] sm:text-lg"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[240px] w-full overflow-hidden rounded-2xl bg-[#F6F8FA] min-[1200px]:h-[450px] min-[1400px]:h-[523px]">
            <SafeImage
              src={heroImage}
              alt="Custom printed packaging wholesale boxes"
              fill
              sizes="(max-width: 1200px) 100vw, 648px"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Search */}
        <div className="mt-10 sm:mt-12">
          <ProductsCatalogSearch initialQuery={query} />
        </div>

        {/* Product grid heading */}
        <div>
          <h2 className="font-heading text-3xl font-extrabold text-[#172455]">
            Discover Popular Packaging Boxes
          </h2>
          <p className="mt-2 max-w-4xl text-base leading-relaxed text-[#4B5563]">
            Supercharge your brand through the power of custom boxes and custom
            packaging that&apos;s big on wow-factor. With low minimums, free
            design expertise, super fast delivery and unlimited customization
          </p>
        </div>

        <ProductsLoadMoreGrid products={products} />
      </Container>

      <div className="mt-4 sm:mt-8">
        <QuoteCTA />
      </div>
    </div>
  );
}
