"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export const RequestPasswordResetForm = () => {
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
          toast.success(
            "Password reset email sent. Check your email. Reset link expires in 1 hour.",
          );
          toast.info(
            "If you don't see the email, check your spam folder, or register with this email address if you haven't already.",
          );
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
        You are already logged in as {session.user?.name}
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
        Reset your password
      </h1>
      <p className="text-xs text-muted-foreground tracking-wider uppercase py-4 text-center">
        Enter your email to reset your password
      </p>

      {/* action serves as an HTML fallback; onSubmit handles submission when JS is available */}
      <form
        className="flex flex-col gap-4 w-full"
        action="/reset-password"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <Input type="email" placeholder="Email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Reset Password
          {form.formState.isSubmitting ? <Loader /> : null}
        </Button>
      </form>
    </div>
  );
};
