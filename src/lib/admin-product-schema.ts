import { z } from "zod";

const imageSchema = z.object({
  imageUrl: z.string().min(1),
  altText: z.string().optional().nullable(),
  isPrimary: z.boolean().optional(),
});

export const adminProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  startingPrice: z.coerce.number().nonnegative().optional().nullable(),
  minQuantity: z.coerce.number().int().min(1).default(100),
  leadTimeDays: z.string().optional().nullable(),
  materialsAvailable: z.array(z.string()).default([]),
  finishesAvailable: z.array(z.string()).default([]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  categoryIds: z.array(z.string()).default([]),
  /** @deprecated prefer images[] */
  imageUrl: z.string().optional().nullable().or(z.literal("")),
  imageAlt: z.string().optional().nullable(),
  images: z.array(imageSchema).default([]),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export function normalizeProductImages(data: AdminProductInput) {
  const fromGallery = data.images
    .map((img, index) => ({
      imageUrl: img.imageUrl.trim(),
      altText: (img.altText || data.name || "").trim(),
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

  if (data.imageUrl?.trim()) {
    return [
      {
        imageUrl: data.imageUrl.trim(),
        altText: (data.imageAlt || data.name || "").trim(),
        isPrimary: true,
        sortOrder: 0,
      },
    ];
  }

  return [];
}
