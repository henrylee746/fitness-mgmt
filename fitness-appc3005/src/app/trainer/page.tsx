import GroupClass from "./(components)/GroupClass";
import MemberSearch from "./(components)/MemberSearch";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionGuard } from "@/components/SessionGuard";


export default async function Trainer() {
  const data = await auth.api.getSession({
    headers: await headers()
  })

  if (!data?.session) {
    return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
      Not Authorized. Please sign in to access your account.
      <Button asChild>
        <Link href="/signin">Sign in</Link>
      </Button>
    </div>;
  }

  // Use server-side auth to get organization role
  const roleData = await auth.api.getActiveMemberRole({
    headers: await headers()
  })
  const role = roleData?.role

  if (role !== "trainer" || !role) {
    return (
      <div className="text-center text-2xl 
            font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        You do not have the role of trainer to access this page.
      </div>
    )
  }

  return (
    <>
      <h1 className="max-w-s mb-4 text-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Trainers
      </h1>
      <div className="h-full flex flex-col lg:flex-row flex-1 items-center justify-center font-sans gap-8 p-4">
        <SessionGuard />
        <GroupClass />
        <MemberSearch />
      </div>
    </>
  );
}
