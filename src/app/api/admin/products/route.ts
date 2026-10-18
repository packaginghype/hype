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
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = adminProductSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const images = normalizeProductImages(data);
  const categoryIds = resolveProductCategoryIds(data);
  const specs = (data.specs || []).filter((s) => s.heading.trim());
  const faqs = (data.faqs || []).filter((f) => f.question.trim());
  const relatedProductIds = data.relatedProductIds || [];

  const product = await prisma.product.create({
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
    action: "CREATE",
    entityType: "product",
    entityId: product.id,
    entityLabel: product.name,
    summary: `${session.name} created product "${product.name}"`,
  });

  return NextResponse.json({ product }, { status: 201 });
}
