/*
  Warnings:

  - You are about to drop the column `classroom_id` on the `classschedule` table. All the data in the column will be lost.
  - You are about to drop the column `online_status` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `classlessonplantimeline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classstudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classstudentattendance` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `class_id` to the `ClassSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ClassSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `ClassStudentFER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_status` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `online_status` to the `UserDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `classschedule` DROP COLUMN `classroom_id`,
    ADD COLUMN `class_id` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `classstudentfer` ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `online_status`,
    ADD COLUMN `account_status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `userdetails` ADD COLUMN `online_status` VARCHAR(191) NOT NULL,
    MODIFY `profile_image` LONGBLOB NULL;

-- DropTable
DROP TABLE `classlessonplantimeline`;

-- DropTable
DROP TABLE `classroom`;

-- DropTable
DROP TABLE `classstudent`;

-- DropTable
DROP TABLE `classstudentattendance`;

-- CreateTable
CREATE TABLE `ClassInformation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date_schedule` VARCHAR(191) NOT NULL,
    `teacher_user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassStudents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,

    UNIQUE INDEX `ClassStudents_class_id_key`(`class_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassLessonPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ClassLessonPlan_class_id_key`(`class_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassAttendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classs_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `time_in` DATETIME(3) NOT NULL,
    `time_out` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ClassAttendance_classs_id_key`(`classs_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
