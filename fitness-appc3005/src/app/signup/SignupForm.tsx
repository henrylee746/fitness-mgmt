"use client";
import React, { useState, useRef } from "react";
import { LuUser, LuMail, LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { SiGoogle } from "react-icons/si";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { registerMember } from "@/lib/actions";
import { Loader } from "@/components/ui/loader";
import Verify from "./Verify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RoleRadioGroup } from "./RoleRadioGroup";

const UserIcon: React.FC = () => <LuUser size={16} />;

const MailIcon: React.FC = () => <LuMail size={16} />;

const LockIcon: React.FC = () => <LuLock size={16} />;

const EyeIcon: React.FC = () => <LuEye size={16} />;

const EyeOffIcon: React.FC = () => <LuEyeOff size={16} />;

const GoogleIcon: React.FC = () => <SiGoogle size={16} />;

// Floating Label Input Component
interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  inputValue: string;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  ref?: React.Ref<HTMLInputElement>;
}

const FloatingLabelInput = ({
  id,
  type,
  placeholder,
  icon,
  inputValue,
  rightIcon,
  onRightIconClick,
  onBlur,
  onFocus,
  ref,
  ...props
}: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within:text-foreground">
        {icon}
      </div>
      <input
        ref={ref}
        id={id}
        type={type}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
          //Call the onFocus prop if it exists (other onFocus overrides this)
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
          //Call the onBlur prop if it exists (other onBlur overrides this)
        }}
        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 peer placeholder-transparent"
        placeholder={placeholder}
        style={
          {
            "--tw-ring-color": "hsl(var(--ring))",
          } as React.CSSProperties
        }
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-10 transition-all duration-200 pointer-events-none text-sm font-medium ${isFocused || inputValue
          ? "-top-2 text-xs bg-white dark:bg-black px-2 text-foreground rounded-sm"
          : "top-2.5 text-muted-foreground"
          }`}
      >
        {placeholder}
      </label>
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  role: z.enum(["member", "trainer", "admin"], { message: "Invalid role" }), //Must match one of the values in here
});

type FormData = z.infer<typeof formSchema>;

// Main Component with shadcn/ui styling
const SignupForm: React.FC = () => {

  //Get session from Better Auth in case user is signed in and tries to access signup page
  const { data: session } = authClient.useSession();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "member",
    },
    mode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (data: FormData) => {
    await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`,
      callbackURL: "/member", // Redirect here after email verification
    }, {
      onRequest: () => {
        form.clearErrors();
      },
      onSuccess: async (response) => {
        // 2. Register as a Member in the fitness app
        const formData = new FormData();
        formData.append("userId", response.data?.user.id || ""); // Pass userId from Better Auth
        formData.append("email", data.email);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("role", data.role);
        try {
          await registerMember(formData);
          // 3. Redirect to member page after successful signup
          toast.info(`Please check your email for a verification link.`);
          setVerificationSent(true);
        } catch (error: unknown) {
          form.setError("root.serverError", {
            message: error instanceof Error ? error.message : "Failed to register member",
          });
        }
      },
      onError: (ctx) => {
        form.setError("root.serverError", { message: ctx.error.message || "Something went wrong" });
      },
    });
  };

  const handleGoogleSubmit = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/member",
    });
  };

  if (verificationSent) {
    return <Verify email={form.getValues("email")} />;
  }

  if (session) {
    return <div className="min-h-[80vh] flex items-center justify-center p-6 font-bold text-center mb-6 text-red-500 text-sm">You are already logged in as {session.user?.name}</div>;
  }

  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="w-full relative">
          {/* Main Card with shadcn/ui styling */}
          <div
            ref={cardRef}
            className="relative bg-white dark:bg-zinc-900 border border-border rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            {/* Header */}
            <div className="flex flex-col space-y-2 text-center mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Become a member today
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details below to create your account
              </p>
            </div>
            {form.formState.errors.root?.serverError && (
              <p className="text-center mb-6 text-red-500 text-sm">{form.formState.errors.root.serverError.message}</p>
            )}

            <form className="space-y-4 " onSubmit={form.handleSubmit(handleSubmit)} noValidate>
              {/* First Name Input */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex flex-col gap-4 w-full max-w-sm">
                  <div className="space-y-2">
                    <FloatingLabelInput
                      id="firstName"
                      type="text"
                      {...form.register("firstName")}
                      inputValue={form.watch("firstName")}
                      placeholder="First Name"
                      icon={<UserIcon />}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <FloatingLabelInput
                      id="lastName"
                      type="text"
                      {...form.register("lastName")}
                      inputValue={form.watch("lastName")}
                      placeholder="Last Name"
                      icon={<UserIcon />}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-xs text-red-500">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <FloatingLabelInput
                      id="email"
                      type="email"
                      {...form.register("email")}
                      inputValue={form.watch("email")}
                      placeholder="Email"
                      icon={<MailIcon />}
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <FloatingLabelInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                      inputValue={form.watch("password")}
                      placeholder="Password"
                      icon={<LockIcon />}
                      rightIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      onRightIconClick={togglePasswordVisibility}
                    />
                    {form.formState.errors.password && (
                      <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Divider */}
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="text-center bg-zinc-100 dark:bg-zinc-900 px-2 text-muted-foreground">
                        Choose your role (Everyone is a member by default)
                      </span>
                    </div>
                  </div>
                  <RoleRadioGroup control={form.control} />

                </div>
                {/* Submit Button */}
              </div>

              <div className="flex items-center justify-center w-full mt-8">
                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="cursor-pointer inline-flex gap-4 items-center justify-center
                 whitespace-nowrap rounded-md text-sm font-medium 
                 ring-offset-background transition-colors focus-visible:outline-none 
                 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground 
                 hover:bg-primary/90 h-10 px-4 py-2 w-[75%]"
                >
                  Create Account
                  {form.formState.isSubmitting ? <Loader /> : null}
                </button>
              </div>
            </form>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-100 dark:bg-zinc-900 px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                onClick={handleGoogleSubmit}
              >
                <GoogleIcon />
                <span className="ml-2 p-2">Google</span>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Sign in
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupForm;