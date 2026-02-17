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
      return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
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
        <div className="text-center text-2xl min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
          You do not have the role of trainer to access this page.
        </div>
      )
    }
  } catch (error) {
    return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
      {error instanceof Error ? error.message : "Something went wrong."} Please contact support if the issue persists.
    </div>

  }

  return (
    <>
      <div className="my-6 text-center">
        <div className="inline-flex items-center gap-3 justify-center mb-1">
          <div className="h-px w-8 bg-primary/50" />
          <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-primary/70">Trainer Portal</span>
          <div className="h-px w-8 bg-primary/50" />
        </div>
        <h1
          className="font-black uppercase leading-none text-foreground"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
        >
          Trainers
        </h1>
      </div>
      <div className="flex flex-wrap items-start justify-center font-sans gap-8 py-6 px-4">
        <SessionGuard />
        <GroupClass />
        <MemberSearch />
      </div>
    </>
  );
}
