"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-gray-500">{error.message || "An unexpected error occurred."}</p>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
