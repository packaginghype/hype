"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { HomeBlogPicker } from "@/components/admin/HomeBlogPicker";

export type BlogFaqInput = {
  question: string;
  answer: string;
};

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
  category?: string | null;
  readTime?: string | null;
  publishedDate?: string | null;
  videoUrl?: string | null;
  videoTitle?: string | null;
  faqsHeading?: string | null;
  faqsSubheading?: string | null;
  faqsImageUrl?: string | null;
  faqsImageAlt?: string | null;
  faqsImageTitle?: string | null;
  faqs?: BlogFaqInput[];
  seoTitle?: string | null;
  seoKeywords?: string | null;
  seoDescription?: string | null;
  seoScript?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  isPublished?: boolean;
  relatedBlogsHeading?: string | null;
  relatedBlogsDescription?: string | null;
  relatedBlogIds?: string[];
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
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
    category: initial?.category || "",
    readTime: initial?.readTime || "",
    publishedDate:
      toDateInput(initial?.publishedDate) ||
      toDateInput(new Date().toISOString()),
    videoUrl: initial?.videoUrl || "",
    videoTitle: initial?.videoTitle || "",
    faqsHeading: initial?.faqsHeading || "",
    faqsSubheading: initial?.faqsSubheading || "",
    faqsImageUrl: initial?.faqsImageUrl || "",
    faqsImageAlt: initial?.faqsImageAlt || "",
    faqsImageTitle: initial?.faqsImageTitle || "",
    seoTitle: initial?.seoTitle || "",
    seoKeywords: initial?.seoKeywords || "",
    seoDescription: initial?.seoDescription || "",
    seoScript: initial?.seoScript || "",
    canonicalUrl: initial?.canonicalUrl || "",
    noIndex: initial?.noIndex ?? false,
    isPublished: initial?.isPublished ?? true,
    relatedBlogsHeading:
      initial?.relatedBlogsHeading ?? "Explore More Packaging Guides",
    relatedBlogsDescription:
      initial?.relatedBlogsDescription ??
      "Continue learning with practical packaging guides, material tips, and helpful resources for your next custom box project.",
    relatedBlogIds: initial?.relatedBlogIds || [],
  });
  const [faqs, setFaqs] = useState<BlogFaqInput[]>(
    initial?.faqs?.length
      ? initial.faqs
      : [{ question: "", answer: "" }]
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [savedPostId, setSavedPostId] = useState(postId);

  function patch(p: Partial<BlogFormValues>) {
    setValues((prev) => ({ ...prev, ...p }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const activeId = savedPostId || postId;
    const payload = {
      ...values,
      faqs: faqs.filter((f) => f.question.trim()),
    };

    try {
      const res = await fetch(
        activeId ? `/api/admin/blogs/${activeId}` : "/api/admin/blogs",
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
          "Could not save blog post. Check slug uniqueness and required fields.";
        const isSlugTaken =
          res.status === 409 || /slug already exists/i.test(message);
        setError(
          isSlugTaken
            ? `Slug "${values.slug}" is already used by another post. Choose a different URL.`
            : message
        );
        console.error(data);
        setLoading(false);
        return;
      }

      const newId =
        typeof data?.post?.id === "string" ? data.post.id : activeId;
      if (newId && newId !== savedPostId) {
        setSavedPostId(newId);
        router.replace(`/admin/blogs/${newId}`);
      }
      setSuccess(
        activeId
          ? "Blog post updated successfully."
          : "Blog post created successfully."
      );
      router.refresh();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Network error — could not save blog post. Try again.");
      setLoading(false);
    }
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

        <div>
          <YesNo
            label="Featured Enable / Disable"
            value={values.featuredEnabled ?? false}
            onChange={(v) => patch({ featuredEnabled: v })}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          <ImageUploadField
            label="Banner Image"
            value={values.bannerImageUrl || ""}
            onChange={(url) => patch({ bannerImageUrl: url })}
            recommended="928 × 523 px · Max 1MB"
            folder="BlogImages"
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
            folder="BlogImages"
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

      <Section title="Featured Video (Optional)">
        <p className="text-xs text-[#6B7280]">
          YouTube or Vimeo URL. Shown below the article content when set.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Video URL</FieldLabel>
            <input
              value={values.videoUrl || ""}
              onChange={(e) => patch({ videoUrl: e.target.value })}
              className={inputClass}
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </div>
          <div>
            <FieldLabel>Video Section Title</FieldLabel>
            <input
              value={values.videoTitle || ""}
              onChange={(e) => patch({ videoTitle: e.target.value })}
              className={inputClass}
              placeholder="Watch: Packaging walkthrough"
            />
          </div>
        </div>
      </Section>

      <Section title="FAQ Section (Optional)">
        <p className="text-xs text-[#6B7280]">
          Appears at the bottom of the blog detail page. Leave empty to hide.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>FAQ Section Title</FieldLabel>
            <input
              value={values.faqsHeading || ""}
              onChange={(e) => patch({ faqsHeading: e.target.value })}
              className={inputClass}
              placeholder="Frequently Asked Questions"
            />
          </div>
          <div>
            <FieldLabel>FAQ Section Description</FieldLabel>
            <input
              value={values.faqsSubheading || ""}
              onChange={(e) => patch({ faqsSubheading: e.target.value })}
              className={inputClass}
              placeholder="Quick answers related to this guide"
            />
          </div>
        </div>

        <div className="rounded-[8px] border border-[#E8EAEF] bg-[#F8FAFC] p-4 space-y-4">
          <p className="text-sm font-bold text-[#172455]">
            FAQ Side Image (Optional)
          </p>
          <div className="grid gap-5 lg:grid-cols-2">
            <ImageUploadField
              label="FAQ Image"
              value={values.faqsImageUrl || ""}
              onChange={(url) => patch({ faqsImageUrl: url })}
              recommended="800 × 800 or 1200 × 900 px · Max 2MB"
              folder="BlogImages"
            />
            <div className="space-y-4">
              <div>
                <FieldLabel>FAQ Image Alt</FieldLabel>
                <input
                  value={values.faqsImageAlt || ""}
                  onChange={(e) => patch({ faqsImageAlt: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel>FAQ Image Title</FieldLabel>
                <input
                  value={values.faqsImageTitle || ""}
                  onChange={(e) => patch({ faqsImageTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
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
                <FieldLabel>Question {index + 1}</FieldLabel>
                {faqs.length > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setFaqs((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                ) : null}
              </div>
              <input
                value={faq.question}
                onChange={(e) => {
                  const next = [...faqs];
                  next[index] = { ...next[index], question: e.target.value };
                  setFaqs(next);
                }}
                className={inputClass}
                placeholder="Enter question"
              />
              <div>
                <FieldLabel>Answer</FieldLabel>
                <textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => {
                    const next = [...faqs];
                    next[index] = { ...next[index], answer: e.target.value };
                    setFaqs(next);
                  }}
                  className={inputClass}
                  placeholder="Enter answer"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFaqs((prev) => [...prev, { question: "", answer: "" }])
            }
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#E2E4E8] bg-white px-3 py-2 text-xs font-bold text-[#172455] hover:bg-[#F6F8FA]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add FAQ
          </button>
        </div>
      </Section>

      <Section title="Related Blogs">
        <div>
          <FieldLabel>Related Blogs Heading</FieldLabel>
          <input
            value={values.relatedBlogsHeading || ""}
            onChange={(e) => patch({ relatedBlogsHeading: e.target.value })}
            className={inputClass}
            placeholder="e.g. Explore More Packaging Guides"
          />
        </div>

        <div>
          <FieldLabel>Related Blogs Description</FieldLabel>
          <textarea
            rows={2}
            value={values.relatedBlogsDescription || ""}
            onChange={(e) => patch({ relatedBlogsDescription: e.target.value })}
            className={inputClass}
            placeholder="e.g. Continue learning with practical packaging guides, material tips, and helpful resources for your next custom box project."
          />
        </div>

        <div>
          <FieldLabel>Select Related Blogs (Optional)</FieldLabel>
          <HomeBlogPicker
            selectedIds={values.relatedBlogIds || []}
            onChange={(ids) => patch({ relatedBlogIds: ids })}
            helperText="Selected posts appear in the Related Blogs carousel in this order. If none are selected, recent published guides are automatically shown."
          />
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
          <FieldLabel>Canonical URL</FieldLabel>
          <input
            value={values.canonicalUrl || ""}
            onChange={(e) => patch({ canonicalUrl: e.target.value })}
            className={inputClass}
            placeholder={`https://packaginghype.com/blog/${values.slug || "post-slug"}`}
          />
          <p className="mt-1 text-[11px] text-[#6B7280]">
            Leave empty to use the default URL:
            https://packaginghype.com/blog/{values.slug || "post-slug"}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <YesNo
            label="No Index (hide from search)"
            value={values.noIndex ?? false}
            onChange={(v) => patch({ noIndex: v })}
          />
          <YesNo
            label="Status"
            value={values.isPublished ?? true}
            onChange={(v) => patch({ isPublished: v })}
          />
        </div>
      </Section>

      <Section title="Article Schema">
        <div>
          <FieldLabel>Article Schema (JSON-LD)</FieldLabel>
          <textarea
            rows={10}
            value={values.seoScript || ""}
            onChange={(e) => patch({ seoScript: e.target.value })}
            spellCheck={false}
            className={`${inputClass} resize-y font-mono text-[12px] leading-relaxed`}
            placeholder={`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Post title",
  "author": {
    "@type": "Person",
    "name": "Packaging Hype Team"
  },
  "datePublished": "2025-01-01",
  "image": "https://packaginghype.com/images/example.jpg",
  "mainEntityOfPage": "https://packaginghype.com/blog/${values.slug || "post-slug"}"
}`}
          />
          <p className="mt-1.5 text-[11px] text-[#6B7280]">
            Paste raw Article JSON-LD or a full{" "}
            <code className="rounded bg-[#F3F4F6] px-1 py-0.5 text-[10px]">
              {`<script type="application/ld+json">`}
            </code>{" "}
            tag. Output on the live blog post page.
          </p>
        </div>
      </Section>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {success ? (
        <p className="text-sm font-medium text-emerald-700">{success}</p>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E8EAEF] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:left-64">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
              onClick={() => router.push("/admin/blogs")}
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
                : savedPostId || postId
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
