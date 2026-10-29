import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/html";
import { CACHE_TAGS, CATALOG_REVALIDATE } from "@/lib/cache";
import type { CategoryGroupKey } from "@/data/category-groups";
import type { CategoryItem, ProductItem, RelatedBlogItem } from "@/types";

export type { CategoryGroupKey } from "@/data/category-groups";

function toProductItem(
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    fullDescription: string | null;
    startingPrice: { toNumber(): number } | number | null;
    minQuantity: number;
    leadTimeDays: string | null;
    materialsAvailable: string[];
    finishesAvailable: string[];
    images: { imageUrl: string }[];
    categories: {
      category: { name: string; slug: string };
    }[];
  }
): ProductItem {
  const primaryCategory = product.categories[0]?.category;
  const price =
    product.startingPrice == null
      ? null
      : typeof product.startingPrice === "number"
        ? product.startingPrice
        : product.startingPrice.toNumber();

  const imageUrls = product.images.map((img) => img.imageUrl).filter(Boolean);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categorySlug: primaryCategory?.slug || "custom-packaging",
    categoryName: primaryCategory?.name || "Custom Packaging",
    description:
      product.shortDescription ||
      stripHtml(product.fullDescription || "") ||
      `${product.name} custom packaging manufactured by Packaging Hype.`,
    fullDescription: product.fullDescription || undefined,
    imageUrl: imageUrls[0] || "",
    imageUrls,
    startingPrice: price,
    minQuantity: product.minQuantity,
    leadTime: product.leadTimeDays || "8-10 Business Days",
    materials: product.materialsAvailable,
    finishes: product.finishesAvailable,
  };
}

export function getCategoryHref(category: { slug: string; group?: string }): string {
  if (category.group === "industries") {
    return `/industry/${category.slug}`;
  }
  if (category.group === "materials") {
    return `/box-by-material/${category.slug}`;
  }
  if (category.group === "shapes") {
    return `/shapes-styles/${category.slug}`;
  }
  return `/category/${category.slug}`;
}

function toCategoryItem(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  group?: string;
  _count?: { products: number };
}): CategoryItem {
  const plainDescription =
    stripHtml(category.description || "") ||
    `Custom ${category.name} manufactured with premium materials and printing.`;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: plainDescription,
    imageUrl: category.imageUrl || undefined,
    group: (category.group as CategoryGroupKey) || undefined,
    productCount: category._count?.products,
  };
}

const productInclude = {
  images: {
    orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }],
    take: 1,
  },
  categories: {
    include: { category: true },
    take: 1,
  },
};

const categoryImageInclude = {
  _count: { select: { products: true } },
  products: {
    take: 1,
    include: {
      product: {
        include: {
          images: {
            orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }],
            take: 1,
          },
        },
      },
    },
  },
};

function mapCategoryWithFallbackImage(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count?: { products: number };
  products?: {
    product: { images: { imageUrl: string }[] };
  }[];
}): CategoryItem {
  const item = toCategoryItem(category);
  if (!item.imageUrl) {
    item.imageUrl = category.products?.[0]?.product.images[0]?.imageUrl || undefined;
  }
  return item;
}

export const getAllCategories = unstable_cache(
  async (): Promise<CategoryItem[]> => {
    const categories = await prisma.category.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });
    return categories.map(toCategoryItem);
  },
  ["all-categories"],
  { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.categories] }
);

async function fetchCategoriesWithImages(
  group?: CategoryGroupKey
): Promise<CategoryItem[]> {
  const categories = await prisma.category.findMany({
    where: {
      isPublished: true,
      ...(group ? { group } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: categoryImageInclude,
  });

  return categories.map(mapCategoryWithFallbackImage);
}

/** Lightweight nav/footer links — one query, no nested product joins */
export const getNavCategories = unstable_cache(
  async () => {
    const rows = await prisma.category.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        group: true,
      },
    });

    const toLink = (c: (typeof rows)[number]): CategoryItem => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: "",
      group: c.group as CategoryGroupKey,
    });

    const categories = rows.filter((r) => r.group === "categories").map(toLink);
    const industries = rows.filter((r) => r.group === "industries").map(toLink);
    const materials = rows.filter((r) => r.group === "materials").map(toLink);
    const shapes = rows.filter((r) => r.group === "shapes").map(toLink);

    return {
      categories,
      industries,
      materials,
      shapes,
      all: rows.map(toLink),
    };
  },
  ["nav-categories"],
  { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.nav, CACHE_TAGS.categories] }
);

