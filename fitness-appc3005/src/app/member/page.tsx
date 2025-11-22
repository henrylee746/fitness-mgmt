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
import Header from "../../components/Header";
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
import { useState, useEffect } from "react";

async function getData(): Promise<Health[]> {
  return [
    {
      id: "728ed52f",
      date: new Date().toLocaleDateString("en-CA"),
      weight: 100,
      goal: 105,
      classes: 0,
      sessions: ["Yoga Class", "Upper Body PT"],
    },
  ];
}

async function getSessions(): Promise<Session[]> {
  return [
    {
      id: "728ed52f",
      date: new Date().toLocaleDateString("en-CA"),
      title: "Yoga Session",
      capacity: 50,
      trainer: "Coach Chris",
    },
    {
      id: "728edawr",
      date: new Date().toLocaleDateString("en-CA"),
      title: "Chest Day",
      capacity: 2,
      trainer: "Instructor Mary",
    },
  ];
}

export default function Member() {
  const [data, setData] = useState<Health[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [member, setMember] = useState("user1");

  useEffect(() => {
    getData().then(setData);
    getSessions().then(setSessions);
  }, []);

  return (
    <div className="dark min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <h1 className="max-w-s mb-4 text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Member's Hub
      </h1>
      <div className="flex gap-4">
        <Select
          defaultValue="user1"
          onValueChange={(value) => setMember(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a member" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Members</SelectLabel>
              <SelectItem value="user1">Henry Lee</SelectItem>
              <SelectItem value="user2">John Land</SelectItem>
              <SelectItem value="user3">Jane Doe</SelectItem>
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
        <Card className="w-full lg:max-w-md md:max-w-sm sm:max-w-sm">
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
          <Card className="w-full md:max-w-md lg:max-w-2xl sm:max-w-sm">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                Dashboard
                <IconDashboardFilled />
              </CardTitle>
              <CardDescription>
                Check your metrics and upcoming sessions here
              </CardDescription>
            </CardHeader>
            {data.length !== 0 ? (
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Date: {new Date().toLocaleDateString("en-CA")}
                </p>
                <p className="text-sm">Weight: {data[0].weight} lbs</p>
                <Separator className="my-4" />
                <div className="flex h-8 items-center space-x-4 text-xs lg:text-sm">
                  <div>Weight Goal: {data[0].goal} lbs</div>
                  <Separator orientation="vertical" />
                  <div>Classes Upcoming: {data[0].classes}</div>
                  <Separator orientation="vertical" />
                  <div>Upcoming Classes: {data[0].sessions.join(", ")}</div>
                </div>
              </CardContent>
            ) : (
              ""
            )}
            <CardFooter className="flex-col gap-2"></CardFooter>
          </Card>
          <Card className="w-full lg:max-w-2xl md:max-w-md sm:max-w-sm">
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
              <DataTable columns={sessionColumns} data={sessions} />
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
