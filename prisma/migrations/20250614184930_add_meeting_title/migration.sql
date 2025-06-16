/*
  Warnings:

  - You are about to drop the column `notes` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `location` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "notes",
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
