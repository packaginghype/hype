"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe,
  ImageIcon,
  Code2,
  Plus,
  Trash2,
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { createEmptyScript, type CustomScript } from "@/lib/custom-scripts";
import type { GeneralSettings } from "@/lib/general-settings-schema";
import { DEFAULT_GENERAL_SETTINGS } from "@/lib/general-settings-schema";

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

export function GeneralSettingsForm() {
  const [values, setValues] = useState<GeneralSettings>(
    DEFAULT_GENERAL_SETTINGS
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/general-settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.data) {
          setValues(res.data);
        }
      })
      .catch(() => {
        setErrorMsg("Failed to load settings");
      })
      .finally(() => setLoading(false));
  }, []);

  function patch(partial: Partial<GeneralSettings>) {
    setValues((prev) => ({ ...prev, ...partial }));
  }

  function updateScript(id: string, partial: Partial<CustomScript>) {
    setValues((prev) => ({
      ...prev,
      customScripts: (prev.customScripts || []).map((script) =>
        script.id === id ? { ...script, ...partial } : script
      ),
    }));
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/general-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error?.message || "Failed to save settings");
      } else {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3500);
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
      <div className="flex items-center justify-center py-24 text-sm text-[#6B7280]">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#FF5548]" />
        Loading settings…
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          General settings saved successfully! Changes are now live across the
          website.
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600" />
          {errorMsg || "An error occurred while saving."}
        </div>
      )}

      {/* Website Logo Section */}
      <div className="rounded-[10px] border border-[#E8EAEF] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5548]/10 text-[#FF5548]">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172455]">
                Website Logo
              </h3>
              <p className="text-xs text-[#6B7280]">
                Displayed in the main header, mobile navigation, and footer.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <ImageUploadField
            label="Logo Image"
            value={values.logoUrl || ""}
            onChange={(url) => patch({ logoUrl: url })}
            recommended="180 × 56 px or 360 × 112 px"
            hint="Transparent PNG, SVG, or WEBP · Max 1MB"
            accept="image/png,image/webp,image/svg+xml,image/jpeg"
            folder="packaginghype/site"
          />

          <div>
            <FieldLabel required>Logo Alt Text</FieldLabel>
            <input
              type="text"
              value={values.logoAlt || ""}
              onChange={(e) => patch({ logoAlt: e.target.value })}
              className={inputClass}
              placeholder="e.g. Packaging Hype - Custom Packaging Manufacturer"
              required
            />
            <p className="mt-1 text-[11px] text-[#6B7280]">
              Accessible text used by screen readers and search engines (SEO).
            </p>
          </div>
        </div>
      </div>

      {/* Favicon Section */}
      <div className="rounded-[10px] border border-[#E8EAEF] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#21AAA5]/10 text-[#21AAA5]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172455]">
                Favicon & App Icon
              </h3>
              <p className="text-xs text-[#6B7280]">
                Small icon displayed in browser tabs, bookmarks, and mobile home
                screens.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <ImageUploadField
            label="Favicon Image"
            value={values.faviconUrl || ""}
            onChange={(url) => patch({ faviconUrl: url })}
            recommended="32 × 32 px, 48 × 48 px, 180 × 180 px or 512 × 512 px (1:1 Square)"
            hint="PNG, ICO, SVG or WEBP · Max 1MB"
            accept="image/png,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico"
            folder="packaginghype/site"
          />

          <div>
            <FieldLabel>Favicon Alt Text</FieldLabel>
            <input
              type="text"
              value={values.faviconAlt || ""}
              onChange={(e) => patch({ faviconAlt: e.target.value })}
              className={inputClass}
              placeholder="e.g. Packaging Hype icon"
            />
            <p className="mt-1 text-[11px] text-[#6B7280]">
              Used on the favicon preview. Browser tabs do not display image alt text.
            </p>
          </div>

          {/* Browser Tab Preview */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#172455]">
              Browser Tab Preview
            </p>
            <div className="max-w-md rounded-t-lg border border-[#D5D8E0] bg-[#E8EAEF] p-2">
              <div className="flex items-center gap-2 rounded-t-md bg-white px-3 py-2 shadow-xs">
                <Image
                  src={values.faviconUrl || "/favicon.png"}
                  alt={values.faviconAlt || "Favicon"}
                  width={16}
                  height={16}
                  className="h-4 w-4 shrink-0 rounded-xs object-contain"
                  unoptimized
                />
                <span className="truncate text-xs font-medium text-[#172455]">
                  {values.siteName || "Packaging Hype"} | Custom Packaging
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Site Identity Section */}
      <div className="rounded-[10px] border border-[#E8EAEF] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172455]/10 text-[#172455]">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172455]">
                Site Identity
              </h3>
              <p className="text-xs text-[#6B7280]">
                General brand name used across header titles and metadata.
              </p>
            </div>
          </div>
        </div>

        <div>
          <FieldLabel required>Site Name</FieldLabel>
          <input
            type="text"
            value={values.siteName || ""}
            onChange={(e) => patch({ siteName: e.target.value })}
            className={inputClass}
            placeholder="Packaging Hype"
            required
          />
        </div>
      </div>

      <div className="rounded-[10px] border border-[#E8EAEF] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172455]/10 text-[#172455]">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172455]">
                Global Scripts
              </h3>
              <p className="text-xs text-[#6B7280]">
                Add as many codes as you need. Analytics, Search Console, Tag Manager, and other site-wide snippets.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              patch({
                customScripts: [
                  ...(values.customScripts || []),
                  createEmptyScript("header"),
                ],
              })
            }
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-[#172455] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#121b40]"
          >
            <Plus className="h-4 w-4" />
            Add Script
          </button>
        </div>

        {(values.customScripts || []).length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D5D8E0] bg-[#F8F9FB] px-6 py-8 text-center">
            <Code2 className="mx-auto mb-2 h-7 w-7 text-[#9CA3AF]" />
            <p className="text-sm font-semibold text-[#172455]">
              No scripts added yet
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Add Google Analytics, Search Console verification, or any tracking code.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {(values.customScripts || []).map((script, index) => (
              <div
                key={script.id}
                className="space-y-3 rounded-lg border border-[#E8EAEF] bg-[#F8F9FB] p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <div>
                      <FieldLabel>Script name</FieldLabel>
                      <input
                        type="text"
                        value={script.name}
                        onChange={(e) =>
                          updateScript(script.id, { name: e.target.value })
                        }
                        placeholder={`e.g. Google Analytics ${index + 1}`}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <FieldLabel>Placement</FieldLabel>
                      <select
                        value={script.placement}
                        onChange={(e) =>
                          updateScript(script.id, {
                            placement:
                              e.target.value === "footer" ? "footer" : "header",
                          })
                        }
                        className={inputClass}
                      >
                        <option value="header">Header (&lt;head&gt;)</option>
                        <option value="footer">Footer (before &lt;/body&gt;)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pb-1">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#172455]">
                      <input
                        type="checkbox"
                        checked={script.enabled}
                        onChange={(e) =>
                          updateScript(script.id, { enabled: e.target.checked })
                        }
                        className="rounded border-[#D5D8E0]"
                      />
                      Enabled
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          customScripts: (values.customScripts || []).filter(
                            (item) => item.id !== script.id
                          ),
                        })
                      }
                      className="cursor-pointer rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label="Remove script"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={script.code}
                  onChange={(e) =>
                    updateScript(script.id, { code: e.target.value })
                  }
                  rows={5}
                  spellCheck={false}
                  placeholder="<script>...</script>"
                  className={`${inputClass} min-h-[100px] resize-y font-mono text-xs leading-relaxed`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-[10px] border border-[#E8EAEF] bg-white/95 p-4 shadow-lg backdrop-blur-xs">
        <p className="text-xs text-[#6B7280]">
          Updates to Logo & Favicon apply instantly across all pages.
        </p>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex cursor-pointer items-center gap-2 rounded-[6px] bg-[#FF5548] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e04337] disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

