"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import {
  CATEGORY_GROUP_META,
  type CategoryGroupKey,
} from "@/lib/category-groups";

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

export type ProductSpecInput = {
  heading: string;
  details: string;
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
  fullDescription?: string | null;
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
  detailHeading?: string | null;
  detailShortDescription?: string | null;
  specsHeading?: string | null;
  specsDescription?: string | null;
  specsTableHeading?: string | null;
  specs?: ProductSpecInput[];
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
  isPublished?: boolean;
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
    fullDescription: initial?.fullDescription || "",
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
    detailHeading: initial?.detailHeading || "",
    detailShortDescription: initial?.detailShortDescription || "",
    specsHeading: initial?.specsHeading || "",
    specsDescription: initial?.specsDescription || "",
    specsTableHeading: initial?.specsTableHeading || "",
    widgetsContent: initial?.widgetsContent || "",
    relevantProductsHeading: initial?.relevantProductsHeading || "Related Products",
    relevantProductsDescription: initial?.relevantProductsDescription || "",
    relatedProductIds: initial?.relatedProductIds || [],
    relatedBlogsHeading:
      initial?.relatedBlogsHeading || "Related Articles & Packaging Guides",
    relatedBlogsDescription: initial?.relatedBlogsDescription || "",
    relatedBlogIds: initial?.relatedBlogIds || [],
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

  const [specs, setSpecs] = useState<ProductSpecInput[]>(
    initial?.specs?.length
      ? initial.specs
      : [{ heading: "Specification", details: "" }]
  );
  const [faqs, setFaqs] = useState<ProductFaqInput[]>(
    initial?.faqs?.length
      ? initial.faqs
      : [{ question: "", answer: "" }]
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      const set = new Set(prev.relatedBlogIds || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, relatedBlogIds: Array.from(set) };
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
    setLoading(true);

    const payload = {
      ...values,
      startingPrice: values.originalPrice,
      images,
      specs: specs.filter((s) => s.heading.trim() || s.details.trim()),
      faqs: faqs.filter((f) => f.question.trim()),
      merchantImageUrls: (values.merchantImageUrls || []).filter((u) => u.trim()),
      materialsAvailable: values.materialsAvailable || [],
      finishesAvailable: values.finishesAvailable || [],
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
                patch({ slug: slugify(e.target.value) });
              }}
              className={inputClass}
            />
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
            <div className="max-h-[220px] min-h-[140px] space-y-2 overflow-y-auto overscroll-contain pr-1">
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
                <div className="min-h-0 flex-1 content-start overflow-y-auto overscroll-contain">
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
          recommended="900 × 900 px (1:1 square)"
          hint="Max 2MB · JPG, PNG, WEBP"
          folder="packaginghype/products/gallery"
        />

        <div>
          <p className="mb-3 text-sm font-bold text-[#172455]">
            Existing Images{" "}
            <span className="font-medium text-[#6B7280]">
              ({images.length})
            </span>
          </p>
          {/* Fixed min-height + scroll so adding cards doesn't shove the whole form */}
          <div className="min-h-[300px] max-h-[640px] overflow-y-auto overscroll-contain rounded-[8px] border border-[#E8EAEF] bg-[#F8FAFC] p-3">
          {images.length === 0 ? (
            <div className="flex h-[276px] items-center justify-center rounded-[6px] border border-dashed border-[#E2E4E8] bg-white text-[12px] font-medium text-[#9CA3AF]">
              No gallery images yet — upload above
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((img, index) => (
                <div
                  key={`${img.imageUrl}-${index}`}
                  className="flex flex-col overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white"
                >
                  <div className="relative h-[140px] w-full bg-[#F8FAFC]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.imageUrl}
                      alt={img.altText || `Image ${index + 1}`}
                      className="h-full w-full object-cover"
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

      <Section title="Product Video">
        <div className="grid gap-5 xl:grid-cols-2">
          <MediaUploadField
            label="Video File"
            value={values.videoUrl || ""}
            onChange={(url) => patch({ videoUrl: url })}
            recommended="MP4 only, max 5MB, one video per product"
            kind="video"
            folder="packaginghype/products/video"
          />
          <MediaUploadField
            label="Video Thumbnail"
            value={values.videoThumbnailUrl || ""}
            onChange={(url) => patch({ videoThumbnailUrl: url })}
            recommended="webp, png, jpg, jpeg · max 1MB"
            folder="packaginghype/products/video-thumb"
          />
        </div>
        <div>
          <FieldLabel>Video Description</FieldLabel>
          <textarea
            rows={3}
            value={values.videoDescription || ""}
            onChange={(e) => patch({ videoDescription: e.target.value })}
            className={inputClass}
            placeholder="Enter video description"
          />
        </div>
      </Section>

      <Section title="Product Thumbnail">
        <div className="grid gap-4 lg:grid-cols-3">
          <ImageUploadField
            label="Thumbnail"
            value={values.thumbnailUrl || ""}
            onChange={(url) => patch({ thumbnailUrl: url })}
            recommended="900 × 900 px (1:1 square)"
            hint="Max 2MB · JPG, PNG, WEBP"
            folder="packaginghype/products/thumb"
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

      <Section title="Product Detail">
        <div>
          <FieldLabel>Detail Heading</FieldLabel>
          <input
            value={values.detailHeading || ""}
            onChange={(e) => patch({ detailHeading: e.target.value })}
            className={inputClass}
            placeholder="Enter Detail Heading"
          />
        </div>
        <div>
          <FieldLabel>Detail Short Description</FieldLabel>
          <RichTextEditor
            value={values.detailShortDescription || ""}
            onChange={(html) => patch({ detailShortDescription: html })}
            placeholder="Detail short description…"
          />
        </div>
        <div>
          <FieldLabel>Full Description</FieldLabel>
          <RichTextEditor
            value={values.fullDescription || ""}
            onChange={(html) => patch({ fullDescription: html })}
            placeholder="Full product description…"
          />
        </div>
      </Section>

      <Section title="Specifications">
        <div>
          <FieldLabel>Specifications Heading</FieldLabel>
          <input
            value={values.specsHeading || ""}
            onChange={(e) => patch({ specsHeading: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Specification Description</FieldLabel>
          <RichTextEditor
            value={values.specsDescription || ""}
            onChange={(html) => patch({ specsDescription: html })}
          />
        </div>
        <div>
          <FieldLabel>Table Heading</FieldLabel>
          <input
            value={values.specsTableHeading || ""}
            onChange={(e) => patch({ specsTableHeading: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-[6px] border border-[#E8EAEF] bg-[#F8FAFC] p-3 sm:grid-cols-[180px_1fr_auto]"
            >
              <div>
                <FieldLabel>Heading</FieldLabel>
                <input
                  value={spec.heading}
                  onChange={(e) =>
                    setSpecs((prev) =>
                      prev.map((row, i) =>
                        i === index ? { ...row, heading: e.target.value } : row
                      )
                    )
                  }
                  className={inputClass}
                  placeholder="Heading"
                />
              </div>
              <div>
                <FieldLabel>Details</FieldLabel>
                <textarea
                  rows={2}
                  value={spec.details}
                  onChange={(e) =>
                    setSpecs((prev) =>
                      prev.map((row, i) =>
                        i === index ? { ...row, details: e.target.value } : row
                      )
                    )
                  }
                  className={inputClass}
                  placeholder="Details"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setSpecs((prev) =>
                    prev.length <= 1
                      ? [{ heading: "", details: "" }]
                      : prev.filter((_, i) => i !== index)
                  )
                }
                className="mt-6 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[4px] bg-[#FF5548] text-white hover:bg-[#e04337]"
                aria-label="Remove row"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setSpecs((prev) => [...prev, { heading: "", details: "" }])
          }
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] bg-[#172455] px-3 py-2 text-xs font-bold text-white hover:bg-[#0f1839]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add More
        </button>
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
            placeholder="Related Articles & Packaging Guides"
          />
        </div>
        <div>
          <FieldLabel>Related Blogs Description</FieldLabel>
          <textarea
            rows={3}
            value={values.relatedBlogsDescription || ""}
            onChange={(e) => patch({ relatedBlogsDescription: e.target.value })}
            className={inputClass}
            placeholder="Read our latest packaging tips, materials guides, and industry insights."
          />
        </div>
        <div>
          <FieldLabel>Select Related Blogs</FieldLabel>
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
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => toggleBlog(b.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-[4px] px-2.5 py-2 text-left text-xs font-semibold ${
                      on
                        ? "bg-[#EEF2FF] text-[#172455]"
                        : "text-[#374151] hover:bg-[#F6F8FA]"
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
                      {on ? "Selected" : "Add"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
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
              recommended="1200 × 900 px (landscape) · Max 2MB"
              folder="packaginghype/products/scroll"
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
              recommended="800 × 800 or 1200 × 900 px · Max 2MB"
              folder="packaginghype/products/faqs"
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
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#172455]">
                  Question {index + 1}
                </p>
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
              <div>
                <FieldLabel>Question {index + 1}</FieldLabel>
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
          recommended="900 × 900 px"
          folder="packaginghype/products/merchant"
        />
        <div>
          <p className="mb-3 text-sm font-bold text-[#172455]">
            Existing Merchant Images{" "}
            <span className="font-medium text-[#6B7280]">
              ({(values.merchantImageUrls || []).length})
            </span>
          </p>
          <div className="min-h-[200px] max-h-[420px] overflow-y-auto overscroll-contain rounded-[8px] border border-[#E8EAEF] bg-[#F8FAFC] p-3">
            {(values.merchantImageUrls || []).length === 0 ? (
              <div className="flex h-[176px] items-center justify-center rounded-[6px] border border-dashed border-[#E2E4E8] bg-white text-[12px] font-medium text-[#9CA3AF]">
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
        <YesNo
          label="Status"
          value={values.isPublished ?? true}
          onChange={(v) => patch({ isPublished: v })}
        />
      </Section>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E8EAEF] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:left-64">
        <div className="flex w-full items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="cursor-pointer rounded-[4px] px-5 py-2.5 text-sm font-semibold text-[#172455] hover:bg-[#F6F8FA]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-[4px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving…" : productId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}
