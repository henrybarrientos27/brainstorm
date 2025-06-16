/*
  Warnings:

  - You are about to drop the column `title` on the `Summary` table. All the data in the column will be lost.
  - Made the column `details` on table `Activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `data` on table `Form` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "details" SET NOT NULL;

-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "data" SET NOT NULL,
ALTER COLUMN "data" SET DEFAULT '',
ALTER COLUMN "data" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "title";
