"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCalendarUser } from "@tabler/icons-react";
import { DataTable } from "./data-table";
import { sessionColumns } from "./columns";
import {
  MemberWithBookingsAndMetrics,
  ClassSessionWithRoomAndTrainer,
} from "@/lib/types";
import { registerSessions } from "@/lib/actions";
import { useState, useActionState } from "react";
import { Booking } from "@/lib/types";
import { Loader } from "@/components/ui/loader";

export const GroupClass = ({
  sessions,
  member,
}: {
  sessions: ClassSessionWithRoomAndTrainer[];
  member: MemberWithBookingsAndMetrics | null;
}) => {
  /*Filters only sessions that the member has not registered for yet*/
  const sessionIds = member
    ? member.bookings.map((booking: Booking) => booking.classSessionId)
    : [];
  const filteredSessions = sessions.filter(
    (session) => !sessionIds.includes(session.id),
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [state, formAction, isPending] = useActionState(registerSessions, {
    success: true,
  });

  return (
    <Card className="w-full xl:max-w-2xl lg:max-w-lg md:max-w-md sm:max-w-md sm:max-w-sm max-w-xs">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="font-black uppercase tracking-wide text-2xl leading-none"
          >
            Group Class Registration
          </span>
          <IconCalendarUser className="text-primary" />
        </CardTitle>
        <CardDescription className="text-xs tracking-wider uppercase">
          Register for upcoming group sessions here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={sessionColumns}
          data={filteredSessions}
          onSelectionChange={(selected: string[]) => setSelectedIds(selected)}
        />
        <form action={formAction}>
          {selectedIds.map((id) => (
            <input key={id} type="hidden" name="sessionIds" value={id} />
          ))}
          <input type="hidden" name="memberId" value={String(member?.id)} />
          {!state.success && state.error && (
            <p className="text-xs text-red-500 mt-2">{state.error}</p>
          )}
          <Button
            className="w-full mt-6 cursor-pointer rounded-none font-bold tracking-widest uppercase"
            disabled={selectedIds.length === 0 || isPending}
          >
            {isPending ? <Loader /> : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
