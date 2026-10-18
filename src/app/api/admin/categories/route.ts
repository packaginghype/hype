import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import {
  adminCategorySchema,
  categoryWriteData,
} from "@/lib/admin-category-schema";
import { revalidateCatalog } from "@/lib/cache";
import { logAdminActivity } from "@/lib/admin-activity";

async function guard() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

export async function GET() {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = adminCategorySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const faqs = (data.faqs || []).filter((f) => f.question.trim());

  const category = await prisma.category.create({
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

  await logAdminActivity(session, {
    action: "CREATE",
    entityType: "category",
    entityId: category.id,
    entityLabel: category.name,
    summary: `${session.name} created category "${category.name}"`,
  });

  revalidateCatalog();
  return NextResponse.json({ category }, { status: 201 });
}
