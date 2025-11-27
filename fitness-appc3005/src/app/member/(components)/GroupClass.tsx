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
import { IconCalendarUser } from "@tabler/icons-react";
import { DataTable } from "./data-table";
import { sessionColumns } from "./columns";
import { Session } from "../[[...id]]/types";
import { registerSessions } from "@/lib/actions";
import { useState } from "react";

export default function GroupClass({
  sessions,
  member,
}: {
  sessions: Session[];
  member: any;
}) {
  /*Filters only sessions that the member has not registered for yet*/
  const sessionIds = member.bookings.map((booking: any) => booking.sessionId);
  const filteredSessions = sessions.filter(
    (session) => !sessionIds.includes(session.id)
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return (
    <Card className="w-full 2xl:max-w-5xl xl:max-w-xl lg:max-w-lg md:max-w-md sm:max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Group Class Registration <IconCalendarUser />
        </CardTitle>
        <CardDescription>
          Register for upcoming group sessions here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={sessionColumns}
          data={filteredSessions}
          onSelectionChange={(selected: string[]) => setSelectedIds(selected)}
        />
        <form action={registerSessions}>
          {selectedIds.map((id) => (
            <input key={id} type="hidden" name="sessionIds" value={id} />
          ))}
          <input type="hidden" name="memberId" value={String(member.id)} />
          <Button className="w-full mt-6">Register</Button>
        </form>
      </CardContent>
    </Card>
  );
}
