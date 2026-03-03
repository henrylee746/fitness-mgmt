"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconUser } from "@tabler/icons-react";
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
    <Card className="w-full xl:max-w-xl sm:max-w-lg max-w-xs">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="font-black uppercase tracking-wide text-2xl leading-none"
          >
            Role Select
          </span>
          <IconUser className="text-primary" />
        </CardTitle>
        <CardDescription className="text-xs tracking-wider uppercase">
          Select a role to see their features
        </CardDescription>
      </CardHeader>
      <CardContent>
        {form.formState.errors.root?.serverError && (
          <p className="text-center mb-4 text-red-500 text-sm">
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
                required={true}
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
                  <ul className="text-xs font-base tracking-widest leading-6 uppercase list-disc list-inside text-sm tracking-wider text-foreground text-center">
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
                  <ul className="text-xs font-base tracking-widest uppercase leading-6 list-disc list-inside text-sm tracking-wider text-foreground text-center">
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
            className="rounded-none font-bold tracking-widest uppercase cursor-pointer mt-4"
            disabled={form.formState.isSubmitting}
          >
            Update Role
            {form.formState.isSubmitting ? <Loader /> : null}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
