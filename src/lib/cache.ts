import { revalidatePath, revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  nav: "nav",
  categories: "categories",
  products: "products",
  blogs: "blogs",
  sitemap: "sitemap",
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
  revalidatePath("/products");
  revalidatePath("/industries");
  revalidatePath("/box-by-material");
  revalidatePath("/shapes-styles");
}

export function revalidateBlogs() {
  expireTag(CACHE_TAGS.blogs);
  expireTag(CACHE_TAGS.sitemap);
  revalidatePath("/blog");
  revalidatePath("/", "layout");
}
