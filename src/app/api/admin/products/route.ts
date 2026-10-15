import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  minQuantity: z.coerce.number().int().min(1).default(100),
  leadTimeDays: z.string().optional().nullable(),
  materialsAvailable: z.array(z.string()).default([]),
  finishesAvailable: z.array(z.string()).default([]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  categoryIds: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  imageAlt: z.string().optional().nullable(),
});

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

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription || null,
      fullDescription: data.fullDescription || null,
      sku: data.sku || null,
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
      images: data.imageUrl
        ? {
            create: [
              {
                imageUrl: data.imageUrl,
                altText: data.imageAlt || data.name,
                isPrimary: true,
                sortOrder: 0,
              },
            ],
          }
        : undefined,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