export async function getCategoriesByGroup(
  group: CategoryGroupKey
): Promise<CategoryItem[]> {
  return unstable_cache(
    () => fetchCategoriesWithImages(group),
    ["categories-by-group", group],
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.categories] }
  )();
}

export const getCategoryBySlug = cache(async (slug: string): Promise<CategoryItem | null> => {
  return unstable_cache(
    async () => {
      const category = await prisma.category.findFirst({
        where: { slug, isPublished: true },
        include: {
          _count: { select: { products: true } },
          faqs: { orderBy: { sortOrder: "asc" } },
        },
      });
      if (!category) return null;

      const item = toCategoryItem(category);
      item.cms = {
        originalPrice: category.originalPrice
          ? Number(category.originalPrice)
          : null,
        discountedPrice: category.discountedPrice
          ? Number(category.discountedPrice)
          : null,
        inStock: category.inStock,
        bannerEnabled: category.bannerEnabled,
        bannerQuoteEnabled: category.bannerQuoteEnabled,
        bannerHeading: category.bannerHeading || undefined,
        bannerDescription: category.bannerDescription || undefined,
        bannerImageUrl: category.bannerImageUrl || undefined,
        bannerImageAlt: category.bannerImageAlt || undefined,
        bannerImageTitle: category.bannerImageTitle || undefined,
        imageAlt: category.imageAlt || undefined,
        imageTitle: category.imageTitle || undefined,
        widgetsContent: category.widgetsContent || undefined,
        listingHeading: category.listingHeading || undefined,
        listingText: category.listingText || undefined,
        navbarEnabled: category.navbarEnabled,
        featureEnabled: category.featureEnabled,
        pageScrollEnabled: category.pageScrollEnabled,
        pageScrollImageUrl: category.pageScrollImageUrl || undefined,
        pageScrollImageAlt: category.pageScrollImageAlt || undefined,
        pageScrollImageTitle: category.pageScrollImageTitle || undefined,
        pageScrollContent: category.pageScrollContent || undefined,
        faqsHeading: category.faqsHeading || undefined,
        faqsSubheading: category.faqsSubheading || undefined,
        faqsImageUrl: (category as { faqsImageUrl?: string | null }).faqsImageUrl || undefined,
        faqsImageAlt: (category as { faqsImageAlt?: string | null }).faqsImageAlt || undefined,
        faqs: category.faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
        seoEnabled: category.seoEnabled,
        seoTitle: category.seoTitle || undefined,
        seoKeywords: category.seoKeywords || undefined,
        seoDescription: category.seoDescription || undefined,
        seoScript: category.seoScript || undefined,
        isPublished: category.isPublished,
      };
      if (category.description) {
        item.description = category.description;
      }
      return item;
    },
    ["category-by-slug", slug],
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.categories] }
  )();
});

export const getPublishedProductCount = unstable_cache(
  async () => prisma.product.count({ where: { isPublished: true } }),
  ["published-product-count"],
  { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.products] }
);

function productListWhere(options?: { categorySlug?: string; query?: string }) {
  const q = options?.query?.trim();
  return {
    isPublished: true,
    ...(options?.categorySlug
      ? {
          categories: {
            some: { category: { slug: options.categorySlug } },
          },
        }
      : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { shortDescription: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function getAllProducts(options?: {
  categorySlug?: string;
  query?: string;
  limit?: number;
}): Promise<ProductItem[]> {
  const key = [
    "all-products",
    options?.categorySlug || "",
    options?.query?.trim() || "",
    String(options?.limit ?? ""),
  ];

  return unstable_cache(
    async () => {
      const products = await prisma.product.findMany({
        where: productListWhere(options),
        orderBy: { updatedAt: "desc" },
        take: options?.limit,
        include: productInclude,
      });
      return products.map(toProductItem);
    },
    key,
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.products] }
  )();
}

export async function getProductsPaged(options?: {
  categorySlug?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  products: ProductItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const pageSize = Math.min(48, Math.max(1, options?.pageSize ?? 16));
  const requestedPage = Math.max(1, options?.page ?? 1);
  const key = [
    "products-paged",
    options?.categorySlug || "",
    options?.query?.trim() || "",
    String(requestedPage),
    String(pageSize),
  ];

  return unstable_cache(
    async () => {
      const where = productListWhere(options);
      const total = await prisma.product.count({ where });
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const page = Math.min(requestedPage, totalPages);

      const products = await prisma.product.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: productInclude,
      });

      return {
        products: products.map(toProductItem),
        total,
        page,
        pageSize,
        totalPages,
      };
    },
    key,
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.products] }
  )();
}

