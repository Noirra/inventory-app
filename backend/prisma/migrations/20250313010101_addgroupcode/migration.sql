/*
  Warnings:

  - You are about to drop the column `groupCode` on the `item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `item` DROP COLUMN `groupCode`;

-- CreateTable
CREATE TABLE `GroupCode` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GroupCode_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GroupCode` ADD CONSTRAINT `GroupCode_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
