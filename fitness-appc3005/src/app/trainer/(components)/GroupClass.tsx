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

export default async function GroupClass() {
  try {
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
      prisma.trainer.findMany(),
    ]);

    return (
      <Card className="w-full xl:max-w-xl lg:max-w-md md:max-w-md  max-w-xs">
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
          <DataTable
            columns={sessionColumns}
            data={sessions}
            trainers={trainers}
          />
        </CardContent>
      </Card>
    );
  } catch (error) {
    return <div className="min-h-[80vh] flex flex-col gap-2 items-center justify-center p-6 text-center text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
      Failed to get sessions: ${error instanceof Error ? error.message : "Unknown error"} Please contact if the issue persists.
    </div>
  }
}
