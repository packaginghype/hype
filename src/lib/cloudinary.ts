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
  return "Could not set image name on Cloudinary";
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

async function verifiedMediaUrl(
  publicId: string,
  resourceType: "image" | "video",
  secureUrl?: string
): Promise<{ url: string; publicId: string }> {
  if (secureUrl) {
    const verified = await resourceExists(publicId, resourceType);
    if (verified) {
      return {
        url: toMediaUrl(verified.secure_url),
        publicId: verified.public_id,
      };
    }
    return { url: toMediaUrl(secureUrl), publicId };
  }

  const verified = await resourceExists(publicId, resourceType);
  if (!verified) {
    throw new Error(
      "Image name was set but the file is missing on Cloudinary. Re-upload the image, then try again."
    );
  }
  return {
    url: toMediaUrl(verified.secure_url),
    publicId: verified.public_id,
  };
}

/**
 * Ensure an asset lives at folder/name and return clean `/media/...` URL.
 * Uses Cloudinary rename when possible; recovers if already at the target name.
 */
export async function renameCloudinaryAsset(options: {
  url: string;
  folder: string;
  slug: string;
  resourceType?: "image" | "video";
}): Promise<{ url: string; publicId: string }> {
  const fromId = extractPublicId(options.url);
  if (!fromId) {
    throw new Error("Could not read current image id from URL");
  }

  const folder = options.folder.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");
  const name = slugify(options.slug.replace(/\.[a-z0-9]{2,5}$/i, ""));
  if (!name) throw new Error("Image name is required");

  const resourceType = options.resourceType || "image";
  const toId = `${folder}/${name}`;

  if (fromId === toId) {
    return verifiedMediaUrl(toId, resourceType);
  }

  const source = await resourceExists(fromId, resourceType);
  if (!source) {
    const target = await resourceExists(toId, resourceType);
    if (target) {
      return {
        url: toMediaUrl(target.secure_url),
        publicId: target.public_id,
      };
    }
    throw new Error(
      "Image file is missing on Cloudinary. Upload the image again, set the image name, then save."
    );
  }

  // 1) Native rename — most reliable for same-account assets
  try {
    const result = await cloudinary.uploader.rename(fromId, toId, {
      resource_type: resourceType,
      overwrite: true,
      invalidate: true,
    });
    return verifiedMediaUrl(
      typeof result?.public_id === "string" ? result.public_id : toId,
      resourceType,
      typeof result?.secure_url === "string" ? result.secure_url : undefined
    );
  } catch (renameErr) {
    // 2) Copy via Admin API secure URL (keeps original until save cleanup)
    try {
      const result = await cloudinary.uploader.upload(source.secure_url, {
        folder,
        public_id: name,
        resource_type: resourceType,
        overwrite: true,
        invalidate: true,
        unique_filename: false,
        use_filename: false,
      });
      return verifiedMediaUrl(
        typeof result?.public_id === "string" ? result.public_id : toId,
        resourceType,
        typeof result?.secure_url === "string" ? result.secure_url : undefined
      );
    } catch {
      throw new Error(cloudinaryErrorMessage(renameErr));
    }
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
