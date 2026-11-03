import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/categories/CategoryDetailPage";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
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

  const canonical =
    (category.cms?.canonicalUrl || "").trim() ||
    `https://packaginghype.com/${slug}`;

  return {
    title,
    description,
    keywords: seoOn ? category.cms?.seoKeywords || undefined : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
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

  return (
    <>
      {category.cms?.seoEnabled !== false && category.cms?.seoScript ? (
        <JsonLdScript source={category.cms.seoScript} />
      ) : null}
      <CategoryDetailPage category={category} products={products} />
    </>
  );
}

