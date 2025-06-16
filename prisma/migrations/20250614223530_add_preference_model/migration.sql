/*
  Warnings:

  - You are about to drop the column `category` on the `Preference` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Preference` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Preference` table. All the data in the column will be lost.
  - Added the required column `communicationStyle` to the `Preference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskTolerance` to the `Preference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "category",
DROP COLUMN "createdAt",
DROP COLUMN "value",
ADD COLUMN     "communicationStyle" TEXT NOT NULL,
ADD COLUMN     "riskTolerance" TEXT NOT NULL;
