/*
  Warnings:

  - You are about to drop the column `userId` on the `TrackList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `TrackList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `TrackList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TrackList` DROP FOREIGN KEY `TrackList_userId_fkey`;

-- DropIndex
DROP INDEX `TrackList_userId_key` ON `TrackList`;

-- AlterTable
ALTER TABLE `TrackList` DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `TrackList_email_key` ON `TrackList`(`email`);

-- AddForeignKey
ALTER TABLE `TrackList` ADD CONSTRAINT `TrackList_email_fkey` FOREIGN KEY (`email`) REFERENCES `Users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
