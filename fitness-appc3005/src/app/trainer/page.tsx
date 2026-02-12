import GroupClass from "./(components)/GroupClass";
import MemberSearch from "./(components)/MemberSearch";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionGuard } from "@/components/SessionGuard";
import { getActiveMemberRole, getSession } from "@/lib/actions";


export default async function Trainer() {
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

    // Use server-side auth to get organization role
    const role = await getActiveMemberRole()

    if (role !== "trainer" || !role) {
      return (
        <div className="text-center text-2xl min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          You do not have the role of trainer to access this page.
        </div>
      )
    }
  } catch (error) {
    return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
      Failed to get session: ${error instanceof Error ? error.message : "Unknown error"} Please contact if the issue persists.
    </div>

  }

  return (
    <>
      <h1 className="max-w-s my-4 text-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Trainers
      </h1>
      <div className="min-h-[80vh] flex flex-wrap items-center justify-center font-sans gap-8 p-4">
        <SessionGuard />
        <GroupClass />
        <MemberSearch />
      </div>
    </>
  );
}
