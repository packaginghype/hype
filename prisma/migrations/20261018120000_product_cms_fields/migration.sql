-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "originalPrice" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "discountedPrice" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "inStock" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "materialCategoryId" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "breadcrumbCategoryId" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "thumbnailAlt" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "thumbnailTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "thumbnailSubDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "videoThumbnailUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "videoDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "detailHeading" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "detailShortDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "specsHeading" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "specsDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "specsTableHeading" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "widgetsContent" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "relevantProductsHeading" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "relevantProductsDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "pageScrollEnabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "pageScrollImageUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "pageScrollImageAlt" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "pageScrollImageTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "pageScrollContent" TEXT;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProductSpec" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProductRelated" (
    "productId" TEXT NOT NULL,
    "relatedProductId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductRelated_pkey" PRIMARY KEY ("productId","relatedProductId")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProductSpec_productId_idx" ON "ProductSpec"("productId");
CREATE INDEX IF NOT EXISTS "ProductRelated_relatedProductId_idx" ON "ProductRelated"("relatedProductId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "ProductSpec" ADD CONSTRAINT "ProductSpec_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ProductRelated" ADD CONSTRAINT "ProductRelated_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ProductRelated" ADD CONSTRAINT "ProductRelated_relatedProductId_fkey"
    FOREIGN KEY ("relatedProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
