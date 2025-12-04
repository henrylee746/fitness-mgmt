import { Button } from "@/components/ui/button";
import { IconUserFilled } from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import { IconUserCog } from "@tabler/icons-react";
import { IconHome } from "@tabler/icons-react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex py-6 flex-wrap items-center justify-center gap-4 text-base font-medium">
      <Link href="/">
        <Button size="lg" variant="link">
          <IconHome /> Home
        </Button>
      </Link>
      <Link href="/member">
        <Button size="lg" variant="link">
          <IconUser /> Members
        </Button>
      </Link>

      <Link href="/trainer">
        <Button size="lg" variant="link">
          <IconUserFilled /> Trainers
        </Button>
      </Link>

      <Link href="/admin">
        <Button size="lg" variant="link">
          <IconUserCog /> Administrative Staff
        </Button>
      </Link>
    </div>
  );
};

export default Header;
