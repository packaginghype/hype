"use client";

import React, { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Package } from "lucide-react";
import { isCloudinaryDeliveryUrl, toMediaUrl } from "@/lib/media-url";

export interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
}

/** Normalize Cloudinary paths to clean `/media/folder/file.ext`. */
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
  showSkeleton = true,
  onLoad,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
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
    <>
      {showSkeleton && !isLoaded && (
        <div
          aria-hidden="true"
          className={`pointer-events-none animate-pulse bg-[#E8EAEF] ${
            props.fill ? "absolute inset-0 z-0" : "h-full w-full"
          }`}
        />
      )}
      <Image
        {...props}
        src={resolvedSrc}
        alt={alt}
        className={`${className || ""} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        unoptimized={unoptimized}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
      />
    </>
  );
}
