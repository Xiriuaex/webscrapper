-- CreateTable
CREATE TABLE "Products" (
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
    "listId" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Products_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ProductList" ("listId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "historyId" TEXT NOT NULL PRIMARY KEY,
    "price" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("productId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "productListId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Users_productListId_fkey" FOREIGN KEY ("productListId") REFERENCES "ProductList" ("listId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductList" (
    "listId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "ProductId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_productUrl_key" ON "Products"("productUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Products_listId_key" ON "Products"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "PriceHistory_productId_key" ON "PriceHistory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_uid_key" ON "Users"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_productListId_key" ON "Users"("productListId");
