/*
  Warnings:

  - You are about to drop the column `notes` on the `routineexercise` table. All the data in the column will be lost.
  - You are about to alter the column `dayOfWeek` on the `routineexercise` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the column `createdAt` on the `routinehistory` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `routinehistory` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `routinehistory` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `routineexercise` DROP COLUMN `notes`,
    MODIFY `dayOfWeek` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `routinehistory` DROP COLUMN `createdAt`,
    DROP COLUMN `createdBy`,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `profilePictureUrl` VARCHAR(191) NULL;
