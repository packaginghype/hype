import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/products/ProductDetailPage";
import {
  getProductBySlug,
  getProductRelatedBlogs,
  getRelatedProducts,
} from "@/lib/catalog";
import { stripHtml } from "@/lib/html";

export const revalidate = 120;

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
    `${product.name} | Custom Box Manufacturer`;
  const description =
    (seoOn && product.cms?.seoDescription) ||
    stripHtml(product.description) ||
    product.description;

  return {
    title,
    description,
    keywords: seoOn ? product.cms?.seoKeywords || undefined : undefined,
    openGraph: {
      title,
      description,
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
    getRelatedProducts(product.categorySlug, product.slug, 4),
    getProductRelatedBlogs(product.cms?.relatedBlogIds || [], 4),
  ]);

  return (
    <>
      {product.cms?.seoEnabled !== false && product.cms?.seoScript ? (
        <div
          dangerouslySetInnerHTML={{ __html: product.cms.seoScript }}
          suppressHydrationWarning
        />
      ) : null}
      <ProductDetailPage
        product={product}
        related={related}
        relatedBlogs={relatedBlogs}
      />
    </>
  );
}
