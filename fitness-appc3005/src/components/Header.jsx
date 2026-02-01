import { IconUserFilled } from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import { IconUserCog } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { IconHome } from "@tabler/icons-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleTheme } from "./ui/toggle-theme";
import Link from "next/link";

const Header = () => {
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
      <div className="flex sm:flgap-4 items-center">
        <Link href="/signup">
          <InteractiveHoverButton>Sign Up</InteractiveHoverButton>
        </Link>
        <Link href="/signin">
          <InteractiveHoverButton>Sign In</InteractiveHoverButton>
        </Link>
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
      </div>
    </div>
  );
};

export default Header;
