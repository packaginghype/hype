import { z } from "zod";

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const adminCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable().or(z.literal("")),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  group: z
    .enum(["categories", "industries", "materials", "shapes"])
    .default("categories"),

  originalPrice: z.coerce.number().nullable().optional(),
  discountedPrice: z.coerce.number().nullable().optional(),
  inStock: z.boolean().optional().default(true),

  bannerEnabled: z.boolean().optional().default(true),
  bannerQuoteEnabled: z.boolean().optional().default(true),
  bannerHeading: z.string().optional().nullable(),
  bannerDescription: z.string().optional().nullable(),
  bannerImageUrl: z.string().optional().nullable().or(z.literal("")),
  bannerImageAlt: z.string().optional().nullable(),
  bannerImageTitle: z.string().optional().nullable(),

  imageAlt: z.string().optional().nullable(),
  imageTitle: z.string().optional().nullable(),

  widgetsContent: z.string().optional().nullable(),
  listingHeading: z.string().optional().nullable(),
  listingText: z.string().optional().nullable(),

  navbarEnabled: z.boolean().optional().default(true),
  featureEnabled: z.boolean().optional().default(true),
  pageScrollEnabled: z.boolean().optional().default(true),
  pageScrollImageUrl: z.string().optional().nullable().or(z.literal("")),
  pageScrollImageAlt: z.string().optional().nullable(),
  pageScrollImageTitle: z.string().optional().nullable(),
  pageScrollContent: z.string().optional().nullable(),

  faqsHeading: z.string().optional().nullable(),
  faqsSubheading: z.string().optional().nullable(),
  faqs: z.array(faqSchema).optional().default([]),

  seoEnabled: z.boolean().optional().default(true),
  seoKeywords: z.string().optional().nullable(),
  seoScript: z.string().optional().nullable(),
  isPublished: z.boolean().optional().default(true),
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;

export function categoryWriteData(data: AdminCategoryInput) {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    imageUrl: data.imageUrl || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    sortOrder: data.sortOrder,
    group: data.group,
    originalPrice: data.originalPrice ?? null,
    discountedPrice: data.discountedPrice ?? null,
    inStock: data.inStock ?? true,
    bannerEnabled: data.bannerEnabled ?? true,
    bannerQuoteEnabled: data.bannerQuoteEnabled ?? true,
    bannerHeading: data.bannerHeading || null,
    bannerDescription: data.bannerDescription || null,
    bannerImageUrl: data.bannerImageUrl || null,
    bannerImageAlt: data.bannerImageAlt || null,
    bannerImageTitle: data.bannerImageTitle || null,
    imageAlt: data.imageAlt || null,
    imageTitle: data.imageTitle || null,
    widgetsContent: data.widgetsContent || null,
    listingHeading: data.listingHeading || null,
    listingText: data.listingText || null,
    navbarEnabled: data.navbarEnabled ?? true,
    featureEnabled: data.featureEnabled ?? true,
    pageScrollEnabled: data.pageScrollEnabled ?? true,
    pageScrollImageUrl: data.pageScrollImageUrl || null,
    pageScrollImageAlt: data.pageScrollImageAlt || null,
    pageScrollImageTitle: data.pageScrollImageTitle || null,
    pageScrollContent: data.pageScrollContent || null,
    faqsHeading: data.faqsHeading || null,
    faqsSubheading: data.faqsSubheading || null,
    seoEnabled: data.seoEnabled ?? true,
    seoKeywords: data.seoKeywords || null,
    seoScript: data.seoScript || null,
    isPublished: data.isPublished ?? true,
  };
}
