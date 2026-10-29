import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/admin-activity";
import {
  getStaticPageDef,
  parseStaticPageData,
  staticPageSchema,
} from "@/lib/static-pages";
import {
  homePageSchema,
  parseHomePageData,
  formatHomePageZodError,
} from "@/lib/home-page-schema";
import { revalidateHomePage } from "@/lib/cache";

type Params = { params: Promise<{ key: string }> };

async function guard() {
  return getAdminSession();
}

export async function GET(_request: Request, { params }: Params) {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const def = getStaticPageDef(key);
  if (!def) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }

  const record = await prisma.sitePage.findUnique({ where: { key } });

  if (def.kind === "home") {
    return NextResponse.json({
      data: parseHomePageData(record?.data),
      path: def.path,
    });
  }

  return NextResponse.json({
    data: parseStaticPageData(record?.data, def.defaults),
    path: def.path,
    title: def.title,
  });
}

export async function PUT(request: Request, { params }: Params) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const def = getStaticPageDef(key);
  if (!def) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed =
    def.kind === "home"
      ? homePageSchema.safeParse(body)
      : staticPageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          def.kind === "home"
            ? formatHomePageZodError(parsed.error)
            : parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const record = await prisma.sitePage.upsert({
    where: { key },
    create: { key, data: parsed.data as Prisma.InputJsonValue },
    update: { data: parsed.data as Prisma.InputJsonValue },
  });

  await logAdminActivity(session, {
    action: "UPDATE",
    entityType: "page",
    entityId: record.id,
    entityLabel: def.title,
    summary: `${session.name} updated ${def.title} (${def.path})`,
  });

  if (def.kind === "home") {
    revalidateHomePage();
  } else {
    revalidatePath(def.path);
    if (def.path !== "/") revalidatePath("/");
  }

  return NextResponse.json({ ok: true, data: record.data });
}
