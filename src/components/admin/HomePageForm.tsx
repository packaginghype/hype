"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { HomeTrendingProductPicker } from "@/components/admin/HomeTrendingProductPicker";
import { HomeBlogPicker } from "@/components/admin/HomeBlogPicker";
import type { HomePageData } from "@/lib/home-page-schema";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";
import { jsonLdInputStatus } from "@/lib/json-ld";

// ─── helpers ────────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-[6px] border border-[#E2E4E8] bg-white px-3 py-2.5 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/10";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#172455]">
      {children}
    </p>
  );
}

function SectionCard({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-bold text-[#172455]">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[#6B7280]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#6B7280]" />
        )}
      </button>
      <div
        className={
          open
            ? "border-t border-[#E5E7EB] px-5 py-5 space-y-5"
            : "hidden"
        }
      >
        {children}
      </div>
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────

export function HomePageForm() {
  const [values, setValues] = useState<HomePageData>(HOME_PAGE_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Load existing data
  useEffect(() => {
    fetch("/api/admin/pages/home", { cache: "no-store" })
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) setValues((prev) => ({ ...prev, ...data }));
      })
      .finally(() => setLoading(false));
  }, []);

  function patch(partial: Partial<HomePageData>) {
    setValues((prev) => ({ ...prev, ...partial }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/pages/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(
          typeof data.error === "string" ? data.error : "Failed to save."
        );
      } else {
        if (data.data) setValues((prev) => ({ ...prev, ...data.data }));
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#6B7280]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading home page settings…
      </div>
    );
  }

  const schemaStatus = jsonLdInputStatus(values.seoScript);

  return (
    <div className="space-y-4">
      {/* ── Sticky Save Bar ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 flex items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white px-5 py-3">
        <div>
          <p className="text-sm font-bold text-[#172455]">Home Page</p>
          <p className="text-[12px] text-[#6B7280]">Edit content for each section below.</p>
        </div>
        <div className="flex items-center gap-3">
          {status === "success" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
          {status === "error" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
              <AlertCircle className="h-4 w-4" /> {errorMsg}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[#172455] px-5 text-xs font-bold text-white transition-colors hover:bg-[#0f1839] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <SectionCard title="🏠 Hero Section" defaultOpen>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Heading (before highlight)</FieldLabel>
            <input
              value={values.heroHeading ?? ""}
              onChange={(e) => patch({ heroHeading: e.target.value })}
              placeholder="Custom Packaging Boxes Designed for"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Highlight Text (colored span)</FieldLabel>
            <input
              value={values.heroHighlight ?? ""}
              onChange={(e) => patch({ heroHighlight: e.target.value })}
              placeholder="Your Brand"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Sub-text / Description</FieldLabel>
          <textarea
            rows={3}
            value={values.heroSubtext ?? ""}
            onChange={(e) => patch({ heroSubtext: e.target.value })}
            placeholder="Short description under the heading…"
            className={`${inputClass} resize-y`}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Button Label</FieldLabel>
            <input
              value={values.heroBtnLabel ?? ""}
              onChange={(e) => patch({ heroBtnLabel: e.target.value })}
              placeholder="Get Free Quote"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Button URL</FieldLabel>
            <input
              value={values.heroBtnHref ?? ""}
              onChange={(e) => patch({ heroBtnHref: e.target.value })}
              placeholder="/quote"
              className={inputClass}
            />
          </div>
        </div>
        <ImageUploadField
          label="Hero Image"
          value={values.heroImageUrl ?? ""}
          onChange={(url) => patch({ heroImageUrl: url })}
          recommended="1400 × 900 px · Aspect 16:10 · Max 1.5MB"
          folder="packaginghype/pages/home"
        />
        <div>
          <FieldLabel>Hero Image Alt Text</FieldLabel>
          <input
            value={values.heroImageAlt ?? ""}
            onChange={(e) => patch({ heroImageAlt: e.target.value })}
            placeholder="Custom branded packaging boxes for leading brands"
            className={inputClass}
          />
        </div>
      </SectionCard>

      <SectionCard title="🏭 Industry Solutions Section">
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            value={values.industryHeading ?? ""}
            onChange={(e) => patch({ industryHeading: e.target.value })}
            placeholder="Packaging Solutions by Industry Needs"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            rows={3}
            value={values.industrySubtext ?? ""}
            onChange={(e) => patch({ industrySubtext: e.target.value })}
            placeholder="From beauty and food to retail and e-commerce…"
            className={`${inputClass} resize-y`}
          />
        </div>
      </SectionCard>

      {/* ── About / Who We Are ───────────────────────────────────────────── */}
      <SectionCard title="About Us Section">
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            value={values.aboutHeading ?? ""}
            onChange={(e) => patch({ aboutHeading: e.target.value })}
            placeholder="About Packaging Hype"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Body Content (Rich Text)</FieldLabel>
          <RichTextEditor
            value={values.aboutBody ?? ""}
            onChange={(html) => patch({ aboutBody: html })}
            placeholder="About section body text…"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Button Label</FieldLabel>
            <input
              value={values.aboutBtnLabel ?? ""}
              onChange={(e) => patch({ aboutBtnLabel: e.target.value })}
              placeholder="Learn More About Us"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Button URL</FieldLabel>
            <input
              value={values.aboutBtnHref ?? ""}
              onChange={(e) => patch({ aboutBtnHref: e.target.value })}
              placeholder="/about-us"
              className={inputClass}
            />
          </div>
        </div>
        <ImageUploadField
          label="About Section Image"
          value={values.aboutImageUrl ?? ""}
          onChange={(url) => patch({ aboutImageUrl: url })}
          recommended="900 × 720 px · Aspect 5:4 · Max 1MB"
          folder="packaginghype/pages/home"
        />
        <div>
          <FieldLabel>Image Alt Text</FieldLabel>
          <input
            value={values.aboutImageAlt ?? ""}
            onChange={(e) => patch({ aboutImageAlt: e.target.value })}
            placeholder="Packaging Hype team and production"
            className={inputClass}
          />
        </div>
      </SectionCard>

      <SectionCard title="🔥 Trending & Popular Products">
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            value={values.trendingHeading ?? ""}
            onChange={(e) => patch({ trendingHeading: e.target.value })}
            placeholder="Trending & Popular Products"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            rows={3}
            value={values.trendingSubtext ?? ""}
            onChange={(e) => patch({ trendingSubtext: e.target.value })}
            placeholder="Explore packaging formats brands reorder most…"
            className={`${inputClass} resize-y`}
          />
        </div>
        <div>
          <FieldLabel>Products (add, remove, reorder)</FieldLabel>
          <HomeTrendingProductPicker
            selectedIds={values.trendingProductIds || []}
            onChange={(ids) => patch({ trendingProductIds: ids })}
          />
        </div>
      </SectionCard>

      <SectionCard title="⭐ Customer Reviews">
        <p className="text-sm text-[#4B5563]">
          Heading and description for this homepage section. Individual reviews
          are added and ordered from{" "}
          <Link
            href="/admin/reviews"
            className="font-semibold text-[#21AAA5] hover:text-[#FF5548]"
          >
            Admin → Reviews
          </Link>
          .
        </p>
        <div>
          <FieldLabel>Eyebrow Label</FieldLabel>
          <input
            value={values.reviewsEyebrow ?? ""}
            onChange={(e) => patch({ reviewsEyebrow: e.target.value })}
            placeholder="Trusted by Growing Brands"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            value={values.reviewsHeading ?? ""}
            onChange={(e) => patch({ reviewsHeading: e.target.value })}
            placeholder="What Our Customers Say"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            rows={2}
            value={values.reviewsSubtext ?? ""}
            onChange={(e) => patch({ reviewsSubtext: e.target.value })}
            placeholder="Real feedback from brands…"
            className={`${inputClass} resize-y`}
          />
        </div>
      </SectionCard>

      {/* ── Reliable Packaging Section ────────────────────────────────────── */}
      <SectionCard title="📦 Reliable Packaging Section">
        <ImageUploadField
          label="Image"
          value={values.reliableImageUrl ?? ""}
          onChange={(url) => patch({ reliableImageUrl: url })}
          recommended="1200 × 900 px · Aspect 4:3 · Max 1MB"
          folder="packaginghype/pages/home"
        />
        <div>
          <FieldLabel>Image Alt Text</FieldLabel>
          <input
            value={values.reliableImageAlt ?? ""}
            onChange={(e) => patch({ reliableImageAlt: e.target.value })}
            placeholder="Custom packaging boxes for growing businesses"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            value={values.reliableHeading ?? ""}
            onChange={(e) => patch({ reliableHeading: e.target.value })}
            placeholder="Reliable Packaging for Growing Businesses"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <RichTextEditor
            value={values.reliableBody ?? ""}
            onChange={(html) => patch({ reliableBody: html })}
            placeholder="Section description…"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Button Label</FieldLabel>
            <input
              value={values.reliableBtnLabel ?? ""}
              onChange={(e) => patch({ reliableBtnLabel: e.target.value })}
              placeholder="Get a Free Quote"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Button Link</FieldLabel>
            <input
              value={values.reliableBtnHref ?? ""}
              onChange={(e) => patch({ reliableBtnHref: e.target.value })}
              placeholder="/quote"
              className={inputClass}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Inquiry Form Section ──────────────────────────────────────────── */}
      <SectionCard title="📬 Inquiry Form Section (Right-side text)">
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            value={values.inquiryHeading ?? ""}
            onChange={(e) => patch({ inquiryHeading: e.target.value })}
            placeholder="Looking for other Custom Boxes and Packaging?"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Sub-text</FieldLabel>
          <textarea
            rows={3}
            value={values.inquirySubtext ?? ""}
            onChange={(e) => patch({ inquirySubtext: e.target.value })}
            placeholder="Short description next to the form…"
            className={`${inputClass} resize-y`}
          />
        </div>
      </SectionCard>

      <SectionCard title="📄 Detailed Content (above FAQs)">
        <p className="text-sm text-[#4B5563]">
          Image + copy block shown just above FAQs — same layout as category
          and product detail pages.
        </p>
        <div>
          <FieldLabel>Section Heading</FieldLabel>
          <input
            value={values.seoContentHeading ?? ""}
            onChange={(e) => patch({ seoContentHeading: e.target.value })}
            placeholder="Custom Packaging Designed Around Your Product"
            className={inputClass}
          />
        </div>
        <ImageUploadField
          label="Section Image"
          value={values.seoContentImageUrl ?? ""}
          onChange={(url) => patch({ seoContentImageUrl: url })}
          recommended="900 × 720 px · Aspect 5:4 · Max 1MB"
          folder="packaginghype/pages/home"
        />
        <div>
          <FieldLabel>Image Alt Text</FieldLabel>
          <input
            value={values.seoContentImageAlt ?? ""}
            onChange={(e) => patch({ seoContentImageAlt: e.target.value })}
            placeholder="Custom packaging boxes"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Body Content (Rich Text)</FieldLabel>
          <RichTextEditor
            value={values.seoContentHtml ?? ""}
            onChange={(html) => patch({ seoContentHtml: html })}
            placeholder="Short paragraphs about custom boxes, materials, and production…"
          />
        </div>
      </SectionCard>

      {/* ── FAQ Section ──────────────────────────────────────────────────── */}
      <SectionCard title="❓ FAQ Section">
        <div>
          <FieldLabel>Section Heading</FieldLabel>
          <input
            value={values.faqHeading ?? ""}
            onChange={(e) => patch({ faqHeading: e.target.value })}
            placeholder="Frequently Asked Questions"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Section Sub-text</FieldLabel>
          <textarea
            rows={2}
            value={values.faqSubtext ?? ""}
            onChange={(e) => patch({ faqSubtext: e.target.value })}
            placeholder="Short description under the FAQ heading…"
            className={`${inputClass} resize-y`}
          />
        </div>
        <ImageUploadField
          label="FAQ Section Image"
          value={values.faqImageUrl ?? ""}
          onChange={(url) => patch({ faqImageUrl: url })}
          recommended="800 × 640 px · Aspect 5:4 · Max 1MB"
          folder="packaginghype/pages/home"
        />
        <div>
          <FieldLabel>Image Alt Text</FieldLabel>
          <input
            value={values.faqImageAlt ?? ""}
            onChange={(e) => patch({ faqImageAlt: e.target.value })}
            placeholder="Custom packaging boxes"
            className={inputClass}
          />
        </div>

        {/* FAQ items */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <FieldLabel>FAQ Items</FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  faqs: [...(values.faqs ?? []), { question: "", answer: "" }],
                })
              }
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#21AAA5] hover:text-[#FF5548]"
            >
              <Plus className="h-3.5 w-3.5" /> Add FAQ
            </button>
          </div>
          <div className="space-y-3">
            {(values.faqs ?? []).map((faq, i) => (
              <div
                key={i}
                className="rounded-[8px] border border-[#E5E7EB] bg-[#F8FAFC] p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <input
                    value={faq.question}
                    onChange={(e) => {
                      const next = [...(values.faqs ?? [])];
                      next[i] = { ...next[i], question: e.target.value };
                      patch({ faqs: next });
                    }}
                    placeholder={`Question ${i + 1}`}
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...(values.faqs ?? [])];
                      next.splice(i, 1);
                      patch({ faqs: next });
                    }}
                    className="mt-0.5 text-[#FF5548] hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const next = [...(values.faqs ?? [])];
                    next[i] = { ...next[i], answer: e.target.value };
                    patch({ faqs: next });
                  }}
                  placeholder="Answer…"
                  className={`${inputClass} resize-y`}
                />
              </div>
            ))}
            {(values.faqs ?? []).length === 0 && (
              <p className="text-xs text-[#9CA3AF]">
                No FAQ items yet. Click "Add FAQ" to add the first one.
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="📰 Latest News (Blog Section)">
        <div>
          <FieldLabel>Heading</FieldLabel>
          <input
            value={values.blogsHeading ?? ""}
            onChange={(e) => patch({ blogsHeading: e.target.value })}
            placeholder="Latest News"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            rows={3}
            value={values.blogsSubtext ?? ""}
            onChange={(e) => patch({ blogsSubtext: e.target.value })}
            placeholder="Keep up with the latest packaging design tips…"
            className={`${inputClass} resize-y`}
          />
        </div>
        <div>
          <FieldLabel>Blogs (add, remove, reorder)</FieldLabel>
          <HomeBlogPicker
            selectedIds={values.blogIds || []}
            onChange={(ids) => patch({ blogIds: ids })}
          />
        </div>
      </SectionCard>

      {/* ── SEO ──────────────────────────────────────────────────────────── */}
      <SectionCard title="🔍 SEO — Home Page">
        <div>
          <FieldLabel>SEO Title</FieldLabel>
          <input
            value={values.seoTitle ?? ""}
            onChange={(e) => patch({ seoTitle: e.target.value })}
            placeholder="Custom Packaging Boxes | Packaging Hype"
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-[#9CA3AF]">
            {(values.seoTitle ?? "").length} / 60 chars
          </p>
        </div>
        <div>
          <FieldLabel>Meta Description</FieldLabel>
          <textarea
            rows={2}
            value={values.seoDescription ?? ""}
            onChange={(e) => patch({ seoDescription: e.target.value })}
            placeholder="Premium custom packaging boxes — tailored sizes, free USA shipping…"
            className={`${inputClass} resize-y`}
          />
          <p className="mt-1 text-[11px] text-[#9CA3AF]">
            {(values.seoDescription ?? "").length} / 160 chars
          </p>
        </div>
        <div>
          <FieldLabel>Keywords (comma-separated)</FieldLabel>
          <input
            value={values.seoKeywords ?? ""}
            onChange={(e) => patch({ seoKeywords: e.target.value })}
            placeholder="custom packaging, custom boxes, wholesale packaging"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Canonical URL</FieldLabel>
          <input
            value={values.seoCanonical ?? ""}
            onChange={(e) => patch({ seoCanonical: e.target.value })}
            placeholder="https://packaginghype.com/"
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-[#9CA3AF]">
            Self-referencing homepage URL by default. Leave blank to use{" "}
            <code className="rounded bg-[#F3F4F6] px-1 py-0.5 text-[10px]">
              https://packaginghype.com/
            </code>
            .
          </p>
        </div>
        <div>
          <FieldLabel>JSON-LD Schema Markup</FieldLabel>
          <textarea
            rows={10}
            value={values.seoScript ?? ""}
            onChange={(e) => patch({ seoScript: e.target.value })}
            spellCheck={false}
            className={`${inputClass} resize-y font-mono text-[12px] leading-relaxed`}
            placeholder={`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Packaging Hype",
  "url": "https://packaginghype.com"
}`}
          />
          <p className="mt-1.5 text-[11px] text-[#9CA3AF]">
            Paste raw JSON-LD or a full{" "}
            <code className="rounded bg-[#F3F4F6] px-1 py-0.5 text-[10px]">
              {`<script type="application/ld+json">`}
            </code>{" "}
            tag. Saved with the home page and output on the live homepage.
            {schemaStatus === "valid" && (
              <span className="ml-1 font-semibold text-emerald-600">
                Valid JSON-LD
              </span>
            )}
            {schemaStatus === "invalid" && (
              <span className="ml-1 font-semibold text-amber-600">
                Not valid JSON yet — it will save, but will not render until
                the JSON is valid.
              </span>
            )}
          </p>
        </div>
      </SectionCard>

      {/* ── Bottom Save Button ────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pb-8">
        {status === "success" && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
        {status === "error" && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
            <AlertCircle className="h-4 w-4" /> {errorMsg}
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-[6px] bg-[#FF5548] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e04337] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save Home Page"}
        </button>
      </div>
    </div>
  );
}
