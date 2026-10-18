-- AlterTable
ALTER TABLE "Category"
ADD COLUMN "originalPrice" DECIMAL(10,2),
ADD COLUMN "discountedPrice" DECIMAL(10,2),
ADD COLUMN "inStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "bannerEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "bannerQuoteEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "bannerHeading" TEXT,
ADD COLUMN "bannerDescription" TEXT,
ADD COLUMN "bannerImageUrl" TEXT,
ADD COLUMN "bannerImageAlt" TEXT,
ADD COLUMN "bannerImageTitle" TEXT,
ADD COLUMN "imageAlt" TEXT,
ADD COLUMN "imageTitle" TEXT,
ADD COLUMN "widgetsContent" TEXT,
ADD COLUMN "listingHeading" TEXT,
ADD COLUMN "listingText" TEXT,
ADD COLUMN "navbarEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "featureEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "pageScrollEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "pageScrollImageUrl" TEXT,
ADD COLUMN "pageScrollImageAlt" TEXT,
ADD COLUMN "pageScrollImageTitle" TEXT,
ADD COLUMN "pageScrollContent" TEXT,
ADD COLUMN "faqsHeading" TEXT,
ADD COLUMN "faqsSubheading" TEXT,
ADD COLUMN "seoEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "seoKeywords" TEXT,
ADD COLUMN "seoScript" TEXT,
ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "CategoryFaq" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CategoryFaq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_isPublished_idx" ON "Category"("isPublished");
CREATE INDEX "CategoryFaq_categoryId_idx" ON "CategoryFaq"("categoryId");

-- AddForeignKey
ALTER TABLE "CategoryFaq" ADD CONSTRAINT "CategoryFaq_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
