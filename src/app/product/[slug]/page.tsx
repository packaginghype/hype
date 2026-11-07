import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/products/ProductDetailPage";
import {
  getAllProducts,
  getProductBySlug,
  getProductRelatedBlogs,
  getRelatedProducts,
} from "@/lib/catalog";
import { stripHtml } from "@/lib/html";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { PageFadeIn } from "@/components/ui/PageFadeIn";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const products = await getAllProducts({ limit: 50 });
    return products.map((p) => ({ slug: p.slug }));
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
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Packaging Product Not Found" };
  }

  const seoOn = product.cms?.seoEnabled !== false;
  const title =
    (seoOn && product.cms?.seoTitle) ||
    product.name;
  const description =
    (seoOn && product.cms?.seoDescription) ||
    stripHtml(product.description) ||
    product.description;

  const canonical =
    (product.cms?.canonicalUrl || "").trim() ||
    `https://packaginghype.com/product/${slug}`;

  return {
    title,
    description,
    keywords: seoOn ? product.cms?.seoKeywords || undefined : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

export default async function ProductDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [related, relatedBlogs] = await Promise.all([
    getRelatedProducts(product.categorySlug, product.slug, 12),
    getProductRelatedBlogs(product.cms?.relatedBlogIds || [], 12),
  ]);

  return (
    <PageFadeIn>
      {product.cms?.seoEnabled !== false && product.cms?.seoScript ? (
        <JsonLdScript source={product.cms.seoScript} />
      ) : null}
      <ProductDetailPage
        product={product}
        related={related}
        relatedBlogs={relatedBlogs}
      />
    </PageFadeIn>
  );
}
