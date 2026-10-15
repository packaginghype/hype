import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Add Product</h2>
        <p className="mt-1 text-sm text-gray-500">Create a new packaging product.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
