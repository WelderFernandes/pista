/*
  Warnings:

  - You are about to drop the column `hourlyRate` on the `InstructorSettings` table. All the data in the column will be lost.
  - You are about to drop the column `pendingPayment` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `amount_in_cents` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstructorSettings" DROP COLUMN "hourlyRate",
ADD COLUMN     "hourly_rate_in_cents" INTEGER NOT NULL DEFAULT 12000;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "pendingPayment",
ADD COLUMN     "pending_payment_in_cents" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
ADD COLUMN     "amount_in_cents" INTEGER NOT NULL;
