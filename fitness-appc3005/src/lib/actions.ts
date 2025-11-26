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
  const sessionName = formData.get("sessionName");
}
