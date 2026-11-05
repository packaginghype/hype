import type { ImageLoaderProps } from "next/image";
import { isCloudinaryDeliveryUrl, toMediaUrl } from "@/lib/media-url";

/**
 * Custom next/image loader — Cloudinary → `/media/folder/file` (no ext / transforms).
 */
export default function cloudinaryImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (isCloudinaryDeliveryUrl(src) || src.startsWith("/media/")) {
    return toMediaUrl(src);
  }

  // Local / already-clean paths: keep Next optimizer.
  if (src.startsWith("/") && !src.startsWith("//")) {
    const q = quality || 75;
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
  }

  // Other remote hosts (Unsplash, etc.)
  const q = quality || 75;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
