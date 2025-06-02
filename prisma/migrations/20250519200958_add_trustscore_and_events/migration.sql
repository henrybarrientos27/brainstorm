/*
  Warnings:

  - You are about to drop the column `prompt` on the `CoachingPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `TrustScore` table. All the data in the column will be lost.
  - Added the required column `message` to the `CoachingPrompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `TrustScore` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CoachingPrompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoachingPrompt_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CoachingPrompt" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "CoachingPrompt";
DROP TABLE "CoachingPrompt";
ALTER TABLE "new_CoachingPrompt" RENAME TO "CoachingPrompt";
CREATE TABLE "new_TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TimelineEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimelineEvent" ("clientId", "id", "title") SELECT "clientId", "id", "title" FROM "TimelineEvent";
DROP TABLE "TimelineEvent";
ALTER TABLE "new_TimelineEvent" RENAME TO "TimelineEvent";
CREATE TABLE "new_TrustScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "score" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrustScore_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TrustScore" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "TrustScore";
DROP TABLE "TrustScore";
ALTER TABLE "new_TrustScore" RENAME TO "TrustScore";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
