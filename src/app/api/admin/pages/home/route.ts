import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { homePageSchema, HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";
import { logAdminActivity } from "@/lib/admin-activity";

const PAGE_KEY = "home";

async function guard() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

/** GET /api/admin/pages/home — returns current home page CMS data */
export async function GET() {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await prisma.sitePage.findUnique({ where: { key: PAGE_KEY } });
  const data = record?.data ?? HOME_PAGE_DEFAULTS;

  return NextResponse.json({ data });
}

/** PUT /api/admin/pages/home — upsert home page CMS data */
export async function PUT(request: Request) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = homePageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const record = await prisma.sitePage.upsert({
    where: { key: PAGE_KEY },
    create: { key: PAGE_KEY, data: parsed.data as object },
    update: { data: parsed.data as object },
  });

  await logAdminActivity(session, {
    action: "UPDATE",
    entityType: "page",
    entityId: record.id,
    entityLabel: "Home Page",
    summary: "Updated home page CMS content",
  });

  // Revalidate home page cache
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/revalidate?path=/`, {
      method: "POST",
    }).catch(() => {});
  } catch {}

  return NextResponse.json({ ok: true, data: record.data });
}
