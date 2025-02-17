/*
  Warnings:

  - Added the required column `photo` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `component` ADD COLUMN `photo` VARCHAR(191) NOT NULL;
