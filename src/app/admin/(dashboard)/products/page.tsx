import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      categories: { include: { category: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#172455]">Products</h2>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} products in database
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-[4px] bg-[#FF5548] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e04337]"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-[#F6F8FA] text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Categories</th>
              <th className="px-4 py-3 font-semibold">MOQ</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No products yet. Add one or import from packaginghype.com.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const image = product.images[0];
                return (
                  <tr key={product.id} className="border-b border-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden bg-[#F6F8FA]">
                          {image ? (
                            <Image
                              src={image.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-semibold text-[#172455]">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {product.categories.map((c) => c.category.name).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{product.minQuantity}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.isPublished
                            ? "text-xs font-bold text-[#21AAA5]"
                            : "text-xs font-bold text-gray-400"
                        }
                      >
                        {product.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-xs font-semibold text-[#172455] hover:bg-[#F6F8FA]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
