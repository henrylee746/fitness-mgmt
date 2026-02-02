/*Admin Panel Operations*/
"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EmailTemplate } from "../components/EmailTemplate";
import { Resend } from "resend";

export async function getMember(userId: string) {
  const member = await prisma.member.findUnique({
    where: { userId },
    include: {
      metrics: true,
      bookings: {
        include: {
          classSession: true,
        },
      },
    },
  });
  return member;
}

export async function getSessions() {
  const sessions = await prisma.classSession.findMany({
    where: {
      dateTime: {
        gte: new Date(),
      },
    },
    include: {
      room: true,
      trainer: true,
    },
  });
  return sessions;
}

export async function updateSessionRoom(initialState: any, formData: FormData) {
  const sessionId = formData.get("sessionId");
  const roomId = formData.get("roomId");

  if (!sessionId || !roomId) {
    throw new Error("Missing sessionId or room");
  }

  // Get current class session to check its capacity
  const classSession = await prisma.classSession.findUnique({
    where: { id: Number(sessionId) },
    select: { capacity: true },
  });

  if (!classSession) {
    return {
      success: undefined,
      error: "Session not found",
    };
  }

  // Validate that session capacity does not exceed new room capacity
  const room = await prisma.room.findUnique({
    where: { id: Number(roomId) },
    select: { capacity: true },
  });

  if (!room) {
    return {
      success: undefined,
      error: "Room not found",
    };
  }

  /*Application-level validation,
  but database-level validation would 
  throw same error even if this conditional is removed
  */

  if (classSession.capacity > room.capacity) {
    return {
      success: undefined,
      error: `Session capacity (${classSession.capacity}) cannot exceed room capacity (${room.capacity})`,
    };
  }

  await prisma.classSession.update({
    where: { id: Number(sessionId) },
    data: { roomId: Number(roomId) },
  });

  // Re-fetch the table data after updating
  revalidatePath("/admin");

  return {
    success: "Session room updated successfully",
    error: undefined,
  };
}

export async function createSession(initialState: any, formData: FormData) {
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
    return {
      success: undefined,
      error: "Room not found",
    };
  }

  if (capacity > room.capacity) {
    return {
      success: undefined,
      error: `Session capacity (${capacity}) cannot exceed room capacity (${room.capacity})`,
    };
  }

  try {
    await prisma.classSession.create({
      data: {
        name: sessionName,
        capacity,
        trainerId: Number(trainerId),
        roomId: Number(roomId),
        dateTime: datetime,
      },
    });
    revalidatePath("/admin");

    return {
      success: "Session created successfully",
      error: undefined,
    };
  } catch (error: any) {
    return {
      success: undefined,
      error: error.message,
    };
  }
}

/*Register New Member*/
export const registerMember = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  await prisma.member.create({
    data: { userId, email, firstName, lastName },
  });
  revalidatePath("/member", "page");
};

/*Update Profile Details, including making/updating weight metric & target*/

export const updateMember = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const email = formData.get("email") as string | null;
  const firstName = formData.get("firstName") as string | null;
  const lastName = formData.get("lastName") as string | null;

  const memberUpdateData: any = {};
  const userUpdateData: any = {};

  if (!email && !firstName && !lastName) return;

  // Update Member fields
  if (email) memberUpdateData.email = email;
  if (firstName) memberUpdateData.firstName = firstName;
  if (lastName) memberUpdateData.lastName = lastName;

  // Update User fields (email and name)
  if (email) userUpdateData.email = email;

  // Ensures both updates are atomic (both succeed or both fail)
  await prisma.$transaction(async (tx) => {
    if (firstName || lastName) {
      // Construct full name for User model using a consistent read
      const member = await tx.member.findUnique({
        where: { userId },
        select: { firstName: true, lastName: true },
      });

      const updatedFirstName = firstName || member?.firstName || "";
      const updatedLastName = lastName || member?.lastName || "";
      userUpdateData.name = `${updatedFirstName} ${updatedLastName}`;
    }

    await tx.member.update({
      where: { userId },
      data: memberUpdateData,
    });

    await tx.user.update({
      where: { id: userId },
      data: userUpdateData,
    });
  });

  revalidatePath("/member", "page");
};

export const updateMetrics = async (formData: FormData) => {
  const memberId = formData.get("memberId");

  const weight = formData.get("currWeight");
  const weightGoal = formData.get("weightTarget");
  const metricUpdateData: any = {};

  if (weight) metricUpdateData.weight = Number(weight);
  if (weightGoal) metricUpdateData.weightGoal = Number(weightGoal);

  if (weight || weightGoal) {
    metricUpdateData.timestamp = new Date();
    metricUpdateData.memberId = Number(memberId);
  }

  await prisma.healthMetric.create({
    data: metricUpdateData,
  });
  revalidatePath("/member", "page");
};

export const registerSessions = async (formData: FormData) => {
  const ids = formData.getAll("sessionIds") as string[];
  const memberId = formData.get("memberId") as string;

  if (ids.length === 0) return;
  ids.map(async (id) => {
    await prisma.booking.create({
      data: {
        memberId: Number(memberId),
        classSessionId: Number(id),
      },
    });
  });
  revalidatePath("/member", "page");
};
