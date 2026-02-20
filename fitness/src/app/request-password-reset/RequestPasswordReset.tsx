"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export const RequestPasswordResetForm = () => {
  const [message, setMessage] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await authClient.requestPasswordReset(
      { email: data.email, redirectTo: "/reset-password" },
      {
        onSuccess: () => {
          //BetterAuth won't send the email to nonexistent users, so we don't need to check for that here
          setMessage(
            "Reset email sent! If an account exists with this email, you will receive a password reset link in your inbox.",
          );
          toast.info("If you don't see the email, check your spam folder.");
          form.reset();
        },
        onError: (error) => {
          form.setError("root.serverError", {
            message: error.error.message || "Something went wrong",
          });
        },
      },
    );
  };

  if (session) {
    return (
      <div className="text-center text-2xl min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
        <span className="flex flex-col gap-2">
          You are already logged in as {session.user?.name}
        </span>
        <span className="flex gap-2">
          If you want to update your password, you can do so{" "}
          <Link href="/account" className="text-primary underline">
            here
          </Link>
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center p-6">
      <h1
        className="font-black uppercase leading-none text-foreground text-center"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
        }}
      >
        Request a password reset
      </h1>
      <p className="text-xs text-muted-foreground tracking-wider uppercase py-4 text-center">
        Enter your email to request a password reset (expires in 1 hour)
      </p>
      <p className="text-xs text-muted-foreground tracking-wider uppercase pb-4 text-center">
        Signed up with Google? You can still request a reset to add
        email/password to your account.
      </p>

      {message && (
        <p className="flex items-center gap-2 text-green-500 text-xs tracking-wider uppercase py-4 text-center">
          <CheckCircleIcon className="size-4" />
          {message}
        </p>
      )}

      <form
        className="flex flex-col gap-4 sm:min-w-sm mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {form.formState.errors.email && (
          <p className="text-xs text-destructive text-center">
            {form.formState.errors.email.message}
          </p>
        )}
        {form.formState.errors?.root?.serverError && (
          <p className="text-xs text-destructive text-center">
            {form.formState.errors?.root?.serverError?.message}
          </p>
        )}
        <Input
          type="email"
          placeholder="Email"
          {...form.register("email")}
          className="max-w-sm mx-auto"
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="cursor-pointer max-w-fit mx-auto"
        >
          Request Password Reset
          {form.formState.isSubmitting ? <Loader /> : null}
        </Button>
      </form>
    </div>
  );
};
