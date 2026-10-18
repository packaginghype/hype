-- CreateEnum
CREATE TYPE "CategoryGroup" AS ENUM ('categories', 'industries', 'materials', 'shapes');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "group" "CategoryGroup" NOT NULL DEFAULT 'categories';

-- Backfill existing catalog into the closest group
UPDATE "Category"
SET "group" = 'materials'
WHERE slug IN (
  'kraft-boxes',
  'corrugated-boxes',
  'rigid-boxes',
  'mailer-boxes',
  'mylar-bags',
  'display-boxes'
);

UPDATE "Category"
SET "group" = 'shapes'
WHERE slug IN (
  'gift-boxes',
  'treat-boxes',
  'vape-boxes',
  'bottle-boxes',
  'apparel-boxes',
  'sleeve-boxes',
  'window-boxes',
  'gable-boxes'
);

UPDATE "Category"
SET "group" = 'industries'
WHERE "group" = 'categories'
  AND slug NOT IN (
    'kraft-boxes',
    'corrugated-boxes',
    'rigid-boxes',
    'mailer-boxes',
    'mylar-bags',
    'display-boxes',
    'gift-boxes',
    'treat-boxes',
    'vape-boxes',
    'bottle-boxes',
    'apparel-boxes',
    'sleeve-boxes',
    'window-boxes',
    'gable-boxes'
  );

-- CreateIndex
CREATE INDEX "Category_group_idx" ON "Category"("group");
