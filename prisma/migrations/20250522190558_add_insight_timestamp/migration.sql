/*
  Warnings:

  - You are about to drop the column `content` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Insight` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `TrustScore` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Advisor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Advisor" ADD COLUMN "email" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Form_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE TABLE "new_Insight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tag" TEXT,
    "content" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Insight_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Insight" ("clientId", "content", "createdAt", "id") SELECT "clientId", "content", "createdAt", "id" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
CREATE TABLE "new_TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TimelineEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimelineEvent" ("clientId", "id") SELECT "clientId", "id" FROM "TimelineEvent";
DROP TABLE "TimelineEvent";
ALTER TABLE "new_TimelineEvent" RENAME TO "TimelineEvent";
CREATE TABLE "new_TrustScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TrustScore_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TrustScore" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "TrustScore";
DROP TABLE "TrustScore";
ALTER TABLE "new_TrustScore" RENAME TO "TrustScore";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_email_key" ON "Advisor"("email");
