import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { sessionColumns } from "./columns";
import { IconCalendarUser } from "@tabler/icons-react";
import { DataTable } from "./data-table";
import prisma from "@/lib/prisma";

export const GroupClass = async () => {
  /*Querying so that all list of sessions are displayed before
  filtering by trainer
  Filters sessions with dates only greater than or equal to (gte) today
  */
  const [sessions, trainers] = await Promise.all([
    prisma.classSession.findMany({
      where: {
        dateTime: {
          gte: new Date(),
        },
      },
      include: {
        //Joins with room and trainer tables
        room: true,
        trainer: true,
      },
    }),
    prisma.trainer.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return (
    <Card className="w-full xl:max-w-xl md:max-w-lg max-w-xs">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="font-black uppercase tracking-wide text-2xl leading-none"
          >
            Upcoming Group Classes
          </span>
          <IconCalendarUser className="text-primary" />
        </CardTitle>
        <CardDescription className="text-xs tracking-wider uppercase">
          Filter by trainer using the dropdown below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={sessionColumns}
          data={sessions}
          trainers={trainers}
        />
      </CardContent>
    </Card>
  );
};
