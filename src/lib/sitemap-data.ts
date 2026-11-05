import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CACHE_TAGS } from "@/lib/cache-tags";

export type SitemapSection =
  | "main"
  | "pages"
  | "categories"
  | "industries"
  | "materials"
  | "shapes"
  | "products"
  | "blogs";

export type SitemapEntry = {
  path: string;
  label: string;
  section: SitemapSection;
  lastModified?: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  /** false when SEO is turned off for that record */
  indexable: boolean;
};

function toDate(value?: Date | string | null): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://packaginghype.com";
  return raw.replace(/^https?:\/\/www\./i, "https://").replace(/\/$/, "");
}

/**
 * Public URLs that actually return 200.
 * Redirect aliases such as /products, /category/[slug], and /industry/[slug] are omitted.
 * HTML sitemap uses every entry. XML sitemap keeps indexable entries only.
 */
async function loadSitemapEntries(): Promise<SitemapEntry[]> {
  const [categories, products, blogs, customPages] = await Promise.all([
    prisma.category.findMany({
      where: { isPublished: true },
      select: {
        name: true,
        slug: true,
        group: true,
        seoEnabled: true,
        updatedAt: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: {
        name: true,
        slug: true,
        seoEnabled: true,
        updatedAt: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { title: true, slug: true, updatedAt: true },
      orderBy: { publishedDate: "desc" },
    }),
    prisma.customPage.findMany({
      where: { published: true },
      select: { title: true, slug: true, updatedAt: true },
      orderBy: [{ menuOrder: "asc" }, { title: "asc" }],
    }),
  ]);

  const now = new Date();
  const entries: SitemapEntry[] = [];
  const seen = new Set<string>();

  const push = (entry: SitemapEntry) => {
    if (!entry.path || seen.has(entry.path)) return;
    seen.add(entry.path);
    entries.push(entry);
  };

  const main: SitemapEntry[] = [
    {
      path: "/",
      label: "Home",
      section: "main",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      indexable: true,
    },
    {
      path: "/product",
      label: "All Products",
      section: "main",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      indexable: true,
    },
    {
      path: "/categories",
      label: "All Categories",
      section: "main",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      indexable: true,
    },
    {
      path: "/industries",
      label: "Industries",
      section: "main",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      indexable: true,
    },
    {
      path: "/box-by-material",
      label: "Box by Material",
      section: "main",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      indexable: true,
    },
    {
      path: "/shapes-styles",
      label: "Shapes & Styles",
      section: "main",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      indexable: true,
    },
    {
      path: "/blog",
      label: "Blog",
      section: "main",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      indexable: true,
    },
    {
      path: "/quote",
      label: "Get a Quote",
      section: "main",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      indexable: true,
    },
    {
      path: "/about-us",
      label: "About Us",
      section: "main",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      indexable: true,
    },
    {
      path: "/contact-us",
      label: "Contact Us",
      section: "main",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      indexable: true,
    },
    {
      path: "/sitemap",
      label: "Sitemap",
      section: "main",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
      indexable: true,
    },
  ];
  main.forEach(push);

  const policies: SitemapEntry[] = [
    {
      path: "/privacy-policy",
      label: "Privacy Policy",
      section: "pages",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
      indexable: true,
    },
    {
      path: "/terms-and-conditions",
      label: "Terms & Conditions",
      section: "pages",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
      indexable: true,
    },
    {
      path: "/shipping-delivery-policy",
      label: "Shipping & Delivery",
      section: "pages",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
      indexable: true,
    },
    {
      path: "/refund-return-policy",
      label: "Refund & Return Policy",
      section: "pages",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
      indexable: true,
    },
  ];
  policies.forEach(push);

  for (const page of customPages) {
    if (!page.slug) continue;
    push({
      path: `/${page.slug}`,
      label: page.title || page.slug,
      section: "pages",
      lastModified: toDate(page.updatedAt) || now,
      changeFrequency: "monthly",
      priority: 0.5,
      indexable: true,
    });
  }

  for (const category of categories) {
    if (!category.slug) continue;
    const section: SitemapSection =
      category.group === "industries"
        ? "industries"
        : category.group === "materials"
          ? "materials"
          : category.group === "shapes"
            ? "shapes"
            : "categories";
    push({
      path: `/${category.slug}`,
      label: category.name || category.slug,
      section,
      lastModified: toDate(category.updatedAt) || now,
      changeFrequency: "weekly",
      priority: 0.8,
      indexable: category.seoEnabled !== false,
    });
  }

  for (const product of products) {
    if (!product.slug) continue;
    push({
      path: `/product/${product.slug}`,
      label: product.name || product.slug,
      section: "products",
      lastModified: toDate(product.updatedAt) || now,
      changeFrequency: "weekly",
      priority: 0.8,
      indexable: product.seoEnabled !== false,
    });
  }

  for (const post of blogs) {
    if (!post.slug) continue;
    push({
      path: `/blog/${post.slug}`,
      label: post.title || post.slug,
      section: "blogs",
      lastModified: toDate(post.updatedAt) || now,
      changeFrequency: "weekly",
      priority: 0.7,
      indexable: true,
    });
  }

  return entries;
}

export const getSitemapEntries = unstable_cache(
  loadSitemapEntries,
  ["sitemap-page-entries"],
  {
    revalidate: 3600,
    tags: [
      CACHE_TAGS.sitemap,
      CACHE_TAGS.categories,
      CACHE_TAGS.products,
      CACHE_TAGS.blogs,
      CACHE_TAGS.pages,
    ],
  }
);
