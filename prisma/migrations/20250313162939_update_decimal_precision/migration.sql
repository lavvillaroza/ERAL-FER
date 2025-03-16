/*
  Warnings:

  - You are about to alter the column `surprised` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(2,2)`.
  - You are about to alter the column `happy` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(2,2)`.
  - You are about to alter the column `neutral` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(2,2)`.
  - You are about to alter the column `sad` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(2,2)`.
  - You are about to alter the column `angry` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(2,2)`.
  - You are about to alter the column `disgusted` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(2,2)`.
  - You are about to alter the column `fearful` on the `ClassStudentsFER` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(2,2)`.

*/
-- AlterTable
ALTER TABLE `ClassStudentsFER` MODIFY `surprised` DECIMAL(2, 2) NOT NULL,
    MODIFY `happy` DECIMAL(2, 2) NOT NULL,
    MODIFY `neutral` DECIMAL(2, 2) NOT NULL,
    MODIFY `sad` DECIMAL(2, 2) NOT NULL,
    MODIFY `angry` DECIMAL(2, 2) NOT NULL,
    MODIFY `disgusted` DECIMAL(2, 2) NOT NULL,
    MODIFY `fearful` DECIMAL(2, 2) NOT NULL;
