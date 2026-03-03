"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateRole } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  role: z.enum(["admin", "trainer"], { message: "Invalid role" }),
});

type FormData = z.infer<typeof formSchema>;

export const RoleSelect = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: "admin" },
    mode: "onBlur",
  });

  const handleSubmit = async (data: FormData) => {
    form.clearErrors();
    try {
      const result = await updateRole(data.role, userId);
      if (!result?.success && result?.error) {
        form.setError("root.serverError", { message: result.error });
        toast.error(result.error);
        return;
      }
      toast.success("Role updated successfully");
      form.reset();
      if (data.role === "trainer") {
        router.push("/trainer");
      } else {
        router.push("/admin");
      }
    } catch (error: unknown) {
      form.setError("root.serverError", { message: "Failed to update role" });
    }
  };

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
          Role Select
        </h2>
        <p className="text-xs text-muted-foreground tracking-wider uppercase">
          Select a role to see their features
        </p>
      </div>

      {form.formState.errors.root?.serverError && (
        <p className="text-xs text-destructive text-center">
          {form.formState.errors.root.serverError.message}
        </p>
      )}

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <Controller
          control={form.control}
          name="role"
          render={({ field }) => (
            <RadioGroup
              className="flex gap-4 justify-between"
              defaultValue="admin"
              value={field.value}
              onValueChange={field.onChange}
            >
              <div className="flex flex-col gap-3 w-[50%]">
                <div className="flex items-center gap-3 justify-center">
                  <RadioGroupItem
                    value="admin"
                    id="admin"
                    className="text-primary"
                  />
                  <Label htmlFor="admin">Admin</Label>
                </div>
                <ul className="text-xs tracking-widest leading-6 uppercase list-disc list-inside tracking-wider text-foreground text-center">
                  <li>Create sessions</li>
                  <li>Assign rooms</li>
                  <li>And more soon...</li>
                </ul>
              </div>
              {/* Vertical Separator */}
              <div className="self-stretch w-px bg-primary/50" />
              {/* Trainer */}
              <div className="flex flex-col gap-3 w-[50%]">
                <div className="flex items-center gap-3 justify-center">
                  <RadioGroupItem value="trainer" id="trainer" />
                  <Label htmlFor="trainer">Trainer</Label>
                </div>
                <ul className="text-xs tracking-widest uppercase leading-6 list-disc list-inside tracking-wider text-foreground text-center">
                  <li>View member metrics</li>
                  <li>See trainer sessions</li>
                  <li>And more soon...</li>
                </ul>
              </div>
            </RadioGroup>
          )}
        />
        <Button
          type="submit"
          variant="secondary"
          className="w-full mt-2 cursor-pointer rounded-none text-sm font-bold tracking-widest uppercase"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Loader /> : "Update Role"}
        </Button>
      </form>
    </div>
  );
};
