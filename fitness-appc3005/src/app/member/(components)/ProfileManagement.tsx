"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconUserScan } from "@tabler/icons-react";
import { updateMember, updateMetrics } from "@/lib/actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Helper: Transform empty strings to undefined, then validate
const optionalString = z.string().transform(val => val.trim() === "" ? undefined : val).optional();
const optionalEmail = z.string().transform(val => val.trim() === "" ? undefined : val)
  .refine(val => val === undefined || z.email().safeParse(val).success, {
    message: "Invalid email address",
  }).optional();

const formSchema = z.object({
  firstName: optionalString,
  lastName: optionalString,
  email: optionalEmail,
});
type FormData = z.infer<typeof formSchema>;

const fitnessFormSchema = z.object({
  currWeight: z.number().min(1, { message: "Current weight is required" }).max(500, { message: "Current weight must be less than 500" }),
  weightTarget: z.number().min(1, { message: "Weight target is required" }).max(500, { message: "Weight target must be less than 500" }),
});
type FitnessFormData = z.infer<typeof fitnessFormSchema>;


export default function ProfileManagement({ userId, memberId }: { userId: string, memberId: number }) {

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
    },
    mode: "onSubmit",
  });

  const fitnessForm = useForm<FitnessFormData>({
    resolver: zodResolver(fitnessFormSchema),
    defaultValues: {
      currWeight: 0,
      weightTarget: 0,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: FormData) => {
    if (!data.email && !data.firstName && !data.lastName) {
      return;
    }
    const formData = new FormData();
    formData.append("userId", userId);
    // Only append fields that have values (since they're optional)
    if (data.email) formData.append("email", data.email);
    if (data.firstName) formData.append("firstName", data.firstName);
    if (data.lastName) formData.append("lastName", data.lastName);

    try {
      await updateMember(formData);
    } catch (error) {
      console.error(error);
    }
    form.reset();
  };

  const onFitnessSubmit = async (data: FitnessFormData) => {
    const formData = new FormData();
    formData.append("memberId", String(memberId));
    formData.append("currWeight", data.currWeight.toString());
    formData.append("weightTarget", data.weightTarget.toString());
    try {
      await updateMetrics(formData);
    } catch (error) {
      console.error(error);
    }
    fitnessForm.reset();
  };

  return (
    <Card className="w-full xl:max-w-xl lg:max-w-md max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Profile Management
          <IconUserScan />
        </CardTitle>
        <CardDescription>Update your details/fitness goals</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/*Hidden Input to retrieve memberId, so we know each member to update details*/}
          <input type="hidden" name="userId" value={userId} />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>All fields optional.</CardDescription>
            </div>

            <Input {...form.register("email")} id="email" type="email" name="email" placeholder="Email" />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
            <Input
              {...form.register("firstName")}
              id="firstName"
              type="text"
              name="firstName"
              placeholder="First Name"
            />
            {form.formState.errors.firstName && (
              <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>
            )}
            <Input
              {...form.register("lastName")}
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Last Name"
            />
            {form.formState.errors.lastName && (
              <p className="text-xs text-red-500">{form.formState.errors.lastName.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full mt-4 cursor-pointer" variant="secondary">
            Update
          </Button>
        </form>
        <form onSubmit={fitnessForm.handleSubmit(onFitnessSubmit)}>
          <input type="hidden" name="memberId" value={memberId} />
          <div className="flex flex-col gap-4 my-4">
            <div className="flex flex-col gap-2">
              <CardTitle>Fitness Details</CardTitle>
              <CardDescription>All fields required.</CardDescription>
            </div>
            <Label htmlFor="currWeight">Current Weight</Label>
            <Input
              {...fitnessForm.register("currWeight")}
              id="currWeight"
              type="number"
              name="currWeight"
              placeholder="e.g. 156"
              required={true}
            />
            {fitnessForm.formState.errors.currWeight && (
              <p className="text-xs text-red-500">{fitnessForm.formState.errors.currWeight.message}</p>
            )}
            <Label htmlFor="weightTarget"> Weight Target (lbs)</Label>
            <Input
              {...fitnessForm.register("weightTarget")}
              id="weightTarget"
              type="number"
              name="weightTarget"
              placeholder="e.g. 150"
              required={true}
            />
            {fitnessForm.formState.errors.weightTarget && (
              <p className="text-xs text-red-500">{fitnessForm.formState.errors.weightTarget.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            Update
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col"></CardFooter>
    </Card>
  );
}
