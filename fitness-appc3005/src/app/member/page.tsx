import { getSessions, getMember } from "@/lib/actions";
import ProfileManagement from "./(components)/ProfileManagement";
import MemberDashboard from "./(components)/MemberDashboard";
import GroupClass from "./(components)/GroupClass";
import { SessionGuard } from "@/components/SessionGuard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession } from "@/lib/actions";

export default async function Members() {

  try {
    const session = await getSession()

    if (!session) {
      return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Not Authorized. Please sign in to access your account.
        <Button asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
      </div>;
    }

    const member = await getMember(session.user.id);
    if (!member) {
      return <div
        className="text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Member not found. </div>;
    }

    const sessions = await getSessions();
    const { user } = session;   //Should never be null since we checked for session above

    return (
      <>
        <SessionGuard />
        <h1 className="my-4 max-w-s text-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Member's Hub
        </h1>
        <div
          className="flex justify-center items-start flex-wrap gap-6 lg:gap-8 font-sans py-6 px-4"
        >
          <ProfileManagement userId={user.id} memberId={member.id} />
          <div className="flex flex-col items-center justify-center gap-6">
            <MemberDashboard member={member} />
            <GroupClass sessions={sessions} member={member} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
      Failed to get session: ${error instanceof Error ? error.message : "Unknown error"} Please contact if the issue persists.
    </div>
  }
}
