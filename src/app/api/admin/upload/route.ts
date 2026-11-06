import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAdminSession } from "@/lib/admin-auth";
import {
  deleteCloudinaryAsset,
  renameCloudinaryAsset,
} from "@/lib/cloudinary";
import { toMediaUrl } from "@/lib/media-url";
import { slugify } from "@/lib/utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const IMAGE_MAX = 1 * 1024 * 1024;
const VIDEO_MAX = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);
const VIDEO_TYPES = new Set(["video/mp4"]);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 500 }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "packaginghype/products")
      .replace(/^\/+|\/+$/g, "")
      .replace(/\/+/g, "/");
    const kind = String(form.get("kind") || "image");
    // Optional SEO filename → /media/{folder}/{slug}.ext
    const rawSlug = String(form.get("slug") || form.get("publicId") || "");
    const publicId = slugify(rawSlug.replace(/\.[a-z0-9]{2,5}$/i, ""));

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const isVideo = kind === "video";
    if (isVideo) {
      if (!VIDEO_TYPES.has(file.type)) {
        return NextResponse.json({ error: "Use MP4 only" }, { status: 400 });
      }
      if (file.size > VIDEO_MAX) {
        return NextResponse.json(
          { error: "Video must be 5MB or smaller" },
          { status: 400 }
        );
      }
    } else {
      if (!IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: "Use JPG, PNG, WEBP, or GIF" },
          { status: 400 }
        );
      }
      if (file.size > IMAGE_MAX) {
        return NextResponse.json(
          { error: "Image must be 1MB or smaller" },
          { status: 400 }
        );
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: isVideo ? "video" : "image",
      ...(publicId
        ? {
            public_id: publicId,
            overwrite: true,
            invalidate: true,
            unique_filename: false,
            use_filename: false,
          }
        : { overwrite: false }),
    });

    const cleanUrl = toMediaUrl(result.secure_url, {
      format:
        typeof result.format === "string"
          ? result.format
          : isVideo
            ? "mp4"
            : undefined,
    });

    return NextResponse.json({
      url: cleanUrl,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      mediaPath: cleanUrl,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      resourceType: isVideo ? "video" : "image",
    });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/upload
 * Body: { url, slug, folder, resourceType? }
 * Sets Cloudinary public id to folder/slug and returns clean /media URL.
 * Caller must save the returned URL on the product/category record.
 */
export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url : "";
    const slug = typeof body?.slug === "string" ? body.slug : "";
    const folder =
      typeof body?.folder === "string"
        ? body.folder
        : "packaginghype/products";
    const resourceType: "image" | "video" =
      body?.resourceType === "video" ? "video" : "image";

    if (!url || !slug) {
      return NextResponse.json(
        { error: "url and slug are required" },
        { status: 400 }
      );
    }

    const renamed = await renameCloudinaryAsset({
      url,
      folder,
      slug,
      resourceType,
    });

    return NextResponse.json({
      url: renamed.url,
      publicId: renamed.publicId,
      mediaPath: renamed.url,
    });
  } catch (error) {
    console.error("Apply slug failed", error);
    let message = "Apply slug failed";
    if (error instanceof Error && error.message) {
      message = error.message;
    } else if (error && typeof error === "object") {
      const o = error as { message?: unknown; error?: { message?: unknown } };
      if (typeof o.message === "string" && o.message.trim()) message = o.message;
      else if (typeof o.error?.message === "string" && o.error.message.trim()) {
        message = o.error.message;
      }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/upload
 * Body: { url: string; resourceType?: "image" | "video" }
 *
 * Immediately deletes a Cloudinary asset by its URL. Used by admin image
 * pickers when a user explicitly removes an image before saving the record.
 */
export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url : null;
    const resourceType: "image" | "video" =
      body?.resourceType === "video" ? "video" : "image";

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    await deleteCloudinaryAsset(url, resourceType);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete asset failed", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
