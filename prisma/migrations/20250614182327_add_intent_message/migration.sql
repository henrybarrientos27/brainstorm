/*
  Warnings:

  - You are about to drop the column `statement` on the `Intent` table. All the data in the column will be lost.
  - Added the required column `message` to the `Intent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Intent" DROP COLUMN "statement",
ADD COLUMN     "message" TEXT NOT NULL;
