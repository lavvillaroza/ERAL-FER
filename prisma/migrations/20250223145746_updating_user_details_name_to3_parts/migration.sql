/*
  Warnings:

  - You are about to drop the column `name` on the `userdetails` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `UserDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `UserDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notification` MODIFY `user_id` INTEGER NOT NULL DEFAULT 0,
    MODIFY `status` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `systemlogs` MODIFY `user_id` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `userdetails` DROP COLUMN `name`,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `middle_name` VARCHAR(191) NULL;
