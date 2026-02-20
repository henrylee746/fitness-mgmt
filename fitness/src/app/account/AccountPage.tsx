"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
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
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
//BetterAuth will check old password, so we don't need to check it here

export const AccountPage = () => {
  const { data: session } = authClient.useSession();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState(false);
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
    const { data: accounts } = await authClient.listAccounts();
    setIsCredentialUser(
      accounts?.some((a) => a.providerId === "credential") ?? false,
    );
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await authClient.changePassword(
      {
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          setUpdatedPassword(true);
          form.reset();
        },
        onError: (error) => {
          form.setError("root.serverError", { message: error.error.message });
        },
      },
    );
  };

  if (!session) {
    return (
      <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
        You are not logged in to view this page.
        <Link href="/signin">
          <Button className="mt-4 cursor-pointer px-6">Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center p-6 py-10">
      {/* Page header */}
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center gap-3 justify-center mb-2">
          <div className="h-px w-6 bg-primary/50" />
          <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-primary/70">
            Settings
          </span>
          <div className="h-px w-6 bg-primary/50" />
        </div>
        <h1
          className="font-black uppercase leading-none text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
          }}
        >
          Account Settings
        </h1>
        <p className="text-xs text-muted-foreground tracking-wider uppercase pt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 justify-center items-start w-full max-w-4xl">
        {/* Update Password card */}
        <div className="relative w-full max-w-xl p-6 space-y-4 bg-card text-card-foreground border shadow-lg hover:border-primary/40 transition-colors duration-200">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
          <div className="text-center space-y-1">
            <h2
              className="font-black uppercase leading-none text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
              }}
            >
              Update Password
            </h2>
            <p className="text-xs text-muted-foreground tracking-wider uppercase">
              Minimum 8 characters required.
            </p>
          </div>

          {form.formState.errors.root?.serverError && (
            <p className="text-xs text-destructive text-center">
              {form.formState.errors.root.serverError.message}
            </p>
          )}

          <form
            className="flex flex-col gap-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                Current Password
              </label>
              <InputGroup>
                <InputGroupInput
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  {...form.register("currentPassword")}
                />
              </InputGroup>
              {form.formState.errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                New Password
              </label>
              <InputGroup>
                <InputGroupInput
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...form.register("newPassword")}
                />
                <InputGroupAddon align="inline-end">
                  {showNewPassword ? (
                    <EyeOffIcon
                      onClick={() => setShowNewPassword(false)}
                      className="cursor-pointer"
                    />
                  ) : (
                    <EyeIcon
                      onClick={() => setShowNewPassword(true)}
                      className="cursor-pointer"
                    />
                  )}
                </InputGroupAddon>
              </InputGroup>
              {form.formState.errors.newPassword && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                Confirm Password
              </label>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  {...form.register("confirmPassword")}
                />
              </InputGroup>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2 cursor-pointer rounded-none text-sm font-bold tracking-widest uppercase"
              variant="secondary"
              disabled={updatedPassword || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loader /> : "Update Password"}
            </Button>
          </form>
        </div>

        {/* Delete Account card */}
        <div className="relative w-full max-w-xl p-6 space-y-4 bg-card text-card-foreground border border-destructive/50 shadow-lg hover:border-destructive transition-colors duration-200">
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
                  This action is irreversible and will permanently remove all
                  your data.
                </DialogDescription>
              </DialogHeader>

              {isCredentialUser === null ? (
                <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
                  <Loader /> Loading...
                </div>
              ) : isCredentialUser ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Enter your password, then check your email for a
                    confirmation link to complete deletion.
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
                            toast.info(
                              "Check your email for the deletion link.",
                            );
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
                      {session.user?.email}
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
                            toast.info(
                              "Check your email for the deletion link.",
                            );
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
      </div>
    </div>
  );
};
