"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserAvatar } from "@daveyplate/better-auth-ui";
import { HeaderDock } from "./Dock";
import { getActiveMemberRole } from "@/lib/actions";
import { useState, useEffect, useMemo } from "react";

const Header = ({ initialRole }: { initialRole?: string | undefined }) => {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  const [role, setRole] = useState<string | undefined | null>(initialRole);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await getActiveMemberRole();
        setRole(role);
      } catch (error) {
        toast.error(`Failed to fetch role: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    };
    if (session) {
      fetchRole();
    }
  }, [initialRole, session]);


  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success(`Signed out successfully`);
        },
        onError: (error) => {
          toast.error(`Failed to sign out: ${error.error.message}`);
        },
      },
    });
  };


  return (
    <div className="bg-background/50 backdrop-blur-sm border-b border-border/50 flex flex-col sm:flex-row py-6 flex-wrap items-center justify-between gap-4 text-base font-medium">
      <HeaderDock role={role} session={session?.user ?? undefined} />
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        {!isPending && session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <UserAvatar user={session.user} className="p-5 mr-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
              <hr />
              <DropdownMenuGroup className="mt-1">
                <DropdownMenuItem onClick={handleSignOut}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
