import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  // --------------------------------------------------
  // Members
  // --------------------------------------------------
  const members = await prisma.member.createMany({
    data: [
      { firstName: "Henry", lastName: "Lee", email: "henry@example.com" },
      { firstName: "Sarah", lastName: "Kim", email: "sarah@example.com" },
      { firstName: "Michael", lastName: "Tran", email: "michael@example.com" },
    ],
  });

  // Fetch IDs (createMany doesn't return inserted rows)
  const createdMembers = await prisma.member.findMany();

  // --------------------------------------------------
  // Trainers
  // --------------------------------------------------
  const trainers = await prisma.trainer.createMany({
    data: [
      { name: "John Peterson", email: "johnp@example.com" },
      { name: "Lisa Roberts", email: "lisa@example.com" },
    ],
  });

  const createdTrainers = await prisma.trainer.findMany();

  // --------------------------------------------------
  // Rooms
  // --------------------------------------------------
  const rooms = await prisma.room.createMany({
    data: [
      { name: "Studio A", capacity: 20 },
      { name: "Studio B", capacity: 15 },
      { name: "Cycling Room", capacity: 12 },
    ],
  });

  const createdRooms = await prisma.room.findMany();

  // --------------------------------------------------
  // Sessions
  // --------------------------------------------------
  const sessions = await prisma.session.createMany({
    data: [
      {
        trainerId: createdTrainers[0].id,
        name: "Lifting with John",
        roomId: createdRooms[0].id,
        dateTime: new Date("2025-01-10T10:00:00"),
        capacity: 20,
      },
      {
        trainerId: createdTrainers[0].id,
        name: "Yoga with John",
        roomId: createdRooms[1].id,
        dateTime: new Date("2025-01-11T14:00:00"),
        capacity: 15,
      },
      {
        trainerId: createdTrainers[1].id,
        name: "Calisthenics with Lisa",
        roomId: createdRooms[2].id,
        dateTime: new Date("2025-01-12T18:00:00"),
        capacity: 12,
      },
      {
        trainerId: createdTrainers[1].id,
        name: "Deep meditation with Lisa",
        roomId: createdRooms[0].id,
        dateTime: new Date("2025-01-13T09:00:00"),
        capacity: 20,
      },
    ],
  });

  const createdSessions = await prisma.session.findMany();

  // --------------------------------------------------
  // Bookings (avoid duplicates due to @@unique constraint)
  // --------------------------------------------------
  await prisma.booking.createMany({
    data: [
      {
        memberId: createdMembers[0].id,
        sessionId: createdSessions[0].id,
      },
      {
        memberId: createdMembers[1].id,
        sessionId: createdSessions[0].id,
      },
      {
        memberId: createdMembers[1].id,
        sessionId: createdSessions[2].id,
      },
      {
        memberId: createdMembers[2].id,
        sessionId: createdSessions[1].id,
      },
    ],
    skipDuplicates: true,
  });

  // --------------------------------------------------
  // Health Metrics
  // --------------------------------------------------
  await prisma.healthMetric.createMany({
    data: [
      {
        memberId: createdMembers[0].id,
        weight: 184,
      },
      {
        memberId: createdMembers[0].id,
        weight: 186,
        timestamp: new Date("2025-01-05T12:00:00"),
      },
      {
        memberId: createdMembers[1].id,
        weight: 150,
      },
      {
        memberId: createdMembers[2].id,
        weight: 170,
      },
    ],
  });

  console.log("✔️ Database seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
