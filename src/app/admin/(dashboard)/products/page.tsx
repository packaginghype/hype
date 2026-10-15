import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { Pagination } from "@/components/ui/Pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const { page: pageParam, q } = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(pageParam || "1", 10) || 1);
  const query = q?.trim();

  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { slug: { contains: query, mode: "insensitive" as const } },
          { sku: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const products = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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
            {total} products · page {page} of {totalPages}
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

      <form className="flex flex-wrap gap-2" action="/admin/products" method="get">
        <input
          type="search"
          name="q"
          defaultValue={query || ""}
          placeholder="Search name, slug, SKU…"
          className="min-w-[220px] flex-1 rounded-[4px] border border-[#E2E4E8] px-3 py-2 text-sm outline-none focus:border-[#FF5548]"
        />
        <button
          type="submit"
          className="rounded-[4px] bg-[#172455] px-4 py-2 text-sm font-bold text-white hover:bg-[#0f1839]"
        >
          Search
        </button>
      </form>

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
                  No products found.
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

      <div className="flex flex-col items-center gap-2">
        <p className="text-[13px] text-gray-500">
          Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, total)} of {total}
        </p>
        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/admin/products"
          params={{ q: query }}
        />
      </div>
    </div>
  );
}
