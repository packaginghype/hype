/**
 * GET  /api/admin/image-audit
 *   Returns all image URLs from DB and their Cloudinary status.
 *   { total, missing, results: [...] }
 *
 * POST /api/admin/image-audit
 *   Body: { urls: string[] }
 *   Re-checks a subset of URLs (for partial refresh).
 */

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type AuditEntry = {
  url: string;
  status: "ok" | "missing" | "external" | "empty";
  /** Where this URL is used (table.field) */
  usedIn: string[];
  /** Extracted Cloudinary public_id (without extension) */
  publicId: string | null;
};

/** Extract public_id from /media/... or full Cloudinary URL */
function extractPublicId(url: string): string | null {
  if (!url) return null;
  if (url.startsWith("/media/")) {
    return url.replace(/^\/media\//, "").replace(/\.[a-z0-9]{2,5}$/i, "") || null;
  }
  try {
    const u = new URL(url);
    if (!u.hostname.includes("res.cloudinary.com")) return null;
    const idx = u.pathname.indexOf("/upload/");
    if (idx === -1) return null;
    const parts = u.pathname
      .slice(idx + 8)
      .split("/")
      .filter(Boolean);
    // Skip transform segments like f_auto, q_75, v123456
    let i = 0;
    while (i < parts.length) {
      if (/^v\d+$/.test(parts[i]) || /^[a-z]{1,4}_.+/i.test(parts[i])) {
        i++;
      } else break;
    }
    const path = parts.slice(i).join("/");
    return path.replace(/\.[a-z0-9]{2,5}$/i, "") || null;
  } catch {
    return null;
  }
}

/** Collect all image URLs from the database with their source location */
async function collectAllImageUrls(): Promise<Map<string, string[]>> {
  // Map<url, usedIn[]>
  const map = new Map<string, string[]>();

  function add(url: string | null | undefined, label: string) {
    if (!url || url.trim() === "") return;
    const existing = map.get(url) || [];
    existing.push(label);
    map.set(url, existing);
  }

  // Products
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      thumbnailUrl: true,
      videoThumbnailUrl: true,
      pageScrollImageUrl: true,
      faqsImageUrl: true,
      merchantImageUrls: true,
      images: { select: { imageUrl: true, sortOrder: true } },
    },
  });

  for (const p of products) {
    const label = `product:${p.slug}`;
    add(p.thumbnailUrl, `${label} [thumbnail]`);
    add(p.videoThumbnailUrl, `${label} [videoThumbnail]`);
    add(p.pageScrollImageUrl, `${label} [contentImage]`);
    add(p.faqsImageUrl, `${label} [faqsImage]`);
    for (const url of p.merchantImageUrls || []) {
      add(url, `${label} [merchantImage]`);
    }
    for (const img of p.images || []) {
      add(img.imageUrl, `${label} [gallery#${img.sortOrder}]`);
    }
  }

  // Categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      imageUrl: true,
      bannerImageUrl: true,
      pageScrollImageUrl: true,
      faqsImageUrl: true,
    },
  });

  for (const c of categories) {
    const label = `category:${c.slug}`;
    add(c.imageUrl, `${label} [thumbnail]`);
    add(c.bannerImageUrl, `${label} [banner]`);
    add(c.pageScrollImageUrl, `${label} [contentImage]`);
    add(c.faqsImageUrl, `${label} [faqsImage]`);
  }

  // Blogs
  const blogs = await prisma.blogPost.findMany({
    select: {
      slug: true,
      featuredImage: true,
      bannerImageUrl: true,
      thumbnailImageUrl: true,
      faqsImageUrl: true,
    },
  });

  for (const b of blogs) {
    const label = `blog:${b.slug}`;
    add(b.featuredImage, `${label} [featured]`);
    add(b.bannerImageUrl, `${label} [banner]`);
    add(b.thumbnailImageUrl, `${label} [thumbnail]`);
    add(b.faqsImageUrl, `${label} [faqsImage]`);
  }

  return map;
}

/** Batch-check Cloudinary public_ids (up to 100 at a time via resources API) */
async function checkCloudinaryBatch(
  publicIds: string[]
): Promise<Set<string>> {
  const existing = new Set<string>();
  const BATCH = 100;

  for (let i = 0; i < publicIds.length; i += BATCH) {
    const batch = publicIds.slice(i, i + BATCH);
    try {
      // Use resources_by_ids for efficient batch lookup
      const result = await cloudinary.api.resources_by_ids(batch, {
        resource_type: "image",
        max_results: BATCH,
      });
      for (const r of result?.resources || []) {
        if (r.public_id) existing.add(r.public_id);
      }
    } catch {
      // On error, try one-by-one for the batch
      for (const id of batch) {
        try {
          await cloudinary.api.resource(id, { resource_type: "image" });
          existing.add(id);
        } catch {
          // Not found — stays missing
        }
      }
    }
  }

  return existing;
}

async function runAudit(): Promise<{
  total: number;
  missing: number;
  external: number;
  results: AuditEntry[];
}> {
  const urlMap = await collectAllImageUrls();

  const results: AuditEntry[] = [];
  const cloudinaryIds: string[] = [];
  const idToUrls = new Map<string, string[]>(); // publicId → [urls]

  for (const [url] of urlMap) {
    const pid = extractPublicId(url);
    if (!pid) continue; // external or unknown
    cloudinaryIds.push(pid);
    const list = idToUrls.get(pid) || [];
    list.push(url);
    idToUrls.set(pid, list);
  }

  const existingIds = await checkCloudinaryBatch(
    Array.from(new Set(cloudinaryIds))
  );

  for (const [url, usedIn] of urlMap) {
    const pid = extractPublicId(url);

    if (!url.trim()) {
      results.push({ url, status: "empty", usedIn, publicId: null });
      continue;
    }

    if (!pid) {
      // External URL (not Cloudinary / not /media/)
      results.push({ url, status: "external", usedIn, publicId: null });
      continue;
    }

    const status = existingIds.has(pid) ? "ok" : "missing";
    results.push({ url, status, usedIn, publicId: pid });
  }

  results.sort((a, b) => {
    const order = { missing: 0, external: 1, ok: 2, empty: 3 };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  });

  return {
    total: results.length,
    missing: results.filter((r) => r.status === "missing").length,
    external: results.filter((r) => r.status === "external").length,
    results,
  };
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await runAudit();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Image audit failed", err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}

