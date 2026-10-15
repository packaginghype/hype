import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import {
  adminProductSchema,
  normalizeProductImages,
} from "@/lib/admin-product-schema";

type Params = { params: Promise<{ id: string }> };

async function guard() {
  return getAdminSession();
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = adminProductSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const images = normalizeProductImages(data);

  await prisma.productCategory.deleteMany({ where: { productId: id } });
  await prisma.productImage.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription || null,
      fullDescription: data.fullDescription || null,
      sku: data.sku || null,
      startingPrice:
        data.startingPrice === null || data.startingPrice === undefined
          ? null
          : data.startingPrice,
      minQuantity: data.minQuantity,
      leadTimeDays: data.leadTimeDays || "8-10 Business Days",
      materialsAvailable: data.materialsAvailable,
      finishesAvailable: data.finishesAvailable,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      isPublished: data.isPublished,
      categories: {
        create: data.categoryIds.map((categoryId) => ({ categoryId })),
      },
      images:
        images.length > 0
          ? {
              create: images.map((img) => ({
                imageUrl: img.imageUrl,
                altText: img.altText,
                isPrimary: img.isPrimary,
                sortOrder: img.sortOrder,
              })),
            }
          : undefined,
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
