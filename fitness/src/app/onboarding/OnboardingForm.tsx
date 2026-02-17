"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { registerMember } from "@/lib/actions";
import { authClient } from "@/lib/auth-client";
import { RoleRadioGroup } from "../signup/RoleRadioGroup";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

const formSchema = z.object({
  role: z.enum(["member", "trainer", "admin"], { message: "Invalid role" }),
});

type FormData = z.infer<typeof formSchema>;

interface OnboardingFormProps {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function OnboardingForm({ userId, email, firstName, lastName }: OnboardingFormProps) {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: "member" },
  });

  const handleSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("email", email);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("role", data.role);

    try {
      const organizationId = await registerMember(formData);
      if (organizationId) {
        //Invalidates session cache
        await authClient.organization.setActive({ organizationId });
      }
      router.push("/member");
    } catch (error) {
      form.setError("root.serverError", {
        message: error instanceof Error ? error.message : "Failed to register member",
      });
      toast.error(error instanceof Error ? error.message : "Failed to register member");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="relative bg-white dark:bg-zinc-900 border border-border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>
              Welcome, {firstName}!
            </h1>
           <p className="text-xs text-muted-foreground tracking-wider uppercase pt-1">
            Choose your role to get started
            </p>
          </div>

          {form.formState.errors.root?.serverError && (
            <p className="text-center mb-4 text-red-500 text-sm">
              {form.formState.errors.root.serverError.message}
            </p>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <RoleRadioGroup control={form.control} />

            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer inline-flex gap-4 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Continue
                {form.formState.isSubmitting ? <Loader /> : null}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
