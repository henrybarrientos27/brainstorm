/*
  Warnings:

  - Made the column `summaryId` on table `Insight` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Insight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "tags" TEXT,
    "type" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "summaryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Insight_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Insight_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "Summary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Insight" ("clientId", "content", "createdAt", "id", "summaryId", "tags", "type") SELECT "clientId", "content", "createdAt", "id", "summaryId", "tags", "type" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
