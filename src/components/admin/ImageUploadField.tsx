"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Link2, Upload } from "lucide-react";
import { mediaBasename } from "@/lib/media-url";
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
  /** Prefill image filename (e.g. product/category slug) */
  defaultSlug?: string;
  /** Show the image name field (default true) */
  showSlugField?: boolean;
};

function filenameFromUrl(url: string): string {
  const base = url.split("?")[0].split("/").pop() || "";
  return slugify(base.replace(/\.[a-z0-9]{2,5}$/i, ""));
}

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
  const [name, setName] = useState(() =>
    slugify(defaultSlug || filenameFromUrl(value) || "")
  );
  const [nameTouched, setNameTouched] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setImgError(false);
  }, [value]);

  useEffect(() => {
    if (nameTouched) return;
    const next = slugify(defaultSlug || filenameFromUrl(value) || "");
    if (next) setName(next);
  }, [defaultSlug, value, nameTouched]);

  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const imageName = slugify(name.replace(/\.[a-z0-9]{2,5}$/i, ""));
  const currentBase = mediaBasename(value);
  const targetPath = imageName
    ? `/media/${cleanFolder}/${imageName}`
    : `/media/${cleanFolder}/[image-name]`;
  // Exact basename only — "testing" must NOT match "testing1-1"
  const alreadyNamed =
    Boolean(value) && Boolean(imageName) && currentBase === imageName;

  async function applyImageName(nextName = imageName) {
    const cleanName = slugify(nextName.replace(/\.[a-z0-9]{2,5}$/i, ""));
    if (!value || !cleanName) {
      setError("Set an image name first.");
      return false;
    }

    setError("");
    setStatus("");
    setUploading(true);
    try {
      // Always go through the API so the returned /media URL is verified
      const res = await fetch("/api/admin/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: value,
          slug: cleanName,
          folder: cleanFolder,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not set image name");
        return false;
      }
      onChange(data.url);
      setStatus("Image name set on Cloudinary — click Update to save in database.");
      return true;
    } catch {
      setError("Could not set image name. Try again.");
      return false;
    } finally {
      setUploading(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setStatus("");
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", cleanFolder);
      if (imageName) {
        body.append("slug", imageName);
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
      setStatus(
        imageName
          ? `Uploaded as ${imageName} — click Update to save.`
          : "Uploaded — set an image name, then click Update."
      );
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
            Image name
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setNameTouched(true);
              setName(e.target.value);
              setStatus("");
            }}
            onBlur={() => {
              const cleaned = slugify(name.replace(/\.[a-z0-9]{2,5}$/i, ""));
              setName(cleaned);
              if (value && cleaned && !alreadyNamed) {
                void applyImageName(cleaned);
              }
            }}
            placeholder="e.g. tie-boxes-scroll"
            className="w-full rounded-[6px] border border-[#E2E4E8] bg-white px-3 py-2 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5548] focus:ring-2 focus:ring-[#FF5548]/10"
          />
          <p className="mt-1 break-all font-mono text-[11px] text-[#21AAA5]">
            Saves as: {targetPath}
          </p>
          {value ? (
            <p className="mt-0.5 break-all font-mono text-[11px] text-[#6B7280]">
              Current: {value}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={uploading || !value || !imageName}
              onClick={() => void applyImageName()}
              className="inline-flex h-8 cursor-pointer items-center rounded-[5px] border border-[#21AAA5] bg-white px-3 text-[11px] font-bold text-[#21AAA5] hover:bg-[#EAF7F6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? "Working…"
                : alreadyNamed
                  ? "Re-apply name"
                  : "Apply image name"}
            </button>
            <span className="text-[11px] text-[#6B7280]">
              Type the file name only (hyphen optional). Then Update to save in
              the database.
            </span>
          </div>
          {status ? (
            <p className="mt-1 text-[11px] font-semibold text-emerald-700">
              {status}
            </p>
          ) : null}
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
                "inline-flex h-10 items-center gap-1.5 rounded-[4px] border px-3 text-xs font-bold transition-colors",
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
            {/* type=text: /media/... is not a valid HTML url input and was blocking form submit */}
            <input
              type="text"
              inputMode="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/media/… or https://res.cloudinary.com/…"
              tabIndex={showUrl ? 0 : -1}
              disabled={!showUrl}
              className={cn(
                "w-full rounded-[4px] border border-[#E2E4E8] bg-white px-3 py-2 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5548]",
                showUrl ? "visible" : "hidden"
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
