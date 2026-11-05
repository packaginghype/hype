/** Cache tag names + TTL — safe to import from any Server Component / data lib. */

export const CACHE_TAGS = {
  nav: "nav",
  categories: "categories",
  products: "products",
  blogs: "blogs",
  pages: "pages",
  sitemap: "sitemap",
  home: "home",
  settings: "settings",
} as const;

/** Seconds — public catalog ISR / data cache window */
export const CATALOG_REVALIDATE = 120;
