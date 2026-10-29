"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
} from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { StaticPageData, StaticPageKind } from "@/lib/static-pages";

const inputClass =
  "w-full rounded-[6px] border border-[#E2E4E8] bg-white px-3 py-2.5 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none transition-all focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/10";

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#172455]">
      {children}
      {required ? <span className="ml-0.5 text-[#FF5548]">*</span> : null}
    </p>
  );
}

export function StaticPageForm({
  pageKey,
  title,
  path,
  kind,
  defaults,
}: {
  pageKey: string;
  title: string;
  path: string;
  kind: StaticPageKind;
  defaults: StaticPageData;
}) {
  const [values, setValues] = useState<StaticPageData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch(`/api/admin/pages/${pageKey}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) setValues((prev) => ({ ...prev, ...data }));
      })
      .finally(() => setLoading(false));
  }, [pageKey]);

  function patch(partial: Partial<StaticPageData>) {
    setValues((prev) => ({ ...prev, ...partial }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch(`/api/admin/pages/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg("Failed to save page.");
        console.error(data);
      } else {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-sm text-[#6B7280]">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading page…
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <FileText className="h-3.5 w-3.5" />
          <Link href="/admin/pages" className="hover:text-[#172455]">
            Pages
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#172455]">{title}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-[#172455]">
              {title}
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Live URL stays{" "}
              <code className="rounded bg-[#EEF2FF] px-1.5 py-0.5 text-[12px] font-semibold text-[#172455]">
                {path}
              </code>{" "}
              (same as the previous WordPress site).
            </p>
          </div>
          <a
            href={path}
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-[6px] border border-[#E2E4E8] px-3 py-2 text-xs font-bold text-[#172455] hover:bg-[#F6F8FA]"
          >
            View page
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <section className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
        <div className="admin-section-bar bg-[#172455] px-5 py-2.5">
          <p className="text-sm font-bold uppercase tracking-wider text-white">
            Page Content
          </p>
        </div>
        <div className="space-y-5 p-5">
          {kind !== "quote" ? (
            <div>
              <FieldLabel>Eyebrow / Badge</FieldLabel>
              <input
                value={values.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={inputClass}
                placeholder="Optional small label above the heading"
              />
            </div>
          ) : null}
          <div>
            <FieldLabel required>Heading</FieldLabel>
            <input
              value={values.heading || ""}
              onChange={(e) => patch({ heading: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel>Intro</FieldLabel>
            <textarea
              rows={3}
              value={values.intro || ""}
              onChange={(e) => patch({ intro: e.target.value })}
              className={inputClass}
            />
          </div>
          {kind !== "quote" ? (
            <div>
              <FieldLabel>Body Content</FieldLabel>
              <RichTextEditor
                value={values.content || ""}
                onChange={(html) => patch({ content: html })}
              />
            </div>
          ) : (
            <p className="text-xs text-[#6B7280]">
              The quote request form on this URL is not replaced — only heading,
              intro, and SEO are editable here.
            </p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white">
        <div className="admin-section-bar bg-[#172455] px-5 py-2.5">
          <p className="text-sm font-bold uppercase tracking-wider text-white">
            SEO
          </p>
        </div>
        <div className="space-y-5 p-5">
          <div>
            <FieldLabel>Browser Title</FieldLabel>
            <input
              value={values.seoTitle || ""}
              onChange={(e) => patch({ seoTitle: e.target.value })}
              className={inputClass}
              placeholder={`${title} | Packaging Hype`}
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
            <FieldLabel>Meta Keywords</FieldLabel>
            <input
              value={values.seoKeywords || ""}
              onChange={(e) => patch({ seoKeywords: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {status === "success" ? (
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Saved
        </p>
      ) : null}
      {status === "error" ? (
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5548]">
          <AlertCircle className="h-4 w-4" />
          {errorMsg}
        </p>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E8EAEF] bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:left-64">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[4px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving…" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
