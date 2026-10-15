import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        images: {
          orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  const primary = product.images.find((img) => img.isPrimary) || product.images[0];

  return (
    <div className="w-full max-w-none space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Edit Product</h2>
        <p className="mt-1 text-sm text-gray-500">{product.name}</p>
      </div>
      <ProductForm
        productId={product.id}
        categories={categories}
        initial={{
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          fullDescription: product.fullDescription,
          sku: product.sku,
          startingPrice: product.startingPrice
            ? Number(product.startingPrice)
            : null,
          minQuantity: product.minQuantity,
          leadTimeDays: product.leadTimeDays,
          materialsAvailable: product.materialsAvailable,
          finishesAvailable: product.finishesAvailable,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          isPublished: product.isPublished,
          categoryIds: product.categories.map((c) => c.categoryId),
          imageUrl: primary?.imageUrl || "",
          imageAlt: primary?.altText || "",
          images: product.images.map((img) => ({
            imageUrl: img.imageUrl,
            altText: img.altText,
            isPrimary: img.isPrimary,
          })),
        }}
      />
    </div>
  );
}
