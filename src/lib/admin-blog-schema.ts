import { z } from "zod";

export const adminBlogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  featuredEnabled: z.boolean().optional(),
  bannerImageUrl: z.string().optional().nullable(),
  bannerImageAlt: z.string().optional().nullable(),
  bannerImageTitle: z.string().optional().nullable(),
  thumbnailImageUrl: z.string().optional().nullable(),
  thumbnailImageAlt: z.string().optional().nullable(),
  thumbnailImageTitle: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  publishedDate: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoScript: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export type AdminBlogInput = z.infer<typeof adminBlogSchema>;

export function blogWriteData(data: AdminBlogInput) {
  const banner = (data.bannerImageUrl || "").trim() || null;
  const publishedDate = data.publishedDate
    ? new Date(data.publishedDate)
    : new Date();

  return {
    title: data.title.trim(),
    slug: data.slug.trim(),
    excerpt: (data.excerpt || "").trim() || null,
    content: data.content || "",
    featuredEnabled: data.featuredEnabled ?? false,
    featuredImage: banner,
    bannerImageUrl: banner,
    bannerImageAlt: (data.bannerImageAlt || "").trim() || null,
    bannerImageTitle: (data.bannerImageTitle || "").trim() || null,
    thumbnailImageUrl: (data.thumbnailImageUrl || "").trim() || null,
    thumbnailImageAlt: (data.thumbnailImageAlt || "").trim() || null,
    thumbnailImageTitle: (data.thumbnailImageTitle || "").trim() || null,
    author: (data.author || "").trim() || "Packaging Hype Team",
    publishedDate: Number.isNaN(publishedDate.getTime())
      ? new Date()
      : publishedDate,
    seoTitle: (data.seoTitle || "").trim() || null,
    seoKeywords: (data.seoKeywords || "").trim() || null,
    seoDescription: (data.seoDescription || "").trim() || null,
    seoScript: (data.seoScript || "").trim() || null,
    isPublished: data.isPublished ?? true,
  };
}
