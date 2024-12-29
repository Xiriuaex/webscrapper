-- DropForeignKey
ALTER TABLE `PriceHistory` DROP FOREIGN KEY `PriceHistory_productId_fkey`;

-- DropForeignKey
ALTER TABLE `TrackList` DROP FOREIGN KEY `TrackList_userId_fkey`;

-- AddForeignKey
ALTER TABLE `PriceHistory` ADD CONSTRAINT `PriceHistory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`productId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrackList` ADD CONSTRAINT `TrackList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
