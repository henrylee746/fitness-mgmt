/*Server Actions*/
"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ClassSessionExtended, Room } from "@/lib/types";

/*
 * @returns The session object
 * @throws An error if the session cannot be fetched
 */
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

/*
 * @returns The rooms object, array of Room objects
 * @throws An error if the rooms cannot be fetched
 */
export async function getRooms(): Promise<Room[]> {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return rooms;
  } catch (error) {
    throw new Error("Failed to get rooms");
  }
}

/*
 * @returns The active member role or null if no role is found
 */
export async function getActiveMemberRole(): Promise<string | null> {
  try {
    const roleData = await auth.api.getActiveMemberRole({
      headers: await headers(),
    });
    return roleData?.role ?? null;
  } catch {
    return null;
  }
}

/*
 * @param userId - The user id
 * @returns The member object
 * @throws An error if the member cannot be fetched
 */
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

/*
 * @returns The sessions object (ClassSessionExtended[])
 * @throws An error if the sessions cannot be fetched
 */
export async function getSessions(): Promise<ClassSessionExtended[]> {
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

/*
 * @param role - The role to update
 * @param userId - The user id
 * @returns The success or failure of the update
 */
export async function updateRole(
  role: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const member = await prisma.member.findUnique({
      where: { userId },
    });
    if (!member) {
      return { success: false, error: "Member not found" };
    }
    await prisma.member.update({
      where: { userId },
      data: { role },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update role" };
  }
}

/*
 * @param formData - The form data
 * @returns The success or failure of the update
 * @throws An error if the session room cannot be updated
 */
export async function updateSessionRoom(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const sessionId = formData.get("sessionId");
  const roomId = formData.get("roomId");

  if (!sessionId || !roomId) {
    return { success: false, error: "Missing sessionId or room" };
  }

  // Get current class session to check its capacity
  const classSession = await prisma.classSession.findUnique({
    where: { id: Number(sessionId) },
    select: { capacity: true },
  });

  if (!classSession) {
    return { success: false, error: "Session not found" };
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
    return { success: false, error: "Room not found" };
  }

  /*Client-side validation
  but there is also a trigger in the database that will throw an error
  if the session capacity exceeds the room capacity
  */
  if (classSession.capacity > room.capacity) {
    return {
      success: false,
      error: `Session capacity (${classSession.capacity}) cannot exceed room capacity (${room.capacity})`,
    };
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

  return { success: true };
}

/*
 * @param formData - The form data
 * @returns The success or failure of the creation
 * @throws An error if the session cannot be created
 */
export async function createSession(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
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
    return { success: false, error: "Room not found" };
  }

  /*Client-side validation
  but there is also a trigger in the database that will throw an error
  if the session capacity exceeds the room capacity
  */
  if (capacity > room.capacity) {
    return {
      success: false,
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
  } catch (error) {
    throw new Error("Failed to create session");
  }

  return { success: true };
}

/*
 * @param formData - The form data
 * @returns The organization id
 * @throws An error if the member cannot be registered
 */
export const registerMember = async (formData: FormData): Promise<string> => {
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
    // In a multi-tenant application with multiple gyms, this would be passed from the signup form
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

/*
 * @param formData - The form data
 * @returns Void
 * @throws An error if the member cannot be updated
 */
export const updateMember = async (formData: FormData): Promise<void> => {
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

/*
 * @param formData - The form data
 * @returns Void
 * @throws An error if the metrics cannot be updated
 */
export const updateMetrics = async (formData: FormData): Promise<void> => {
  const memberId = formData.get("memberId");
  const weight = formData.get("currWeight");
  const weightGoal = formData.get("weightTarget");
  const metricUpdateData: any = {};

  const COOLDOWN_MINUTES = 1;

  //Finds most recent metric for the member and grabs only the timestamp field
  const lastMetric = await prisma.healthMetric.findFirst({
    where: {
      memberId: Number(memberId),
    },
    orderBy: {
      timestamp: "desc",
    },
    select: {
      timestamp: true,
    },
  });

  if (lastMetric) {
    const minutesSince = (Date.now() - lastMetric.timestamp.getTime()) / 60000;
    if (minutesSince < COOLDOWN_MINUTES) {
      throw new Error("You must wait 1 minute between updating your metrics");
    }
  }

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

/*
 * @param formData - The form data
 * @returns The success or failure of the registration
 * @throws An error if the sessions cannot be registered
 */
export const registerSessions = async (
  _prevState: { success: boolean; error?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string }> => {
  const ids = formData.getAll("sessionIds") as string[];
  const memberId = formData.get("memberId") as string;

  const COOLDOWN_MINUTES = 1;

  const lastBooking = await prisma.booking.findFirst({
    where: {
      memberId: Number(memberId),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
    },
  });

  if (lastBooking) {
    const minutesSince = (Date.now() - lastBooking.createdAt.getTime()) / 60000;
    if (minutesSince < COOLDOWN_MINUTES) {
      return {
        success: false,
        error: "You must wait 1 minute between booking sessions",
      };
    }
  }

  if (ids.length === 0) return { success: true };
  try {
    await Promise.all(
      ids.map((id) =>
        prisma.booking.create({
          data: {
            memberId: Number(memberId),
            classSessionId: Number(id),
          },
        }),
      ),
    );
    revalidatePath("/member", "page");
    return { success: true };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("unique constraint")
    ) {
      return {
        success: false,
        error: "You are already registered for one or more of these sessions",
      };
    }
    throw new Error("Failed to create booking");
  }
};
