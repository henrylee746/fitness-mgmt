import { redirect } from "next/navigation";
import { getMember, getSession } from "@/lib/actions";
import OnboardingForm from "./OnboardingForm";

export default async function Onboarding() {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  // If the user already has a Member record, they don't need onboarding
  const member = await getMember(session.user.id);
  if (member) {
    redirect("/member");
  }

  const nameParts = session.user.name?.split(" ") ?? [""];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <OnboardingForm
      userId={session.user.id}
      email={session.user.email}
      firstName={firstName}
      lastName={lastName}
    />
  );
}
