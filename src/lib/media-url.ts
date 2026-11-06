/**
 * Serve Cloudinary assets as clean same-origin paths:
 * `/media/folder/filename.jpg` — no host, transforms, or version.
 * Format extension is kept so admin/media links show the real file type.
 */

const CLOUDINARY_HOST = "res.cloudinary.com";
const FORMAT_EXT_RE = /\.(avif|webp|png|jpe?g|gif|svg|bmp|ico|tiff?|heic|mp4|webm|mov)$/i;

function isTransformSegment(segment: string): boolean {
  if (!segment || /^v\d+$/.test(segment)) return false;
  // e.g. f_auto, q_75, w_1080, c_fill,g_auto or comma lists
  if (segment.includes(",")) {
    return segment.split(",").every((part) => /^[a-z]{1,4}_.+/i.test(part));
  }
  return /^[a-z]{1,4}_.+/i.test(segment);
}

/** Strip delivery transforms + version → folder/filename(.ext?) */
function toAssetPath(parts: string[]): string | null {
  let i = 0;
  while (i < parts.length && isTransformSegment(parts[i])) i += 1;
  if (i < parts.length && /^v\d+$/.test(parts[i])) i += 1;
  if (i >= parts.length) return null;
  return parts.slice(i).join("/") || null;
}

/** Drop trailing image/video format (for public_id / basename compares). */
function stripFormatExtension(path: string): string {
  return path.replace(FORMAT_EXT_RE, "");
}

/** Filename stem from a /media or Cloudinary URL (no folder, no extension). */
export function mediaBasename(url: string): string {
  if (!url) return "";
  const base = url.split("?")[0].split("/").pop() || "";
  return stripFormatExtension(base).toLowerCase();
}

/** File extension from a media/Cloudinary URL, e.g. "png" — empty if unknown. */
export function mediaExtension(url: string): string {
  if (!url) return "";
  const base = url.split("?")[0].split("/").pop() || "";
  const match = base.match(FORMAT_EXT_RE);
  return match?.[1]?.toLowerCase() || "";
}

/** Cloudinary folder/file path (may include extension) from a full delivery URL. */
export function extractCloudinaryPublicId(src: string): string | null {
  try {
    const url = new URL(src);
    if (!url.hostname.includes(CLOUDINARY_HOST)) return null;
    const marker = "/upload/";
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return null;

    const parts = url.pathname.slice(idx + marker.length).split("/").filter(Boolean);
    return toAssetPath(parts);
  } catch {
    return null;
  }
}

/** @deprecated use extractCloudinaryPublicId */
export function extractCloudinaryUploadPath(src: string): string | null {
  return extractCloudinaryPublicId(src);
}

export function isCloudinaryDeliveryUrl(src: string): boolean {
  return (
    typeof src === "string" &&
    src.includes(CLOUDINARY_HOST) &&
    src.includes("/upload/")
  );
}

/** Normalize an existing `/media/...` path (drop transforms/version, keep ext). */
function cleanMediaPath(src: string): string {
  const raw = src.replace(/^\/media\//, "").split("?")[0];
  const parts = raw.split("/").filter(Boolean);
  const assetPath = toAssetPath(parts);
  return assetPath ? `/media/${assetPath}` : src.split("?")[0];
}

/**
 * Ensure a `/media/...` path ends with a real file extension.
 * Cloudinary secure_url sometimes omits it; we use `format` from the API.
 */
export function ensureMediaExtension(
  mediaUrl: string,
  format?: string | null
): string {
  if (!mediaUrl) return mediaUrl;
  const pathOnly = mediaUrl.split("?")[0];
  if (!pathOnly.startsWith("/media/")) return mediaUrl;
  if (FORMAT_EXT_RE.test(pathOnly)) return pathOnly;

  const fmt = (format || "")
    .trim()
    .replace(/^\./, "")
    .toLowerCase();
  if (!fmt || !/^[a-z0-9]{2,5}$/.test(fmt)) return pathOnly;

  // jpeg → jpg for shorter, familiar URLs
  const normalized = fmt === "jpeg" ? "jpg" : fmt;
  return `${pathOnly}.${normalized}`;
}

/**
 * Same-origin clean URL for a Cloudinary asset.
 * `/media/{folder}/{filename}.jpg` — always prefers a visible format extension.
 */
export function toMediaUrl(
  src: string,
  options?: { width?: number; quality?: number; format?: string | null }
): string {
  if (!src) return src;

  let mediaPath: string;
  if (src.startsWith("/media/")) {
    mediaPath = cleanMediaPath(src);
  } else if (src.startsWith("/") && !src.startsWith("//")) {
    return src;
  } else {
    const assetPath = extractCloudinaryPublicId(src);
    if (!assetPath) return src;
    mediaPath = `/media/${assetPath}`;
  }

  return ensureMediaExtension(mediaPath, options?.format);
}
