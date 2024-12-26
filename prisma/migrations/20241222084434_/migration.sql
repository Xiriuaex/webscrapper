/*
  Warnings:

  - You are about to alter the column `price` on the `PriceHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PriceHistory" (
    "historyId" TEXT NOT NULL PRIMARY KEY,
    "price" REAL NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("productId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PriceHistory" ("createdAt", "historyId", "price", "productId") SELECT "createdAt", "historyId", "price", "productId" FROM "PriceHistory";
DROP TABLE "PriceHistory";
ALTER TABLE "new_PriceHistory" RENAME TO "PriceHistory";
CREATE UNIQUE INDEX "PriceHistory_productId_key" ON "PriceHistory"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
