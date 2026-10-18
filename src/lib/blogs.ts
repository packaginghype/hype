import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, CATALOG_REVALIDATE } from "@/lib/cache";

export function formatBlogDate(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export const getPublishedBlogs = unstable_cache(
  async () => {
    return prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedDate: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        author: true,
        publishedDate: true,
        featuredEnabled: true,
        thumbnailImageUrl: true,
        bannerImageUrl: true,
        featuredImage: true,
        thumbnailImageAlt: true,
        bannerImageAlt: true,
      },
    });
  },
  ["published-blogs"],
  { tags: [CACHE_TAGS.blogs], revalidate: CATALOG_REVALIDATE }
);

export async function getFeaturedBlogs(limit = 4) {
  return unstable_cache(
    async () => {
      const featured = await prisma.blogPost.findMany({
        where: { isPublished: true, featuredEnabled: true },
        orderBy: { publishedDate: "desc" },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedDate: true,
          thumbnailImageUrl: true,
          bannerImageUrl: true,
          featuredImage: true,
        },
      });

      if (featured.length >= limit) return featured;

      const extra = await prisma.blogPost.findMany({
        where: {
          isPublished: true,
          id: { notIn: featured.map((p) => p.id) },
        },
        orderBy: { publishedDate: "desc" },
        take: limit - featured.length,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedDate: true,
          thumbnailImageUrl: true,
          bannerImageUrl: true,
          featuredImage: true,
        },
      });

      return [...featured, ...extra];
    },
    [`featured-blogs-${limit}`],
    { tags: [CACHE_TAGS.blogs], revalidate: CATALOG_REVALIDATE }
  )();
}

export async function getBlogBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return prisma.blogPost.findFirst({
        where: { slug, isPublished: true },
      });
    },
    [`blog-by-slug-${slug}`],
    { tags: [CACHE_TAGS.blogs], revalidate: CATALOG_REVALIDATE }
  )();
}
