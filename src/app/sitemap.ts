import type { MetadataRoute } from "next";
import { getSitemapEntries, getSiteUrl } from "@/lib/sitemap-data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  try {
    const entries = await getSitemapEntries();
    return entries
      .filter((entry) => entry.indexable)
      .map((entry) => ({
        url: entry.path === "/" ? siteUrl : `${siteUrl}${entry.path}`,
        lastModified: entry.lastModified || new Date(),
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
      }));
  } catch (error) {
    console.error("Sitemap generation error:", error);
    const now = new Date();
    return [
      { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
      {
        url: `${siteUrl}/product`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${siteUrl}/blog`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${siteUrl}/sitemap`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.4,
      },
    ];
  }
}
