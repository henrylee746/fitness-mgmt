import { ResetPasswordForm } from "./ResetPassword";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions";

export default async function ResetPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect("/member");
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <ResetPasswordForm />
    </div>
  );
}
