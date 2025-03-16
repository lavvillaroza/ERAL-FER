/*
  Warnings:

  - You are about to drop the column `remarks` on the `ClassStudentsFER` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `ClassStudentsFER` table. All the data in the column will be lost.
  - You are about to alter the column `surprised` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,2)` to `Decimal(10,2)`.
  - You are about to alter the column `happy` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,2)` to `Decimal(10,2)`.
  - You are about to alter the column `neutral` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,2)` to `Decimal(10,2)`.
  - You are about to alter the column `sad` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,2)` to `Decimal(10,2)`.
  - You are about to alter the column `angry` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,2)` to `Decimal(10,2)`.
  - You are about to alter the column `disgusted` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,2)` to `Decimal(10,2)`.
  - You are about to alter the column `fearful` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,2)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `ClassStudentsFER` DROP COLUMN `remarks`,
    DROP COLUMN `result`,
    MODIFY `surprised` DECIMAL(10, 2) NOT NULL,
    MODIFY `happy` DECIMAL(10, 2) NOT NULL,
    MODIFY `neutral` DECIMAL(10, 2) NOT NULL,
    MODIFY `sad` DECIMAL(10, 2) NOT NULL,
    MODIFY `angry` DECIMAL(10, 2) NOT NULL,
    MODIFY `disgusted` DECIMAL(10, 2) NOT NULL,
    MODIFY `fearful` DECIMAL(10, 2) NOT NULL;
