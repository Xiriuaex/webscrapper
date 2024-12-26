/*
  Warnings:

  - You are about to drop the column `historyId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `listId` on the `Products` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ProductListToProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProductListToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductList" ("listId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductListToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Products" ("productId") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "LowestPrice" INTEGER NOT NULL,
    "highestPrice" INTEGER NOT NULL,
    "averagePrice" INTEGER NOT NULL,
    "discountPrice" INTEGER NOT NULL,
    "isOutOfStock" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Products" ("LowestPrice", "averagePrice", "createdAt", "currency", "currentPrice", "discountPrice", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt") SELECT "LowestPrice", "averagePrice", "createdAt", "currency", "currentPrice", "discountPrice", "highestPrice", "image", "isOutOfStock", "originalPrice", "productId", "productUrl", "title", "updatedAt" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_productUrl_key" ON "Products"("productUrl");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ProductListToProducts_AB_unique" ON "_ProductListToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductListToProducts_B_index" ON "_ProductListToProducts"("B");
