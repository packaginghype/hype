import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

export { CACHE_TAGS, CATALOG_REVALIDATE } from "@/lib/cache-tags";

function expireTag(tag: string) {
  // Next 16: second arg required — expire immediately after admin writes
  revalidateTag(tag, { expire: 0 });
}

export function revalidateSitemaps() {
  expireTag(CACHE_TAGS.sitemap);
  revalidatePath("/sitemap");
  revalidatePath("/sitemap.xml");
}

export function revalidateCatalog(slug?: string) {
  expireTag(CACHE_TAGS.nav);
  expireTag(CACHE_TAGS.categories);
  expireTag(CACHE_TAGS.products);
  revalidateSitemaps();
  if (slug) {
    expireTag(`category-${slug}`);
    expireTag(`product-${slug}`);
    revalidatePath(`/${slug}`, "page");
    revalidatePath(`/${slug}`);
  }
  revalidatePath("/", "layout");
  revalidatePath("/[slug]", "page");
  revalidatePath("/[slug]");
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
  revalidateSitemaps();
  revalidatePath("/blog");
  revalidatePath("/", "layout");
}

export function revalidateHomePage() {
  expireTag(CACHE_TAGS.home);
  revalidateSitemaps();
  revalidatePath("/", "layout");
  revalidatePath("/");
}

export function revalidateGeneralSettings() {
  expireTag(CACHE_TAGS.settings);
  revalidatePath("/", "layout");
}

export function revalidateCustomPages(slug?: string) {
  expireTag(CACHE_TAGS.pages);
  expireTag(CACHE_TAGS.nav);
  revalidateSitemaps();
  revalidatePath("/", "layout");
  revalidatePath("/[slug]", "page");
  revalidatePath("/[slug]");
  if (slug) {
    expireTag(`page-${slug}`);
    revalidatePath(`/${slug}`, "page");
    revalidatePath(`/${slug}`);
  }
}
