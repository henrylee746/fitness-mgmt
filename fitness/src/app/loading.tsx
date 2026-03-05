import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex justify-center gap-2 items-center w-screen h-full [--radius:1rem] mt-48 sm:mt-96">
      <p className="text-muted-foreground">Loading..</p>
      <Loader className="size-6" />
    </div>
  );
}
