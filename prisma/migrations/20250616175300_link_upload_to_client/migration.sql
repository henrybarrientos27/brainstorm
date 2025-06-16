/*
  Warnings:

  - Added the required column `email` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "tagged" BOOLEAN NOT NULL DEFAULT false;
