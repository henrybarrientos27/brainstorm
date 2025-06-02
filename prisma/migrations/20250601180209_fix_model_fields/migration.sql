/*
  Warnings:

  - You are about to drop the column `milestone` on the `Progress` table. All the data in the column will be lost.
  - Added the required column `goal` to the `Progress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN "location" TEXT;
ALTER TABLE "Meeting" ADD COLUMN "time" TEXT;
ALTER TABLE "Meeting" ADD COLUMN "title" TEXT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN "type" TEXT;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN "note" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "communicationStyle" TEXT,
    "investmentStyle" TEXT,
    "riskTolerance" TEXT,
    "preferredProducts" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Preferences_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Preferences" ("clientId", "communicationStyle", "id", "investmentStyle", "riskTolerance") SELECT "clientId", "communicationStyle", "id", "investmentStyle", "riskTolerance" FROM "Preferences";
DROP TABLE "Preferences";
ALTER TABLE "new_Preferences" RENAME TO "Preferences";
CREATE TABLE "new_Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goal" TEXT NOT NULL,
    "status" TEXT,
    "notes" TEXT,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Progress_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Progress" ("clientId", "complete", "id", "updatedAt") SELECT "clientId", "complete", "id", "updatedAt" FROM "Progress";
DROP TABLE "Progress";
ALTER TABLE "new_Progress" RENAME TO "Progress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
