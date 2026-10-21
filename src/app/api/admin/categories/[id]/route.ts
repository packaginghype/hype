import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import {
  adminCategorySchema,
  categoryWriteData,
} from "@/lib/admin-category-schema";
import { revalidateCatalog } from "@/lib/cache";
import { logAdminActivity } from "@/lib/admin-activity";
import {
  deleteCloudinaryAssets,
  deleteRemovedCloudinaryAssets,
} from "@/lib/cloudinary";

type Params = { params: Promise<{ id: string }> };

async function guard() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

/** All image URLs stored directly on a category */
function categoryImageUrls(
  c: {
    imageUrl: string | null;
    bannerImageUrl: string | null;
    pageScrollImageUrl: string | null;
    faqsImageUrl: string | null;
  } | null
): string[] {
  if (!c) return [];
  return [
    c.imageUrl,
    c.bannerImageUrl,
    c.pageScrollImageUrl,
    c.faqsImageUrl,
  ].filter(Boolean) as string[];
}

export async function PUT(request: Request, { params }: Params) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = adminCategorySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const faqs = (data.faqs || []).filter((f) => f.question.trim());

  // Fetch old image URLs before update
  const existing = await prisma.category.findUnique({
    where: { id },
    select: {
      imageUrl: true,
      bannerImageUrl: true,
      pageScrollImageUrl: true,
      faqsImageUrl: true,
    },
  });

  const oldUrls = categoryImageUrls(existing);

  const category = await prisma.$transaction(async (tx) => {
    await tx.categoryFaq.deleteMany({ where: { categoryId: id } });
    return tx.category.update({
      where: { id },
      data: {
        ...categoryWriteData(data),
        faqs: {
          create: faqs.map((faq, index) => ({
            question: faq.question.trim(),
            answer: faq.answer || "",
            sortOrder: index,
          })),
        },
      },
    });
  });

  // Delete replaced/removed images from Cloudinary
  const newUrls = categoryImageUrls({
    imageUrl: data.imageUrl ?? null,
    bannerImageUrl: data.bannerImageUrl ?? null,
    pageScrollImageUrl: data.pageScrollImageUrl ?? null,
    faqsImageUrl: data.faqsImageUrl ?? null,
  });
  await deleteRemovedCloudinaryAssets(oldUrls, newUrls);

  await logAdminActivity(session, {
    action: "UPDATE",
    entityType: "category",
    entityId: category.id,
    entityLabel: category.name,
    summary: `${session.name} updated category "${category.name}"`,
  });

  revalidateCatalog();
  return NextResponse.json({ category });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      bannerImageUrl: true,
      pageScrollImageUrl: true,
      faqsImageUrl: true,
    },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.category.delete({ where: { id } });

  // Delete all Cloudinary images for this category
  await deleteCloudinaryAssets(categoryImageUrls(existing));

  await logAdminActivity(session, {
    action: "DELETE",
    entityType: "category",
    entityId: existing.id,
    entityLabel: existing.name,
    summary: `${session.name} deleted category "${existing.name}"`,
  });

  revalidateCatalog();
  return NextResponse.json({ success: true });
}