export async function getFeaturedProducts(limit = 6): Promise<ProductItem[]> {
  return getAllProducts({ limit });
}

export async function getProductsByIds(ids: string[]): Promise<ProductItem[]> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return [];

  return unstable_cache(
    async () => {
      const products = await prisma.product.findMany({
        where: { id: { in: unique }, isPublished: true },
        include: productInclude,
      });
      const byId = new Map(products.map((p) => [p.id, toProductItem(p)]));
      return unique.map((id) => byId.get(id)).filter(Boolean) as ProductItem[];
    },
    [`products-by-ids-${unique.join(",")}`],
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.products] }
  )();
}

export const getProductBySlug = cache(async (slug: string): Promise<ProductItem | null> => {
  return unstable_cache(
    async () => {
      const product = await prisma.product.findFirst({
        where: { slug, isPublished: true },
        include: {
          images: {
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
            take: 20,
          },
          categories: {
            include: { category: true },
          },
          specs: { orderBy: { sortOrder: "asc" } },
          faqs: { orderBy: { sortOrder: "asc" } },
        },
      });
      if (!product) return null;

      const item = toProductItem(product);
      const thumb = product.thumbnailUrl || item.imageUrl;
      if (thumb) item.imageUrl = thumb;

      item.discountedPrice = product.discountedPrice
        ? Number(product.discountedPrice)
        : null;
      item.inStock = product.inStock;
      if (product.originalPrice != null) {
        item.startingPrice = Number(product.originalPrice);
      }

      const crumbIds =
        product.breadcrumbCategoryIds?.length > 0
          ? product.breadcrumbCategoryIds
          : product.breadcrumbCategoryId
            ? [product.breadcrumbCategoryId]
            : [];

      if (crumbIds.length > 0) {
        const crumbCats = await prisma.category.findMany({
          where: { id: { in: crumbIds }, isPublished: true },
          select: { id: true, name: true, slug: true, group: true },
        });
        const byId = new Map(crumbCats.map((c) => [c.id, c]));
        item.breadcrumbs = crumbIds
          .map((id) => byId.get(id))
          .filter(Boolean)
          .map((c) => ({
            label: c!.name,
            href: getCategoryHref(c!),
          }));
      }

      item.cms = {
        thumbnailAlt: product.thumbnailAlt || undefined,
        thumbnailTitle: product.thumbnailTitle || undefined,
        thumbnailSubDescription: product.thumbnailSubDescription || undefined,
        videoUrl: product.videoUrl || undefined,
        videoThumbnailUrl: product.videoThumbnailUrl || undefined,
        videoDescription: product.videoDescription || undefined,
        detailHeading: product.detailHeading || undefined,
        detailShortDescription: product.detailShortDescription || undefined,
        specsHeading: product.specsHeading || undefined,
        specsDescription: product.specsDescription || undefined,
        specsTableHeading: product.specsTableHeading || undefined,
        specs: product.specs.map((s) => ({
          heading: s.heading,
          details: s.details,
        })),
        widgetsContent: product.widgetsContent || undefined,
        relevantProductsHeading: product.relevantProductsHeading || undefined,
        relevantProductsDescription:
          product.relevantProductsDescription || undefined,
        relatedBlogsHeading: product.relatedBlogsHeading || undefined,
        relatedBlogsDescription: product.relatedBlogsDescription || undefined,
        relatedBlogIds: product.relatedBlogIds || [],
        pageScrollEnabled: product.pageScrollEnabled,
        pageScrollImageUrl: product.pageScrollImageUrl || undefined,
        pageScrollImageAlt: product.pageScrollImageAlt || undefined,
        pageScrollImageTitle: product.pageScrollImageTitle || undefined,
        pageScrollContent: product.pageScrollContent || undefined,
        faqsHeading: product.faqsHeading || undefined,
        faqsSubheading: product.faqsSubheading || undefined,
        faqsImageUrl: (product as { faqsImageUrl?: string | null }).faqsImageUrl || undefined,
        faqsImageAlt: (product as { faqsImageAlt?: string | null }).faqsImageAlt || undefined,
        faqs: product.faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
        merchantImageUrls: product.merchantImageUrls || [],
        navbarEnabled: product.navbarEnabled,
        featureEnabled: product.featureEnabled,
        seoEnabled: product.seoEnabled,
        seoTitle: product.seoTitle || undefined,
        seoKeywords: product.seoKeywords || undefined,
        seoDescription: product.seoDescription || undefined,
        seoScript: product.seoScript || undefined,
      };

      return item;
    },
    ["product-by-slug", slug],
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.products] }
  )();
});

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 8
): Promise<ProductItem[]> {
  return unstable_cache(
    async () => {
      const current = await prisma.product.findFirst({
        where: { slug: excludeSlug },
        select: {
          id: true,
          relatedFrom: {
            orderBy: { sortOrder: "asc" },
            take: limit,
            include: {
              relatedProduct: { include: productInclude },
            },
          },
        },
      });

      const curated = (current?.relatedFrom || [])
        .map((row) => row.relatedProduct)
        .filter((p) => p?.isPublished)
        .map(toProductItem);

      if (curated.length > 0) return curated.slice(0, limit);

      const products = await prisma.product.findMany({
        where: {
          isPublished: true,
          slug: { not: excludeSlug },
          categories: { some: { category: { slug: categorySlug } } },
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
        include: productInclude,
      });
      return products.map(toProductItem);
    },
    ["related-products", categorySlug, excludeSlug, String(limit)],
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.products] }
  )();
}

