/*
  Warnings:

  - You are about to drop the column `trackListId` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Users_trackListId_key` ON `Users`;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `trackListId`;
