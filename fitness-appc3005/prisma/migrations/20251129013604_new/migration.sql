-- CreateIndex
CREATE INDEX "Booking_sessionId_idx" ON "Booking"("sessionId");

-- CreateIndex
CREATE INDEX "HealthMetric_memberId_timestamp_idx" ON "HealthMetric"("memberId", "timestamp");

-- CreateIndex
CREATE INDEX "Session_trainerId_dateTime_idx" ON "Session"("trainerId", "dateTime");
