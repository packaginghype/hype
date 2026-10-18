import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import {
  adminEditCategoryHref,
  adminNewCategoryHref,
  CATEGORY_GROUP_META,
  type CategoryGroupKey,
} from "@/lib/category-groups";

export async function AdminCategoryList({ group }: { group: CategoryGroupKey }) {
  const meta = CATEGORY_GROUP_META[group];
  const categories = await prisma.category.findMany({
    where: { group },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#172455]">{meta.label}</h2>
          <p className="mt-1 text-sm font-medium text-[#4B5563]">
            {meta.description} · {categories.length} items
          </p>
        </div>
        <Link
          href={adminNewCategoryHref(group)}
          prefetch
          className="inline-flex items-center gap-2 rounded-[4px] bg-[#FF5548] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e04337]"
        >
          <Plus className="h-4 w-4" />
          Add {meta.singularLabel}
        </Link>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-[#F6F8FA] text-xs uppercase tracking-wider text-[#172455]">
            <tr>
              <th className="px-4 py-3 font-bold">{meta.singularLabel}</th>
              <th className="px-4 py-3 font-bold">Slug</th>
              <th className="px-4 py-3 font-bold">Products</th>
              <th className="px-4 py-3 font-bold">Order</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No items yet. Add the first {meta.singularLabel.toLowerCase()} for {meta.label}.
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
                  <td className="px-4 py-3 font-medium text-[#374151]">{cat.slug}</td>
                  <td className="px-4 py-3 font-medium text-[#172455]">{cat._count.products}</td>
                  <td className="px-4 py-3 font-medium text-[#172455]">{cat.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={adminEditCategoryHref(cat.id, group)}
                        prefetch
                        className="inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-xs font-bold text-[#172455] hover:bg-[#F6F8FA]"
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
