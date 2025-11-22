"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Header from "../../components/Header";
import { IconCalendarUser, IconZoom } from "@tabler/icons-react";
import { DataTable } from "./data-table";
import { sessionColumns, Session } from "./columns";
import { useState, useEffect } from "react";
import { IconZoomCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    getSessions().then(setSessions);
  }, []);

  return (
    <div className="dark min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <h1 className="max-w-s mb-4 text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Trainers
      </h1>
      <div className="flex w-full gap-4 flex-wrap justify-center items-center items-stretch">
        <Card className="w-full lg:max-w-md md:max-w-md sm:max-w-sm">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              Upcoming Group Classes
              <IconCalendarUser />
            </CardTitle>
            <CardDescription>
              Filter by trainer using the dropdown below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={sessionColumns} data={sessions} />
          </CardContent>
        </Card>
        <Card className="w-full lg:max-w-md md:max-w-md sm:max-w-sm">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              Member Search
              <IconZoomCheck />
            </CardTitle>
            <CardDescription>
              Search members by name (case-insensitive) to view their current
              weight goal and lastly measured weight.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-sm items-center gap-2">
              <Input type="text" placeholder="Henry Lee" />
              <Button type="submit" variant="outline">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
