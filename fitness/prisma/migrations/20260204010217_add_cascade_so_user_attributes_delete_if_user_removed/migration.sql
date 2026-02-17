-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_memberId_fkey";

-- DropForeignKey
ALTER TABLE "HealthMetric" DROP CONSTRAINT "HealthMetric_memberId_fkey";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthMetric" ADD CONSTRAINT "HealthMetric_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
