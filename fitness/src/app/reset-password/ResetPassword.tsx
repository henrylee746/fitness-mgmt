"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

export const ResetPasswordForm = () => {
  const { data: session } = authClient.useSession();

  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password must be between 8 and 100 characters" }),
      confirmPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password must be between 8 and 100 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  //User shouldn't be able to access this page directly,
  // so we check for the token in the URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      return;
    }
    setToken(token);
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // BetterAuth appends ?token=<value> from the reset email link
    await authClient.resetPassword(
      { newPassword: data.password, token: token ?? undefined },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          form.reset();
          router.push("/signin");
        },
        onError: (error) => {
          form.setError("root.serverError", {
            message: error.error.message || "Something went wrong",
          });
        },
      },
    );
  };

  if (!token || !isMounted) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center p-6">
        <h1 className="font-black uppercase leading-none text-foreground text-center my-4">
          Invalid token
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          The password reset link is invalid or has expired. Please request a
          new password reset.
        </p>
        <Button
          onClick={() => router.push("/request-password-reset")}
          className="mt-4"
        >
          Request a new password reset
        </Button>
      </div>
    );
  }

  if (session) {
    return (
      <div className="text-center text-2xl min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
        You are already logged in as {session.user?.name}
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center p-6">
      <h1
        className="font-black uppercase leading-none text-foreground text-center my-4"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
        }}
      >
        Reset your password
      </h1>
      <form
        className="flex flex-col gap-4 sm:min-w-sm mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <InputGroup>
          <InputGroupInput
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...form.register("password")}
          />
          <InputGroupAddon align="inline-end">
            {showPassword ? (
              <EyeOffIcon
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeIcon
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </InputGroupAddon>
        </InputGroup>
        {form.formState.errors?.password && (
          <p className="text-xs text-destructive">
            {form.formState.errors?.password?.message}
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
        {form.formState.errors?.confirmPassword && (
          <p className="text-xs text-destructive">
            {form.formState.errors?.confirmPassword?.message}
          </p>
        )}
        <Button type="submit" className="cursor-pointer max-w-fit mx-auto">
          Reset Password {form.formState.isSubmitting ? <Loader /> : null}
        </Button>
      </form>
    </div>
  );
};
