"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  //Digest is a hash of the error message (can compare that hash in Vercel Dashboard)
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col gap-4 items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
