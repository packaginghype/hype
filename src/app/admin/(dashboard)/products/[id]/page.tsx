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
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
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
          minQuantity: product.minQuantity,
          leadTimeDays: product.leadTimeDays,
          materialsAvailable: product.materialsAvailable,
          finishesAvailable: product.finishesAvailable,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          isPublished: product.isPublished,
          categoryIds: product.categories.map((c) => c.categoryId),
          imageUrl: product.images[0]?.imageUrl || "",
          imageAlt: product.images[0]?.altText || "",
        }}
      />
    </div>
  );
}