export async function getProductRelatedBlogs(
  blogIds: string[],
  limit = 4
): Promise<RelatedBlogItem[]> {
  if (!blogIds || blogIds.length === 0) return [];
  return unstable_cache(
    async () => {
      const blogs = await prisma.blogPost.findMany({
        where: {
          id: { in: blogIds },
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          thumbnailImageUrl: true,
          publishedDate: true,
          author: true,
        },
      });

      const blogMap = new Map(blogs.map((b) => [b.id, b]));
      return blogIds
        .map((id) => blogMap.get(id))
        .filter((b): b is NonNullable<typeof b> => Boolean(b))
        .slice(0, limit);
    },
    ["product-related-blogs", blogIds.join(","), String(limit)],
    { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.blogs || "blogs", CACHE_TAGS.products] }
  )();
}

export const getIndustryShowcaseCategories = unstable_cache(
  async (limit = 10): Promise<CategoryItem[]> => {
    const industries = await prisma.category.findMany({
      where: { group: "industries", isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: limit,
      include: categoryImageInclude,
    });
    return industries.map(mapCategoryWithFallbackImage);
  },
  ["industry-showcase"],
  { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.categories] }
);

export const getCategoryShowcaseCategories = unstable_cache(
  async (limit = 8): Promise<CategoryItem[]> => {
    const categories = await prisma.category.findMany({
      where: { group: "categories", isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: limit,
      include: categoryImageInclude,
    });
    return categories.map(mapCategoryWithFallbackImage);
  },
  ["category-showcase"],
  { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.categories] }
);

export const getSitemapEntries = unstable_cache(
  async () => {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        where: { isPublished: true },
        select: { slug: true, group: true, updatedAt: true },
      }),
      prisma.product.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
    return { categories, products };
  },
  ["sitemap-entries"],
  { revalidate: 3600, tags: [CACHE_TAGS.sitemap, CACHE_TAGS.categories, CACHE_TAGS.products] }
);
