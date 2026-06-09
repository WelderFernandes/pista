/*
  Warnings:

  - You are about to alter the column `hourlyRate` on the `InstructorSettings` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `pendingPayment` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "InstructorSettings" ALTER COLUMN "hourlyRate" SET DEFAULT 12000,
ALTER COLUMN "hourlyRate" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "pendingPayment" SET DEFAULT 0,
ALTER COLUMN "pendingPayment" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE INTEGER;
