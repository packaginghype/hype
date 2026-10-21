import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAdminSession } from "@/lib/admin-auth";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";

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
    const folder = String(form.get("folder") || "packaginghype/products");
    const kind = String(form.get("kind") || "image");

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
      overwrite: false,
    });

    return NextResponse.json({
      url: result.secure_url,
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
