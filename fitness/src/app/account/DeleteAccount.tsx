"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const DeleteAccount = () => {
  const { data: session } = authClient.useSession();
  const [isCredentialUser, setIsCredentialUser] = useState<boolean | null>(
    null,
  );
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDialogOpen = async (open: boolean) => {
    if (!open) {
      setDeletePassword("");
      return;
    }

    //Lists all accounts associated with the user
    const { data: accounts } = await authClient.listAccounts();
    //Checks if the user has a credential account
    setIsCredentialUser(
      accounts?.some((a) => a.providerId === "credential") ?? false,
    );
  };

  return (
    <div className="relative w-full mb-6 max-w-xl p-6 space-y-4 bg-card text-card-foreground border border-destructive/50 shadow-lg hover:border-destructive transition-colors duration-200">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-destructive" />
      <div className="text-center space-y-1">
        <h2
          className="font-black uppercase leading-none text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
          }}
        >
          Delete Account
        </h2>
        <p className="text-xs text-muted-foreground tracking-wider uppercase">
          Permanently removes all your data.
        </p>
        <p className="text-xs text-destructive/80 tracking-wider uppercase">
          This action is irreversible.
        </p>
      </div>

      <Dialog onOpenChange={handleDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="w-full cursor-pointer rounded-none text-sm font-bold tracking-widest uppercase hover:text-black"
            variant="destructive"
          >
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action is irreversible and will permanently remove all your
              data.
            </DialogDescription>
          </DialogHeader>

          {isCredentialUser === null ? (
            <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
              <Loader /> Loading...
            </div>
          ) : isCredentialUser ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Enter your password, then check your email for a confirmation
                link to complete deletion.
              </p>
              <Input
                type="password"
                placeholder="Your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting || deletePassword.length < 8}
                className="cursor-pointer rounded-none font-bold tracking-widest uppercase hover:text-black"
                onClick={async () => {
                  setIsDeleting(true);
                  await authClient.deleteUser(
                    {
                      password: deletePassword,
                      callbackURL: "/account-deleted",
                    },
                    {
                      onSuccess: () => {
                        toast.info("Check your email for the deletion link.");
                        setIsDeleting(false);
                      },
                      onError: (error) => {
                        toast.error(error.error.message);
                        setIsDeleting(false);
                      },
                    },
                  );
                }}
              >
                {isDeleting ? <Loader /> : "Confirm Delete"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                A verification link will be sent to{" "}
                <span className="font-medium text-foreground">
                  {session?.user?.email}
                </span>
                . Click it to confirm deletion.
              </p>
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                className="cursor-pointer rounded-none font-bold tracking-widest uppercase hover:text-black"
                onClick={async () => {
                  setIsDeleting(true);
                  await authClient.deleteUser(
                    { callbackURL: "/account-deleted" },
                    {
                      onSuccess: () => {
                        toast.info("Check your email for the deletion link.");
                        setIsDeleting(false);
                      },
                      onError: (error) => {
                        toast.error(error.error.message);
                        setIsDeleting(false);
                      },
                    },
                  );
                }}
              >
                {isDeleting ? <Loader /> : "Send Verification Email"}
              </Button>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer rounded-none font-bold tracking-widest uppercase"
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
