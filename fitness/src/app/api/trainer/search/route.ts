import prisma from "@/lib/prisma";
import { getSession } from "@/lib/actions";
import { getActiveMemberRole } from "@/lib/actions";
/*Filters Sessions by Trainer*/
export async function POST(req: Request) {
  try {
    const session = await getSession();
    const activeMemberRole = await getActiveMemberRole();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (activeMemberRole !== "trainer") {
      return new Response(
        JSON.stringify({
          error: "You do not have the role of trainer to access this page.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { id } = await req.json(); // parse JSON from request body
    if (!id) {
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
      return new Response(JSON.stringify(sessions), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const sessions = await prisma.classSession.findMany({
        where: {
          trainerId: Number(id),
          dateTime: {
            gte: new Date(),
          },
        },
        include: {
          room: true,
          trainer: true,
        },
      });
      return new Response(JSON.stringify(sessions), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to search trainer" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
