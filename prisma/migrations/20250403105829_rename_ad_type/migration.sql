-- AlterEnum
BEGIN;
ALTER TYPE "AdType" RENAME VALUE 'Homepage' TO 'Tools';
ALTER TABLE "Ad" ALTER COLUMN "type" SET DEFAULT 'All';
COMMIT;