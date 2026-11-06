"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import {
  CARD_IMAGE,
  PRODUCT_IMAGE,
  PRODUCT_CONTENT_IMAGE,
  PRODUCT_FAQ_IMAGE,
  PRODUCT_MERCHANT_IMAGE,
} from "@/lib/image-presets";
import {
  CATEGORY_GROUP_META,
  type CategoryGroupKey,
} from "@/lib/category-groups";
import { mediaBasename, mediaExtension } from "@/lib/media-url";
import { slugify } from "@/lib/utils";

const GALLERY_FOLDER = "packaginghype/products/gallery";

function mediaFilenameSlug(url: string): string {
  return slugify(mediaBasename(url));
}

function GalleryImageSlugField({
  url,
  suggestedSlug,
  onApplied,
}: {
  url: string;
  suggestedSlug: string;
  onApplied: (nextUrl: string) => void;
}) {
  const [name, setName] = useState(() => slugify(suggestedSlug));
  const [nameTouched, setNameTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!nameTouched) setName(slugify(suggestedSlug));
  }, [suggestedSlug, nameTouched]);

  const imageName = slugify(name.replace(/\.[a-z0-9]{2,5}$/i, ""));
  const currentExt = mediaExtension(url) || "webp";
  // Exact basename only — "testing" must NOT match URL ".../testing1-1"
  const alreadyNamed =
    Boolean(imageName) && mediaBasename(url) === imageName;

  async function applyName(nextName = imageName) {
    const cleanName = slugify(nextName.replace(/\.[a-z0-9]{2,5}$/i, ""));
    if (!cleanName) {
      setError("Set an image name");
      return;
    }
    setError("");
    setStatus("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          slug: cleanName,
          folder: GALLERY_FOLDER,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not set image name");
        return;
      }
      onApplied(data.url);
      setStatus("Named on Cloudinary — click Update");
    } catch {
      setError("Could not set image name");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#172455]">
        Image name
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setNameTouched(true);
          setName(e.target.value);
          setStatus("");
        }}
        onBlur={() => {
          const cleaned = slugify(name.replace(/\.[a-z0-9]{2,5}$/i, ""));
          setName(cleaned);
          if (cleaned && mediaBasename(url) !== cleaned) {
            void applyName(cleaned);
          }
        }}
        className="w-full rounded-[4px] border border-[#E2E4E8] bg-white px-2.5 py-1.5 text-xs font-medium text-[#172455] outline-none focus:border-[#FF5548]"
        placeholder="e.g. custom-boxes-1"
      />
      <p className="break-all font-mono text-[10px] text-[#21AAA5]">
        Target: /media/{GALLERY_FOLDER}/{imageName || "[name]"}.{currentExt}
      </p>
      <p className="break-all font-mono text-[10px] text-[#6B7280]">
        Current: {url || "—"}
      </p>
      <button
        type="button"
        disabled={busy || !imageName}
        onClick={() => void applyName()}
        className="inline-flex h-8 w-full cursor-pointer items-center justify-center rounded-[4px] border border-[#21AAA5] bg-white text-[11px] font-bold text-[#21AAA5] hover:bg-[#EAF7F6] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy
          ? "Working…"
          : alreadyNamed
            ? "Re-apply name"
            : "Apply image name"}
      </button>
      {status ? (
        <p className="text-[10px] font-semibold text-emerald-700">{status}</p>
      ) : null}
      {error ? (
        <p className="text-[10px] font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

export type CategoryOption = {
  id: string;
  name: string;
  group?: CategoryGroupKey | string;
};

export type ProductImageInput = {
  imageUrl: string;
  altText?: string;
  title?: string;
  isPrimary?: boolean;
};


export type ProductFaqInput = {
  question: string;
  answer: string;
};

export type ProductOption = {
  id: string;
  name: string;
};

export type BlogOption = {
  id: string;
  title: string;
  slug: string;
  thumbnailImageUrl?: string | null;
};

export type ProductFormValues = {
  name: string;
  slug: string;
  shortDescription?: string | null;
  sku?: string | null;
  startingPrice?: number | null;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  inStock?: boolean;
  minQuantity?: number;
  leadTimeDays?: string | null;
  materialsAvailable?: string[];
  finishesAvailable?: string[];
  industryIds?: string[];
  materialCategoryId?: string | null;
  breadcrumbCategoryId?: string | null;
  breadcrumbCategoryIds?: string[];
  categoryIds?: string[];
  thumbnailUrl?: string | null;
  thumbnailAlt?: string | null;
  thumbnailTitle?: string | null;
  thumbnailSubDescription?: string | null;
  videoUrl?: string | null;
  videoThumbnailUrl?: string | null;
  videoDescription?: string | null;
  widgetsContent?: string | null;
  relevantProductsHeading?: string | null;
  relevantProductsDescription?: string | null;
  relatedProductIds?: string[];
  relatedBlogsHeading?: string | null;
  relatedBlogsDescription?: string | null;
  relatedBlogIds?: string[];
  pageScrollEnabled?: boolean;
  pageScrollImageUrl?: string | null;
  pageScrollImageAlt?: string | null;
  pageScrollImageTitle?: string | null;
  pageScrollContent?: string | null;
  faqsHeading?: string | null;
  faqsSubheading?: string | null;
  faqsImageUrl?: string | null;
  faqsImageAlt?: string | null;
  faqs?: ProductFaqInput[];
  merchantImageUrls?: string[];
  navbarEnabled?: boolean;
  featureEnabled?: boolean;
  seoEnabled?: boolean;
  seoTitle?: string | null;
  seoKeywords?: string | null;
  seoDescription?: string | null;
  seoScript?: string | null;
  canonicalUrl?: string | null;
  isPublished?: boolean;
  imageUrl?: string | null;
  imageAlt?: string | null;
  images?: ProductImageInput[];
};

const inputClass =
  "w-full rounded-[4px] border border-[#E2E4E8] bg-white px-3 py-2.5 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5548]";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white shadow-[0_1px_0_rgba(23,36,85,0.04)]">
      <div className="admin-section-bar bg-[#172455] px-4 py-2.5 sm:px-5">
        <p className="text-sm font-bold uppercase tracking-wider text-white">
          {title}
        </p>
      </div>
      <div className="space-y-4 p-4 sm:p-5 lg:p-6">{children}</div>
    </section>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-[#172455]">
      {children}
      {required ? <span className="ml-0.5 text-[#FF5548]">*</span> : null}
    </label>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[12px] font-bold uppercase tracking-wider text-[#172455]">
        {label}
      </p>
      <div className="inline-flex overflow-hidden rounded-[4px] border border-[#E2E4E8]">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`cursor-pointer px-4 py-2 text-xs font-bold ${
            value ? "bg-[#172455] text-white" : "bg-white text-[#172455]"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`cursor-pointer px-4 py-2 text-xs font-bold ${
            !value ? "bg-[#172455] text-white" : "bg-white text-[#172455]"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

export function ProductForm({
  initial,
  productId,
  categories,
  allProducts = [],
  allBlogs = [],
}: {
  initial?: ProductFormValues;
  productId?: string;
  categories: CategoryOption[];
  allProducts?: ProductOption[];
  allBlogs?: BlogOption[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name || "",
    slug: initial?.slug || "",
    shortDescription: initial?.shortDescription || "",
    sku: initial?.sku || "",
    startingPrice: initial?.startingPrice ?? null,
    originalPrice: initial?.originalPrice ?? initial?.startingPrice ?? null,
    discountedPrice: initial?.discountedPrice ?? null,
    inStock: initial?.inStock ?? true,
    minQuantity: initial?.minQuantity ?? 100,
    leadTimeDays: initial?.leadTimeDays || "8-10 Business Days",
    materialsAvailable: initial?.materialsAvailable || [],
    finishesAvailable: initial?.finishesAvailable || [],
    industryIds: initial?.industryIds || [],
    materialCategoryId: initial?.materialCategoryId || "",
    breadcrumbCategoryId: initial?.breadcrumbCategoryId || "",
    breadcrumbCategoryIds:
      initial?.breadcrumbCategoryIds?.length
        ? initial.breadcrumbCategoryIds
        : initial?.breadcrumbCategoryId
          ? [initial.breadcrumbCategoryId]
          : [],
    categoryIds: initial?.categoryIds || [],
    thumbnailUrl: initial?.thumbnailUrl || initial?.imageUrl || "",
    thumbnailAlt: initial?.thumbnailAlt || initial?.imageAlt || "",
    thumbnailTitle: initial?.thumbnailTitle || "",
    thumbnailSubDescription: initial?.thumbnailSubDescription || "",
    videoUrl: initial?.videoUrl || "",
    videoThumbnailUrl: initial?.videoThumbnailUrl || "",
    videoDescription: initial?.videoDescription || "",
    widgetsContent: initial?.widgetsContent || "",
    relevantProductsHeading: initial?.relevantProductsHeading || "Related Products",
    relevantProductsDescription: initial?.relevantProductsDescription || "",
    relatedProductIds: initial?.relatedProductIds || [],
    relatedBlogsHeading:
      initial?.relatedBlogsHeading || "Explore More Packaging Guides",
    relatedBlogsDescription: initial?.relatedBlogsDescription || "",
    relatedBlogIds: (initial?.relatedBlogIds || []).slice(0, 4),
    pageScrollEnabled: initial?.pageScrollEnabled ?? true,
    pageScrollImageUrl: initial?.pageScrollImageUrl || "",
    pageScrollImageAlt: initial?.pageScrollImageAlt || "",
    pageScrollImageTitle: initial?.pageScrollImageTitle || "",
    pageScrollContent: initial?.pageScrollContent || "",
    faqsHeading: initial?.faqsHeading || "",
    faqsSubheading: initial?.faqsSubheading || "",
    faqsImageUrl: initial?.faqsImageUrl || "",
    faqsImageAlt: initial?.faqsImageAlt || "",
    merchantImageUrls: initial?.merchantImageUrls || [],
    navbarEnabled: initial?.navbarEnabled ?? true,
    featureEnabled: initial?.featureEnabled ?? true,
    seoEnabled: initial?.seoEnabled ?? true,
    seoTitle: initial?.seoTitle || "",
    seoKeywords: initial?.seoKeywords || "",
    seoDescription: initial?.seoDescription || "",
    seoScript: initial?.seoScript || "",
    canonicalUrl: initial?.canonicalUrl || "",
    isPublished: initial?.isPublished ?? true,
  });

  const [images, setImages] = useState<ProductImageInput[]>(() => {
    if (initial?.images && initial.images.length > 0) return initial.images;
    if (initial?.imageUrl || initial?.thumbnailUrl) {
      return [
        {
          imageUrl: initial.imageUrl || initial.thumbnailUrl || "",
          altText: initial.imageAlt || initial.thumbnailAlt || "",
          title: initial.thumbnailTitle || "",
          isPrimary: true,
        },
      ];
    }
    return [];
  });

  const [faqs, setFaqs] = useState<ProductFaqInput[]>(
    initial?.faqs?.length
      ? initial.faqs
      : [{ question: "", answer: "" }]
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [slugConflict, setSlugConflict] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedProductId, setSavedProductId] = useState(productId);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [relatedQuery, setRelatedQuery] = useState("");

  const industries = useMemo(
    () => categories.filter((c) => c.group === "industries"),
    [categories]
  );
  const materials = useMemo(
    () => categories.filter((c) => c.group === "materials"),
    [categories]
  );
  const categoriesGroup = useMemo(
    () => categories.filter((c) => c.group === "categories"),
    [categories]
  );
  const shapesGroup = useMemo(
    () => categories.filter((c) => c.group === "shapes"),
    [categories]
  );
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );
  const crumbIds = values.breadcrumbCategoryIds || [];

  const relatedChoices = useMemo(() => {
    const q = relatedQuery.trim().toLowerCase();
    return allProducts
      .filter((p) => p.id !== productId)
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .slice(0, 40);
  }, [allProducts, productId, relatedQuery]);

  const [blogQuery, setBlogQuery] = useState("");
  const blogChoices = useMemo(() => {
    const q = blogQuery.trim().toLowerCase();
    if (!q) return allBlogs.slice(0, 40);
    return allBlogs
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q)
      )
      .slice(0, 40);
  }, [allBlogs, blogQuery]);

  function patch(partial: Partial<ProductFormValues>) {
    setValues((prev) => ({ ...prev, ...partial }));
  }

  function toggleBlog(id: string) {
    setValues((prev) => {
      const current = prev.relatedBlogIds || [];
      if (current.includes(id)) {
        return {
          ...prev,
          relatedBlogIds: current.filter((item) => item !== id),
        };
      }
      // Related blogs section shows max 4 selected posts
      if (current.length >= 4) return prev;
      return { ...prev, relatedBlogIds: [...current, id] };
    });
  }

  function toggleIndustry(id: string) {
    setValues((prev) => {
      const set = new Set(prev.industryIds || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, industryIds: Array.from(set) };
    });
  }

  function toggleRelated(id: string) {
    setValues((prev) => {
      const set = new Set(prev.relatedProductIds || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, relatedProductIds: Array.from(set) };
    });
  }

  function toggleBreadcrumb(id: string) {
    setValues((prev) => {
      const current = prev.breadcrumbCategoryIds || [];
      if (current.includes(id)) {
        const next = current.filter((x) => x !== id);
        return {
          ...prev,
          breadcrumbCategoryIds: next,
          breadcrumbCategoryId: next[0] || "",
        };
      }
      const next = [...current, id];
      return {
        ...prev,
        breadcrumbCategoryIds: next,
        breadcrumbCategoryId: next[0] || "",
      };
    });
  }

  function moveBreadcrumb(index: number, dir: -1 | 1) {
    setValues((prev) => {
      const current = [...(prev.breadcrumbCategoryIds || [])];
      const target = index + dir;
      if (target < 0 || target >= current.length) return prev;
      [current[index], current[target]] = [current[target], current[index]];
      return {
        ...prev,
        breadcrumbCategoryIds: current,
        breadcrumbCategoryId: current[0] || "",
      };
    });
  }

  function removeBreadcrumb(id: string) {
    setValues((prev) => {
      const next = (prev.breadcrumbCategoryIds || []).filter((x) => x !== id);
      return {
        ...prev,
        breadcrumbCategoryIds: next,
        breadcrumbCategoryId: next[0] || "",
      };
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSlugConflict(false);
    setLoading(true);

    const activeId = savedProductId || productId;
    const payload = {
      ...values,
      startingPrice: values.originalPrice,
      images,
      faqs: faqs.filter((f) => f.question.trim()),
      merchantImageUrls: (values.merchantImageUrls || []).filter((u) => u.trim()),
      materialsAvailable: values.materialsAvailable || [],
      finishesAvailable: values.finishesAvailable || [],
    };

    try {
      const res = await fetch(
        activeId ? `/api/admin/products/${activeId}` : "/api/admin/products",
        {
          method: activeId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const zodFieldErrors =
          data?.error?.fieldErrors &&
          typeof data.error.fieldErrors === "object"
            ? Object.entries(data.error.fieldErrors as Record<string, string[]>)
                .flatMap(([key, msgs]) =>
                  (msgs || []).map((m) => `${key}: ${m}`)
                )
                .slice(0, 4)
                .join(" · ")
            : "";
        const message =
          (typeof data?.error === "string" && data.error) ||
          zodFieldErrors ||
          "Could not save product. Check slug uniqueness and required fields.";
        const isSlugTaken =
          res.status === 409 || /slug already exists/i.test(message);
        setSlugConflict(isSlugTaken);
        setError(
          isSlugTaken
            ? `Slug "${values.slug}" is already used by another product. Choose a different URL / slug.`
            : message
        );
        console.error(data);
        setLoading(false);
        return;
      }

      const newId =
        typeof data?.product?.id === "string" ? data.product.id : activeId;
      if (newId && newId !== savedProductId) {
        setSavedProductId(newId);
        // Stay on editor — only sync URL for new products so refresh keeps working
        router.replace(`/admin/products/${newId}`);
      }
      setSuccess(
        activeId ? "Product updated successfully." : "Product created successfully."
      );
      router.refresh();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Network error — could not save product. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-surface w-full max-w-none space-y-5 pb-24">
      <Section title="Basic Info">
        <div>
          <FieldLabel required>Title</FieldLabel>
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
            placeholder="Enter Title"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel required>URL / Slug</FieldLabel>
            <input
              required
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlugConflict(false);
                if (error) setError("");
                patch({ slug: slugify(e.target.value) });
              }}
              className={`${inputClass} ${
                slugConflict
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : ""
              }`}
              aria-invalid={slugConflict}
            />
            {slugConflict ? (
              <p className="mt-1.5 text-[12px] font-semibold text-red-600">
                This slug is already taken. Pick another name for the URL.
              </p>
            ) : null}
          </div>
          <div>
            <FieldLabel>SKU</FieldLabel>
            <input
              value={values.sku || ""}
              onChange={(e) => patch({ sku: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Short Description</FieldLabel>
          <RichTextEditor
            value={values.shortDescription || ""}
            onChange={(html) => patch({ shortDescription: html })}
            placeholder="Short description…"
          />
        </div>
      </Section>

      <Section title="Pricing">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <FieldLabel>Original Price</FieldLabel>
            <input
              type="number"
              min={0}
              step="0.01"
              value={values.originalPrice ?? ""}
              onChange={(e) =>
                patch({
                  originalPrice:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Discounted Price</FieldLabel>
            <input
              type="number"
              min={0}
              step="0.01"
              value={values.discountedPrice ?? ""}
              onChange={(e) =>
                patch({
                  discountedPrice:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className={inputClass}
            />
          </div>
          <YesNo
            label="In Stock"
            value={values.inStock ?? true}
            onChange={(v) => patch({ inStock: v })}
          />
        </div>

        <div>
          <FieldLabel>Industry</FieldLabel>
          <div className="flex flex-wrap gap-2 rounded-[4px] border border-[#E2E4E8] bg-white p-3">
            {industries.length === 0 ? (
              <p className="text-sm text-[#6B7280]">No industries yet.</p>
            ) : (
              industries.map((item) => {
                const on = (values.industryIds || []).includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleIndustry(item.id)}
                    className={`inline-flex cursor-pointer items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-xs font-bold ${
                      on
                        ? "bg-[#172455] text-white"
                        : "border border-[#E2E4E8] text-[#172455] hover:bg-[#F6F8FA]"
                    }`}
                  >
                    {item.name}
                    {on ? <X className="h-3 w-3" /> : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div>
          <FieldLabel>Material</FieldLabel>
          <select
            value={values.materialCategoryId || ""}
            onChange={(e) => patch({ materialCategoryId: e.target.value })}
            className={inputClass}
          >
            <option value="">Select value</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <div>
            <FieldLabel>Breadcrumbs</FieldLabel>
            <p className="text-[12px] font-medium text-[#4B5563]">
              Pick crumbs in order from the groups below. Path ends with the
              product title on the live page.
            </p>
          </div>

          {/* Fixed-height path panel — avoids page jump when adding crumbs */}
          <div className="rounded-[8px] border border-[#E8EAEF] bg-[#F8FAFC] p-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#172455]">
              Breadcrumb path
            </p>
            <div className="max-h-[220px] min-h-[140px] space-y-2 overflow-y-auto pr-1">
              {crumbIds.length === 0 ? (
                <p className="flex h-[120px] items-center justify-center rounded-[6px] border border-dashed border-[#E2E4E8] bg-white text-[12px] font-medium text-[#9CA3AF]">
                  No crumbs yet — click tags below to build the path
                </p>
              ) : (
                <ol className="space-y-2">
                  {crumbIds.map((id, index) => {
                    const cat = categoryById.get(id);
                    const groupKey = (cat?.group || "") as CategoryGroupKey;
                    const groupLabel =
                      groupKey && CATEGORY_GROUP_META[groupKey]
                        ? CATEGORY_GROUP_META[groupKey].label
                        : "Category";
                    return (
                      <li
                        key={id}
                        className="flex items-center gap-2 rounded-[6px] border border-[#E2E4E8] bg-white px-3 py-2"
                      >
                        <span className="w-5 shrink-0 text-[11px] font-bold text-[#9CA3AF]">
                          {index + 1}.
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#172455]">
                          {cat?.name || id}
                          <span className="ml-1.5 text-[11px] font-medium text-[#6B7280]">
                            ({groupLabel})
                          </span>
                        </span>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveBreadcrumb(index, -1)}
                            disabled={index === 0}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#E2E4E8] text-[#172455] hover:bg-[#F6F8FA] disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Move up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBreadcrumb(index, 1)}
                            disabled={index === crumbIds.length - 1}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#E2E4E8] text-[#172455] hover:bg-[#F6F8FA] disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Move down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBreadcrumb(id)}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] bg-[#FF5548] text-white hover:bg-[#e04337]"
                            aria-label="Remove"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                  <li className="px-1 text-[12px] font-medium text-[#6B7280]">
                    → ends with product title
                  </li>
                </ol>
              )}
            </div>
          </div>

          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2">
            {(
              [
                ["categories", categoriesGroup],
                ["industries", industries],
                ["materials", materials],
                ["shapes", shapesGroup],
              ] as const
            ).map(([group, items]) => (
              <div
                key={group}
                className="flex h-[188px] flex-col rounded-[8px] border border-[#E8EAEF] bg-white p-3"
              >
                <p className="mb-2 shrink-0 text-[12px] font-bold uppercase tracking-wider text-[#172455]">
                  {CATEGORY_GROUP_META[group].label}
                </p>
                <div className="min-h-0 flex-1 content-start overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {items.length === 0 ? (
                      <p className="text-[12px] text-[#9CA3AF]">No items yet.</p>
                    ) : (
                      items.map((item) => {
                        const on = crumbIds.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleBreadcrumb(item.id)}
                            className={`inline-flex cursor-pointer items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-xs font-bold transition-colors ${
                              on
                                ? "bg-[#172455] text-white"
                                : "border border-[#E2E4E8] text-[#172455] hover:bg-[#F6F8FA]"
                            }`}
                          >
                            {item.name}
                            {on ? <X className="h-3 w-3" /> : null}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Product Detail Images">
        <ImageUploadField
          label="Add Product Image"
          value=""
          onChange={(url) => {
            if (!url) return;
            setImages((prev) => [
              ...prev,
              {
                imageUrl: url,
                altText: values.name || "",
                title: values.name || "",
                isPrimary: prev.length === 0,
              },
            ]);
          }}
          recommended={PRODUCT_IMAGE.recommended}
          hint={PRODUCT_IMAGE.hint}
          folder={GALLERY_FOLDER}
          defaultSlug={
            values.slug ? `${values.slug}-${images.length + 1}` : ""
          }
        />

        <div>
          <p className="mb-3 text-sm font-bold text-[#172455]">
            Existing Images{" "}
            <span className="font-medium text-[#6B7280]">
              ({images.length})
            </span>
          </p>
          <div className="rounded-[8px] border border-[#E8EAEF] bg-[#F8FAFC] p-3">
          {images.length === 0 ? (
            <div className="flex h-[160px] items-center justify-center rounded-[6px] border border-dashed border-[#E2E4E8] bg-white text-[12px] font-medium text-[#9CA3AF]">
              No gallery images yet — upload above
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((img, index) => (
                <div
                  key={`${img.imageUrl}-${index}`}
                  className="flex flex-col overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white"
                >
                  <div className={`relative w-full bg-white ${PRODUCT_IMAGE.aspectClass}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.imageUrl}
                      alt={img.altText || `Image ${index + 1}`}
                      draggable={false}
                      className="h-full w-full object-contain"
                    />
                    {img.isPrimary ? (
                      <span className="absolute left-2 top-2 rounded-[4px] bg-[#FF5548] px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                        Primary
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#172455]">
                      Image {index + 1}
                    </p>
                    <GalleryImageSlugField
                      url={img.imageUrl}
                      suggestedSlug={
                        mediaFilenameSlug(img.imageUrl) ||
                        (values.slug
                          ? `${values.slug}-${index + 1}`
                          : `image-${index + 1}`)
                      }
                      onApplied={(nextUrl) =>
                        setImages((prev) =>
                          prev.map((item, i) =>
                            i === index ? { ...item, imageUrl: nextUrl } : item
                          )
                        )
                      }
                    />
                    <input
                      value={img.altText || ""}
                      onChange={(e) =>
                        setImages((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, altText: e.target.value }
                              : item
                          )
                        )
                      }
                      className={inputClass}
                      placeholder="Alt text"
                    />
                    <input
                      value={img.title || ""}
                      onChange={(e) =>
                        setImages((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, title: e.target.value }
                              : item
                          )
                        )
                      }
                      className={inputClass}
                      placeholder="Title"
                    />
                    <div className="flex gap-2">
                      {!img.isPrimary ? (
                        <button
                          type="button"
                          onClick={() =>
                            setImages((prev) =>
                              prev.map((item, i) => ({
                                ...item,
                                isPrimary: i === index,
                              }))
                            )
                          }
                          className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-[4px] border border-[#E2E4E8] text-xs font-bold text-[#172455] hover:bg-[#F6F8FA]"
                        >
                          Set primary
                        </button>
                      ) : (
                        <span className="inline-flex h-9 flex-1 items-center justify-center rounded-[4px] bg-[#EEF2FF] text-xs font-bold text-[#172455]">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-[4px] border border-[#E2E4E8] px-3 text-xs font-bold text-[#FF5548] hover:bg-[#FFF5F4]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </Section>

      <Section title="Product Floating Video (Reel / Demo)">
        <p className="mb-4 text-xs font-medium text-[#64748B]">
          Upload a short product demonstration video (MP4). It displays as an interactive floating reel widget in the bottom-right corner of the product page, opening an interactive video modal when clicked.
        </p>
        <div className="grid gap-5 xl:grid-cols-2">
          <MediaUploadField
            label="Video File"
            value={values.videoUrl || ""}
            onChange={(url) => patch({ videoUrl: url })}
            recommended="MP4 only, max 5MB (vertical 9:16 recommended)"
            kind="video"
            folder="packaginghype/products/video"
            defaultSlug={values.slug ? `${values.slug}-video` : ""}
          />
          <MediaUploadField
            label="Video Thumbnail / Poster"
            value={values.videoThumbnailUrl || ""}
            onChange={(url) => patch({ videoThumbnailUrl: url })}
            recommended="Vertical 9:16 or 1:1 · webp, png, jpg, jpeg · max 1MB"
            folder="packaginghype/products/video-thumb"
            defaultSlug={values.slug ? `${values.slug}-video-thumb` : ""}
          />
        </div>
        <div>
          <FieldLabel>Video Caption / Description (Optional)</FieldLabel>
          <textarea
            rows={2}
            value={values.videoDescription || ""}
            onChange={(e) => patch({ videoDescription: e.target.value })}
            className={inputClass}
            placeholder="Enter a brief caption or highlight for the video modal"
          />
        </div>
      </Section>

      <Section title="Product Thumbnail">
        <div className="grid gap-4 lg:grid-cols-3">
          <ImageUploadField
            label="Thumbnail"
            value={values.thumbnailUrl || ""}
            onChange={(url) => patch({ thumbnailUrl: url })}
            recommended={CARD_IMAGE.recommended}
            hint={CARD_IMAGE.hint}
            folder="packaginghype/products/thumb"
            defaultSlug={values.slug || ""}
          />
          <div>
            <FieldLabel>Image Alt</FieldLabel>
            <input
              value={values.thumbnailAlt || ""}
              onChange={(e) => patch({ thumbnailAlt: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Image Title</FieldLabel>
            <input
              value={values.thumbnailTitle || ""}
              onChange={(e) => patch({ thumbnailTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Thumbnail Sub Description</FieldLabel>
          <RichTextEditor
            value={values.thumbnailSubDescription || ""}
            onChange={(html) => patch({ thumbnailSubDescription: html })}
            placeholder="Thumbnail sub description…"
          />
        </div>
      </Section>


      <Section title="Widgets / Modules Content">
        <div>
          <FieldLabel>Widgets / Modules Content</FieldLabel>
          <textarea
            rows={4}
            value={values.widgetsContent || ""}
            onChange={(e) => patch({ widgetsContent: e.target.value })}
            className={inputClass}
            placeholder="Enter Widgets Content"
          />
        </div>
      </Section>

      <Section title="Relevant Products">
        <div>
          <FieldLabel>Relevant Products Heading</FieldLabel>
          <input
            value={values.relevantProductsHeading || ""}
            onChange={(e) => patch({ relevantProductsHeading: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Relevant Products Description</FieldLabel>
          <textarea
            rows={3}
            value={values.relevantProductsDescription || ""}
            onChange={(e) =>
              patch({ relevantProductsDescription: e.target.value })
            }
            className={inputClass}
            placeholder="Enter Relevant Products Description"
          />
        </div>
        <div>
          <FieldLabel>Select Relevant Products</FieldLabel>
          <input
            value={relatedQuery}
            onChange={(e) => setRelatedQuery(e.target.value)}
            className={`${inputClass} mb-3`}
            placeholder="Search products…"
          />
          <div className="flex flex-wrap gap-2">
            {(values.relatedProductIds || []).map((id) => {
              const p = allProducts.find((item) => item.id === id);
              if (!p) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleRelated(id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-[4px] bg-[#172455] px-2.5 py-1.5 text-xs font-bold text-white"
                >
                  {p.name}
                  <X className="h-3 w-3" />
                </button>
              );
            })}
          </div>
          <div className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-[4px] border border-[#E2E4E8] bg-white p-2">
            {relatedChoices.map((p) => {
              const on = (values.relatedProductIds || []).includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleRelated(p.id)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-[4px] px-2.5 py-2 text-left text-xs font-semibold ${
                    on
                      ? "bg-[#EEF2FF] text-[#172455]"
                      : "text-[#374151] hover:bg-[#F6F8FA]"
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span>{on ? "Selected" : "Add"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      <Section title="Related Blogs">
        <div>
          <FieldLabel>Related Blogs Heading</FieldLabel>
          <input
            value={values.relatedBlogsHeading || ""}
            onChange={(e) => patch({ relatedBlogsHeading: e.target.value })}
            className={inputClass}
            placeholder="Explore More Packaging Guides"
          />
        </div>
        <div>
          <FieldLabel>Related Blogs Description</FieldLabel>
          <textarea
            rows={3}
            value={values.relatedBlogsDescription || ""}
            onChange={(e) => patch({ relatedBlogsDescription: e.target.value })}
            className={inputClass}
            placeholder="Continue learning with practical packaging guides and helpful resources."
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-end justify-between gap-2">
            <FieldLabel>Select Related Blogs (max 4)</FieldLabel>
            <p className="text-[11px] font-semibold text-[#6B7280]">
              {(values.relatedBlogIds || []).length}/4 selected
            </p>
          </div>
          <input
            value={blogQuery}
            onChange={(e) => setBlogQuery(e.target.value)}
            className={`${inputClass} mb-3`}
            placeholder="Search blogs by title…"
          />
          <div className="flex flex-wrap gap-2">
            {(values.relatedBlogIds || []).map((id) => {
              const b = allBlogs.find((item) => item.id === id);
              if (!b) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleBlog(id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-[4px] bg-[#172455] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#FF5548]"
                >
                  <span className="max-w-[280px] truncate">{b.title}</span>
                  <X className="h-3 w-3 shrink-0" />
                </button>
              );
            })}
          </div>
          {allBlogs.length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">
              No published blogs found. You can add blogs in the Blogs section first.
            </p>
          ) : (
            <div className="mt-3 max-h-56 space-y-1 overflow-y-auto rounded-[4px] border border-[#E2E4E8] bg-white p-2">
              {blogChoices.map((b) => {
                const on = (values.relatedBlogIds || []).includes(b.id);
                const atLimit =
                  !on && (values.relatedBlogIds || []).length >= 4;
                return (
                  <button
                    key={b.id}
                    type="button"
                    disabled={atLimit}
                    onClick={() => toggleBlog(b.id)}
                    className={`flex w-full items-center justify-between rounded-[4px] px-2.5 py-2 text-left text-xs font-semibold ${
                      on
                        ? "cursor-pointer bg-[#EEF2FF] text-[#172455]"
                        : atLimit
                          ? "cursor-not-allowed text-[#9CA3AF] opacity-60"
                          : "cursor-pointer text-[#374151] hover:bg-[#F6F8FA]"
                    }`}
                  >
                    <span className="truncate pr-2">{b.title}</span>
                    <span
                      className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${
                        on
                          ? "bg-[#172455] text-white"
                          : "border border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {on ? "Selected" : atLimit ? "Limit" : "Add"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <p className="mt-2 text-[11px] text-[#6B7280]">
            Only the 4 selected blogs appear in the Related Blogs section at the
            bottom of the product page.
          </p>
        </div>
      </Section>

      <Section title="Page Scroll Content">
        <YesNo
          label="Page Content Enable / Disable"
          value={values.pageScrollEnabled ?? true}
          onChange={(v) => patch({ pageScrollEnabled: v })}
        />
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-4">
            <ImageUploadField
              label="Image"
              value={values.pageScrollImageUrl || ""}
              onChange={(url) => patch({ pageScrollImageUrl: url })}
              recommended={PRODUCT_CONTENT_IMAGE.recommended}
              hint={PRODUCT_CONTENT_IMAGE.hint}
              folder="packaginghype/products/scroll"
              defaultSlug={values.slug ? `${values.slug}-scroll` : ""}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Image Alt</FieldLabel>
                <input
                  value={values.pageScrollImageAlt || ""}
                  onChange={(e) => patch({ pageScrollImageAlt: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel>Image Title</FieldLabel>
                <input
                  value={values.pageScrollImageTitle || ""}
                  onChange={(e) =>
                    patch({ pageScrollImageTitle: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          <div>
            <FieldLabel>Content</FieldLabel>
            <RichTextEditor
              value={values.pageScrollContent || ""}
              onChange={(html) => patch({ pageScrollContent: html })}
              placeholder="Page scroll content…"
            />
          </div>
        </div>
      </Section>

      <Section title="FAQs">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>FAQs Heading</FieldLabel>
            <input
              value={values.faqsHeading || ""}
              onChange={(e) => patch({ faqsHeading: e.target.value })}
              className={inputClass}
              placeholder="FAQs about…"
            />
          </div>
          <div>
            <FieldLabel>FAQs Subheading</FieldLabel>
            <input
              value={values.faqsSubheading || ""}
              onChange={(e) => patch({ faqsSubheading: e.target.value })}
              className={inputClass}
              placeholder="Enter Faqs SubHeading"
            />
          </div>
        </div>

        <div className="rounded-[8px] border border-[#E8EAEF] bg-white p-4 space-y-4">
          <p className="text-sm font-bold text-[#172455]">FAQ Section Side Image (Optional)</p>
          <div className="grid gap-5 lg:grid-cols-2">
            <ImageUploadField
              label="FAQ Side Image"
              value={values.faqsImageUrl || ""}
              onChange={(url) => patch({ faqsImageUrl: url })}
              recommended={PRODUCT_FAQ_IMAGE.recommended}
              hint={PRODUCT_FAQ_IMAGE.hint}
              folder="packaginghype/products/faqs"
              defaultSlug={values.slug ? `${values.slug}-faq` : ""}
            />
            <div>
              <FieldLabel>FAQ Image Alt Text</FieldLabel>
              <input
                value={values.faqsImageAlt || ""}
                onChange={(e) => patch({ faqsImageAlt: e.target.value })}
                className={inputClass}
                placeholder="Describe FAQ side image for SEO & accessibility"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                When provided, the FAQ section displays a 2-column layout with this image on one side.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="space-y-3 rounded-[6px] border border-[#E8EAEF] bg-[#F8FAFC] p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel>Question {index + 1}</FieldLabel>
                  <button
                    type="button"
                    onClick={() =>
                      setFaqs((prev) =>
                        prev.length <= 1
                          ? [{ question: "", answer: "" }]
                          : prev.filter((_, i) => i !== index)
                      )
                    }
                    className="inline-flex cursor-pointer items-center gap-1 rounded-[4px] px-2 py-1 text-xs font-bold text-[#FF5548] hover:bg-[#FFF5F4]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <input
                  value={faq.question}
                  onChange={(e) =>
                    setFaqs((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, question: e.target.value }
                          : item
                      )
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel>Answer {index + 1}</FieldLabel>
                <RichTextEditor
                  value={faq.answer}
                  onChange={(html) =>
                    setFaqs((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, answer: html } : item
                      )
                    )
                  }
                  placeholder="Write the answer…"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setFaqs((prev) => [...prev, { question: "", answer: "" }])
          }
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] bg-[#172455] px-3 py-2 text-xs font-bold text-white hover:bg-[#0f1839]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add FAQ
        </button>
      </Section>

      <Section title="Merchant Images">
        <ImageUploadField
          label="Add Merchant Image"
          value=""
          onChange={(url) => {
            if (!url) return;
            patch({
              merchantImageUrls: [...(values.merchantImageUrls || []), url],
            });
          }}
          recommended={PRODUCT_MERCHANT_IMAGE.recommended}
          hint={PRODUCT_MERCHANT_IMAGE.hint}
          folder="packaginghype/products/merchant"
          defaultSlug={values.slug ? `${values.slug}-merchant` : ""}
        />
        <div>
          <p className="mb-3 text-sm font-bold text-[#172455]">
            Existing Merchant Images{" "}
            <span className="font-medium text-[#6B7280]">
              ({(values.merchantImageUrls || []).length})
            </span>
          </p>
          <div className="rounded-[8px] border border-[#E8EAEF] bg-[#F8FAFC] p-3">
            {(values.merchantImageUrls || []).length === 0 ? (
              <div className="flex h-[140px] items-center justify-center rounded-[6px] border border-dashed border-[#E2E4E8] bg-white text-[12px] font-medium text-[#9CA3AF]">
                No merchant images yet — upload above
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {(values.merchantImageUrls || []).map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white"
                  >
                    <div className="relative h-[140px] w-full bg-[#F8FAFC]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Merchant ${index + 1}`}
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#172455]">
                        Image {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          patch({
                            merchantImageUrls: (
                              values.merchantImageUrls || []
                            ).filter((_, i) => i !== index),
                          })
                        }
                        className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-[4px] border border-[#E2E4E8] px-3 text-xs font-bold text-[#FF5548] hover:bg-[#FFF5F4]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section title="Navbar">
        <YesNo
          label="Navbar Enable / Disable"
          value={values.navbarEnabled ?? true}
          onChange={(v) => patch({ navbarEnabled: v })}
        />
      </Section>

      <Section title="Feature Product">
        <YesNo
          label="Feature Enable / Disable"
          value={values.featureEnabled ?? true}
          onChange={(v) => patch({ featureEnabled: v })}
        />
      </Section>

      <Section title="SEO Content">
        <YesNo
          label="SEO Enable / Disable"
          value={values.seoEnabled ?? true}
          onChange={(v) => patch({ seoEnabled: v })}
        />
      </Section>

      <Section title="Seo Friendly Fields">
        <div>
          <FieldLabel required>URL</FieldLabel>
          <input
            required
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              patch({ slug: slugify(e.target.value) });
            }}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel required>Browser Title</FieldLabel>
          <input
            value={values.seoTitle || ""}
            onChange={(e) => patch({ seoTitle: e.target.value })}
            className={inputClass}
            placeholder="Product Title | Packaging Hype"
          />
        </div>
        <div>
          <FieldLabel>Meta Keywords</FieldLabel>
          <textarea
            rows={2}
            value={values.seoKeywords || ""}
            onChange={(e) => patch({ seoKeywords: e.target.value })}
            className={inputClass}
            placeholder="Enter Meta Keywords"
          />
        </div>
        <div>
          <FieldLabel>Meta Description</FieldLabel>
          <textarea
            rows={3}
            value={values.seoDescription || ""}
            onChange={(e) => patch({ seoDescription: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Script</FieldLabel>
          <textarea
            rows={6}
            value={values.seoScript || ""}
            onChange={(e) => patch({ seoScript: e.target.value })}
            className={`${inputClass} font-mono text-[12px]`}
            placeholder='<script type="application/ld+json">…</script>'
          />
        </div>
        <div>
          <FieldLabel>Canonical URL</FieldLabel>
          <input
            value={values.canonicalUrl || ""}
            onChange={(e) => patch({ canonicalUrl: e.target.value })}
            className={inputClass}
            placeholder={`https://packaginghype.com/product/${values.slug || "product-slug"}`}
          />
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Leave empty to use the default URL: https://packaginghype.com/product/{values.slug || "product-slug"}
          </p>
        </div>
        <YesNo
          label="Status"
          value={values.isPublished ?? true}
          onChange={(v) => patch({ isPublished: v })}
        />
      </Section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E8EAEF] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:left-64">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            {error ? (
              <p className="text-sm font-semibold text-red-600">{error}</p>
            ) : success ? (
              <p className="text-sm font-semibold text-emerald-700">{success}</p>
            ) : (
              <p className="text-xs text-[#6B7280]">
                Stay on this page after save — fix the slug if it is already taken.
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="cursor-pointer rounded-[4px] px-5 py-2.5 text-sm font-semibold text-[#172455] hover:bg-[#F6F8FA]"
            >
              Back to list
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer rounded-[4px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving…"
                : savedProductId || productId
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
