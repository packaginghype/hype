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
  const faqs = (data.faqs || []).filter((f) => f.question.trim());
  const relatedProductIds = data.relatedProductIds || [];

  let product;
  try {
    product = await prisma.product.create({
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
    console.error("Product create failed", err);
    return NextResponse.json(
      { error: "Could not create product." },
      { status: 500 }
    );
  }

  await logAdminActivity(session, {
    action: "CREATE",
    entityType: "product",
    entityId: product.id,
    entityLabel: product.name,
    summary: `${session.name} created product "${product.name}"`,
  });

  revalidateCatalog();
  revalidatePath(`/product/${product.slug}`);

  return NextResponse.json({ product }, { status: 201 });
}
