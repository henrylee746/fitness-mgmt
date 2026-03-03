export const dynamic = "force-dynamic";
import { RequestPasswordResetForm } from "./RequestPasswordReset";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions";

export default async function RequestPasswordResetPage() {
  const session = await getSession();

  if (session) {
    redirect("/member");
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <RequestPasswordResetForm />
    </div>
  );
}
