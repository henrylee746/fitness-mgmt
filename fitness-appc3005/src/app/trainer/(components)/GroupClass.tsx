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
  /*Querying so that all list of sessions are displayed before 
  filtering by trainer
  Filters sessions with dates only greater than or equal to (gte) today
  */
  const sessions = await prisma.session.findMany({
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
  });

  //Querying so that select dropdown has all list of trainers
  const trainers = await prisma.trainer.findMany();

  return (
    <Card className="w-full xl:max-w-3xl lg:max-w-2xl md:max-w-lg sm:max-w-md">
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
}
