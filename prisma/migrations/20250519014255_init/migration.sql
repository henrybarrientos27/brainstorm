/*
  Warnings:

  - You are about to drop the `Advisor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonaTrait` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimelineEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrustScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `advisorId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `summaryId` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `summaryId` on the `Insight` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Insight` table. All the data in the column will be lost.
  - Added the required column `content` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Made the column `tags` on table `Insight` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Advisor_email_key";

-- DropIndex
DROP INDEX "TrustScore_clientId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Advisor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PersonaTrait";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TimelineEvent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrustScore";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Client" ("email", "id", "name") SELECT "email", "id", "name" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
CREATE TABLE "new_Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Feedback" ("clientId", "createdAt", "id") SELECT "clientId", "createdAt", "id" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Form_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("clientId", "createdAt", "id", "name") SELECT "clientId", "createdAt", "id", "name" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE TABLE "new_Insight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Insight_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Insight" ("clientId", "content", "createdAt", "id", "tags") SELECT "clientId", "content", "createdAt", "id", "tags" FROM "Insight";
DROP TABLE "Insight";
ALTER TABLE "new_Insight" RENAME TO "Insight";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
