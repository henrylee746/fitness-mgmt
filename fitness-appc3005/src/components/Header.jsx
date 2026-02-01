"use client";
import { Button } from "@/components/ui/button";
import { IconHome } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleTheme } from "./ui/toggle-theme";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

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
              <Button variant="outline">
                <FaUserCircle className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-2" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <hr />
              <DropdownMenuGroup className="mt-1">
                <Link href="/member">
                  <DropdownMenuItem>Profile </DropdownMenuItem>
                </Link>

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
