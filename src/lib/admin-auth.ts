import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { AdminRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const ADMIN_COOKIE = "ph_admin_session";
const SESSION_TTL = "7d";

export type AdminSession = {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
};

export function isSuperAdmin(session: AdminSession | null | undefined) {
  return session?.role === "SUPER_ADMIN";
}

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set (min 16 chars)");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAdminSessionToken(admin: AdminSession) {
  return new SignJWT({
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.sub)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecret());
}

export async function verifyAdminSessionToken(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    const roleFromToken =
      payload.role === "SUPER_ADMIN" || payload.role === "STAFF"
        ? (payload.role as AdminRole)
        : null;

    // Prefer live DB role so access changes apply without waiting for cookie expiry
    const dbAdmin = await prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: { role: true, isActive: true, name: true, email: true },
    });

    if (!dbAdmin || !dbAdmin.isActive) return null;

    return {
      sub: payload.sub,
      email: dbAdmin.email,
      name: dbAdmin.name,
      role: dbAdmin.role || roleFromToken || "STAFF",
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdminSession();
  if (!isSuperAdmin(session)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!admin || !admin.isActive) return null;

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return null;

  return {
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  } satisfies AdminSession;
}
