ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "breadcrumbCategoryIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Backfill from legacy single breadcrumb field
UPDATE "Product"
SET "breadcrumbCategoryIds" = ARRAY["breadcrumbCategoryId"]
WHERE "breadcrumbCategoryId" IS NOT NULL
  AND "breadcrumbCategoryId" <> ''
  AND (cardinality("breadcrumbCategoryIds") = 0 OR "breadcrumbCategoryIds" IS NULL);
