"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Star, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type CategoryOption = { id: string; name: string };

export type ProductImageInput = {
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
};

export type ProductFormValues = {
  name: string;
  slug: string;
  shortDescription?: string | null;
  fullDescription?: string | null;
  sku?: string | null;
  startingPrice?: number | null;
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
  images?: ProductImageInput[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const inputClass =
  "w-full rounded-[4px] border border-[#E2E4E8] px-3 py-2.5 text-sm outline-none focus:border-[#FF5548]";

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
    startingPrice: initial?.startingPrice ?? null,
    minQuantity: initial?.minQuantity ?? 100,
    leadTimeDays: initial?.leadTimeDays || "8-10 Business Days",
    materialsAvailable: initial?.materialsAvailable || [],
    finishesAvailable: initial?.finishesAvailable || [],
    seoTitle: initial?.seoTitle || "",
    seoDescription: initial?.seoDescription || "",
    isPublished: initial?.isPublished ?? true,
    categoryIds: initial?.categoryIds || [],
  });

  const [images, setImages] = useState<ProductImageInput[]>(() => {
    if (initial?.images && initial.images.length > 0) return initial.images;
    if (initial?.imageUrl) {
      return [
        {
          imageUrl: initial.imageUrl,
          altText: initial.imageAlt || initial.name || "",
          isPrimary: true,
        },
      ];
    }
    return [{ imageUrl: "", altText: "", isPrimary: true }];
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

  function updateImage(index: number, patch: Partial<ProductImageInput>) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, ...patch } : img))
    );
  }

  function setPrimary(index: number) {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        return [{ imageUrl: "", altText: "", isPrimary: true }];
      }
      if (!next.some((img) => img.isPrimary)) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanedImages = images
      .map((img) => ({
        imageUrl: img.imageUrl.trim(),
        altText: (img.altText || values.name || "").trim(),
        isPrimary: Boolean(img.isPrimary),
      }))
      .filter((img) => img.imageUrl);

    const payload = {
      ...values,
      startingPrice:
        values.startingPrice === null ||
        values.startingPrice === undefined ||
        Number.isNaN(Number(values.startingPrice))
          ? null
          : Number(values.startingPrice),
      materialsAvailable: materialsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      finishesAvailable: finishesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: cleanedImages,
      imageUrl: cleanedImages.find((i) => i.isPrimary)?.imageUrl || cleanedImages[0]?.imageUrl || "",
      imageAlt:
        cleanedImages.find((i) => i.isPrimary)?.altText ||
        cleanedImages[0]?.altText ||
        values.name,
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
    <form onSubmit={onSubmit} className="w-full space-y-6 bg-white p-4 sm:p-6 lg:p-8">
      {/* Basics */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#172455]">
          Basic Info
        </h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
              Name
            </label>
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
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
              SKU
            </label>
            <input
              value={values.sku || ""}
              onChange={(e) => setValues((prev) => ({ ...prev, sku: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
              Slug
            </label>
            <input
              required
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setValues((prev) => ({ ...prev, slug: slugify(e.target.value) }));
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
              Starting Price ($)
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={values.startingPrice ?? ""}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  startingPrice: e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              className={inputClass}
              placeholder="Optional"
            />
          </div>

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
              className={inputClass}
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
              className={inputClass}
            />
          </div>
          <div className="lg:col-span-3">
            <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
              Short Description
            </label>
            <textarea
              rows={3}
              value={values.shortDescription || ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, shortDescription: e.target.value }))
              }
              className={inputClass}
              placeholder="Plain text shown under the product title"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
            Full Description
          </label>
          <p className="mb-2 text-xs text-gray-500">
            Rich content shown on the product page (headings, lists, links, formatting).
          </p>
          <RichTextEditor
            value={values.fullDescription || ""}
            onChange={(html) =>
              setValues((prev) => ({ ...prev, fullDescription: html }))
            }
          />
        </div>
      </section>

      {/* Images */}
      <section className="space-y-3 border-t border-gray-100 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#172455]">
            Images
          </h3>
          <button
            type="button"
            onClick={() =>
              setImages((prev) => [
                ...prev,
                { imageUrl: "", altText: values.name || "", isPrimary: false },
              ])
            }
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#E2E4E8] px-3 py-1.5 text-xs font-bold text-[#172455] hover:border-[#172455]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Image
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Paste image URLs (Cloudinary / CDN). Mark one as primary for cards & hero.
        </p>

        <div className="space-y-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-[6px] border border-[#E8EAEF] bg-[#F8FAFC] p-3 sm:grid-cols-[88px_1fr_auto]"
            >
              <div className="relative h-20 w-20 overflow-hidden bg-white sm:h-[88px] sm:w-[88px]">
                {img.imageUrl ? (
                  <Image
                    src={img.imageUrl}
                    alt={img.altText || "Preview"}
                    fill
                    className="object-cover"
                    sizes="88px"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                    Preview
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-2">
                <input
                  type="url"
                  value={img.imageUrl}
                  onChange={(e) => updateImage(index, { imageUrl: e.target.value })}
                  placeholder="https://…/image.webp"
                  className={inputClass}
                />
                <input
                  value={img.altText || ""}
                  onChange={(e) => updateImage(index, { altText: e.target.value })}
                  placeholder="Alt text"
                  className={inputClass}
                />
              </div>

              <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
                <button
                  type="button"
                  onClick={() => setPrimary(index)}
                  className={`inline-flex h-9 items-center justify-center gap-1 rounded-[4px] px-2.5 text-xs font-bold ${
                    img.isPrimary
                      ? "bg-[#FF5548] text-white"
                      : "border border-[#E2E4E8] bg-white text-[#172455]"
                  }`}
                >
                  <Star className="h-3.5 w-3.5" />
                  {img.isPrimary ? "Primary" : "Set Primary"}
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-[4px] border border-[#E2E4E8] bg-white px-2.5 text-xs font-bold text-[#FF5548] hover:bg-[#FFF5F4]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specs */}
      <section className="space-y-4 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#172455]">
          Specs & Categories
        </h3>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
            Materials (comma separated)
          </label>
          <input
            value={materialsText}
            onChange={(e) => setMaterialsText(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
            Finishes (comma separated)
          </label>
          <input
            value={finishesText}
            onChange={(e) => setFinishesText(e.target.value)}
            className={inputClass}
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
      </section>

      {/* SEO */}
      <section className="space-y-4 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#172455]">
          SEO
        </h3>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
            SEO Title
          </label>
          <input
            value={values.seoTitle || ""}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, seoTitle: e.target.value }))
            }
            maxLength={70}
            placeholder="Custom Kraft Boxes | Packaging Hype"
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-gray-400">
            {(values.seoTitle || "").length}/70 recommended
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#172455]">
            SEO Description
          </label>
          <textarea
            rows={3}
            value={values.seoDescription || ""}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, seoDescription: e.target.value }))
            }
            maxLength={170}
            placeholder="Short meta description for search results…"
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-gray-400">
            {(values.seoDescription || "").length}/160–170 recommended
          </p>
        </div>
      </section>

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

      <div className="flex gap-3 border-t border-gray-100 pt-4">
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
