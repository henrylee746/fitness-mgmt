export const dynamic = "force-dynamic";
import { AccountPage } from "./AccountPage";
import { SessionGuard } from "@/components/SessionGuard";
import { getSession } from "@/lib/actions";
import { unauthorized } from "next/navigation";
import { RoleSelect } from "./RoleSelect";
import { DeleteAccount } from "./DeleteAccount";

export default async function Account() {
  const session = await getSession();

  if (!session) unauthorized();

  return (
    <div className="h-full w-full">
      <SessionGuard />
      {/* Page header */}
      <div className="text-center space-y-2 mb-10 mt-6">
        <div className="inline-flex items-center gap-3 justify-center mb-2">
          <div className="h-px w-6 bg-primary/50" />
          <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-primary/70">
            Settings
          </span>
          <div className="h-px w-6 bg-primary/50" />
        </div>
        <h1
          className="font-black uppercase leading-none text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
          }}
        >
          Account Settings
        </h1>
        <p className="text-xs text-muted-foreground tracking-wider uppercase pt-1">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="flex flex-wrap gap-8 justify-center items-center">
        <AccountPage />
        <div className="flex flex-col gap-8">
          <RoleSelect userId={session.user.id} />
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
