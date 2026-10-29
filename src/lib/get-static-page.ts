import { prisma } from "@/lib/prisma";
import {
  getStaticPageDef,
  parseStaticPageData,
  type StaticPageData,
} from "@/lib/static-pages";

export async function getStaticPageData(
  key: string
): Promise<StaticPageData | null> {
  const def = getStaticPageDef(key);
  if (!def) return null;

  try {
    const record = await prisma.sitePage.findUnique({ where: { key } });
    if (!record) return def.defaults;
    return parseStaticPageData(record.data, def.defaults);
  } catch {
    return def.defaults;
  }
}
