import { getMember, getSessions } from "@/lib/actions";
import ProfileManagement from "./(components)/ProfileManagement";
import MemberDashboard from "./(components)/MemberDashboard";
import GroupClass from "./(components)/GroupClass";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionGuard } from "@/components/SessionGuard";

export default async function Members() {
  const data = await auth.api.getSession({
    headers: await headers()
  })


  if (!data?.session) {
    return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Not Authorized. Please sign in to access your account.
      <Button asChild>
        <Link href="/signin">Sign in</Link>
      </Button>
    </div>;
  }
  const { user, session } = data;
  if (!user) {
    return <div className="text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">User not found.</div>;
  }

  const member = await getMember(data.user.id);
  if (!member) {
    return <div
      className="text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Member not found. </div>;
  }

  // Use server-side auth to get organization role
  const roleData = await auth.api.getActiveMemberRole({
    headers: await headers()
  })
  const role = roleData?.role;


  const sessions = await getSessions();


  return (
    <>
      <SessionGuard />
      <h1 className="mb-4 max-w-s text-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Member's Hub
      </h1>
      <div
        className={`flex justify-center items-center flex-wrap gap-6 lg:gap-8  $font-sans`}
      >
        <ProfileManagement userId={user.id} memberId={member.id} />
        <div className="flex flex-col gap-6">
          <MemberDashboard member={member} />
          <GroupClass sessions={sessions} member={member} />
        </div>
      </div>
    </>
  );
}
