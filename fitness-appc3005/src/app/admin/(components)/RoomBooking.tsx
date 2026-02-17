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

import { IconDoor } from "@tabler/icons-react";
import { sessionColumns } from "./columns";
import { ClassSessionExtended } from "@/lib/types";
import { DataTable } from "./data-table";

export default function RoomBooking({
  sessions,
}: {
  sessions: ClassSessionExtended[];
}) {
  return (
    <Card className="w-full xl:max-w-xl sm:max-w-lg max-w-xs">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <span style={{ fontFamily: "var(--font-display)" }} className="font-black uppercase tracking-wide text-2xl leading-none">
            Room Booking
          </span>
          <IconDoor className="text-primary" />
        </CardTitle>
        <CardDescription className="text-xs tracking-wider uppercase">
          Book different rooms for the following class sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={sessionColumns} data={sessions} />
      </CardContent>
    </Card>
  );
}
