import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { CategoryGroupKey } from "@/data/category-groups";
import type { CategoryItem, ProductItem } from "@/types";

export type { CategoryGroupKey } from "@/data/category-groups";

const MATERIAL_SLUGS = [
  "kraft-boxes",
  "corrugated-boxes",
  "rigid-boxes",
  "mailer-boxes",
  "mylar-bags",
  "display-boxes",
] as const;

const SHAPE_SLUGS = [
  "mailer-boxes",
  "rigid-boxes",
  "gift-boxes",
  "treat-boxes",
  "display-boxes",
  "vape-boxes",
  "bottle-boxes",
  "apparel-boxes",
] as const;

const MATERIAL_SLUG_SET = new Set<string>(MATERIAL_SLUGS);
const SHAPE_SLUG_SET = new Set<string>(SHAPE_SLUGS);

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
      product.fullDescription ||
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

function toCategoryItem(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count?: { products: number };
}): CategoryItem {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description:
      category.description ||
      `Custom ${category.name} manufactured with premium materials and printing.`,
    imageUrl: category.imageUrl || undefined,
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

export async function getAllCategories(): Promise<CategoryItem[]> {
  noStore();
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return categories.map(toCategoryItem);
}

async function getCategoriesWithImages(): Promise<CategoryItem[]> {
  noStore();
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { products: true } },
      products: {
        take: 1,
        include: {
          product: {
            include: {
              images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  return categories.map((category) => {
    const item = toCategoryItem(category);
    if (!item.imageUrl) {
      item.imageUrl = category.products[0]?.product.images[0]?.imageUrl || undefined;
    }
    return item;
  });
}

export async function getNavCategories() {
  noStore();
  const categories = await getCategoriesWithImages();
  return {
    industries: categories.filter((c) => !MATERIAL_SLUG_SET.has(c.slug)),
    materials: categories.filter((c) => MATERIAL_SLUG_SET.has(c.slug)),
    all: categories,
  };
}

export async function getCategoriesByGroup(
  group: CategoryGroupKey
): Promise<CategoryItem[]> {
  noStore();
  const categories = await getCategoriesWithImages();

  if (group === "materials") {
    const bySlug = new Map(categories.map((c) => [c.slug, c]));
    return MATERIAL_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean) as CategoryItem[];
  }

  if (group === "shapes") {
    const bySlug = new Map(categories.map((c) => [c.slug, c]));
    const ordered = SHAPE_SLUGS.map((slug) => bySlug.get(slug)).filter(
      Boolean
    ) as CategoryItem[];
    // Fill with remaining non-material categories if needed
    for (const cat of categories) {
      if (ordered.length >= 12) break;
      if (!SHAPE_SLUG_SET.has(cat.slug) && !MATERIAL_SLUG_SET.has(cat.slug)) {
        if (!ordered.some((c) => c.id === cat.id)) ordered.push(cat);
      }
    }
    return ordered;
  }

  // industries: everything not purely material-focused, prefer non-material
  return categories.filter((c) => !MATERIAL_SLUG_SET.has(c.slug));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  noStore();
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });
  return category ? toCategoryItem(category) : null;
}

export async function getPublishedProductCount() {
  noStore();
  return prisma.product.count({ where: { isPublished: true } });
}

export async function getAllProducts(options?: {
  categorySlug?: string;
  query?: string;
  limit?: number;
}): Promise<ProductItem[]> {
  noStore();
  const q = options?.query?.trim();
  const products = await prisma.product.findMany({
    where: {
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
              { name: { contains: q, mode: "insensitive" } },
              { shortDescription: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: options?.limit,
    include: productInclude,
  });

  return products.map(toProductItem);
}

export async function getFeaturedProducts(limit = 6): Promise<ProductItem[]> {
  return getAllProducts({ limit });
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  noStore();
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
    },
  });

  return product ? toProductItem(product) : null;
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 8
): Promise<ProductItem[]> {
  noStore();
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
}

export async function getIndustryShowcaseCategories(limit = 10): Promise<CategoryItem[]> {
  noStore();
  const preferred = [
    "cosmetic-boxes",
    "bottle-boxes",
    "food-boxes",
    "kraft-boxes",
    "corrugated-boxes",
    "candle-boxes",
    "soap-boxes",
    "cbd-boxes",
    "apparel-boxes",
    "gift-boxes",
  ];

  const categories = await prisma.category.findMany({
    where: { slug: { in: preferred } },
    include: {
      _count: { select: { products: true } },
      products: {
        take: 1,
        include: {
          product: {
            include: {
              images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const mapped = categories.map((category) => {
    const item = toCategoryItem(category);
    if (!item.imageUrl) {
      item.imageUrl = category.products[0]?.product.images[0]?.imageUrl || undefined;
    }
    return item;
  });

  const bySlug = new Map(mapped.map((c) => [c.slug, c]));
  const ordered = preferred.map((slug) => bySlug.get(slug)).filter(Boolean) as CategoryItem[];

  if (ordered.length >= limit) return ordered.slice(0, limit);

  const extras = await getAllCategories();
  for (const cat of extras) {
    if (ordered.length >= limit) break;
    if (!ordered.some((c) => c.id === cat.id)) ordered.push(cat);
  }
  return ordered.slice(0, limit);
}

export async function getSitemapEntries() {
  noStore();
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);
  return { categories, products };
}
