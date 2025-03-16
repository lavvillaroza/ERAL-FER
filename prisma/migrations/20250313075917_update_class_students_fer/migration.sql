/*
  Warnings:

  - You are about to drop the `ClassAttendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClassStudentFER` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ClassAttendance` DROP FOREIGN KEY `ClassAttendance_class_schedule_id_fkey`;

-- DropForeignKey
ALTER TABLE `ClassStudentFER` DROP FOREIGN KEY `ClassStudentFER_class_schedule_id_fkey`;

-- DropTable
DROP TABLE `ClassAttendance`;

-- DropTable
DROP TABLE `ClassStudentFER`;

-- CreateTable
CREATE TABLE `ClassStudentsFER` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_subject_id` INTEGER NOT NULL,
    `class_schedule_id` INTEGER NOT NULL,
    `student_user_id` INTEGER NOT NULL,
    `surprised` DECIMAL(65, 30) NOT NULL,
    `happy` DECIMAL(65, 30) NOT NULL,
    `neutral` DECIMAL(65, 30) NOT NULL,
    `sad` DECIMAL(65, 30) NOT NULL,
    `angry` DECIMAL(65, 30) NOT NULL,
    `disgusted` DECIMAL(65, 30) NOT NULL,
    `fearful` DECIMAL(65, 30) NOT NULL,
    `result` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NOT NULL,
    `datetime_stamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClassStudentsFER` ADD CONSTRAINT `ClassStudentsFER_class_schedule_id_fkey` FOREIGN KEY (`class_schedule_id`) REFERENCES `ClassSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
