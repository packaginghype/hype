import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getProductBySlug } from "@/lib/catalog";
import { VERIFIED_FAQS } from "@/data/verified-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Packaging Product Not Found" };
  }

  return {
    title: `${product.name} | Custom Box Manufacturer`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Packaging Hype`,
      description: product.description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container>
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: product.categoryName, href: `/categories/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden p-6 sm:p-10 shadow-sm">
              <div className="relative w-full aspect-square bg-[#F6F8FA] rounded-xl flex items-center justify-center p-6 overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 550px"
                    className="object-contain p-4"
                    priority
                  />
                ) : (
                  <Package className="w-20 h-20 text-gray-300" />
                )}
                <div className="absolute top-4 left-4 bg-[#172455] text-white text-xs font-bold px-3 py-1 rounded">
                  {product.categoryName}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172455] tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <p className="text-sm text-gray-600">
                    Starting from{" "}
                    <span className="font-bold text-[#FF5548]">
                      {product.startingPrice
                        ? `$${product.startingPrice.toFixed(2)}`
                        : "Contact"}
                    </span>{" "}
                    per box
                  </p>
                  <AddToCartButton
                    item={{
                      id: `product:${product.id}`,
                      slug: product.slug,
                      name: product.name,
                      imageUrl: product.imageUrl,
                      unitPrice: product.startingPrice ?? null,
                      quantity: 1,
                      href: `/products/${product.slug}`,
                    }}
                    className="px-4 py-2.5"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#F6F8FA] rounded-lg">
                  <span className="text-gray-400 block font-semibold uppercase">
                    Min. Order (MOQ)
                  </span>
                  <span className="text-sm font-bold text-[#172455]">
                    {product.minQuantity} Units
                  </span>
                </div>
                <div className="p-3 bg-[#F6F8FA] rounded-lg">
                  <span className="text-gray-400 block font-semibold uppercase">
                    Turnaround
                  </span>
                  <span className="text-sm font-bold text-[#172455]">{product.leadTime}</span>
                </div>
                <div className="p-3 bg-[#F6F8FA] rounded-lg">
                  <span className="text-gray-400 block font-semibold uppercase">Shipping</span>
                  <span className="text-sm font-bold text-[#21AAA5]">Free Across USA</span>
                </div>
                <div className="p-3 bg-[#F6F8FA] rounded-lg">
                  <span className="text-gray-400 block font-semibold uppercase">Setup Fees</span>
                  <span className="text-sm font-bold text-[#21AAA5]">$0 Die & Plate Charges</span>
                </div>
              </div>

              {product.materials && product.materials.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Available Material Stocks
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((mat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-[#F6F8FA] border border-gray-200 text-xs font-medium text-gray-700"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.finishes && product.finishes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Decorative Surface Finishes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.finishes.map((fin, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-[#eaf7f6] border border-[#21AAA5]/20 text-xs font-semibold text-[#21AAA5]"
                      >
                        {fin}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#172455] mb-4">
                Frequently Asked Questions for {product.name}
              </h3>
              <FAQAccordion items={VERIFIED_FAQS.slice(0, 4)} />
            </div>
          </div>

          <div className="lg:col-span-6 sticky top-24">
            <div className="mb-4">
              <span className="text-xs font-bold text-[#21AAA5] uppercase tracking-wider block">
                Instant Configuration
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#172455]">
                Configure Quote for {product.name}
              </h2>
            </div>
            <QuoteRequestForm initialProductName={product.name} />
          </div>
        </div>
      </Container>
    </div>
  );
}
