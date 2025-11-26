/*Admin Panel Operations*/
"use server";
import prisma from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSessionRoom(formData: FormData) {
  const sessionId = formData.get("sessionId");
  const roomId = formData.get("roomId");

  if (!sessionId || !roomId) {
    throw new Error("Missing sessionId or room");
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

  await prisma.session.create({
    data: {
      name: sessionName,
      capacity,
      trainerId: Number(trainerId),
      roomId: Number(roomId),
      dateTime: datetime,
    },
  });

  revalidatePath("/sessions");
}
