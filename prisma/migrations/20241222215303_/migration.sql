/*
  Warnings:

  - You are about to drop the column `trackId` on the `Products` table. All the data in the column will be lost.
  - Added the required column `productId` to the `TrackList` table without a default value. This is not possible if the table is not empty.

*/
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "TrackList" ("productId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Products" ("LowestPrice", "averagePrice", "createdAt", "currency", "currentPrice", "discountRate", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt") SELECT "LowestPrice", "averagePrice", "createdAt", "currency", "currentPrice", "discountRate", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_productUrl_key" ON "Products"("productUrl");
CREATE TABLE "new_TrackList" (
    "trackId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "trackedOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TrackList" ("trackId", "trackedOn", "updatedAt", "userId") SELECT "trackId", "trackedOn", "updatedAt", "userId" FROM "TrackList";
DROP TABLE "TrackList";
ALTER TABLE "new_TrackList" RENAME TO "TrackList";
CREATE UNIQUE INDEX "TrackList_userId_key" ON "TrackList"("userId");
CREATE UNIQUE INDEX "TrackList_productId_key" ON "TrackList"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
