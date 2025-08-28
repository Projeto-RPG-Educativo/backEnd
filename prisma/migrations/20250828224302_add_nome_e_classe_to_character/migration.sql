/*
  Warnings:

  - Added the required column `classe` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Character" ADD COLUMN     "classe" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL;
