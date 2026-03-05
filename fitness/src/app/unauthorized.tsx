import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-[80vh] flex flex-col gap-4 items-center justify-center p-6 text-center">
      <div className="inline-flex items-center gap-3 justify-center">
        <div className="h-px w-8 bg-primary/50" />
        <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-primary/70">
          401
        </span>
        <div className="h-px w-8 bg-primary/50" />
      </div>
      <h1
        className="font-black uppercase leading-none text-foreground"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.2rem, 6vw, 4rem)",
        }}
      >
        Unauthorized
      </h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        You need to be signed in to access this page.
      </p>
      <Button asChild>
        <Link href="/signin">Sign in</Link>
      </Button>
    </div>
  );
}
