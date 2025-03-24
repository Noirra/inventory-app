/*
  Warnings:

  - You are about to drop the column `examinationPeriod` on the `item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `item` DROP COLUMN `examinationPeriod`,
    ADD COLUMN `examinationPeriodDate` VARCHAR(191) NULL,
    ADD COLUMN `examinationPeriodMonth` INTEGER NULL;
