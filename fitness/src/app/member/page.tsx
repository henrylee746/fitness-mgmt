export const dynamic = "force-dynamic";

import { getSessions, getMember } from "@/lib/actions";
import { Suspense } from "react";
import { ProfileManagement } from "./(components)/ProfileManagement";
import { MemberDashboard } from "./(components)/MemberDashboard";
import { GroupClass } from "./(components)/GroupClass";
import { SessionGuard } from "@/components/SessionGuard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession } from "@/lib/actions";
import { unauthorized } from "next/navigation";
import { SkeletonCard } from "@/components/SkeletonCard";
import {
  ClassSessionWithRoomAndTrainer,
  MemberWithBookingsAndMetrics,
} from "@/lib/types";

export default async function Members() {
  const session = await getSession();

  if (!session) unauthorized();

  const member: MemberWithBookingsAndMetrics | null = await getMember(
    session.user.id,
  );

  if (!member) {
    return (
      <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
        Member not found. If you haven't chosen your roles, select them in your
        onboarding page:
        <Button asChild>
          <Link href="/onboarding">Onboarding</Link>
        </Button>
      </div>
    );
  }
  const { user } = session; //Should never be null since we checked for session above

  async function GroupClassLoader() {
    const sessions: ClassSessionWithRoomAndTrainer[] = await getSessions();
    return <GroupClass sessions={sessions} member={member} />;
  }

  return (
    <>
      <SessionGuard />
      <div className="my-6 text-center">
        <div className="inline-flex items-center gap-3 justify-center mb-1">
          <div className="h-px w-8 bg-primary/50" />
          <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-primary/70">
            Member Portal
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
          Member's Hub
        </h1>
      </div>
      <div className="flex justify-center items-start flex-wrap gap-6 lg:gap-8 font-sans py-6 px-4">
        <ProfileManagement userId={user.id} memberId={member.id} />
        <div className="flex flex-col items-center justify-center gap-6">
          <MemberDashboard member={member} />
          <Suspense
            fallback={
              <SkeletonCard className="w-full xl:max-w-2xl lg:max-w-lg md:max-w-md sm:max-w-md sm:max-w-sm max-w-xs" />
            }
          >
            <GroupClassLoader />
          </Suspense>
        </div>
      </div>
    </>
  );
}
