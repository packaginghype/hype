import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetailPage } from "@/components/categories/CategoryDetailPage";
import { CustomPageView } from "@/components/pages/CustomPageView";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { getAllProducts, getCategoryBySlug, getNavCategories } from "@/lib/catalog";
import { getCustomPageBySlug } from "@/lib/custom-pages";
import { stripHtml } from "@/lib/html";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const nav = await getNavCategories();
    return (nav?.all || []).map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const customPage = await getCustomPageBySlug(slug);
  if (customPage) {
    const title = customPage.seoTitle || customPage.heading || customPage.title;
    const description =
      customPage.seoDescription || customPage.intro || undefined;
    const canonical =
      (customPage.seoCanonical || "").trim() ||
      `https://packaginghype.com/${slug}`;

    return {
      title,
      description,
      keywords: customPage.seoKeywords || undefined,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
      },
    };
  }

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

  const customPage = await getCustomPageBySlug(slug);
  if (customPage) {
    return (
      <CustomPageView
        title={customPage.title}
        eyebrow={customPage.eyebrow}
        heading={customPage.heading}
        intro={customPage.intro}
        content={customPage.content}
        sections={customPage.sections}
        layout={customPage.layout}
      />
    );
  }

  // Categories / industries / materials (same Category table)
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
