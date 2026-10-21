import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories, allProducts, allBlogs] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        images: {
          orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        },
        specs: { orderBy: { sortOrder: "asc" } },
        faqs: { orderBy: { sortOrder: "asc" } },
        relatedFrom: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, group: true },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
      take: 500,
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedDate: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnailImageUrl: true,
      },
      take: 200,
    }),
  ]);

  if (!product) notFound();

  const primary = product.images.find((img) => img.isPrimary) || product.images[0];
  const industryIds = product.categories
    .filter((c) => c.category.group === "industries")
    .map((c) => c.categoryId);

  return (
    <div className="w-full max-w-none space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Edit Product</h2>
        <p className="mt-1 text-sm font-medium text-[#4B5563]">{product.name}</p>
      </div>
      <ProductForm
        productId={product.id}
        categories={categories}
        allProducts={allProducts}
        allBlogs={allBlogs}
        initial={{
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          fullDescription: product.fullDescription,
          sku: product.sku,
          startingPrice: product.startingPrice
            ? Number(product.startingPrice)
            : null,
          originalPrice: product.originalPrice
            ? Number(product.originalPrice)
            : product.startingPrice
              ? Number(product.startingPrice)
              : null,
          discountedPrice: product.discountedPrice
            ? Number(product.discountedPrice)
            : null,
          inStock: product.inStock,
          minQuantity: product.minQuantity,
          leadTimeDays: product.leadTimeDays,
          materialsAvailable: product.materialsAvailable,
          finishesAvailable: product.finishesAvailable,
          industryIds,
          materialCategoryId: product.materialCategoryId,
          breadcrumbCategoryId: product.breadcrumbCategoryId,
          breadcrumbCategoryIds:
            product.breadcrumbCategoryIds?.length > 0
              ? product.breadcrumbCategoryIds
              : product.breadcrumbCategoryId
                ? [product.breadcrumbCategoryId]
                : [],
          categoryIds: product.categories.map((c) => c.categoryId),
          thumbnailUrl: product.thumbnailUrl || primary?.imageUrl || "",
          thumbnailAlt: product.thumbnailAlt || primary?.altText || "",
          thumbnailTitle: product.thumbnailTitle || primary?.title || "",
          thumbnailSubDescription: product.thumbnailSubDescription,
          videoUrl: product.videoUrl,
          videoThumbnailUrl: product.videoThumbnailUrl,
          videoDescription: product.videoDescription,
          detailHeading: product.detailHeading,
          detailShortDescription: product.detailShortDescription,
          specsHeading: product.specsHeading,
          specsDescription: product.specsDescription,
          specsTableHeading: product.specsTableHeading,
          specs: product.specs.map((s) => ({
            heading: s.heading,
            details: s.details,
          })),
          widgetsContent: product.widgetsContent,
          relevantProductsHeading: product.relevantProductsHeading,
          relevantProductsDescription: product.relevantProductsDescription,
          relatedProductIds: product.relatedFrom.map((r) => r.relatedProductId),
          relatedBlogsHeading: product.relatedBlogsHeading,
          relatedBlogsDescription: product.relatedBlogsDescription,
          relatedBlogIds: product.relatedBlogIds || [],
          pageScrollEnabled: product.pageScrollEnabled,
          pageScrollImageUrl: product.pageScrollImageUrl,
          pageScrollImageAlt: product.pageScrollImageAlt,
          pageScrollImageTitle: product.pageScrollImageTitle,
          pageScrollContent: product.pageScrollContent,
          faqsHeading: product.faqsHeading,
          faqsSubheading: product.faqsSubheading,
          faqsImageUrl: product.faqsImageUrl,
          faqsImageAlt: product.faqsImageAlt,
          faqs: product.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          })),
          merchantImageUrls: product.merchantImageUrls,
          navbarEnabled: product.navbarEnabled,
          featureEnabled: product.featureEnabled,
          seoEnabled: product.seoEnabled,
          seoTitle: product.seoTitle,
          seoKeywords: product.seoKeywords,
          seoDescription: product.seoDescription,
          seoScript: product.seoScript,
          isPublished: product.isPublished,
          imageUrl: primary?.imageUrl || "",
          imageAlt: primary?.altText || "",
          images: product.images.map((img) => ({
            imageUrl: img.imageUrl,
            altText: img.altText,
            title: img.title,
            isPrimary: img.isPrimary,
          })),
        }}
      />
    </div>
  );
}
