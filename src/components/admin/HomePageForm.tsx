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
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { CkEditorField } from "@/components/admin/CkEditorField";
import type { HomePageData } from "@/lib/home-page-schema";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";

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
      {open && <div className="border-t border-[#E5E7EB] px-5 py-5 space-y-5">{children}</div>}
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
    fetch("/api/admin/pages/home")
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
    try {
      const res = await fetch("/api/admin/pages/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error?.message || "Failed to save.");
      } else {
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

      {/* ── About / Who We Are ───────────────────────────────────────────── */}
      <SectionCard title="👥 About / Who We Are Section">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Eyebrow Label</FieldLabel>
            <input
              value={values.aboutEyebrow ?? ""}
              onChange={(e) => patch({ aboutEyebrow: e.target.value })}
              placeholder="Who We Are"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Heading</FieldLabel>
            <input
              value={values.aboutHeading ?? ""}
              onChange={(e) => patch({ aboutHeading: e.target.value })}
              placeholder="About Packaging Hype"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Body Content (Rich Text)</FieldLabel>
          <CkEditorField
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

      {/* ── Reliable Packaging Section ────────────────────────────────────── */}
      <SectionCard title="📦 Reliable Packaging Section">
        <ImageUploadField
          label="Section Image"
          value={values.reliableImageUrl ?? ""}
          onChange={(url) => patch({ reliableImageUrl: url })}
          recommended="900 × 720 px · Aspect 5:4 · Max 1MB"
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
          <FieldLabel>Section Heading</FieldLabel>
          <input
            value={values.reliableHeading ?? ""}
            onChange={(e) => patch({ reliableHeading: e.target.value })}
            placeholder="Reliable Packaging for Growing Businesses"
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel>Body Content (Rich Text)</FieldLabel>
          <CkEditorField
            value={values.reliableBody ?? ""}
            onChange={(html) => patch({ reliableBody: html })}
            placeholder="Section body text…"
          />
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

      {/* ── FAQ Section ──────────────────────────────────────────────────── */}
      <SectionCard title="❓ FAQ Section">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Eyebrow Label</FieldLabel>
            <input
              value={values.faqEyebrow ?? ""}
              onChange={(e) => patch({ faqEyebrow: e.target.value })}
              placeholder="Answers to Common Questions"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Section Heading</FieldLabel>
            <input
              value={values.faqHeading ?? ""}
              onChange={(e) => patch({ faqHeading: e.target.value })}
              placeholder="Frequently Asked Questions"
              className={inputClass}
            />
          </div>
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
      </SectionCard>

      {/* ── Bottom Save Button ────────────────────────────────────────────── */}
      <div className="flex justify-end pb-8">
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
