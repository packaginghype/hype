"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import {
  adminEditCategoryHref,
  CATEGORY_GROUP_META,
  type CategoryGroupKey,
} from "@/lib/category-groups";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  CATEGORY_BANNER_IMAGE,
  CATEGORY_THUMBNAIL_IMAGE,
  CATEGORY_CONTENT_IMAGE,
  CATEGORY_FAQ_IMAGE,
} from "@/lib/image-presets";
import {
  CANONICAL_MATERIAL_IMAGES,
  CANONICAL_DESIGN_IMAGES,
} from "@/data/category-page-content";

export type CategoryFaqInput = {
  question: string;
  answer: string;
};

export type CategoryMaterialInput = {
  title: string;
  description: string;
  bestFor: string;
  imageUrl: string;
  imageAlt?: string;
  imageTitle?: string;
};

export type CategoryWidgetsConfig = {
  materialsHeading: string;
  materialsDescription: string;
  materials: CategoryMaterialInput[];
  designHeading: string;
  designDescription: string;
  designImages: string[];
};

export const DEFAULT_PACKAGING_IMAGES = CANONICAL_MATERIAL_IMAGES;

const DEFAULT_MATERIAL: CategoryMaterialInput = {
  title: "",
  description: "",
  bestFor: "",
  imageUrl: CANONICAL_MATERIAL_IMAGES[0],
};

function parseCategoryWidgets(
  widgetsContent?: string | null,
  categoryName: string = "",
  fallbackImages: string[] = []
): CategoryWidgetsConfig {
  let parsed: any = null;
  if (widgetsContent) {
    try {
      parsed = JSON.parse(widgetsContent);
    } catch {}
  }

  const name = categoryName.replace(/^Custom\s+/i, "").trim() || "Boxes";
  const defaultMatHeading = `Explore the Material For Custom ${name}`;
  const defaultMatDesc = `Discover premium materials like natural kraft, corrugated, and eco-friendly options for durable, sustainable, and customizable ${name.toLowerCase()}.`;

  const defaultMaterials: CategoryMaterialInput[] = [
    {
      title: `White Stock ${name}`,
      description:
        "A clean, bright surface ideal for vibrant branding and full-color printing that makes product details pop on shelf.",
      bestFor: "cosmetics, perfume, and retail gift packaging.",
      imageUrl: CANONICAL_MATERIAL_IMAGES[0],
    },
    {
      title: `Natural Kraft ${name}`,
      description:
        "Eco-friendly kraft stock with a warm, authentic finish that signals sustainability without sacrificing durability.",
      bestFor: "food products, organic brands, and everyday retail.",
      imageUrl: CANONICAL_MATERIAL_IMAGES[1],
    },
    {
      title: `Coated Board ${name}`,
      description:
        "Smooth coated board with glossy or matte options for sharp graphics, scuff resistance, and a retail-ready feel.",
      bestFor: "serums, essential oils, and premium consumer goods.",
      imageUrl: CANONICAL_MATERIAL_IMAGES[2],
    },
    {
      title: `Recycled Material ${name}`,
      description:
        "Responsible fiber options that keep your packaging sturdy while supporting eco-conscious brand messaging.",
      bestFor: "sustainable product lines and subscription brands.",
      imageUrl: CANONICAL_MATERIAL_IMAGES[3],
    },
  ];

  const materials =
    Array.isArray(parsed?.materials) && parsed.materials.length > 0
      ? parsed.materials.map((m: any, i: number) => ({
          title: m.title || defaultMaterials[i]?.title || `Material ${i + 1}`,
          description: m.description || defaultMaterials[i]?.description || "",
          bestFor: m.bestFor || defaultMaterials[i]?.bestFor || "",
          imageUrl:
            typeof m.imageUrl === "string" && m.imageUrl.trim() !== ""
              ? m.imageUrl
              : CANONICAL_MATERIAL_IMAGES[i % CANONICAL_MATERIAL_IMAGES.length],
        }))
      : defaultMaterials;

  const parsedDesignImages =
    Array.isArray(parsed?.designImages) && parsed.designImages.length > 0
      ? parsed.designImages
      : [];

  const designImages = [
    typeof parsedDesignImages[0] === "string" && parsedDesignImages[0].trim() !== ""
      ? parsedDesignImages[0]
      : CANONICAL_DESIGN_IMAGES[0],
    typeof parsedDesignImages[1] === "string" && parsedDesignImages[1].trim() !== ""
      ? parsedDesignImages[1]
      : CANONICAL_DESIGN_IMAGES[1],
    typeof parsedDesignImages[2] === "string" && parsedDesignImages[2].trim() !== ""
      ? parsedDesignImages[2]
      : CANONICAL_DESIGN_IMAGES[2],
  ];

  return {
    materialsHeading: parsed?.materialsHeading || defaultMatHeading,
    materialsDescription: parsed?.materialsDescription || defaultMatDesc,
    materials,
    designHeading: parsed?.designHeading || `Design Options for ${name}`,
    designDescription:
      parsed?.designDescription ||
      `Choose from tuck-end, sleeve, mailer, window, and handle designs to create custom ${name.toLowerCase()} that match your brand.`,
    designImages,
  };
}

