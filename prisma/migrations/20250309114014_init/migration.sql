-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `account_status` VARCHAR(191) NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserDetails` (
    `user_id` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `middle_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `course` VARCHAR(191) NULL,
    `online_status` VARCHAR(191) NOT NULL,
    `profile_image` LONGBLOB NULL,
    `thresh_hold` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserDetails_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `time_schedule` VARCHAR(191) NOT NULL,
    `days` VARCHAR(191) NOT NULL,
    `teacher_user_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassStudents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_subject_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_subject_id` INTEGER NOT NULL,
    `date_schedule` VARCHAR(191) NOT NULL,
    `time_start` VARCHAR(191) NOT NULL,
    `time_end` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `topic_title` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassCourseContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_schedule_id` INTEGER NOT NULL,
    `time_start` VARCHAR(191) NOT NULL,
    `time_end` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassAttendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_subject_id` INTEGER NOT NULL,
    `class_schedule_id` INTEGER NOT NULL,
    `student_user_id` INTEGER NOT NULL,
    `time_in` VARCHAR(191) NOT NULL,
    `time_out` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassStudentFER` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_subject_id` INTEGER NOT NULL,
    `class_schedule_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime_stamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL DEFAULT 0,
    `color_code` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `for_admin` VARCHAR(191) NOT NULL,

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
    `user_id` INTEGER NOT NULL DEFAULT 0,
    `for_admin` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserDetails` ADD CONSTRAINT `UserDetails_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassStudents` ADD CONSTRAINT `ClassStudents_class_subject_id_fkey` FOREIGN KEY (`class_subject_id`) REFERENCES `ClassSubject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassStudents` ADD CONSTRAINT `ClassStudents_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `UserDetails`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassSchedule` ADD CONSTRAINT `ClassSchedule_class_subject_id_fkey` FOREIGN KEY (`class_subject_id`) REFERENCES `ClassSubject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassCourseContent` ADD CONSTRAINT `ClassCourseContent_class_schedule_id_fkey` FOREIGN KEY (`class_schedule_id`) REFERENCES `ClassSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassAttendance` ADD CONSTRAINT `ClassAttendance_class_schedule_id_fkey` FOREIGN KEY (`class_schedule_id`) REFERENCES `ClassSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassStudentFER` ADD CONSTRAINT `ClassStudentFER_class_schedule_id_fkey` FOREIGN KEY (`class_schedule_id`) REFERENCES `ClassSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
