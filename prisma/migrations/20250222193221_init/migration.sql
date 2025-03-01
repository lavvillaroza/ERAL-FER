/*
  Warnings:

  - You are about to drop the column `classs_id` on the `classattendance` table. All the data in the column will be lost.
  - You are about to drop the column `class_id` on the `classlessonplan` table. All the data in the column will be lost.
  - You are about to drop the column `class_id` on the `classschedule` table. All the data in the column will be lost.
  - You are about to drop the column `classsched_id` on the `classstudentfer` table. All the data in the column will be lost.
  - You are about to drop the column `class_id` on the `classstudents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[class_subject_id]` on the table `ClassLessonPlan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[class_schedule_id]` on the table `ClassLessonPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class_schedule_id` to the `ClassAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_subject_id` to the `ClassAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_schedule_id` to the `ClassLessonPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_subject_id` to the `ClassLessonPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_subject_id` to the `ClassSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_schedule_id` to the `ClassStudentFER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_subject_id` to the `ClassStudentFER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_subject_id` to the `ClassStudents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `for_admin` to the `SystemLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ClassAttendance_classs_id_key` ON `classattendance`;

-- DropIndex
DROP INDEX `ClassLessonPlan_class_id_key` ON `classlessonplan`;

-- DropIndex
DROP INDEX `ClassStudentFER_classsched_id_key` ON `classstudentfer`;

-- DropIndex
DROP INDEX `ClassStudents_class_id_key` ON `classstudents`;

-- AlterTable
ALTER TABLE `classattendance` DROP COLUMN `classs_id`,
    ADD COLUMN `class_schedule_id` INTEGER NOT NULL,
    ADD COLUMN `class_subject_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classlessonplan` DROP COLUMN `class_id`,
    ADD COLUMN `class_schedule_id` INTEGER NOT NULL,
    ADD COLUMN `class_subject_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classschedule` DROP COLUMN `class_id`,
    ADD COLUMN `class_subject_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classstudentfer` DROP COLUMN `classsched_id`,
    ADD COLUMN `class_schedule_id` INTEGER NOT NULL,
    ADD COLUMN `class_subject_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classstudents` DROP COLUMN `class_id`,
    ADD COLUMN `class_subject_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `systemlogs` ADD COLUMN `for_admin` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `userdetails` ADD COLUMN `thresh_hold` DECIMAL(65, 30) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `ClassLessonPlan_class_subject_id_key` ON `ClassLessonPlan`(`class_subject_id`);

-- CreateIndex
CREATE UNIQUE INDEX `ClassLessonPlan_class_schedule_id_key` ON `ClassLessonPlan`(`class_schedule_id`);

-- AddForeignKey
ALTER TABLE `ClassStudents` ADD CONSTRAINT `ClassStudents_class_subject_id_fkey` FOREIGN KEY (`class_subject_id`) REFERENCES `ClassSubject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassSchedule` ADD CONSTRAINT `ClassSchedule_class_subject_id_fkey` FOREIGN KEY (`class_subject_id`) REFERENCES `ClassSubject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassLessonPlan` ADD CONSTRAINT `ClassLessonPlan_class_schedule_id_fkey` FOREIGN KEY (`class_schedule_id`) REFERENCES `ClassSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassAttendance` ADD CONSTRAINT `ClassAttendance_class_schedule_id_fkey` FOREIGN KEY (`class_schedule_id`) REFERENCES `ClassSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassStudentFER` ADD CONSTRAINT `ClassStudentFER_class_schedule_id_fkey` FOREIGN KEY (`class_schedule_id`) REFERENCES `ClassSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
