/**
 * migrate-blog-images-to-cloudinary.mjs  (v2)
 *
 * Blogs store image URLs as relative paths like /wp-content/uploads/...
 * The files were downloaded to public/wp-content/uploads/ during import.
 *
 * This script:
 * 1. Reports total blog count
 * 2. Finds blogs with relative/local image paths
 * 3. Uploads them to Cloudinary from local disk
 * 4. Updates DB with Cloudinary URLs
 */

import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");

config({ path: join(ROOT, ".env.local") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

// Cache: local path → cloudinary secure_url
const uploadCache = new Map();

function isLocalUrl(url) {
  if (!url) return false;
  return url.startsWith("/wp-content") || url.startsWith("wp-content");
}

function isExternalWpUrl(url) {
  if (!url) return false;
  return url.includes("packaginghype.com/wp-content") || url.includes("packaginghype.com/wp-");
}

function mimeFromExt(ext) {
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
  };
  return map[ext.toLowerCase()] || "image/jpeg";
}

async function uploadLocalFile(relativePath) {
  const cacheKey = relativePath;
  if (uploadCache.has(cacheKey)) return uploadCache.get(cacheKey);

  const localPath = join(PUBLIC_DIR, relativePath);

  if (!existsSync(localPath)) {
    console.log(`    ⚠ File not found locally: ${localPath}`);
    return null;
  }

  try {
    const buffer = readFileSync(localPath);
    const ext = extname(localPath);
    const mime = mimeFromExt(ext);
    const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;

    const res = await cloudinary.uploader.upload(dataUri, {
      folder: "packaginghype/blogs",
      use_filename: true,
      unique_filename: true,
      resource_type: "image",
    });

    uploadCache.set(cacheKey, res.secure_url);
    console.log(`    ✓ Uploaded → ${res.public_id}`);
    return res.secure_url;
  } catch (err) {
    console.error(`    ✗ FAILED: ${relativePath} → ${err.message || JSON.stringify(err)}`);
    return null;
  }
}

async function uploadExternalUrl(url) {
  if (uploadCache.has(url)) return uploadCache.get(url);
  try {
    const res = await cloudinary.uploader.upload(url, {
      folder: "packaginghype/blogs",
      use_filename: true,
      unique_filename: true,
      resource_type: "image",
    });
    uploadCache.set(url, res.secure_url);
    console.log(`    ✓ Uploaded (remote) → ${res.public_id}`);
    return res.secure_url;
  } catch (err) {
    console.error(`    ✗ FAILED (remote): ${url} → ${err.message || JSON.stringify(err)}`);
    return null;
  }
}

async function migrateUrl(url) {
  if (!url) return null;
  if (isLocalUrl(url)) return uploadLocalFile(url.startsWith("/") ? url : "/" + url);
  if (isExternalWpUrl(url)) return uploadExternalUrl(url);
  return null; // already a Cloudinary or non-wp URL, skip
}

async function main() {
  console.log("=== Blog Image Migration to Cloudinary (v2) ===\n");
  console.log(`Cloudinary cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`Public directory: ${PUBLIC_DIR}\n`);

  // 1. Count all blogs
  const totalBlogs = await prisma.blogPost.count();
  const publishedBlogs = await prisma.blogPost.count({ where: { isPublished: true } });
  console.log(`📚 Blogs in DB: ${totalBlogs} total, ${publishedBlogs} published\n`);

  // 2. Find blogs with non-Cloudinary image URLs
  const allBlogs = await prisma.blogPost.findMany({
    select: { id: true, slug: true, featuredImage: true, bannerImageUrl: true, thumbnailImageUrl: true },
  });

  const needsMigration = allBlogs.filter(b =>
    isLocalUrl(b.featuredImage) || isLocalUrl(b.bannerImageUrl) || isLocalUrl(b.thumbnailImageUrl) ||
    isExternalWpUrl(b.featuredImage) || isExternalWpUrl(b.bannerImageUrl) || isExternalWpUrl(b.thumbnailImageUrl)
  );

  const cloudinaryBlogs = allBlogs.filter(b =>
    (b.featuredImage && b.featuredImage.includes("cloudinary.com")) ||
    (!b.featuredImage && !b.bannerImageUrl && !b.thumbnailImageUrl)
  );

  const noImageBlogs = allBlogs.filter(b => !b.featuredImage && !b.bannerImageUrl && !b.thumbnailImageUrl);

  console.log(`🖼️  Blogs needing migration: ${needsMigration.length}`);
  console.log(`✅ Blogs already on Cloudinary: ${cloudinaryBlogs.length - noImageBlogs.length}`);
  console.log(`📭 Blogs with no images: ${noImageBlogs.length}\n`);

  if (needsMigration.length === 0) {
    console.log("✅ All blog images already migrated! Safe to remove public/wp-content/\n");
    return;
  }

  let updatedCount = 0;
  let failedBlogs = 0;

  for (let i = 0; i < needsMigration.length; i++) {
    const blog = needsMigration[i];
    console.log(`[${i + 1}/${needsMigration.length}] ${blog.slug}`);

    const updates = {};

    // featuredImage and bannerImageUrl are typically the same
    const featuredCld = await migrateUrl(blog.featuredImage);
    if (featuredCld) {
      updates.featuredImage = featuredCld;
      updates.bannerImageUrl = featuredCld;
    } else if (blog.featuredImage) {
      failedBlogs++;
    }

    // bannerImageUrl if different from featuredImage
    if (blog.bannerImageUrl && blog.bannerImageUrl !== blog.featuredImage) {
      const bannerCld = await migrateUrl(blog.bannerImageUrl);
      if (bannerCld) updates.bannerImageUrl = bannerCld;
    }

    // thumbnailImageUrl
    const thumbCld = await migrateUrl(blog.thumbnailImageUrl);
    if (thumbCld) updates.thumbnailImageUrl = thumbCld;

    if (Object.keys(updates).length > 0) {
      await prisma.blogPost.update({ where: { id: blog.id }, data: updates });
      updatedCount++;
    }
  }

  console.log(`\n📊 Migration Results:`);
  console.log(`   Blogs updated: ${updatedCount}`);
  console.log(`   Blogs with failed uploads: ${failedBlogs}`);
  console.log(`   Unique images uploaded: ${uploadCache.size}`);

  // 3. Final check
  const remaining = await prisma.blogPost.count({
    where: {
      OR: [
        { featuredImage: { contains: "wp-content" } },
        { bannerImageUrl: { contains: "wp-content" } },
        { thumbnailImageUrl: { contains: "wp-content" } },
      ],
    },
  });

  console.log(`\n🔍 Remaining blogs with wp-content URLs: ${remaining}`);
  if (remaining === 0) {
    console.log("✅ All done! You can safely delete public/wp-content/");
  } else {
    console.log(`⚠️  ${remaining} blogs still have local URLs (files may not exist locally — they'll need manual attention)`);
  }
  console.log("\n=== Complete ===\n");
}

main()
  .catch(err => { console.error("Fatal:", err); process.exit(1); })
  .finally(() => prisma.$disconnect());
