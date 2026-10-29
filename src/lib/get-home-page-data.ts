import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseHomePageData, HOME_PAGE_DEFAULTS, type HomePageData } from "@/lib/home-page-schema";
import { CACHE_TAGS, CATALOG_REVALIDATE } from "@/lib/cache";

/** Fetch home page CMS data from DB. Returns defaults if not set yet. */
export const getHomePageData = unstable_cache(
  async () => {
    try {
      const record = await prisma.sitePage.findUnique({ where: { key: "home" } });
      if (!record) return HOME_PAGE_DEFAULTS;
      return parseHomePageData(record.data);
    } catch {
      return HOME_PAGE_DEFAULTS;
    }
  },
  ["home-page-cms"],
  { tags: [CACHE_TAGS.home], revalidate: CATALOG_REVALIDATE }
);
