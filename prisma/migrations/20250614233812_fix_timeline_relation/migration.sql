/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `event` on the `TimelineEvent` table. All the data in the column will be lost.
  - Added the required column `message` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "createdAt",
ADD COLUMN     "message" TEXT NOT NULL,
ALTER COLUMN "note" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TimelineEvent" DROP COLUMN "createdAt",
DROP COLUMN "event",
ADD COLUMN     "message" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
