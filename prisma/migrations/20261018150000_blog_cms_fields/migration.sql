-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "featuredEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "bannerImageUrl" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "bannerImageAlt" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "bannerImageTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "thumbnailImageUrl" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "thumbnailImageAlt" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "thumbnailImageTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "seoKeywords" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "seoScript" TEXT;

-- Backfill banner from legacy featuredImage
UPDATE "BlogPost"
SET "bannerImageUrl" = "featuredImage"
WHERE "bannerImageUrl" IS NULL AND "featuredImage" IS NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlogPost_featuredEnabled_idx" ON "BlogPost"("featuredEnabled");
CREATE INDEX IF NOT EXISTS "BlogPost_publishedDate_idx" ON "BlogPost"("publishedDate");
