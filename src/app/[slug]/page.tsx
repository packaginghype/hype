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
    return { title: "Page Not Found" };
  }

  const seoOn = category.cms?.seoEnabled !== false;
  const title =
    seoOn && category.cms?.seoTitle ? category.cms.seoTitle : category.name;
  const description =
    seoOn && category.cms?.seoDescription
      ? category.cms.seoDescription
      : stripHtml(category.description);

  return {
    title,
    description,
    keywords: seoOn ? category.cms?.seoKeywords || undefined : undefined,
    alternates: {
      canonical: `https://packaginghype.com/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://packaginghype.com/${slug}`,
    },
  };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Single lookup covers both categories and industries
  // (both are stored in the same Category table with a `type` discriminator)
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getAllProducts({ categorySlug: category.slug });

  return <CategoryDetailPage category={category} products={products} />;
}

