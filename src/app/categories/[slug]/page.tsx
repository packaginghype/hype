import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/categories/CategoryDetailPage";
import { getAllProducts, getCategoryBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} | Custom Packaging Manufacturer`,
    description: category.description,
  };
}

export default async function CategoryDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getAllProducts({ categorySlug: category.slug });

  return <CategoryDetailPage category={category} products={products} />;
}
