/*
  Warnings:

  - You are about to drop the column `createdAt` on the `member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "member" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "organization" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
