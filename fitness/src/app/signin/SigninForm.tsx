"use client";
import React, { useState } from "react";
import { LuUser, LuEye, LuEyeOff } from "react-icons/lu";
import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const UserIcon = () => (
  <span className="h-5 w-5 text-muted-foreground inline-flex items-center">
    <LuUser size={20} />
  </span>
);

const EyeIcon = () => (
  <span className="h-4 w-4 text-muted-foreground inline-flex items-center">
    <LuEye size={16} />
  </span>
);

const EyeOffIcon = () => (
  <span className="h-4 w-4 text-muted-foreground inline-flex items-center">
    <LuEyeOff size={16} />
  </span>
);

const GoogleIcon = () => (
  <span className="h-5 w-5 inline-flex items-center">
    <FaGoogle size={20} />
  </span>
);

// Form schema for validation
const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type FormData = z.infer<typeof formSchema>;

// --- Main App Component ---
export default function Login() {
  const { data: session } = authClient.useSession();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onRequest: () => {
          form.clearErrors();
        },
        onSuccess: (response) => {
          toast.success(`Welcome back, ${response.data?.user.name}`);
          router.push("/member");
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

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/member",
        //Redirect to onboarding page if user is new
        newUserCallbackURL: "/onboarding",
      },
      {
        onRequest: () => {
          form.clearErrors();
        },
        onError: (ctx) => {
          form.setError("root.serverError", {
            message: ctx.error.message || "Something went wrong",
          });
        },
      },
    );
  };

  if (session) {
    return (
      <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-foreground">
        You are already logged in as {session.user?.name}
      </div>
    );
  }

  return (
    // Main container with a custom background pattern and flexbox for centering. This setup is inherently responsive.
    <div className="min-h-[80vh] p-6 relative w-full flex items-center justify-center font-sans overflow-hidden">
      {/* Login Card - More compact and shadcn-like */}
      <div className="relative w-full max-w-sm p-6 space-y-6 bg-card text-card-foreground rounded-none border shadow-lg hover:border-primary/40 transition-colors duration-200">
        {/* Sharp top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
        <div className="text-center space-y-3 mt-2">
          <div className="flex flex-col space-y-1 text-center mb-6 mt-2">
            <div className="inline-flex items-center gap-3 justify-center mb-2">
              <div className="h-px w-6 bg-primary/50" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-primary/70">
                Login
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
              Welcome back
            </h1>
            <p className="text-xs text-muted-foreground tracking-wider uppercase pt-1">
              Enter your details below to login to your account
            </p>
          </div>
        </div>
        {form.formState.errors.root?.serverError && (
          <p className="text-center my-6 text-destructive text-sm max-w-sm">
            {form.formState.errors.root.serverError.message}
          </p>
        )}
        {/* Social login buttons - More compact shadcn style */}
        <div className="flex justify-center items-center">
          <button
            onClick={handleGoogleSignIn}
            className="cursor-pointer flex items-center justify-center h-9 px-3 rounded-none border bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span className="flex items-center gap-2">
              <GoogleIcon />
              Google
            </span>
          </button>
        </div>

        {/* OR Divider - More subtle */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground tracking-widest uppercase text-xs">
              Or continue with
            </span>
          </div>
        </div>

        {/* Form - Shadcn style */}
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex flex-col gap-0.3 space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-bold tracking-widest uppercase text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...form.register("email")}
              placeholder="name@example.com"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-5 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-0.3 space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-bold tracking-widest uppercase text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...form.register("password")}
                placeholder="Enter your password"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-5 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[30%] text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="cursor-pointer inline-flex gap-4 items-center justify-center whitespace-nowrap rounded-none text-sm font-bold tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
          >
            Sign In
            {form.formState.isSubmitting ? <Loader /> : null}
          </button>
        </form>

        {/* Footer links - More compact */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
            >
              Sign up
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Forgot your password?{" "}
            <Link
              href="/request-password-reset"
              className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
            >
              Reset password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
