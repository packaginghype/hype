import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/categories/CategoryDetailPage";
import { getAllProducts, getCategoryBySlug } from "@/lib/catalog";
import { stripHtml } from "@/lib/html";

export const revalidate = 120;

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

  const title =
    category.cms?.seoEnabled !== false && category.cms?.seoTitle
      ? category.cms.seoTitle
      : `${category.name} | Custom Packaging Manufacturer`;
  const description =
    category.cms?.seoEnabled !== false && category.cms?.seoDescription
      ? category.cms.seoDescription
      : stripHtml(category.description);

  return {
    title,
    description,
    keywords: category.cms?.seoKeywords || undefined,
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
