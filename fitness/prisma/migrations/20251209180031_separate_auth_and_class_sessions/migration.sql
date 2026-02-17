/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Booking` table. All the data in the column will be lost.
  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `capacity` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `dateTime` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `trainerId` on the `session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberId,classSessionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classSessionId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_roomId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_trainerId_fkey";

-- DropIndex
DROP INDEX "Booking_memberId_sessionId_key";

-- DropIndex
DROP INDEX "Booking_sessionId_idx";

-- DropIndex
DROP INDEX "session_trainerId_dateTime_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "sessionId",
ADD COLUMN     "classSessionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "session" DROP CONSTRAINT "session_pkey",
DROP COLUMN "capacity",
DROP COLUMN "dateTime",
DROP COLUMN "name",
DROP COLUMN "roomId",
DROP COLUMN "trainerId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "session_id_seq";

-- CreateTable
CREATE TABLE "class_session" (
    "id" SERIAL NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "class_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "class_session_trainerId_dateTime_idx" ON "class_session"("trainerId", "dateTime");

-- CreateIndex
CREATE INDEX "Booking_classSessionId_idx" ON "Booking"("classSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_memberId_classSessionId_key" ON "Booking"("memberId", "classSessionId");

-- AddForeignKey
ALTER TABLE "class_session" ADD CONSTRAINT "class_session_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_session" ADD CONSTRAINT "class_session_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "class_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
