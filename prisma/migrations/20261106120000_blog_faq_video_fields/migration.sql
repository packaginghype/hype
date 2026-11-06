-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "readTime" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "videoTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "faqsHeading" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "faqsSubheading" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "faqsImageUrl" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "faqsImageAlt" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "faqsImageTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "noIndex" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE IF NOT EXISTS "BlogPostFaq" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BlogPostFaq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BlogPost_category_idx" ON "BlogPost"("category");
CREATE INDEX IF NOT EXISTS "BlogPostFaq_blogPostId_idx" ON "BlogPostFaq"("blogPostId");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'BlogPostFaq_blogPostId_fkey'
  ) THEN
    ALTER TABLE "BlogPostFaq"
      ADD CONSTRAINT "BlogPostFaq_blogPostId_fkey"
      FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
