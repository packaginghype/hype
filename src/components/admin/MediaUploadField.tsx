"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FileVideo, Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  recommended: string;
  kind?: "image" | "video";
  folder?: string;
  className?: string;
};

export function MediaUploadField({
  label,
  value,
  onChange,
  recommended,
  kind = "image",
  folder = "packaginghype/products",
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      body.append("kind", kind);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#172455]">
          {label}
        </p>
        <p className="mt-0.5 text-[12px] font-medium text-[#4B5563]">
          {recommended}
        </p>
      </div>

      <div
        className="flex min-h-[112px] cursor-pointer flex-wrap items-start gap-3 rounded-[8px] border border-dashed border-[#E2E4E8] bg-[#F8FAFC] p-3"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <div className="relative h-20 w-28 overflow-hidden rounded-[6px] border border-[#E2E4E8] bg-white">
          {value && kind === "image" ? (
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="112px"
              unoptimized
            />
          ) : value && kind === "video" ? (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-[#21AAA5]">
              <FileVideo className="h-6 w-6" />
              <span className="text-[10px] font-bold">Video ready</span>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] font-semibold text-[#9CA3AF]">
              Preview
            </div>
          )}
        </div>

        <div
          className="flex min-w-0 flex-1 flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={
              kind === "video"
                ? "video/mp4"
                : "image/jpeg,image/png,image/webp,image/gif"
            }
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <div className="flex min-h-10 flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[5px] bg-[#172455] px-4 text-xs font-bold text-white hover:bg-[#0f1839] disabled:cursor-not-allowed disabled:opacity-60"
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
                "inline-flex h-10 items-center gap-1.5 rounded-[5px] border px-3 text-xs font-bold",
                value
                  ? "cursor-pointer border-[#E2E4E8] bg-white text-[#FF5548] hover:bg-[#FFF5F4]"
                  : "invisible pointer-events-none border-transparent"
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
          <div className="min-h-[18px]">
            {value ? (
              <p className="truncate text-[11px] font-medium text-[#6B7280]">
                {value}
              </p>
            ) : null}
            {error ? (
              <p className="text-[12px] font-medium text-red-600">{error}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
