-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "relatedBlogIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "relatedBlogsDescription" TEXT,
ADD COLUMN     "relatedBlogsHeading" TEXT DEFAULT 'Related Articles & Packaging Guides';
