import { unstable_cache } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS, CATALOG_REVALIDATE } from "@/lib/cache-tags";
import { pageLayoutSchema } from "@/lib/page-layout";
import { pageWidgetsSchema } from "@/lib/page-widgets";
import { STATIC_PAGES } from "@/lib/static-pages";

export type CustomPageMenuLink = {
  label: string;
  href: string;
  slug: string;
};

/** Slugs that must never be claimed by a custom page. */
export const RESERVED_PAGE_SLUGS = new Set([
  ...STATIC_PAGES.map((p) => p.key),
  "admin",
  "api",
  "blog",
  "blogs",
  "box-by-material",
  "cart",
  "categories",
  "category",
  "checkout",
  "contact-us",
  "favicon.ico",
  "industries",
  "industry",
  "login",
  "material",
  "media",
  "page",
  "privacy-policy",
  "product",
  "products",
  "quote",
  "refund-return-policy",
  "search",
  "shapes-styles",
  "shipping-delivery-policy",
  "sitemap",
  "sitemap.xml",
  "terms-and-conditions",
  "thank-you",
  "_next",
]);

export function slugifyPageTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const customPageSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  menuLabel: z.string().trim().max(80).optional().nullable(),
  showInHeader: z.boolean().optional().default(false),
  showInFooter: z.boolean().optional().default(false),
  menuOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
  published: z.boolean().optional().default(true),
  eyebrow: z.string().trim().max(120).optional().nullable(),
  heading: z.string().trim().max(200).optional().nullable(),
  intro: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  sections: pageWidgetsSchema.optional().default([]),
  layout: pageLayoutSchema.optional(),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  seoCanonical: z.string().trim().max(500).optional().nullable(),
});

export type CustomPageInput = z.infer<typeof customPageSchema>;

export async function assertCustomPageSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<string | null> {
  if (RESERVED_PAGE_SLUGS.has(slug)) {
    return `"${slug}" is reserved by the site. Choose another slug.`;
  }

  const [pageClash, categoryClash, blogClash, productClash] = await Promise.all([
    prisma.customPage.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    }),
    prisma.category.findFirst({
      where: { slug },
      select: { id: true },
    }),
    prisma.blogPost.findFirst({
      where: { slug },
      select: { id: true },
    }),
    prisma.product.findFirst({
      where: { slug },
      select: { id: true },
    }),
  ]);

  if (pageClash) return "Another custom page already uses this slug.";
  if (categoryClash) return "A category or industry already uses this slug.";
  if (blogClash) return "A blog post already uses this slug.";
  if (productClash) return "A product already uses this slug.";
  return null;
}

export async function getCustomPageBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.customPage.findFirst({
        where: { slug, published: true },
      }),
    ["custom-page", slug],
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.pages, `page-${slug}`] }
  )();
}

export async function listCustomPagesAdmin() {
  return prisma.customPage.findMany({
    orderBy: [{ menuOrder: "asc" }, { title: "asc" }],
  });
}

export async function getHeaderCustomPageLinks(): Promise<CustomPageMenuLink[]> {
  return unstable_cache(
    async () => {
      const pages = await prisma.customPage.findMany({
        where: { published: true, showInHeader: true },
        orderBy: [{ menuOrder: "asc" }, { title: "asc" }],
        select: { title: true, slug: true, menuLabel: true },
      });
      return pages.map((p) => ({
        label: p.menuLabel?.trim() || p.title,
        href: `/${p.slug}`,
        slug: p.slug,
      }));
    },
    ["custom-page-header-links"],
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.pages, CACHE_TAGS.nav] }
  )();
}

export async function getFooterCustomPageLinks(): Promise<CustomPageMenuLink[]> {
  return unstable_cache(
    async () => {
      const pages = await prisma.customPage.findMany({
        where: { published: true, showInFooter: true },
        orderBy: [{ menuOrder: "asc" }, { title: "asc" }],
        select: { title: true, slug: true, menuLabel: true },
      });
      return pages.map((p) => ({
        label: p.menuLabel?.trim() || p.title,
        href: `/${p.slug}`,
        slug: p.slug,
      }));
    },
    ["custom-page-footer-links"],
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.pages, CACHE_TAGS.nav] }
  )();
}
