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
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
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

          {/* Live Preview */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#172455]">
              Live Preview
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[#E8EAEF] bg-white p-4">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Header Preview (Light)
                </span>
                <div className="flex h-16 items-center justify-center rounded bg-gray-50 p-2">
                  <Image
                    src={values.logoUrl || "/logo.png"}
                    alt={values.logoAlt || "Packaging Hype"}
                    width={180}
                    height={56}
                    className="max-h-12 w-auto object-contain"
                    unoptimized
                  />
                </div>
              </div>

              <div className="rounded-lg border border-[#E8EAEF] bg-white p-4">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Footer Preview (Dark)
                </span>
                <div className="flex h-16 items-center justify-center rounded bg-[#0F1839] p-2">
                  <Image
                    src={values.logoUrl || "/logo.png"}
                    alt={values.logoAlt || "Packaging Hype"}
                    width={180}
                    height={56}
                    className="max-h-12 w-auto object-contain brightness-0 invert"
                    unoptimized
                  />
                </div>
              </div>
            </div>
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
            folder="packaginghype/site"
          />

          {/* Browser Tab Preview */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#172455]">
              Browser Tab Preview
            </p>
            <div className="max-w-md rounded-t-lg border border-[#D5D8E0] bg-[#E8EAEF] p-2">
              <div className="flex items-center gap-2 rounded-t-md bg-white px-3 py-2 shadow-xs">
                <Image
                  src={values.faviconUrl || "/favicon.png"}
                  alt="Favicon"
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

