import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, allProducts, allBlogs] = await Promise.all([
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

  return (
    <div className="w-full max-w-none space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Add Product</h2>
        <p className="mt-1 text-sm font-medium text-[#4B5563]">
          Create a new packaging product.
        </p>
      </div>
      <ProductForm
        categories={categories}
        allProducts={allProducts}
        allBlogs={allBlogs}
      />
    </div>
  );
}
