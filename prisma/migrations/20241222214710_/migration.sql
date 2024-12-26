/*
  Warnings:

  - Added the required column `trackId` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackListId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "TrackList" (
    "trackId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "trackedOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

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
    "trackId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Products_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "TrackList" ("trackId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Products" ("LowestPrice", "averagePrice", "createdAt", "currency", "currentPrice", "discountRate", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt") SELECT "LowestPrice", "averagePrice", "createdAt", "currency", "currentPrice", "discountRate", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_productUrl_key" ON "Products"("productUrl");
CREATE UNIQUE INDEX "Products_trackId_key" ON "Products"("trackId");
CREATE TABLE "new_Users" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "productListId" TEXT NOT NULL,
    "trackListId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Users_productListId_fkey" FOREIGN KEY ("productListId") REFERENCES "ProductList" ("listId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Users_trackListId_fkey" FOREIGN KEY ("trackListId") REFERENCES "TrackList" ("trackId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Users" ("createdAt", "email", "fullname", "productListId", "uid", "updatedAt", "userId") SELECT "createdAt", "email", "fullname", "productListId", "uid", "updatedAt", "userId" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_uid_key" ON "Users"("uid");
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
CREATE UNIQUE INDEX "Users_productListId_key" ON "Users"("productListId");
CREATE UNIQUE INDEX "Users_trackListId_key" ON "Users"("trackListId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TrackList_userId_key" ON "TrackList"("userId");
