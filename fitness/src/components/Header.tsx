"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HeaderDock } from "./Dock";
import { getActiveMemberRole } from "@/lib/actions";
import { useState, useEffect } from "react";
import { CircleUserRoundIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  //useSession triggers on window focus (or page refresh)
  const { data: session, isPending, error } = authClient.useSession();
  const [role, setRole] = useState<string | undefined | null>(undefined);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await getActiveMemberRole();
        setRole(role);
      } catch (error) {
        toast.error(
          `Failed to fetch role: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    };
    if (session) {
      fetchRole();
    }
  }, [session]);

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
    <div className="bg-background/50 backdrop-blur-sm border-b border-border/50 flex flex-col sm:flex-row px-4 py-4 flex-wrap items-center justify-between gap-4 text-base font-medium">
      <HeaderDock role={role} session={session?.user ?? undefined} />
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        {!isPending && session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer size-9 rounded-full border-2 border-primary overflow-hidden flex items-center justify-center bg-muted text-muted-foreground text-sm font-semibold">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user?.name ?? "avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  session.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem asChild>
                <Link href="/account" className="flex items-center gap-2">
                  <CircleUserRoundIcon />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOutIcon className="size-4" />
                <p className="text-sm font-medium">Sign Out</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
