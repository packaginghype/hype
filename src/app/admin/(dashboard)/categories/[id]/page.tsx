import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Edit Category</h2>
        <p className="mt-1 text-sm text-gray-500">{category.name}</p>
      </div>
      <CategoryForm
        categoryId={category.id}
        initial={{
          name: category.name,
          slug: category.slug,
          description: category.description,
          imageUrl: category.imageUrl,
          seoTitle: category.seoTitle,
          seoDescription: category.seoDescription,
          sortOrder: category.sortOrder,
        }}
      />
    </div>
  );
}
