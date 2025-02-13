-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `online_status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserDetails` (
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `course` VARCHAR(191) NOT NULL,
    `profile_image` LONGBLOB NOT NULL,

    UNIQUE INDEX `UserDetails_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classroom_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date_schedule` VARCHAR(191) NOT NULL,
    `classroom_teacher_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassStudent` (
    `classroom_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `grades` DECIMAL(65, 30) NOT NULL,

    UNIQUE INDEX `ClassStudent_classroom_id_key`(`classroom_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classroom_id` INTEGER NOT NULL,
    `date_schedule` VARCHAR(191) NOT NULL,
    `time_start` VARCHAR(191) NOT NULL,
    `time_end` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassLessonPlanTimeline` (
    `classsched_id` INTEGER NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ClassLessonPlanTimeline_classsched_id_key`(`classsched_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassStudentAttendance` (
    `classsched_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `grades` DECIMAL(65, 30) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ClassStudentAttendance_classsched_id_key`(`classsched_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassStudentFER` (
    `classsched_id` INTEGER NOT NULL,
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

    UNIQUE INDEX `ClassStudentFER_classsched_id_key`(`classsched_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime_stamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `color_code` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
