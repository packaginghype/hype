import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import {
  adminProductSchema,
  normalizeProductImages,
  productWriteData,
  resolveProductCategoryIds,
} from "@/lib/admin-product-schema";
import { revalidateCatalog } from "@/lib/cache";
import { logAdminActivity } from "@/lib/admin-activity";
import {
  deleteCloudinaryAssets,
  deleteRemovedCloudinaryAssets,
} from "@/lib/cloudinary";

type Params = { params: Promise<{ id: string }> };

async function guard() {
  return getAdminSession();
}

/** Collect all top-level image URLs from a product DB record */
function productTopLevelImageUrls(
  p: {
    thumbnailUrl: string | null;
    videoThumbnailUrl: string | null;
    pageScrollImageUrl: string | null;
    faqsImageUrl: string | null;
    merchantImageUrls: string[];
  } | null
): string[] {
  if (!p) return [];
  return [
    p.thumbnailUrl,
    p.videoThumbnailUrl,
    p.pageScrollImageUrl,
    p.faqsImageUrl,
    ...(p.merchantImageUrls || []),
  ].filter(Boolean) as string[];
}

export async function PUT(request: Request, { params }: Params) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = adminProductSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const images = normalizeProductImages(data);
  const categoryIds = resolveProductCategoryIds(data);
  const specs = (data.specs || []).filter((s) => s.heading.trim());
  const faqs = (data.faqs || []).filter((f) => f.question.trim());
  const relatedProductIds = (data.relatedProductIds || []).filter(
    (relatedId) => relatedId !== id
  );

  // Fetch old image data before updating
  const existing = await prisma.product.findUnique({
    where: { id },
    select: {
      slug: true,
      thumbnailUrl: true,
      videoThumbnailUrl: true,
      pageScrollImageUrl: true,
      faqsImageUrl: true,
      merchantImageUrls: true,
      images: { select: { imageUrl: true } },
    },
  });

  const oldTopLevelUrls = productTopLevelImageUrls(existing);
  const oldGalleryUrls = (existing?.images || []).map((img) => img.imageUrl);

  await prisma.$transaction([
    prisma.productCategory.deleteMany({ where: { productId: id } }),
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.productSpec.deleteMany({ where: { productId: id } }),
    prisma.productFaq.deleteMany({ where: { productId: id } }),
    prisma.productRelated.deleteMany({ where: { productId: id } }),
  ]);

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productWriteData(data),
      categories: {
        create: categoryIds.map((categoryId) => ({ categoryId })),
      },
      images:
        images.length > 0
          ? {
              create: images.map((img) => ({
                imageUrl: img.imageUrl,
                altText: img.altText,
                title: img.title,
                isPrimary: img.isPrimary,
                sortOrder: img.sortOrder,
              })),
            }
          : undefined,
      specs: {
        create: specs.map((spec, index) => ({
          heading: spec.heading.trim(),
          details: spec.details || "",
          sortOrder: index,
        })),
      },
      faqs: {
        create: faqs.map((faq, index) => ({
          question: faq.question.trim(),
          answer: faq.answer || "",
          sortOrder: index,
        })),
      },
      relatedFrom: {
        create: relatedProductIds.map((relatedProductId, index) => ({
          relatedProductId,
          sortOrder: index,
        })),
      },
    },
  });

  // Build new image URL sets for comparison
  const newTopLevelUrls = productTopLevelImageUrls({
    thumbnailUrl: data.thumbnailUrl ?? null,
    videoThumbnailUrl: data.videoThumbnailUrl ?? null,
    pageScrollImageUrl: data.pageScrollImageUrl ?? null,
    faqsImageUrl: data.faqsImageUrl ?? null,
    merchantImageUrls: data.merchantImageUrls ?? [],
  });
  const newGalleryUrls = images.map((img) => img.imageUrl);

  // Delete removed Cloudinary assets (top-level + gallery)
  await deleteRemovedCloudinaryAssets(oldTopLevelUrls, newTopLevelUrls);
  await deleteRemovedCloudinaryAssets(oldGalleryUrls, newGalleryUrls);

  // Video thumbnails are images; also handle video deletion if URL changed
  if (
    existing?.videoThumbnailUrl &&
    existing.videoThumbnailUrl !== (data.videoThumbnailUrl ?? null)
  ) {
    // Already handled above in top-level; separate video url itself:
  }

  await logAdminActivity(session, {
    action: "UPDATE",
    entityType: "product",
    entityId: product.id,
    entityLabel: product.name,
    summary: `${session.name} updated product "${product.name}"`,
  });

  revalidateCatalog();
  revalidatePath(`/product/${product.slug}`);
  if (existing?.slug && existing.slug !== product.slug) {
    revalidatePath(`/product/${existing.slug}`);
  }
  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      thumbnailUrl: true,
      videoThumbnailUrl: true,
      videoUrl: true,
      pageScrollImageUrl: true,
      faqsImageUrl: true,
      merchantImageUrls: true,
      images: { select: { imageUrl: true } },
    },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  // Delete all Cloudinary images for this product
  const allImageUrls = [
    ...productTopLevelImageUrls(existing),
    ...(existing.images || []).map((img) => img.imageUrl),
  ];
  await deleteCloudinaryAssets(allImageUrls, "image");

  // Delete video from Cloudinary if it's there
  if (existing.videoUrl) {
    const { deleteCloudinaryAsset } = await import("@/lib/cloudinary");
    await deleteCloudinaryAsset(existing.videoUrl, "video");
  }

  await logAdminActivity(session, {
    action: "DELETE",
    entityType: "product",
    entityId: existing.id,
    entityLabel: existing.name,
    summary: `${session.name} deleted product "${existing.name}"`,
  });

  revalidateCatalog();
  return NextResponse.json({ ok: true });
}
