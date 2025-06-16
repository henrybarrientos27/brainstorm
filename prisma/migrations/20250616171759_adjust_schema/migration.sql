/*
  Warnings:

  - Added the required column `data` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "data" BYTEA NOT NULL,
ADD COLUMN     "fileType" TEXT NOT NULL;
