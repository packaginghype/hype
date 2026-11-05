import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/admin-activity";
import { revalidateCustomPages } from "@/lib/cache";
import {
  assertCustomPageSlugAvailable,
  customPageSchema,
  listCustomPagesAdmin,
  slugifyPageTitle,
} from "@/lib/custom-pages";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pages = await listCustomPagesAdmin();
  return NextResponse.json({ pages });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (body && !body.slug && body.title) {
    body.slug = slugifyPageTitle(String(body.title));
  }

  const parsed = customPageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const clash = await assertCustomPageSlugAvailable(data.slug);
  if (clash) {
    return NextResponse.json({ error: clash }, { status: 409 });
  }

  const page = await prisma.customPage.create({
    data: {
      title: data.title,
      slug: data.slug,
      menuLabel: data.menuLabel || null,
      showInHeader: data.showInHeader ?? false,
      showInFooter: data.showInFooter ?? false,
      menuOrder: data.menuOrder ?? 0,
      published: data.published ?? true,
      eyebrow: data.eyebrow || null,
      heading: data.heading || data.title,
      intro: data.intro || null,
      content: data.content || null,
      sections: (data.sections || []) as Prisma.InputJsonValue,
      layout: (data.layout || {}) as Prisma.InputJsonValue,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      seoKeywords: data.seoKeywords || null,
      seoCanonical: data.seoCanonical || null,
    },
  });

  await logAdminActivity(session, {
    action: "CREATE",
    entityType: "page",
    entityId: page.id,
    entityLabel: page.title,
    summary: `${session.name} created page “${page.title}” (/${page.slug})`,
  });

  revalidateCustomPages(page.slug);
  return NextResponse.json({ page }, { status: 201 });
}
