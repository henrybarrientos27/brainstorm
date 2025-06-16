/*
  Warnings:

  - Added the required column `title` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Summary" ADD COLUMN     "title" TEXT NOT NULL;
