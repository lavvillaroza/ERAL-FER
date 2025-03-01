/*
  Warnings:

  - You are about to drop the `classinformation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `for_admin` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notification` ADD COLUMN `for_admin` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `classinformation`;

-- CreateTable
CREATE TABLE `ClassSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date_schedule` VARCHAR(191) NOT NULL,
    `time_schedule` VARCHAR(191) NOT NULL,
    `teacher_user_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemLogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `level` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `exception` VARCHAR(191) NOT NULL,
    `entity_name` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
