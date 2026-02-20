import { Button } from "@/components/ui/button";
import Link from "next/link";

const AccountDeletedPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
      <h1 className="font-black uppercase leading-none text-foreground">
        Account Deleted
      </h1>
      <p className="text-sm text-muted-foreground">
        Your account has been successfully deleted.
      </p>
      <Button asChild>
        <Link href="/" className="cursor-pointer px-6">
          Go Home
        </Link>
      </Button>
    </div>
  );
};

export default AccountDeletedPage;
