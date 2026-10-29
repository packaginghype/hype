import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import {
  homePageSchema,
  parseHomePageData,
  formatHomePageZodError,
} from "@/lib/home-page-schema";
import { logAdminActivity } from "@/lib/admin-activity";
import { revalidateHomePage } from "@/lib/cache";

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
  const data = parseHomePageData(record?.data);

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
    return NextResponse.json(
      { error: formatHomePageZodError(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const record = await prisma.sitePage.upsert({
      where: { key: PAGE_KEY },
      create: { key: PAGE_KEY, data: parsed.data as Prisma.InputJsonValue },
      update: { data: parsed.data as Prisma.InputJsonValue },
    });

    await logAdminActivity(session, {
      action: "UPDATE",
      entityType: "page",
      entityId: record.id,
      entityLabel: "Home Page",
      summary: "Updated home page CMS content",
    });

    revalidateHomePage();

    return NextResponse.json({ ok: true, data: parseHomePageData(record.data) });
  } catch (err) {
    console.error("Failed to save home page", err);
    return NextResponse.json(
      { error: "Could not save home page. Please try again." },
      { status: 500 }
    );
  }
}
