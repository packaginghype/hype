import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const DEFAULT_BLOG_IMAGES = [
  "/images/blog-kraft-boxes.jpg",
  "/images/blog-luxury-finishes.jpg",
  "/images/blog-mailer-boxes.jpg",
  "/images/blog-rigid-boxes.jpg",
  "/images/packaging-guide-3d.jpg",
  "/images/reliable-packaging-boxes.jpg",
];

function getBlogFallbackImage(seed = "") {
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEFAULT_BLOG_IMAGES.length;
  return DEFAULT_BLOG_IMAGES[index];
}

async function run() {
  const nullPosts = await prisma.blogPost.findMany({
    where: {
      OR: [
        { featuredImage: null },
        { featuredImage: "" },
      ],
    },
    select: { id: true, slug: true, title: true },
  });

  console.log(`Found ${nullPosts.length} posts without an image. Updating DB...`);

  let updated = 0;
  for (const post of nullPosts) {
    const img = getBlogFallbackImage(post.slug || post.id);
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        featuredImage: img,
        bannerImageUrl: img,
        thumbnailImageUrl: img,
        bannerImageAlt: post.title,
        thumbnailImageAlt: post.title,
      },
    });
    updated++;
  }

  console.log(`Successfully updated ${updated} blog posts with high-quality packaging images!`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
