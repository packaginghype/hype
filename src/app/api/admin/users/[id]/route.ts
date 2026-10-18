import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  getAdminSession,
  hashPassword,
  isSuperAdmin,
} from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/admin-activity";

type Params = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["SUPER_ADMIN", "STAFF"]).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

export async function PUT(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Prevent locking yourself out of the last super admin role
  if (
    existing.id === session.sub &&
    parsed.data.role === "STAFF"
  ) {
    return NextResponse.json(
      { error: "You cannot demote your own account" },
      { status: 400 }
    );
  }

  if (
    existing.id === session.sub &&
    parsed.data.isActive === false
  ) {
    return NextResponse.json(
      { error: "You cannot deactivate your own account" },
      { status: 400 }
    );
  }

  const data: {
    name?: string;
    role?: "SUPER_ADMIN" | "STAFF";
    isActive?: boolean;
    passwordHash?: string;
  } = {};

  if (parsed.data.name) data.name = parsed.data.name.trim();
  if (parsed.data.role) data.role = parsed.data.role;
  if (typeof parsed.data.isActive === "boolean") {
    data.isActive = parsed.data.isActive;
  }
  if (parsed.data.password) {
    data.passwordHash = await hashPassword(parsed.data.password);
  }

  const user = await prisma.adminUser.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  await logAdminActivity(session, {
    action: "UPDATE",
    entityType: "admin_user",
    entityId: user.id,
    entityLabel: user.email,
    summary: `${session.name} updated account ${user.name} (${user.email})`,
    meta: parsed.data,
  });

  return NextResponse.json({ user });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.sub) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.adminUser.delete({ where: { id } });

  await logAdminActivity(session, {
    action: "DELETE",
    entityType: "admin_user",
    entityId: existing.id,
    entityLabel: existing.email,
    summary: `${session.name} deleted account ${existing.name} (${existing.email})`,
  });

  return NextResponse.json({ ok: true });
}
