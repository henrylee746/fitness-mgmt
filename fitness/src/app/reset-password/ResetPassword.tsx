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

export const ResetPasswordForm = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const formSchema = z
    .object({
      password: z
        .string()
        .min(8)
        .max(100, { message: "Password must be between 8 and 100 characters" }),
      confirmPassword: z
        .string()
        .min(8)
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // BetterAuth appends ?token=<value> to the reset URL in the email link
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      toast.error("Invalid token");
      return;
    }

    await authClient.resetPassword(
      { newPassword: data.password, token },
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

  if (session) {
    return (
      <div className="text-center text-2xl min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
        You are already logged in as {session.user?.name}
      </div>
    );
  }

  return (
    <div>
      <h1>Reset Password</h1>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          type="password"
          placeholder="Password"
          {...form.register("password")}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          {...form.register("confirmPassword")}
        />
        <Button type="submit">
          Reset Password {form.formState.isSubmitting ? <Loader /> : null}
        </Button>
      </form>
    </div>
  );
};
