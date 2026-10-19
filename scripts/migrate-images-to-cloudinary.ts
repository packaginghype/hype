import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

// In-memory cache of source URL -> Cloudinary secure_url
const urlCache = new Map<string, string>();

function normalizeToHostingerUrl(url: string): string {
  // Ensure we hit www.packaginghype.com which has Hostinger CDN active
  return url.replace("https://packaginghype.com/", "https://www.packaginghype.com/")
            .replace("http://packaginghype.com/", "https://www.packaginghype.com/");
}

async function uploadToCloudinary(sourceUrl: string): Promise<string | null> {
  if (!sourceUrl || !sourceUrl.includes("wp-content")) {
    return null;
  }

  if (urlCache.has(sourceUrl)) {
    return urlCache.get(sourceUrl)!;
  }

  const targetUrl = normalizeToHostingerUrl(sourceUrl);

  try {
    const res = await cloudinary.uploader.upload(targetUrl, {
      folder: "packaginghype/catalog",
      use_filename: true,
      unique_filename: true,
      resource_type: "image",
    });

    urlCache.set(sourceUrl, res.secure_url);
    return res.secure_url;
  } catch (err: any) {
    console.error(`  [FAILED] ${sourceUrl}: ${err.message || err}`);
    return null;
  }
}

async function main() {
  console.log("=== Starting Image Migration to Cloudinary ===");
  console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);

  // 1. Categories
  const categories = await prisma.category.findMany();
  console.log(`\nFound ${categories.length} categories to inspect...`);

  for (const cat of categories) {
    const updates: Record<string, string> = {};

    if (cat.imageUrl?.includes("wp-content")) {
      console.log(`Uploading Category [${cat.slug}] imageUrl...`);
      const cld = await uploadToCloudinary(cat.imageUrl);
      if (cld) updates.imageUrl = cld;
    }

    if (cat.bannerImageUrl?.includes("wp-content")) {
      console.log(`Uploading Category [${cat.slug}] bannerImageUrl...`);
      const cld = await uploadToCloudinary(cat.bannerImageUrl);
      if (cld) updates.bannerImageUrl = cld;
    }

    if (cat.pageScrollImageUrl?.includes("wp-content")) {
      console.log(`Uploading Category [${cat.slug}] pageScrollImageUrl...`);
      const cld = await uploadToCloudinary(cat.pageScrollImageUrl);
      if (cld) updates.pageScrollImageUrl = cld;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.category.update({
        where: { id: cat.id },
        data: updates,
      });
      console.log(`  Updated Category [${cat.slug}] with Cloudinary URLs.`);
    }
  }

  // 2. Product Images
  const productImages = await prisma.productImage.findMany({
    where: {
      imageUrl: {
        contains: "wp-content",
      },
    },
  });

  console.log(`\nFound ${productImages.length} ProductImages with wp-content to upload...`);

  let prodImgCount = 0;
  for (const img of productImages) {
    prodImgCount++;
    console.log(`[${prodImgCount}/${productImages.length}] Uploading ProductImage id=${img.id}...`);
    const cld = await uploadToCloudinary(img.imageUrl);
    if (cld) {
      await prisma.productImage.update({
        where: { id: img.id },
        data: { imageUrl: cld },
      });
      console.log(`  -> ${cld}`);
    }
  }

  // 3. Products extra fields (pageScrollImageUrl, thumbnailUrl, merchantImageUrls)
  const products = await prisma.product.findMany();
  console.log(`\nFound ${products.length} Products to check extra image fields...`);

  for (const prod of products) {
    const updates: Record<string, any> = {};

    if (prod.thumbnailUrl?.includes("wp-content")) {
      const cld = await uploadToCloudinary(prod.thumbnailUrl);
      if (cld) updates.thumbnailUrl = cld;
    }

    if (prod.pageScrollImageUrl?.includes("wp-content")) {
      const cld = await uploadToCloudinary(prod.pageScrollImageUrl);
      if (cld) updates.pageScrollImageUrl = cld;
    }

    if (prod.merchantImageUrls && prod.merchantImageUrls.some(u => u.includes("wp-content"))) {
      const newMerchantUrls: string[] = [];
      for (const mUrl of prod.merchantImageUrls) {
        if (mUrl.includes("wp-content")) {
          const cld = await uploadToCloudinary(mUrl);
          newMerchantUrls.push(cld || mUrl);
        } else {
          newMerchantUrls.push(mUrl);
        }
      }
      updates.merchantImageUrls = newMerchantUrls;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.product.update({
        where: { id: prod.id },
        data: updates,
      });
      console.log(`  Updated Product [${prod.slug}] extra fields.`);
    }
  }

  console.log("\n=== Migration Complete! ===");
  console.log(`Total unique images uploaded to Cloudinary: ${urlCache.size}`);
}

main()
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
