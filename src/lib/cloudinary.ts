import { v2 as cloudinary } from "cloudinary";
import { extractCloudinaryPublicId, toMediaUrl } from "@/lib/media-url";
import { slugify } from "@/lib/utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Checks whether a URL is a Cloudinary URL hosted under our cloud account,
 * or a same-origin `/media/...` rewrite of one.
 */
function isCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.startsWith("/media/")) return true;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return false;
  return url.includes(`res.cloudinary.com/${cloudName}`);
}

/**
 * Extracts the Cloudinary public_id (no file extension).
 * Accepts full Cloudinary URLs or `/media/folder/file.ext`.
 */
export function extractPublicId(url: string): string | null {
  try {
    if (url.startsWith("/media/")) {
      const path = url.replace(/^\/media\//, "").split("?")[0];
      return path.replace(/\.[a-z0-9]{2,5}$/i, "") || null;
    }
    const fromClean = extractCloudinaryPublicId(url);
    if (fromClean) {
      return fromClean.replace(/\.[a-z0-9]{2,5}$/i, "") || null;
    }
    // Match anything after /upload/vXXXXX/ or /upload/
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function cloudinaryErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object") {
    const o = error as Record<string, unknown>;
    if (typeof o.message === "string" && o.message.trim()) return o.message;
    const nested = o.error;
    if (nested && typeof nested === "object") {
      const n = nested as Record<string, unknown>;
      if (typeof n.message === "string" && n.message.trim()) return n.message;
    }
  }
  return "Apply slug failed";
}

async function resourceExists(
  publicId: string,
  resourceType: "image" | "video"
): Promise<{ secure_url: string; public_id: string; format?: string } | null> {
  try {
    const existing = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
    if (typeof existing?.secure_url === "string") {
      return {
        secure_url: existing.secure_url,
        public_id:
          typeof existing.public_id === "string" ? existing.public_id : publicId,
        format: typeof existing.format === "string" ? existing.format : undefined,
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Copy/move an existing asset to folder/slug and return clean `/media/...` URL.
 *
 * Prefer copy-via-upload (keeps old id until form save). Falls back to rename
 * when remote upload is blocked. Recovers if an earlier rename already moved it.
 */
export async function renameCloudinaryAsset(options: {
  url: string;
  folder: string;
  slug: string;
  resourceType?: "image" | "video";
}): Promise<{ url: string; publicId: string }> {
  const fromId = extractPublicId(options.url);
  if (!fromId) {
    throw new Error("Could not read current image public id");
  }

  const folder = options.folder.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");
  const slug = slugify(options.slug.replace(/\.[a-z0-9]{2,5}$/i, ""));
  if (!slug) throw new Error("Slug is required");

  const resourceType = options.resourceType || "image";
  const toId = `${folder}/${slug}`;
  const extMatch = options.url.match(/\.([a-z0-9]{2,5})(?:\?|$)/i);
  const ext =
    extMatch?.[1] || (resourceType === "video" ? "mp4" : "webp");

  if (fromId === toId) {
    return { url: `/media/${toId}.${ext}`, publicId: toId };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Cloudinary is not configured");

  const source = await resourceExists(fromId, resourceType);

  // Already moved to slug in a previous attempt — just point the form at it.
  if (!source) {
    const target = await resourceExists(toId, resourceType);
    if (target) {
      return {
        url: toMediaUrl(target.secure_url),
        publicId: target.public_id,
      };
    }
    throw new Error(
      "Current image is missing on Cloudinary (deleted or already renamed). Re-upload the image, then apply the slug."
    );
  }

  const sourceCandidates = [
    source.secure_url,
    options.url.startsWith("http") ? options.url.split("#")[0] : null,
    `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${fromId}.${source.format || ext}`,
    `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${fromId}`,
  ].filter((u): u is string => Boolean(u));

  let lastError: unknown = null;
  for (const sourceUrl of sourceCandidates) {
    try {
      const result = await cloudinary.uploader.upload(sourceUrl, {
        folder,
        public_id: slug,
        resource_type: resourceType,
        overwrite: true,
        invalidate: true,
        unique_filename: false,
        use_filename: false,
      });
      const secure =
        typeof result?.secure_url === "string"
          ? result.secure_url
          : `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${toId}.${ext}`;
      return {
        url: toMediaUrl(secure),
        publicId: typeof result?.public_id === "string" ? result.public_id : toId,
      };
    } catch (err) {
      lastError = err;
    }
  }

  // Last resort: native rename (old URL stops working until the form is saved).
  try {
    const result = await cloudinary.uploader.rename(fromId, toId, {
      resource_type: resourceType,
      overwrite: true,
      invalidate: true,
    });
    const secure =
      typeof result?.secure_url === "string"
        ? result.secure_url
        : `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${toId}.${ext}`;
    return {
      url: toMediaUrl(secure),
      publicId: typeof result?.public_id === "string" ? result.public_id : toId,
    };
  } catch (err) {
    lastError = err;
  }

  throw new Error(cloudinaryErrorMessage(lastError));
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
