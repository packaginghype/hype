import { z } from "zod";

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string().optional().nullable(),
});

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
  category: z.string().optional().nullable(),
  readTime: z.string().optional().nullable(),
  publishedDate: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  videoTitle: z.string().optional().nullable(),
  faqsHeading: z.string().optional().nullable(),
  faqsSubheading: z.string().optional().nullable(),
  faqsImageUrl: z.string().optional().nullable(),
  faqsImageAlt: z.string().optional().nullable(),
  faqsImageTitle: z.string().optional().nullable(),
  faqs: z.array(faqItemSchema).optional().default([]),
  seoTitle: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoScript: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  noIndex: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  relatedBlogsHeading: z.string().optional().nullable(),
  relatedBlogsDescription: z.string().optional().nullable(),
  relatedBlogIds: z.array(z.string()).optional().default([]),
});

export type AdminBlogInput = z.infer<typeof adminBlogSchema>;

export type BlogFaqInput = z.infer<typeof faqItemSchema>;

function parsePublishedDate(value?: string | null): Date {
  if (!value?.trim()) return new Date();
  const raw = value.trim();
  // date input (YYYY-MM-DD) — noon local avoids timezone day-shift
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split("-").map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function normalizeBlogFaqs(
  faqs?: BlogFaqInput[] | null
): { question: string; answer: string }[] {
  if (!faqs?.length) return [];
  return faqs
    .map((item) => ({
      question: (item.question || "").trim(),
      answer: (item.answer || "").trim(),
    }))
    .filter((item) => item.question);
}

/** Scalar BlogPost fields (FAQs handled separately via relation). */
export function blogWriteData(data: AdminBlogInput) {
  const banner = (data.bannerImageUrl || "").trim() || null;
  const publishedDate = parsePublishedDate(data.publishedDate);

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
    category: (data.category || "").trim() || null,
    readTime: (data.readTime || "").trim() || null,
    publishedDate,
    videoUrl: (data.videoUrl || "").trim() || null,
    videoTitle: (data.videoTitle || "").trim() || null,
    faqsHeading: (data.faqsHeading || "").trim() || null,
    faqsSubheading: (data.faqsSubheading || "").trim() || null,
    faqsImageUrl: (data.faqsImageUrl || "").trim() || null,
    faqsImageAlt: (data.faqsImageAlt || "").trim() || null,
    faqsImageTitle: (data.faqsImageTitle || "").trim() || null,
    seoTitle: (data.seoTitle || "").trim() || null,
    seoKeywords: (data.seoKeywords || "").trim() || null,
    seoDescription: (data.seoDescription || "").trim() || null,
    seoScript: (data.seoScript || "").trim() || null,
    canonicalUrl: (data.canonicalUrl || "").trim() || null,
    noIndex: data.noIndex ?? false,
    isPublished: data.isPublished ?? true,
    relatedBlogsHeading: (data.relatedBlogsHeading || "").trim() || "Explore More Packaging Guides",
    relatedBlogsDescription: (data.relatedBlogsDescription || "").trim() || null,
    relatedBlogIds: Array.isArray(data.relatedBlogIds) ? data.relatedBlogIds : [],
  };
}
