"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { IconUserScan } from "@tabler/icons-react";
import { IconDashboardFilled } from "@tabler/icons-react";
import { IconCalendarUser } from "@tabler/icons-react";
import { DataTable } from "./data-table";
import { sessionColumns, Session, Health } from "./columns";

export default function MemberClientPage({ members }: any) {
  console.log(members);
  return (
    <div className="dark:bg-stone-950 h-full flex flex-col items-center justify-center bg-zinc-50 font-sans">
      <h1 className="max-w-s mb-4 text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Member's Hub
      </h1>
      <div className="flex gap-4">
        <Select defaultValue={members[0].firstName + members[0].lastName}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a member" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Members</SelectLabel>
              {members.map((member: any) => (
                <SelectItem
                  value={member.firstName + member.lastName}
                  key={member.firstName + member.lastName}
                >
                  {member.firstName + " " + member.lastName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="outline">Register New Member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Signup</DialogTitle>
                <DialogDescription>
                  Register as a new member here. Click "Save changes" when
                  you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="henrylee@example.com"
                  required
                />
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" required />

                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" required />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
      <div className="flex flex-wrap items-stretch items-center justify-center w-full mt-8 mb-4 gap-8">
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
        <div className="flex flex-col gap-6">
          <Card className="w-full xl:max-w-xl md:max-w-md lg:max-w-lg sm:max-w-sm">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                Dashboard
                <IconDashboardFilled />
              </CardTitle>
              <CardDescription>
                Check your metrics and upcoming sessions here
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-sm">
                Date: {new Date().toLocaleDateString("en-CA")}
              </p>
              <p className="text-sm">Weight: lbs</p>
              <Separator className="my-4" />
              <div className="flex h-8 items-center space-x-4 text-xs lg:text-sm">
                <div>Weight Goal: lbs</div>
                <Separator orientation="vertical" />
                <div>Classes Upcoming: </div>
                <Separator orientation="vertical" />
                <div>Upcoming Classes: </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2"></CardFooter>
          </Card>
          <Card className="w-full  2xl:max-w-2xl xl:max-w-xl lg:max-w-lg md:max-w-md sm:max-w-sm">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                Group Class Registration
                <IconCalendarUser />
              </CardTitle>
              <CardDescription>
                Register for upcoming group sessions here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/*<DataTable columns={sessionColumns}  />*/}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Register
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
