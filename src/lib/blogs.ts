import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, CATALOG_REVALIDATE } from "@/lib/cache-tags";

export function formatBlogDate(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export const DEFAULT_BLOG_IMAGES = [
  "/images/blog-kraft-boxes.jpg",
  "/images/blog-luxury-finishes.jpg",
  "/images/blog-mailer-boxes.jpg",
  "/images/blog-rigid-boxes.jpg",
  "/images/packaging-guide-3d.jpg",
  "/images/reliable-packaging-boxes.jpg",
];

export function getBlogFallbackImage(seed: string | number = ""): string {
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEFAULT_BLOG_IMAGES.length;
  return DEFAULT_BLOG_IMAGES[index];
}

export function mapBlogWithFallbackImage<
  T extends {
    id: string;
    slug: string;
    featuredImage?: string | null;
    bannerImageUrl?: string | null;
    thumbnailImageUrl?: string | null;
  }
>(post: T | null): T | null {
  if (!post) return null;
  const hasImage = post.thumbnailImageUrl || post.bannerImageUrl || post.featuredImage;
  if (!hasImage) {
    const fallback = getBlogFallbackImage(post.slug || post.id);
    return {
      ...post,
      featuredImage: fallback,
      bannerImageUrl: post.bannerImageUrl || fallback,
      thumbnailImageUrl: post.thumbnailImageUrl || fallback,
    };
  }
  return post;
}

export const getPublishedBlogs = unstable_cache(
  async () => {
    const posts = await prisma.blogPost.findMany({
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
    return posts.map((p) => mapBlogWithFallbackImage(p)!);
  },
  ["published-blogs"],
  { tags: [CACHE_TAGS.blogs], revalidate: CATALOG_REVALIDATE }
);

export async function getBlogsPaged({
  page = 1,
  pageSize = 6,
}: {
  page?: number;
  pageSize?: number;
} = {}) {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * pageSize;

  return unstable_cache(
    async () => {
      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where: { isPublished: true },
          orderBy: { publishedDate: "desc" },
          skip,
          take: pageSize,
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
        }),
        prisma.blogPost.count({
          where: { isPublished: true },
        }),
      ]);

      return {
        posts: posts.map((p) => mapBlogWithFallbackImage(p)!),
        total,
        page: safePage,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      };
    },
    [`blogs-paged-${safePage}-${pageSize}`],
    { tags: [CACHE_TAGS.blogs], revalidate: CATALOG_REVALIDATE }
  )();
}

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
          author: true,
          publishedDate: true,
          thumbnailImageUrl: true,
          bannerImageUrl: true,
          featuredImage: true,
        },
      });

      if (featured.length >= limit) {
        return featured.map((p) => mapBlogWithFallbackImage(p)!);
      }

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
          author: true,
          publishedDate: true,
          thumbnailImageUrl: true,
          bannerImageUrl: true,
          featuredImage: true,
        },
      });

      return [...featured, ...extra].map((p) => mapBlogWithFallbackImage(p)!);
    },
    [`featured-blogs-${limit}`],
    { tags: [CACHE_TAGS.blogs], revalidate: CATALOG_REVALIDATE }
  )();
}

export async function getBlogsByIds(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return [];

  return unstable_cache(
    async () => {
      const posts = await prisma.blogPost.findMany({
        where: { id: { in: unique }, isPublished: true },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          author: true,
          publishedDate: true,
          thumbnailImageUrl: true,
          bannerImageUrl: true,
          featuredImage: true,
        },
      });
      const byId = new Map(posts.map((p) => [p.id, mapBlogWithFallbackImage(p)!]));
      return unique
        .map((id) => byId.get(id))
        .filter((post): post is NonNullable<typeof post> => Boolean(post));
    },
    [`blogs-by-ids-${unique.join(",")}`],
    { tags: [CACHE_TAGS.blogs], revalidate: CATALOG_REVALIDATE }
  )();
}

export const getBlogBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      const post = await prisma.blogPost.findFirst({
        where: { slug, isPublished: true },
        include: {
          faqs: { orderBy: { sortOrder: "asc" } },
        },
      });
      return mapBlogWithFallbackImage(post);
    },
    [`blog-by-slug-${slug}`],
    { tags: [CACHE_TAGS.blogs], revalidate: CATALOG_REVALIDATE }
  )();
});

export function getHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function extractHeadingsFromHtml(html: string): { id: string; text: string; level: 2 | 3 }[] {
  if (!html) return [];
  const matches = [...html.matchAll(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi)];
  return matches
    .map((match) => {
      const level = Number(match[1]) as 2 | 3;
      const attrs = match[2] || "";
      const text = stripHtml(match[3] || "");
      const idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
      return {
        id: idMatch?.[1] || getHeadingId(text),
        text,
        level,
      };
    })
    .filter((item) => Boolean(item.text));
}

export function ensureHeadingIds(html: string): string {
  if (!html) return "";
  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, inner) => {
      if (/\sid\s*=/i.test(attrs)) return match;
      const id = getHeadingId(stripHtml(inner));
      if (!id) return match;
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  );
}
