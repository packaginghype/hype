import { prisma } from "@/lib/prisma";
import { parseHomePageData, HOME_PAGE_DEFAULTS, type HomePageData } from "@/lib/home-page-schema";

/** Fetch home page CMS data from DB. Returns defaults if not set yet. */
export async function getHomePageData(): Promise<HomePageData> {
  try {
    const record = await prisma.sitePage.findUnique({ where: { key: "home" } });
    if (!record) return HOME_PAGE_DEFAULTS;
    return parseHomePageData(record.data);
  } catch {
    return HOME_PAGE_DEFAULTS;
  }
}
