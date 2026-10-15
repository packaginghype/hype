import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#172455]">Categories</h2>
          <p className="mt-1 text-sm text-gray-500">
            {categories.length} categories in database
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-[4px] bg-[#FF5548] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e04337]"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-[#F6F8FA] text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Products</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No categories yet. Add one or import from packaginghype.com.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden bg-[#F6F8FA]">
                        {cat.imageUrl ? (
                          <Image
                            src={cat.imageUrl}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        ) : null}
                      </div>
                      <span className="font-semibold text-[#172455]">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-700">{cat._count.products}</td>
                  <td className="px-4 py-3 text-gray-700">{cat.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${cat.id}`}
                        className="inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-xs font-semibold text-[#172455] hover:bg-[#F6F8FA]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <DeleteCategoryButton id={cat.id} name={cat.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
