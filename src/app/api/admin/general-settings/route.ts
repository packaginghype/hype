import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/admin-activity";
import { revalidateGeneralSettings } from "@/lib/cache";
import { getGeneralSettings } from "@/lib/general-settings";
import {
  DEFAULT_GENERAL_SETTINGS,
  generalSettingsSchema,
} from "@/lib/general-settings-schema";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getGeneralSettings();
  return NextResponse.json({ data: settings });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = generalSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const dataToSave = {
    siteName: parsed.data.siteName || DEFAULT_GENERAL_SETTINGS.siteName,
    logoUrl: parsed.data.logoUrl || DEFAULT_GENERAL_SETTINGS.logoUrl,
    logoAlt: parsed.data.logoAlt || DEFAULT_GENERAL_SETTINGS.logoAlt,
    faviconUrl: parsed.data.faviconUrl || DEFAULT_GENERAL_SETTINGS.faviconUrl,
  };

  const record = await prisma.sitePage.upsert({
    where: { key: "general-settings" },
    create: {
      key: "general-settings",
      data: dataToSave as Prisma.InputJsonValue,
    },
    update: {
      data: dataToSave as Prisma.InputJsonValue,
    },
  });

  await logAdminActivity(session, {
    action: "UPDATE",
    entityType: "page",
    entityId: record.id,
    entityLabel: "General Settings",
    summary: `${session.name} updated logo, favicon, and general settings`,
  });

  revalidateGeneralSettings();

  return NextResponse.json({
    data: dataToSave,
    message: "Settings saved successfully",
  });
}
