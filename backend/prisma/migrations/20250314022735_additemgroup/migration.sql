/*
  Warnings:

  - You are about to drop the column `code` on the `groupcode` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `groupcode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `GroupCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `GroupCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `groupcode` DROP FOREIGN KEY `GroupCode_itemId_fkey`;

-- DropIndex
DROP INDEX `GroupCode_code_key` ON `groupcode`;

-- DropIndex
DROP INDEX `GroupCode_itemId_fkey` ON `groupcode`;

-- AlterTable
ALTER TABLE `groupcode` DROP COLUMN `code`,
    DROP COLUMN `itemId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ItemGroup` (
    `id` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `GroupCode_name_key` ON `GroupCode`(`name`);

-- AddForeignKey
ALTER TABLE `ItemGroup` ADD CONSTRAINT `ItemGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `GroupCode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemGroup` ADD CONSTRAINT `ItemGroup_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
