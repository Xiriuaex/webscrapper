/*
  Warnings:

  - You are about to drop the `TrackList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `trackListId` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TrackList_productId_key";

-- DropIndex
DROP INDEX "TrackList_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrackList";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Products" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "productUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "currentPrice" REAL NOT NULL,
    "originalPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "LowestPrice" REAL NOT NULL,
    "highestPrice" REAL NOT NULL,
    "averagePrice" REAL NOT NULL,
    "discountRate" REAL NOT NULL,
    "isOutOfStock" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Products" ("LowestPrice", "averagePrice", "createdAt", "currency", "currentPrice", "discountRate", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt") SELECT "LowestPrice", "averagePrice", "createdAt", "currency", "currentPrice", "discountRate", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_productUrl_key" ON "Products"("productUrl");
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
INSERT INTO "new_Users" ("createdAt", "email", "fullname", "productListId", "uid", "updatedAt", "userId") SELECT "createdAt", "email", "fullname", "productListId", "uid", "updatedAt", "userId" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_uid_key" ON "Users"("uid");
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
CREATE UNIQUE INDEX "Users_productListId_key" ON "Users"("productListId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
