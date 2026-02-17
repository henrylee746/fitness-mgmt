import prisma from "@/lib/prisma";
import RoomBooking from "./(components)/RoomBooking";
import ClassManagement from "./(components)/ClassManagement";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionGuard } from "@/components/SessionGuard";
import { getActiveMemberRole } from "@/lib/actions";
import { getSession } from "@/lib/actions";

export default async function Admin() {
  try {
    const session = await getSession()

    if (!session) {
      return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">Not Authorized. Please sign in to access your account.
        <Button asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
      </div>;
    }

    // Use server-side auth to get organization role
    const role = await getActiveMemberRole()

    if (role !== "admin" || !role) {
      return (
        <div className="text-center text-2xl min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
          You do not have the role of admin to access this page.
        </div>
      )
    }

    const [sessions, trainers] = await Promise.all([
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
      prisma.trainer.findMany(),
    ]);

    return (
      <>
        <div className="my-6 text-center">
          <div className="inline-flex items-center gap-3 justify-center mb-1">
            <div className="h-px w-8 bg-primary/50" />
            <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-primary/70">Admin</span>
            <div className="h-px w-8 bg-primary/50" />
          </div>
          <h1
            className="font-black uppercase leading-none text-foreground"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
          >
            Admin Portal
          </h1>
        </div>
        <div className="flex flex-wrap items-start justify-center font-sans gap-8 py-6 px-4">
          <SessionGuard />
          <RoomBooking sessions={sessions} />
          <ClassManagement trainers={trainers} />
        </div>
      </>
    );
  } catch (error) {
    return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
      {error instanceof Error ? error.message : "Something went wrong."} Please contact support if the issue persists.
    </div>
  }
}
