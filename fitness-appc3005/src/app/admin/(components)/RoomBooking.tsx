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
import { SessionExtended } from "@/lib/types";
import { DataTable } from "./data-table";

export default function RoomBooking({
  sessions,
}: {
  sessions: SessionExtended[];
}) {
  return (
    <Card className="w-full xl:max-w-3xl lg:max-w-2xl md:max-w-2xl sm:max-w-md">
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
