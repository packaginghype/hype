import { revalidatePath, revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  nav: "nav",
  categories: "categories",
  products: "products",
  blogs: "blogs",
  sitemap: "sitemap",
  home: "home",
} as const;

/** Seconds — public catalog ISR / data cache window */
export const CATALOG_REVALIDATE = 120;

function expireTag(tag: string) {
  // Next 16: second arg required — expire immediately after admin writes
  revalidateTag(tag, { expire: 0 });
}

export function revalidateCatalog() {
  expireTag(CACHE_TAGS.nav);
  expireTag(CACHE_TAGS.categories);
  expireTag(CACHE_TAGS.products);
  expireTag(CACHE_TAGS.sitemap);
  revalidatePath("/", "layout");
  revalidatePath("/categories");
  revalidatePath("/category");
  revalidatePath("/products");
  revalidatePath("/product");
  revalidatePath("/product/[slug]", "page");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/categories/[slug]", "page");
  revalidatePath("/industries");
  revalidatePath("/industry");
  revalidatePath("/industry/[slug]", "page");
  revalidatePath("/industries/[slug]", "page");
  revalidatePath("/box-by-material");
  revalidatePath("/box-by-material/[slug]", "page");
  revalidatePath("/shapes-styles");
  revalidatePath("/shapes-styles/[slug]", "page");
}

export function revalidateBlogs() {
  expireTag(CACHE_TAGS.blogs);
  expireTag(CACHE_TAGS.sitemap);
  revalidatePath("/blog");
  revalidatePath("/", "layout");
}

export function revalidateHomePage() {
  expireTag(CACHE_TAGS.home);
  expireTag(CACHE_TAGS.sitemap);
  revalidatePath("/", "layout");
  revalidatePath("/");
}
