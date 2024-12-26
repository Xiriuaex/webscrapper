/*
  Warnings:

  - You are about to drop the column `firstName` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Users` table. All the data in the column will be lost.
  - Added the required column `fullname` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "productListId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Users_productListId_fkey" FOREIGN KEY ("productListId") REFERENCES "ProductList" ("listId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Users" ("createdAt", "email", "productListId", "uid", "updatedAt", "userId") SELECT "createdAt", "email", "productListId", "uid", "updatedAt", "userId" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_uid_key" ON "Users"("uid");
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
CREATE UNIQUE INDEX "Users_productListId_key" ON "Users"("productListId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
