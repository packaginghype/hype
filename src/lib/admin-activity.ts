import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AdminSession } from "@/lib/admin-auth";

export type ActivityInput = {
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "STATUS";
  entityType:
    | "product"
    | "category"
    | "blog"
    | "admin_user"
    | "quote"
    | "upload"
    | "session"
    | "page"
    | "review";
  entityId?: string | null;
  entityLabel?: string | null;
  summary: string;
  meta?: Record<string, unknown> | null;
};

export async function logAdminActivity(
  session: AdminSession | null | undefined,
  input: ActivityInput
) {
  try {
    await prisma.activityLog.create({
      data: {
        actorId: session?.sub || null,
        actorName: session?.name || "System",
        actorEmail: session?.email || "system",
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId || null,
        entityLabel: input.entityLabel || null,
        summary: input.summary,
        meta: (input.meta ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    console.error("Failed to write activity log:", error);
  }
}
