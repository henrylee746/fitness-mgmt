import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col gap-4 items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        404 - Page Not Found
      </h2>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
