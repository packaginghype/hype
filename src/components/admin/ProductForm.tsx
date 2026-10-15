"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryOption = { id: string; name: string };

export type ProductFormValues = {
  name: string;
  slug: string;
  shortDescription?: string | null;
  fullDescription?: string | null;
  sku?: string | null;
  minQuantity?: number;
  leadTimeDays?: string | null;
  materialsAvailable?: string[];
  finishesAvailable?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  isPublished?: boolean;
  categoryIds?: string[];
  imageUrl?: string | null;
  imageAlt?: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductForm({
  initial,
  productId,
  categories,
}: {
  initial?: ProductFormValues;
  productId?: string;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name || "",
    slug: initial?.slug || "",
    shortDescription: initial?.shortDescription || "",
    fullDescription: initial?.fullDescription || "",
    sku: initial?.sku || "",
    minQuantity: initial?.minQuantity ?? 100,
    leadTimeDays: initial?.leadTimeDays || "8-10 Business Days",
    materialsAvailable: initial?.materialsAvailable || [],
    finishesAvailable: initial?.finishesAvailable || [],
    seoTitle: initial?.seoTitle || "",
    seoDescription: initial?.seoDescription || "",
    isPublished: initial?.isPublished ?? true,
    categoryIds: initial?.categoryIds || [],
    imageUrl: initial?.imageUrl || "",
    imageAlt: initial?.imageAlt || "",
  });
  const [materialsText, setMaterialsText] = useState(
    (initial?.materialsAvailable || []).join(", ")
  );
  const [finishesText, setFinishesText] = useState(
    (initial?.finishesAvailable || []).join(", ")
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  function toggleCategory(id: string) {
    setValues((prev) => {
      const current = prev.categoryIds || [];
      return {
        ...prev,
        categoryIds: current.includes(id)
          ? current.filter((c) => c !== id)
          : [...current, id],
      };
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...values,
      materialsAvailable: materialsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      finishesAvailable: finishesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await fetch(
      productId ? `/api/admin/products/${productId}` : "/api/admin/products",
      {
        method: productId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError("Could not save product. Check slug uniqueness and required fields.");
      console.error(data);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">Name</label>
          <input
            required
            value={values.name}
            onChange={(e) => {
              const name = e.target.value;
              setValues((prev) => ({
                ...prev,
                name,
                slug: slugTouched ? prev.slug : slugify(name),
              }));
            }}
            className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">Slug</label>
          <input
            required
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setValues((prev) => ({ ...prev, slug: slugify(e.target.value) }));
            }}
            className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">SKU</label>
          <input
            value={values.sku || ""}
            onChange={(e) => setValues((prev) => ({ ...prev, sku: e.target.value }))}
            className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
          Short Description
        </label>
        <textarea
          rows={3}
          value={values.shortDescription || ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, shortDescription: e.target.value }))
          }
          className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
          Full Description
        </label>
        <textarea
          rows={6}
          value={values.fullDescription || ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, fullDescription: e.target.value }))
          }
          className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
            Min Quantity
          </label>
          <input
            type="number"
            min={1}
            value={values.minQuantity ?? 100}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                minQuantity: Number(e.target.value) || 100,
              }))
            }
            className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
            Lead Time
          </label>
          <input
            value={values.leadTimeDays || ""}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, leadTimeDays: e.target.value }))
            }
            className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
          Primary Image URL
        </label>
        <input
          type="url"
          value={values.imageUrl || ""}
          onChange={(e) => setValues((prev) => ({ ...prev, imageUrl: e.target.value }))}
          className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
          Materials (comma separated)
        </label>
        <input
          value={materialsText}
          onChange={(e) => setMaterialsText(e.target.value)}
          className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
          Finishes (comma separated)
        </label>
        <input
          value={finishesText}
          onChange={(e) => setFinishesText(e.target.value)}
          className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-[#172455]">Categories</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((cat) => {
            const checked = (values.categoryIds || []).includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-sm text-[#172455]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(cat.id)}
                />
                {cat.name}
              </label>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-[#172455]">
        <input
          type="checkbox"
          checked={values.isPublished ?? true}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, isPublished: e.target.checked }))
          }
        />
        Published
      </label>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[4px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] disabled:opacity-60"
        >
          {loading ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-[4px] px-5 py-2.5 text-sm font-semibold text-[#172455] hover:bg-[#F6F8FA]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
