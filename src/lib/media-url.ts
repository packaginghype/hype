/**
 * Serve Cloudinary assets as clean same-origin paths:
 * `/media/folder/filename.jpg` — no host, transforms, or version.
 */

const CLOUDINARY_HOST = "res.cloudinary.com";

function isTransformSegment(segment: string): boolean {
  if (!segment || /^v\d+$/.test(segment)) return false;
  // e.g. f_auto, q_75, w_1080, c_fill,g_auto or comma lists
  if (segment.includes(",")) {
    return segment.split(",").every((part) => /^[a-z]{1,4}_.+/i.test(part));
  }
  return /^[a-z]{1,4}_.+/i.test(segment);
}

/** Strip delivery transforms + version → folder/filename.ext */
function toAssetPath(parts: string[]): string | null {
  let i = 0;
  while (i < parts.length && isTransformSegment(parts[i])) i += 1;
  if (i < parts.length && /^v\d+$/.test(parts[i])) i += 1;
  if (i >= parts.length) return null;
  return parts.slice(i).join("/") || null;
}

/** Cloudinary folder/file path (keeps extension) from a full delivery URL. */
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
 * Same-origin clean URL for a Cloudinary asset.
 * `/media/{folder}/{filename}.jpg` — quality/size live in the rewrite only.
 */
export function toMediaUrl(
  src: string,
  _options?: { width?: number; quality?: number }
): string {
  if (!src) return src;
  if (src.startsWith("/media/")) return cleanMediaPath(src);
  if (src.startsWith("/") && !src.startsWith("//")) return src;

  const assetPath = extractCloudinaryPublicId(src);
  if (!assetPath) return src;

  return `/media/${assetPath}`;
}
