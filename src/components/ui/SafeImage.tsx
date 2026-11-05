"use client";

import React, { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Package } from "lucide-react";
import { isCloudinaryDeliveryUrl, toMediaUrl } from "@/lib/media-url";

export interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

/** Always normalize Cloudinary /media paths to /media/folder/file (no ext). */
function cleanSrc(src: ImageProps["src"]): ImageProps["src"] {
  if (typeof src !== "string") return src;
  if (isCloudinaryDeliveryUrl(src) || src.startsWith("/media/")) {
    return toMediaUrl(src);
  }
  return src;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc,
  className,
  title: _ignoredTitle, // Omit title attribute to prevent browser tooltip on hover while preserving alt in DOM for SEO
  unoptimized,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = cleanSrc(src);
  const resolvedFallback = fallbackSrc ? cleanSrc(fallbackSrc) : undefined;

  if (!resolvedSrc) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-[#F0EBE3] text-slate-400 ${
          props.fill ? "absolute inset-0" : ""
        } ${className || ""}`}
      >
        <Package className="h-10 w-10 opacity-60" />
      </div>
    );
  }

  if (hasError) {
    if (resolvedFallback) {
      return (
        <Image
          {...props}
          src={resolvedFallback}
          alt={alt}
          className={className}
          unoptimized={unoptimized}
        />
      );
    }
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-[#F0EBE3] text-slate-400 ${
          props.fill ? "absolute inset-0" : ""
        } ${className || ""}`}
      >
        <Package className="h-10 w-10 opacity-60" />
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      className={className}
      unoptimized={unoptimized}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}
