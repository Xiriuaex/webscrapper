/*
  Warnings:

  - You are about to drop the column `LowestPrice` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `discountPrice` on the `Products` table. All the data in the column will be lost.
  - Added the required column `discountRate` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lowestPrice` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Products" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "productUrl" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "currentPrice" INTEGER NOT NULL,
    "originalPrice" INTEGER NOT NULL,
    "lowestPrice" INTEGER NOT NULL,
    "highestPrice" INTEGER NOT NULL,
    "averagePrice" INTEGER NOT NULL,
    "discountRate" INTEGER NOT NULL,
    "isOutOfStock" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Products" ("averagePrice", "createdAt", "currency", "currentPrice", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt") SELECT "averagePrice", "createdAt", "currency", "currentPrice", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_productUrl_key" ON "Products"("productUrl");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
