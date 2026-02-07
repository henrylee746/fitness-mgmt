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
  console.log("Seeding database...");

  // Clean up existing data first (in reverse order of dependencies)
  console.log("Cleaning up existing data...");
  await prisma.healthMetric.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.room.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.member.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  console.log("Cleaned up existing data");

  // Create Organization first (required for Members in RBAC schema)
  const organization = await prisma.organization.create({
    data: {
      id: "org_fitness_001",
      name: "FitnessPro Gym",
      slug: "fitnesspro-gym",
      logo: null,
      createdAt: new Date(),
      metadata: null,
    },
  });

  console.log("Created organization");

  // Create Users first (Better Auth users)
  // In production, these would be created via the signup flow
  // For seeding, we'll create them manually with hashed passwords
  const user1 = await prisma.user.create({
    data: {
      id: "user_henry_001",
      name: "Henry Lee",
      email: "henry@example.com",
      emailVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "user_sarah_002",
      name: "Sarah Kim",
      email: "sarah@example.com",
      emailVerified: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: "user_michael_003",
      name: "Michael Tran",
      email: "michael@example.com",
      emailVerified: true,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      id: "user_john_004",
      name: "John Peterson",
      email: "johnp@example.com",
      emailVerified: true,
    },
  });

  console.log("Created users");

  // Now create Members linked to Users and Organization
  const member1 = await prisma.member.create({
    data: {
      userId: user1.id,
      firstName: "Henry",
      lastName: "Lee",
      email: "henry@example.com",
      organizationId: organization.id,
      role: "member",
      createdAt: new Date(),
    },
  });

  const member2 = await prisma.member.create({
    data: {
      userId: user2.id,
      firstName: "Sarah",
      lastName: "Kim",
      email: "sarah@example.com",
      organizationId: organization.id,
      role: "member",
      createdAt: new Date(),
    },
  });

  const member3 = await prisma.member.create({
    data: {
      userId: user3.id,
      firstName: "Michael",
      lastName: "Tran",
      email: "michael@example.com",
      organizationId: organization.id,
      role: "admin", // Michael is an admin
      createdAt: new Date(),
    },
  });

  const member4 = await prisma.member.create({
    data: {
      userId: user4.id,
      firstName: "John",
      lastName: "Peterson",
      email: "johnp@example.com",
      organizationId: organization.id,
      role: "trainer",
      createdAt: new Date(),
    },
  });

  const createdMembers = [member1, member2, member3, member4];
  console.log("Created members linked to users and organization");

  // Trainers
  const trainer1 = await prisma.trainer.create({
    data: { name: "John Peterson", email: "johnp@example.com" },
  });

  const trainer2 = await prisma.trainer.create({
    data: { name: "Lisa Roberts", email: "lisa@example.com" },
  });

  const createdTrainers = [trainer1, trainer2];
  console.log("Created trainers");

  // Rooms
  const room1 = await prisma.room.create({
    data: { name: "Studio A", capacity: 20 },
  });

  const room2 = await prisma.room.create({
    data: { name: "Studio B", capacity: 15 },
  });

  const room3 = await prisma.room.create({
    data: { name: "Cycling Room", capacity: 12 },
  });

  const createdRooms = [room1, room2, room3];
  console.log("Created rooms");

  // Class Sessions (fitness classes) - using future dates
  const session1 = await prisma.classSession.create({
    data: {
      trainerId: createdTrainers[0].id,
      name: "Lifting with John",
      roomId: createdRooms[0].id,
      dateTime: new Date("2026-03-15T10:00:00"),
      capacity: 20,
    },
  });

  const session2 = await prisma.classSession.create({
    data: {
      trainerId: createdTrainers[0].id,
      name: "Yoga with John",
      roomId: createdRooms[1].id,
      dateTime: new Date("2026-03-20T14:00:00"),
      capacity: 15,
    },
  });

  const session3 = await prisma.classSession.create({
    data: {
      trainerId: createdTrainers[1].id,
      name: "Calisthenics with Lisa",
      roomId: createdRooms[2].id,
      dateTime: new Date("2026-03-22T18:00:00"),
      capacity: 12,
    },
  });

  const session4 = await prisma.classSession.create({
    data: {
      trainerId: createdTrainers[1].id,
      name: "Deep meditation with Lisa",
      roomId: createdRooms[0].id,
      dateTime: new Date("2026-03-25T09:00:00"),
      capacity: 10,
    },
  });

  const createdSessions = [session1, session2, session3, session4];
  console.log("Created class sessions");

  // Bookings (members booking class sessions)
  await prisma.booking.create({
    data: {
      memberId: createdMembers[0].id,
      classSessionId: createdSessions[0].id,
    },
  });

  await prisma.booking.create({
    data: {
      memberId: createdMembers[1].id,
      classSessionId: createdSessions[0].id,
    },
  });

  await prisma.booking.create({
    data: {
      memberId: createdMembers[1].id,
      classSessionId: createdSessions[2].id,
    },
  });

  await prisma.booking.create({
    data: {
      memberId: createdMembers[2].id,
      classSessionId: createdSessions[1].id,
    },
  });

  console.log("Created bookings");

  // Health Metrics
  await prisma.healthMetric.create({
    data: {
      memberId: createdMembers[0].id,
      weight: 184,
      weightGoal: 175,
    },
  });

  await prisma.healthMetric.create({
    data: {
      memberId: createdMembers[0].id,
      weight: 186,
      weightGoal: 176,
      timestamp: new Date("2026-02-01T12:00:00"),
    },
  });

  await prisma.healthMetric.create({
    data: {
      memberId: createdMembers[1].id,
      weight: 150,
      weightGoal: 145,
    },
  });

  await prisma.healthMetric.create({
    data: {
      memberId: createdMembers[2].id,
      weight: 170,
      weightGoal: 175,
    },
  });

  console.log("Created health metrics");

  console.log("Database seed completed successfully!");
  console.log("   - 1 Organization");
  console.log("   - 4 Users");
  console.log("   - 4 Members (linked to organization)");
  console.log("   - 2 Trainers");
  console.log("   - 3 Rooms");
  console.log("   - 4 Class Sessions");
  console.log("   - 4 Bookings");
  console.log("   - 4 Health Metrics");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
