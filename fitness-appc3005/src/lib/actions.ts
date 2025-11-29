/*Admin Panel Operations*/
"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSessionRoom(formData: FormData) {
  const sessionId = formData.get("sessionId");
  const roomId = formData.get("roomId");

  if (!sessionId || !roomId) {
    throw new Error("Missing sessionId or room");
  }

  // Get current session to check its capacity
  const session = await prisma.session.findUnique({
    where: { id: Number(sessionId) },
    select: { capacity: true },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  // Validate that session capacity does not exceed new room capacity
  const room = await prisma.room.findUnique({
    where: { id: Number(roomId) },
    select: { capacity: true },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  if (session.capacity > room.capacity) {
    throw new Error(
      `Session capacity (${session.capacity}) cannot exceed room capacity (${room.capacity})`
    );
  }

  await prisma.session.update({
    where: { id: Number(sessionId) },
    data: { roomId: Number(roomId) },
  });

  // Re-fetch the table data after updating
  revalidatePath("/admin");
}

export async function createSession(formData: FormData) {
  const sessionName = formData.get("sessionName") as string;
  const capacity = Number(formData.get("capacity"));
  const trainerId = formData.get("trainer") as string;
  const roomId = formData.get("roomId") as string;

  const date = formData.get("date") as string; // in format e.g. "2025-03-05"
  const time = formData.get("time") as string; // in format e.g. "10:30:00"

  // Combine into 1 ISO datetime if needed:
  const datetime = new Date(`${date}T${time}`);

  // Validate that session capacity does not exceed room capacity
  const room = await prisma.room.findUnique({
    where: { id: Number(roomId) },
    select: { capacity: true },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  if (capacity > room.capacity) {
    throw new Error(
      `Session capacity (${capacity}) cannot exceed room capacity (${room.capacity})`
    );
  }

  await prisma.session.create({
    data: {
      name: sessionName,
      capacity,
      trainerId: Number(trainerId),
      roomId: Number(roomId),
      dateTime: datetime,
    },
  });

  revalidatePath("/admin");
}

/*Register New Member*/
export const registerMember = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  await prisma.member.create({
    data: { email, firstName, lastName },
  });
  revalidatePath("/member/[[...id]]", "page");
};

/*Update Profile Details, including making/updating weight metric & target*/

export const updateMember = async (formData: FormData) => {
  const email = formData.get("email") as string | null;
  const firstName = formData.get("firstName") as string | null;
  const lastName = formData.get("lastName") as string | null;

  const id = Number(formData.get("memberId"));

  const memberUpdateData: any = {};

  if (!email && !firstName && !lastName) return;
  if (email) memberUpdateData.email = email;
  if (firstName) memberUpdateData.firstName = firstName;
  if (lastName) memberUpdateData.lastName = lastName;

  await prisma.member.update({
    where: { id },
    data: memberUpdateData,
  });

  revalidatePath("/member/[[...id]]", "page");
};

export const updateMetrics = async (formData: FormData) => {
  const id = Number(formData.get("memberId"));

  const weight = formData.get("currWeight");
  const weightGoal = formData.get("weightTarget");
  const metricUpdateData: any = {};

  if (weight) metricUpdateData.weight = Number(weight);
  if (weightGoal) metricUpdateData.weightGoal = Number(weightGoal);

  if (weight || weightGoal) {
    metricUpdateData.timestamp = new Date();
    metricUpdateData.memberId = id;
  }

  await prisma.healthMetric.create({
    data: metricUpdateData,
  });
  revalidatePath("/member/[[...id]]", "page");
};

export const registerSessions = async (formData: FormData) => {
  const ids = formData.getAll("sessionIds") as string[];
  const memberId = formData.get("memberId") as string;

  if (ids.length === 0) return;
  ids.map(async (id) => {
    await prisma.booking.create({
      data: {
        memberId: Number(memberId),
        sessionId: Number(id),
      },
    });
  });
  revalidatePath("/member/[[...id]]", "page");
};
