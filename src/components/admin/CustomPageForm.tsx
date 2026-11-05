"use client";

import { FormEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { slugifyPageTitle } from "@/lib/custom-pages";
import {
  CARD_RADIUS_OPTIONS,
  CARD_SHADOW_OPTIONS,
  CONTENT_WIDTH_OPTIONS,
  DEFAULT_PAGE_LAYOUT,
  HERO_STYLE_OPTIONS,
  PAGE_BG_OPTIONS,
  SECTION_GAP_OPTIONS,
  parsePageLayout,
  type PageLayout,
} from "@/lib/page-layout";
import {
  COLOR_PRESETS,
  parsePageWidgets,
  type PageWidget,
} from "@/lib/page-widgets";

const PageWidgetBuilder = dynamic(
  () =>
    import("@/components/admin/PageWidgetBuilder").then(
      (m) => m.PageWidgetBuilder
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-28 items-center justify-center rounded-[8px] border border-dashed border-[#D1D5DB] bg-[#F8FAFC] text-sm text-[#6B7280]">
        Loading widget builder…
      </div>
    ),
  }
);

export type CustomPageFormValues = {
  id?: string;
  title: string;
  slug: string;
  menuLabel?: string | null;
  showInHeader?: boolean;
  showInFooter?: boolean;
  menuOrder?: number;
  published?: boolean;
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  content?: string | null;
  sections?: PageWidget[];
  layout?: PageLayout;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  seoCanonical?: string | null;
};

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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white shadow-[0_1px_0_rgba(23,36,85,0.04)]">
      <div className="admin-section-bar bg-[#172455] px-4 py-2.5 sm:px-5">
        <p className="text-sm font-bold uppercase tracking-wider text-white">
          {title}
        </p>
      </div>
      <div className="space-y-4 p-4 sm:p-5 lg:p-6">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[8px] border border-[#E8EAEF] bg-[#F8FAFC] px-3.5 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#FF5548] focus:ring-[#FF5548]"
      />
      <span>
        <span className="block text-sm font-semibold text-[#172455]">
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-xs text-[#6B7280]">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

const EMPTY: CustomPageFormValues = {
  title: "",
  slug: "",
  menuLabel: "",
  showInHeader: false,
  showInFooter: false,
  menuOrder: 0,
  published: true,
  eyebrow: "",
  heading: "",
  intro: "",
  content: "",
  sections: [],
  layout: DEFAULT_PAGE_LAYOUT,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  seoCanonical: "",
};

function initialSections(initial?: CustomPageFormValues | null): PageWidget[] {
  const parsed = parsePageWidgets(initial?.sections);
  if (parsed.length) return parsed;
  // Stable id — never call createEmptyWidget/random during SSR useState init
  if (initial?.content?.trim()) {
    return [
      {
        id: "legacy-content",
        type: "richText",
        title: "",
        html: initial.content,
      },
    ];
  }
  return [];
}

export function CustomPageForm({
  initial,
}: {
  initial?: CustomPageFormValues | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState<CustomPageFormValues>({
    ...EMPTY,
    ...initial,
    sections: initialSections(initial),
    layout: parsePageLayout(initial?.layout),
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [widgetsReady, setWidgetsReady] = useState(false);

  useEffect(() => {
    setWidgetsReady(true);
  }, []);

  function patch(partial: Partial<CustomPageFormValues>) {
    setValues((prev) => ({ ...prev, ...partial }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const payload = {
        ...values,
        slug: values.slug.trim() || slugifyPageTitle(values.title),
        menuOrder: Number(values.menuOrder) || 0,
      };

      const res = await fetch(
        isEdit
          ? `/api/admin/custom-pages/${initial!.id}`
          : "/api/admin/custom-pages",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(
          typeof data.error === "string"
            ? data.error
            : "Failed to save page. Check required fields."
        );
        return;
      }

      setStatus("success");
      if (!isEdit && data.page?.id) {
        router.replace(`/admin/pages/custom/${data.page.id}`);
        router.refresh();
        return;
      }
      router.refresh();
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (
      !window.confirm(
        `Delete “${values.title || "this page"}”? This cannot be undone.`
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/custom-pages/${initial.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setStatus("error");
        setErrorMsg("Failed to delete page.");
        return;
      }
      router.push("/admin/pages");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMsg("Network error while deleting.");
    } finally {
      setDeleting(false);
    }
  }

  const publicPath = values.slug ? `/${values.slug}` : null;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <FileText className="h-3.5 w-3.5" />
            <Link href="/admin/pages" className="hover:text-[#172455]">
              Pages
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#172455]">
              {isEdit ? "Edit page" : "New page"}
            </span>
          </div>
          <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455]">
            {isEdit ? values.title || "Edit page" : "Create static page"}
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Build layouts with widgets, set the URL, and place the page in the
            header or footer menu.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {publicPath && values.published ? (
            <Link
              href={publicPath}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E2E4E8] bg-white px-3 py-2 text-sm font-semibold text-[#172455] hover:bg-[#F6F8FA]"
            >
              View
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ) : null}
          {isEdit ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting || saving}
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </button>
          ) : null}
          <button
            type="submit"
            disabled={saving || deleting}
            className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#FF5548] px-4 py-2 text-sm font-bold text-white hover:bg-[#e04337] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEdit ? "Save changes" : "Create page"}
          </button>
        </div>
      </div>

      {status === "success" ? (
        <div className="flex items-center gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Page saved.
        </div>
      ) : null}
      {status === "error" ? (
        <div className="flex items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg || "Something went wrong."}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Section title="Content">
            <div>
              <FieldLabel required>Title</FieldLabel>
              <input
                className={inputClass}
                value={values.title}
                onChange={(e) => {
                  const title = e.target.value;
                  patch({
                    title,
                    ...(!slugTouched
                      ? { slug: slugifyPageTitle(title) }
                      : {}),
                    ...(!values.heading
                      ? { heading: title }
                      : {}),
                  });
                }}
                placeholder="e.g. Careers"
                required
              />
            </div>
            <div>
              <FieldLabel>Eyebrow</FieldLabel>
              <input
                className={inputClass}
                value={values.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                placeholder="Small label above the heading"
              />
            </div>
            <div>
              <FieldLabel>Heading</FieldLabel>
              <input
                className={inputClass}
                value={values.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                placeholder="Main H1 on the page"
              />
            </div>
            <div>
              <FieldLabel>Intro</FieldLabel>
              <textarea
                className={`${inputClass} min-h-[88px]`}
                value={values.intro || ""}
                onChange={(e) => patch({ intro: e.target.value })}
                placeholder="Short intro under the heading"
              />
            </div>
          </Section>

          <Section title="SEO">
            <div>
              <FieldLabel>SEO title</FieldLabel>
              <input
                className={inputClass}
                value={values.seoTitle || ""}
                onChange={(e) => patch({ seoTitle: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>SEO description</FieldLabel>
              <textarea
                className={`${inputClass} min-h-[80px]`}
                value={values.seoDescription || ""}
                onChange={(e) => patch({ seoDescription: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>SEO keywords</FieldLabel>
              <input
                className={inputClass}
                value={values.seoKeywords || ""}
                onChange={(e) => patch({ seoKeywords: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Canonical URL</FieldLabel>
              <input
                className={inputClass}
                value={values.seoCanonical || ""}
                onChange={(e) => patch({ seoCanonical: e.target.value })}
                placeholder="https://packaginghype.com/your-page"
              />
            </div>
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="URL & publish">
            <div>
              <FieldLabel required>Slug / URL</FieldLabel>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#6B7280]">/</span>
                <input
                  className={inputClass}
                  value={values.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    patch({
                      slug: slugifyPageTitle(e.target.value) || e.target.value,
                    });
                  }}
                  placeholder="careers"
                  required
                />
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-[#21AAA5]">
                {publicPath || "/…"}
              </p>
            </div>
            <Toggle
              label="Published"
              hint="Unpublished pages are hidden from the site and menus."
              checked={Boolean(values.published)}
              onChange={(published) => patch({ published })}
            />
          </Section>

          <Section title="Menu placement">
            <div>
              <FieldLabel>Menu label</FieldLabel>
              <input
                className={inputClass}
                value={values.menuLabel || ""}
                onChange={(e) => patch({ menuLabel: e.target.value })}
                placeholder="Optional — defaults to title"
              />
            </div>
            <div>
              <FieldLabel>Menu order</FieldLabel>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={values.menuOrder ?? 0}
                onChange={(e) =>
                  patch({ menuOrder: Number.parseInt(e.target.value, 10) || 0 })
                }
              />
              <p className="mt-1 text-xs text-[#6B7280]">
                Lower numbers appear first.
              </p>
            </div>
            <Toggle
              label="Show in header menu"
              hint="Adds a link next to Contact / Blogs in the top nav."
              checked={Boolean(values.showInHeader)}
              onChange={(showInHeader) => patch({ showInHeader })}
            />
            <Toggle
              label="Show in footer menu"
              hint="Adds a link under Company in the footer."
              checked={Boolean(values.showInFooter)}
              onChange={(showInFooter) => patch({ showInFooter })}
            />
          </Section>

          <Section title="Page layout & style">
            {(() => {
              const layout = parsePageLayout(values.layout);
              const setLayout = (partial: Partial<PageLayout>) =>
                patch({ layout: { ...layout, ...partial } });
              return (
                <>
                  <div>
                    <FieldLabel>Page background</FieldLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {PAGE_BG_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setLayout({
                              pageBg: opt.value,
                              pageBgColor:
                                opt.value === "custom"
                                  ? layout.pageBgColor || "#172455"
                                  : "",
                            })
                          }
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-1.5 text-[11px] font-bold",
                            layout.pageBg === opt.value
                              ? "border-[#172455] bg-[#172455] text-white"
                              : "border-[#E2E4E8] bg-white text-[#172455]"
                          )}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ background: opt.swatch }}
                          />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {layout.pageBg === "custom" ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <input
                          type="color"
                          value={
                            layout.pageBgColor &&
                            /^#([0-9A-Fa-f]{6})$/.test(layout.pageBgColor)
                              ? layout.pageBgColor
                              : "#172455"
                          }
                          onChange={(e) =>
                            setLayout({ pageBgColor: e.target.value })
                          }
                          className="h-9 w-10 cursor-pointer rounded border border-[#E2E4E8] bg-white p-0.5"
                        />
                        <input
                          className={inputClass}
                          value={layout.pageBgColor || ""}
                          onChange={(e) =>
                            setLayout({ pageBgColor: e.target.value })
                          }
                          placeholder="#172455"
                        />
                        <div className="flex flex-wrap gap-1">
                          {COLOR_PRESETS.map((c) => (
                            <button
                              key={`page-bg-${c}`}
                              type="button"
                              title={c}
                              onClick={() => setLayout({ pageBgColor: c })}
                              className="h-5 w-5 rounded-full border border-black/10"
                              style={{ background: c }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <FieldLabel>Content width</FieldLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {CONTENT_WIDTH_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setLayout({ contentWidth: opt.value })}
                          className={cn(
                            "rounded-[6px] border px-2.5 py-1.5 text-[11px] font-bold",
                            layout.contentWidth === opt.value
                              ? "border-[#172455] bg-[#172455] text-white"
                              : "border-[#E2E4E8] bg-white text-[#172455]"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Section spacing</FieldLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {SECTION_GAP_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setLayout({ sectionGap: opt.value })}
                          className={cn(
                            "rounded-[6px] border px-2.5 py-1.5 text-[11px] font-bold",
                            layout.sectionGap === opt.value
                              ? "border-[#172455] bg-[#172455] text-white"
                              : "border-[#E2E4E8] bg-white text-[#172455]"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Hero style</FieldLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {HERO_STYLE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setLayout({ heroStyle: opt.value })}
                          className={cn(
                            "rounded-[6px] border px-2.5 py-1.5 text-[11px] font-bold",
                            layout.heroStyle === opt.value
                              ? "border-[#172455] bg-[#172455] text-white"
                              : "border-[#E2E4E8] bg-white text-[#172455]"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Hero align</FieldLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {(["left", "center"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => setLayout({ heroAlign: align })}
                          className={cn(
                            "rounded-[6px] border px-2.5 py-1.5 text-[11px] font-bold capitalize",
                            layout.heroAlign === align
                              ? "border-[#172455] bg-[#172455] text-white"
                              : "border-[#E2E4E8] bg-white text-[#172455]"
                          )}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Toggle
                    label="Show breadcrumbs"
                    checked={layout.showBreadcrumbs}
                    onChange={(showBreadcrumbs) =>
                      setLayout({ showBreadcrumbs })
                    }
                  />
                  <Toggle
                    label="Wrap content in card"
                    hint="Elevated card around the page body — set shadow, radius & color below."
                    checked={layout.showCard}
                    onChange={(showCard) => setLayout({ showCard })}
                  />
                  {layout.showCard ? (
                    <>
                      <div>
                        <FieldLabel>Card box shadow</FieldLabel>
                        <div className="flex flex-wrap gap-1.5">
                          {CARD_SHADOW_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                setLayout({ cardShadow: opt.value })
                              }
                              className={cn(
                                "rounded-[6px] border px-2.5 py-1.5 text-[11px] font-bold",
                                layout.cardShadow === opt.value
                                  ? "border-[#172455] bg-[#172455] text-white"
                                  : "border-[#E2E4E8] bg-white text-[#172455]"
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Card corner radius</FieldLabel>
                        <div className="flex flex-wrap gap-1.5">
                          {CARD_RADIUS_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                setLayout({ cardRadius: opt.value })
                              }
                              className={cn(
                                "rounded-[6px] border px-2.5 py-1.5 text-[11px] font-bold",
                                layout.cardRadius === opt.value
                                  ? "border-[#172455] bg-[#172455] text-white"
                                  : "border-[#E2E4E8] bg-white text-[#172455]"
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Card background color</FieldLabel>
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="color"
                            value={
                              layout.cardBgColor &&
                              /^#([0-9A-Fa-f]{6})$/.test(layout.cardBgColor)
                                ? layout.cardBgColor
                                : "#ffffff"
                            }
                            onChange={(e) =>
                              setLayout({ cardBgColor: e.target.value })
                            }
                            className="h-9 w-10 cursor-pointer rounded border border-[#E2E4E8] bg-white p-0.5"
                          />
                          <input
                            className={inputClass}
                            value={layout.cardBgColor || ""}
                            onChange={(e) =>
                              setLayout({ cardBgColor: e.target.value })
                            }
                            placeholder="#FFFFFF (default white)"
                          />
                          {layout.cardBgColor ? (
                            <button
                              type="button"
                              onClick={() => setLayout({ cardBgColor: "" })}
                              className="text-xs font-semibold text-[#6B7280] hover:text-[#FF5548]"
                            >
                              Clear
                            </button>
                          ) : null}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {COLOR_PRESETS.map((c) => (
                            <button
                              key={`card-bg-${c}`}
                              type="button"
                              title={c}
                              onClick={() => setLayout({ cardBgColor: c })}
                              className="h-5 w-5 rounded-full border border-black/10"
                              style={{ background: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </>
              );
            })()}
          </Section>
        </div>
      </div>

      <Section title="Page widgets / layout">
        {widgetsReady ? (
          <PageWidgetBuilder
            widgets={values.sections || []}
            onChange={(sections) => patch({ sections })}
          />
        ) : (
          <div className="flex h-28 items-center justify-center rounded-[8px] border border-dashed border-[#D1D5DB] bg-[#F8FAFC] text-sm text-[#6B7280]">
            Loading widget builder…
          </div>
        )}
      </Section>
    </form>
  );
}
