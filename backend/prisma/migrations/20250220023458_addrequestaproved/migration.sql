/*
  Warnings:

  - The values [REPAIRED] on the enum `Item_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `item` MODIFY `status` ENUM('UNUSED', 'USED', 'BROKEN') NOT NULL DEFAULT 'UNUSED';

-- CreateTable
CREATE TABLE `requestaproved` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `requestaproved` ADD CONSTRAINT `requestaproved_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `ItemRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requestaproved` ADD CONSTRAINT `requestaproved_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
