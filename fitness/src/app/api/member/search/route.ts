import prisma from "@/lib/prisma";
/*Member Search Functionality in Trainers tab*/
export async function POST(req: Request) {
  try {
    const { name } = await req.json(); // parse JSON from request body
    if (!name) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    //Regex to split name into first and last name if there is 1 or more spaces
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts[1];

    const members = await prisma.memberInfo.findMany({
      where: lastName
        ? {
            AND: [
              { firstName: { equals: firstName, mode: "insensitive" } },
              { lastName: { equals: lastName, mode: "insensitive" } },
            ],
          }
        : {
            //If only one word, see if it matches either first or last name
            OR: [
              { firstName: { equals: firstName, mode: "insensitive" } },
              { lastName: { equals: firstName, mode: "insensitive" } },
            ],
          },
    });

    return new Response(JSON.stringify(members), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to search members" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
