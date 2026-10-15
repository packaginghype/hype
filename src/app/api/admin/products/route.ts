import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import {
  adminProductSchema,
  normalizeProductImages,
} from "@/lib/admin-product-schema";

async function guard() {
  return getAdminSession();
}

export async function GET() {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      categories: { include: { category: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = adminProductSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const images = normalizeProductImages(data);

  const product = await prisma.product.create({
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

  return NextResponse.json({ product }, { status: 201 });
}
