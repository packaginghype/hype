"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export type CategoryFormValues = {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sortOrder?: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CategoryForm({
  initial,
  categoryId,
}: {
  initial?: CategoryFormValues;
  categoryId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CategoryFormValues>({
    name: initial?.name || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    imageUrl: initial?.imageUrl || "",
    seoTitle: initial?.seoTitle || "",
    seoDescription: initial?.seoDescription || "",
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(
      categoryId ? `/api/admin/categories/${categoryId}` : "/api/admin/categories",
      {
        method: categoryId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError("Could not save category. Check slug uniqueness and required fields.");
      console.error(data);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 bg-white p-6">
      <div>
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
        <label className="mb-1.5 block text-sm font-semibold text-[#172455]">Description</label>
        <textarea
          rows={4}
          value={values.description || ""}
          onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#172455]">Image URL</label>
        <input
          type="url"
          value={values.imageUrl || ""}
          onChange={(e) => setValues((prev) => ({ ...prev, imageUrl: e.target.value }))}
          className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
          placeholder="https://..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">SEO Title</label>
          <input
            value={values.seoTitle || ""}
            onChange={(e) => setValues((prev) => ({ ...prev, seoTitle: e.target.value }))}
            className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">Sort Order</label>
          <input
            type="number"
            value={values.sortOrder ?? 0}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))
            }
            className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[#172455]">SEO Description</label>
        <textarea
          rows={3}
          value={values.seoDescription || ""}
          onChange={(e) => setValues((prev) => ({ ...prev, seoDescription: e.target.value }))}
          className="w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]"
        />
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[4px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] disabled:opacity-60"
        >
          {loading ? "Saving..." : categoryId ? "Update Category" : "Create Category"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="rounded-[4px] px-5 py-2.5 text-sm font-semibold text-[#172455] hover:bg-[#F6F8FA]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
