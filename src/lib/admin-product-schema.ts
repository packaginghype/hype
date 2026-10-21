import { z } from "zod";

const imageSchema = z.object({
  imageUrl: z.string().min(1),
  altText: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  isPrimary: z.boolean().optional(),
});

const specSchema = z.object({
  heading: z.string(),
  details: z.string(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const adminProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  startingPrice: z.coerce.number().nonnegative().optional().nullable(),
  originalPrice: z.coerce.number().nonnegative().optional().nullable(),
  discountedPrice: z.coerce.number().nonnegative().optional().nullable(),
  inStock: z.boolean().default(true),
  minQuantity: z.coerce.number().int().min(1).default(100),
  leadTimeDays: z.string().optional().nullable(),
  materialsAvailable: z.array(z.string()).default([]),
  finishesAvailable: z.array(z.string()).default([]),
  industryIds: z.array(z.string()).default([]),
  materialCategoryId: z.string().optional().nullable().or(z.literal("")),
  breadcrumbCategoryId: z.string().optional().nullable().or(z.literal("")),
  breadcrumbCategoryIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  thumbnailUrl: z.string().optional().nullable().or(z.literal("")),
  thumbnailAlt: z.string().optional().nullable(),
  thumbnailTitle: z.string().optional().nullable(),
  thumbnailSubDescription: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable().or(z.literal("")),
  videoThumbnailUrl: z.string().optional().nullable().or(z.literal("")),
  videoDescription: z.string().optional().nullable(),
  detailHeading: z.string().optional().nullable(),
  detailShortDescription: z.string().optional().nullable(),
  specsHeading: z.string().optional().nullable(),
  specsDescription: z.string().optional().nullable(),
  specsTableHeading: z.string().optional().nullable(),
  specs: z.array(specSchema).default([]),
  widgetsContent: z.string().optional().nullable(),
  relevantProductsHeading: z.string().optional().nullable(),
  relevantProductsDescription: z.string().optional().nullable(),
  relatedProductIds: z.array(z.string()).default([]),
  relatedBlogsHeading: z.string().optional().nullable(),
  relatedBlogsDescription: z.string().optional().nullable(),
  relatedBlogIds: z.array(z.string()).default([]),
  pageScrollEnabled: z.boolean().default(true),
  pageScrollImageUrl: z.string().optional().nullable().or(z.literal("")),
  pageScrollImageAlt: z.string().optional().nullable(),
  pageScrollImageTitle: z.string().optional().nullable(),
  pageScrollContent: z.string().optional().nullable(),
  faqsHeading: z.string().optional().nullable(),
  faqsSubheading: z.string().optional().nullable(),
  faqsImageUrl: z.string().optional().nullable().or(z.literal("")),
  faqsImageAlt: z.string().optional().nullable(),
  faqs: z.array(faqSchema).default([]),
  merchantImageUrls: z.array(z.string()).default([]),
  navbarEnabled: z.boolean().default(true),
  featureEnabled: z.boolean().default(true),
  seoEnabled: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoScript: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  /** @deprecated prefer images[] */
  imageUrl: z.string().optional().nullable().or(z.literal("")),
  imageAlt: z.string().optional().nullable(),
  images: z.array(imageSchema).default([]),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export function resolveProductCategoryIds(data: AdminProductInput) {
  const ids = new Set<string>([
    ...data.categoryIds,
    ...data.industryIds,
  ]);
  if (data.materialCategoryId?.trim()) ids.add(data.materialCategoryId.trim());
  const crumbIds =
    data.breadcrumbCategoryIds?.length > 0
      ? data.breadcrumbCategoryIds
      : data.breadcrumbCategoryId?.trim()
        ? [data.breadcrumbCategoryId.trim()]
        : [];
  for (const id of crumbIds) {
    if (id.trim()) ids.add(id.trim());
  }
  return Array.from(ids);
}

export function normalizeProductImages(data: AdminProductInput) {
  const fromGallery = data.images
    .map((img, index) => ({
      imageUrl: img.imageUrl.trim(),
      altText: (img.altText || data.name || "").trim(),
      title: (img.title || data.name || "").trim(),
      isPrimary: Boolean(img.isPrimary),
      sortOrder: index,
    }))
    .filter((img) => img.imageUrl);

  if (fromGallery.length > 0) {
    if (!fromGallery.some((img) => img.isPrimary)) {
      fromGallery[0].isPrimary = true;
    }
    return fromGallery.map((img, index) => ({
      ...img,
      isPrimary: index === fromGallery.findIndex((i) => i.isPrimary),
      sortOrder: index,
    }));
  }

  const thumb = data.thumbnailUrl?.trim() || data.imageUrl?.trim();
  if (thumb) {
    return [
      {
        imageUrl: thumb,
        altText: (data.thumbnailAlt || data.imageAlt || data.name || "").trim(),
        title: (data.thumbnailTitle || data.name || "").trim(),
        isPrimary: true,
        sortOrder: 0,
      },
    ];
  }

  return [];
}

export function productWriteData(data: AdminProductInput) {
  const original =
    data.originalPrice ?? data.startingPrice ?? null;
  return {
    name: data.name,
    slug: data.slug,
    shortDescription: data.shortDescription || null,
    fullDescription: data.fullDescription || null,
    sku: data.sku || null,
    startingPrice: original,
    originalPrice: original,
    discountedPrice:
      data.discountedPrice === null || data.discountedPrice === undefined
        ? null
        : data.discountedPrice,
    inStock: data.inStock,
    minQuantity: data.minQuantity,
    leadTimeDays: data.leadTimeDays || "8-10 Business Days",
    materialsAvailable: data.materialsAvailable,
    finishesAvailable: data.finishesAvailable,
    materialCategoryId: data.materialCategoryId?.trim() || null,
    breadcrumbCategoryIds: (() => {
      const ids =
        data.breadcrumbCategoryIds?.length > 0
          ? data.breadcrumbCategoryIds
          : data.breadcrumbCategoryId?.trim()
            ? [data.breadcrumbCategoryId.trim()]
            : [];
      return ids.map((id) => id.trim()).filter(Boolean);
    })(),
    breadcrumbCategoryId: (() => {
      const ids =
        data.breadcrumbCategoryIds?.length > 0
          ? data.breadcrumbCategoryIds
          : data.breadcrumbCategoryId?.trim()
            ? [data.breadcrumbCategoryId.trim()]
            : [];
      return ids[0]?.trim() || null;
    })(),
    thumbnailUrl: data.thumbnailUrl?.trim() || null,
    thumbnailAlt: data.thumbnailAlt || null,
    thumbnailTitle: data.thumbnailTitle || null,
    thumbnailSubDescription: data.thumbnailSubDescription || null,
    videoUrl: data.videoUrl?.trim() || null,
    videoThumbnailUrl: data.videoThumbnailUrl?.trim() || null,
    videoDescription: data.videoDescription || null,
    detailHeading: data.detailHeading || null,
    detailShortDescription: data.detailShortDescription || null,
    specsHeading: data.specsHeading || null,
    specsDescription: data.specsDescription || null,
    specsTableHeading: data.specsTableHeading || null,
    widgetsContent: data.widgetsContent || null,
    relevantProductsHeading: data.relevantProductsHeading || null,
    relevantProductsDescription: data.relevantProductsDescription || null,
    relatedBlogsHeading: data.relatedBlogsHeading || "Related Articles & Packaging Guides",
    relatedBlogsDescription: data.relatedBlogsDescription || null,
    relatedBlogIds: (data.relatedBlogIds || []).filter(Boolean),
    pageScrollEnabled: data.pageScrollEnabled,
    pageScrollImageUrl: data.pageScrollImageUrl?.trim() || null,
    pageScrollImageAlt: data.pageScrollImageAlt || null,
    pageScrollImageTitle: data.pageScrollImageTitle || null,
    pageScrollContent: data.pageScrollContent || null,
    faqsHeading: data.faqsHeading || null,
    faqsSubheading: data.faqsSubheading || null,
    faqsImageUrl: data.faqsImageUrl?.trim() || null,
    faqsImageAlt: data.faqsImageAlt || null,
    merchantImageUrls: (data.merchantImageUrls || []).filter((u) => u.trim()),
    navbarEnabled: data.navbarEnabled,
    featureEnabled: data.featureEnabled,
    seoEnabled: data.seoEnabled,
    seoTitle: data.seoTitle || null,
    seoKeywords: data.seoKeywords || null,
    seoDescription: data.seoDescription || null,
    seoScript: data.seoScript || null,
    isPublished: data.isPublished,
  };
}
