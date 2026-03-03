import { AccountPage } from "./AccountPage";
import { SessionGuard } from "@/components/SessionGuard";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function Account() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <SessionGuard />
      <AccountPage />
    </div>
  );
}
