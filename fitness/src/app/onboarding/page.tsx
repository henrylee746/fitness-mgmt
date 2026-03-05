export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { isMember, getSession } from "@/lib/actions";
import { OnboardingForm } from "./OnboardingForm";
import { SessionGuard } from "@/components/SessionGuard";

export default async function Onboarding() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  // If the user already has a Member record, they don't need onboarding
  if (await isMember(session.user.id)) {
    redirect("/member");
  }

  const nameParts = session.user.name?.split(" ") ?? [""];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <>
      <SessionGuard />
      <OnboardingForm
        userId={session.user.id}
        email={session.user.email}
        firstName={firstName}
        lastName={lastName}
      />
    </>
  );
}
