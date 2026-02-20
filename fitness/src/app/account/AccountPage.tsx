"use client";
import { Separator } from "@/components/ui/separator";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const { data: session } = authClient.useSession();

  const [showNewPassword, setShowNewPassword] = useState(false);

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
      <div className="text-center text-2xl min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
        You are not logged in to view this page.
        <Link href="/signin">
          <Button className="mt-4 cursor-pointer px-6">Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full min-h-[80vh] justify-center items-center mt-4">
      <h1
        className="font-black uppercase leading-none text-foreground text-center my-2"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
        }}
      >
        Account Settings
      </h1>
      <h2 className="text-lg font-medium text-center text-muted-foreground">
        Manage your account settings and preferences.
      </h2>
      <Separator className="max-w-[75%] my-4" />
      <div className="flex flex-wrap gap-8 mt-4 p-4 justify-center items-center">
        <Card className="sm:min-w-sm">
          <CardHeader className="w-full">
            <CardTitle
              className="text-lg font-semibold text-center"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              }}
            >
              Update Password
            </CardTitle>
            <CardDescription className="text-xs tracking-wider uppercase text-center">
              Update your password to secure your account.
              <br />
              Please use 8 characters at minimum.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {form.formState.errors && (
              <p className="text-xs text-destructive">
                {form.formState.errors.root?.serverError?.message}
              </p>
            )}
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputGroup>
                <InputGroupInput
                  id="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  {...form.register("currentPassword")}
                />
              </InputGroup>
              {form.formState.errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
              <InputGroup>
                <InputGroupInput
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  {...form.register("newPassword")}
                />
                <InputGroupAddon align="inline-end">
                  {showNewPassword ? (
                    <EyeOffIcon
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="cursor-pointer"
                    />
                  ) : (
                    <EyeIcon
                      onClick={() => setShowNewPassword(!showNewPassword)}
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
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  {...form.register("confirmPassword")}
                />
              </InputGroup>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full mt-4 cursor-pointer"
                variant="secondary"
              >
                {form.formState.isSubmitting ? <Loader /> : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="sm:min-w-sm flex justify-center items-center">
          <CardHeader className="w-full">
            <CardTitle
              className="text-lg font-semibold text-center"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              }}
            >
              Delete Account
            </CardTitle>
            <CardDescription className="text-xs tracking-wider uppercase text-center">
              <p className="mb-2">
                Delete your account to permanently remove your data.{" "}
              </p>{" "}
              <p className="mt-2">
                This action is irreversible, so please be careful.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="submit"
              className="w-full mt-4 cursor-pointer hover:bg-destructive/30"
              variant="destructive"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
