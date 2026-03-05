export const dynamic = "force-dynamic";

import { GroupClass } from "./(components)/GroupClass";
import { MemberSearch } from "./(components)/MemberSearch";
import { SessionGuard } from "@/components/SessionGuard";
import { getActiveMemberRole, getSession } from "@/lib/actions";
import { forbidden, unauthorized } from "next/navigation";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/SkeletonCard";

export default async function Trainer() {
  const [session, role] = await Promise.all([
    getSession(),
    getActiveMemberRole(),
  ]);

  if (!session) unauthorized();

  //Forbidden if user is not a trainer
  if (role !== "trainer" || !role) forbidden();

  return (
    <>
      <div className="my-6 text-center">
        <div className="inline-flex items-center gap-3 justify-center mb-1">
          <div className="h-px w-8 bg-primary/50" />
          <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-primary/70">
            Trainer Portal
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
          Trainers
        </h1>
      </div>
      <div className="flex flex-wrap items-start justify-center font-sans gap-8 py-6 px-4">
        <SessionGuard />
        <Suspense
          fallback={
            <SkeletonCard className="w-full xl:max-w-xl md:max-w-lg max-w-xs" />
          }
        >
          <GroupClass />
        </Suspense>
        <MemberSearch />
      </div>
    </>
  );
}
