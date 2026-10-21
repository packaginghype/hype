import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.blogPost.count();
  const wpRemaining = await prisma.blogPost.count({
    where: {
      OR: [
        { featuredImage: { contains: "wp-content" } },
        { thumbnailImageUrl: { contains: "wp-content" } },
        { bannerImageUrl: { contains: "wp-content" } },
      ],
    },
  });
  const onCloudinary = await prisma.blogPost.count({
    where: { featuredImage: { contains: "cloudinary.com" } },
  });
  const noImage = await prisma.blogPost.count({
    where: { featuredImage: null },
  });

  console.log("=== Blog Status ===");
  console.log(`Total blogs:          ${total}`);
  console.log(`On Cloudinary:        ${onCloudinary}`);
  console.log(`No image:             ${noImage}`);
  console.log(`Still wp-content:     ${wpRemaining}`);
  console.log(wpRemaining === 0 ? "\n✅ All clean!" : "\n⚠️  Some still need migration");
}

main().catch(console.error).finally(() => prisma.$disconnect());
