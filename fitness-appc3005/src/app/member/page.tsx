import { getMember, getSessions } from "@/lib/actions";
import ProfileManagement from "./(components)/ProfileManagement";
import MemberDashboard from "./(components)/MemberDashboard";
import GroupClass from "./(components)/GroupClass";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Members() {
  const data = await auth.api.getSession({
    headers: await headers()
  })

  if (!data?.session) {
    return <div className="text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Not Authorized. Please sign in to access your account.</div>;
  }

  const { user } = data;
  if (!user) {
    return <div className="text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">User not found.</div>;
  }

  const member = await getMember(data.user.id);
  if (!member) {
    return <div
      className="text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">Member not found. </div>;
  }

  const sessions = await getSessions();



  return (
    <>
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
