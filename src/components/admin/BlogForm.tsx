"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export type BlogFormValues = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featuredEnabled?: boolean;
  bannerImageUrl?: string | null;
  bannerImageAlt?: string | null;
  bannerImageTitle?: string | null;
  thumbnailImageUrl?: string | null;
  thumbnailImageAlt?: string | null;
  thumbnailImageTitle?: string | null;
  author?: string | null;
  publishedDate?: string | null;
  seoTitle?: string | null;
  seoKeywords?: string | null;
  seoDescription?: string | null;
  seoScript?: string | null;
  isPublished?: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toDateInput(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
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
          On
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`cursor-pointer px-4 py-2 text-xs font-bold ${
            !value ? "bg-[#172455] text-white" : "bg-white text-[#172455]"
          }`}
        >
          Off
        </button>
      </div>
    </div>
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

export function BlogForm({
  initial,
  postId,
}: {
  initial?: BlogFormValues;
  postId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>({
    title: initial?.title || "",
    slug: initial?.slug || "",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    featuredEnabled: initial?.featuredEnabled ?? false,
    bannerImageUrl: initial?.bannerImageUrl || "",
    bannerImageAlt: initial?.bannerImageAlt || "",
    bannerImageTitle: initial?.bannerImageTitle || "",
    thumbnailImageUrl: initial?.thumbnailImageUrl || "",
    thumbnailImageAlt: initial?.thumbnailImageAlt || "",
    thumbnailImageTitle: initial?.thumbnailImageTitle || "",
    author: initial?.author || "Packaging Hype Team",
    publishedDate: toDateInput(initial?.publishedDate) || toDateInput(new Date().toISOString()),
    seoTitle: initial?.seoTitle || "",
    seoKeywords: initial?.seoKeywords || "",
    seoDescription: initial?.seoDescription || "",
    seoScript: initial?.seoScript || "",
    isPublished: initial?.isPublished ?? true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  function patch(p: Partial<BlogFormValues>) {
    setValues((prev) => ({ ...prev, ...p }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(
      postId ? `/api/admin/blogs/${postId}` : "/api/admin/blogs",
      {
        method: postId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(
        "Could not save blog post. Check slug uniqueness and required fields."
      );
      console.error(data);
      return;
    }

    router.push("/admin/blogs");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="admin-surface w-full max-w-none space-y-5 pb-24"
    >
      <Section title="Basic Info">
        <div>
          <FieldLabel required>Title</FieldLabel>
          <input
            required
            value={values.title}
            onChange={(e) => {
              const title = e.target.value;
              patch({
                title,
                ...(slugTouched ? {} : { slug: slugify(title) }),
              });
            }}
            className={inputClass}
            placeholder="Enter blog title"
          />
        </div>

        <YesNo
          label="Featured Enable / Disable"
          value={values.featuredEnabled ?? false}
          onChange={(v) => patch({ featuredEnabled: v })}
        />

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          <ImageUploadField
            label="Banner Image"
            value={values.bannerImageUrl || ""}
            onChange={(url) => patch({ bannerImageUrl: url })}
            recommended="928 × 523 px · Max 1MB"
            folder="packaginghype/blogs/banner"
          />
          <div>
            <FieldLabel>Image Alt</FieldLabel>
            <input
              value={values.bannerImageAlt || ""}
              onChange={(e) => patch({ bannerImageAlt: e.target.value })}
              className={inputClass}
              placeholder="Banner image alt"
            />
          </div>
          <div>
            <FieldLabel>Image Title</FieldLabel>
            <input
              value={values.bannerImageTitle || ""}
              onChange={(e) => patch({ bannerImageTitle: e.target.value })}
              className={inputClass}
              placeholder="Banner image title"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Short Description</FieldLabel>
          <textarea
            rows={3}
            value={values.excerpt || ""}
            onChange={(e) => patch({ excerpt: e.target.value })}
            className={inputClass}
            placeholder="Enter Short Description"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Author</FieldLabel>
            <input
              value={values.author || ""}
              onChange={(e) => patch({ author: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Publish Date</FieldLabel>
            <input
              type="date"
              value={values.publishedDate || ""}
              onChange={(e) => patch({ publishedDate: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      <Section title="Description">
        <div>
          <FieldLabel>Content</FieldLabel>
          <RichTextEditor
            value={values.content || ""}
            onChange={(html) => patch({ content: html })}
            placeholder="Write the blog content…"
          />
        </div>
      </Section>

      <Section title="Thumbnail Image">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          <ImageUploadField
            label="Image"
            value={values.thumbnailImageUrl || ""}
            onChange={(url) => patch({ thumbnailImageUrl: url })}
            recommended="424 × 300 px · Max 1MB"
            folder="packaginghype/blogs/thumb"
          />
          <div>
            <FieldLabel>Image Alt</FieldLabel>
            <input
              value={values.thumbnailImageAlt || ""}
              onChange={(e) => patch({ thumbnailImageAlt: e.target.value })}
              className={inputClass}
              placeholder="Thumbnail alt"
            />
          </div>
          <div>
            <FieldLabel>Image Title</FieldLabel>
            <input
              value={values.thumbnailImageTitle || ""}
              onChange={(e) => patch({ thumbnailImageTitle: e.target.value })}
              className={inputClass}
              placeholder="Thumbnail title"
            />
          </div>
        </div>
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
            placeholder="blog-post-url"
          />
        </div>
        <div>
          <FieldLabel>Browser Title</FieldLabel>
          <input
            value={values.seoTitle || ""}
            onChange={(e) => patch({ seoTitle: e.target.value })}
            className={inputClass}
            placeholder="Post Title | Packaging Hype"
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
            rows={5}
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
            onClick={() => router.push("/admin/blogs")}
            className="cursor-pointer rounded-[4px] px-5 py-2.5 text-sm font-semibold text-[#172455] hover:bg-[#F6F8FA]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-[4px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving…" : postId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}
