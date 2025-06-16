/*
  Warnings:

  - You are about to alter the column `value` on the `TrustScore` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "TrustScore" ALTER COLUMN "value" DROP DEFAULT,
ALTER COLUMN "value" SET DATA TYPE INTEGER;
