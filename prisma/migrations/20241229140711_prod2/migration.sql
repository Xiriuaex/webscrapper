-- CreateTable
CREATE TABLE `Products` (
    `productId` VARCHAR(191) NOT NULL,
    `productUrl` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `currentPrice` DOUBLE NOT NULL,
    `originalPrice` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `LowestPrice` DOUBLE NOT NULL,
    `highestPrice` DOUBLE NOT NULL,
    `averagePrice` DOUBLE NOT NULL,
    `discountRate` DOUBLE NOT NULL,
    `isOutOfStock` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Products_productUrl_key`(`productUrl`),
    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceHistory` (
    `historyId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PriceHistory_productId_key`(`productId`),
    PRIMARY KEY (`historyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `userId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `trackListId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_trackListId_key`(`trackListId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrackList` (
    `lid` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TrackList_userId_key`(`userId`),
    PRIMARY KEY (`lid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductsToTrackList` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProductsToTrackList_AB_unique`(`A`, `B`),
    INDEX `_ProductsToTrackList_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PriceHistory` ADD CONSTRAINT `PriceHistory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`productId`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrackList` ADD CONSTRAINT `TrackList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductsToTrackList` ADD CONSTRAINT `_ProductsToTrackList_A_fkey` FOREIGN KEY (`A`) REFERENCES `Products`(`productId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductsToTrackList` ADD CONSTRAINT `_ProductsToTrackList_B_fkey` FOREIGN KEY (`B`) REFERENCES `TrackList`(`lid`) ON DELETE CASCADE ON UPDATE CASCADE;
