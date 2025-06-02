/*
  Warnings:

  - You are about to alter the column `recentTransfers` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to drop the column `name` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to alter the column `value` on the `TrustScore` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `data` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Made the column `tag` on table `Insight` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `message` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "advisorId" TEXT,
    "totalAssets" REAL DEFAULT 0,
    "recentTransfers" REAL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Client_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("advisorId", "createdAt", "email", "id", "name", "recentTransfers", "totalAssets") SELECT "advisorId", "createdAt", "email", "id", "name", "recentTransfers", "totalAssets" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
CREATE TABLE "new_CoachingPrompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "CoachingPrompt_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CoachingPrompt" ("clientId", "content", "createdAt", "id") SELECT "clientId", "content", "createdAt", "id" FROM "CoachingPrompt";
DROP TABLE "CoachingPrompt";
ALTER TABLE "new_CoachingPrompt" RENAME TO "CoachingPrompt";
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Form_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("clientId", "createdAt", "id", "status", "type") SELECT "clientId", "createdAt", "id", "status", "type" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE TABLE "new_Insight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Insight_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Insight" ("clientId", "content", "createdAt", "id", "tag") SELECT "clientId", "content", "createdAt", "id", "tag" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
CREATE TABLE "new_TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TimelineEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimelineEvent" ("clientId", "id") SELECT "clientId", "id" FROM "TimelineEvent";
DROP TABLE "TimelineEvent";
ALTER TABLE "new_TimelineEvent" RENAME TO "TimelineEvent";
CREATE TABLE "new_TrustScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TrustScore_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TrustScore" ("clientId", "createdAt", "id", "value") SELECT "clientId", "createdAt", "id", "value" FROM "TrustScore";
DROP TABLE "TrustScore";
ALTER TABLE "new_TrustScore" RENAME TO "TrustScore";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
