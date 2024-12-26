/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ProductList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductList_userId_key" ON "ProductList"("userId");
