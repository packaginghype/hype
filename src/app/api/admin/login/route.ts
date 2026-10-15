import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  authenticateAdmin,
  createAdminSessionToken,
} from "@/lib/admin-auth";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials payload" }, { status: 400 });
    }

    const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createAdminSessionToken(admin);
    const response = NextResponse.json({
      ok: true,
      admin: { email: admin.email, name: admin.name },
    });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
