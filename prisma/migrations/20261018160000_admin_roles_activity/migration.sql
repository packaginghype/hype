-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'STAFF');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable AdminUser
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "role" "AdminRole" NOT NULL DEFAULT 'STAFF';
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Existing admins become super admins
UPDATE "AdminUser" SET "role" = 'SUPER_ADMIN';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AdminUser_role_idx" ON "AdminUser"("role");

-- CreateTable
CREATE TABLE IF NOT EXISTS "ActivityLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "entityLabel" TEXT,
    "summary" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
CREATE INDEX IF NOT EXISTS "ActivityLog_actorId_idx" ON "ActivityLog"("actorId");
CREATE INDEX IF NOT EXISTS "ActivityLog_entityType_idx" ON "ActivityLog"("entityType");
CREATE INDEX IF NOT EXISTS "ActivityLog_action_idx" ON "ActivityLog"("action");

DO $$ BEGIN
  ALTER TABLE "ActivityLog"
    ADD CONSTRAINT "ActivityLog_actorId_fkey"
    FOREIGN KEY ("actorId") REFERENCES "AdminUser"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
