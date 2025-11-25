import prisma from "../../../../../lib/prisma";

/*Filters Sessions by Trainer*/
export async function POST(req: Request) {
  try {
    const { id } = await req.json(); // parse JSON from request body
    if (!id) {
      const sessions = await prisma.session.findMany({
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
      const sessions = await prisma.session.findMany({
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
