/**
 * Import categories + products from live packaginghype.com WordPress/WooCommerce APIs.
 *
 * Usage (after DB is migrated & seeded):
 *   npx tsx scripts/import-wp-catalog.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const WP_BASE = "https://packaginghype.com";

type WpCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  image?: { src?: string } | null;
};

type WcProduct = {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  sku?: string;
  images?: { src: string; alt?: string }[];
  categories?: { id: number; name: string; slug: string }[];
  permalink?: string;
};

function stripHtml(html = "") {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "PackagingHypeImporter/1.0" },
  });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}

async function importCategories() {
  const categories = await fetchJson<WpCategory[]>(
    `${WP_BASE}/wp-json/wp/v2/product_cat?per_page=100&hide_empty=false`
  );

  let count = 0;
  for (const [index, cat] of categories.entries()) {
    if (!cat.slug || cat.slug === "uncategorized") continue;

    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name.replace(/^Custom\s+/i, "").trim() || cat.name,
        description: stripHtml(cat.description || "") || null,
        imageUrl: cat.image?.src || null,
        sortOrder: index,
      },
      create: {
        name: cat.name.replace(/^Custom\s+/i, "").trim() || cat.name,
        slug: cat.slug,
        description: stripHtml(cat.description || "") || null,
        imageUrl: cat.image?.src || null,
        sortOrder: index,
      },
    });
    count += 1;
  }

  console.log(`Categories upserted: ${count}`);
}

async function importProducts() {
  const pageSize = 50;
  let page = 1;
  let imported = 0;

  const categoryBySlug = new Map(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  while (true) {
    const products = await fetchJson<WcProduct[]>(
      `${WP_BASE}/wp-json/wc/store/v1/products?per_page=${pageSize}&page=${page}`
    );
    if (!products.length) break;

    for (const product of products) {
      if (!product.slug) continue;

      const categoryIds = (product.categories || [])
        .map((c) => categoryBySlug.get(c.slug))
        .filter((id): id is string => Boolean(id));

      const existing = await prisma.product.findFirst({
        where: { OR: [{ wpId: product.id }, { slug: product.slug }] },
      });

      const baseData = {
        wpId: product.id,
        name: product.name,
        slug: product.slug,
        shortDescription: stripHtml(product.short_description || "") || null,
        fullDescription: stripHtml(product.description || "") || null,
        sku: product.sku || null,
        isPublished: true,
        minQuantity: 100,
        leadTimeDays: "8-10 Business Days",
      };

      const saved = existing
        ? await prisma.product.update({
            where: { id: existing.id },
            data: baseData,
          })
        : await prisma.product.create({ data: baseData });

      await prisma.productCategory.deleteMany({ where: { productId: saved.id } });
      if (categoryIds.length) {
        await prisma.productCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            productId: saved.id,
            categoryId,
          })),
          skipDuplicates: true,
        });
      }

      const primary = product.images?.[0];
      if (primary?.src) {
        const existingImage = await prisma.productImage.findFirst({
          where: { productId: saved.id, isPrimary: true },
        });
        if (existingImage) {
          await prisma.productImage.update({
            where: { id: existingImage.id },
            data: {
              imageUrl: primary.src,
              altText: primary.alt || product.name,
            },
          });
        } else {
          await prisma.productImage.create({
            data: {
              productId: saved.id,
              imageUrl: primary.src,
              altText: primary.alt || product.name,
              isPrimary: true,
              sortOrder: 0,
            },
          });
        }
      }

      imported += 1;
    }

    console.log(`Products page ${page}: +${products.length} (total ${imported})`);
    if (products.length < pageSize) break;
    page += 1;
  }

  console.log(`Products upserted: ${imported}`);
}

async function main() {
  console.log("Importing from", WP_BASE);
  await importCategories();
  await importProducts();
  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
