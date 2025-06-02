/*
  Warnings:

  - You are about to drop the column `details` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Activity` table. All the data in the column will be lost.
  - You are about to alter the column `data` on the `Form` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to drop the column `tag` on the `Insight` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `TrustScore` table. All the data in the column will be lost.
  - Added the required column `content` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Insight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `TrustScore` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "AuditLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Activity_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE TABLE "new_Advisor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Advisor" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "Advisor";
DROP TABLE "Advisor";
ALTER TABLE "new_Advisor" RENAME TO "Advisor";
CREATE UNIQUE INDEX "Advisor_email_key" ON "Advisor"("email");
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Form_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("clientId", "createdAt", "data", "id", "status", "type") SELECT "clientId", "createdAt", "data", "id", "status", "type" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE TABLE "new_Insight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "Insight_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Insight" ("clientId", "content", "createdAt", "id") SELECT "clientId", "content", "createdAt", "id" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
CREATE TABLE "new_TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TimelineEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimelineEvent" ("clientId", "id") SELECT "clientId", "id" FROM "TimelineEvent";
DROP TABLE "TimelineEvent";
ALTER TABLE "new_TimelineEvent" RENAME TO "TimelineEvent";
CREATE TABLE "new_TrustScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "score" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    CONSTRAINT "TrustScore_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TrustScore" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "TrustScore";
DROP TABLE "TrustScore";
ALTER TABLE "new_TrustScore" RENAME TO "TrustScore";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
