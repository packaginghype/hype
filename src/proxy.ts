import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "ph_admin_session";

const SUPER_ADMIN_PREFIXES = [
  "/admin/users",
  "/admin/activity-logs",
  "/admin/quotes",
];

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

async function readSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = getSecret();
  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub) return null;
    // null role = older cookie; page-level DB check still enforces access
    const role =
      payload.role === "SUPER_ADMIN"
        ? "SUPER_ADMIN"
        : payload.role === "STAFF"
          ? "STAFF"
          : null;
    return { role };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  // 1. Enforce non-www URL across the entire site (301 Permanent Redirect)
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host;

  if (host && host.toLowerCase().startsWith("www.")) {
    const nonWwwHost = host.replace(/^www\./i, "");
    const url = request.nextUrl.clone();
    url.host = nonWwwHost;
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const session = await readSession(request);

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const needsSuper = SUPER_ADMIN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (needsSuper && session.role === "STAFF") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

