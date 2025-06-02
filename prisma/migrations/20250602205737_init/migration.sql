/*
  Warnings:

  - You are about to drop the column `name` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `History` table. All the data in the column will be lost.
  - The `tags` column on the `Insight` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `location` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `detail` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `TrustScore` table. All the data in the column will be lost.
  - You are about to drop the `Preferences` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clientId]` on the table `CoachingPrompt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `TrustScore` will be added. If there are existing duplicate values, this will fail.
  - Made the column `metadata` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `History` table without a default value. This is not possible if the table is not empty.
  - Made the column `notes` on table `Meeting` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `message` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Progress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `note` on table `Reminder` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `event` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Preferences" DROP CONSTRAINT "Preferences_clientId_fkey";

-- AlterTable
ALTER TABLE "Advisor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "metadata" SET NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "CoachingPrompt" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "name",
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "History" DROP COLUMN "description",
DROP COLUMN "type",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "metadata" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Insight" DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "location",
DROP COLUMN "time",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "notes" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "content",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "message" TEXT NOT NULL,
ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "notes",
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "message",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "note" SET NOT NULL;

-- AlterTable
ALTER TABLE "Summary" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TimelineEvent" DROP COLUMN "detail",
DROP COLUMN "title",
ADD COLUMN     "event" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrustScore" DROP COLUMN "score",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Preferences";

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL,
    "trait" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intent" (
    "id" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Intent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "trait" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refresh" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refresh_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Persona_clientId_key" ON "Persona"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_clientId_key" ON "Preference"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_clientId_key" ON "Profile"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "CoachingPrompt_clientId_key" ON "CoachingPrompt"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "TrustScore_clientId_key" ON "TrustScore"("clientId");

-- AddForeignKey
ALTER TABLE "Pattern" ADD CONSTRAINT "Pattern_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intent" ADD CONSTRAINT "Intent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refresh" ADD CONSTRAINT "Refresh_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
