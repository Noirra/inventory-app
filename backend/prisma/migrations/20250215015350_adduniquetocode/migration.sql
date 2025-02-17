/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Component` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `ItemRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `RepairRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Area_code_key` ON `Area`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_code_key` ON `Category`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Component_code_key` ON `Component`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Item_code_key` ON `Item`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `ItemRequest_code_key` ON `ItemRequest`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `RepairRequest_code_key` ON `RepairRequest`(`code`);
