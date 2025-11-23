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

export default function ProfileManagement() {
  return (
    <Card className="w-full lg:max-w-lg md:max-w-sm sm:max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Profile Management
          <IconUserScan />
        </CardTitle>
        <CardDescription>Update your details/fitness goals</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-4">
            <CardDescription>Personal Details</CardDescription>

            <Input id="email" type="email" placeholder="Email" />
            <Input id="firstName" type="text" placeholder="First Name" />
            <Input id="lastName" type="text" placeholder="Last Name" />
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <CardTitle>Fitness Details</CardTitle>
            <Label htmlFor="weightTarget"> Weight Target (lbs)</Label>
            <Input id="weightTarget" type="number" placeholder="e.g. 150" />
            <Label htmlFor="currWeight">Current Weight</Label>
            <Input id="currWeight" type="number" placeholder="e.g. 156" />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}
