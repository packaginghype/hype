import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import {
  adminCategorySchema,
  categoryWriteData,
} from "@/lib/admin-category-schema";
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
  const parsed = adminCategorySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const faqs = (data.faqs || []).filter((f) => f.question.trim());

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
    select: { id: true, name: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.category.delete({ where: { id } });

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
