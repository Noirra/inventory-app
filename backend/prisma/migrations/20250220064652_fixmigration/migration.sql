/*
  Warnings:

  - You are about to drop the column `items` on the `useritem` table. All the data in the column will be lost.
  - You are about to drop the column `rolesId` on the `userrole` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `userrole` table. All the data in the column will be lost.
  - You are about to drop the `_itemtouseritem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requestaproved` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `itemId` to the `UserItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_itemtouseritem` DROP FOREIGN KEY `_ItemToUserItem_A_fkey`;

-- DropForeignKey
ALTER TABLE `_itemtouseritem` DROP FOREIGN KEY `_ItemToUserItem_B_fkey`;

-- DropForeignKey
ALTER TABLE `requestaproved` DROP FOREIGN KEY `requestaproved_requestId_fkey`;

-- DropForeignKey
ALTER TABLE `requestaproved` DROP FOREIGN KEY `requestaproved_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_rolesId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_usersId_fkey`;

-- DropIndex
DROP INDEX `UserRole_rolesId_fkey` ON `userrole`;

-- DropIndex
DROP INDEX `UserRole_usersId_fkey` ON `userrole`;

-- AlterTable
ALTER TABLE `useritem` DROP COLUMN `items`,
    ADD COLUMN `itemId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `userrole` DROP COLUMN `rolesId`,
    DROP COLUMN `usersId`,
    ADD COLUMN `roleId` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_itemtouseritem`;

-- DropTable
DROP TABLE `requestaproved`;

-- CreateTable
CREATE TABLE `RequestApproved` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserItem` ADD CONSTRAINT `UserItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestApproved` ADD CONSTRAINT `RequestApproved_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `ItemRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestApproved` ADD CONSTRAINT `RequestApproved_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
