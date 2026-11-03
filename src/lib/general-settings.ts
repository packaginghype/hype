import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, CATALOG_REVALIDATE } from "@/lib/cache";
import {
  DEFAULT_GENERAL_SETTINGS,
  type GeneralSettings,
} from "@/lib/general-settings-schema";

export type { GeneralSettings };
export { DEFAULT_GENERAL_SETTINGS };

export const getGeneralSettings = unstable_cache(
  async (): Promise<GeneralSettings> => {
    try {
      const record = await prisma.sitePage.findUnique({
        where: { key: "general-settings" },
      });
      if (!record || !record.data || typeof record.data !== "object") {
        return DEFAULT_GENERAL_SETTINGS;
      }
      const data = record.data as Partial<GeneralSettings>;
      return {
        siteName: data.siteName?.trim() || DEFAULT_GENERAL_SETTINGS.siteName,
        logoUrl: data.logoUrl?.trim() || DEFAULT_GENERAL_SETTINGS.logoUrl,
        logoAlt: data.logoAlt?.trim() || DEFAULT_GENERAL_SETTINGS.logoAlt,
        faviconUrl:
          data.faviconUrl?.trim() || DEFAULT_GENERAL_SETTINGS.faviconUrl,
      };
    } catch {
      return DEFAULT_GENERAL_SETTINGS;
    }
  },
  ["general-settings-cache"],
  { tags: [CACHE_TAGS.settings], revalidate: CATALOG_REVALIDATE }
);
