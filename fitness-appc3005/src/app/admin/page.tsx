import prisma from "@/lib/prisma";
import RoomBooking from "./(components)/RoomBooking";
import ClassManagement from "./(components)/ClassManagement";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionGuard } from "@/components/SessionGuard";
import { getActiveMemberRole } from "@/lib/actions";
import { getSession } from "@/lib/actions";

export default async function Admin() {
  const session = await getSession()

  if (!session) {
    return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Not Authorized. Please sign in to access your account.
      <Button asChild>
        <Link href="/signin">Sign in</Link>
      </Button>
    </div>;
  }

  // Use server-side auth to get organization role
  const role = await getActiveMemberRole()

  if (role !== "admin" || !role) {
    return (
      <div className="text-center text-2xl 
            font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        You do not have the role of admin.
      </div>
    )
  }

  const sessions = await prisma.classSession.findMany({
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
  });

  const trainers = await prisma.trainer.findMany();

  return (
    <>
      <h1 className="max-w-s mb-4 text-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Admin Portal
      </h1>
      <div className="h-full flex flex-col lg:flex-row flex-wrap flex-1 items-center justify-center font-sans gap-8 p-4">
        <SessionGuard />
        <RoomBooking sessions={sessions} />
        <ClassManagement trainers={trainers} />
      </div>
    </>
  );
}
