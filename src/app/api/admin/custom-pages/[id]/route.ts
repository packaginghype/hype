import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/admin-activity";
import { revalidateCustomPages } from "@/lib/cache";
import {
  assertCustomPageSlugAvailable,
  customPageSchema,
  slugifyPageTitle,
} from "@/lib/custom-pages";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const page = await prisma.customPage.findUnique({ where: { id } });
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ page });
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.customPage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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
  const clash = await assertCustomPageSlugAvailable(data.slug, id);
  if (clash) {
    return NextResponse.json({ error: clash }, { status: 409 });
  }

  const page = await prisma.customPage.update({
    where: { id },
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
    action: "UPDATE",
    entityType: "page",
    entityId: page.id,
    entityLabel: page.title,
    summary: `${session.name} updated page “${page.title}” (/${page.slug})`,
  });

  revalidateCustomPages(existing.slug);
  if (existing.slug !== page.slug) revalidateCustomPages(page.slug);

  return NextResponse.json({ page });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.customPage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.customPage.delete({ where: { id } });

  await logAdminActivity(session, {
    action: "DELETE",
    entityType: "page",
    entityId: existing.id,
    entityLabel: existing.title,
    summary: `${session.name} deleted page “${existing.title}” (/${existing.slug})`,
  });

  revalidateCustomPages(existing.slug);
  return NextResponse.json({ ok: true });
}
