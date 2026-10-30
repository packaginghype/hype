import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaUrl: string | undefined;
};

/**
 * Vercel/serverless needs Supabase *transaction* pooler (:6543) + tiny Prisma pools.
 * Session mode (:5432) caps at pool_size (~15) and throws EMAXCONNSESSION under load.
 */
function resolveDatabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const onVercel = process.env.VERCEL === "1";
    const isProd = onVercel || process.env.NODE_ENV === "production";

    // Safety net if Vercel still has session-mode URL
    if (
      onVercel &&
      url.hostname.includes("pooler.supabase.com") &&
      url.port === "5432"
    ) {
      url.port = "6543";
    }

    if (url.port === "6543") {
      url.searchParams.set("pgbouncer", "true");
    }

    // One connection per serverless isolate; adequate pool locally
    url.searchParams.set("connection_limit", isProd ? "1" : "10");

    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "60");
    }
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "60");
    }

    return url.toString();
  } catch {
    return raw;
  }
}

const databaseUrl = resolveDatabaseUrl(process.env.DATABASE_URL);

if (
  globalForPrisma.prisma &&
  globalForPrisma.prismaUrl &&
  globalForPrisma.prismaUrl !== databaseUrl
) {
  void globalForPrisma.prisma.$disconnect();
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl
      ? {
          db: {
            url: databaseUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

// Reuse across hot reloads (dev) and warm serverless instances (prod)
globalForPrisma.prisma = prisma;
globalForPrisma.prismaUrl = databaseUrl;
