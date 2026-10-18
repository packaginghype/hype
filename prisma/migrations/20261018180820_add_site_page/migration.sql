-- CreateTable
CREATE TABLE "SitePage" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SitePage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SitePage_key_key" ON "SitePage"("key");

-- CreateIndex
CREATE INDEX "SitePage_key_idx" ON "SitePage"("key");
