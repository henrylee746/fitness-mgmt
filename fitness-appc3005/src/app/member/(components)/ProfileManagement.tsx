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

export default function ProfileManagement({ id }: { id: string[] }) {
  return (
    <Card className="w-full xl:max-w-2xl lg:max-w-lg md:max-w-sm sm:max-w-md max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Profile Management
          <IconUserScan />
        </CardTitle>
        <CardDescription>Update your details/fitness goals</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={updateMember}>
          {/*Hidden Input to retrieve memberId, so we know each member to update details*/}
          <input type="hidden" name="memberId" value={id[0]} />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>All fields optional.</CardDescription>
            </div>

            <Input id="email" type="email" name="email" placeholder="Email" />
            <Input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="First Name"
            />
            <Input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Last Name"
            />
          </div>
          <Button type="submit" className="w-full mt-4" variant="secondary">
            Update
          </Button>
        </form>
        <form action={updateMetrics}>
          <input type="hidden" name="memberId" value={id[0]} />
          <div className="flex flex-col gap-4 my-4">
            <div className="flex flex-col gap-2">
              <CardTitle>Fitness Details</CardTitle>
              <CardDescription>All fields required.</CardDescription>
            </div>
            <Label htmlFor="currWeight">Current Weight</Label>
            <Input
              id="currWeight"
              type="number"
              name="currWeight"
              placeholder="e.g. 156"
              required={true}
            />
            <Label htmlFor="weightTarget"> Weight Target (lbs)</Label>
            <Input
              id="weightTarget"
              type="number"
              name="weightTarget"
              placeholder="e.g. 150"
              required={true}
            />
          </div>
          <Button type="submit" className="w-full">
            Update
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col"></CardFooter>
    </Card>
  );
}
