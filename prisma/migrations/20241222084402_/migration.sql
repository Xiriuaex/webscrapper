/*
  Warnings:

  - You are about to drop the column `lowestPrice` on the `Products` table. All the data in the column will be lost.
  - You are about to alter the column `averagePrice` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `currentPrice` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `discountRate` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `highestPrice` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `originalPrice` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `LowestPrice` to the `Products` table without a default value. This is not possible if the table is not empty.

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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Products" ("averagePrice", "createdAt", "currency", "currentPrice", "discountRate", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt") SELECT "averagePrice", "createdAt", "currency", "currentPrice", "discountRate", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_productUrl_key" ON "Products"("productUrl");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
