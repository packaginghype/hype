"use client";

import React, { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Package } from "lucide-react";

export interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/images/designs/mailer-box.jpg";

function isDeadUrl(url?: string | any): boolean {
  if (!url || typeof url !== "string") return true;
  // Legacy WordPress URLs on packaginghype.com return 403 Forbidden (X-Vercel-Mitigated: deny)
  // on Vercel and trigger 502 OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED.
  if (url.includes("packaginghype.com/wp-content")) {
    return true;
  }
  return false;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const initialSrc = isDeadUrl(src) ? fallbackSrc : (src || fallbackSrc);
  const [activeSrc, setActiveSrc] = useState(initialSrc);

  useEffect(() => {
    const validSrc = isDeadUrl(src) ? fallbackSrc : (src || fallbackSrc);
    setActiveSrc(validSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  if (hasError || !activeSrc) {
    if (fallbackSrc && fallbackSrc !== activeSrc) {
      return (
        <Image
          {...props}
          src={fallbackSrc}
          alt={alt}
          className={className}
          onError={() => setHasError(true)}
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
      src={activeSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc && fallbackSrc !== activeSrc) {
          setActiveSrc(fallbackSrc);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}
