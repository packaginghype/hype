import { NextResponse } from "next/server";
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

type Params = { params: Promise<{ id: string }> };

async function guard() {
  return getAdminSession();
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

  await logAdminActivity(session, {
    action: "UPDATE",
    entityType: "product",
    entityId: product.id,
    entityLabel: product.name,
    summary: `${session.name} updated product "${product.name}"`,
  });

  revalidateCatalog();
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
    select: { id: true, name: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  await logAdminActivity(session, {
    action: "DELETE",
    entityType: "product",
    entityId: existing.id,
    entityLabel: existing.name,
    summary: `${session.name} deleted product "${existing.name}"`,
  });

}
