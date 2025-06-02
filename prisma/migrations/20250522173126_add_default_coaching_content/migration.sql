/*
  Warnings:

  - You are about to drop the `UploadedFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `email` on the `Advisor` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `CoachingPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `Form` table. All the data in the column will be lost.
  - Added the required column `content` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UploadedFile";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Advisor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Advisor" ("id", "name") SELECT "id", "name" FROM "Advisor";
DROP TABLE "Advisor";
ALTER TABLE "new_Advisor" RENAME TO "Advisor";
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "advisorId" TEXT,
    "totalAssets" REAL DEFAULT 0,
    "recentTransfers" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Client_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("advisorId", "createdAt", "email", "id", "name", "recentTransfers", "totalAssets") SELECT "advisorId", "createdAt", "email", "id", "name", "recentTransfers", "totalAssets" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
CREATE TABLE "new_CoachingPrompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "CoachingPrompt_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CoachingPrompt" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "CoachingPrompt";
DROP TABLE "CoachingPrompt";
ALTER TABLE "new_CoachingPrompt" RENAME TO "CoachingPrompt";
CREATE TABLE "new_Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Feedback_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Feedback" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Form_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("clientId", "id", "title") SELECT "clientId", "id", "title" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE TABLE "new_Insight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Insight_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Insight" ("clientId", "content", "id", "tags") SELECT "clientId", "content", "id", "tags" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
CREATE TABLE "new_TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TimelineEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimelineEvent" ("clientId", "id", "timestamp", "title") SELECT "clientId", "id", "timestamp", "title" FROM "TimelineEvent";
DROP TABLE "TimelineEvent";
ALTER TABLE "new_TimelineEvent" RENAME TO "TimelineEvent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
