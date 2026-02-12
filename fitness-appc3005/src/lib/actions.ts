/*Server Actions*/
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    throw new Error("Failed to get session");
  }
}

export async function getRooms() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        id: "asc"
      }
    })
    return rooms;
  } catch (error) {
    throw new Error("Failed to get rooms");
  }
};

export async function getActiveMemberRole() {
  try {
    const roleData = await auth.api.getActiveMemberRole({
      headers: await headers(),
    });
    return roleData?.role ?? null;
  } catch {
    return null;
  }
}

export async function getMember(userId: string) {
  try {
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
  } catch (error) {
    throw new Error("Failed to get member");
  }
}

export async function getSessions() {
  try {
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
  } catch (error) {
    throw new Error("Failed to get sessions");
  }
}

export async function updateSessionRoom(formData: FormData) {
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
    throw new Error("Session not found");
  }

  let room;
  try {
    room = await prisma.room.findUnique({
      where: { id: Number(roomId) },
      select: { capacity: true },
    });
  } catch (error) {
    throw new Error("Failed to update session room");
  }

  if (!room) {
    throw new Error("Room not found");
  }

  /*Client-side validation
  but there is also a trigger in the database that will throw an error
  if the session capacity exceeds the room capacity
  */
  if (classSession.capacity > room.capacity) {
    throw new Error(
      `Session capacity (${classSession.capacity}) cannot exceed room capacity (${room.capacity})`
    );
  }

  try {
    await prisma.classSession.update({
      where: { id: Number(sessionId) },
      data: { roomId: Number(roomId) },
    });
    // Re-fetch the table data after updating
    revalidatePath("/admin");
  } catch (error) {
    throw new Error("Failed to update session room");
  }
}

export async function createSession(formData: FormData) {
  const sessionName = formData.get("sessionName") as string;
  const capacity = Number(formData.get("capacity"));
  const trainerId = formData.get("trainer") as string;
  const roomId = formData.get("roomId") as string;

  const date = formData.get("date") as string;
  const time = formData.get("time") as string;

  // Combine into 1 ISO datetime if needed:
  const datetime = new Date(`${date}T${time}`);

  let room;
  try {
    room = await prisma.room.findUnique({
      where: { id: Number(roomId) },
      select: { capacity: true },
    });
  } catch (error) {
    throw new Error("Failed to create session");
  }

  if (!room) {
    throw new Error("Room not found");
  }

  /*Client-side validation
  but there is also a trigger in the database that will throw an error
  if the session capacity exceeds the room capacity
  */
  if (capacity > room.capacity) {
    throw new Error(
      `Session capacity (${capacity}) cannot exceed room capacity (${room.capacity})`
    );
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
  } catch (error) {
    throw new Error("Failed to create session");
  }
}

/*Register New Member*/
export const registerMember = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const requestedRole = (formData.get("role") as string)?.trim() ?? "";
  const allowedRoles = (
    process.env.ALLOWED_SIGNUP_ROLES ?? "member,trainer,admin"
  )
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
  const safeAllowedRoles = allowedRoles.length > 0 ? allowedRoles : ["member"];

  // Intentional: signup allows user-selected roles, constrained by allowlist.
  const role = safeAllowedRoles.includes(requestedRole)
    ? requestedRole
    : safeAllowedRoles[0];

  try {
    // Get or create a default organization for new members
    // In a full RBAC implementation with multiple gyms, this would be passed from the signup form
    let organization = await prisma.organization.findFirst({
      where: {
        slug: "fitnesspro-gym",
      },
    });

    if (!organization) {
      // Create a default organization if none exists
      organization = await prisma.organization.create({
        data: {
          id: `org_${Date.now()}`,
          name: "Default Organization",
          slug: "default-org",
          createdAt: new Date(),
        },
      });
    }

    await prisma.member.create({
      data: {
        userId,
        email,
        firstName,
        lastName,
        organizationId: organization.id,
        role,
        createdAt: new Date(),
      },
    });
    revalidatePath("/member", "page");
    return organization.id;
  } catch (error) {
    throw new Error("Failed to register member");
  }
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
  try {
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
  } catch (error) {
    throw new Error("Failed to update member profile");
  }
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

  try {
    await prisma.healthMetric.create({
      data: metricUpdateData,
    });
    revalidatePath("/member", "page");
  } catch (error) {
    throw new Error("Failed to create health metric");
  }
};

export const registerSessions = async (formData: FormData) => {
  const ids = formData.getAll("sessionIds") as string[];
  const memberId = formData.get("memberId") as string;

  if (ids.length === 0) return;
  try {
    ids.map(async (id) => {
      await prisma.booking.create({
        data: {
          memberId: Number(memberId),
          classSessionId: Number(id),
        },
      });
    });
    revalidatePath("/member", "page");
  }
  catch (error) {
    throw new Error("Failed to create booking");
    }
};
