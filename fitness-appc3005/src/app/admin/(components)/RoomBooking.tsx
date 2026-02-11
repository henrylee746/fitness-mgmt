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
    <Card className="w-full xl:max-w-xl sm:max-w-md max-w-xs">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Room Booking
          <IconDoor />
        </CardTitle>
        <CardDescription>
          Book different rooms for the following class sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={sessionColumns} data={sessions} />
      </CardContent>
    </Card>
  );
}
