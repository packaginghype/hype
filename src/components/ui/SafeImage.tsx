"use client";

import React, { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Package } from "lucide-react";

export interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc,
  className,
  title: _ignoredTitle, // Omit title attribute to prevent browser tooltip on hover while preserving alt in DOM for SEO
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src) {
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
    if (fallbackSrc) {
      return (
        <Image
          {...props}
          src={fallbackSrc}
          alt={alt}
          className={className}
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
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}
