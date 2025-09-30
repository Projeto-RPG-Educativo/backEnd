-- AlterTable
ALTER TABLE "public"."Character" ADD COLUMN     "energy" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "maxEnergy" INTEGER NOT NULL DEFAULT 10;
