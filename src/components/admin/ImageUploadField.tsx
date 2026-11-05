"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Link2, Upload } from "lucide-react";
import { cn, slugify } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  recommended: string;
  hint?: string;
  folder?: string;
  accept?: string;
  className?: string;
  /** Prefill image filename slug (e.g. product/category slug) */
  defaultSlug?: string;
  /** Show the image slug field (default true) */
  showSlugField?: boolean;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  recommended,
  hint = "Max 1MB · JPG, PNG, WEBP",
  folder = "packaginghype/categories",
  accept = "image/jpeg,image/png,image/webp,image/gif",
  className,
  defaultSlug = "",
  showSlugField = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [slug, setSlug] = useState(() => slugify(defaultSlug || ""));
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugApplied, setSlugApplied] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [value]);

  useEffect(() => {
    if (!slugTouched && defaultSlug) {
      setSlug(slugify(defaultSlug));
    }
  }, [defaultSlug, slugTouched]);

  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const previewSlug = slugify(slug.replace(/\.[a-z0-9]{2,5}$/i, ""));
  const currentExt =
    value.match(/\.([a-z0-9]{2,5})(?:\?|$)/i)?.[1]?.toLowerCase() || "webp";
  const previewPath = previewSlug
    ? `/media/${cleanFolder}/${previewSlug}.${currentExt}`
    : `/media/${cleanFolder}/[auto-id].webp`;
  const alreadyOnSlug =
    Boolean(value) &&
    Boolean(previewSlug) &&
    (value.includes(`/${previewSlug}.`) ||
      value.endsWith(`/${previewSlug}`) ||
      value.includes(`/${cleanFolder}/${previewSlug}.`));

  async function applySlugToCurrent() {
    if (!value || !previewSlug) {
      setError("Set a slug first, then apply.");
      return;
    }
    setError("");
    setSlugApplied(false);
    setUploading(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: value,
          slug: previewSlug,
          folder: cleanFolder,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Apply slug failed");
        return;
      }
      onChange(data.url);
      setShowUrl(true);
      setSlugApplied(true);
    } catch {
      setError("Apply slug failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", cleanFolder);
      if (previewSlug) {
        body.append("slug", previewSlug);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      onChange(data.url);
      setShowUrl(false);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex min-h-[42px] flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#172455]">
            {label}
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-[#6B7280]">
            <span className="font-semibold text-[#172455]">{recommended}</span>
            {" · "}
            {hint}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-bold text-[#21AAA5] hover:text-[#FF5548]"
        >
          <Link2 className="h-3.5 w-3.5" />
          {showUrl ? "Hide URL" : "Paste URL"}
        </button>
      </div>

      {showSlugField ? (
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#172455]">
            Image slug / filename
          </p>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            onBlur={() =>
              setSlug(slugify(slug.replace(/\.[a-z0-9]{2,5}$/i, "")))
            }
            placeholder="e.g. custom-tie-boxes"
            className="w-full rounded-[6px] border border-[#E2E4E8] bg-white px-3 py-2 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/10"
          />
          <p className="mt-1 break-all font-mono text-[11px] text-[#21AAA5]">
            Target: {previewPath}
          </p>
          {value ? (
            <p className="mt-0.5 break-all font-mono text-[11px] text-[#6B7280]">
              Current: {value}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={
                uploading || !value || !previewSlug || alreadyOnSlug
              }
              onClick={() => void applySlugToCurrent()}
              className="inline-flex h-8 cursor-pointer items-center rounded-[5px] border border-[#21AAA5] bg-white px-3 text-[11px] font-bold text-[#21AAA5] hover:bg-[#EAF7F6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Working…" : "Apply slug to current image"}
            </button>
            {slugApplied ? (
              <span className="text-[11px] font-semibold text-emerald-700">
                Copied to slug URL — save this form to publish (old file stays
                until save).
              </span>
            ) : alreadyOnSlug ? (
              <span className="text-[11px] font-semibold text-emerald-700">
                Already on this slug URL
              </span>
            ) : (
              <span className="text-[11px] text-[#6B7280]">
                Copies to the slug URL without breaking the live image. Save the
                form after. Or choose file to upload fresh with this slug.
              </span>
            )}
          </div>
        </div>
      ) : null}

      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void onFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "grid min-h-[132px] cursor-pointer gap-3 rounded-[8px] border border-dashed p-3 transition-colors sm:grid-cols-[120px_1fr]",
          dragging
            ? "border-[#172455] bg-[#EEF2FF]"
            : "border-[#E2E4E8] bg-[#F8FAFC]"
        )}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <div className="relative h-[108px] w-full overflow-hidden rounded-[6px] border border-[#E2E4E8] bg-white sm:w-[120px]">
          {value && !imgError ? (
            <Image
              src={value}
              alt="Preview"
              fill
              draggable={false}
              className="pointer-events-none object-cover"
              sizes="120px"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-[#9CA3AF]">
              <ImagePlus className="h-6 w-6" />
              <span className="text-[10px] font-semibold">
                {imgError ? "Preview error" : "Preview"}
              </span>
            </div>
          )}
        </div>

        <div
          className="flex min-w-0 flex-col justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />

          <p className="min-h-[18px] text-[12px] text-[#6B7280]">
            {dragging
              ? "Drop image to upload"
              : "Drag & drop an image here, or choose a file"}
          </p>

          <div className="flex min-h-10 flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[5px] bg-[#172455] px-4 text-xs font-bold text-white transition-colors hover:bg-[#0f1839] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Uploading…" : "Choose file"}
            </button>

            <button
              type="button"
              onClick={() => onChange("")}
              disabled={!value}
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-[5px] border px-3 text-xs font-bold transition-colors",
                value
                  ? "cursor-pointer border-[#E2E4E8] bg-white text-[#FF5548] hover:bg-[#FFF5F4]"
                  : "invisible pointer-events-none border-transparent"
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          <div className="min-h-[42px]">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/media/… or https://res.cloudinary.com/…"
              tabIndex={showUrl ? 0 : -1}
              className={cn(
                "w-full rounded-[4px] border border-[#E2E4E8] bg-white px-3 py-2 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5548]",
                showUrl ? "visible" : "invisible pointer-events-none"
              )}
            />
            {error ? (
              <p className="mt-1 text-[12px] font-medium text-red-600">{error}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
