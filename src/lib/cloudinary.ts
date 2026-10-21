import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Checks whether a URL is a Cloudinary URL hosted under our cloud account.
 */
function isCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return false;
  return url.includes(`res.cloudinary.com/${cloudName}`);
}

/**
 * Extracts the Cloudinary public_id from a secure URL.
 * e.g. "https://res.cloudinary.com/mycloud/image/upload/v123/folder/file.jpg"
 *       → "folder/file"
 */
function extractPublicId(url: string): string | null {
  try {
    // Match anything after /upload/vXXXXX/ or /upload/
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Deletes a single Cloudinary asset by its URL.
 * Silently ignores non-Cloudinary URLs or missing public IDs.
 */
export async function deleteCloudinaryAsset(
  url: string | null | undefined,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> {
  if (!isCloudinaryUrl(url)) return;
  const publicId = extractPublicId(url!);
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    // Log but don't throw — we never want Cloudinary cleanup to break a user-facing request
    console.error(`[Cloudinary] Failed to delete asset "${publicId}":`, err);
  }
}

/**
 * Deletes multiple Cloudinary assets by URL array.
 * Skips nulls and non-Cloudinary URLs.
 */
export async function deleteCloudinaryAssets(
  urls: (string | null | undefined)[],
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> {
  await Promise.all(urls.map((url) => deleteCloudinaryAsset(url, resourceType)));
}

/**
 * Computes URLs that were present in oldUrls but are absent from newUrls,
 * then deletes those removed Cloudinary assets.
 *
 * @param oldUrls  - URLs before the update
 * @param newUrls  - URLs after the update
 */
export async function deleteRemovedCloudinaryAssets(
  oldUrls: (string | null | undefined)[],
  newUrls: (string | null | undefined)[],
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> {
  const newSet = new Set(newUrls.filter(Boolean));
  const removed = oldUrls.filter((u) => u && !newSet.has(u));
  await deleteCloudinaryAssets(removed, resourceType);
}
