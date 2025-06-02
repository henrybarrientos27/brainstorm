/*
  Warnings:

  - You are about to drop the column `recentTransfers` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `totalAssets` on the `Client` table. All the data in the column will be lost.
  - Made the column `value` on table `TrustScore` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Summary" ADD COLUMN "transcript" TEXT;

-- CreateTable
CREATE TABLE "BehaviorTrait" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "summary" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "BehaviorTrait_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "advisorId" TEXT,
    CONSTRAINT "Client_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("advisorId", "createdAt", "email", "id", "name") SELECT "advisorId", "createdAt", "email", "id", "name" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
CREATE TABLE "new_TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TimelineEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimelineEvent" ("clientId", "id", "message", "timestamp", "title") SELECT "clientId", "id", "message", "timestamp", "title" FROM "TimelineEvent";
DROP TABLE "TimelineEvent";
ALTER TABLE "new_TimelineEvent" RENAME TO "TimelineEvent";
CREATE TABLE "new_TrustScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TrustScore_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TrustScore" ("clientId", "createdAt", "id", "value") SELECT "clientId", "createdAt", "id", "value" FROM "TrustScore";
DROP TABLE "TrustScore";
ALTER TABLE "new_TrustScore" RENAME TO "TrustScore";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
