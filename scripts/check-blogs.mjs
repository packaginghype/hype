import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, title: true, slug: true, isPublished: true, createdAt: true },
  });
  console.log("Current DB posts count:", posts.length);
  console.log(JSON.stringify(posts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
