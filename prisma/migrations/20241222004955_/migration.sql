/*
  Warnings:

  - You are about to drop the column `ProductId` on the `ProductList` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductList" (
    "listId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ProductList" ("createdAt", "listId", "updatedAt", "userId") SELECT "createdAt", "listId", "updatedAt", "userId" FROM "ProductList";
DROP TABLE "ProductList";
ALTER TABLE "new_ProductList" RENAME TO "ProductList";
CREATE UNIQUE INDEX "ProductList_userId_key" ON "ProductList"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
