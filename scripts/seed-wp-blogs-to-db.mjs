import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeUrls(str) {
  if (!str) return str;
  return str.replace(/https?:\/\/packaginghype\.com\/wp-content\/uploads\//gi, "/wp-content/uploads/");
}

async function main() {
  const posts = JSON.parse(fs.readFileSync("scripts/wp-blogs-imported.json", "utf8"));
  console.log(`Starting database upsert of ${posts.length} blog posts...`);

  let created = 0;
  let updated = 0;

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const imagePath = normalizeUrls(p.featuredImage);
    const content = normalizeUrls(p.content);

    const data = {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || null,
      content: content || "<p></p>",
      featuredEnabled: i < 3, // mark the first 3 as featured by default
      featuredImage: imagePath,
      bannerImageUrl: imagePath,
      bannerImageAlt: p.bannerImageAlt || p.title,
      bannerImageTitle: p.bannerImageTitle || p.title,
      thumbnailImageUrl: imagePath,
      thumbnailImageAlt: p.thumbnailImageAlt || p.title,
      thumbnailImageTitle: p.thumbnailImageTitle || p.title,
      author: p.author || "Packaging Hype Team",
      publishedDate: p.publishedDate ? new Date(p.publishedDate) : new Date(),
      seoTitle: p.seoTitle || p.title,
      seoDescription: p.seoDescription || p.excerpt || null,
      seoKeywords: p.seoKeywords || null,
      seoScript: p.seoScript || null,
      isPublished: Boolean(p.isPublished),
    };

    const result = await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });

    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      created++;
    } else {
      updated++;
    }

    if ((i + 1) % 25 === 0 || i + 1 === posts.length) {
      console.log(`Processed ${i + 1}/${posts.length} posts...`);
    }
  }

  console.log(`\nFinished! Successfully processed ${posts.length} posts.`);
  const totalInDb = await prisma.blogPost.count();
  console.log(`Total BlogPost records now in database: ${totalInDb}`);
}

main()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
