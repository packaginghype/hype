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
  const writeData = productWriteData(data);

  let product;
  try {
    product = await prisma.$transaction(async (tx) => {
      await tx.productCategory.deleteMany({ where: { productId: id } });
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productSpec.deleteMany({ where: { productId: id } });
      await tx.productFaq.deleteMany({ where: { productId: id } });
      await tx.productRelated.deleteMany({ where: { productId: id } });

      return tx.product.update({
        where: { id },
        data: {
          ...writeData,
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
    });
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code?: string }).code)
        : "";
    if (code === "P2002") {
      return NextResponse.json(
        { error: "Product slug already exists. Choose a different slug." },
        { status: 409 }
      );
    }
    console.error("Product update failed", err);
    return NextResponse.json(
      { error: "Could not save product." },
      { status: 500 }
    );
  }

  const newTopLevelUrls = productTopLevelImageUrls({
    thumbnailUrl: writeData.thumbnailUrl,
    videoThumbnailUrl: writeData.videoThumbnailUrl,
    pageScrollImageUrl: writeData.pageScrollImageUrl,
    faqsImageUrl: writeData.faqsImageUrl,
    merchantImageUrls: writeData.merchantImageUrls,
  });
  const newGalleryUrls = images.map((img) => img.imageUrl);

  // Never fail the save because Cloudinary cleanup failed
  try {
    await deleteRemovedCloudinaryAssets(oldTopLevelUrls, newTopLevelUrls);
    await deleteRemovedCloudinaryAssets(oldGalleryUrls, newGalleryUrls);
  } catch (err) {
    console.error("Cloudinary cleanup after product save failed", err);
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
