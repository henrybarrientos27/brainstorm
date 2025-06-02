/*
  Warnings:

  - Added the required column `password` to the `Advisor` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Advisor` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Advisor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Advisor" ("email", "id", "name") SELECT "email", "id", "name" FROM "Advisor";
DROP TABLE "Advisor";
ALTER TABLE "new_Advisor" RENAME TO "Advisor";
CREATE UNIQUE INDEX "Advisor_email_key" ON "Advisor"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