function serializeWidgets(widgets: CategoryWidgetsConfig): string {
  return JSON.stringify({
    materialsHeading: widgets.materialsHeading.trim(),
    materialsDescription: widgets.materialsDescription.trim(),
    materials: widgets.materials.filter((m) => m.title.trim()),
    designHeading: widgets.designHeading.trim(),
    designDescription: widgets.designDescription.trim(),
    designImages: widgets.designImages.filter(Boolean),
  });
}

export type CategoryFormValues = {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sortOrder?: number;
  group?: CategoryGroupKey;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  inStock?: boolean;
  bannerEnabled?: boolean;
  bannerQuoteEnabled?: boolean;
  bannerHeading?: string | null;
  bannerDescription?: string | null;
  bannerImageUrl?: string | null;
  bannerImageAlt?: string | null;
  bannerImageTitle?: string | null;
  imageAlt?: string | null;
  imageTitle?: string | null;
  widgetsContent?: string | null;
  listingHeading?: string | null;
  listingText?: string | null;
  navbarEnabled?: boolean;
  featureEnabled?: boolean;
  pageScrollEnabled?: boolean;
  pageScrollImageUrl?: string | null;
  pageScrollImageAlt?: string | null;
  pageScrollImageTitle?: string | null;
  pageScrollContent?: string | null;
  faqsHeading?: string | null;
  faqsSubheading?: string | null;
  faqsImageUrl?: string | null;
  faqsImageAlt?: string | null;
  faqs?: CategoryFaqInput[];
  seoEnabled?: boolean;
  seoKeywords?: string | null;
  seoScript?: string | null;
  canonicalUrl?: string | null;
  isPublished?: boolean;
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
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white shadow-[0_1px_0_rgba(23,36,85,0.04)] ${className || ""}`}
    >
      <div className="admin-section-bar bg-[#172455] px-4 py-2.5 sm:px-5">
        <p className="text-sm font-bold uppercase tracking-wider text-white">
          {title}
        </p>
      </div>
      <div className="space-y-4 p-4 sm:p-5 lg:p-6">{children}</div>
    </section>
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
          className={`px-4 py-2 text-xs font-bold ${
            value ? "bg-[#172455] text-white" : "bg-white text-[#172455]"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-2 text-xs font-bold ${
            !value ? "bg-[#172455] text-white" : "bg-white text-[#172455]"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-[#172455]">
      {children}
    </label>
  );
}

export function CategoryForm({
  initial,
  categoryId,
  defaultGroup = "categories",
  defaultImages = [],
}: {
  initial?: CategoryFormValues;
  categoryId?: string;
  defaultGroup?: CategoryGroupKey;
  defaultImages?: string[];
}) {
  const router = useRouter();
  const group = (initial?.group || defaultGroup) as CategoryGroupKey;
  const listHref = CATEGORY_GROUP_META[group].adminHref;

  const [values, setValues] = useState<CategoryFormValues>({
    name: initial?.name || "",
    slug: initial?.slug || "",
    description: initial?.description || "",
    imageUrl: initial?.imageUrl || "",
    seoTitle: initial?.seoTitle || "",
    seoDescription: initial?.seoDescription || "",
    sortOrder: initial?.sortOrder ?? 0,
    group,
    originalPrice: initial?.originalPrice ?? null,
    discountedPrice: initial?.discountedPrice ?? null,
    inStock: initial?.inStock ?? true,
    bannerEnabled: initial?.bannerEnabled ?? true,
    bannerQuoteEnabled: initial?.bannerQuoteEnabled ?? true,
    bannerHeading: initial?.bannerHeading || "",
    bannerDescription: initial?.bannerDescription || "",
    bannerImageUrl: initial?.bannerImageUrl || "",
    bannerImageAlt: initial?.bannerImageAlt || "",
    bannerImageTitle: initial?.bannerImageTitle || "",
    imageAlt: initial?.imageAlt || "",
    imageTitle: initial?.imageTitle || "",
    widgetsContent: initial?.widgetsContent || "",
    listingHeading: initial?.listingHeading || "",
    listingText: initial?.listingText || "",
    navbarEnabled: initial?.navbarEnabled ?? true,
    featureEnabled: initial?.featureEnabled ?? true,
    pageScrollEnabled: initial?.pageScrollEnabled ?? true,
    pageScrollImageUrl: initial?.pageScrollImageUrl || "",
    pageScrollImageAlt: initial?.pageScrollImageAlt || "",
    pageScrollImageTitle: initial?.pageScrollImageTitle || "",
    pageScrollContent: initial?.pageScrollContent || "",
    faqsHeading: initial?.faqsHeading || "",
    faqsSubheading: initial?.faqsSubheading || "",
    faqsImageUrl: initial?.faqsImageUrl || "",
    faqsImageAlt: initial?.faqsImageAlt || "",
    seoEnabled: initial?.seoEnabled ?? true,
    seoKeywords: initial?.seoKeywords || "",
    seoScript: initial?.seoScript || "",
    canonicalUrl: initial?.canonicalUrl || "",
    isPublished: initial?.isPublished ?? true,
  });

  const [faqs, setFaqs] = useState<CategoryFaqInput[]>(
    initial?.faqs?.length
      ? initial.faqs
      : [{ question: "", answer: "" }]
  );

  const fallbackList = Array.from(
    new Set(
      [
        ...defaultImages,
        initial?.imageUrl,
        initial?.bannerImageUrl,
        initial?.pageScrollImageUrl,
        ...DEFAULT_PACKAGING_IMAGES,
      ].filter((img): img is string => typeof img === "string" && img.trim() !== "")
    )
  );

  const [widgets, setWidgets] = useState<CategoryWidgetsConfig>(() => {
    return parseCategoryWidgets(initial?.widgetsContent, initial?.name, fallbackList);
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [savedCategoryId, setSavedCategoryId] = useState(categoryId);

  function patch(p: Partial<CategoryFormValues>) {
    setValues((prev) => ({ ...prev, ...p }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const currentGroup = (values.group || group) as CategoryGroupKey;
    const activeId = savedCategoryId || categoryId;

    const payload = {
      ...values,
      group: currentGroup,
      faqs: faqs.filter((f) => f.question.trim() || f.answer.trim()),
      widgetsContent: serializeWidgets(widgets),
      originalPrice:
        values.originalPrice === null || values.originalPrice === undefined
          ? null
          : Number(values.originalPrice),
      discountedPrice:
        values.discountedPrice === null || values.discountedPrice === undefined
          ? null
          : Number(values.discountedPrice),
    };

    try {
      const res = await fetch(
        activeId
          ? `/api/admin/categories/${activeId}`
          : "/api/admin/categories",
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
          "Could not save category. Check slug uniqueness and required fields.";
        const isSlugTaken =
          res.status === 409 || /slug already exists/i.test(message);
        setError(
          isSlugTaken
            ? `Slug "${values.slug}" is already used. Choose a different URL / slug.`
            : message
        );
        console.error(data);
        setLoading(false);
        return;
      }

      const newId =
        typeof data?.category?.id === "string" ? data.category.id : activeId;
      if (newId && newId !== savedCategoryId) {
        setSavedCategoryId(newId);
        router.replace(adminEditCategoryHref(newId, currentGroup));
      }
      setSuccess(
        activeId
          ? `${CATEGORY_GROUP_META[currentGroup]?.singularLabel || "Category"} updated successfully.`
          : `${CATEGORY_GROUP_META[currentGroup]?.singularLabel || "Category"} created successfully.`
      );
      router.refresh();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Network error — could not save. Try again.");
      setLoading(false);
    }
  }

  const currentGroup = (values.group || group) as CategoryGroupKey;
  const currentMeta = CATEGORY_GROUP_META[currentGroup] || CATEGORY_GROUP_META.categories;

  return (
    <form onSubmit={onSubmit} className="admin-surface w-full max-w-none space-y-5 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[#E8EAEF] bg-white px-4 py-3 sm:px-5">
        <p className="text-sm font-medium text-[#172455]">
          Saving under{" "}
          <span className="font-bold text-[#FF5548]">{currentMeta.label}</span>
        </p>
        <p className="text-[12px] font-medium text-[#4B5563]">
          Full-width editor · Upload images or paste CDN URLs
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Section title="Basic Info">
          <div>
            <FieldLabel>Title</FieldLabel>
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
              placeholder="e.g. Custom CBD Boxes"
            />
          </div>
          <div>
            <FieldLabel>Collection / Group</FieldLabel>
            <select
              value={values.group || group}
              onChange={(e) =>
                patch({ group: e.target.value as CategoryGroupKey })
              }
              className={inputClass}
            >
              <option value="industries">Industries</option>
              <option value="materials">Box by Materials</option>
              <option value="shapes">Shapes & Styles</option>
              <option value="categories">Categories</option>
            </select>
          </div>
        </Section>

        <Section title="Pricing">
          <div className="grid gap-4 sm:grid-cols-2">
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
                placeholder="0.00"
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
                placeholder="Enter discounted price"
              />
            </div>
          </div>
          <YesNo
            label="In Stock"
            value={values.inStock ?? true}
            onChange={(v) => patch({ inStock: v })}
          />
        </Section>
      </div>

      <Section title="Banner">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <YesNo
            label="Banner Enable / Disable"
            value={values.bannerEnabled ?? true}
            onChange={(v) => patch({ bannerEnabled: v })}
          />
          <YesNo
            label="Banner Request Quote Enable / Disable"
            value={values.bannerQuoteEnabled ?? true}
            onChange={(v) => patch({ bannerQuoteEnabled: v })}
          />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <div>
            <FieldLabel>Banner Heading</FieldLabel>
            <RichTextEditor
              value={values.bannerHeading || ""}
              onChange={(html) => patch({ bannerHeading: html })}
              placeholder="Banner heading…"
            />
          </div>
          <div>
            <FieldLabel>Banner Description</FieldLabel>
            <RichTextEditor
              value={values.bannerDescription || ""}
              onChange={(html) => patch({ bannerDescription: html })}
              placeholder="Banner description…"
            />
          </div>
        </div>
        <ImageUploadField
          label="Banner Image"
          value={values.bannerImageUrl || ""}
          onChange={(url) => patch({ bannerImageUrl: url })}
          recommended={CATEGORY_BANNER_IMAGE.recommended}
          hint={CATEGORY_BANNER_IMAGE.hint}
          folder="packaginghype/categories/banner"
          defaultSlug={values.slug ? `${values.slug}-banner` : ""}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Banner Image Alt</FieldLabel>
            <input
              value={values.bannerImageAlt || ""}
              onChange={(e) => patch({ bannerImageAlt: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Banner Image Title</FieldLabel>
            <input
              value={values.bannerImageTitle || ""}
              onChange={(e) => patch({ bannerImageTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      <div className="grid gap-5 xl:grid-cols-2">
        <Section title="Thumbnail">
          <ImageUploadField
            label="Thumbnail Image"
            value={values.imageUrl || ""}
            onChange={(url) => patch({ imageUrl: url })}
            recommended={CATEGORY_THUMBNAIL_IMAGE.recommended}
            hint={CATEGORY_THUMBNAIL_IMAGE.hint}
            folder="packaginghype/categories/thumb"
            defaultSlug={values.slug || ""}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Image Alt</FieldLabel>
              <input
                value={values.imageAlt || ""}
                onChange={(e) => patch({ imageAlt: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel>Image Title</FieldLabel>
              <input
                value={values.imageTitle || ""}
                onChange={(e) => patch({ imageTitle: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </Section>

      </div>

      <Section title="Product Listing">
        <div>
          <FieldLabel>Listing Heading</FieldLabel>
          <input
            value={values.listingHeading || ""}
            onChange={(e) => patch({ listingHeading: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Product Listing Text</FieldLabel>
          <RichTextEditor
            value={values.listingText || ""}
            onChange={(html) => patch({ listingText: html })}
            placeholder="Listing intro text…"
          />
        </div>
      </Section>

      <Section title="Page Modules">
        <div className="grid gap-4 sm:grid-cols-3">
          <YesNo
            label="Navbar Enable / Disable"
            value={values.navbarEnabled ?? true}
            onChange={(v) => patch({ navbarEnabled: v })}
          />
          <YesNo
            label="Feature Enable / Disable"
            value={values.featureEnabled ?? true}
            onChange={(v) => patch({ featureEnabled: v })}
          />
          <YesNo
            label="Page Content Enable / Disable"
            value={values.pageScrollEnabled ?? true}
            onChange={(v) => patch({ pageScrollEnabled: v })}
          />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-4">
            <ImageUploadField
              label="Page Scroll Image"
              value={values.pageScrollImageUrl || ""}
              onChange={(url) => patch({ pageScrollImageUrl: url })}
              recommended={CATEGORY_CONTENT_IMAGE.recommended}
              hint={CATEGORY_CONTENT_IMAGE.hint}
              folder="packaginghype/categories/scroll"
              defaultSlug={values.slug ? `${values.slug}-scroll` : ""}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Image Alt</FieldLabel>
                <input
                  value={values.pageScrollImageAlt || ""}
                  onChange={(e) =>
                    patch({ pageScrollImageAlt: e.target.value })
                  }
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
              placeholder="Enter FAQs subheading"
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
              recommended={CATEGORY_FAQ_IMAGE.recommended}
              hint={CATEGORY_FAQ_IMAGE.hint}
              folder="packaginghype/categories/faqs"
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
                    className="inline-flex items-center gap-1 rounded-[4px] px-2 py-1 text-xs font-bold text-[#FF5548] hover:bg-[#FFF5F4]"
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
                        i === index ? { ...item, question: e.target.value } : item
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
          onClick={() => setFaqs((prev) => [...prev, { question: "", answer: "" }])}
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#E2E4E8] px-3 py-2 text-xs font-bold text-[#172455] hover:border-[#172455]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add FAQ
        </button>
      </Section>

      <Section title="SEO Content">
        <YesNo
          label="SEO Enable / Disable"
          value={values.seoEnabled ?? true}
          onChange={(v) => patch({ seoEnabled: v })}
        />
        <div>
          <FieldLabel>URL / Slug *</FieldLabel>
          <input
            required
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              patch({ slug: slugify(e.target.value) });
            }}
            className={inputClass}
            placeholder="e.g. cbd-boxes"
          />
        </div>
        <div>
          <FieldLabel>Browser Title *</FieldLabel>
          <input
            value={values.seoTitle || ""}
            onChange={(e) => patch({ seoTitle: e.target.value })}
            className={inputClass}
            placeholder="Custom Boxes | Packaging Hype"
          />
        </div>
        <div>
          <FieldLabel>Meta Keywords</FieldLabel>
          <textarea
            rows={2}
            value={values.seoKeywords || ""}
            onChange={(e) => patch({ seoKeywords: e.target.value })}
            className={inputClass}
            placeholder="Enter meta keywords"
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
            rows={3}
            value={values.seoScript || ""}
            onChange={(e) => patch({ seoScript: e.target.value })}
            className={inputClass}
            placeholder="Enter script"
          />
        </div>
        <div>
          <FieldLabel>Canonical URL</FieldLabel>
          <input
            value={values.canonicalUrl || ""}
            onChange={(e) => patch({ canonicalUrl: e.target.value })}
            className={inputClass}
            placeholder={`https://packaginghype.com/${values.slug || "page-slug"}`}
          />
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Leave empty to use the default URL: https://packaginghype.com/{values.slug || "page-slug"}
          </p>
        </div>
        <YesNo
          label="Status"
          value={values.isPublished ?? true}
          onChange={(v) => patch({ isPublished: v })}
        />
      </Section>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {success ? (
        <p className="text-sm font-medium text-emerald-700">{success}</p>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E8EAEF] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:left-64">
        <div className="mx-auto flex w-full max-w-none flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            {error ? (
              <p className="truncate text-xs font-semibold text-red-600">
                {error}
              </p>
            ) : success ? (
              <p className="truncate text-xs font-semibold text-emerald-700">
                {success}
              </p>
            ) : (
              <p className="hidden text-[12px] text-[#6B7280] sm:block">
                Save keeps you on this editor — no redirect to the list.
              </p>
            )}
          </div>
          <div className="flex flex-1 justify-end gap-3 sm:flex-none">
            <button
              type="button"
              onClick={() => router.push(listHref)}
              className="rounded-[4px] px-5 py-2.5 text-sm font-semibold text-[#172455] hover:bg-[#F6F8FA]"
            >
              Back to list
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-[4px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : savedCategoryId || categoryId
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
