"use client";
import { Button } from "@/components/ui/button";
import { IconHome } from "@tabler/icons-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleTheme } from "./ui/toggle-theme";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const Header = () => {
  const { data: session, isPending, error } = authClient.useSession();
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="flex flex-col sm:flex-row py-6 flex-wrap items-center justify-between gap-4 mr-4 text-base font-medium">
      <div className="flex items-center ml-2">
        <ToggleTheme
          duration={600}
          animationType="swipe-up"
          className="mx-auto"
        />
        <Link href="/" className="flex items-center gap-2 hover:text-gray-500">
          <Button variant={"link"}>
            <div className="flex items-center gap-2">
              <IconHome className="size-6" />
              <span className="text-xl">Home</span>
            </div>
          </Button>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        {!isPending && session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  Log Out
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/signup">
            <InteractiveHoverButton>Sign Up</InteractiveHoverButton>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
