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
import { Loader } from "@/components/ui/loader";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useState } from "react";

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
  const { data: session, isPending } = authClient.useSession();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState(false);

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

  if (isPending) {
    return <Loader />;
  }

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
  );
};
