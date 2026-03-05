export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { RoomBooking } from "./(components)/RoomBooking";
import { ClassManagement } from "./(components)/ClassManagement";
import { SessionGuard } from "@/components/SessionGuard";
import { getActiveMemberRole } from "@/lib/actions";
import { getSession } from "@/lib/actions";
import { forbidden, unauthorized } from "next/navigation";
import { getRooms } from "@/lib/actions";

export default async function Admin() {
  const [session, role] = await Promise.all([
    getSession(),
    getActiveMemberRole(),
  ]);

  if (!session) unauthorized();

  //Redirect to forbidden.tsx if user is not an admin
  if (role !== "admin" || !role) forbidden();

  const [sessions, trainers, rooms] = await Promise.all([
    prisma.classSession.findMany({
      where: {
        dateTime: {
          gte: new Date(),
        },
      },
      include: {
        //Joins with room and trainer tables
        room: true,
        trainer: true,
      },
    }),
    prisma.trainer.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
    getRooms(),
  ]);

  return (
    <>
      <div className="my-6 text-center">
        <div className="inline-flex items-center gap-3 justify-center mb-1">
          <div className="h-px w-8 bg-primary/50" />
          <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-primary/70">
            Admin
          </span>
          <div className="h-px w-8 bg-primary/50" />
        </div>
        <h1
          className="font-black uppercase leading-none text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
          }}
        >
          Admin Portal
        </h1>
      </div>
      <div className="flex flex-wrap items-start justify-center font-sans gap-8 py-6 px-4">
        <SessionGuard />
        <div className="flex flex-col gap-8 justify-center items-center">
          <RoomBooking sessions={sessions} />
        </div>
        <ClassManagement trainers={trainers} rooms={rooms} />
      </div>
    </>
  );
}
